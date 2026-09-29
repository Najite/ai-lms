"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Award, Terminal } from "lucide-react";
import { useExerciseHistory } from "../hooks/use-exercises";
import { ExerciseStatusBadge } from "./exercise-status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExerciseHistoryItem } from "../types";

export interface ExerciseHistoryTableProps {
  history?: ExerciseHistoryItem[];
  isLoading?: boolean;
}

export function ExerciseHistoryTable(props?: ExerciseHistoryTableProps) {
  const hookData = useExerciseHistory();
  const history = props?.history ?? hookData.history;
  const isLoading = props?.isLoading ?? hookData.isLoading;
  const error = hookData.error;
  const refetch = hookData.refetch;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Clock className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading exercise history...</p>
        </div>
      </div>
    );
  }

  if (error && !props?.history) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
        <span>{error}</span>
        <Button size="sm" variant="outline" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
        <Terminal className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-bold text-foreground">No Exercise Attempts Recorded</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
          You have not attempted any practical exercises yet. Explore the exercise catalog to start building verified evidence.
        </p>
        <Button asChild size="sm">
          <Link href="/exercises">Explore Exercises</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-secondary/30 text-muted-foreground font-mono uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Exercise</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Attempt</th>
                <th className="py-3 px-4 font-semibold">State</th>
                <th className="py-3 px-4 font-semibold">Validation Score</th>
                <th className="py-3 px-4 font-semibold">Evidence Preserved</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {history.map((item) => {
                const isPassed = item.latestSubmission?.status === "passed";
                const score =
                  item.completion?.score ?? item.latestSubmission?.validationOutput?.score ?? null;

                return (
                  <tr
                    key={item.attempt.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">
                        {item.exercise.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {new Date(item.attempt.startedAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {item.exercise.categoryName}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold">
                      #{item.attempt.attemptNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <ExerciseStatusBadge
                        state={item.attempt.state}
                        isCompleted={item.attempt.state === "completed"}
                      />
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {score !== null ? (
                        <span
                          className={cn(
                            "font-bold",
                            isPassed ? "text-emerald-400" : "text-amber-400"
                          )}
                        >
                          {score}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.evidence.length > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] gap-1"
                        >
                          <Award className="h-3 w-3" />
                          {item.evidence.length} Record{item.evidence.length > 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs gap-1">
                        <Link href={`/exercises/${item.exercise.slug}`}>
                          <span>Workspace</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
