import React from "react";
import { Check, Sparkles, Flame, ShieldCheck, Trophy, Circle } from "lucide-react";
import type { CompetencyState } from "../types";
import { COMPETENCY_STATE_ORDER } from "../state-machine/competency-state-machine";
import { cn } from "@/lib/utils";

export interface CompetencyLevelStepperProps {
  currentState: CompetencyState;
  score?: number;
  className?: string;
}

const STEPS: { state: CompetencyState; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { state: "not_started", label: "Not Started", icon: Circle },
  { state: "introduced", label: "Introduced", icon: Sparkles },
  { state: "practicing", label: "Practicing", icon: Flame },
  { state: "reinforced", label: "Reinforced", icon: ShieldCheck },
  { state: "mastered", label: "Mastered", icon: Trophy },
];

export function CompetencyLevelStepper({
  currentState,
  score,
  className,
}: CompetencyLevelStepperProps) {
  const currentWeight = COMPETENCY_STATE_ORDER[currentState] ?? 0;

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>Competency State Progression</span>
        {score !== undefined && (
          <span className="font-semibold text-foreground">Mastery Score: {score}/100</span>
        )}
      </div>

      <div className="relative flex items-center justify-between">
        {/* Background Connecting Track */}
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-secondary/80 rounded-full" />

        {/* Active Filled Track */}
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-purple-500 via-amber-500 via-cyan-500 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${(currentWeight / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Step Nodes */}
        {STEPS.map((step, idx) => {
          const isPassed = currentWeight > idx;
          const isCurrent = currentWeight === idx;
          const Icon = step.icon;

          return (
            <div
              key={step.state}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 scale-110 shadow-lg shadow-primary/20"
                    : isPassed
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-background text-muted-foreground/50 border-border/80"
                )}
              >
                {isPassed ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <span
                className={cn(
                  "mt-2 text-[11px] font-medium tracking-tight whitespace-nowrap hidden sm:block transition-colors",
                  isCurrent
                    ? "text-primary font-bold"
                    : isPassed
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground/60"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
