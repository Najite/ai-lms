"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle, Clock, BookOpen, Terminal } from "lucide-react";
import { formatShortEffort } from "../utils/duration-formatter";
import type { LessonSummary, UserLearningProgress, Module } from "../types";
import { cn } from "@/lib/utils";

export interface ModuleProgressHudProps {
  module: Module;
  lessons: (LessonSummary & { progress?: UserLearningProgress | null })[];
  currentLessonSlug: string;
  pathSlug: string;
  moduleSlug: string;
  className?: string;
}

export function ModuleProgressHud({
  module,
  lessons,
  currentLessonSlug,
  pathSlug,
  moduleSlug,
  className,
}: ModuleProgressHudProps) {
  const totalLessons = lessons.length;
  const completedCount = lessons.filter((l) => l.progress?.status === "completed").length;
  const currentIndex = lessons.findIndex((l) => l.slug === currentLessonSlug);
  const currentPosition = currentIndex >= 0 ? currentIndex + 1 : 1;

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/50 p-5 space-y-4 backdrop-blur-sm shadow-sm",
        className
      )}
    >
      {/* Header & Progress Metrics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Lesson {currentPosition} of {totalLessons}</span>
          </div>
          <span className="font-mono text-muted-foreground font-medium">
            {percentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(percentage, 5)}%` }}
          />
        </div>
      </div>

      {/* Lesson Playlist */}
      <div className="space-y-1.5 pt-2 border-t border-border/40">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 truncate">
          {module.title} ({totalLessons} Lessons)
        </div>

        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
          {lessons.map((l) => {
            const isCompleted = l.progress?.status === "completed";
            const isCurrent = l.slug === currentLessonSlug;
            const effortShort = formatShortEffort(l.estimatedMinutes);
            const hasExercise = !!l.exercise;

            return (
              <Link
                key={l.id}
                href={`/learning-paths/${pathSlug}/modules/${moduleSlug}/lessons/${l.slug}`}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all",
                  isCurrent
                    ? "bg-primary/10 border-primary/40 text-foreground font-semibold shadow-xs"
                    : isCompleted
                    ? "bg-card/40 border-border/40 text-foreground/80 hover:bg-card hover:border-border"
                    : "bg-transparent border-transparent text-muted-foreground hover:bg-card/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isCurrent ? (
                      <PlayCircle className="w-4 h-4 text-primary" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <span className="truncate">
                    {l.orderIndex}. {l.title}
                  </span>
                  {hasExercise && (
                    <span title="Includes Practical Exercise">
                      <Terminal className="w-3 h-3 text-primary/70 shrink-0" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                  <span>{effortShort}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
