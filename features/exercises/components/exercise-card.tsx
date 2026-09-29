import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Award, Terminal, Code2 } from "lucide-react";
import type { ExerciseWithDetails } from "../types";
import { ExerciseStatusBadge } from "./exercise-status-badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ExerciseCardProps {
  exercise: ExerciseWithDetails;
  className?: string;
}

export function ExerciseCard({ exercise, className }: ExerciseCardProps) {
  const isCompleted = !!exercise.userCompletion;
  const activeAttempt = exercise.activeAttempt;
  const exerciseState = isCompleted
    ? "completed"
    : activeAttempt
    ? activeAttempt.state
    : "available";

  const detailUrl = `/exercises/${exercise.slug}`;

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border-border/70 bg-gradient-to-b from-card/80 via-card/50 to-card/30 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        isCompleted && "border-emerald-500/40 shadow-emerald-500/5",
        className
      )}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30 flex items-center gap-1">
              <Code2 className="h-3 w-3" />
              {exercise.category?.name || "Exercise"}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {exercise.estimatedMinutes} mins
            </span>
          </div>
          <ExerciseStatusBadge
            state={exerciseState}
            isCompleted={isCompleted}
          />
        </div>

        <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={detailUrl} className="focus:outline-none">
            {exercise.title}
          </Link>
        </CardTitle>

        <CardDescription className="line-clamp-2 text-xs text-muted-foreground">
          {exercise.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {exercise.competencies && exercise.competencies.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3 w-3 text-amber-400" />
              Reinforces Competencies
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exercise.competencies.map((comp) => (
                <Badge
                  key={comp.id}
                  variant="outline"
                  className="bg-secondary/40 hover:bg-secondary/70 text-[10px] font-mono border-border/80 gap-1 transition-colors"
                >
                  <span className="font-semibold text-primary">{comp.code}</span>
                  <span className="text-muted-foreground">({comp.weight}x)</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          variant={isCompleted ? "outline" : "default"}
          size="sm"
          className={cn(
            "w-full justify-between gap-2 transition-all font-semibold",
            isCompleted
              ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Link href={detailUrl}>
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              {isCompleted
                ? "Review Completed Solution"
                : activeAttempt
                ? "Resume Workspace"
                : "Launch Exercise"}
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
