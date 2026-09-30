"use client";

import React from "react";
import type { GitCommitNode, GitInvestigationFormState } from "./types";
import { cn } from "@/lib/utils";
import {
  FileSearch,
  GitCommit,
  GitBranch,
  GitMerge,
  Cloud,
  Network,
} from "lucide-react";

export interface DagAnalysisWorkspaceProps {
  formState: GitInvestigationFormState;
  onChange: (updates: Partial<GitInvestigationFormState>) => void;
  commits: GitCommitNode[];
  onSelectCommit?: (commitId: string) => void;
  className?: string;
}

export function DagAnalysisWorkspace({
  formState,
  onChange,
  commits,
  className,
}: DagAnalysisWorkspaceProps) {
  const commitOptions = commits.map((c) => ({ id: c.id, label: `${c.id} (${c.shortHash})` }));

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-zinc-950/95 overflow-hidden shadow-xl shadow-black/50 backdrop-blur-sm flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-zinc-900/80 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium">
          <FileSearch className="w-4 h-4 text-primary" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Forensic Investigation Station (Incident #5012)
          </span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">
          5 Diagnostic Inquiries &bull; Zero CLI Flags
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6 divide-y divide-border/40">
        {/* Section 1: Genesis & Branch Tips */}
        <div className="space-y-4 pt-0">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <GitCommit className="w-4 h-4 text-primary" />
            <span>Section 1: Genesis Root & Branch Tip Resolution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Root Genesis Commit */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                1. Repository Genesis Root (0 Parent Links)
              </label>
              <select
                value={formState.task1_rootGenesisCommitId}
                onChange={(e) => onChange({ task1_rootGenesisCommitId: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Root Genesis Commit --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Active HEAD Branch */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                2. Active Branch Bookmark Attached to HEAD
              </label>
              <select
                value={formState.task1_activeHeadBranch}
                onChange={(e) => onChange({ task1_activeHeadBranch: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Active Branch --</option>
                <option value="main">main</option>
                <option value="feature/auth-gateway">feature/auth-gateway</option>
                <option value="origin/main">origin/main</option>
              </select>
            </div>

            {/* 3. Active HEAD Commit */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                3. Exact Commit Currently Pointed by HEAD
              </label>
              <select
                value={formState.task1_activeHeadCommitId}
                onChange={(e) => onChange({ task1_activeHeadCommitId: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Current HEAD Commit --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Feature Branch Tip */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                4. Latest Tip Commit on feature/auth-gateway
              </label>
              <select
                value={formState.task1_featureBranchTipId}
                onChange={(e) => onChange({ task1_featureBranchTipId: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Feature Branch Tip --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Ancestry & Lineage */}
        <div className="space-y-4 pt-5">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span>Section 2: Commit Ancestry & Directional Links</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Direct parent of C2 */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                1. Immediate Parent Commit of C2 (e7d09a55)
              </label>
              <select
                value={formState.task2_directParentOfC2}
                onChange={(e) => onChange({ task2_directParentOfC2: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Direct Parent --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Arrow Direction Invariant */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                2. Physical Arrow Direction in Git DAG
              </label>
              <select
                value={formState.task2_arrowDirection}
                onChange={(e) => onChange({ task2_arrowDirection: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Temporal Arrow Direction --</option>
                <option value="backward_to_past">
                  Backward to Past: Child commits point strictly to parent ancestors
                </option>
                <option value="forward_to_future">
                  Forward to Future: Parents point forward to future commits
                </option>
                <option value="bidirectional">
                  Bidirectional: Circular double arrows
                </option>
              </select>
            </div>

            {/* Backwards ancestry chain of C4 */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40 md:col-span-2">
              <label className="font-medium text-zinc-300">
                3. Full Backwards Ancestry Path of C4 (Feature Tip &rarr; Genesis)
              </label>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["C4", "C3", "C1", "C0"].map((nodeId, idx) => (
                  <button
                    key={nodeId}
                    type="button"
                    onClick={() => {
                      const current = formState.task2_c4AncestryChain;
                      if (current.includes(nodeId)) {
                        onChange({
                          task2_c4AncestryChain: current.filter((c) => c !== nodeId),
                        });
                      } else {
                        onChange({
                          task2_c4AncestryChain: [...current, nodeId],
                        });
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-mono transition-all",
                      formState.task2_c4AncestryChain.includes(nodeId)
                        ? "bg-primary/20 border-primary text-primary font-bold shadow-sm"
                        : "bg-zinc-900 border-border text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    {idx + 1}. {nodeId}
                  </button>
                ))}
                <span className="text-[11px] text-zinc-500 font-mono ml-2">
                  (Click nodes in order: C4 &rarr; C3 &rarr; C1 &rarr; C0)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Branch Forking & Common Ancestor */}
        <div className="space-y-4 pt-5">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Network className="w-4 h-4 text-blue-400" />
            <span>Section 3: Branch Forking & Common Ancestor (Base Commit)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Common Ancestor of C5 and C4 */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                1. Common Ancestor (Base Commit) of C5 and C4
              </label>
              <select
                value={formState.task3_commonAncestorBaseCommit}
                onChange={(e) => onChange({ task3_commonAncestorBaseCommit: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Common Ancestor --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Storage Mechanics */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                2. Physical Storage Mechanism of a Git Branch
              </label>
              <select
                value={formState.task3_branchStorageType}
                onChange={(e) => onChange({ task3_branchStorageType: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Branch Storage Model --</option>
                <option value="lightweight_pointer">
                  Lightweight Pointer: A 41-byte named text reference holding a 40-char SHA hash
                </option>
                <option value="duplicate_directory">
                  Duplicate Directory: A separate physical folder copying all gigabytes of files
                </option>
                <option value="tar_archive">
                  Tar Archive: A compressed zip archive of every version
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: 3-Way Merge Diagnostics */}
        <div className="space-y-4 pt-5">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <GitMerge className="w-4 h-4 text-pink-400" />
            <span>Section 4: 3-Way Merge Dual-Parent Topology</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Merge Commit ID */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                1. Merge Commit ID
              </label>
              <select
                value={formState.task4_mergeCommitId}
                onChange={(e) => onChange({ task4_mergeCommitId: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Merge Commit --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent 1 (Target: main) */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                2. Parent 1 (Target on main)
              </label>
              <select
                value={formState.task4_mergeParent1Id}
                onChange={(e) => onChange({ task4_mergeParent1Id: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Parent 1 --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent 2 (Incoming: feature) */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                3. Parent 2 (Incoming feature)
              </label>
              <select
                value={formState.task4_mergeParent2Id}
                onChange={(e) => onChange({ task4_mergeParent2Id: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Parent 2 --</option>
                {commitOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: DAG Topology & Remote Synchronization */}
        <div className="space-y-4 pt-5">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>Section 5: DAG Invariants & Remote (origin) Synchronization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* DAG Acyclic Guarantee */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                1. Why Git Commit History is Acyclic (DAG)
              </label>
              <select
                value={formState.task5_dagAcyclicGuarantee}
                onChange={(e) => onChange({ task5_dagAcyclicGuarantee: e.target.value })}
                className="w-full bg-zinc-950 border border-border/80 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-primary"
              >
                <option value="">-- Select Acyclic Invariant --</option>
                <option value="time_one_way_no_loops">
                  Time flows one way: commits point to existing ancestors; no commit can be its own ancestor
                </option>
                <option value="linear_lock">
                  Linear lock: only 1 developer can commit per day
                </option>
                <option value="cloud_enforced">
                  Cloud enforced: GitHub rejects branching graphs
                </option>
              </select>
            </div>

            {/* Unpushed local commits */}
            <div className="space-y-1.5 p-3.5 bg-zinc-900/60 rounded-xl border border-border/40">
              <label className="font-medium text-zinc-300">
                2. Local Commits Pending Push to origin/main (at C5)
              </label>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["M6", "C7", "C5", "C4"].map((cid) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => {
                      const current = formState.task5_unpushedLocalCommits;
                      if (current.includes(cid)) {
                        onChange({
                          task5_unpushedLocalCommits: current.filter((c) => c !== cid),
                        });
                      } else {
                        onChange({
                          task5_unpushedLocalCommits: [...current, cid],
                        });
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-mono transition-all",
                      formState.task5_unpushedLocalCommits.includes(cid)
                        ? "bg-sky-600/30 border-sky-500 text-sky-200 font-bold shadow-sm"
                        : "bg-zinc-900 border-border text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    {cid}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
