import React from "react";
import { Badge } from "@/components/ui/badge";
import { Circle, Sparkles, Flame, ShieldCheck, Trophy } from "lucide-react";
import type { CompetencyState } from "../types";
import { cn } from "@/lib/utils";

export interface CompetencyBadgeProps {
  state: CompetencyState | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function CompetencyBadge({ state, className, showIcon = true }: CompetencyBadgeProps) {
  const currentState: CompetencyState = state || "not_started";

  switch (currentState) {
    case "mastered":
      return (
        <Badge
          variant="success"
          className={cn(
            "gap-1.5 font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10",
            className
          )}
        >
          {showIcon && <Trophy className="w-3.5 h-3.5 text-emerald-400" />}
          <span>Mastered</span>
        </Badge>
      );

    case "reinforced":
      return (
        <Badge
          variant="default"
          className={cn(
            "gap-1.5 font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40",
            className
          )}
        >
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
          <span>Reinforced</span>
        </Badge>
      );

    case "practicing":
      return (
        <Badge
          variant="secondary"
          className={cn(
            "gap-1.5 font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30",
            className
          )}
        >
          {showIcon && <Flame className="w-3.5 h-3.5 text-amber-400" />}
          <span>Practicing</span>
        </Badge>
      );

    case "introduced":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30",
            className
          )}
        >
          {showIcon && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
          <span>Introduced</span>
        </Badge>
      );

    case "not_started":
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 font-medium text-muted-foreground border-border/60 bg-secondary/30",
            className
          )}
        >
          {showIcon && <Circle className="w-3.5 h-3.5 text-muted-foreground/50" />}
          <span>Not Started</span>
        </Badge>
      );
  }
}
