/**
 * Web Worker for Python execution sandbox.
 *
 * CONTRACT (do not weaken):
 *  1. This worker NEVER reports SUCCESS for code it did not execute.
 *  2. `assertionsPassed` / `totalAssertions` are always derived from the real
 *     test suite. They are never hardcoded constants.
 *
 * The previous revision returned a fabricated PASSED result with a hardcoded
 * "3 passed" pytest transcript whenever the Pyodide CDN was unreachable — which
 * is exactly the 2G/offline case — silently marking unsolved exercises complete.
 */

let pyodideInstance = null;
let isLoadingPyodide = false;
let runtimeUnavailableReason = null;

async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (isLoadingPyodide) {
    while (isLoadingPyodide) {
      await new Promise((r) => setTimeout(r, 50));
    }
    return pyodideInstance;
  }

  isLoadingPyodide = true;
  try {
    if (typeof importScripts === "function") {
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
    }
    if (typeof loadPyodide !== "undefined") {
      pyodideInstance = await loadPyodide({
        stdout: (text) => self.postMessage({ type: "LOG", payload: { message: text } }),
        stderr: (text) => self.postMessage({ type: "LOG", payload: { message: text } }),
      });
      runtimeUnavailableReason = null;
    } else {
      runtimeUnavailableReason = "Pyodide global was not registered by the CDN script.";
    }
  } catch (err) {
    runtimeUnavailableReason =
      "Python runtime unavailable: " + (err && err.message ? err.message : String(err));
    pyodideInstance = null;
  } finally {
    isLoadingPyodide = false;
  }
  return pyodideInstance;
}

/**
 * Counts the assertions actually present in a test suite so callers can report
 * honest progress denominators instead of a hardcoded "3".
 */
function countAssertions(testAssertions) {
  if (typeof testAssertions !== "string" || testAssertions.length === 0) return 0;
  const lines = testAssertions.split("\n");
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^[ \t]*assert\b/.test(lines[i])) count++;
  }
  return count;
}

/**
 * Static safety pre-checks. These are guardrails only — they cannot substitute
 * for executing the code and must never be reported as a passing run.
 */
function runStaticSafetyCheck(code) {
  const forbiddenPatterns = [
    /__import__\s*\(\s*['"]os['"]\)/,
    /__import__\s*\(\s*['"]subprocess['"]\)/,
    /import\s+os\b/,
    /import\s+subprocess\b/,
    /import\s+sys\b/,
    /open\s*\(/,
    /eval\s*\(/,
    /exec\s*\(/,
  ];

  for (let i = 0; i < forbiddenPatterns.length; i++) {
    if (forbiddenPatterns[i].test(code)) {
      return "SecurityViolation: Restricted built-in call detected.";
    }
  }

  let openParens = 0;
  let openBrackets = 0;
  let openBraces = 0;
  for (const char of code) {
    if (char === "(") openParens++;
    else if (char === ")") openParens--;
    else if (char === "[") openBrackets++;
    else if (char === "]") openBrackets--;
    else if (char === "{") openBraces++;
    else if (char === "}") openBraces--;
  }
  if (openParens !== 0 || openBrackets !== 0 || openBraces !== 0) {
    return "SyntaxError: Unmatched parentheses/brackets detected before execution.";
  }

  return null;
}

self.onmessage = async (e) => {
  const { type, payload } = e.data || {};
  if (type !== "EXECUTE") return;

  const { id, code, testAssertions } = payload || {};
  const startTime = performance.now();
  const totalAssertions = countAssertions(testAssertions);
  const source = String(code || "");

  const safetyError = runStaticSafetyCheck(source);
  if (safetyError) {
    self.postMessage({
      type: "EXECUTION_COMPLETE",
      payload: {
        id,
        status: safetyError.startsWith("SecurityViolation") ? "SECURITY_VIOLATION" : "FAILED",
        output: "",
        errorMessage: safetyError,
        executionDurationMs: Math.round(performance.now() - startTime),
        assertionsPassed: 0,
        totalAssertions,
        runtime: "pyodide",
      },
    });
    return;
  }

  const pyodide = await initPyodide();

  if (!pyodide) {
    // HONEST DEGRADATION: no interpreter ran this code, so we must not claim it
    // passed. Report UNVERIFIED and let the UI withhold the completion credit.
    self.postMessage({
      type: "EXECUTION_COMPLETE",
      payload: {
        id,
        status: "UNVERIFIED",
        output: "",
        errorMessage:
          (runtimeUnavailableReason || "Python runtime unavailable.") +
          " Your code was NOT executed and cannot be credited until the runtime loads. Reconnect and run again.",
        executionDurationMs: Math.round(performance.now() - startTime),
        assertionsPassed: 0,
        totalAssertions,
        runtime: "unavailable",
      },
    });
    return;
  }

  try {
    const stdoutLogs = [];
    pyodide.setStdout({ batched: (msg) => stdoutLogs.push(msg) });
    pyodide.setStderr({ batched: (msg) => stdoutLogs.push(msg) });

    pyodide.FS.writeFile("/home/pyodide/solution.py", source, { encoding: "utf8" });

    await pyodide.runPythonAsync(`
import sys
import importlib

if "/home/pyodide" not in sys.path:
    sys.path.insert(0, "/home/pyodide")

if "solution" in sys.modules:
    importlib.invalidate_caches()
    importlib.reload(sys.modules["solution"])
else:
    import solution
`);

    // runPythonAsync rejects when an assertion fails, so reaching the next line
    // is the only proof that every assertion held.
    if (testAssertions) {
      await pyodide.runPythonAsync(testAssertions);
    }

    self.postMessage({
      type: "EXECUTION_COMPLETE",
      payload: {
        id,
        status: "SUCCESS",
        output: stdoutLogs.join("\n"),
        executionDurationMs: Math.round(performance.now() - startTime),
        assertionsPassed: totalAssertions,
        totalAssertions,
        runtime: "pyodide",
      },
    });
  } catch (err) {
    self.postMessage({
      type: "EXECUTION_COMPLETE",
      payload: {
        id,
        status: "FAILED",
        output: "",
        errorMessage: (err && err.message) || String(err),
        executionDurationMs: Math.round(performance.now() - startTime),
        assertionsPassed: 0,
        totalAssertions,
        runtime: "pyodide",
      },
    });
  }
};
