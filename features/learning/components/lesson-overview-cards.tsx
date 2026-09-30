"use client";

import React from "react";
import { Lightbulb, Target, CheckCircle2, ShieldCheck } from "lucide-react";

export interface LessonOverviewCardsProps {
  whyThisMatters?: string | null;
  learningOutcomes: string[];
  prerequisites: string[];
  className?: string;
}

export function LessonOverviewCards({
  whyThisMatters,
  learningOutcomes,
  prerequisites,
  className,
}: LessonOverviewCardsProps) {
  return (
    <div className={`space-y-5 ${className || ""}`}>
      {/* 1. Why This Matters Card */}
      {whyThisMatters && (
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6 space-y-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm tracking-wide">
            <Lightbulb className="w-4 h-4" />
            <span>Why This Matters</span>
          </div>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
            {whyThisMatters}
          </p>
        </div>
      )}

      {/* 2. What You Will Learn & Prerequisites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Learning Outcomes */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span>What You Will Learn</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            {learningOutcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground/90 leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prerequisites */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Prerequisites</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            {prerequisites.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                <span className="text-foreground/90 leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
