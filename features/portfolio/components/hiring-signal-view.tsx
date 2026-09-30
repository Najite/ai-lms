import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Activity, Calendar, CheckCircle2 } from "lucide-react";
import type { PortfolioHiringSignal, HiringSignalStrength, HiringSignalType } from "../types";

export interface HiringSignalViewProps {
  signals: PortfolioHiringSignal[];
  isLoading?: boolean;
}

function getSignalStrengthBadge(strength: HiringSignalStrength) {
  const norm = strength.toLowerCase();
  if (norm === "high" || norm === "strong") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-[10px] uppercase font-bold"
      >
        Strong Signal
      </Badge>
    );
  }
  if (norm === "medium" || norm === "moderate") {
    return (
      <Badge
        variant="outline"
        className="border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[10px] uppercase font-semibold"
      >
        Moderate Signal
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-blue-500/40 bg-blue-500/10 text-blue-300 font-mono text-[10px] uppercase"
    >
      Foundational Signal
    </Badge>
  );
}

function formatSignalType(signalType: HiringSignalType | string): string {
  switch (signalType) {
    case "competency_demonstrated":
      return "Demonstrated Core Engineering Competency";
    case "exercise_completed":
      return "Completed Production Exercise Suite";
    case "achievement_earned":
      return "Unlocked High-Effort Milestone";
    case "gate_completed":
      return "Validated Comprehensive Gate Barrier";
    case "artifact_produced":
      return "Produced Verified Architectural Artifact";
    default:
      return signalType.replace(/_/g, " ");
  }
}

export function HiringSignalView({ signals, isLoading }: HiringSignalViewProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <Sparkles className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Technical Hiring Signals</h2>
          <p className="text-xs text-zinc-400">
            Objective, algorithmic indicators derived from verified project completions and assessment evidence
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : signals.length === 0 ? (
        <Card className="border border-zinc-800/80 bg-zinc-900/30 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-2 p-0">
            <Activity className="h-10 w-10 text-zinc-600" />
            <div className="text-sm font-medium text-zinc-400">No hiring signals generated yet</div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Signals are automatically generated as you demonstrate competencies, complete production-grade exercises, and finish gates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => (
            <Card
              key={signal.id}
              className="border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all p-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                    {signal.signalType.replace(/_/g, " ")}
                  </span>
                  {getSignalStrengthBadge(signal.signalStrength)}
                </div>
                <h3 className="text-sm font-bold text-zinc-100">
                  {formatSignalType(signal.signalType)}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Evidence Verified</span>
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3" />
                  {new Date(signal.generatedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
