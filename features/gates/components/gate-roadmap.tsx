"use client";

import React from "react";
import { Check, Lock, Play, Shield } from "lucide-react";
import type { UserGateStatusView } from "../types";

export interface GateRoadmapProps {
  gates: UserGateStatusView[];
}

export function GateRoadmap({ gates }: GateRoadmapProps) {
  const sorted = [...gates].sort((a, b) => a.gate.gateLevel - b.gate.gateLevel);
  const completedCount = sorted.filter((g) => g.isCompleted).length;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight text-foreground font-display">
              Competency Gate Mastery Path
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Linear mastery progression verifying readiness across 7 software engineering capability gates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-muted/40 border border-border/50 px-3 py-1.5 rounded-lg text-xs font-mono">
          <span className="text-muted-foreground">Verified Gates:</span>
          <span className="font-bold text-emerald-400">
            {completedCount}/{sorted.length}
          </span>
        </div>
      </div>

      {/* Sequential Progression Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {sorted.map((item) => {
          const { gate, status, isCompleted } = item;

          return (
            <div
              key={gate.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all relative ${
                isCompleted
                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                  : status === "in_progress"
                  ? "bg-amber-950/20 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30"
                  : status === "available"
                  ? "bg-blue-950/20 border-blue-500/30 text-blue-300"
                  : "bg-card/20 border-border/40 text-muted-foreground opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  Lvl {gate.gateLevel}
                </span>
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                    isCompleted
                      ? "bg-emerald-500 text-black font-bold"
                      : status === "in_progress"
                      ? "bg-amber-500 text-black font-bold animate-pulse"
                      : status === "available"
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : status === "in_progress" ? (
                    <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                  ) : status === "available" ? (
                    gate.gateLevel
                  ) : (
                    <Lock className="h-2.5 w-2.5" />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-tight text-foreground line-clamp-1">
                  {gate.name.replace(/^Gate \d+:\s*/, "")}
                </h4>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {status.replace("_", " ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
