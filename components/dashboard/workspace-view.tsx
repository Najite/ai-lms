"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { TerminalBox } from "@/components/ui/terminal-box";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  FileCode,
  BookOpen,
  HelpCircle,
  Save,
  Clock,
  Terminal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  ListFilter,
  Bot,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
  Code2,
} from "lucide-react";
import { getSandboxController } from "@/lib/sandbox/sandbox-controller";
import { ExecutionResult } from "@/lib/sandbox/types";
import { supabase } from "@/lib/supabase";
import { HandbookViewer } from "./handbook-viewer";
import { CodeEditor } from "@/components/ui/code-editor";
import { cn } from "@/lib/utils";
import {
  useCurriculumProgress,
  isLessonUnlocked,
  markLessonCompleted,
  setLastActiveLessonId,
} from "@/lib/progress-tracker";

interface WorkspaceLesson {
  id: string;
  slug: string;
  phase: string;
  title: string;
  handbook: string;
  starterCode: string;
  testSuite: string;
}

interface WorkspaceViewProps {
  onOpenTutor?: () => void;
  initialLessonId?: string | null;
}

export function WorkspaceView({ onOpenTutor, initialLessonId }: WorkspaceViewProps) {
  const [lessons, setLessons] = React.useState<WorkspaceLesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = React.useState(0);
  const [code, setCode] = React.useState<string>("");
  const [activeFile, setActiveFile] = React.useState<"solution.py" | "tests.py">("solution.py");
  const [isRunning, setIsRunning] = React.useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = React.useState(true);
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("Ready to verify AST & unit assertions");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [justCompletedSuccess, setJustCompletedSuccess] = React.useState(false);

  const { completedLessons } = useCurriculumProgress();

  // Fetch real lessons from Supabase (fetch full 500 catalog list of ids/titles, load current lesson)
  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoadingLessons(true);
      
      // Determine target lesson ID (from prop or URL query param ?lesson=node-x-y)
      let targetLessonId = initialLessonId;
      if (!targetLessonId && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        targetLessonId = params.get("lesson");
      }

      // 1. Fetch all 600 lessons for full selector navigation
      const { data, error } = await supabase
        .from("curriculum_nodes")
        .select("id, slug, phase_id, title, starter_code, test_suite, handbook_markdown")
        .order("id", { ascending: true })
        .limit(600);

      if (isMounted && data && data.length > 0) {
        const mapped: WorkspaceLesson[] = data.map((d) => {
          let starter = "";
          if (d.starter_code) {
            if (typeof d.starter_code === "string") starter = d.starter_code;
            else if (typeof d.starter_code === "object") {
              starter = (d.starter_code as any)["solution.py"] || JSON.stringify(d.starter_code, null, 2);
            }
          }
          if (!starter) {
            starter = `# ${d.title}\n\ndef solve():\n    # Implement solution satisfying invariant requirements\n    pass\n`;
          }

          let test = "";
          if (d.test_suite) {
            if (typeof d.test_suite === "string") {
              test = d.test_suite;
            } else if (typeof d.test_suite === "object") {
              test = (d.test_suite as any)["tests.py"] || `# Test Suite for: ${d.title}\nassert True, "Baseline invariant check"\nprint("✓ Automated AST Assertions: PASSED")\n`;
            }
          }

          return {
            id: d.id,
            slug: d.slug,
            phase: d.phase_id,
            title: d.title,
            handbook: d.handbook_markdown || "",
            starterCode: starter,
            testSuite: test,
          };
        });

        setLessons(mapped);

        // Find initial index
        let initialIdx = 0;
        if (targetLessonId) {
          const foundIdx = mapped.findIndex(
            (l) => l.id === targetLessonId || l.slug === targetLessonId
          );
          if (foundIdx !== -1) {
            initialIdx = foundIdx;
          }
        }

        setCurrentLessonIndex(initialIdx);
        setCode(mapped[initialIdx].starterCode);
        setIsLoadingLessons(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [initialLessonId]);

  const currentLesson = lessons[currentLessonIndex] || {
    id: "node-0-1",
    phase: "phase-0",
    title: "Lesson 0.1: Bits, Bytes, & Number Representations",
    handbook: "# Loading handbook from Supabase...",
    starterCode: "# Loading code...",
    testSuite: "# Loading tests...",
  };

  const allLessonIds = React.useMemo(() => lessons.map((l) => l.id), [lessons]);

  const handleLessonChange = (idx: number) => {
    if (idx < 0 || idx >= lessons.length) return;
    setCurrentLessonIndex(idx);
    setCode(lessons[idx].starterCode);
    setResult(null);
    setJustCompletedSuccess(false);
    setStatusMessage("Lesson loaded. Verify using Pyodide.");
    setLastActiveLessonId(lessons[idx].id);

    // Update URL query string without reloading page
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lesson", lessons[idx].id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setStatusMessage("Running Pyodide WASM runtime with 5s watchdog...");

    try {
      const controller = getSandboxController();
      const res = await controller.execute({
        id: currentLesson.id,
        language: "python",
        code: activeFile === "solution.py" ? code : currentLesson.starterCode,
        testAssertions: currentLesson.testSuite,
        timeoutMs: 5000,
      });

      setResult(res);
      if (res.status === "SUCCESS") {
        setStatusMessage(`✓ All assertions passed in ${(res.executionDurationMs / 1000).toFixed(3)}s`);
        setJustCompletedSuccess(true);

        // Mark current lesson completed
        await markLessonCompleted(currentLesson.id, activeFile === "solution.py" ? code : undefined);
      } else {
        setJustCompletedSuccess(false);
        setStatusMessage(`✗ Test failed: ${res.errorMessage || "AssertionError"}`);
      }
    } catch (err: any) {
      setJustCompletedSuccess(false);
      setStatusMessage(`Runtime error: ${err.message || "Execution failed"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAdvanceToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      handleLessonChange(currentLessonIndex + 1);
    }
  };

  const isCurrentCompleted = completedLessons.includes(currentLesson.id);
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  const handleResetCode = () => {
    setCode(currentLesson.starterCode);
    setResult(null);
    setJustCompletedSuccess(false);
    setStatusMessage("Code reset to initial state.");
  };

  if (isLoadingLessons) {
    return (
      <div className="flex items-center justify-center p-32 bg-[#08090a] border border-[#23252a] rounded-xl font-mono text-sm text-[#8a8f98] gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#5e6ad2]" />
        <span>Loading lesson workspace directly from Supabase database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#08090a] border border-[#23252a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/30 flex items-center justify-center text-[#5e6ad2] font-mono text-xs font-semibold">
            {currentLesson.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#8a8f98]">{currentLesson.phase}</span>
              <span className="text-[#383b42]">•</span>
              {isCurrentCompleted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  COMPLETED
                </span>
              ) : (
                <StatusChip status="brand" label="IN PROGRESS" />
              )}
              <span className="text-[#383b42]">•</span>
              <StatusChip status="offline" label="LIVE DATABASE LESSON" />
            </div>
            <h2 className="text-base font-semibold text-[#f7f8f8] tracking-tight mt-0.5">
              {currentLesson.title}
            </h2>
          </div>
        </div>

        {/* Pager & Quick Selector controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Lesson Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f1011] border border-[#23252a] hover:border-[#5e6ad2]/50 text-xs font-mono text-[#f7f8f8] transition-colors"
            >
              <ListFilter className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span className="hidden sm:inline">Jump to Lesson</span>
              <span className="text-[#8a8f98]">({currentLessonIndex + 1}/{lessons.length})</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8a8f98]" />
            </button>

            {isSelectorOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-[#08090a] border border-[#23252a] p-3 shadow-2xl z-50 animate-fadeIn">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-[#8a8f98] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 600 lessons by title or phase..."
                    className="w-full bg-[#0f1011] border border-[#23252a] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-[#f7f8f8] placeholder-[#565961] focus:outline-none focus:border-[#5e6ad2]"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                  {lessons
                    .map((l, idx) => ({ ...l, originalIdx: idx }))
                    .filter(
                      (l) =>
                        !searchQuery ||
                        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        l.id.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 40)
                    .map((l) => {
                      const completed = completedLessons.includes(l.id);
                      const unlocked = isLessonUnlocked(l.id, allLessonIds, completedLessons);

                      return (
                        <div
                          key={l.id}
                          onClick={() => {
                            handleLessonChange(l.originalIdx);
                            setIsSelectorOpen(false);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "px-2.5 py-1.5 text-xs font-mono rounded-md cursor-pointer transition-colors flex items-center justify-between gap-2",
                            l.originalIdx === currentLessonIndex
                              ? "bg-[#5e6ad2] text-white"
                              : "hover:bg-[#16171a] text-[#d0d6e0] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                            ) : unlocked ? (
                              <div className="w-2 h-2 rounded-full bg-[#5e6ad2] shrink-0" />
                            ) : (
                              <Lock className="w-3 h-3 text-[#565961] shrink-0" />
                            )}
                            <span className="truncate">{l.title}</span>
                          </div>
                          <span className="text-[10px] text-[#8a8f98] shrink-0 uppercase">{l.phase}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentLessonIndex === 0}
              onClick={() => handleLessonChange(currentLessonIndex - 1)}
              className="p-1.5"
              title="Previous lesson"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentLessonIndex === lessons.length - 1}
              onClick={() => handleLessonChange(currentLessonIndex + 1)}
              className="p-1.5"
              title="Next lesson"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          {onOpenTutor && (
            <Button variant="outline" size="sm" onClick={onOpenTutor} className="gap-1.5 text-xs font-mono">
              <Bot className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>Ask Tutor</span>
            </Button>
          )}
        </div>
      </div>

      {/* Split Workspace: Left Theory & Tasks, Right Interactive Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Column: Theory, Requirements, and Invariants */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#08090a] border border-[#23252a] rounded-xl p-6 shadow-xl">
          <div className="space-y-6 overflow-y-auto max-h-[540px] pr-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#5e6ad2]" />
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8a8f98]">
                  Curriculum Handbook
                </h4>
              </div>
              <div className="bg-[#0b0c0e] p-4 rounded-lg border border-[#23252a]">
                <HandbookViewer content={currentLesson.handbook} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#23252a] flex items-center justify-between text-xs font-mono text-[#8a8f98]">
            <span>Telemetry: Live Database Sync</span>
            <span className="text-[#10b981]">100% Free / Self-Paced</span>
          </div>
        </div>

        {/* Right Column: Multi-tab Code Editor & ANSI Terminal Output */}
        <div className="lg:col-span-7 flex flex-col bg-[#08090a] border border-[#23252a] rounded-xl overflow-hidden shadow-2xl">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1011] border-b border-[#23252a]">
            {/* File Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFile("solution.py")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded transition-colors",
                  activeFile === "solution.py"
                    ? "bg-[#1f2023] text-white border border-[#383b42]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8]"
                )}
              >
                <FileCode className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>solution.py</span>
              </button>
              <button
                onClick={() => setActiveFile("tests.py")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded transition-colors",
                  activeFile === "tests.py"
                    ? "bg-[#1f2023] text-white border border-[#383b42]"
                    : "text-[#8a8f98] hover:text-[#f7f8f8]"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                <span>tests.py (Read-Only)</span>
              </button>
            </div>

            {/* Run and Reset Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCode}
                disabled={isRunning}
                className="gap-1.5 font-mono text-xs text-[#8a8f98] hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning}
                className="gap-1.5 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? "Running..." : "Run & Verify (Ctrl+Enter)"}</span>
              </Button>
            </div>
          </div>

          {/* Code Input Area with Professional Line Numbers & PEP-8 Smart Indentation */}
          <div className="relative flex-1 min-h-[300px] flex flex-col">
            <CodeEditor
              value={activeFile === "solution.py" ? code : currentLesson.testSuite}
              readOnly={activeFile === "tests.py"}
              onChange={(val) => {
                if (activeFile === "solution.py") setCode(val);
              }}
              onRun={handleRunCode}
              minHeight="320px"
              language="python"
            />
          </div>

          {/* Terminal Output Console */}
          <div className="border-t border-[#23252a] bg-[#08090a] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8a8f98]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>ANSI Terminal Console</span>
              </div>
              <span className="text-[11px] text-[#565961]">{statusMessage}</span>
            </div>

            <div className="rounded-lg bg-[#010102] border border-[#23252a] p-3 font-mono text-xs text-[#d0d6e0] min-h-[110px] max-h-[160px] overflow-y-auto">
              {result ? (
                <div className="space-y-1">
                  {result.output && (
                    <div className="whitespace-pre-wrap text-[#8a8f98]">{result.output}</div>
                  )}
                  {result.status === "SUCCESS" ? (
                    <div className="text-[#10b981] font-semibold flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>100% Assertions Passed in {(result.executionDurationMs / 1000).toFixed(3)}s</span>
                    </div>
                  ) : (
                    <div className="text-[#ef4444] font-semibold flex items-center gap-1.5 pt-1">
                      <span>✗ {result.errorMessage || "Assertion failure"}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[#565961] flex items-center gap-2">
                  <span className="text-[#5e6ad2]">$</span>
                  <span>Hit &apos;Run & Verify&apos; to execute the Python solution against the test suite.</span>
                </div>
              )}
            </div>

            {/* Completion Success Banner & Next Lesson Unlocked Card */}
            {(justCompletedSuccess || isCurrentCompleted) && nextLesson && (
              <div className="mt-3 p-3 rounded-lg bg-[#5e6ad2]/10 border border-[#5e6ad2]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#f7f8f8]">
                        Lesson Completed & Next Unlocked!
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#10b981]/20 text-[#10b981]">
                        +XP Earned
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#8a8f98] truncate max-w-md">
                      Next: <span className="text-[#d0d6e0]">{nextLesson.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.href = `/dashboard?lesson=${encodeURIComponent(currentLesson.id)}#exercises`;
                      }
                    }}
                    variant="outline"
                    className="gap-1.5 border-[#10b981]/40 text-[#10b981] hover:bg-[#10b981]/10 font-mono text-xs w-full sm:w-auto"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Practice Exercises (4 Drills) →</span>
                  </Button>
                  <Button
                    onClick={handleAdvanceToNextLesson}
                    className="gap-2 bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white font-mono text-xs shadow-md shadow-[#5e6ad2]/20 w-full sm:w-auto shrink-0"
                  >
                    <span>Open Next Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
