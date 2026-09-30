"use client";

import React from "react";
import type { GitCommitNode } from "./types";
import { cn } from "@/lib/utils";
import { GitBranch, Pin } from "lucide-react";

export interface CommitGraphCanvasProps {
  commits: GitCommitNode[];
  selectedCommitId: string | null;
  onSelectCommit: (commitId: string) => void;
  className?: string;
}

export function CommitGraphCanvas({
  commits,
  selectedCommitId,
  onSelectCommit,
  className,
}: CommitGraphCanvasProps) {
  // Coordinate calculations
  const NODE_SPACING_X = 140;
  const START_X = 80;
  const LANE_Y_MAIN = 140;
  const LANE_Y_FEATURE = 250;

  const getNodeCoords = (node: GitCommitNode) => {
    const x = START_X + node.depth * NODE_SPACING_X;
    const y = node.lane === 0 ? LANE_Y_MAIN : LANE_Y_FEATURE;
    return { x, y };
  };

  const selectedNode = commits.find((c) => c.id === selectedCommitId);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-zinc-950/95 overflow-hidden shadow-xl shadow-black/50 backdrop-blur-sm flex flex-col",
        className
      )}
    >
      {/* Top Action & Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-border/40 bg-zinc-900/60 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium">
          <GitBranch className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Interactive Git Commit DAG Canvas
          </span>
          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary/30 font-mono">
            8 Immutable Nodes
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400" />
            <span>main branch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400" />
            <span>feature/auth-gateway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-500 border border-pink-400" />
            <span>3-way merge</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Pin className="w-3 h-3" />
            <span>HEAD Pin</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="p-4 sm:p-6 overflow-x-auto min-h-[360px] flex items-center justify-center bg-gradient-to-b from-zinc-950/80 via-zinc-950 to-black/90">
        <svg
          viewBox="0 0 940 340"
          className="w-full max-w-[940px] h-auto min-w-[760px] select-none"
        >
          <defs>
            {/* Arrow Marker pointing strictly backward to parents */}
            <marker
              id="arrow-backward"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
            </marker>

            <marker
              id="arrow-merge"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
            </marker>

            {/* Glow Filters */}
            <filter id="glow-selected" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Lane Background Tracks */}
          <line
            x1="40"
            y1={LANE_Y_MAIN}
            x2="900"
            y2={LANE_Y_MAIN}
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x="30"
            y={LANE_Y_MAIN - 35}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            className="uppercase tracking-widest font-semibold"
          >
            Lane 0: main (Production)
          </text>

          <line
            x1="40"
            y1={LANE_Y_FEATURE}
            x2="900"
            y2={LANE_Y_FEATURE}
            stroke="#1e293b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x="30"
            y={LANE_Y_FEATURE + 45}
            fill="#64748b"
            fontSize="10"
            fontFamily="monospace"
            className="uppercase tracking-widest font-semibold"
          >
            Lane 1: feature/auth-gateway
          </text>

          {/* Edges / Parent Pointers (Connecting child to parents with backward arrows) */}
          {commits.map((child) => {
            const childCoords = getNodeCoords(child);

            return child.parentIds.map((parentId) => {
              const parent = commits.find((c) => c.id === parentId);
              if (!parent) return null;
              const parentCoords = getNodeCoords(parent);

              const isMergeEdge = child.isMerge;

              // Straight line if in same lane
              if (child.lane === parent.lane) {
                return (
                  <g key={`edge-${child.id}-${parent.id}`}>
                    <line
                      x1={childCoords.x - 22}
                      y1={childCoords.y}
                      x2={parentCoords.x + 22}
                      y2={parentCoords.y}
                      stroke={isMergeEdge ? "#ec4899" : "#64748b"}
                      strokeWidth={isMergeEdge ? "2.5" : "2"}
                      markerEnd={isMergeEdge ? "url(#arrow-merge)" : "url(#arrow-backward)"}
                      strokeDasharray={child.id === "C7" ? undefined : undefined}
                    />
                  </g>
                );
              }

              // Curved Bezier line for cross-lane branching/merging
              const isBranchFork = parent.depth < child.depth && !child.isMerge;
              const isMergeJoin = child.isMerge;

              let pathD = "";
              if (isBranchFork) {
                // Forking from main C1 to feature C3
                pathD = `M ${childCoords.x - 20} ${childCoords.y} C ${childCoords.x - 70} ${childCoords.y}, ${parentCoords.x + 70} ${parentCoords.y}, ${parentCoords.x + 20} ${parentCoords.y}`;
              } else if (isMergeJoin) {
                // Merging feature C4 into M6 on main
                pathD = `M ${childCoords.x - 15} ${childCoords.y + 15} C ${childCoords.x - 50} ${childCoords.y + 70}, ${parentCoords.x + 50} ${parentCoords.y - 40}, ${parentCoords.x + 20} ${parentCoords.y - 10}`;
              } else {
                pathD = `M ${childCoords.x - 20} ${childCoords.y} C ${childCoords.x - 50} ${childCoords.y}, ${parentCoords.x + 50} ${parentCoords.y}, ${parentCoords.x + 20} ${parentCoords.y}`;
              }

              return (
                <g key={`edge-${child.id}-${parent.id}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isMergeJoin ? "#ec4899" : "#8b5cf6"}
                    strokeWidth={isMergeJoin ? "2.5" : "2"}
                    markerEnd={isMergeJoin ? "url(#arrow-merge)" : "url(#arrow-backward)"}
                  />
                  {isMergeJoin && (
                    <text
                      x={(childCoords.x + parentCoords.x) / 2 - 20}
                      y={(childCoords.y + parentCoords.y) / 2}
                      fill="#f472b6"
                      fontSize="9"
                      fontFamily="monospace"
                      className="font-bold"
                    >
                      Parent 2 (Incoming)
                    </text>
                  )}
                </g>
              );
            });
          })}

          {/* Commit Nodes */}
          {commits.map((commit) => {
            const { x, y } = getNodeCoords(commit);
            const isSelected = commit.id === selectedCommitId;

            // Color scheme based on node type
            let fillColor = "#10b981"; // main green
            let strokeColor = "#34d399";
            if (commit.lane === 1) {
              fillColor = "#8b5cf6"; // purple
              strokeColor = "#a78bfa";
            }
            if (commit.isMerge) {
              fillColor = "#ec4899"; // pink
              strokeColor = "#f472b6";
            }
            if (commit.isRoot) {
              fillColor = "#3b82f6"; // blue genesis
              strokeColor = "#60a5fa";
            }

            return (
              <g
                key={commit.id}
                onClick={() => onSelectCommit(commit.id)}
                className="cursor-pointer group transition-all"
              >
                {/* Selection Halo */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="28"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    filter="url(#glow-selected)"
                    className="animate-pulse"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  className="group-hover:scale-110 transition-transform origin-center"
                />

                {/* Inner Icon / ID */}
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {commit.id}
                </text>

                {/* Hash Label below node */}
                <text
                  x={x}
                  y={commit.lane === 0 ? y - 28 : y + 36}
                  textAnchor="middle"
                  fill={isSelected ? "#38bdf8" : "#94a3b8"}
                  fontSize="10"
                  fontWeight="semibold"
                  fontFamily="monospace"
                >
                  {commit.shortHash}
                </text>

                {/* Author Label */}
                <text
                  x={x}
                  y={commit.lane === 0 ? y - 40 : y + 48}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                >
                  {commit.authorName.split(" ")[0]}
                </text>

                {/* Branch Reference Badges */}
                {commit.branchTags.includes("main") && (
                  <g transform={`translate(${x - 30}, ${y + 26})`}>
                    <rect
                      x="0"
                      y="0"
                      width="60"
                      height="18"
                      rx="9"
                      fill="#065f46"
                      stroke="#10b981"
                      strokeWidth="1"
                    />
                    <text
                      x="30"
                      y="12"
                      textAnchor="middle"
                      fill="#d1fae5"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      main
                    </text>
                  </g>
                )}

                {commit.branchTags.includes("feature/auth-gateway") && (
                  <g transform={`translate(${x - 55}, ${y - 38})`}>
                    <rect
                      x="0"
                      y="0"
                      width="110"
                      height="18"
                      rx="9"
                      fill="#581c87"
                      stroke="#8b5cf6"
                      strokeWidth="1"
                    />
                    <text
                      x="55"
                      y="12"
                      textAnchor="middle"
                      fill="#f3e8ff"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      feature/auth-gateway
                    </text>
                  </g>
                )}

                {commit.branchTags.includes("origin/main") && (
                  <g transform={`translate(${x - 40}, ${y + 26})`}>
                    <rect
                      x="0"
                      y="0"
                      width="80"
                      height="18"
                      rx="9"
                      fill="#075985"
                      stroke="#0284c7"
                      strokeWidth="1"
                    />
                    <text
                      x="40"
                      y="12"
                      textAnchor="middle"
                      fill="#e0f2fe"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      origin/main
                    </text>
                  </g>
                )}

                {/* HEAD Pointer Pin */}
                {commit.isHead && (
                  <g transform={`translate(${x - 8}, ${y - 62})`}>
                    <rect
                      x="-25"
                      y="-16"
                      width="66"
                      height="20"
                      rx="4"
                      fill="#78350f"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                    />
                    <text
                      x="8"
                      y="-2"
                      textAnchor="middle"
                      fill="#fef3c7"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      📌 HEAD
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Commit Quick Banner */}
      {selectedNode && (
        <div className="px-5 py-3 border-t border-border/40 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm text-foreground bg-zinc-800 px-2.5 py-1 rounded-md border border-border">
              {selectedNode.id} ({selectedNode.shortHash})
            </span>
            <span className="text-muted-foreground font-sans">
              <strong className="text-zinc-200">{selectedNode.authorName}</strong> &bull;{" "}
              {selectedNode.message}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono">
              Parents:{" "}
              <strong className="text-zinc-200">
                {selectedNode.parentIds.length > 0 ? selectedNode.parentIds.join(", ") : "None (Root Genesis)"}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
