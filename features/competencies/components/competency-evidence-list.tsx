import React from "react";
import { CheckCircle2, Clock, FileCheck2 } from "lucide-react";
import type { CompetencyEvidence } from "../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CompetencyEvidenceListProps {
  evidence: CompetencyEvidence[];
  className?: string;
}

export function CompetencyEvidenceList({ evidence, className }: CompetencyEvidenceListProps) {
  if (evidence.length === 0) {
    return (
      <div className={cn("text-center py-8 border border-dashed border-border rounded-xl bg-card/20 p-6", className)}>
        <FileCheck2 className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-foreground">No Evidence Recorded Yet</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Complete contributing lessons and modules in the curriculum to demonstrate and record verified competency evidence.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {evidence.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-semibold text-foreground truncate">{item.sourceTitle}</h5>
                <Badge variant="outline" className="text-[10px] uppercase font-mono border-border/70">
                  {item.sourceType.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/70 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
