"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FolderTree,
  Navigation,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LessonExerciseSummary } from "../types";
import { cn } from "@/lib/utils";

export interface LessonExerciseCardProps {
  exercise: LessonExerciseSummary;
  pathSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  onOpenWorkspace?: () => void;
  className?: string;
}

export function LessonExerciseCard({
  exercise,
  pathSlug,
  moduleSlug,
  lessonSlug,
  onOpenWorkspace,
  className,
}: LessonExerciseCardProps) {
  const isCompleted = !!exercise.completion;
  const score = exercise.completion?.score;
  const exerciseUrl = `/learning-paths/${pathSlug}/modules/${moduleSlug}/lessons/${lessonSlug}/exercise`;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-300",
        isCompleted
          ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-card/90 to-card/60 shadow-lg shadow-emerald-950/20"
          : "border-primary/40 bg-gradient-to-br from-primary/10 via-card/90 to-card/60 shadow-lg shadow-primary/5",
        className
      )}
    >
      {/* Decorative background glow */}
      <div
        className={cn(
          "absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-25",
          isCompleted ? "bg-emerald-500" : "bg-primary"
        )}
      />

      <div className="p-6 sm:p-8 space-y-6 relative z-10">
        {/* Header Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 px-3 py-1 font-semibold text-xs",
                isCompleted
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-primary/15 text-primary border-primary/30"
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Lesson Practical Assessment</span>
            </Badge>

            <Badge variant="outline" className="font-mono text-xs uppercase text-muted-foreground border-border/60">
              {exercise.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{exercise.estimatedMinutes} Minutes</span>
            </div>
            {isCompleted && score !== undefined && (
              <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Passed: {score}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>{exercise.title}</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {exercise.description}
          </p>
        </div>

        {/* 3 Core Skill Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span>Tree Hierarchy</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Reconstruct standard POSIX root directories: <code className="font-mono text-foreground">/var/log</code>, <code className="font-mono text-foreground">/etc</code>, <code className="font-mono text-foreground">/tmp</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span>Path Traversal</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Master absolute vs relative paths, dotfiles, and parent directory references (<code className="font-mono text-foreground">..</code>).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Octal Permissions</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Audit read, write, and execute permissions across User, Group, and Other (<code className="font-mono text-foreground">755</code>, <code className="font-mono text-foreground">644</code>).
            </p>
          </div>
        </div>

        {/* Competency & Progress Footer */}
        <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Target Competency: <strong className="text-foreground">DEV-00</strong> (Introduced &rarr; Practicing)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWorkspace ? (
              <Button
                onClick={onOpenWorkspace}
                className={cn(
                  "gap-2 font-semibold text-xs px-5 shadow-sm transition-all",
                  isCompleted
                    ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Code2 className="w-4 h-4" />
                <span>{isCompleted ? "Open Workbench (Review)" : "Launch Exercise Workbench"}</span>
              </Button>
            ) : (
              <Button
                asChild
                className={cn(
                  "gap-2 font-semibold text-xs px-5 shadow-sm transition-all",
                  isCompleted
                    ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Link href={exerciseUrl}>
                  <Code2 className="w-4 h-4" />
                  <span>{isCompleted ? "Open Workbench (Review)" : "Launch Exercise Workbench"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
