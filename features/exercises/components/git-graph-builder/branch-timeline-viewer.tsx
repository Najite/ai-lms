"use client";

import React from "react";
import type { GitBranchInfo, GitCommitNode } from "./types";
import { cn } from "@/lib/utils";
import { GitBranch, Cloud, ArrowRight } from "lucide-react";

export interface BranchTimelineViewerProps {
  branches?: GitBranchInfo[];
  commits: GitCommitNode[];
  selectedCommitId?: string | null;
  onSelectCommit: (commitId: string) => void;
  className?: string;
}

export function BranchTimelineViewer({
  commits,
  onSelectCommit,
  className,
}: BranchTimelineViewerProps) {
  // Ordered linear chains for each line
  const mainLine = ["C0", "C1", "C2", "C5", "M6", "C7"];
  const featureLine = ["C1", "C3", "C4"];
  const remoteLine = ["C0", "C1", "C2", "C5"];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-zinc-950/95 overflow-hidden shadow-xl shadow-black/50 backdrop-blur-sm flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-zinc-900/60 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium">
          <GitBranch className="w-4 h-4 text-primary" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Parallel Development Branch Timelines
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          3 Named Lines of Development
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Branch 1: main */}
        <div className="space-y-2.5 p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono font-bold text-sm text-emerald-300">main</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800">
                Active HEAD (C7)
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Current Tip: <strong className="text-zinc-200">7f3b8c44 (C7)</strong>
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Production trunk. Diverged from C1, merged feature/auth-gateway via M6, and holds current working HEAD.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {mainLine.map((cid, idx) => {
              const node = commits.find((c) => c.id === cid);
              if (!node) return null;
              const isLast = idx === mainLine.length - 1;

              return (
                <React.Fragment key={cid}>
                  <button
                    onClick={() => onSelectCommit(cid)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-mono text-xs border transition-all flex items-center gap-1.5",
                      node.isHead
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-sm shadow-emerald-900"
                        : node.isMerge
                        ? "bg-pink-950/40 border-pink-700 text-pink-300"
                        : "bg-zinc-900/90 border-border/70 text-zinc-300 hover:border-emerald-500"
                    )}
                  >
                    <span>{node.id}</span>
                    <span className="text-[10px] text-zinc-400">({node.shortHash})</span>
                    {node.isHead && <span className="text-amber-400 text-[10px]">📌</span>}
                  </button>
                  {!isLast && <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Branch 2: feature/auth-gateway */}
        <div className="space-y-2.5 p-4 rounded-xl border border-purple-900/40 bg-purple-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span className="font-mono font-bold text-sm text-purple-300">feature/auth-gateway</span>
              <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded-full border border-purple-800">
                Forked at C1
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Branch Tip: <strong className="text-zinc-200">d19a7e30 (C4)</strong>
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Experimental auth timeline created by Carol Vance. Branched from Common Ancestor C1 and merged into main at M6.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] text-zinc-500 italic mr-1">Split from Base:</span>
            {featureLine.map((cid, idx) => {
              const node = commits.find((c) => c.id === cid);
              if (!node) return null;
              const isLast = idx === featureLine.length - 1;

              return (
                <React.Fragment key={cid}>
                  <button
                    onClick={() => onSelectCommit(cid)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-mono text-xs border transition-all flex items-center gap-1.5",
                      cid === "C4"
                        ? "bg-purple-600/30 border-purple-500 text-purple-200 font-bold shadow-sm shadow-purple-900"
                        : cid === "C1"
                        ? "bg-blue-950/30 border-blue-700 text-blue-300 font-semibold"
                        : "bg-zinc-900/90 border-border/70 text-zinc-300 hover:border-purple-500"
                    )}
                  >
                    <span>{node.id}</span>
                    <span className="text-[10px] text-zinc-400">({node.shortHash})</span>
                    {cid === "C1" && <span className="text-[9px] text-blue-400">(Base)</span>}
                    {cid === "C4" && <span className="text-[9px] text-purple-400">(Tip)</span>}
                  </button>
                  {!isLast && <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Branch 3: origin/main (Remote Cloud Tracker) */}
        <div className="space-y-2.5 p-4 rounded-xl border border-sky-900/40 bg-sky-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cloud className="w-4 h-4 text-sky-400" />
              <span className="font-mono font-bold text-sm text-sky-300">origin/main (Remote Cloud)</span>
              <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded-full border border-sky-800">
                2 Commits Behind Local
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Remote Tip: <strong className="text-zinc-200">5c8b2011 (C5)</strong>
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Central repository archive on cloud server. Local <code className="text-emerald-300">main</code> has created <strong>M6</strong> and <strong>C7</strong> which have not yet been synchronized via <code className="text-sky-300 font-mono">push</code>.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {remoteLine.map((cid, idx) => {
              const node = commits.find((c) => c.id === cid);
              if (!node) return null;
              const isLast = idx === remoteLine.length - 1;

              return (
                <React.Fragment key={cid}>
                  <button
                    onClick={() => onSelectCommit(cid)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg font-mono text-xs border transition-all flex items-center gap-1.5",
                      cid === "C5"
                        ? "bg-sky-600/30 border-sky-500 text-sky-200 font-bold shadow-sm shadow-sky-900"
                        : "bg-zinc-900/90 border-border/70 text-zinc-300 hover:border-sky-500"
                    )}
                  >
                    <span>{node.id}</span>
                    <span className="text-[10px] text-zinc-400">({node.shortHash})</span>
                  </button>
                  {!isLast && <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                </React.Fragment>
              );
            })}
            <span className="text-zinc-500 text-xs px-2 font-mono italic">
              + [M6, C7] local unpushed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
