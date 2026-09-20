"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { TerminalBox } from "@/components/ui/terminal-box";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  FileCode,
  BookOpen,
  HelpCircle,
  Save,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { getSandboxController } from "@/lib/sandbox/sandbox-controller";
import { ExecutionResult } from "@/lib/sandbox/types";
import { cn } from "@/lib/utils";

interface PracticeExercise {
  id: string;
  lessonId: string;
  title: string;
  phase: string;
  instructions: string[];
  initialCode: string;
  testSuite: string;
  solutionHint: string;
}

const EXERCISES: PracticeExercise[] = [
  {
    id: "lru-cache",
    lessonId: "L116",
    phase: "Phase 03 // Trees & Graphs",
    title: "LRU Cache O(1) Eviction Logic",
    instructions: [
      "Implement `lru_cache_lookup(cache, key, order, capacity)`.",
      "If `key` is present, move it to the tail of `order` (Most Recently Used) and return value.",
      "If `key` is absent, return -1 without modifying order.",
    ],
    initialCode: `def lru_cache_lookup(cache: dict, key: str, order: list, capacity: int) -> int:
    # TODO: Check cache hit, update order, or return -1
    if key not in cache:
        return -1
    
    order.remove(key)
    order.append(key)
    return cache[key]
`,
    testSuite: `
cache = {"A": 100, "B": 200, "C": 300}
order = ["A", "B", "C"]

assert lru_cache_lookup(cache, "B", order, 3) == 200, "Cache hit assertion failed"
assert order == ["A", "C", "B"], "Order not updated to MRU at tail"
assert lru_cache_lookup(cache, "Z", order, 3) == -1, "Cache miss assertion failed"
print("✓ LRU Eviction & Cache Hit Assertions: 3/3 Passed")
`,
    solutionHint: "Use `order.remove(key)` followed by `order.append(key)` to update recency.",
  },
  {
    id: "dynamic-array",
    lessonId: "L045",
    phase: "Phase 02 // Linear Data Structures",
    title: "Amortized Dynamic Array Doubling",
    instructions: [
      "Implement `dynamic_append(arr, capacity, val)`.",
      "If `len(arr) == capacity`, simulate geometric doubling: capacity *= 2.",
      "Append `val` and return updated (arr, capacity).",
    ],
    initialCode: `def dynamic_append(arr: list, capacity: int, val: int) -> tuple:
    # If array is full, double the capacity (geometric expansion)
    if len(arr) >= capacity:
        capacity = max(1, capacity * 2)
    
    arr.append(val)
    return (arr, capacity)
`,
    testSuite: `
arr, cap = dynamic_append([], 0, 10)
assert len(arr) == 1 and cap == 1, "Initial capacity expansion failed"

arr, cap = dynamic_append(arr, cap, 20)
assert len(arr) == 2 and cap == 2, "Doubling from 1 to 2 failed"

arr, cap = dynamic_append(arr, cap, 30)
assert len(arr) == 3 and cap == 4, "Doubling from 2 to 4 failed"
print("✓ Dynamic Array Amortized Doubling: 3/3 Passed")
`,
    solutionHint: "When length reaches capacity, double capacity using `capacity * 2`.",
  },
  {
    id: "raft-election",
    lessonId: "L281",
    phase: "Phase 09 // Distributed Systems",
    title: "Raft Quorum Election Vote Verification",
    instructions: [
      "Implement `check_raft_quorum(cluster_size, votes_granted)`.",
      "A candidate becomes leader if `votes_granted >= (cluster_size // 2) + 1`.",
      "Return True if quorum is met, False otherwise.",
    ],
    initialCode: `def check_raft_quorum(cluster_size: int, votes_granted: int) -> bool:
    # Quorum is strictly strictly floor(N/2) + 1
    required_majority = (cluster_size // 2) + 1
    return votes_granted >= required_majority
`,
    testSuite: `
assert check_raft_quorum(3, 2) is True, "Quorum of 2 in cluster of 3 should win"
assert check_raft_quorum(3, 1) is False, "1 vote in cluster of 3 should fail"
assert check_raft_quorum(5, 3) is True, "Quorum of 3 in cluster of 5 should win"
assert check_raft_quorum(5, 2) is False, "2 votes in cluster of 5 should fail"
print("✓ Raft Strict Quorum Assertions: 4/4 Passed")
`,
    solutionHint: "Calculate required votes as `(cluster_size // 2) + 1`.",
  },
];

