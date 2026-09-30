"use client";

import React from "react";
import type { GitCommitNode } from "./types";
import { cn } from "@/lib/utils";
import { GitCommit, User, Calendar, FileCode, FolderTree, X } from "lucide-react";

export interface CommitMetadataInspectorProps {
  commit: GitCommitNode | null;
  allCommits?: GitCommitNode[];
  onSelectCommit?: (commitId: string) => void;
  onClose?: () => void;
  className?: string;
}

export function CommitMetadataInspector({
  commit,
  allCommits = [],
  onSelectCommit,
  onClose,
  className,
}: CommitMetadataInspectorProps) {
  if (!commit) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border/80 bg-zinc-950/95 p-6 shadow-xl shadow-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center space-y-2 text-xs text-muted-foreground",
          className
        )}
      >
        <GitCommit className="w-8 h-8 text-zinc-600 animate-pulse" />
        <p className="font-semibold text-zinc-300">No Commit Object Selected</p>
        <p className="text-[11px] text-zinc-500 max-w-sm">
          Click any commit node in the DAG graph or timeline explorer to inspect its SHA-1 hash, parent pointers, tree snapshot, and file diffs.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-zinc-950/95 overflow-hidden shadow-xl shadow-black/50 backdrop-blur-sm flex flex-col",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-zinc-900/80 text-xs">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <GitCommit className="w-4 h-4 text-primary" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Git Object Database Record
          </span>
          <span className="font-mono bg-primary/20 text-primary font-bold px-2 py-0.5 rounded border border-primary/30">
            {commit.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            Type: Commit Object (Immutable)
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close Inspector"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Core Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* SHA-1 Hash */}
          <div className="p-3 bg-black/60 rounded-xl border border-border/40 space-y-1">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
              Commit SHA-1 Hash (40-char)
            </span>
            <div className="font-mono text-primary font-bold text-xs break-all">
              {commit.hash}
            </div>
          </div>

          {/* Tree Pointer */}
          <div className="p-3 bg-black/60 rounded-xl border border-border/40 space-y-1">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
              Root Tree Snapshot Pointer
            </span>
            <div className="font-mono text-zinc-300 font-semibold text-xs break-all flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>tree {commit.treeHash.slice(0, 16)}...</span>
            </div>
          </div>

          {/* Author */}
          <div className="p-3 bg-black/60 rounded-xl border border-border/40 space-y-1">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
              Author & Provenance
            </span>
            <div className="text-zinc-200 font-medium text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {commit.authorName} &lt;{commit.authorEmail}&gt;
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div className="p-3 bg-black/60 rounded-xl border border-border/40 space-y-1">
            <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
              Author Timestamp
            </span>
            <div className="text-zinc-200 font-mono text-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {commit.timestamp} ({commit.relativeTime})
              </span>
            </div>
          </div>
        </div>

        {/* Parent Pointers Box */}
        <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-border/50 space-y-2 text-xs">
          <div className="text-muted-foreground text-[11px] uppercase tracking-wider font-bold">
            Backward Parent Pointers ({commit.parentIds.length})
          </div>
          {commit.parentIds.length === 0 ? (
            <div className="text-sky-400 font-mono text-xs py-1">
              &bull; None (Repository Genesis Root Commit)
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {commit.parentIds.map((pId, idx) => {
                const parentNode = allCommits.find((c) => c.id === pId);
                return (
                  <button
                    key={pId}
                    onClick={() => onSelectCommit?.(pId)}
                    className="px-3 py-1.5 bg-zinc-950 rounded-lg border border-border text-xs font-mono text-zinc-200 hover:border-primary transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-muted-foreground">Parent {idx + 1}:</span>
                    <strong className="text-primary">{pId}</strong>
                    <span className="text-zinc-500">({parentNode?.shortHash})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Commit Message */}
        <div className="space-y-1.5">
          <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
            Commit Message
          </span>
          <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-border/70 text-sm font-sans text-foreground leading-relaxed">
            {commit.message}
          </div>
        </div>

        {/* Whole-Project Snapshot Tree */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-primary" />
              Project File Snapshot State ({commit.snapshotFiles.length} files)
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Immutable Content Objects</span>
          </div>

          <div className="space-y-2">
            {commit.snapshotFiles.map((file, fIdx) => (
              <div
                key={fIdx}
                className="p-3 bg-black/40 rounded-xl border border-border/40 text-xs space-y-1.5 font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-zinc-200 font-semibold">{file.path}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[9px] uppercase px-1.5 py-0.5 rounded font-bold",
                        file.status === "added" && "bg-emerald-950 text-emerald-400 border border-emerald-800",
                        file.status === "modified" && "bg-amber-950 text-amber-400 border border-amber-800",
                        file.status === "unchanged" && "bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {file.status}
                    </span>
                    <span className="text-zinc-500 text-[10px]">{file.size}</span>
                  </div>
                </div>
                <div className="p-2 bg-zinc-950/80 rounded border border-border/30 text-[11px] text-zinc-400 overflow-x-auto whitespace-pre">
                  {file.contentPreview}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
