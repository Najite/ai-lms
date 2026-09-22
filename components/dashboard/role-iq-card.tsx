"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  UserCheck,
  ShieldCheck,
  Target,
  ArrowRight,
  Sparkles,
  Network,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RoleProfile {
  id: string;
  title: string;
  level: "Senior" | "Staff" | "Principal";
  readinessPercentage: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: {
    name: string;
    requiredScore: number;
    currentScore: number;
    status: "QUALIFIED" | "GAP";
    lessonId: string;
    lessonTitle: string;
  }[];
}

const ROLES: RoleProfile[] = [
  {
    id: "distributed-architect",
    title: "Staff Distributed Systems Architect",
    level: "Staff",
    readinessPercentage: 82,
    description:
      "Responsible for fault-tolerant consensus (Raft), zero-loss WAL storage engines, partitioned replication, and geo-distributed latency SLAs.",
    icon: Network,
    skills: [
      {
        name: "Raft Consensus & Leader Election",
        requiredScore: 200,
        currentScore: 215,
        status: "QUALIFIED",
        lessonId: "node-5-1",
        lessonTitle: "Raft Cluster Invariant & Log Replication",
      },
      {
        name: "WAL Recovery, ARIES & MVCC",
        requiredScore: 190,
        currentScore: 184,
        status: "GAP",
        lessonId: "node-5-2",
        lessonTitle: "WAL Recovery, ARIES Invariants & Slotted Pages",
      },
      {
        name: "Kernel epoll & High-Throughput Sockets",
        requiredScore: 180,
        currentScore: 195,
        status: "QUALIFIED",
        lessonId: "node-4-1",
        lessonTitle: "Linux epoll Edge-Triggered Socket Architecture",
      },
      {
        name: "Distributed Locking & Distributed Tracing",
        requiredScore: 180,
        currentScore: 152,
        status: "GAP",
        lessonId: "node-7-3",
        lessonTitle: "Distributed Tracing, Span Context & OpenTelemetry",
      },
    ],
  },
  {
    id: "ai-systems-engineer",
    title: "AI Platform & Systems Engineer",
    level: "Senior",
    readinessPercentage: 74,
    description:
      "Builds high-throughput transformer inference engines, FlashAttention CUDA optimizations, HNSW vector search, and production agent orchestration.",
    icon: Sparkles,
    skills: [
      {
        name: "Autograd & Computational Graphs from Scratch",
        requiredScore: 180,
        currentScore: 192,
        status: "QUALIFIED",
        lessonId: "node-9-8",
        lessonTitle: "Computational Graph DAG & Reverse-Mode AD",
      },
      {
        name: "Scaled Dot-Product & FlashAttention",
        requiredScore: 190,
        currentScore: 175,
        status: "GAP",
        lessonId: "node-10-1",
        lessonTitle: "Scaled Dot-Product Self-Attention Invariants",
      },
      {
        name: "vLLM, PagedAttention & KV Cache Footprint",
        requiredScore: 180,
        currentScore: 135,
        status: "GAP",
        lessonId: "node-11-2",
        lessonTitle: "PagedAttention Dynamic Memory Block Allocation",
      },
      {
        name: "Cyclic LangGraph & Autonomous Tool Calling",
        requiredScore: 170,
        currentScore: 180,
        status: "QUALIFIED",
        lessonId: "node-12-3",
        lessonTitle: "Model Context Protocol Tool Calling Runtime",
      },
    ],
  },
  {
    id: "systems-compiler",
    title: "Autonomous Agents & Platform Engineer",
    level: "Staff",
    readinessPercentage: 88,
    description:
      "Deep specialization in LangGraph cyclic state machines, Model Context Protocol (MCP) tool runtimes, ephemeral sandboxing, and production RAG evaluation.",
    icon: Terminal,
    skills: [
      {
        name: "Pydantic Schemas & Structured LLM Output",
        requiredScore: 190,
        currentScore: 218,
        status: "QUALIFIED",
        lessonId: "node-1-4",
        lessonTitle: "Pydantic v2 Guaranteed JSON Schemas & Strict Validation",
      },
      {
        name: "Model Context Protocol Tool Calling Runtime",
        requiredScore: 190,
        currentScore: 195,
        status: "QUALIFIED",
        lessonId: "node-1-8",
        lessonTitle: "Model Context Protocol (MCP) Standard Server Architecture",
      },
      {
        name: "PostgreSQL pgvector HNSW & Hybrid Search",
        requiredScore: 180,
        currentScore: 165,
        status: "GAP",
        lessonId: "node-3-4",
        lessonTitle: "pgvector HNSW Graph Indexing & Reciprocal Rank Fusion",
      },
    ],
  },
];

