"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  Terminal,
  Code2,
  ShieldCheck,
  Flame,
  Award,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AchievementBadgeProps {
  iconName: string;
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  BookOpen,
  Terminal,
  Code2,
  ShieldCheck,
  Flame,
  Award,
};

export function AchievementBadge({
  iconName,
  isUnlocked,
  size = "md",
  className,
}: AchievementBadgeProps) {
  const IconComponent = ICON_MAP[iconName] || Award;

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl transition-all duration-300",
        sizeClasses[size],
        isUnlocked
          ? "bg-gradient-to-br from-amber-500/20 via-primary/20 to-emerald-500/20 border border-amber-500/40 text-amber-400 shadow-sm shadow-amber-500/10"
          : "bg-muted/40 border border-border/60 text-muted-foreground/50",
        className
      )}
    >
      {isUnlocked ? (
        <IconComponent className={iconSizes[size]} />
      ) : (
        <div className="relative flex items-center justify-center">
          <IconComponent className={cn(iconSizes[size], "opacity-40 grayscale")} />
          <Lock className="absolute -bottom-1 -right-1 h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
