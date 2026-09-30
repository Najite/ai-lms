"use client";

import React from "react";
import { Zap, Trophy, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useXPBalance } from "../hooks/use-achievements";

export function XPBalanceDisplay() {
  const { totalXp, isLoading } = useXPBalance();

  const currentLevel = Math.floor(totalXp / 250) + 1;
  const xpInCurrentLevel = totalXp % 250;
  const levelProgress = Math.round((xpInCurrentLevel / 250) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-card border border-amber-500/30 p-6 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: XP & Level Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-400 border-amber-500/40 gap-1.5 px-3 py-1 font-semibold text-xs font-mono"
            >
              <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              XP Experience Ledger
            </Badge>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-mono text-xs"
            >
              Level {currentLevel}
            </Badge>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground font-display flex items-baseline gap-3">
            <span>{isLoading ? "..." : totalXp.toLocaleString()}</span>
            <span className="text-sm md:text-base font-normal text-muted-foreground font-mono">
              Total XP Earned
            </span>
          </h2>

          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl">
            XP is awarded on immutable ledger transactions for verified lesson completions, practical code exercises, competency reinforcements, and milestones.
          </p>
        </div>

        {/* Right: Level Progress Gauge */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 min-w-[240px] space-y-2.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              Level {currentLevel}
            </span>
            <span className="font-bold text-foreground">
              Level {currentLevel + 1}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-secondary/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-primary to-emerald-400 transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              {xpInCurrentLevel} / 250 XP
            </span>
            <span>{250 - xpInCurrentLevel} XP to Level {currentLevel + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