export function PracticeSandbox() {
  const [selectedExIndex, setSelectedExIndex] = React.useState(0);
  const currentEx = EXERCISES[selectedExIndex];

  const [code, setCode] = React.useState(currentEx.initialCode);
  const [isRunning, setIsRunning] = React.useState(false);
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([
    "Sandbox initialized. Ready to execute Pyodide WebAssembly.",
    "Drafts auto-saved to localStorage.",
  ]);
  const [execStatus, setExecStatus] = React.useState<"IDLE" | "SUCCESS" | "FAILED" | "TIMEOUT">("IDLE");
  const [duration, setDuration] = React.useState<number | null>(null);

  // Restore draft from localStorage on exercise change
  React.useEffect(() => {
    const saved = localStorage.getItem(`lms_draft_${currentEx.id}`);
    if (saved) {
      setCode(saved);
    } else {
      setCode(currentEx.initialCode);
    }
    setExecStatus("IDLE");
    setDuration(null);
  }, [currentEx]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      localStorage.setItem(`lms_draft_${currentEx.id}`, newCode);
    } catch {
      // ignore storage errors
    }
  };

  const handleReset = () => {
    setCode(currentEx.initialCode);
    localStorage.removeItem(`lms_draft_${currentEx.id}`);
    setExecStatus("IDLE");
    setDuration(null);
    setTerminalLogs(["Code reset to clean starter template."]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const startTime = performance.now();
    setTerminalLogs(["$ python3 -m pytest tests/test_exercise.py -v", "Parsing AST and running test assertions..."]);

    try {
      const controller = getSandboxController();
      const res: ExecutionResult = await controller.execute({
        id: currentEx.id,
        language: "python",
        code,
        testAssertions: currentEx.testSuite,
        timeoutMs: 5000,
      });

      const elapsed = Math.round(performance.now() - startTime);
      setDuration(elapsed);

      if (res.status === "SUCCESS") {
        setExecStatus("SUCCESS");
        setTerminalLogs([
          "$ pytest tests/test_exercise.py -v",
          res.output || "All assertions passed!",
          "",
          `✓ Test Suite Passed in ${elapsed}ms (AST & Runtime Assertions Verified)`,
        ]);
      } else if (res.status === "TIMEOUT") {
        setExecStatus("TIMEOUT");
        setTerminalLogs([
          "$ pytest tests/test_exercise.py -v",
          "✖ TIMEOUT: Execution exceeded 5,000ms watchdog ceiling.",
          "Check for infinite loops (e.g., while True without termination).",
        ]);
      } else {
        setExecStatus("FAILED");
        setTerminalLogs([
          "$ pytest tests/test_exercise.py -v",
          res.output ? res.output : "",
          res.errorMessage ? `AssertionError: ${res.errorMessage}` : "Test assertions failed.",
          "",
          `✖ Execution failed in ${elapsed}ms`,
        ]);
      }
    } catch (err: any) {
      setExecStatus("FAILED");
      setTerminalLogs([
        "$ pytest tests/test_exercise.py",
        `Error: ${err.message || "Failed to execute worker"}`,
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section id="sandbox-section" className="py-24 border-t border-[#23252a] bg-[#010102]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StatusChip status="brand" label="CODECADEMY + EDUCATIVE HYBRID" />
              <span className="text-xs font-mono text-[#8a8f98]">Client-Side Pyodide WASM</span>
            </div>
            <h2 className="text-3xl font-semibold text-[#f7f8f8] tracking-tight">
              Interactive In-Browser Micro-Sandboxes
            </h2>
            <p className="mt-1 text-sm text-[#8a8f98] max-w-2xl">
              Instant feedback in under 20 milliseconds. Write code directly in the browser, run automated unit test
              assertions, and get immediate AST feedback with zero local installation overhead.
            </p>
          </div>

          {/* Exercise Selector Tabs */}
          <div className="flex items-center gap-2 bg-[#08090a] p-1.5 rounded-lg border border-[#23252a] overflow-x-auto">
            {EXERCISES.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExIndex(idx)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap",
                  selectedExIndex === idx
                    ? "bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm font-semibold"
                    : "text-[#8a8f98] hover:text-[#f7f8f8]"
                )}
              >
                {ex.lessonId}: {ex.id}
              </button>
            ))}
          </div>
        </div>

        {/* Split Sandbox: Educative Theory Left + Codecademy Editor Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Educative-style Theory & Instructions */}
          <div className="lg:col-span-5 bg-[#08090a] border border-[#23252a] rounded-xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#23252a] mb-4">
                <span className="text-xs font-mono text-[#5e6ad2]">{currentEx.phase}</span>
                <span className="text-[11px] font-mono text-[#8a8f98]">{currentEx.lessonId}</span>
              </div>

              <h3 className="text-xl font-semibold text-[#f7f8f8] mb-3">{currentEx.title}</h3>

              <div className="space-y-4 text-xs text-[#8a8f98] leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono text-[#f7f8f8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Task Specification:
                  </h4>
                  <ul className="space-y-2">
                    {currentEx.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#5e6ad2] font-mono font-bold">•</span>
                        <span className="text-[#d0d6e0]">{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0f1011] border border-[#23252a]">
                  <span className="text-[11px] font-mono text-[#8a8f98] block mb-1">
                    ENGINEERING HINT:
                  </span>
                  <p className="text-xs text-[#8a8f98]">{currentEx.solutionHint}</p>
                </div>
              </div>
            </div>

            {/* Bottom Status metadata */}
            <div className="pt-4 border-t border-[#23252a] flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
              <span className="flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-[#10b981]" />
                Auto-saved
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                5.0s Watchdog Limit
              </span>
            </div>
          </div>

          {/* Right: Codecademy-style In-Browser Editor & Terminal Output */}
          <div className="lg:col-span-7 space-y-4">
            {/* Editor Container */}
            <div className="rounded-xl bg-[#08090a] border border-[#23252a] overflow-hidden shadow-2xl">
              {/* Editor Tab Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1011] border-b border-[#23252a]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#23252a]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#23252a]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#23252a]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-[#18191a] text-xs font-mono text-[#f7f8f8] border border-[#23252a] flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-[#5e6ad2]" />
                    solution.py
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleReset}
                    className="text-[#8a8f98] hover:text-[#f7f8f8] gap-1 text-[11px] font-mono h-7"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={handleRun}
                    disabled={isRunning}
                    className="gap-1.5 text-[11px] font-mono h-7 px-3 bg-[#5e6ad2] hover:bg-[#6f7cf0]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    {isRunning ? "Running..." : "Run Tests"}
                  </Button>
                </div>
              </div>

              {/* Code Textarea with Monospace Font */}
              <div className="p-4 bg-[#08090a]">
                <textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  rows={10}
                  spellCheck={false}
                  className="w-full bg-transparent text-xs font-mono text-[#f7f8f8] leading-relaxed resize-none focus:outline-none selection:bg-[#5e6ad2]/40"
                />
              </div>

              {/* Footer status bar */}
              <div className="px-4 py-1.5 bg-[#0b0c0e] border-t border-[#1e2023] flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
                <span>Python 3.11 WASM</span>
                {duration !== null && (
                  <span className={cn(execStatus === "SUCCESS" ? "text-[#10b981]" : "text-[#f43f5e]")}>
                    Executed in {duration}ms
                  </span>
                )}
              </div>
            </div>

            {/* Test Execution Output Box */}
            <TerminalBox
              title="pytest // client_side_runner"
              command={`pytest tests/test_${currentEx.id}.py`}
              output={terminalLogs}
              status={
                execStatus === "SUCCESS"
                  ? "passed"
                  : execStatus === "FAILED" || execStatus === "TIMEOUT"
                  ? "failed"
                  : "idle"
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
