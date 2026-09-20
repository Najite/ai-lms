"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import { Terminal, Cpu, Network, Sparkles, Server, ArrowRight, BookOpen, Layers } from "lucide-react";

export interface Track {
  id: string;
  name: string;
  phases: string;
  lessonCount: number;
  capstones: string[];
  description: string;
  level: "Foundational" | "Intermediate" | "Advanced" | "Principal";
  icon: React.ComponentType<{ className?: string }>;
  topics: string[];
}

export const TRACKS: Track[] = [
  {
    id: "systems",
    name: "Low-Level & Systems Programming",
    phases: "Phases 0, 1, 4",
    lessonCount: 115,
    capstones: ["SysTrace", "LoxLang", "NanoHTTP"],
    description: "Linux system calls, kernel event loops (epoll), memory management, interpreters, and raw socket servers.",
    level: "Foundational",
    icon: Terminal,
    topics: ["x86/ARM Registers", "Pointers & Heap", "CPython Internals", "POSIX Sockets"],
  },
  {
    id: "algorithms",
    name: "Applied Mathematics & Algorithms",
    phases: "Phases 2, 3, 8",
    lessonCount: 105,
    capstones: ["MathKit", "DataSift", "System Design Portfolios"],
    description: "Matrix decomposition, auto-differentiation, cache-conscious data structures, and large-scale system designs.",
    level: "Intermediate",
    icon: Cpu,
    topics: ["Linear Algebra", "SkipLists & LSM-Trees", "Top-K Streaming", "Capacity Estimation"],
  },
  {
    id: "distributed",
    name: "Backend & Distributed Infrastructure",
    phases: "Phases 5, 7",
    lessonCount: 80,
    capstones: ["AuthForge", "InfraBlueprint"],
    description: "Raft consensus, WAL logging, distributed locking, PostgreSQL MVCC internals, gRPC, and cloud-native Kubernetes.",
    level: "Advanced",
    icon: Network,
    topics: ["Raft Consensus", "PostgreSQL Internals", "gRPC / Protobuf", "Chaos Engineering"],
  },
  {
    id: "ai-systems",
    name: "AI, Deep Learning & Autonomous Agents",
    phases: "Phases 9, 10, 11, 12",
    lessonCount: 125,
    capstones: ["TransformerLab", "DocuMind", "ModelPulse", "CodeAgent"],
    description: "Autograd from scratch, self-attention, HNSW vector search, vLLM optimizations, and cyclic agent graphs.",
    level: "Principal",
    icon: Sparkles,
    topics: ["Transformers from Scratch", "HNSW & RAG Triad", "vLLM & PagedAttention", "LangGraph Agents"],
  },
  {
    id: "fullstack",
    name: "Full-Stack & Grand Architecture",
    phases: "Phases 6, 13, 14",
    lessonCount: 75,
    capstones: ["TenantIQ", "Track Capstone", "Enterprise Platform"],
    description: "Next.js 14 App Router, multi-tenant RLS, WCAG AAA accessibility, and the capstone enterprise platform synthesis.",
    level: "Principal",
    icon: Server,
    topics: ["Server Actions", "Multi-Tenant Isolation", "Security Hardening", "Production SLA"],
  },
];

export function LearningPaths({
  onSelectTrack,
}: {
  onSelectTrack?: (trackId: string) => void;
}) {
  return (
    <section id="learning-paths" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#23252a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5e6ad2]" />
            <h2 className="text-xl font-semibold tracking-tight text-[#f7f8f8]">
              Structured Skill Paths
            </h2>
          </div>
          <p className="text-xs text-[#8a8f98] mt-1">
            Educative-style curated curricula. Follow an end-to-end career track or progress sequentially.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status="passed" label="ALL 5 TRACKS INCLUDED" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TRACKS.map((track) => {
          const Icon = track.icon;
          return (
            <Card
              key={track.id}
              className="flex flex-col justify-between hover:border-[#3b3e48] transition-all duration-150 group"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-[4px] bg-[#0f1012] border border-[#23252a] flex items-center justify-center text-[#5e6ad2] group-hover:border-[#5e6ad2]/50 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#16171a] border border-[#23252a] text-[#8a8f98]">
                    {track.level}
                  </span>
                </div>

                <div>
                  <CardTitle className="text-base group-hover:text-white transition-colors">
                    {track.name}
                  </CardTitle>
                  <span className="text-[11px] font-mono text-[#5e6ad2] block mt-1">
                    {track.phases} • {track.lessonCount} Lessons
                  </span>
                </div>

                <CardDescription className="text-xs leading-relaxed text-[#8a8f98]">
                  {track.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Topic tags */}
                <div className="flex flex-wrap gap-1.5">
                  {track.topics.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#010102] border border-[#1b1c20] text-[#8a8f98]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Capstone milestone */}
                <div className="p-2.5 rounded-[4px] bg-[#010102] border border-[#1b1c20] text-xs font-mono space-y-1">
                  <span className="text-[10px] text-[#565961] block uppercase">Capstones:</span>
                  <span className="text-[#f7f8f8] text-[11px] block truncate">
                    {track.capstones.join(" • ")}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="justify-between text-xs font-mono border-t border-[#1b1c20] pt-3">
                <span className="text-[#565961]">Self-Paced</span>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    document.getElementById("curriculum-section")?.scrollIntoView({ behavior: "smooth" });
                    if (onSelectTrack) onSelectTrack(track.id);
                  }}
                  className="gap-1 text-[#5e6ad2] hover:text-[#6f7be8]"
                >
                  <span>Explore Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
