"use client";

import * as React from "react";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Cpu,
  Network,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackProgress {
  id: string;
  name: string;
  category: string;
  completedLessons: number;
  totalLessons: number;
  phases: string;
  capstone: string;
  capstoneStatus: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED";
  icon: React.ComponentType<{ className?: string }>;
}

const DASHBOARD_TRACKS: TrackProgress[] = [
  {
    id: "systems",
    name: "Low-Level & Systems Programming",
    category: "Systems",
    completedLessons: 12,
    totalLessons: 180,
    phases: "Phases 01, 05, 06, 07, 08, 11",
    capstone: "Custom Malloc / Free Allocator",
    capstoneStatus: "VERIFIED",
    icon: Terminal,
  },
  {
    id: "algorithms",
    name: "Applied Mathematics & Algorithms",
    category: "Algorithms",
    completedLessons: 6,
    totalLessons: 105,
    phases: "Phases 02, 03, 04",
    capstone: "B-Tree Indexed Key-Value Storage",
    capstoneStatus: "IN_PROGRESS",
    icon: Cpu,
  },
  {
    id: "distributed",
    name: "Distributed Systems & Infrastructure",
    category: "Distributed",
    completedLessons: 0,
    totalLessons: 95,
    phases: "Phases 09, 10, 15",
    capstone: "Raft Consensus Cluster",
    capstoneStatus: "NOT_STARTED",
    icon: Network,
  },
  {
    id: "ai-systems",
    name: "AI & Machine Learning Engineering",
    category: "AI/ML",
    completedLessons: 0,
    totalLessons: 60,
    phases: "Phases 13, 14",
    capstone: "HNSW Vector DB & Micrograd Engine",
    capstoneStatus: "NOT_STARTED",
    icon: Sparkles,
  },
  {
    id: "edge-stack",
    name: "Edge Architecture & Full-Stack",
    category: "Full-Stack",
    completedLessons: 0,
    totalLessons: 60,
    phases: "Phases 12, 15",
    capstone: "Real-Time CRDT Document Sync",
    capstoneStatus: "NOT_STARTED",
    icon: Layers,
  },
];

interface ProgressMatrixProps {
  onSelectTrack: (trackId: string) => void;
}

export function ProgressMatrix({ onSelectTrack }: ProgressMatrixProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23252a] gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#f7f8f8] flex items-center gap-2">
            <span>Specialized Skill Paths</span>
            <span className="text-xs font-mono text-[#8a8f98]">5 Tracks Available</span>
          </h3>
          <p className="text-xs text-[#8a8f98]">
            Educative-grade structured roadmaps covering foundational systems, algorithms, distributed scale, and modern AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DASHBOARD_TRACKS.map((track) => {
          const Icon = track.icon;
          const pct = Math.round((track.completedLessons / track.totalLessons) * 100);

          return (
            <div
              key={track.id}
              className="rounded-lg bg-[#08090a] border border-[#23252a] p-5 hover:border-[#34343a] transition-all flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md bg-[#0f1011] border border-[#23252a] flex items-center justify-center text-[#5e6ad2] group-hover:border-[#5e6ad2]/40 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141516] border border-[#23252a] text-[#8a8f98]">
                    {track.phases}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#f7f8f8] group-hover:text-white transition-colors">
                    {track.name}
                  </h4>
                  <span className="text-[11px] font-mono text-[#8a8f98]">
                    {track.completedLessons} / {track.totalLessons} Lessons ({pct}%)
                  </span>
                </div>

                {/* Track progress bar */}
                <div className="w-full bg-[#141516] h-1.5 rounded-full overflow-hidden border border-[#23252a]">
                  <div
                    className="bg-[#5e6ad2] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>

                {/* Capstone milestone */}
                <div className="pt-2 text-xs font-mono text-[#8a8f98] flex items-center justify-between border-t border-[#18191a]">
                  <span className="text-[10px] flex items-center gap-1 line-clamp-1">
                    <FolderGit2 className="w-3 h-3 text-[#5e6ad2]" />
                    {track.capstone}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      track.capstoneStatus === "VERIFIED"
                        ? "text-[#10b981]"
                        : track.capstoneStatus === "IN_PROGRESS"
                        ? "text-[#e5993e]"
                        : "text-[#565961]"
                    )}
                  >
                    {track.capstoneStatus === "VERIFIED"
                      ? "✓ PASSED"
                      : track.capstoneStatus === "IN_PROGRESS"
                      ? "IN PROGRESS"
                      : "LOCKED"}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onSelectTrack(track.id)}
                  className="w-full justify-between text-[11px] font-mono group-hover:border-[#34343a]"
                >
                  <span>Explore Track Syllabus</span>
                  <ArrowRight className="w-3 h-3 text-[#8a8f98] group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
