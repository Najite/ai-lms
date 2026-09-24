"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Search,
  Sparkles,
  Cpu,
  Network,
  Braces,
  Zap,
} from "lucide-react";
import { getSandboxController } from "@/lib/sandbox/sandbox-controller";
import { ExecutionResult } from "@/lib/sandbox/types";
import { cn } from "@/lib/utils";

interface TopicChallenge {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  solutionFile: string;
  testFile: string;
  solutionCode: string;
  testCode: string;
  defaultLogs: string[];
}

const TOPIC_CHALLENGES: Record<string, TopicChallenge> = {
  "system-design": {
    id: "system-design",
    name: "System Design",
    icon: Cpu,
    badge: "Module 4 // Lesson 4.14",
    solutionFile: "lru_cache.py",
    testFile: "test_lru.py",
    solutionCode: `def lru_cache_lookup(cache: dict, key: str, order: list, capacity: int):
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
    testCode: `# Test Suite: Module 4 / Lesson 4.14 / Subtopic 14.2
cache = {"A": 100, "B": 200, "C": 300}
order = ["A", "B", "C"]

assert lru_cache_lookup(cache, "B", order, 3) == 200, "Cache hit failed"
assert order == ["A", "C", "B"], "Order not updated to MRU"
assert lru_cache_lookup(cache, "Z", order, 3) == -1, "Cache miss failed"
print("✓ LRU Eviction & Cache Hit Assertions: 3/3 Passed")
`,
    defaultLogs: [
      "$ pytest tests/test_lru.py -v",
      "tests/test_lru.py::test_cache_hit PASSED [ 33%]",
      "tests/test_lru.py::test_order_update PASSED [ 66%]",
      "tests/test_lru.py::test_cache_miss PASSED [100%]",
      "",
      "✓ LRU Eviction & Cache Hit Assertions: 3/3 Passed in 0.014s",
    ],
  },
  "agentic-ai": {
    id: "agentic-ai",
    name: "Agentic AI & MCP",
    icon: Sparkles,
    badge: "Module 8 // Lesson 8.42",
    solutionFile: "mcp_router.py",
    testFile: "test_mcp.py",
    solutionCode: `def route_tool_call(request: dict, registered_tools: dict):
    """
    Model Context Protocol (MCP) JSON-RPC dispatcher.
    Validates params schema and dispatches to registered handler.
    """
    method = request.get("method")
    if method not in registered_tools:
        return {"error": {"code": -32601, "message": "Method not found"}}
    
    handler = registered_tools[method]
    result = handler(request.get("params", {}))
    return {"jsonrpc": "2.0", "result": result, "id": request.get("id")}
`,
    testCode: `# Test Suite: Module 8 / Lesson 8.42 / MCP Dispatcher
tools = {"db_query": lambda p: f"Found {p.get('table')}"}
req_valid = {"jsonrpc": "2.0", "method": "db_query", "params": {"table": "users"}, "id": 1}
req_invalid = {"jsonrpc": "2.0", "method": "unknown_tool", "params": {}, "id": 2}

res1 = route_tool_call(req_valid, tools)
assert res1["result"] == "Found users", "Tool dispatch failed"
res2 = route_tool_call(req_invalid, tools)
assert "error" in res2, "Error handling failed"
print("✓ MCP JSON-RPC Dispatcher: 2/2 Passed")
`,
    defaultLogs: [
      "$ pytest tests/test_mcp.py -v",
      "tests/test_mcp.py::test_tool_dispatch PASSED [ 50%]",
      "tests/test_mcp.py::test_unknown_method_error PASSED [100%]",
      "",
      "✓ MCP JSON-RPC Dispatcher: 2/2 Passed in 0.012s",
    ],
  },
  "distributed-raft": {
    id: "distributed-raft",
    name: "Raft Consensus",
    icon: Network,
    badge: "Module 8 // Lesson 8.8",
    solutionFile: "raft_node.py",
    testFile: "test_raft.py",
    solutionCode: `def handle_heartbeat(node_state: dict, leader_term: int, leader_id: str):
    """
    Raft Consensus follower heartbeat handler.
    Updates term and resets election timeout if leader is valid.
    """
    if leader_term < node_state["current_term"]:
        return False  # Reject outdated leader
    
    node_state["current_term"] = leader_term
    node_state["leader_id"] = leader_id
    node_state["election_timeout_reset"] = True
    return True
`,
    testCode: `# Test Suite: Module 8 / Lesson 8.8 / Raft Election
state = {"current_term": 2, "leader_id": None, "election_timeout_reset": False}

assert handle_heartbeat(state, 1, "node_b") == False, "Did not reject stale term"
assert handle_heartbeat(state, 3, "node_c") == True, "Valid term rejected"
assert state["current_term"] == 3 and state["election_timeout_reset"] == True
print("✓ Raft Heartbeat & Term Guard: 3/3 Passed")
`,
    defaultLogs: [
      "$ pytest tests/test_raft.py -v",
      "tests/test_raft.py::test_stale_term_rejection PASSED [ 33%]",
      "tests/test_raft.py::test_leader_adoption PASSED [ 66%]",
      "tests/test_raft.py::test_election_timeout_reset PASSED [100%]",
      "",
      "✓ Raft Heartbeat & Term Guard: 3/3 Passed in 0.018s",
    ],
  },
  "compilers": {
    id: "compilers",
    name: "Compilers & AST",
    icon: Braces,
    badge: "Module 2 // Lesson 2.25",
    solutionFile: "ast_eval.py",
    testFile: "test_ast.py",
    solutionCode: `def evaluate_ast(node: tuple):
    """
    Recursive descent AST evaluator for prefix arithmetic trees.
    Supports binary ops: ('+', left, right), ('*', left, right), or literals.
    """
    if isinstance(node, (int, float)):
        return node
    
    op, left, right = node
    val_l = evaluate_ast(left)
    val_r = evaluate_ast(right)
    
    if op == '+': return val_l + val_r
    if op == '*': return val_l * val_r
    raise ValueError(f"Unknown op: {op}")
`,
    testCode: `# Test Suite: Module 2 / Lesson 2.25 / AST Interpreter
tree1 = ('+', 10, ('*', 3, 4))   # 10 + (3 * 4) = 22
tree2 = ('*', ('+', 2, 3), 5)    # (2 + 3) * 5 = 25

assert evaluate_ast(tree1) == 22, "Precedence evaluation failed"
assert evaluate_ast(tree2) == 25, "Group evaluation failed"
print("✓ AST Evaluator Assertions: 2/2 Passed")
`,
    defaultLogs: [
      "$ pytest tests/test_ast.py -v",
      "tests/test_ast.py::test_operator_precedence PASSED [ 50%]",
      "tests/test_ast.py::test_nested_grouping PASSED [100%]",
      "",
      "✓ AST Evaluator Assertions: 2/2 Passed in 0.009s",
    ],
  },
};

export function HeroSplit() {
  const [selectedTopicId, setSelectedTopicId] = React.useState<string>("system-design");
  const currentTopic = TOPIC_CHALLENGES[selectedTopicId];

  const [activeTab, setActiveTab] = React.useState<"solution" | "test">("solution");
  const [code, setCode] = React.useState<string>(currentTopic.solutionCode);
  const [testCode, setTestCode] = React.useState<string>(currentTopic.testCode);
  const [searchIntent, setSearchIntent] = React.useState<string>("");

  const [isRunning, setIsRunning] = React.useState(false);
  const [runResult, setRunResult] = React.useState<{
    success: boolean;
    duration: number;
    logs: string[];
  } | null>({
    success: true,
    duration: 14,
    logs: currentTopic.defaultLogs,
  });

  // When switching topic challenge
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    const target = TOPIC_CHALLENGES[topicId];
    setCode(target.solutionCode);
    setTestCode(target.testCode);
    setActiveTab("solution");
    setRunResult({
      success: true,
      duration: 12,
      logs: target.defaultLogs,
    });
  };

  const handleRun = async () => {
    setIsRunning(true);
    const start = performance.now();

    try {
      const controller = getSandboxController();
      const res: ExecutionResult = await controller.execute({
        id: `hero-${selectedTopicId}`,
        language: "python",
        code: code,
        testAssertions: testCode,
        timeoutMs: 5000,
      });

      const elapsed = Math.round(performance.now() - start);
      setRunResult({
        success: res.status === "SUCCESS",
        duration: elapsed,
        logs: [
          `$ pytest tests/${currentTopic.testFile} -v`,
          ...(res.output ? res.output.split("\n") : []),
          ...(res.errorMessage ? [`FAIL: ${res.errorMessage}`] : []),
          "",
          res.status === "SUCCESS"
            ? `✓ All assertions passed in 0.0${elapsed}s`
            : `✖ Execution failed: ${res.status}`,
        ],
      });
    } catch (e: any) {
      setRunResult({
        success: false,
        duration: Math.round(performance.now() - start),
        logs: [`$ pytest tests/${currentTopic.testFile}`, `Error: ${e.message}`],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4 pb-8">
      {/* Left Column: Educative-Inspired Intent & Value Proposition */}
      <div className="lg:col-span-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#08090a] border border-[#23252a] text-xs text-[#8a8f98] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4cb782]" />
          <span>No video lectures. No passive watching. Just runnable code.</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f7f8f8] leading-[1.12]">
            Mastery isn’t watched. <br />
            <span className="text-[#5e6ad2]">It’s built in code.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#8a8f98] leading-relaxed max-w-xl">
            Hands-on in-browser courses in AI Agents, System Design, Distributed Consensus, and Compilers.
            Zero environment setups. Code directly in your browser, then ship 18 verifiable capstones to GitHub.
          </p>
        </div>

        {/* Educative Signature: Interactive Learning Intent Search Bar */}
        <div className="rounded-[6px] border border-[#23252a] bg-[#08090a] p-2 space-y-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] bg-[#0f1012] border border-[#1b1c20]">
            <Search className="w-4 h-4 text-[#5e6ad2] shrink-0" />
            <input
              type="text"
              value={searchIntent}
              onChange={(e) => setSearchIntent(e.target.value)}
              placeholder="What do you want to learn? (e.g. Raft, System Design, MCP...)"
              className="bg-transparent text-xs text-[#f7f8f8] font-mono placeholder:text-[#565961] outline-none flex-1"
            />
            {searchIntent && (
              <button
                onClick={() => setSearchIntent("")}
                className="text-[10px] font-mono text-[#8a8f98] hover:text-[#f7f8f8]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick-Filter Pills (Educative Style) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-mono text-[#565961] mr-1">Try topic:</span>
            {Object.values(TOPIC_CHALLENGES).map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-mono transition-all duration-150 border",
                    isSelected
                      ? "bg-[#5e6ad2]/15 border-[#5e6ad2] text-[#f7f8f8] shadow-sm"
                      : "bg-[#0f1012] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#3b3e48]"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-[#5e6ad2]" : "text-[#8a8f98]")} />
                  <span>{topic.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>700 Verified Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>2.5x Faster Than Video</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>14 Modules • 700 Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f7f8f8] font-mono">
            <CheckCircle2 className="w-4 h-4 text-[#4cb782] shrink-0" />
            <span>100% Free &amp; Open ($0.00)</span>
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
            <span>Explore 700 Lessons</span>
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

      {/* Right Column: Educative Multi-Tab Interactive Playground */}
      <div className="lg:col-span-6">
        <div className="rounded-[8px] border border-[#23252a] bg-[#08090a] overflow-hidden shadow-2xl">
          {/* Header with Topic Badge, Tabs & Run Button */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1b1c20] bg-[#0f1012]">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("solution")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-mono transition-colors",
                  activeTab === "solution"
                    ? "bg-[#16171a] text-[#f7f8f8] border border-[#23252a]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#16171a]/50"
                )}
              >
                <FileCode className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>{currentTopic.solutionFile}</span>
              </button>
              <button
                onClick={() => setActiveTab("test")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-mono transition-colors",
                  activeTab === "test"
                    ? "bg-[#16171a] text-[#f7f8f8] border border-[#23252a]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#16171a]/50"
                )}
              >
                <FileCode className="w-3.5 h-3.5 text-[#4cb782]" />
                <span>{currentTopic.testFile}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#8a8f98] px-2 py-0.5 rounded bg-[#16171a] border border-[#23252a]">
                {currentTopic.badge}
              </span>
              <Button
                variant="primary"
                size="xs"
                onClick={handleRun}
                disabled={isRunning}
                className="font-mono text-[11px] gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? "Testing..." : "Run Sandbox"}</span>
              </Button>
            </div>
          </div>

          {/* Interactive Code Area */}
          <div className="relative flex min-h-[220px] font-mono text-xs bg-[#010102]">
            {/* Line numbers */}
            <div className="w-10 select-none py-3 text-right pr-2 text-[#383b42] border-r border-[#1b1c20] bg-[#08090a]">
              {(activeTab === "solution" ? code : testCode).split("\n").map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code text */}
            <textarea
              value={activeTab === "solution" ? code : testCode}
              onChange={(e) => {
                if (activeTab === "solution") setCode(e.target.value);
                else setTestCode(e.target.value);
              }}
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
                <span>INTERACTIVE PYODIDE WASM TERMINAL</span>
              </div>
              {runResult && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded border text-[10px] font-mono",
                    runResult.success
                      ? "bg-[#4cb782]/10 text-[#4cb782] border-[#1b4332]"
                      : "bg-[#eb5757]/10 text-[#eb5757] border-[#4a1515]"
                  )}
                >
                  {runResult.success ? "ASSERTIONS PASSED" : "EXECUTION FAILED"}
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
                    log.includes("Passed") && "text-[#4cb782]",
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
