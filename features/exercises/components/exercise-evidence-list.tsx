import React from "react";
import { ShieldCheck } from "lucide-react";
import type { ExerciseEvidence } from "../types";
import { Badge } from "@/components/ui/badge";

export interface ExerciseEvidenceListProps {
  evidence: ExerciseEvidence[];
}

export function ExerciseEvidenceList({ evidence }: ExerciseEvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-background/40 p-6 text-center text-xs text-muted-foreground">
        No competency evidence has been generated yet for this exercise.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-emerald-400">
                {item.competency?.code || "COMP-EV"}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {item.competency?.title || "Competency Reinforcement"}
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]"
            >
              Auditable Evidence
            </Badge>
          </div>

          <p className="text-xs leading-relaxed text-foreground/90 font-mono bg-background/50 p-2.5 rounded border border-border/30">
            {item.summary}
          </p>

          <div className="text-[10px] text-muted-foreground font-mono flex justify-between pt-1">
            <span>Evidence ID: {item.id}</span>
            <span>Recorded: {new Date(item.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
