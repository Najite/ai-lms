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
    name: "Python, AI Software Architecture & Workflows",
    category: "AI Foundations",
    phasePrefixes: ["node-0-", "node-1-", "node-2-"],
    totalLessons: 150,
    capstone: "PromptCLI, SchemaAgent & WorkflowGraph",
    description: "Core Python internals, AST parsing, Pydantic v2 data contracts, schema enforcement, and cyclic agent state machines (Modules 1, 2 & 3).",
    icon: Terminal,
  },
  {
    id: "tensors-memory",
    name: "Tensors, Vector Embeddings & Memory Optimization",
    category: "Math & AI Systems",
    phasePrefixes: ["node-9-", "node-3-"],
    totalLessons: 100,
    capstone: "TensorCore Micro-Autograd & SemanticCache Engine",
    description: "Computational graphs, reverse-mode autodiff, dense vector spaces, in-memory KV-cache buffers, and high-speed LRU eviction (Modules 4 & 5).",
    icon: Cpu,
  },
  {
    id: "streaming-database",
    name: "Streaming Web Protocols & PostgreSQL Vector Engineering",
    category: "Backend & Data",
    phasePrefixes: ["node-4-", "node-5-"],
    totalLessons: 100,
    capstone: "StreamGateway Proxy & DocuMind pgvector Engine",
    description: "Server-Sent Events chunk multiplexing, WebSockets, backpressure, PostgreSQL pgvector HNSW indexing, and RLS security (Modules 6 & 7).",
    icon: Network,
  },
  {
    id: "frontend-scale",
    name: "AI Frontend Architecture & High-Scale Gateway Routing",
    category: "Frontend & Scale",
    phasePrefixes: ["node-6-", "node-8-"],
    totalLessons: 100,
    capstone: "AICanvas Workspace & ModelRouter Multi-Provider Gateway",
    description: "Next.js streaming canvases, Web Worker token decoding, 60 FPS HTML5 Canvas, multi-provider model routing, and Redis rate limiters (Modules 8 & 9).",
    icon: Layers,
  },
  {
    id: "distributed-consensus",
    name: "Distributed Systems & AI Cluster Consensus",
    category: "Distributed Clusters",
    phasePrefixes: ["node-7-"],
    totalLessons: 50,
    capstone: "QuorumCore Distributed Raft & Agent State Cluster",
    description: "Raft consensus, distributed lease locking for agent swarms, CRDT delta replication, and split-brain partition tolerance (Module 10).",
    icon: Network,
  },
  {
    id: "rag-observability-agents",
    name: "Production RAG, AI Observability, Agents & Cloud Platform",
    category: "Enterprise AI Platforms",
    phasePrefixes: ["node-10-", "node-11-", "node-12-", "node-13-", "node-14-"],
    totalLessons: 200,
    capstone: "DocuSearch, TracePulse, CodeCraft & CloudMatrix Platform",
    description: "Hybrid RAG (pgvector + BM25), OpenTelemetry tracing, LLM-as-a-judge evals, LangGraph autonomous coding agents, and Terraform Kubernetes cloud infrastructure (Modules 11, 12, 13 & 14).",
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
            Curated end-to-end technical tracks aligned with all 14 curriculum modules. Follow a structured progression from foundations to verifiable production capstones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusChip status="brand" label="6 PATHS ACTIVE // 700 LESSONS" />
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
                      completedCount > 5 ? "text-[#10b981]" : "text-[#565961]"
                    )}
                  >
                    {completedCount > 5 ? "IN PROGRESS" : "NOT STARTED"}
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
