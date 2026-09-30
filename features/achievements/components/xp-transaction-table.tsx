"use client";

import React from "react";
import { Zap, Clock, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { XPTransaction } from "../types";

export interface XPTransactionTableProps {
  transactions: XPTransaction[];
  isLoading?: boolean;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  lesson_completion: {
    label: "Lesson Completion",
    color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  exercise_completion: {
    label: "Exercise Validation",
    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
  competency_progression: {
    label: "Competency Progression",
    color: "border-primary/30 text-primary bg-primary/10",
  },
  achievement: {
    label: "Achievement Milestone",
    color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
};

export function XPTransactionTable({
  transactions,
  isLoading = false,
}: XPTransactionTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Clock className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-mono">Loading transaction ledger...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
        <Terminal className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-bold text-foreground">No XP Transactions Recorded</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          Complete curriculum lessons, exercises, or competencies to record your first XP grants.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/60 bg-secondary/30 text-muted-foreground font-mono uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Source Event</th>
              <th className="py-3 px-4 font-semibold">Reference</th>
              <th className="py-3 px-4 font-semibold text-right">XP Granted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {transactions.map((tx) => {
              const meta = SOURCE_LABELS[tx.sourceType] || {
                label: tx.sourceType,
                color: "border-border text-foreground",
              };

              return (
                <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="outline" className={`font-mono text-[10px] ${meta.color}`}>
                      {meta.label}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted-foreground truncate max-w-[200px]">
                    {tx.sourceId}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                    <span className="flex items-center justify-end gap-1">
                      <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
                      +{tx.amount} XP
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
