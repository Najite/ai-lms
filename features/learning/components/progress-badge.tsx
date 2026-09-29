import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { LearningProgressStatus } from "../types";
import { cn } from "@/lib/utils";

export interface ProgressBadgeProps {
  status: LearningProgressStatus | "not_started" | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function ProgressBadge({ status, className, showIcon = true }: ProgressBadgeProps) {
  const currentStatus = status || "not_started";

  if (currentStatus === "completed") {
    return (
      <Badge
        variant="success"
        className={cn("gap-1.5 font-medium border border-emerald-500/30", className)}
      >
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        <span>Completed</span>
      </Badge>
    );
  }

  if (currentStatus === "in_progress") {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "gap-1.5 font-medium bg-amber-500/15 text-amber-400 border-amber-500/30",
          className
        )}
      >
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
        <span>In Progress</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium text-muted-foreground border-border/60", className)}
    >
      {showIcon && <Circle className="w-3.5 h-3.5 text-muted-foreground/60" />}
      <span>Not Started</span>
    </Badge>
  );
}
