"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEffort } from "../utils/duration-formatter";
import type { NextLessonPreview } from "../types";

export interface NextLessonCardProps {
  nextLesson: NextLessonPreview;
  className?: string;
}

export function NextLessonCard({ nextLesson, className }: NextLessonCardProps) {
  const effortText = formatEffort(nextLesson.estimatedMinutes || 480);
  const href = `/learning-paths/${nextLesson.pathSlug}/modules/${nextLesson.moduleSlug}/lessons/${nextLesson.lessonSlug}`;

  return (
    <div
      className={`rounded-2xl border border-primary/30 bg-primary/[0.04] p-5 sm:p-6 space-y-4 backdrop-blur-sm transition-all hover:border-primary/50 shadow-sm ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Up Next in This Module</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{effortText}</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {nextLesson.title}
        </h4>
        {nextLesson.summary && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {nextLesson.summary}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button asChild className="w-full sm:w-auto font-semibold gap-2 shadow-sm">
          <Link href={href}>
            <span>Continue to Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
