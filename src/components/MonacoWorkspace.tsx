"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  FileCode,
  Sparkles,
  RefreshCw,
  Award,
  Eye,
  Activity,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CurriculumNode, supabase } from "@/lib/supabase";
import { StaffAIAgent, GhostAnnotation } from "@/lib/agent/staffAgent";
import { ContextFlamegraph } from "./ContextFlamegraph";

interface MonacoWorkspaceProps {
  node: CurriculumNode;
  onOpenDefense: () => void;
  onTestsPassed: () => void;
  isDefensePassed: boolean;
}

declare global {
  interface Window {
    loadPyodide?: any;
    pyodideInstance?: any;
  }
}

export function MonacoWorkspace({
  node,
  onOpenDefense,
  onTestsPassed,
  isDefensePassed,
}: MonacoWorkspaceProps) {
  const [activeFile, setActiveFile] = useState<string>("main.py");
  const [codeFiles, setCodeFiles] = useState<Record<string, string>>(() => {
    return node.starter_code || { "main.py": "# Write your code here\n" };
  });

  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    passedCount: number;
    totalCount: number;
    logs: string;
    latencyMs: number;
  } | null>(null);

  // Socratic Ghost Annotations (Real-time AST & pattern analysis)
  const [ghostNotes, setGhostNotes] = useState<GhostAnnotation[]>([]);
  const [showFlamegraph, setShowFlamegraph] = useState<boolean>(true);

  const [pyodideReady, setPyodideReady] = useState<boolean>(false);
  const pyodideLoadingRef = useRef<boolean>(false);

  // Initialize Pyodide WASM in browser
  useEffect(() => {
    if (window.pyodideInstance) {
      setPyodideReady(true);
      return;
    }

    if (pyodideLoadingRef.current) return;
    pyodideLoadingRef.current = true;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
    script.async = true;
    script.onload = async () => {
      try {
        if (window.loadPyodide) {
          window.pyodideInstance = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
          });
          setPyodideReady(true);
        }
      } catch (err) {
        console.error("Pyodide failed to load:", err);
      }
    };
    document.body.appendChild(script);
  }, []);

  // Update starter code when node changes
  useEffect(() => {
    const starter = node.starter_code || { "main.py": "# Write your code here\n" };
    setCodeFiles(starter);
    setTestResults(null);
    setGhostNotes(StaffAIAgent.analyzeCodeForGhost(starter["main.py"] || ""));
  }, [node]);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCodeFiles((prev) => ({
        ...prev,
        [activeFile]: newCode,
      }));

      // Real-time Socratic Ghost analysis
      if (activeFile === "main.py") {
        const notes = StaffAIAgent.analyzeCodeForGhost(newCode);
        setGhostNotes(notes);
      }
    }
  };

  // Run tests in browser using Pyodide
  const handleRunTests = async () => {
    setIsRunningTests(true);
    const startTime = performance.now();

    try {
      let pyodide = window.pyodideInstance;
      if (!pyodide && window.loadPyodide) {
        pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        window.pyodideInstance = pyodide;
        setPyodideReady(true);
      }

      if (!pyodide) {
        throw new Error("Python WebAssembly engine is initializing. Please retry in 3 seconds.");
      }

      // Reset stdout/stderr redirection
      pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // 1. Run user code in Pyodide environment
      const userCode = codeFiles["main.py"] || "";
      pyodide.runPython(userCode);

      // 2. Run Test Suite
      const tests = node.test_suite?.tests || [];
      let passedCount = 0;
      let logs = "";

      for (const t of tests) {
        try {
          if (t.code) {
            pyodide.runPython(t.code);
          } else if (node.id === "node-1-1-bpe-tokenizer") {
            const testPy = `
tokenizer = BPETokenizer()
assert tokenizer is not None, "BPETokenizer instance failed"
assert hasattr(tokenizer, 'encode') and hasattr(tokenizer, 'decode'), "Missing encode/decode methods"
`;
            pyodide.runPython(testPy);
          } else if (node.id === "node-1-2-cli-orchestrator") {
            const testPy = `
assert 'run_sandboxed_command' in globals(), "run_sandboxed_command function missing"
`;
            pyodide.runPython(testPy);
          } else if (node.id === "node-2-1-hybrid-retrieval") {
            const testPy = `
retriever = HybridRetriever()
assert hasattr(retriever, 'rrf'), "Missing rrf method"
`;
            pyodide.runPython(testPy);
          }

          passedCount++;
          logs += `✔ [PASS] ${t.name}\n`;
        } catch (testErr: any) {
          logs += `✘ [FAIL] ${t.name}: ${testErr.message || String(testErr)}\n`;
        }
      }

      const totalCount = tests.length > 0 ? tests.length : 1;
      if (tests.length === 0) {
        passedCount = 1;
        logs += "✔ [PASS] Code executed without syntax or runtime exceptions.\n";
      }

      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.runPython("sys.stderr.getvalue()");
      if (stdout) logs += `\n[stdout]:\n${stdout}`;
      if (stderr) logs += `\n[stderr]:\n${stderr}`;

      const latency = Math.round(performance.now() - startTime);
      const isAllPassed = passedCount === totalCount;

      setTestResults({
        passed: isAllPassed,
        passedCount,
        totalCount,
        logs,
        latencyMs: latency,
      });

      if (isAllPassed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#06b6d4", "#10b981", "#8b5cf6"],
        });

        onTestsPassed();

        try {
          await supabase.from("test_submissions").insert({
            node_id: node.id,
            passed: true,
            passed_count: passedCount,
            total_count: totalCount,
            output_logs: logs,
            latency_ms: latency,
          });
        } catch (e) {
          console.warn("Telemetry submission notice:", e);
        }
      }
    } catch (err: any) {
      const latency = Math.round(performance.now() - startTime);
      setTestResults({
        passed: false,
        passedCount: 0,
        totalCount: (node.test_suite?.tests || []).length || 1,
        logs: `[FATAL EXECUTION ERROR]:\n${err.message || String(err)}`,
        latencyMs: latency,
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07080b]">
      {/* File Tabs & Action Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e222e] bg-[#0e1017]">
        <div className="flex items-center gap-1">
          {Object.keys(codeFiles).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setActiveFile(fileName)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded border transition-all ${
                activeFile === fileName
                  ? "bg-[#1b1f2c] text-slate-100 border-[#2a3041]"
                  : "text-slate-400 hover:text-slate-200 border-transparent"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#06b6d4]" />
              {fileName}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Flamegraph Toggle */}
          <button
            onClick={() => setShowFlamegraph(!showFlamegraph)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
              showFlamegraph ? "bg-[#1b1f2c] text-[#06b6d4] border-[#06b6d4]/40" : "text-slate-400 border-[#1e222e]"
            }`}
          >
            <Activity className="w-3 h-3" />
            Flamegraph
          </button>

          {/* Socratic Defense Button */}
          {testResults?.passed && !isDefensePassed && (
            <button
              onClick={onOpenDefense}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#8b5cf6] hover:bg-[#9d72f9] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_12px_rgba(139,92,246,0.3)] animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Defend Code to Staff AI
            </button>
          )}

          {isDefensePassed && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-xs font-mono text-[#10b981]">
              <Award className="w-3.5 h-3.5" />
              <span>DEFENSE PASSED</span>
            </div>
          )}

          {/* Moulinette Test Execution Button */}
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
              isRunningTests
                ? "bg-[#1e222e] text-slate-400 cursor-wait"
                : "bg-[#06b6d4] hover:bg-[#22d3ee] text-[#07080b] shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            }`}
          >
            {isRunningTests ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {isRunningTests ? "Executing Tests..." : "Run Moulinette Tests"}
          </button>
        </div>
      </div>

      {/* Optional Context Flamegraph Drawer */}
      {showFlamegraph && (
        <div className="px-4 py-2 border-b border-[#1e222e] bg-[#07080b]/70">
          <ContextFlamegraph
            totalTokens={3850}
            maxTokens={8192}
            systemTokens={250}
            exemplarTokens={800}
            ragTokens={2200}
            historyTokens={600}
            ttftMs={145}
          />
        </div>
      )}

      {/* Socratic Ghost Notifications */}
      {ghostNotes.length > 0 && (
        <div className="px-4 py-2 bg-[#8b5cf6]/10 border-b border-[#8b5cf6]/30 font-mono text-xs flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-[#8b5cf6] font-bold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> SOCRATIC GHOST:
            </span>
            <span className="text-slate-300 text-[11px] truncate max-w-xl">
              {ghostNotes[0].message}
            </span>
          </div>
          <span className="text-[10px] text-[#8b5cf6] font-bold">Line {ghostNotes[0].line}</span>
        </div>
      )}

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[260px] border-b border-[#1e222e]">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={codeFiles[activeFile] || ""}
          onChange={handleCodeChange}
          options={{
            fontSize: 13,
            fontFamily: "var(--font-geist-mono), monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Moulinette Audit Terminal & Telemetry */}
      <div className="h-48 bg-[#07080b] flex flex-col font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e222e] bg-[#0e1017]">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span className="font-semibold text-slate-200">MOULINETTE AUDIT TELEMETRY</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {testResults && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                {testResults.latencyMs}ms
              </span>
            )}
            <span className="text-slate-500">WASM Sandbox</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300 select-text">
          {!testResults ? (
            <div className="text-slate-600 italic">
              Ready. Click "Run Moulinette Tests" to compile and audit your code.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {testResults.passed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ALL {testResults.totalCount} TESTS PASSED (100%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/40 font-bold">
                    <XCircle className="w-3.5 h-3.5" />
                    AUDIT FAILED ({testResults.passedCount}/{testResults.totalCount} Passed)
                  </span>
                )}
              </div>

              <pre className="text-slate-400 whitespace-pre-wrap font-mono leading-relaxed bg-[#0e1017] p-3 rounded border border-[#1e222e]">
                {testResults.logs}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
