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
    id: "foundations",
    name: "Programming Foundations & Software Craftsmanship",
    phases: "Modules 1, 2",
    lessonCount: 100,
    capstones: ["PromptCLI", "TaskPulse Event Loop"],
    description: "Python 3.12 syntax, PyObject memory model, closures, decorators, dunder protocols, Pydantic v2 data validation, and pytest suites.",
    level: "Foundational",
    icon: Terminal,
    topics: ["Python Syntax & Logic", "Clean Code & Modularity", "Pydantic Data Contracts", "Pytest Test Suites"],
  },
  {
    id: "algorithms",
    name: "Discrete Mathematics, Linear Algebra & Core Algorithms",
    phases: "Modules 3, 4, 5",
    lessonCount: 115,
    capstones: ["MathGrad Autodiff", "AlgoSift Engine"],
    description: "Discrete mathematics, linear algebra, reverse-mode autodiff, two pointers, balanced search trees, graph algorithms, and DP.",
    level: "Intermediate",
    icon: Cpu,
    topics: ["Discrete Math Proofs", "Linear Algebra & Autograd", "Two Pointers & Heaps", "Dynamic Programming"],
  },
  {
    id: "web-systems",
    name: "Web Protocols, Database Systems & High-Level Architecture",
    phases: "Modules 6, 7, 9, 10",
    lessonCount: 140,
    capstones: ["PayFlow Payment Gateway", "RaftLite Cluster"],
    description: "FastAPI microservices, ASGI, asyncio event loops, PostgreSQL MVCC, System Design scalability, and Raft consensus.",
    level: "Advanced",
    icon: Network,
    topics: ["FastAPI Microservices", "PostgreSQL & MVCC", "System Design Scalability", "Raft Consensus Cluster"],
  },
  {
    id: "frontend-platforms",
    name: "Modern Frontend Engineering & Interactive Platforms",
    phases: "Module 8",
    lessonCount: 40,
    capstones: ["BoardSync Canvas", "Next.js Streaming Shell"],
    description: "Modern React architecture, Next.js App Router, React Server Components (RSC), Zustand state management, and HTML5 60 FPS Canvas.",
    level: "Advanced",
    icon: Layers,
    topics: ["React Server Components", "Zustand State Store", "HTML5 Canvas 2D", "Real-Time WebSockets UI"],
  },
  {
    id: "ai-agents-defense",
    name: "Production RAG, Observability & Autonomous AI Agents",
    phases: "Modules 11, 12, 13, 14",
    lessonCount: 125,
    capstones: ["DocuMind Hybrid RAG", "CodeCraft Multi-Agent Platform"],
    description: "PostgreSQL pgvector (HNSW), hybrid search, Ragas evals, OpenTelemetry tracing, MCP tools, LangGraph, and capstone defense.",
    level: "Principal",
    icon: Sparkles,
    topics: ["pgvector & HNSW Indexes", "Hybrid Sparse+Dense Search", "LangGraph State Machines", "MCP Tool Calling"],
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
