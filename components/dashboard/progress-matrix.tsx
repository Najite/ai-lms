"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Terminal,
  Cpu,
  Network,
  Sparkles,
  Layers,
  ArrowRight,
  FolderGit2,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurriculumProgress } from "@/lib/progress-tracker";

interface TrackDefinition {
  id: string;
  name: string;
  category: string;
  phasePrefixes: string[];
  totalLessons: number;
  capstone: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRACK_DEFS: TrackDefinition[] = [
  {
    id: "foundations",
    name: "Programming Foundations & Software Craftsmanship",
    category: "Foundations",
    phasePrefixes: ["node-0-", "node-1-"],
    totalLessons: 100,
    capstone: "PromptCLI & TaskPulse Async Engine",
    description: "Python 3.12 syntax, PyObject memory model, closures, decorators, dunder protocols, Pydantic v2 validation, and pytest suites (Modules 1 & 2).",
    icon: Terminal,
  },
  {
    id: "math-algorithms",
    name: "Discrete Mathematics, Linear Algebra & Core Algorithms",
    category: "Math & Algorithms",
    phasePrefixes: ["node-2-", "node-9-", "node-3-"],
    totalLessons: 115,
    capstone: "MathGrad Autodiff & AlgoSift Engine",
    description: "Discrete logic, linear algebra, reverse-mode autodiff, two pointers, balanced search trees, graph algorithms, and DP (Modules 3, 4 & 5).",
    icon: Cpu,
  },
  {
    id: "web-systems",
    name: "Web Protocols, Database Systems & High-Level Architecture",
    category: "Backend & Systems",
    phasePrefixes: ["node-4-", "node-5-", "node-8-", "node-7-"],
    totalLessons: 140,
    capstone: "PayFlow Payment Gateway & RaftLite Cluster",
    description: "HTTP/2, HTTP/3, FastAPI ASGI services, PostgreSQL internals (MVCC, WAL), System Design scalability, and Raft consensus (Modules 6, 7, 9 & 10).",
    icon: Network,
  },
  {
    id: "frontend-platforms",
    name: "Modern Frontend Engineering & Interactive Platforms",
    category: "Frontend & Canvas",
    phasePrefixes: ["node-6-"],
    totalLessons: 40,
    capstone: "BoardSync Collaborative Canvas Workspace",
    description: "DOM tree, modern CSS, Next.js App Router, React Server Components (RSC), Zustand state management, and Stripe Elements (Module 8).",
    icon: Layers,
  },
  {
    id: "ai-agents-defense",
    name: "Production RAG, Observability & Autonomous AI Agents",
    category: "AI & Distributed Systems",
    phasePrefixes: ["node-10-", "node-11-", "node-12-", "node-13-", "node-14-"],
    totalLessons: 125,
    capstone: "DocuMind Hybrid RAG & CodeCraft Agent Defense",
    description: "PostgreSQL pgvector (HNSW), hybrid search, Ragas evals, OpenTelemetry tracing, MCP tools, LangGraph cyclic state, and capstone defense (Modules 11, 12, 13 & 14).",
    icon: Sparkles,
  },
];

interface ProgressMatrixProps {
  onSelectTrack?: (trackId: string) => void;
  onResumeLesson?: (lessonId: string) => void;
}

export function ProgressMatrix({ onSelectTrack, onResumeLesson }: ProgressMatrixProps) {
  const { completedLessons } = useCurriculumProgress();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23252a] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#5e6ad2]" />
            <h3 className="text-base font-semibold text-[#f7f8f8]">
              AI-Native Career Progression Tracks
            </h3>
          </div>
          <p className="text-xs text-[#8a8f98]">
            Curated end-to-end technical tracks. Follow a structured progression from foundational theory to verifiable production capstones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusChip status="brand" label="5 PATHS ACTIVE" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRACK_DEFS.map((track) => {
          const Icon = track.icon;

          // Count completed lessons that match this track's node prefixes
          const completedCount = completedLessons.filter((id) =>
            track.phasePrefixes.some((prefix) => id.startsWith(prefix))
          ).length;

          const pct = Math.round((completedCount / track.totalLessons) * 100);

          return (
            <div
              key={track.id}
              className="rounded-xl bg-[#0f1011] border border-[#23252a] p-5 hover:border-[#3b3e48] transition-all flex flex-col justify-between group shadow-lg space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md bg-[#08090a] border border-[#23252a] flex items-center justify-center text-[#5e6ad2] group-hover:border-[#5e6ad2]/40 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16171a] border border-[#23252a] text-[#8a8f98]">
                    {track.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#f7f8f8] group-hover:text-white transition-colors">
                    {track.name}
                  </h4>
                  <span className="text-[11px] font-mono text-[#8a8f98] block pt-0.5">
                    {completedCount} / {track.totalLessons} Lessons ({pct}%)
                  </span>
                </div>

                <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
                  {track.description}
                </p>

                {/* Track progress bar */}
                <div className="w-full bg-[#18191a] h-1.5 rounded-full overflow-hidden border border-[#23252a]">
                  <div
                    className="bg-[#5e6ad2] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>

                {/* Capstone milestone */}
                <div className="pt-2 text-xs font-mono text-[#8a8f98] flex items-center justify-between border-t border-[#18191a]">
                  <span className="text-[10px] flex items-center gap-1 line-clamp-1 truncate text-[#d0d6e0]">
                    <FolderGit2 className="w-3 h-3 text-[#5e6ad2] shrink-0" />
                    {track.capstone}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold shrink-0",
                      completedCount > 10 ? "text-[#10b981]" : "text-[#565961]"
                    )}
                  >
                    {completedCount > 10 ? "IN PROGRESS" : "NOT STARTED"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    if (onSelectTrack) onSelectTrack(track.id);
                  }}
                  className="w-full justify-between text-[11px] font-mono group-hover:border-[#3b3e48]"
                >
                  <span>Explore Path Syllabus</span>
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
