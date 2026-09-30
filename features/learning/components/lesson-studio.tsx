"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLesson } from "../hooks/use-lesson";
import { useUser } from "@/features/auth";
import { LessonHeader } from "./lesson-header";
import { LessonOverviewCards } from "./lesson-overview-cards";
import { LessonViewer } from "./lesson-viewer";
import { CompetencyProgressCard } from "./competency-progress-card";
import { ModuleProgressHud } from "./module-progress-hud";
import { StaffMetadataDrawer } from "./staff-metadata-drawer";
import { LessonNavigation } from "./lesson-navigation";
import { LessonExerciseCard } from "./lesson-exercise-card";
import { LearningBreadcrumbs } from "./learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ExerciseWorkspace } from "@/features/exercises/components/exercise-workspace";
import {
  Menu,
  X,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Check,
  BookOpen,
  Code2,
  Terminal,
} from "lucide-react";
import { parseLessonContent } from "../utils/lesson-content-parser";
import type { LessonNavigationContext, LessonSummary, UserLearningProgress } from "../types";
import { cn } from "@/lib/utils";

export interface LessonStudioProps {
  initialContext: LessonNavigationContext;
  siblingLessons: (LessonSummary & { progress?: UserLearningProgress | null })[];
  pathSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function LessonStudio({
  initialContext,
  siblingLessons,
  pathSlug,
  moduleSlug,
  lessonSlug,
}: LessonStudioProps) {
  const {
    context,
    lesson,
    module,
    path,
    progress,
    isActionLoading,
    error,
    startLesson,
    completeLesson,
  } = useLesson(pathSlug, moduleSlug, lessonSlug);

  const { isInstructor, isAdmin } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studioMode, setStudioMode] = useState<"lesson" | "exercise">("lesson");

  // Auto-start lesson on mount if not yet started
  useEffect(() => {
    const currentStatus = progress?.status || initialContext.progress?.status;
    if (!currentStatus || currentStatus === "not_started") {
      startLesson();
    }
  }, [progress?.status, initialContext.progress?.status, startLesson]);

  const activeContext = context || initialContext;
  const activeLesson = lesson || initialContext.currentLesson;
  const activeModule = module || initialContext.currentModule;
  const activePath = path || initialContext.currentPath;
  const activeProgress = progress || initialContext.progress;
  const exercise = activeContext.exercise;

  // Parse markdown content to extract clean body, why this matters, and staff metadata
  const parsed = useMemo(() => {
    return parseLessonContent(activeLesson.content, activeLesson.summary);
  }, [activeLesson.content, activeLesson.summary]);

