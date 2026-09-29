import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { CompetencyWithProgress } from "../types";
import { CompetencyBadge } from "./competency-badge";
import { ProgressBar } from "@/features/learning/components/progress-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CompetencyCardProps {
  competency: CompetencyWithProgress;
  className?: string;
}

export function CompetencyCard({ competency, className }: CompetencyCardProps) {
  const progress = competency.progress;
  const state = progress?.state || "not_started";
  const score = progress?.score || 0;
  const isMastered = state === "mastered";

  const levelVariants = {
    foundational: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    expert: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  const detailUrl = `/competencies/${competency.slug}`;

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border-border/70 bg-gradient-to-b from-card/80 via-card/50 to-card/30 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5",
        isMastered && "border-emerald-500/40 shadow-emerald-500/5",
        className
      )}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
              {competency.code}
            </span>
            <Badge
              variant="outline"
              className={cn("capitalize text-[10px] font-semibold", levelVariants[competency.level])}
            >
              {competency.level}
            </Badge>
          </div>
          <CompetencyBadge state={state} className="text-[11px]" />
        </div>

        <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          <Link href={detailUrl} className="focus:outline-none">
            {competency.title}
          </Link>
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {competency.statement}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 py-2">
        {competency.category && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Layers className="w-3.5 h-3.5 text-primary/70" />
            <span className="truncate">{competency.category.name}</span>
          </div>
        )}

        <div className="space-y-1.5 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Mastery Score</span>
            <span className="font-semibold text-foreground">{score}/100</span>
          </div>
          <ProgressBar percentage={score} size="sm" />
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/40">
        <Button asChild variant="outline" size="sm" className="w-full justify-between group/btn text-xs">
          <Link href={detailUrl}>
            <span>View Competency Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
