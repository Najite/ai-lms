import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, Trophy } from "lucide-react";
import type { PortfolioAchievement } from "../types";

export interface PortfolioAchievementViewProps {
  achievements: PortfolioAchievement[];
  isLoading?: boolean;
}

function getTierBadge(tier?: string) {
  const normalized = (tier || "bronze").toLowerCase();
  switch (normalized) {
    case "bronze":
      return (
        <Badge
          variant="outline"
          className="border-amber-700/40 bg-amber-900/20 text-amber-500 font-mono text-[10px] capitalize"
        >
          Bronze
        </Badge>
      );
    case "silver":
      return (
        <Badge
          variant="outline"
          className="border-slate-400/40 bg-slate-500/20 text-slate-300 font-mono text-[10px] capitalize"
        >
          Silver
        </Badge>
      );
    case "gold":
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/40 bg-yellow-500/20 text-yellow-300 font-mono text-[10px] capitalize"
        >
          Gold
        </Badge>
      );
    case "platinum":
      return (
        <Badge
          variant="outline"
          className="border-cyan-400/40 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] capitalize"
        >
          Platinum
        </Badge>
      );
    case "diamond":
    case "legendary":
      return (
        <Badge
          variant="outline"
          className="border-purple-500/40 bg-purple-500/20 text-purple-300 font-mono text-[10px] capitalize shadow-sm shadow-purple-900/30"
        >
          Legendary
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-zinc-700 bg-zinc-800 text-zinc-300 font-mono text-[10px] capitalize"
        >
          {normalized}
        </Badge>
      );
  }
}

export function PortfolioAchievementView({
  achievements,
  isLoading,
}: PortfolioAchievementViewProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Award className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Earned Achievements</h2>
          <p className="text-xs text-zinc-400">
            Milestones and badges unlocking engineering pedigree and proof of consistency
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <Card className="border border-zinc-800/80 bg-zinc-900/30 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-2 p-0">
            <Trophy className="h-10 w-10 text-zinc-600" />
            <div className="text-sm font-medium text-zinc-400">No achievements unlocked yet</div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Complete exercises, maintain streaks, and pass competency gates to unlock recognized achievement badges.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item) => {
            const ach = item.achievement;
            return (
              <Card
                key={item.id}
                className="border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all p-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">
                          {ach?.name || "Earned Achievement"}
                        </h3>
                        <div className="text-[11px] font-mono text-zinc-500">
                          {ach?.slug || "achievement"}
                        </div>
                      </div>
                    </div>
                    {getTierBadge(ach?.tier)}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {ach?.description || "Successfully unlocked this milestone reward in the curriculum."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Zap className="h-3.5 w-3.5" />
                    <span>+{ach?.xpReward || 50} XP</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">Verified Badge</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