  const isCompleted = activeProgress?.status === "completed";
  const isExerciseCompleted = !!exercise?.completion;
  const nextLesson = activeContext.nextLesson;
  const nextUrl = nextLesson
    ? `/learning-paths/${nextLesson.pathSlug}/modules/${nextLesson.moduleSlug}/lessons/${nextLesson.lessonSlug}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {/* 1. Global Navigation Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-base font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
              {siteConfig.shortName}
            </span>
          </Link>
          <div className="hidden md:block h-4 w-px bg-border/60 shrink-0" />
          <div className="hidden md:block truncate">
            <LearningBreadcrumbs
              items={[
                { label: "Learning Paths", href: "/learning-paths" },
                { label: activePath.title, href: `/learning-paths/${activePath.slug}` },
                {
                  label: activeModule.title,
                  href: `/learning-paths/${activePath.slug}/modules/${activeModule.slug}`,
                },
                { label: activeLesson.title },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile Curriculum Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle Curriculum Playlist"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <UserMenu />
        </div>
      </header>

      {/* 2. Main Studio Workspace: 70/30 Desktop Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 lg:pb-12">
        {/* Left Column: Main Stage (70% Width) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 space-y-8">
          {/* Mode Switcher Bar when exercise exists */}
          {exercise && (
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-card/60 border border-border/80 backdrop-blur-sm shadow-xs">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setStudioMode("lesson")}
                  className={cn(
                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                    studioMode === "lesson"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Theory & Reading</span>
                </button>

                <button
                  onClick={() => setStudioMode("exercise")}
                  className={cn(
                    "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                    studioMode === "exercise"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>2. Practical Exercise</span>
                  {isExerciseCompleted ? (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                      {exercise.completion?.score}%
                    </span>
                  ) : (
                    <span className="bg-primary/20 text-primary border border-primary/40 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                      Lab
                    </span>
                  )}
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono pr-2">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>{exercise.title.split(":")[0] || "EXE-00-01"}</span>
              </div>
            </div>
          )}

          {/* Mode 1: Lesson Theory & Content */}
          {studioMode === "lesson" ? (
            <>
              {/* Lesson Header Banner */}
              <LessonHeader
                lesson={activeLesson}
                module={activeModule}
                path={activePath}
                progress={activeProgress}
                totalModuleLessons={siblingLessons.length || 5}
              />

              {/* Orientation Cards: Why This Matters & Learning Outcomes */}
              <LessonOverviewCards
                whyThisMatters={parsed.whyThisMatters}
                learningOutcomes={parsed.learningOutcomes}
                prerequisites={parsed.prerequisitesList}
              />

              {/* Core Markdown Instructional Content Studio */}
              <section className="bg-card/40 border border-border/60 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-sm">
                <LessonViewer
                  content={parsed.cleanBody}
                  title={activeLesson.title}
                />
              </section>

              {/* Practical Exercise Launcher Section (if exercise exists) */}
              {exercise && (
                <LessonExerciseCard
                  exercise={exercise}
                  pathSlug={pathSlug}
                  moduleSlug={moduleSlug}
                  lessonSlug={lessonSlug}
                  onOpenWorkspace={() => setStudioMode("exercise")}
                />
              )}

              {/* Action Error Notification */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Navigation Action Hub & Next Lesson Card */}
              <section className="pt-2">
                <LessonNavigation
                  context={activeContext}
                  onComplete={completeLesson}
                  onOpenExercise={exercise ? () => setStudioMode("exercise") : undefined}
                  isActionLoading={isActionLoading}
                />
              </section>
            </>
          ) : (
            /* Mode 2: Interactive Practical Exercise Workspace */
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card/60 border border-border/80 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/30">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      {exercise?.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Complete all challenges and verify invariants to emit competency evidence.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStudioMode("lesson")}
                  className="gap-1.5 text-xs font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span>View Lesson Notes</span>
                </Button>
              </div>

              {/* Interactive Exercise Workspace Workbench */}
              {exercise && <ExerciseWorkspace slug={exercise.slug} />}

              {/* Bottom return & navigation actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStudioMode("lesson")}
                  className="gap-2 text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Lesson Reading</span>
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={completeLesson}
                    disabled={isActionLoading || isCompleted}
                    variant={isCompleted ? "secondary" : "default"}
                    size="sm"
                    className={cn(
                      "gap-2 text-xs font-semibold shadow-sm",
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {isActionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Lesson Completed</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Lesson Complete</span>
                      </>
                    )}
                  </Button>

                  {nextUrl && (
                    <Button asChild size="sm" variant="default" className="gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border/60 text-xs">
                      <Link href={nextUrl}>
                        <span>Next Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Column: Sticky Mastery & Curriculum Sidebar (30% Width) */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-40 w-80 bg-background/95 backdrop-blur-xl border-l border-border p-6 pt-20 lg:pt-6 space-y-5 transform transition-transform duration-300 lg:static lg:block lg:transform-none shrink-0",
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}
        >
          {/* 1. Competency Growth Card */}
          <CompetencyProgressCard competency={activeContext.competency} />

          {/* 2. Module Progress & Curriculum Playlist */}
          <ModuleProgressHud
            module={activeModule}
            lessons={siblingLessons}
            currentLessonSlug={lessonSlug}
            pathSlug={pathSlug}
            moduleSlug={moduleSlug}
          />

          {/* 3. Progressive Disclosure: Staff Curriculum Metadata Drawer */}
          {(isInstructor || isAdmin) && (
            <StaffMetadataDrawer
              metadata={parsed.metadata}
              lessonId={activeLesson.id}
            />
          )}

          {/* Back to Module Hub link */}
          <div className="pt-3 border-t border-border/40">
            <Link
              href={`/learning-paths/${pathSlug}/modules/${moduleSlug}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Module Overview</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* 3. Mobile Sticky Bottom Action Bar (375px–420px viewports) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border/80 p-3 px-4 flex items-center justify-between gap-3 shadow-lg">
        {exercise && (
          <Button
            onClick={() => setStudioMode(studioMode === "lesson" ? "exercise" : "lesson")}
            size="sm"
            variant="outline"
            className="flex-1 font-semibold text-xs gap-1.5 h-11 border-border"
          >
            {studioMode === "lesson" ? (
              <>
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span>Exercise</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Lesson</span>
              </>
            )}
          </Button>
        )}

        <Button
          onClick={completeLesson}
          disabled={isActionLoading || isCompleted}
          size="sm"
          variant={isCompleted ? "secondary" : "default"}
          className={cn(
            "flex-1 font-semibold text-xs gap-1.5 h-11",
            isCompleted
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-primary text-primary-foreground"
          )}
        >
          {isActionLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </>
          )}
        </Button>

        {nextUrl ? (
          <Button asChild size="sm" variant="default" className="flex-1 bg-secondary text-foreground hover:bg-secondary/80 border border-border text-xs gap-1.5 h-11">
            <Link href={nextUrl}>
              <span className="truncate">Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline" className="flex-1 text-xs gap-1.5 h-11">
            <Link href={`/learning-paths/${pathSlug}/modules/${moduleSlug}`}>
              <span className="truncate">Module Overview</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
