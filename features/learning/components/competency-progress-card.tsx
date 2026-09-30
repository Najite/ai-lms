"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award, Shield } from "lucide-react";
import type { LessonCompetencyInfo } from "../types";

export interface CompetencyProgressCardProps {
  competency?: LessonCompetencyInfo | null;
  className?: string;
}

export function CompetencyProgressCard({
  competency,
  className,
}: CompetencyProgressCardProps) {
  const comp = competency || {
    code: "DEV-00",
    title: "Developer Environment & Tooling Fluency",
    targetState: "introduced" as const,
    capabilityGate: "Gate 1: Foundations",
  };

  const stateLabels: Record<string, string> = {
    unencountered: "Unencountered",
    introduced: "Introduced",
    practicing: "Practicing",
    reinforced: "Reinforced",
    mastered: "Mastered",
  };

  const activeState = comp.targetState || "introduced";
  const stateLabel = stateLabels[activeState] || "Introduced";

  return (
    <div
      className={`rounded-2xl border border-border/70 bg-card/50 p-5 space-y-4 backdrop-blur-sm shadow-sm ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Award className="w-4 h-4 text-primary" />
          <span>Competency Growth</span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-border/60">
          {comp.code}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-foreground leading-snug">
          {comp.title}
        </h3>
        {comp.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {comp.description}
          </p>
        )}
      </div>

      {/* State Progress Ladder */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Target Level:</span>
          <Badge variant="secondary" className="text-xs font-semibold capitalize bg-primary/10 text-primary border-primary/20">
            {stateLabel}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div
            className={`h-1.5 rounded-full ${
              ["introduced", "practicing", "reinforced", "mastered"].includes(activeState)
                ? "bg-primary"
                : "bg-muted"
            }`}
          />
          <div
            className={`h-1.5 rounded-full ${
              ["practicing", "reinforced", "mastered"].includes(activeState)
                ? "bg-primary"
                : "bg-muted"
            }`}
          />
          <div
            className={`h-1.5 rounded-full ${
              ["mastered"].includes(activeState) ? "bg-primary" : "bg-muted"
            }`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>Introduced</span>
          <span>Practicing</span>
          <span>Mastered</span>
        </div>
      </div>

      {/* Capability Gate Linkage */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Capability Gate:</span>
        </span>
        <span className="font-semibold text-foreground text-right truncate">
          {comp.capabilityGate || "Gate 1: Foundations"}
        </span>
      </div>
    </div>
  );
}
