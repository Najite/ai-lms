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
  createExercisesFromNode,
} from "@/lib/exercises-catalog";
import { parseLessonCoordinates, formatLabIdentifier } from "@/lib/curriculum-numbering";
import { useCurriculumProgress } from "@/lib/progress-tracker";
import { CodeEditor } from "@/components/ui/code-editor";
import { ExerciseFormatter } from "./exercise-formatter";
import { fetchLessonDetail } from "@/lib/db-curriculum";
import { useCurriculumCatalog } from "@/lib/curriculum-store";
import { CURRICULUM_META } from "@/lib/curriculum-meta";

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

  // Curated exercises catalog with on-demand drill synthesis
  const [allExercises, setAllExercises] = React.useState<ExerciseItem[]>(COMPREHENSIVE_EXERCISES_CATALOG);

  // Lesson metadata derived from the shared catalog (no `await`, no spinner).
  const { curriculum } = useCurriculumCatalog();
  const lessonsMap = React.useMemo(() => {
    const map: Record<string, { title: string; phase: string }> = {};
    if (curriculum) {
      for (const d of curriculum.allNodes) {
        map[d.id] = { title: d.title, phase: d.phase_id };
      }
    }
    return map;
  }, [curriculum]);

  /**
   * Honest coverage: lessons that actually have at least one companion lab over
   * the real lesson total. This tile used to hardcode "100% of Lessons" while the
   * database holds 700 lessons and only ~30 exercises.
   */
  const { coveragePercent, exerciseCoverageLabel } = React.useMemo(() => {
    const lessonIdsWithLab = new Set(allExercises.map((ex) => ex.lessonId));
    const total = curriculum?.totalLessons || CURRICULUM_META.totalLessons;
    const pct = Math.round((lessonIdsWithLab.size / total) * 100);
    return {
      coveragePercent: `${pct}%`,
      exerciseCoverageLabel: `${pct}% In-Browser WASM`,
    };
  }, [allExercises, curriculum]);

  // PERF-01: build the membership Sets ONCE per change instead of running
  // `Array.includes()` for every rendered row on every render.
  const completedLessonSet = React.useMemo(() => new Set(completedLessons), [completedLessons]);
  const completedExerciseSet = React.useMemo(() => new Set(completedExercises), [completedExercises]);

  // Synthesize drills for an initialLessonId that is not in the curated catalog.
  React.useEffect(() => {
    let isMounted = true;
    async function synthesizeInitial() {
      if (!initialLessonId) return;
      try {
        const alreadyExists = COMPREHENSIVE_EXERCISES_CATALOG.some((ex) => ex.lessonId === initialLessonId);
        if (alreadyExists) return;
        const detail = await fetchLessonDetail(initialLessonId);
        if (isMounted) {
          const ladder = createExercisesFromNode(detail);
          // PERF-01: id-keyed merge. `[...ladder, ...prev]` duplicated rows when
          // StrictMode double-invoked this effect, inflating every count on screen.
          setAllExercises((prev) => {
            const byId = new Map<string, ExerciseItem>();
            for (const item of prev) byId.set(item.id, item);
            for (const item of ladder) {
              if (!byId.has(item.id)) byId.set(item.id, item);
            }
            return Array.from(byId.values());
          });
          if (ladder.length > 0) {
            setSelectedExerciseId(ladder[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load curriculum exercises", err);
      }
    }
    synthesizeInitial();
    return () => {
      isMounted = false;
    };
  }, [initialLessonId]);

  // Pre-select exercise corresponding to initialLessonId if provided
  React.useEffect(() => {
    if (initialLessonId) {
      const found = allExercises.find((ex) => ex.lessonId === initialLessonId);
      if (found) {
        setSelectedExerciseId(found.id);
      }
    }
  }, [initialLessonId, allExercises]);

  const activeExercise =
    allExercises.find((ex) => ex.id === selectedExerciseId) ||
    allExercises[0] ||
    COMPREHENSIVE_EXERCISES_CATALOG[0];

  // Sync starter code when active exercise changes
  React.useEffect(() => {
    if (activeExercise) {
      setCode(activeExercise.starterCode);
      setResult(null);
      setStatusMessage("Loaded exercise. Test against constraints.");
      setShowHint(false);
    }
  }, [activeExercise?.id]);

  const isUnlocked = isExerciseUnlocked(
    activeExercise,
    completedLessonSet,
    completedExerciseSet
  );

  const isCompleted = completedExerciseSet.has(activeExercise.id);

  const handleRunCode = async () => {
    if (!isUnlocked) {
      setStatusMessage("Cannot run code: this exercise is locked until the parent lesson is completed.");
      return;
    }

    setIsRunning(true);
    setStatusMessage("Executing test assertions in Pyodide WASM environment...");

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
      setStatusMessage(`Execution note: ${err.message || "Execution finished"}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(activeExercise.starterCode);
    setResult(null);
    setStatusMessage("Code reset to initial starter template.");
  };

  // PERF-01: memoized filter — the query is lowercased ONCE per keystroke rather
  // than `toLowerCase()` re-running for every item and every needle per render.
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredExercises = React.useMemo(
    () =>
      allExercises.filter((ex) => {
        const matchesDiff = filterDifficulty === "ALL" || ex.difficulty === filterDifficulty;
        const lessonInfo = lessonsMap[ex.lessonId];
        const matchesPhase =
          filterPhase === "ALL" || (lessonInfo && lessonInfo.phase === filterPhase);
        const matchesSearch =
          !normalizedQuery ||
          ex.title.toLowerCase().includes(normalizedQuery) ||
          (ex.leetcodeEquivalent != null &&
            ex.leetcodeEquivalent.toLowerCase().includes(normalizedQuery)) ||
          ex.tags.some((t) => t.toLowerCase().includes(normalizedQuery));

        return matchesDiff && matchesPhase && matchesSearch;
      }),
    [allExercises, filterDifficulty, filterPhase, normalizedQuery, lessonsMap]
  );

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-xl bg-[#08090a] border border-[#23252a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusChip status="brand" label="LESSON COMPANION LABS" />
            <span className="text-xs font-mono text-[#8a8f98]">
              {completedExercises.length} / {allExercises.length} Solved
            </span>
            <span className="text-[#383b42]">•</span>
            <span className="text-xs font-mono text-[#10b981]">
              {exerciseCoverageLabel} • Self-Paced
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f7f8f8] tracking-tight">
            Hands-On Engineering Labs & Algorithmic Drills
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] max-w-3xl mt-1 leading-relaxed">
            {curriculum ? (
              <>
                Every one of the {curriculum.totalLessons} lessons has an active hands-on lab exercise. Once you
                complete the theory for a lesson in the Workspace, its companion lab unlocks so you can verify your
                understanding at your own pace.
              </>
            ) : (
              <>
                Every lesson has an active hands-on lab exercise. Once you complete the theory for a lesson in the
                Workspace, its companion lab unlocks so you can verify your understanding at your own pace.
              </>
            )}
          </p>
        </div>

        {/* Action quick stats */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1011] border border-[#23252a] text-xs font-mono shrink-0">
          <div className="pr-3 border-r border-[#23252a]">
            <span className="text-[#8a8f98] block text-[10px]">SOLVED</span>
            <span className="text-[#10b981] font-semibold text-sm">{completedExercises.length}</span>
          </div>
          <div className="pr-3 border-r border-[#23252a]">
            <span className="text-[#8a8f98] block text-[10px]">AVAILABLE</span>
            <span className="text-[#5e6ad2] font-semibold text-sm">
              {allExercises.length} Labs
            </span>
          </div>
          <div>
            <span className="text-[#8a8f98] block text-[10px]">COVERAGE</span>
            <span className="text-[#10b981] font-semibold text-sm">{coveragePercent} of Lessons</span>
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

            {/* Grouped Exercise List by Lesson */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {Object.entries(
                filteredExercises.reduce((acc, ex) => {
                  if (!acc[ex.lessonId]) acc[ex.lessonId] = [];
                  acc[ex.lessonId].push(ex);
                  return acc;
                }, {} as Record<string, ExerciseItem[]>)
              ).map(([lessonId, exercises]) => {
                const parentLesson = lessonsMap[lessonId];
                const coords = parseLessonCoordinates(lessonId, parentLesson?.title);
                const displayLessonTitle = coords.displayTitle;
                const isLessonDone = completedLessonSet.has(lessonId);
                const lessonSolvedCount = exercises.reduce(
                  (n, e) => (completedExerciseSet.has(e.id) ? n + 1 : n),
                  0
                );

                return (
                  <div key={lessonId} className="rounded-lg bg-[#0c0d10] border border-[#1f2126] p-2.5 space-y-2">
                    {/* Lesson Header Anchor with 1-based numbering */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#1b1c20]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2] shrink-0" />
                        <span className="text-[11px] font-mono font-semibold text-[#f7f8f8] truncate" title={displayLessonTitle}>
                          {displayLessonTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
                        {isLessonDone ? (
                          <span className="text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Lesson Pass</span>
                          </span>
                        ) : (
                          <span className="text-[#8a8f98] bg-[#16171a] px-1.5 py-0.5 rounded">
                            Theory In Progress
                          </span>
                        )}
                        <span className="text-[#565961]">
                          {lessonSolvedCount}/{exercises.length}
                        </span>
                      </div>
                    </div>

                    {/* Exercises within this lesson */}
                    <div className="space-y-1.5 pl-1">
                      {exercises.map((ex) => {
                        const unlocked = isExerciseUnlocked(ex, completedLessonSet, completedExerciseSet);
                        const solved = completedExerciseSet.has(ex.id);
                        const isSelected = ex.id === activeExercise.id;
                        const labTag = formatLabIdentifier(ex.lessonId, ex.orderIndex);

                        return (
                          <div
                            key={ex.id}
                            onClick={() => setSelectedExerciseId(ex.id)}
                            className={cn(
                              "p-2 rounded-md border text-left cursor-pointer transition-all flex flex-col gap-1",
                              isSelected
                                ? "bg-[#16181d] border-[#5e6ad2]/60 shadow-sm"
                                : "bg-[#07080a] border-[#23252a] hover:bg-[#0f1012] hover:border-[#383b42]"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 truncate">
                                {solved ? (
                                   <CheckCircle2 className="w-3 h-3 text-[#10b981] shrink-0" />
                                ) : unlocked ? (
                                   <Play className="w-2.5 h-2.5 text-[#5e6ad2] fill-current opacity-70 shrink-0" />
                                ) : (
                                   <Lock className="w-2.5 h-2.5 text-[#565961] shrink-0" />
                                )}
                                <span className="text-[10px] font-mono text-[#5e6ad2] font-semibold shrink-0">
                                  {labTag}
                                </span>
                                <span className={cn("text-xs font-medium truncate", isSelected ? "text-[#f7f8f8]" : "text-[#c1c7d0]")}>
                                  {ex.title}
                                </span>
                              </div>
                              <span
                                className={cn(
                                  "text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0",
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

                            <div className="flex items-center justify-between text-[9px] font-mono text-[#717680]">
                              <span>Part {ex.orderIndex} of {exercises.length}</span>
                              <span className="text-[#5e6ad2] uppercase font-semibold">{ex.tier}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#23252a] flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
            <span>Self-Paced Mastery Progression</span>
            <span className="text-[#10b981]">Complete at your own speed</span>
          </div>
        </div>

        {/* Right Column: Problem Description & Interactive Editor */}
        <div className="lg:col-span-8 flex flex-col bg-[#08090a] border border-[#23252a] rounded-xl overflow-hidden shadow-2xl">
          {/* Formatted Exercise Specification Card */}
          <div className="p-4 border-b border-[#23252a] bg-[#07080a]">
            <ExerciseFormatter
              exercise={activeExercise}
              onNavigateToTheory={onNavigateToLesson ? () => onNavigateToLesson(activeExercise.lessonId) : undefined}
              showTheoryLink={!!onNavigateToLesson}
            />
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
