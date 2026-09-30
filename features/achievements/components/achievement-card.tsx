"use client";

import React from "react";
import { Award, CheckCircle2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "./achievement-badge";
import { cn } from "@/lib/utils";
import type { UserAchievementView } from "../types";

export interface AchievementCardProps {
  userAchievement: UserAchievementView;
}

export function AchievementCard({ userAchievement }: AchievementCardProps) {
  const { achievement, progressValue, targetValue, isUnlocked, unlockedAt } =
    userAchievement;

  const percentage = Math.min(100, Math.round((progressValue / targetValue) * 100));

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5 transition-all duration-300 border backdrop-blur-sm flex flex-col justify-between space-y-4",
        isUnlocked
          ? "bg-gradient-to-b from-amber-500/10 via-card/80 to-card border-amber-500/30 hover:border-amber-500/50 shadow-sm shadow-amber-500/5"
          : "bg-card/50 border-border/60 hover:border-border"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <AchievementBadge
            iconName={achievement.icon}
            isUnlocked={isUnlocked}
            size="md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {achievement.name}
              </h3>
              {isUnlocked && (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono py-0 h-4 gap-1"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Unlocked
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {achievement.description}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs shrink-0 gap-1 px-2.5 py-0.5"
        >
          <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>+{achievement.xpReward} XP</span>
        </Badge>
      </div>

      {/* Progress Bar & Criteria */}
      <div className="space-y-2 pt-1 border-t border-border/40">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-muted-foreground">
            {isUnlocked ? "Completed" : "Progress"}
          </span>
          <span className="font-semibold text-foreground">
            {progressValue} / {targetValue} ({percentage}%)
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isUnlocked
                ? "bg-gradient-to-r from-amber-400 to-emerald-400"
                : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {unlockedAt && (
          <div className="text-[10px] text-muted-foreground font-mono pt-1 flex items-center gap-1">
            <Award className="h-3 w-3 text-amber-400" />
            <span>Unlocked on {new Date(unlockedAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
