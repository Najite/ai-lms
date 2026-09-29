"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLesson } from "../hooks/use-lesson";
import { LessonViewer } from "./lesson-viewer";
import { LessonNavigation } from "./lesson-navigation";
import { LessonItem } from "./lesson-item";
import { LearningBreadcrumbs } from "./learning-breadcrumbs";
import { ProgressBadge } from "./progress-badge";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Clock, Menu, X, ArrowLeft } from "lucide-react";
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

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Auto-start lesson on mount if not yet started
  useEffect(() => {
    const currentStatus = (progress?.status || initialContext.progress?.status);
    if (!currentStatus || currentStatus === "not_started") {
      startLesson();
    }
  }, [progress?.status, initialContext.progress?.status, startLesson]);

  const activeContext = context || initialContext;
  const activeLesson = lesson || initialContext.currentLesson;
  const activeModule = module || initialContext.currentModule;
  const activePath = path || initialContext.currentPath;
  const activeProgress = progress || initialContext.progress;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Header */}
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
                { label: "Paths", href: "/learning-paths" },
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
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg border border-border bg-card text-foreground hover:bg-secondary"
            aria-label="Toggle Lesson List"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 space-y-8">
          {/* Lesson Header Banner */}
          <section className="space-y-4 pb-6 border-b border-border/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                  Module {activeModule.orderIndex} • Lesson {activeLesson.orderIndex}
                </Badge>
                <ProgressBadge status={activeProgress?.status} className="text-xs" />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{activeLesson.estimatedMinutes} Minutes Read</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {activeLesson.title}
            </h1>
          </section>

          {/* Render Markdown Lesson Content */}
          <section className="bg-card/30 border border-border/60 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-sm">
            <LessonViewer
              content={activeLesson.content}
              title={activeLesson.title}
              summary={activeLesson.summary}
            />
          </section>

          {/* Error Message if Action Fails */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          {/* Lesson Navigation Footer */}
          <section className="pt-2">
            <LessonNavigation
              context={activeContext}
              onComplete={completeLesson}
              isActionLoading={isActionLoading}
            />
          </section>
        </main>

        {/* Sibling Lessons Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-40 w-80 bg-background/95 backdrop-blur-xl border-l border-border p-6 pt-20 lg:pt-6 space-y-6 transform transition-transform duration-300 lg:static lg:block lg:transform-none shrink-0",
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}
        >
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider">
              Module Curriculum
            </div>
            <h3 className="text-sm font-bold text-foreground truncate">{activeModule.title}</h3>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {siblingLessons.map((l) => (
              <LessonItem
                key={l.id}
                lesson={l}
                pathSlug={pathSlug}
                moduleSlug={moduleSlug}
                isActive={l.slug === lessonSlug}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-border/40">
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
    </div>
  );
}