export function RoleIQCard({
  onResumeLesson,
}: {
  onResumeLesson: (lessonId: string) => void;
}) {
  const [selectedRoleId, setSelectedRoleId] = React.useState("distributed-architect");
  const currentRole = ROLES.find((r) => r.id === selectedRoleId) || ROLES[0];

  return (
    <div className="space-y-6">
      {/* Role IQ Header */}
      <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-semibold">
                PLURALSIGHT ROLE IQ ENGINE
              </span>
              <span className="text-xs font-mono text-[#8a8f98]">Career Readiness Composite</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f7f8f8] tracking-tight">
              Target Role Benchmarking
            </h3>
            <p className="text-xs text-[#8a8f98] max-w-2xl leading-relaxed">
              Role IQ aggregates your Skill IQ scores against the exact skill standards required for tier-1 engineering positions. Identify your blind spots before interview day.
            </p>
          </div>

          {/* Role selector dropdown pills */}
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={cn(
                  "px-3 py-1.5 rounded-[6px] text-xs font-mono border transition-all",
                  selectedRoleId === role.id
                    ? "bg-[#5e6ad2] text-white border-[#5e6ad2] shadow-md shadow-[#5e6ad2]/20"
                    : "bg-[#0f1011] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a]"
                )}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Role Dashboard Display */}
      <div className="rounded-xl bg-[#0f1011] border border-[#23252a] p-6 space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b1c20] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 flex items-center justify-center text-[#5e6ad2]">
                <currentRole.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#f7f8f8]">{currentRole.title}</h4>
                <span className="text-xs font-mono text-[#8a8f98]">Level: {currentRole.level} Engineer</span>
              </div>
            </div>
            <p className="text-xs text-[#8a8f98] pt-1 max-w-2xl leading-relaxed">
              {currentRole.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#08090a] border border-[#23252a] p-3 rounded-lg text-right shrink-0">
            <div>
              <span className="text-[10px] font-mono text-[#8a8f98] block">ROLE READINESS</span>
              <span className="font-mono text-2xl font-bold text-[#10b981]">
                {currentRole.readinessPercentage}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-[#10b981] flex items-center justify-center font-mono text-xs font-bold text-[#10b981]">
              Ready
            </div>
          </div>
        </div>

        {/* Skills Required Matrix */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono uppercase text-[#8a8f98] tracking-wider">
            Required Skills &amp; Gap Analysis:
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentRole.skills.map((skill, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-lg border transition-colors space-y-2.5",
                  skill.status === "QUALIFIED"
                    ? "bg-[#08090a] border-[#23252a]"
                    : "bg-[#08090a] border-[#e5993e]/30 hover:border-[#e5993e]/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#f7f8f8]">{skill.name}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border font-semibold flex items-center gap-1",
                      skill.status === "QUALIFIED"
                        ? "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30"
                        : "text-[#e5993e] bg-[#e5993e]/10 border-[#e5993e]/30"
                    )}
                  >
                    {skill.status === "QUALIFIED" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        QUALIFIED
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        SKILL GAP
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
                  <span>Required: {skill.requiredScore}</span>
                  <span>Your Score: {skill.currentScore}</span>
                </div>

                {/* Progress bar comparison */}
                <div className="w-full bg-[#18191a] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      skill.status === "QUALIFIED" ? "bg-[#10b981]" : "bg-[#e5993e]"
                    )}
                    style={{
                      width: `${Math.min(100, Math.round((skill.currentScore / skill.requiredScore) * 100))}%`,
                    }}
                  />
                </div>

                {skill.status === "GAP" && (
                  <div className="pt-2 border-t border-[#18191a] flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-[#e5993e] truncate max-w-[200px]">
                      Recommended: {skill.lessonTitle}
                    </span>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onResumeLesson(skill.lessonId)}
                      className="text-[#5e6ad2] hover:text-[#6f7cf0] gap-1 text-[11px] p-0 h-auto"
                    >
                      <span>Take Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
