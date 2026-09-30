"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Layers } from "lucide-react";
import { ProgressBadge } from "./progress-badge";
import { formatEffort } from "../utils/duration-formatter";
import type { Lesson, Module, LearningPath, UserLearningProgress } from "../types";

export interface LessonHeaderProps {
  lesson: Lesson;
  module: Module;
  path: LearningPath;
  progress?: UserLearningProgress | null;
  totalModuleLessons?: number;
  className?: string;
}

export function LessonHeader({
  lesson,
  module,
  path,
  progress,
  totalModuleLessons = 5,
  className,
}: LessonHeaderProps) {
  const effortText = formatEffort(lesson.estimatedMinutes);
  const difficultyLabel = path.difficulty
    ? path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1).replace("_", " ")
    : "Foundation Level";

  return (
    <section className={`space-y-4 pb-6 border-b border-border/50 ${className || ""}`}>
      {/* Top Metadata Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Module Identifier */}
          <Badge
            variant="outline"
            className="font-mono text-xs text-primary border-primary/30 bg-primary/5 flex items-center gap-1.5 px-2.5 py-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {module.title.length > 30 ? `${module.title.slice(0, 30)}...` : module.title}
            </span>
          </Badge>

          {/* Lesson Sequence Pill */}
          <Badge
            variant="secondary"
            className="text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
            <span>
              Lesson {lesson.orderIndex} of {totalModuleLessons}
            </span>
          </Badge>

          {/* Difficulty Badge */}
          <Badge
            variant="outline"
            className="text-xs border-border/60 text-muted-foreground px-2.5 py-1"
          >
            {difficultyLabel}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <ProgressBadge status={progress?.status} className="text-xs px-2.5 py-1" />
        </div>
      </div>

      {/* Main Lesson Title (H1) */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
        {lesson.title}
      </h1>

      {/* Estimated Effort Bar */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <span>{effortText}</span>
        <span className="text-border">•</span>
        <span>Self-Paced Professional Curriculum</span>
      </div>
    </section>
  );
}
