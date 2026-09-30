import React from "react";
import Link from "next/link";
import { Clock, CheckCircle2, PlayCircle, Terminal } from "lucide-react";
import type { LessonSummary, UserLearningProgress } from "../types";
import { ProgressBadge } from "./progress-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatShortEffort } from "../utils/duration-formatter";

export interface LessonItemProps {
  lesson: LessonSummary & { progress?: UserLearningProgress | null };
  pathSlug: string;
  moduleSlug: string;
  isActive?: boolean;
  className?: string;
}

export function LessonItem({
  lesson,
  pathSlug,
  moduleSlug,
  isActive = false,
  className,
}: LessonItemProps) {
  const isCompleted = lesson.progress?.status === "completed";
  const isInProgress = lesson.progress?.status === "in_progress";
  const href = `/learning-paths/${pathSlug}/modules/${moduleSlug}/lessons/${lesson.slug}`;
  const effortShort = formatShortEffort(lesson.estimatedMinutes);
  const hasExercise = !!lesson.exercise;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
        isActive
          ? "bg-primary/10 border-primary/40 shadow-sm shadow-primary/5"
          : "bg-card/40 border-border/60 hover:bg-card/80 hover:border-border hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* State Icon Indicator */}
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-mono font-semibold transition-colors shrink-0",
            isCompleted
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : isInProgress
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-secondary text-muted-foreground border border-border/40 group-hover:text-foreground"
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : isInProgress ? (
            <PlayCircle className="w-4 h-4 text-amber-400" />
          ) : (
            <span>{lesson.orderIndex}</span>
          )}
        </div>

        {/* Lesson Details */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={cn(
                "text-sm font-medium transition-colors truncate",
                isActive
                  ? "text-primary font-semibold"
                  : isCompleted
                    ? "text-foreground group-hover:text-primary"
                    : "text-foreground group-hover:text-primary"
              )}
            >
              {lesson.title}
            </h4>

            {hasExercise && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 text-[10px] px-1.5 py-0 h-4 font-mono shrink-0 gap-1"
              >
                <Terminal className="w-2.5 h-2.5" />
                <span>Exercise</span>
              </Badge>
            )}
          </div>
          {lesson.summary && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{lesson.summary}</p>
          )}
        </div>
      </div>

      {/* Meta & Status */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{effortShort}</span>
        </div>
        <ProgressBadge status={lesson.progress?.status} className="text-[10px] px-2 py-0.5" />
      </div>
    </Link>
  );
}
