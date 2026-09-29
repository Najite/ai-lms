"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  FileCheck,
  History,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExerciseCompletion, ExerciseEvidence } from "../types";

export interface ExerciseCompletionCardProps {
  completion: ExerciseCompletion;
  evidence: ExerciseEvidence[];
  exerciseTitle: string;
  lessonId?: string;
}

export function ExerciseCompletionCard({
  completion,
  evidence,
  exerciseTitle,
  lessonId,
}: ExerciseCompletionCardProps) {
  return (
    <Card className="overflow-hidden border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-background to-background p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-mono text-[10px] px-2 py-0.5">
                Completed
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(completion.completedAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mt-0.5">
              {exerciseTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-2 self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-emerald-400">
              Validation Score
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-300">
              {completion.score}%
            </div>
          </div>
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
        </div>
      </div>

      {/* Competency Evidence Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Preserved Competency Evidence ({evidence.length})</span>
          </h4>
          <span className="text-[11px] text-muted-foreground font-mono">
            Immutable Audit Trail
          </span>
        </div>

        {evidence.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            Competency evidence records are being synchronized.
          </p>
        ) : (
          <div className="space-y-2">
            {evidence.map((ev) => (
              <div
                key={ev.id}
                className="rounded-lg border border-border/60 bg-card/60 p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold font-mono text-foreground">
                      {ev.competency?.code || "COMPETENCY"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {ev.competency?.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(ev.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-5.5">
                  {ev.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
        <Button asChild variant="outline" size="sm" className="gap-1.5 font-mono text-xs">
          <Link href="/exercises/history">
            <History className="h-3.5 w-3.5" />
            <span>View Exercise History</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {lessonId && (
            <Button asChild variant="outline" size="sm" className="font-mono text-xs">
              <Link href={`/lessons/${lessonId}`}>Return to Lesson</Link>
            </Button>
          )}
          <Button asChild size="sm" className="gap-1.5 font-mono text-xs font-semibold">
            <Link href="/exercises">
              <span>Next Exercise</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
