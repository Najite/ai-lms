"use client";

import { Shield, CheckCircle, AlertOctagon, Scale } from "lucide-react";
import type { CandidateSolution } from "./types";
import { cn } from "@/lib/utils";

interface EvaluationScoringMatrixProps {
  candidates: CandidateSolution[];
}

export function EvaluationScoringMatrix({ candidates }: EvaluationScoringMatrixProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Evaluation Scoring Matrix</h3>
            <p className="text-xs text-muted-foreground">
              Objective grading rubric assessing Security (RLS), Schema Compliance, Correctness, and Maintainability.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-border/60 text-zinc-400 font-mono">
          Eval Engine Rubric
        </span>
      </div>

      {/* Comparative Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-border/60 bg-zinc-950/80 text-zinc-400 text-[11px]">
              <th className="py-2.5 px-3 font-semibold">Candidate PR</th>
              <th className="py-2.5 px-3 font-semibold">PostgreSQL RLS Security</th>
              <th className="py-2.5 px-3 font-semibold">Zod / Schema Compliance</th>
              <th className="py-2.5 px-3 font-semibold">Correctness</th>
              <th className="py-2.5 px-3 font-semibold">Composite Eval Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {candidates.map((cand) => {
              const composite = Math.round(
                cand.securityScore * 0.4 +
                  cand.correctnessScore * 0.3 +
                  cand.schemaComplianceScore * 0.2 +
                  cand.maintainabilityScore * 0.1
              );
              const isOptimal = composite >= 90;
              const isVulnerable = composite < 50;

              return (
                <tr
                  key={cand.id}
                  className={cn(
                    "hover:bg-secondary/40 transition-colors",
                    isOptimal ? "bg-emerald-500/5" : isVulnerable ? "bg-rose-500/5" : ""
                  )}
                >
                  <td className="py-3 px-3 font-bold text-zinc-200">
                    <div className="flex items-center gap-1.5">
                      {isOptimal ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isVulnerable ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{cand.name.split(" ")[0]} {cand.name.split(" ")[1]}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-semibold",
                        cand.securityScore >= 90
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : cand.securityScore < 50
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      )}
                    >
                      {cand.securityScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-zinc-300">{cand.schemaComplianceScore}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-zinc-300">{cand.correctnessScore}%</span>
                  </td>
                  <td className="py-3 px-3 font-bold">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded text-xs",
                        isOptimal
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : isVulnerable
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      )}
                    >
                      {composite}% {isOptimal ? "★ Optimal" : isVulnerable ? "✗ Critical Flaw" : "⚠ Sub-optimal"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
