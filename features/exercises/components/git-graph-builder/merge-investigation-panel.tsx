"use client";

import React from "react";
import type { GitCommitNode } from "./types";
import { cn } from "@/lib/utils";
import { GitMerge, ArrowDown, ShieldCheck } from "lucide-react";

export interface MergeInvestigationPanelProps {
  commits: GitCommitNode[];
  onSelectCommit: (commitId: string) => void;
  className?: string;
}

export function MergeInvestigationPanel({
  commits,
  onSelectCommit,
  className,
}: MergeInvestigationPanelProps) {
  const baseCommit = commits.find((c) => c.id === "C1");
  const parent1 = commits.find((c) => c.id === "C5");
  const parent2 = commits.find((c) => c.id === "C4");
  const mergeCommit = commits.find((c) => c.id === "M6");

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-zinc-950/95 overflow-hidden shadow-xl shadow-black/50 backdrop-blur-sm flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-zinc-900/60 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium">
          <GitMerge className="w-4 h-4 text-pink-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            3-Way Merge Topology & Common Ancestor Analyzer
          </span>
        </div>
        <span className="text-[10px] text-pink-400 font-mono bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-800">
          Dual Parent Invariant
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Step 1: Base Commit (Common Ancestor) */}
        <div className="p-4 rounded-xl border border-blue-900/40 bg-blue-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              1. Common Ancestor (Base Commit)
            </span>
            <button
              onClick={() => onSelectCommit("C1")}
              className="px-2.5 py-1 bg-blue-900/40 border border-blue-700 rounded text-xs font-mono text-blue-200 hover:bg-blue-800/60"
            >
              C1 ({baseCommit?.shortHash || "8b2e4c19"})
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The snapshot state where <code className="text-emerald-300">main</code> and <code className="text-purple-300">feature/auth-gateway</code> parted ways. Both branches share this exact database pool foundation.
          </p>
        </div>

        {/* Step 2: Divergent Parallel Tips (Parent 1 and Parent 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parent 1 (Target Branch Tip) */}
          <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Parent 1: Target Branch (main)
              </span>
              <button
                onClick={() => onSelectCommit("C5")}
                className="px-2.5 py-1 bg-emerald-900/40 border border-emerald-700 rounded text-xs font-mono text-emerald-200 hover:bg-emerald-800/60"
              >
                C5 ({parent1?.shortHash || "5c8b2011"})
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip of <code className="text-emerald-300">main</code> when standing ready for integration. Modified database query index and pool size.
            </p>
          </div>

          {/* Parent 2 (Incoming Branch Tip) */}
          <div className="p-4 rounded-xl border border-purple-900/40 bg-purple-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Parent 2: Incoming (feature)
              </span>
              <button
                onClick={() => onSelectCommit("C4")}
                className="px-2.5 py-1 bg-purple-900/40 border border-purple-700 rounded text-xs font-mono text-purple-200 hover:bg-purple-800/60"
              >
                C4 ({parent2?.shortHash || "d19a7e30"})
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip of <code className="text-purple-300">feature/auth-gateway</code> being merged. Introduced JWT token verification middleware.
            </p>
          </div>
        </div>

        {/* Fusion Down Arrow */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-pink-400 bg-pink-950/40 px-3 py-1 rounded-full border border-pink-800">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>3-Way Merge Calculation (Base + Target + Incoming)</span>
          </div>
        </div>

        {/* Step 3: Resulting Merge Commit */}
        <div className="p-4 sm:p-5 rounded-xl border border-pink-900/60 bg-pink-950/20 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-pink-400" />
              <span className="font-mono font-bold text-sm text-pink-300">
                Merge Commit M6 ({mergeCommit?.shortHash || "9e4a2f78"})
              </span>
            </div>
            <button
              onClick={() => onSelectCommit("M6")}
              className="px-3 py-1 bg-pink-900/40 border border-pink-700 rounded text-xs font-mono text-pink-200 hover:bg-pink-800/60"
            >
              Inspect M6 Snapshot
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-black/50 p-3 rounded-lg border border-border/40 space-y-1 font-mono">
              <div className="text-muted-foreground text-[11px]">PARENT POINTER 1:</div>
              <div className="text-emerald-400 font-bold">{parent1?.hash ? `${parent1.hash.slice(0, 8)}... (C5 on main)` : "5c8b2011... (C5 on main)"}</div>
            </div>
            <div className="bg-black/50 p-3 rounded-lg border border-border/40 space-y-1 font-mono">
              <div className="text-muted-foreground text-[11px]">PARENT POINTER 2:</div>
              <div className="text-purple-400 font-bold">{parent2?.hash ? `${parent2.hash.slice(0, 8)}... (C4 on auth-gateway)` : "d19a7e30... (C4 on auth-gateway)"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/80 p-2.5 rounded-lg border border-border/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Dual Parent Guarantee:</strong> Git preserves the complete unbroken evolutionary history of both branches by embedding both parent hashes inside M6.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
