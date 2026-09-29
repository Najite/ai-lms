"use client";

import React from "react";
import Link from "next/link";
import {
  History,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExerciseHistoryTable } from "./exercise-history-table";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import type { ExerciseHistoryItem } from "../types";

export interface ExerciseHistoryPageProps {
  history: ExerciseHistoryItem[];
  isLoading?: boolean;
}

export function ExerciseHistoryPage({
  history,
  isLoading = false,
}: ExerciseHistoryPageProps) {
  const totalAttempts = history.length;
  const completedAttempts = history.filter((h) => h.attempt.state === "completed").length;
  const totalEvidence = history.reduce((acc, h) => acc + h.evidence.length, 0);
  const successRate =
    totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Navigation and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1 font-mono">
            <Link href="/exercises">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Exercises</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-border/60" />
          <LearningBreadcrumbs
            items={[
              { label: "Exercises", href: "/exercises" },
              { label: "History & Evidence" },
            ]}
          />
        </div>
      </div>

      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-border/70 p-6 md:p-8">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 gap-1.5 px-3 py-1 font-semibold text-xs font-mono"
            >
              <History className="h-3.5 w-3.5" />
              Audit Trail
            </Badge>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1 font-mono text-xs"
            >
              Immutable Verification
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Exercise Attempt History & Evidence
          </h1>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Review all previous exercise attempts, verification scores, and preserved competency evidence records generated across your training curriculum.
          </p>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Attempts
              </div>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                {totalAttempts}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
                Completed
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {completedAttempts}
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/30 bg-blue-950/15 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-blue-400 uppercase tracking-wider">
                Success Rate
              </div>
              <div className="text-2xl font-bold font-mono text-blue-400 mt-0.5">
                {successRate}%
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 backdrop-blur-sm">
              <div className="text-[11px] font-medium text-primary uppercase tracking-wider">
                Evidence Produced
              </div>
              <div className="text-2xl font-bold font-mono text-primary mt-0.5">
                {totalEvidence}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Attempt Records</span>
          <Badge variant="outline" className="font-mono text-xs">
            {totalAttempts} entries
          </Badge>
        </h2>

        {isLoading ? (
          <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-mono">Loading history records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
            <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-bold text-foreground">No History Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
              You have not attempted any exercises yet. Start an exercise to build your verified competency track record.
            </p>
            <Button asChild size="sm">
              <Link href="/exercises">Explore Exercises</Link>
            </Button>
          </div>
        ) : (
          <ExerciseHistoryTable history={history} />
        )}
      </section>
    </div>
  );
}
