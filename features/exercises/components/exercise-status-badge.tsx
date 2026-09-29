import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, PlayCircle, Send, CheckSquare } from "lucide-react";
import type { ExerciseState } from "../types";
import { cn } from "@/lib/utils";

export interface ExerciseStatusBadgeProps {
  state?: ExerciseState | "not_started" | null;
  className?: string;
  isCompleted?: boolean;
}

export function ExerciseStatusBadge({
  state = "available",
  className,
  isCompleted = false,
}: ExerciseStatusBadgeProps) {
  if (isCompleted || state === "completed") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 gap-1.5 py-0.5 px-2.5 font-semibold text-xs transition-colors",
          className
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        Completed
      </Badge>
    );
  }

  switch (state) {
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1.5 py-0.5 px-2.5 font-semibold text-xs transition-colors",
            className
          )}
        >
          <Clock className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
          In Progress
        </Badge>
      );
    case "submitted":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-blue-500/15 text-blue-400 border-blue-500/30 gap-1.5 py-0.5 px-2.5 font-semibold text-xs transition-colors",
            className
          )}
        >
          <Send className="h-3.5 w-3.5 text-blue-400" />
          Submitted
        </Badge>
      );
    case "validated":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1.5 py-0.5 px-2.5 font-semibold text-xs transition-colors",
            className
          )}
        >
          <CheckSquare className="h-3.5 w-3.5 text-purple-400" />
          Validated
        </Badge>
      );
    case "available":
    default:
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-muted/30 text-muted-foreground border-border/60 gap-1.5 py-0.5 px-2.5 font-medium text-xs transition-colors",
            className
          )}
        >
          <PlayCircle className="h-3.5 w-3.5" />
          Available
        </Badge>
      );
  }
}
