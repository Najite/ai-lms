"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Code2,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  HelpCircle,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Loader2,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { getSandboxController } from "@/lib/sandbox/sandbox-controller";
import { ExecutionResult } from "@/lib/sandbox/types";
import { cn } from "@/lib/utils";
import {
  COMPREHENSIVE_EXERCISES_CATALOG,
  ExerciseItem,
  isExerciseUnlocked,
} from "@/lib/exercises-catalog";
import { useCurriculumProgress } from "@/lib/progress-tracker";
import { supabase } from "@/lib/supabase";
import { CodeEditor } from "@/components/ui/code-editor";

interface ExerciseViewProps {
  initialLessonId?: string | null;
  onNavigateToLesson?: (lessonId: string) => void;
}

export function ExerciseView({ initialLessonId, onNavigateToLesson }: ExerciseViewProps) {
  const {
    completedLessons,
    completedExercises,
    markExerciseCompleted,
  } = useCurriculumProgress();

  const [lessonsMap, setLessonsMap] = React.useState<Record<string, { title: string; phase: string }>>({});
  const [selectedExerciseId, setSelectedExerciseId] = React.useState<string>(
    COMPREHENSIVE_EXERCISES_CATALOG[0]?.id || "ex-0-1-1"
  );
  const [code, setCode] = React.useState<string>("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [statusMessage, setStatusMessage] = React.useState("Ready to execute test assertions.");
  const [filterDifficulty, setFilterDifficulty] = React.useState<string>("ALL");
  const [filterPhase, setFilterPhase] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [showHint, setShowHint] = React.useState(false);

  // Fetch lesson titles to label each exercise group accurately
  React.useEffect(() => {
    async function loadLessonTitles() {
      const { data } = await supabase
        .from("curriculum_nodes")
        .select("id, title, phase_id")
        .order("id", { ascending: true });

      if (data) {
        const map: Record<string, { title: string; phase: string }> = {};
        for (const d of data) {
          map[d.id] = { title: d.title, phase: d.phase_id };
        }
        setLessonsMap(map);
      }
    }
    loadLessonTitles();
  }, []);

  // Pre-select exercise corresponding to initialLessonId if provided
  React.useEffect(() => {
    if (initialLessonId) {
      const found = COMPREHENSIVE_EXERCISES_CATALOG.find((ex) => ex.lessonId === initialLessonId);
      if (found) {
        setSelectedExerciseId(found.id);
      }
    }
  }, [initialLessonId]);

  const activeExercise =
    COMPREHENSIVE_EXERCISES_CATALOG.find((ex) => ex.id === selectedExerciseId) ||
    COMPREHENSIVE_EXERCISES_CATALOG[0];

  // Sync starter code when active exercise changes
  React.useEffect(() => {
    if (activeExercise) {
      setCode(activeExercise.starterCode);
      setResult(null);
      setStatusMessage("Loaded exercise. Test against constraints.");
      setShowHint(false);
    }
  }, [activeExercise.id]);

  const isUnlocked = isExerciseUnlocked(
    activeExercise,
    completedLessons,
    completedExercises
  );

  const isCompleted = completedExercises.includes(activeExercise.id);

  const handleRunCode = async () => {
    if (!isUnlocked) {
      setStatusMessage("Cannot run code: this exercise is locked until the parent lesson is completed.");
      return;
    }

    setIsRunning(true);
    setStatusMessage("Running Pyodide WASM runtime with 5s watchdog...");

    try {
      const controller = getSandboxController();
      const res = await controller.execute({
        id: activeExercise.id,
        language: "python",
        code: code,
        testAssertions: activeExercise.testSuite,
        timeoutMs: 5000,
      });

      setResult(res);
      if (res.status === "SUCCESS") {
        setStatusMessage(`✓ All test assertions passed in ${(res.executionDurationMs / 1000).toFixed(3)}s`);
        markExerciseCompleted(activeExercise.id);
      } else {
        setStatusMessage(`✗ Test failed: ${res.errorMessage || "AssertionError"}`);
      }
    } catch (err: any) {
      setStatusMessage(`Runtime error: ${err.message || "Execution failed"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(activeExercise.starterCode);
    setResult(null);
    setStatusMessage("Code reset to initial starter template.");
  };

  const filteredExercises = COMPREHENSIVE_EXERCISES_CATALOG.filter((ex) => {
    const matchesDiff = filterDifficulty === "ALL" || ex.difficulty === filterDifficulty;
    const lessonInfo = lessonsMap[ex.lessonId];
    const matchesPhase =
      filterPhase === "ALL" || (lessonInfo && lessonInfo.phase === filterPhase);
    const matchesSearch =
      !searchQuery ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ex.leetcodeEquivalent && ex.leetcodeEquivalent.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDiff && matchesPhase && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-xl bg-[#08090a] border border-[#23252a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusChip status="brand" label="DSA & SYSTEMS DRILLS" />
            <span className="text-xs font-mono text-[#8a8f98]">
              {completedExercises.length} / {COMPREHENSIVE_EXERCISES_CATALOG.length} Solved
            </span>
            <span className="text-[#383b42]">•</span>
            <span className="text-xs font-mono text-[#10b981]">
              Zero LeetCode API Dependency • 100% In-Browser WASM
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f7f8f8] tracking-tight">
            Algorithmic Archetypes & Enterprise Engineering Challenges
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] max-w-3xl mt-1 leading-relaxed">
            Every exercise is strictly locked until you complete its corresponding lesson theory in the Interactive IDE.
            Progresses gently from beginner warmups to canonical LeetCode interview logic and production AI/systems failure modes.
          </p>
        </div>

        {/* Action quick stats */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1011] border border-[#23252a] text-xs font-mono shrink-0">
          <div className="pr-3 border-r border-[#23252a]">
            <span className="text-[#8a8f98] block text-[10px]">SOLVED</span>
            <span className="text-[#10b981] font-semibold text-sm">{completedExercises.length}</span>
          </div>
          <div className="pr-3 border-r border-[#23252a]">
            <span className="text-[#8a8f98] block text-[10px]">LOCKED</span>
            <span className="text-[#e5993e] font-semibold text-sm">
              {COMPREHENSIVE_EXERCISES_CATALOG.length - completedExercises.length}
            </span>
          </div>
          <div>
            <span className="text-[#8a8f98] block text-[10px]">TIERS</span>
            <span className="text-[#5e6ad2] font-semibold text-sm">4 per Lesson</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Left Problem Selector, Right IDE Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Column: Problem Filters & List */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#08090a] border border-[#23252a] rounded-xl p-4 shadow-xl space-y-4">
          <div className="space-y-3">
            {/* Search and Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8a8f98] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archetypes, tags..."
                className="w-full bg-[#0f1011] border border-[#23252a] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-[#f7f8f8] placeholder-[#565961] focus:outline-none focus:border-[#5e6ad2]"
              />
            </div>

            {/* Difficulty Filter Tabs */}
            <div className="flex items-center gap-1">
              {["ALL", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-mono rounded transition-colors",
                    filterDifficulty === diff
                      ? "bg-[#5e6ad2] text-white"
                      : "bg-[#0f1011] text-[#8a8f98] hover:text-white border border-[#23252a]"
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredExercises.map((ex) => {
                const unlocked = isExerciseUnlocked(ex, completedLessons, completedExercises);
                const solved = completedExercises.includes(ex.id);
                const isSelected = ex.id === activeExercise.id;
                const parentLesson = lessonsMap[ex.lessonId];

                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={cn(
                      "p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col gap-1.5",
                      isSelected
                        ? "bg-[#141516] border-[#5e6ad2]/50 shadow-md"
                        : "bg-[#0b0c0e] border-[#23252a] hover:bg-[#0f1011] hover:border-[#383b42]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        {solved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                        ) : unlocked ? (
                          <Play className="w-3 h-3 text-[#5e6ad2] fill-current opacity-70 shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#565961] shrink-0" />
                        )}
                        <span className={cn("text-xs font-semibold truncate", isSelected ? "text-[#f7f8f8]" : "text-[#d0d6e0]")}>
                          {ex.title}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0",
                          ex.difficulty === "Easy"
                            ? "bg-[#10b981]/10 text-[#10b981]"
                            : ex.difficulty === "Medium"
                            ? "bg-[#e5993e]/10 text-[#e5993e]"
                            : "bg-[#ef4444]/10 text-[#ef4444]"
                        )}
                      >
                        {ex.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8f98]">
                      <span className="truncate">{parentLesson ? parentLesson.title.split(":")[0] : ex.lessonId}</span>
                      <span className="text-[#5e6ad2] uppercase">{ex.tier}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#23252a] flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
            <span>Progression: Locked Until Lesson Pass</span>
            <span className="text-[#10b981]">100% Free</span>
          </div>
        </div>

        {/* Right Column: Problem Description & Interactive Editor */}
        <div className="lg:col-span-8 flex flex-col bg-[#08090a] border border-[#23252a] rounded-xl overflow-hidden shadow-2xl">
          {/* Header of Active Exercise */}
          <div className="p-4 bg-[#0f1011] border-b border-[#23252a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#5e6ad2] font-semibold">
                  {activeExercise.id.toUpperCase()}
                </span>
                <span className="text-[#383b42]">•</span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
                    activeExercise.difficulty === "Easy"
                      ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                      : activeExercise.difficulty === "Medium"
                      ? "bg-[#e5993e]/10 text-[#e5993e] border border-[#e5993e]/30"
                      : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30"
                  )}
                >
                  {activeExercise.difficulty}
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    SOLVED
                  </span>
                )}
                {!isUnlocked && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#565961]/20 text-[#8a8f98] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    LOCKED
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-[#f7f8f8] mt-1">
                {activeExercise.title}
              </h3>
              {activeExercise.leetcodeEquivalent && (
                <div className="text-[11px] font-mono text-[#8a8f98] mt-0.5">
                  LeetCode Pattern: <span className="text-[#d0d6e0]">{activeExercise.leetcodeEquivalent}</span>
                </div>
              )}
            </div>

            {/* Parent lesson link */}
            <div className="flex items-center gap-2">
              {onNavigateToLesson && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToLesson(activeExercise.lessonId)}
                  className="gap-1.5 font-mono text-xs text-[#8a8f98] hover:text-white"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2]" />
                  <span>View Parent Lesson</span>
                </Button>
              )}
            </div>
          </div>

          {/* Locked Notice if Not Unlocked */}
          {!isUnlocked && (
            <div className="p-4 bg-[#e5993e]/10 border-b border-[#e5993e]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#e5993e]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  This challenge is locked. Complete the interactive AST assertions for{" "}
                  <strong>{lessonsMap[activeExercise.lessonId]?.title || activeExercise.lessonId}</strong> to unlock.
                </span>
              </div>
              {onNavigateToLesson && (
                <Button
                  size="xs"
                  onClick={() => onNavigateToLesson(activeExercise.lessonId)}
                  className="gap-1 bg-[#e5993e] hover:bg-[#f59e0b] text-black font-semibold shrink-0"
                >
                  <span>Go to Lesson</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}

          {/* Split Body: Top Description, Bottom Code Editor */}
          <div className="p-4 border-b border-[#23252a] bg-[#0b0c0e] max-h-56 overflow-y-auto font-sans text-xs text-[#d0d6e0] space-y-2 leading-relaxed">
            <div className="whitespace-pre-wrap font-mono text-[11px]">
              {activeExercise.descriptionMarkdown}
            </div>

            {/* Hint Section */}
            {activeExercise.hints.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-mono text-[#5e6ad2] hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHint ? "Hide Algorithmic Hint" : "Need a Hint? (Anti-Slop)"}</span>
                </button>
                {showHint && (
                  <ul className="mt-2 space-y-1 pl-4 list-disc text-xs font-mono text-[#8a8f98]">
                    {activeExercise.hints.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#0f1011] border-b border-[#23252a]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f98]">
              <Code2 className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>solution.py</span>
            </div>

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
                disabled={isRunning || !isUnlocked}
                className="gap-1.5 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? "Verifying..." : "Run Assertions"}</span>
              </Button>
            </div>
          </div>

          {/* Code Input Area with Professional Line Numbers & PEP-8 Smart Indentation */}
          <div className="relative flex-1 min-h-[260px] flex flex-col">
            <CodeEditor
              value={code}
              disabled={!isUnlocked}
              onChange={(val) => setCode(val)}
              onRun={handleRunCode}
              minHeight="280px"
              language="python"
            />
          </div>

          {/* Terminal Output */}
          <div className="border-t border-[#23252a] bg-[#08090a] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8a8f98]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
                <span>Assertion Evaluation Console</span>
              </div>
              <span className="text-[11px] text-[#565961]">{statusMessage}</span>
            </div>

            <div className="rounded-lg bg-[#010102] border border-[#23252a] p-3 font-mono text-xs text-[#d0d6e0] min-h-[100px] max-h-[140px] overflow-y-auto">
              {result ? (
                <div className="space-y-1">
                  {result.output && (
                    <div className="whitespace-pre-wrap text-[#8a8f98]">{result.output}</div>
                  )}
                  {result.status === "SUCCESS" ? (
                    <div className="text-[#10b981] font-semibold flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>All Test Assertions Passed in {(result.executionDurationMs / 1000).toFixed(3)}s</span>
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
                  <span>Click &apos;Run Assertions&apos; to execute the Pyodide test suite in-browser.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
