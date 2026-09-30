import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle2 } from "lucide-react";
import type { PortfolioCompetency } from "../types";

export interface PortfolioCompetencyViewProps {
  competencies: PortfolioCompetency[];
  isLoading?: boolean;
}

function getLevelBadge(level?: string) {
  const normalized = (level || "intermediate").toLowerCase();
  switch (normalized) {
    case "beginner":
    case "foundational":
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-300 font-mono text-[10px] capitalize"
        >
          {normalized}
        </Badge>
      );
    case "intermediate":
    case "practitioner":
      return (
        <Badge
          variant="outline"
          className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-[10px] capitalize"
        >
          {normalized}
        </Badge>
      );
    case "advanced":
    case "expert":
    case "master":
      return (
        <Badge
          variant="outline"
          className="border-purple-500/30 bg-purple-500/10 text-purple-300 font-mono text-[10px] capitalize"
        >
          {normalized}
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

export function PortfolioCompetencyView({
  competencies,
  isLoading,
}: PortfolioCompetencyViewProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Briefcase className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Mastered Competencies</h2>
          <p className="text-xs text-zinc-400">
            Validated technical capabilities backed by automated evaluation rubrics
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : competencies.length === 0 ? (
        <Card className="border border-zinc-800/80 bg-zinc-900/30 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-2 p-0">
            <Briefcase className="h-10 w-10 text-zinc-600" />
            <div className="text-sm font-medium text-zinc-400">No mastered competencies yet</div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Work through the curriculum and pass exercises to demonstrate and lock in technical competencies.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competencies.map((item) => {
            const comp = item.competency;
            return (
              <Card
                key={item.id}
                className="border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all p-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-semibold tracking-wider">
                      {comp?.code || "COMP-ID"}
                    </span>
                    {getLevelBadge(comp?.level)}
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-2">
                    {comp?.title || "Demonstrated Engineering Competency"}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mastered</span>
                  </span>
                  <span className="text-[11px] text-zinc-500">Verified Rubric</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
