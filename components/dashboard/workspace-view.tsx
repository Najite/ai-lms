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
  Clock,
  Terminal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Bot,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
  Code2,
  Award,
  Zap,
  Check,
  ExternalLink,
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
  markExerciseCompleted,
  setLastActiveLessonId,
} from "@/lib/progress-tracker";
import { COMPREHENSIVE_EXERCISES_CATALOG, ExerciseItem } from "@/lib/exercises-catalog";
import { ENRICHED_MODULE_HANDBOOKS } from "@/lib/enriched-handbooks";
import { parseLessonCoordinates, formatPhaseTitle } from "@/lib/curriculum-numbering";
import { ExerciseFormatter } from "./exercise-formatter";

interface WorkspaceLesson {
  id: string;
  slug: string;
  phase: string;
  title: string;
  handbook: string;
  starterCode: string;
  testSuite: string;
  criteria?: string;
  failureMode?: string;
  xpReward?: number;
}

interface WorkspaceViewProps {
  onOpenTutor?: () => void;
  initialLessonId?: string | null;
}

export function WorkspaceView({ onOpenTutor, initialLessonId }: WorkspaceViewProps) {
  const [lessons, setLessons] = React.useState<WorkspaceLesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = React.useState(0);
  const [activeMode, setActiveMode] = React.useState<"theory" | "exercise">("theory");
  const [showCheckpointPrompt, setShowCheckpointPrompt] = React.useState(false);

  // Exercise states
  const [code, setCode] = React.useState<string>("");
  const [activeEditorTab, setActiveEditorTab] = React.useState<"solution" | "tests">("solution");
  const [isRunning, setIsRunning] = React.useState(false);
  const [executionResult, setExecutionResult] = React.useState<ExecutionResult | null>(null);
  const [statusMessage, setStatusMessage] = React.useState<string>("Ready to execute verification.");
  const [isLoading, setIsLoading] = React.useState(true);
  const [completedTheorySet, setCompletedTheorySet] = React.useState<Set<string>>(new Set());

  const { completedLessons, completedExercises } = useCurriculumProgress();
  const currentLesson = lessons[currentLessonIndex] || null;

  // Find paired exercise from catalog if available
  const pairedExercise: ExerciseItem | undefined = React.useMemo(() => {
    if (!currentLesson) return undefined;
    return COMPREHENSIVE_EXERCISES_CATALOG.find((e) => e.lessonId === currentLesson.id);
  }, [currentLesson]);

  // Fetch all curriculum nodes from Supabase
  React.useEffect(() => {
    let isMounted = true;
    async function loadLessons() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("curriculum_nodes")
          .select("id, slug, phase_id, title, handbook_markdown, starter_code, test_suite, xp_reward")
          .order("id", { ascending: true })
          .limit(600);

        if (error) {
          console.error("Failed to load curriculum nodes from Supabase", error);
        }

        let nodesToUse = data;
        if (!nodesToUse || nodesToUse.length === 0) {
          // Fallback to sample modules from catalog if DB query returned nothing
          nodesToUse = COMPREHENSIVE_EXERCISES_CATALOG.slice(0, 10).map((ex) => ({
            id: ex.lessonId,
            slug: ex.lessonId,
            phase_id: "phase-0",
            title: ex.title,
            handbook_markdown: `# ${ex.title}\n\n${ex.descriptionMarkdown}`,
            starter_code: ex.starterCode,
            test_suite: ex.testSuite,
            xp_reward: 150,
          }));
        } else {
          // Naturally sort by node index: node-0-1, node-0-2, ... node-0-10
          const parseNodeRank = (id: string) => {
            const match = id.match(/node-(\d+)-(\d+)/);
            if (match) {
              return parseInt(match[1], 10) * 10000 + parseInt(match[2], 10);
            }
            return 999999;
          };
          nodesToUse = [...nodesToUse].sort((a: any, b: any) => parseNodeRank(a.id) - parseNodeRank(b.id));
        }

        if (isMounted && nodesToUse && nodesToUse.length > 0) {
          const formatted: WorkspaceLesson[] = nodesToUse.map((d: any) => {
            let sc = "";
            let ts = "";
            if (typeof d.starter_code === "object" && d.starter_code !== null) {
              sc = d.starter_code["solution.py"] || JSON.stringify(d.starter_code, null, 2);
            } else if (typeof d.starter_code === "string") {
              sc = d.starter_code;
            }

            if (typeof d.test_suite === "object" && d.test_suite !== null) {
              ts = d.test_suite["tests.py"] || JSON.stringify(d.test_suite, null, 2);
            } else if (typeof d.test_suite === "string") {
              ts = d.test_suite;
            }

            const enriched = ENRICHED_MODULE_HANDBOOKS[d.id];
            const rawTitle = enriched?.title || d.title;
            const coords = parseLessonCoordinates(d.id, rawTitle);
            const finalTitle = coords.displayTitle;
            const finalPhase = formatPhaseTitle(d.phase_id);
            const finalHandbook = enriched?.handbook || d.handbook_markdown || "Handbook content is being synthesized.";

            return {
              id: d.id,
              slug: d.slug,
              phase: finalPhase,
              title: finalTitle,
              handbook: finalHandbook,
              starterCode: sc || "# Write solution here\npass\n",
              testSuite: ts || "# Unit test suite\nassert True\n",
              criteria: undefined,
              failureMode: undefined,
              xpReward: d.xp_reward || 150,
            };
          });

          setLessons(formatted);

          // Find target lesson index
          let targetIndex = 0;
          if (initialLessonId) {
            const foundIdx = formatted.findIndex((l) => l.id === initialLessonId);
            if (foundIdx !== -1) targetIndex = foundIdx;
          }
          setCurrentLessonIndex(targetIndex);

          // Initialize starter code
          const initial = formatted[targetIndex];
          if (initial) {
            const paired = COMPREHENSIVE_EXERCISES_CATALOG.find((e) => e.lessonId === initial.id);
            setCode(paired?.starterCode || initial.starterCode);
          }
        }
      } catch (err) {
        console.error("Curriculum fetch error", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadLessons();
    return () => {
      isMounted = false;
    };
  }, [initialLessonId]);

  // Update starter code when switching lessons
  const handleSelectLesson = (index: number) => {
    setCurrentLessonIndex(index);
    const target = lessons[index];
    if (target) {
      const paired = COMPREHENSIVE_EXERCISES_CATALOG.find((e) => e.lessonId === target.id);
      setCode(paired?.starterCode || target.starterCode);
      setExecutionResult(null);
      setActiveMode("theory");
      setShowCheckpointPrompt(false);
      setLastActiveLessonId(target.id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex + 1 < lessons.length) {
      handleSelectLesson(currentLessonIndex + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      handleSelectLesson(currentLessonIndex - 1);
    }
  };

  // Complete Theory and transition to Exercise
  const handleCompleteTheory = () => {
    if (!currentLesson) return;
    setCompletedTheorySet((prev) => new Set(prev).add(currentLesson.id));
    setShowCheckpointPrompt(true);
  };

  const handleProceedToExercise = () => {
    setShowCheckpointPrompt(false);
    setActiveMode("exercise");
  };

  // Run sandbox execution
  const handleRunCode = async () => {
    if (!currentLesson) return;
    setIsRunning(true);
    setStatusMessage("Initializing Pyodide sandbox in isolated Web Worker...");

    try {
      const controller = getSandboxController();
      const testCode = pairedExercise?.testSuite || currentLesson.testSuite;

      const res = await controller.execute({
        id: `exercise-${currentLesson.id}`,
        language: "python",
        code: code,
        testAssertions: testCode,
        timeoutMs: 5000,
      });

      setExecutionResult(res);

      if (res.status === "SUCCESS") {
        setStatusMessage("✓ All test assertions passed successfully!");
        markExerciseCompleted(`ex-${currentLesson.id}`);
        markLessonCompleted(currentLesson.id, code);
      } else if (res.status === "TIMEOUT") {
        setStatusMessage("Execution timed out (5,000ms watchdog exceeded).");
      } else {
        setStatusMessage(res.errorMessage || "Assertions failed. Check test logs.");
      }
    } catch (err: any) {
      setStatusMessage(`Sandbox execution error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const isTheoryDone = currentLesson ? completedTheorySet.has(currentLesson.id) : false;
  const isExerciseDone = currentLesson ? completedLessons.includes(currentLesson.id) : false;
  const isModuleFullyMastered = isTheoryDone && isExerciseDone;

  if (isLoading || !currentLesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 space-y-4">
        <Loader2 className="w-8 h-8 text-[#5e6ad2] animate-spin" />
        <span className="text-xs font-mono text-[#8a8f98]">
          Loading module theory and verification assets...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Module Header & Mode Switcher Bar */}
      <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Module Information & Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#5e6ad2]/15 text-[#5e6ad2] border border-[#5e6ad2]/30 font-semibold">
                MODULE {currentLessonIndex + 1} OF {lessons.length}
              </span>
              <span className="text-xs font-mono text-[#8a8f98]">{currentLesson.phase}</span>
              <span className="text-xs font-mono text-[#383b42]">•</span>
              <span className="text-xs font-mono text-[#10b981] flex items-center gap-1">
                {isExerciseDone ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Exercise Mastered
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#e5993e]" />
                    Exercise Pending
                  </>
                )}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-[#f7f8f8] tracking-tight">
              {currentLesson.title}
            </h2>
          </div>

          {/* Dual-Phase Standalone Switcher */}
          <div className="flex items-center gap-2 bg-[#0f1011] p-1 rounded-lg border border-[#23252a] shrink-0">
            <button
              onClick={() => setActiveMode("theory")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-[5px] text-xs font-mono font-medium transition-all",
                activeMode === "theory"
                  ? "bg-[#16171a] text-white border border-[#2e3038] shadow-sm font-semibold"
                  : "text-[#8a8f98] hover:text-[#f7f8f8]"
              )}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>1. Theory Module</span>
              {isTheoryDone && <Check className="w-3 h-3 text-[#10b981]" />}
            </button>

            <button
              onClick={() => setActiveMode("exercise")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-[5px] text-xs font-mono font-medium transition-all",
                activeMode === "exercise"
                  ? "bg-[#16171a] text-white border border-[#2e3038] shadow-sm font-semibold"
                  : "text-[#8a8f98] hover:text-[#f7f8f8]"
              )}
            >
              <Code2 className="w-3.5 h-3.5 text-[#10b981]" />
              <span>2. Module Exercise</span>
              {isExerciseDone && <Check className="w-3 h-3 text-[#10b981]" />}
            </button>
          </div>

          {/* Module Prev/Next Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="xs"
              onClick={handlePrevLesson}
              disabled={currentLessonIndex === 0}
              className="gap-1 font-mono text-[11px]"
              title="Previous Module"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={handleNextLesson}
              disabled={currentLessonIndex + 1 >= lessons.length}
              className="gap-1 font-mono text-[11px]"
              title="Next Module"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: STANDALONE THEORY & ARCHITECTURE (NO SPLIT CROWDING)             */}
      {/* ========================================================================= */}
      {activeMode === "theory" && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          {/* Main Reading Canvas */}
          <div className="rounded-xl bg-[#0f1011] border border-[#23252a] p-6 lg:p-10 shadow-xl space-y-6">
            <HandbookViewer
              content={currentLesson.handbook}
            />

            {/* End-of-Module Theory Checkpoint Gate */}
            <div className="mt-12 pt-8 border-t border-[#23252a] space-y-4">
              <div className="rounded-lg bg-[#08090a] border border-[#5e6ad2]/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-[#5e6ad2]/50" />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-xs font-mono text-[#10b981] font-semibold uppercase">
                      Theory Reading Checkpoint
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#f7f8f8]">
                    Ready to prove your understanding in code?
                  </h3>
                  <p className="text-xs text-[#8a8f98] max-w-xl leading-relaxed">
                    You have reviewed the architectural models and failure invariants. The paired exercise module will verify your implementation with real unit test assertions.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCompleteTheory}
                    className="gap-2 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white shadow-lg shadow-[#5e6ad2]/20 whitespace-nowrap"
                  >
                    <span>Complete Theory &amp; Launch Exercise</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: STANDALONE MODULE PRACTICE EXERCISE IDE                          */}
      {/* ========================================================================= */}
      {activeMode === "exercise" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Formatted Standalone Exercise Specifications & Test Criteria */}
          {pairedExercise ? (
            <ExerciseFormatter
              exercise={pairedExercise}
              onNavigateToTheory={() => setActiveMode("theory")}
              showTheoryLink={true}
            />
          ) : (
            <div className="rounded-xl bg-[#0b0c0e] border border-[#23252a] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1f2126] pb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#10b981]" />
                  <h3 className="text-sm font-bold text-[#f7f8f8] font-mono">
                    Module Practice Challenge: {currentLesson.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveMode("theory")}
                  className="text-xs font-mono text-[#8a8f98] hover:text-white transition-colors"
                >
                  ← Review Theory
                </button>
              </div>
              <p className="text-xs font-mono text-[#d0d6e0] leading-relaxed">
                <strong>Verification Invariant:</strong>{" "}
                {currentLesson.criteria ||
                  "Implement the function adhering strictly to the constraints in the module theory."}
              </p>
            </div>
          )}

          {/* Standalone Full-Width Code Editor & Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left/Main: Full Height Code Editor */}
            <div className="lg:col-span-8 rounded-xl bg-[#08090a] border border-[#23252a] overflow-hidden shadow-2xl flex flex-col">
              {/* Editor Tabs & Run Action */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1b1c20] bg-[#0f1012]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEditorTab("solution")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-mono transition-colors",
                      activeEditorTab === "solution"
                        ? "bg-[#16171a] text-white border border-[#2e3038]"
                        : "text-[#8a8f98] hover:text-white"
                    )}
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    <span>solution.py</span>
                  </button>
                  <button
                    onClick={() => setActiveEditorTab("tests")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-mono transition-colors",
                      activeEditorTab === "tests"
                        ? "bg-[#16171a] text-white border border-[#2e3038]"
                        : "text-[#8a8f98] hover:text-white"
                    )}
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>tests.py</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white gap-1.5"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Test Suite</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Editor Body */}
              <div className="p-2 flex-1 min-h-[350px]">
                <CodeEditor
                  value={activeEditorTab === "solution" ? code : pairedExercise?.testSuite || currentLesson.testSuite}
                  onChange={(val) => {
                    if (activeEditorTab === "solution") setCode(val);
                  }}
                  language="python"
                  minHeight="360px"
                  readOnly={activeEditorTab === "tests"}
                />
              </div>
            </div>

            {/* Right: Live Terminal & Test Results */}
            <div className="lg:col-span-4 flex flex-col justify-between rounded-xl bg-[#08090a] border border-[#23252a] overflow-hidden shadow-2xl">
              <div className="p-3 bg-[#0f1012] border-b border-[#1b1c20] flex items-center justify-between text-xs font-mono text-[#8a8f98]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
                  <span>TEST RUNNER OUTPUT</span>
                </div>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded border font-semibold",
                    executionResult?.status === "SUCCESS"
                      ? "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30"
                      : executionResult?.status === "FAILED"
                      ? "text-[#eb5757] bg-[#eb5757]/10 border-[#eb5757]/30"
                      : "text-[#8a8f98] bg-[#141516] border-[#23252a]"
                  )}
                >
                  {executionResult ? executionResult.status : "IDLE"}
                </span>
              </div>

              <div className="p-4 flex-1 font-mono text-xs text-[#8a8f98] overflow-y-auto max-h-[300px] leading-relaxed space-y-2">
                <div className="text-[#565961] text-[11px]">{statusMessage}</div>
                {executionResult?.output && (
                  <pre className="text-xs text-[#d0d6e0] whitespace-pre-wrap">
                    {executionResult.output}
                  </pre>
                )}
                {executionResult?.errorMessage && (
                  <pre className="text-xs text-[#eb5757] whitespace-pre-wrap">
                    {executionResult.errorMessage}
                  </pre>
                )}
              </div>

              {/* Next Step Action if Passed */}
              {executionResult?.status === "SUCCESS" && (
                <div className="p-4 bg-[#10b981]/10 border-t border-[#10b981]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Module Mastered! (+{currentLesson.xpReward} XP)</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNextLesson}
                    className="w-full font-mono text-xs bg-[#10b981] hover:bg-[#10b981]/90 text-black font-semibold gap-1"
                  >
                    <span>Proceed to Next Module →</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkpoint Modal Prompt */}
      {showCheckpointPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl bg-[#0f1011] border border-[#23252a] p-6 space-y-6 shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 mx-auto flex items-center justify-center text-[#5e6ad2]">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-semibold">
                THEORY CHECKPOINT VERIFIED
              </span>
              <h3 className="text-lg font-bold text-[#f7f8f8]">
                Module Theory Completed!
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed max-w-md mx-auto">
                You have completed reading the foundational architectural theory for{" "}
                <strong className="text-white">{currentLesson.title}</strong>.
                <br /><br />
                Now, prove your mastery in code by solving the paired exercise module.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleProceedToExercise}
                className="w-full font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white gap-2 shadow-lg shadow-[#5e6ad2]/20"
              >
                <span>Launch Practice Exercise IDE</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowCheckpointPrompt(false)}
                className="w-full sm:w-auto font-mono text-xs text-[#8a8f98]"
              >
                <span>Review More</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
