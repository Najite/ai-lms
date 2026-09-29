"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LessonNavigationContext } from "../types";
import { cn } from "@/lib/utils";

export interface LessonNavigationProps {
  context: LessonNavigationContext;
  onComplete: () => Promise<unknown>;
  isActionLoading?: boolean;
  className?: string;
}

export function LessonNavigation({
  context,
  onComplete,
  isActionLoading = false,
  className,
}: LessonNavigationProps) {
  const { previousLesson, nextLesson, progress } = context;
  const isCompleted = progress?.status === "completed";

  const prevUrl = previousLesson
    ? `/learning-paths/${previousLesson.pathSlug}/modules/${previousLesson.moduleSlug}/lessons/${previousLesson.lessonSlug}`
    : null;

  const nextUrl = nextLesson
    ? `/learning-paths/${nextLesson.pathSlug}/modules/${nextLesson.moduleSlug}/lessons/${nextLesson.lessonSlug}`
    : null;

  return (
    <nav
      aria-label="Lesson Navigation"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 border border-border/80 backdrop-blur-md shadow-lg",
        className
      )}
    >
      {/* Previous Lesson Button */}
      <div className="w-full sm:w-auto">
        {prevUrl ? (
          <Button asChild variant="outline" className="w-full sm:w-auto justify-start gap-2">
            <Link href={prevUrl}>
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block -mb-0.5">
                  Previous
                </span>
                <span className="text-xs font-semibold max-w-[140px] truncate block">
                  {previousLesson?.title}
                </span>
              </div>
            </Link>
          </Button>
        ) : (
          <div className="hidden sm:block w-28" />
        )}
      </div>

      {/* Complete Action Button */}
      <div className="w-full sm:w-auto flex justify-center">
        <Button
          onClick={onComplete}
          disabled={isActionLoading || isCompleted}
          variant={isCompleted ? "secondary" : "default"}
          className={cn(
            "w-full sm:w-auto gap-2 px-6 py-5 font-semibold transition-all shadow-md",
            isCompleted
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
          )}
        >
          {isActionLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Progress...</span>
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Lesson Completed</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Mark as Complete</span>
            </>
          )}
        </Button>
      </div>

      {/* Next Lesson Button */}
      <div className="w-full sm:w-auto">
        {nextUrl ? (
          <Button asChild variant="default" className="w-full sm:w-auto justify-end gap-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border">
            <Link href={nextUrl}>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block -mb-0.5">
                  Next
                </span>
                <span className="text-xs font-semibold max-w-[140px] truncate block">
                  {nextLesson?.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full sm:w-auto justify-end gap-2">
            <Link href={`/learning-paths/${context.currentPath.slug}`}>
              <span className="text-xs font-semibold">Path Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
