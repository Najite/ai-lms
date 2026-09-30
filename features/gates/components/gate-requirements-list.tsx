import React from "react";
import { CheckCircle2, Circle, Zap, BookOpen, Code2, Award, FileText, CheckCheck } from "lucide-react";
import type { UserGateStatusView } from "../types";

export interface GateRequirementsListProps {
  statusView: UserGateStatusView;
}

export function GateRequirementsList({ statusView }: GateRequirementsListProps) {
  const evaluations = statusView.requirementsEvaluation || [];

  if (evaluations.length === 0) {
    return (
      <div className="text-xs text-muted-foreground font-mono italic">
        No specific prerequisite requirements configured.
      </div>
    );
  }

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case "competency":
        return <CheckCheck className="h-3.5 w-3.5 text-indigo-400" />;
      case "lesson":
        return <BookOpen className="h-3.5 w-3.5 text-blue-400" />;
      case "exercise":
        return <Code2 className="h-3.5 w-3.5 text-emerald-400" />;
      case "achievement":
        return <Award className="h-3.5 w-3.5 text-amber-400" />;
      case "xp":
        return <Zap className="h-3.5 w-3.5 text-yellow-400" />;
      case "artifact":
        return <FileText className="h-3.5 w-3.5 text-purple-400" />;
      default:
        return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-mono font-medium text-foreground flex items-center justify-between">
        <span className="text-muted-foreground">Prerequisite Criteria</span>
        <span className="text-muted-foreground text-[11px]">
          {evaluations.filter((e) => e.satisfied).length}/{evaluations.length} Satisfied
        </span>
      </div>

      <div className="space-y-1.5">
        {evaluations.map((evalItem, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-colors ${
              evalItem.satisfied
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-card/40 border-border/40 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              {getRequirementIcon(evalItem.type)}
              <span>{evalItem.message || `${evalItem.type} requirement`}</span>
            </div>

            <div>
              {evalItem.satisfied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
