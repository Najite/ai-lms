"use client";

import * as React from "react";
import { StatusChip } from "@/components/ui/status-chip";
import { Quote, CheckCircle2, Star, ArrowUpRight } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Marcus V.",
      role: "Staff Software Engineer",
      company: "Tier-1 Cloud Provider",
      outcome: "Cracked Distributed Systems & Raft Interview",
      quote:
        "The Raft consensus and WAL logging lessons gave me more practical depth than 3 different paid video bootcamps combined. Being able to write the state machine in the browser and then clone the local capstone repo was the exact bridge I needed.",
      badge: "Verified Student",
      highlight: "Raft Consensus // Phase 5",
    },
    {
      name: "Elena R.",
      role: "Senior AI Platform Engineer",
      company: "Enterprise AI Infrastructure",
      outcome: "Built Custom vLLM & Agent Pipeline",
      quote:
        "I was tired of superficial 'call OpenAI API' tutorials. This curriculum actually has you implement self-attention matrices from scratch, calculate KV cache memory footprints, and build cyclic LangGraph architectures. Pure engineering rigor.",
      badge: "Verified Student",
      highlight: "Transformers & vLLM // Phase 10",
    },
    {
      name: "David K.",
      role: "Backend Architect",
      company: "High-Frequency FinTech",
      outcome: "Mastered Linux epoll & Socket Architecture",
      quote:
        "The text-first format with live browser sandboxes is unbeatable. No 20-minute video intro, no rambling. Just the mechanical reality of kernel event loops, memory alignment, and cache-conscious data structures.",
      badge: "Verified Student",
      highlight: "Kernel epoll // Phase 4",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#23252a] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusChip status="passed" label="ENGINEERING OUTCOMES" />
            <span className="text-xs font-mono text-[#8a8f98]">
              Real Technical Feedback
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f7f8f8]">
            Built For Engineers Who Demand Mechanical Depth
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] mt-1 max-w-2xl leading-relaxed">
            From Staff SWE system design interviews to building production AI agents and distributed backends.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#4cb782]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Zero Paid Endorsements • 100% Technical</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="rounded-[8px] bg-[#0f1012] border border-[#23252a] p-5 flex flex-col justify-between hover:border-[#3b3e48] transition-all duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#16171a] border border-[#23252a] text-[#5e6ad2]">
                  {item.highlight}
                </span>
                <span className="text-[#4cb782] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4cb782]" />
                  {item.badge}
                </span>
              </div>

              <p className="text-xs text-[#d0d6e0] leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-[#1b1c20] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f7f8f8]">{item.name}</span>
                <span className="text-[10px] font-mono text-[#8a8f98]">{item.company}</span>
              </div>
              <div className="text-[11px] font-mono text-[#8a8f98]">{item.role}</div>
              <div className="text-[10px] font-mono text-[#4cb782] truncate pt-0.5">
                Outcome: {item.outcome}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
