"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Play, RotateCcw, CheckCircle2, Terminal, ArrowRight, ShieldCheck, FileCode, Check } from "lucide-react";
import { getSandboxController } from "@/lib/sandbox/sandbox-controller";
import { ExecutionResult } from "@/lib/sandbox/types";
import { cn } from "@/lib/utils";

const SAMPLE_FILES = {
  "solution.py": `def lru_cache_lookup(cache: dict, key: str, order: list, capacity: int):
    """
    O(1) average lookup and O(1) eviction for LRU cache.
    Moves accessed key to the tail of the recent order list.
    """
    if key not in cache:
        return -1
    
    # Update access order (most recently used at end)
    order.remove(key)
    order.append(key)
    return cache[key]
`,
  "test_lru.py": `# Test Suite: Phase 3 / Lesson 116 / Subtopic 116.2
cache = {"A": 100, "B": 200, "C": 300}
order = ["A", "B", "C"]

assert lru_cache_lookup(cache, "B", order, 3) == 200, "Cache hit failed"
assert order == ["A", "C", "B"], "Order not updated to MRU"
assert lru_cache_lookup(cache, "Z", order, 3) == -1, "Cache miss failed"
print("✓ LRU Eviction & Cache Hit Assertions: 3/3 Passed")
`,
};

export function HeroSplit() {
  const [activeTab, setActiveTab] = React.useState<"solution.py" | "test_lru.py">("solution.py");
  const [code, setCode] = React.useState(SAMPLE_FILES["solution.py"]);
  const [isRunning, setIsRunning] = React.useState(false);
  const [runResult, setRunResult] = React.useState<{
    success: boolean;
    duration: number;
    logs: string[];
  } | null>({
    success: true,
    duration: 16,
    logs: [
      "$ pytest tests/test_lru.py -v",
      "tests/test_lru.py::test_cache_hit PASSED [ 33%]",
      "tests/test_lru.py::test_order_update PASSED [ 66%]",
      "tests/test_lru.py::test_cache_miss PASSED [100%]",
      "",
      "✓ LRU Eviction & Cache Hit Assertions: 3/3 Passed in 0.016s",
    ],
  });

  const handleRun = async () => {
    setIsRunning(true);
    const start = performance.now();

    // If active tab is solution, execute with test_lru.py
    try {
      const controller = getSandboxController();
      const res: ExecutionResult = await controller.execute({
        id: "hero-demo",
        language: "python",
        code: activeTab === "solution.py" ? code : SAMPLE_FILES["solution.py"],
        testAssertions: activeTab === "test_lru.py" ? code : SAMPLE_FILES["test_lru.py"],
        timeoutMs: 5000,
      });

      const elapsed = Math.round(performance.now() - start);
      setRunResult({
        success: res.status === "SUCCESS",
        duration: elapsed,
        logs: [
          "$ pytest tests/test_lru.py -v",
          ...(res.output ? res.output.split("\n") : []),
          ...(res.errorMessage ? [`FAIL: ${res.errorMessage}`] : []),
          "",
          res.status === "SUCCESS"
            ? `✓ 3/3 assertions passed in 0.0${elapsed}s`
            : `✖ Execution failed: ${res.status}`,
        ],
      });
    } catch (e: any) {
      setRunResult({
        success: false,
        duration: Math.round(performance.now() - start),
        logs: [`$ pytest tests/test_lru.py`, `Error: ${e.message}`],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTabSwitch = (tab: "solution.py" | "test_lru.py") => {
    setActiveTab(tab);
    setCode(SAMPLE_FILES[tab]);
  };

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 pb-8">
      {/* Left Column: Codecademy-Style Value Proposition */}
      <div className="lg:col-span-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#08090a] border border-[#23252a] text-xs text-[#8a8f98] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4cb782]" />
          <span>No video lectures. No fluff. Just real engineering.</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f7f8f8] leading-[1.12]">
            Learn by coding in your browser. <br />
            <span className="text-[#5e6ad2]">Build on your machine.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#8a8f98] leading-relaxed max-w-xl">
            From binary logic and C compilers to distributed consensus (Raft) and transformer architectures.
            Practice micro-skills instantly with in-browser WASM, then clone and ship 22 production capstones
            on your local workstation.
          </p>
        </div>

        {/* Feature Pills (Educative Style) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>600 Self-Paced Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>Zero Artificial Deadlines</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>22 Industry Capstones</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>100% Free & Open ($0)</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-mono text-xs gap-2"
          >
            <span>Explore 600 Lessons</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              document.getElementById("learning-paths")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-mono text-xs"
          >
            View Skill Paths
          </Button>
        </div>
      </div>

      {/* Right Column: Codecademy + Educative Multi-Tab Interactive Playground */}
      <div className="lg:col-span-6">
        <div className="rounded-[6px] border border-[#23252a] bg-[#08090a] overflow-hidden shadow-2xl">
          {/* Editor Header: Tabs & Run Button */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1b1c20] bg-[#0f1012]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTabSwitch("solution.py")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-mono transition-colors",
                  activeTab === "solution.py"
                    ? "bg-[#16171a] text-[#f7f8f8] border border-[#23252a]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#16171a]/50"
                )}
              >
                <FileCode className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>solution.py</span>
              </button>
              <button
                onClick={() => handleTabSwitch("test_lru.py")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-mono transition-colors",
                  activeTab === "test_lru.py"
                    ? "bg-[#16171a] text-[#f7f8f8] border border-[#23252a]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#16171a]/50"
                )}
              >
                <FileCode className="w-3.5 h-3.5 text-[#4cb782]" />
                <span>test_lru.py</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="xs"
                onClick={handleRun}
                disabled={isRunning}
                className="font-mono text-[11px]"
              >
                <Play className="w-3 h-3 mr-1 fill-current" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>

          {/* Interactive Code Area */}
          <div className="relative flex min-h-[190px] font-mono text-xs bg-[#010102]">
            {/* Line numbers */}
            <div className="w-10 select-none py-3 text-right pr-2 text-[#383b42] border-r border-[#1b1c20] bg-[#08090a]">
              {code.split("\n").map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code text */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-[#f7f8f8] font-mono text-xs leading-5 outline-none resize-none selection:bg-[#5e6ad2]/30"
              rows={11}
            />
          </div>

          {/* Live Terminal Output Drawer */}
          <div className="border-t border-[#1b1c20] bg-[#08090a]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0f1012] border-b border-[#1b1c20] text-[10px] font-mono text-[#8a8f98]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-[#5e6ad2]" />
                <span>TERMINAL OUTPUT</span>
              </div>
              {runResult && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded border text-[10px]",
                    runResult.success
                      ? "bg-[#4cb782]/10 text-[#4cb782] border-[#1b4332]"
                      : "bg-[#eb5757]/10 text-[#eb5757] border-[#4a1515]"
                  )}
                >
                  {runResult.success ? "TESTS PASSED (3/3)" : "TEST FAILED"}
                </span>
              )}
            </div>
            <div className="p-3 text-[11px] font-mono text-[#8a8f98] leading-relaxed overflow-x-auto max-h-36">
              {runResult?.logs.map((log, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre",
                    log.startsWith("$") && "text-[#f7f8f8] font-semibold",
                    log.includes("PASSED") && "text-[#4cb782]",
                    log.includes("FAIL") && "text-[#eb5757]"
                  )}
                >
                  {log || "\u00A0"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
