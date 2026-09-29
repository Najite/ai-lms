import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  percentage,
  showLabel = false,
  size = "md",
  className,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Progress</span>
          <span className="text-foreground font-mono">{clampedPercentage}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-secondary/80 border border-border/40",
          sizeClasses[size]
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
