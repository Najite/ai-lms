import React from "react";
import Link from "next/link";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import type { LearningPath, ProgressMetrics } from "../types";
import { ProgressBar } from "./progress-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LearningPathCardProps {
  path: LearningPath & { metrics?: ProgressMetrics };
  className?: string;
}

export function LearningPathCard({ path, className }: LearningPathCardProps) {
  const metrics = path.metrics || {
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    notStartedLessons: 0,
    percentage: 0,
    isCompleted: false,
    isStarted: false,
  };

  const difficultyVariants = {
    beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

  const pathUrl = `/learning-paths/${path.slug}`;

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border-border/70 bg-gradient-to-b from-card/80 via-card/50 to-card/30 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        metrics.isCompleted && "border-emerald-500/40 shadow-emerald-500/5",
        className
      )}
    >
      {/* Decorative Glow */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />

      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={cn("capitalize text-xs font-semibold px-2.5 py-0.5", difficultyVariants[path.difficulty])}
          >
            {path.difficulty}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{path.estimatedHours}h est.</span>
          </div>
        </div>

        <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={pathUrl} className="focus:outline-none">
            {path.title}
          </Link>
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {path.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 py-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              {metrics.completedLessons}/{metrics.totalLessons} Lessons
            </span>
            <span className="font-semibold text-foreground">{metrics.percentage}%</span>
          </div>
          <ProgressBar percentage={metrics.percentage} size="md" />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/40">
        <Button asChild className="w-full justify-between group/btn" variant={metrics.isStarted ? "default" : "secondary"}>
          <Link href={pathUrl}>
            <span>{metrics.isCompleted ? "Review Path" : metrics.isStarted ? "Continue Learning" : "Start Path"}</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
