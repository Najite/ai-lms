import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import type { ModuleWithLessons } from "../types";
import { ProgressBar } from "./progress-bar";
import { LessonItem } from "./lesson-item";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ModuleCardProps {
  module: ModuleWithLessons;
  pathSlug: string;
  showLessons?: boolean;
  className?: string;
}

export function ModuleCard({
  module,
  pathSlug,
  showLessons = true,
  className,
}: ModuleCardProps) {
  const metrics = module.metrics || {
    totalLessons: module.lessons.length,
    completedLessons: 0,
    inProgressLessons: 0,
    notStartedLessons: module.lessons.length,
    percentage: 0,
    isCompleted: false,
    isStarted: false,
  };

  const moduleUrl = `/learning-paths/${pathSlug}/modules/${module.slug}`;

  return (
    <Card
      className={cn(
        "group border-border/70 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg",
        metrics.isCompleted && "border-emerald-500/30",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Module {module.orderIndex}
              </Badge>
              {metrics.isCompleted && (
                <Badge variant="success" className="text-xs">
                  Completed
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              <Link href={moduleUrl} className="flex items-center gap-1.5">
                <span>{module.title}</span>
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
              </Link>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {module.description}
            </CardDescription>
          </div>
        </div>

        {/* Module Progress and Stats */}
        <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                {metrics.completedLessons}/{metrics.totalLessons} Lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                {module.estimatedMinutes}m Total
              </span>
            </div>
            <span className="font-semibold text-foreground">{metrics.percentage}%</span>
          </div>
          <ProgressBar percentage={metrics.percentage} size="sm" />
        </div>
      </CardHeader>

      {/* Lesson List within Module */}
      {showLessons && module.lessons.length > 0 && (
        <CardContent className="pt-0 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Module Lessons
          </div>
          <div className="space-y-2">
            {module.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                pathSlug={pathSlug}
                moduleSlug={module.slug}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
