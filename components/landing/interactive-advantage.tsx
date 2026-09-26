import * as React from "react";
import { StatusChip } from "@/components/ui/status-chip";
import { Play, Zap, Clock, Terminal, XCircle, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export function InteractiveAdvantage() {
  const metrics = [
    {
      value: "2.5x",
      label: "Reading vs. Video Speed",
      sub: "Read at 280 wpm vs. listening at 120 wpm",
    },
    {
      value: "0s",
      label: "Environment Setup",
      sub: "Instant WASM execution in browser",
    },
    {
      value: "100%",
      label: "Active Recall Density",
      sub: "Runnable code checks every micro-lesson",
    },
    {
      value: "700",
      label: "Verified Lessons",
      sub: "From x86 registers to Raft & vLLM",
    },
  ];

  return (
    <section className="space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#23252a] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusChip status="brand" label="PEDAGOGICAL RIGOR" />
            <span className="text-xs font-mono text-[#8a8f98]">
              Educative-Style Text-First Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f7f8f8]">
            Why Developers Learn 2.5x Faster With Text &amp; Sandboxes
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] mt-2 max-w-2xl leading-relaxed">
            Video courses create a passive illusion of competence. In-browser executable text builds deep muscle memory and architectural fluency.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#5e6ad2]">
          <Zap className="w-4 h-4" />
          <span>Active Practice &gt; Passive Watching</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-[8px] bg-[#08090a] border border-[#23252a] p-5 space-y-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-[#3b3e48] transition-colors"
          >
            <div className="font-mono text-3xl font-bold text-[#f7f8f8] tracking-tight">
              {m.value}
            </div>
            <div className="text-xs font-medium text-[#d0d6e0]">{m.label}</div>
            <div className="text-[11px] font-mono text-[#8a8f98] leading-tight pt-1">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison: Video vs Text-First */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: The Video Trap */}
        <div className="rounded-[8px] bg-[#0f1012] border border-[#23252a] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#1b1c20] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-[#eb5757]/10 border border-[#eb5757]/20 flex items-center justify-center text-[#eb5757]">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f7f8f8]">The 40-Hour Video Slog</h3>
                <span className="text-[11px] font-mono text-[#8a8f98]">Traditional Video Platforms</span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#eb5757]/10 border border-[#eb5757]/30 text-[#eb5757]">
              Passive
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-[#8a8f98]">
            <div className="flex items-start gap-3">
              <span className="text-[#eb5757] font-mono shrink-0 mt-0.5">✖</span>
              <div>
                <strong className="text-[#d0d6e0]">Pacing constrained by speech</strong>:
                Speakers talk at ~120 words per minute. You waste hours scrubbing video sliders just to find the one line of configuration code you need.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#eb5757] font-mono shrink-0 mt-0.5">✖</span>
              <div>
                <strong className="text-[#d0d6e0]">Fragile local environment setups</strong>:
                Hours spent wrestling with Python virtualenvs, Docker daemons, or mismatched CUDA drivers before even typing your first print statement.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#eb5757] font-mono shrink-0 mt-0.5">✖</span>
              <div>
                <strong className="text-[#d0d6e0]">Illusion of competence</strong>:
                Nodding along to an instructor writing code feels like learning, but leaves you stranded the second you face an empty editor on your own.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#eb5757] font-mono shrink-0 mt-0.5">✖</span>
              <div>
                <strong className="text-[#d0d6e0]">Zero automated feedback</strong>:
                No real-time AST validation, no compiler assertions, and no instant test suite grading your intermediate logic.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Educative / AI-Native Text & Sandbox */}
        <div className="rounded-[8px] bg-[#0f1012] border border-[#3b3e48] p-6 space-y-5 shadow-sm relative group">
          <div className="absolute inset-x-0 top-0 h-px bg-[#5e6ad2]/50 rounded-t-[8px]" />

          <div className="flex items-center justify-between border-b border-[#1b1c20] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] bg-[#4cb782]/10 border border-[#4cb782]/20 flex items-center justify-center text-[#4cb782]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f7f8f8]">Interactive Text + WASM Sandboxes</h3>
                <span className="text-[11px] font-mono text-[#5e6ad2]">Our Educative-Inspired Pedagogy</span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#4cb782]/10 border border-[#4cb782]/30 text-[#4cb782]">
              Active Recall
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-[#8a8f98]">
            <div className="flex items-start gap-3">
              <span className="text-[#4cb782] font-mono shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-[#f7f8f8]">Read at natural comprehension speed</strong>:
                Average engineers read and scan at 280–350 wpm. Skim what you know, deep-dive into complex architectural proofs.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#4cb782] font-mono shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-[#f7f8f8]">Zero-friction in-browser sandboxes</strong>:
                Run Python 3.11, SQLite, and algorithms instantly in client-side WebAssembly without leaving your tab or waiting for cold containers.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#4cb782] font-mono shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-[#f7f8f8]">Code challenges every 3 paragraphs</strong>:
                Micro-exercises solidify every concept immediately before moving on. Real tests, real assertions, real muscle memory.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#4cb782] font-mono shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-[#f7f8f8]">Grounded Socratic AI Tutor</strong>:
                Stuck on a test failure? The built-in AI Tutor analyzes your AST and curriculum context, offering targeted hints without spoon-feeding code.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
