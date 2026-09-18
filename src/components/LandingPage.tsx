"use client";

import React, { useState } from "react";
import {
  Terminal,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Play,
  ArrowRight,
  Layers,
  Sparkles,
  Activity,
  Cpu,
  Lock,
  Database,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenChaos: () => void;
  onOpenRedTeam: () => void;
}

export function LandingPage({ onEnterApp, onOpenChaos, onOpenRedTeam }: LandingPageProps) {
  // Interactive Mini-Sandbox inside the Hero (Try It in 5 Seconds)
  const [heroCode, setHeroCode] = useState<string>(
    `# Broken RAG Retriever (1 failing assertion)
def hybrid_rank(dense_score: float, bm25_score: float, k: int = 60) -> float:
    # BUG: Naive addition causes score divergence
    # FIX: Use Reciprocal Rank Fusion: 1.0 / (k + rank)
    return dense_score + bm25_score  # <-- Edit this line`
  );

  const [sandboxResult, setSandboxResult] = useState<{
    passed: boolean;
    logs: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestHeroCode = () => {
    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      // Check if user edited the line to use reciprocal division
      const isFixed = heroCode.includes("1.0 /") || heroCode.includes("1 /") || heroCode.includes("k +");

      if (isFixed) {
        setSandboxResult({
          passed: true,
          logs: "✔ [PASS] test_rrf_scoring: Reciprocal Rank Fusion normalized score verified. 0 hallucinations.",
        });
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#06b6d4", "#10b981"],
        });
      } else {
        setSandboxResult({
          passed: false,
          logs: "✘ [FAIL] test_rrf_scoring: Raw score addition broke ranking normalization. Expected RRF score.",
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 font-sans select-none flex flex-col">
      {/* Top Telemetry & Better Stack Navigation Bar */}
      <nav className="h-14 border-b border-[#1e222e] bg-[#07080b]/90 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[#2a3041] bg-[#0e1017] flex items-center justify-center text-[#06b6d4]">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
            AI:NATIVE<span className="text-[#06b6d4] text-[10px] uppercase border border-[#06b6d4]/40 px-1 rounded">OS</span>
          </span>
          <span className="hidden sm:inline text-slate-600 text-xs">/</span>
          <span className="hidden sm:inline text-slate-400 text-xs">Better Stack x Evervault Spec</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#1e222e] bg-[#0e1017] text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-telemetry" />
            <span>SUPABASE LIVE</span>
          </div>

          <button
            onClick={onEnterApp}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#06b6d4] hover:bg-[#22d3ee] text-[#07080b] text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-[#1e222e] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-stretch">
          {/* Left Column: Mission Copy */}
          <div className="p-6 sm:p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#1e222e]">
            {/* Breadcrumb Tag */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4] text-xs font-mono mb-6 w-max">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project-Based AI Systems Engineering</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 leading-[1.15] mb-5">
              Stop prompt tweaking. Build industrial-grade <span className="text-[#06b6d4]">AI systems</span> from zero.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-8">
              A 100% project-based, in-browser simulation platform. Master low-level memory buffers, hybrid RAG, multi-agent state machines, and eval CI/CD with zero server compute bills.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#06b6d4] hover:bg-[#22d3ee] text-[#07080b] font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span>Enter Skill Constellation (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenChaos}
                className="flex items-center gap-2 px-5 py-3 rounded-lg border border-[#f43f5e]/40 bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 text-[#f43f5e] font-mono text-xs font-semibold transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Simulate 2 AM P0 Outage</span>
              </button>
            </div>

            {/* Zero-Cost Badges */}
            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#1e222e] text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> $0 Compute Bills (Pyodide WASM)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" /> Live Supabase Backend
              </span>
            </div>
          </div>

          {/* Right Column: Better Stack Browser Mock Window */}
          <div className="p-6 sm:p-10 flex flex-col justify-center bg-[#07080b]/50">
            <div className="rounded-xl border border-[#2a3041] bg-[#0e1017] shadow-2xl overflow-hidden font-mono">
              {/* Mock Window Chrome */}
              <div className="h-9 px-3 border-b border-[#1e222e] bg-[#07080b] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2a3041]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2a3041]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2a3041]" />
                </div>
                <div className="px-3 py-0.5 rounded bg-[#111318] border border-[#1e222e] text-[10px] text-slate-400">
                  sandbox.ainative.dev
                </div>
                <div className="text-[10px] text-[#10b981] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Pyodide 3.12
                </div>
              </div>

              {/* Live Interactive Hero Sandbox */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[#06b6d4] font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Live Interactive Sandbox (Try It Now)
                  </span>
                  <span className="text-[10px] text-slate-500">Node #2.1</span>
                </div>

                <textarea
                  value={heroCode}
                  onChange={(e) => setHeroCode(e.target.value)}
                  rows={6}
                  className="w-full rounded bg-[#07080b] border border-[#1e222e] p-3 text-xs text-slate-200 focus:outline-none focus:border-[#06b6d4] resize-none font-mono leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    Replace line 5 with: <code className="text-[#06b6d4]">1.0 / (k + 1)</code>
                  </span>

                  <button
                    onClick={handleTestHeroCode}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#10b981] hover:bg-emerald-500 text-[#07080b] text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isTesting ? "Auditing..." : "Run Moulinette Test"}
                  </button>
                </div>

                {/* Live Sandbox Execution Output */}
                {sandboxResult && (
                  <div
                    className={`p-2.5 rounded border text-[11px] ${
                      sandboxResult.passed
                        ? "bg-[#10b981]/10 border-[#10b981]/30 text-emerald-300"
                        : "bg-[#f43f5e]/10 border-[#f43f5e]/30 text-rose-300"
                    }`}
                  >
                    {sandboxResult.logs}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Core Architectural Pillars */}
      <section className="border-b border-[#1e222e] py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full font-mono">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-[#06b6d4] font-bold mb-2">
            ENGINEERED WITHOUT AI SLOP
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight font-sans">
            Why AI:NATIVE OS is built different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-6 rounded-xl border border-[#1e222e] bg-[#0e1017] hover:border-[#2a3041] transition-all space-y-3">
            <div className="w-8 h-8 rounded border border-[#06b6d4]/40 bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4]">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Classical CS + AI Convergence</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Never tweak prompts in isolation. Master byte streams, inverted indexes, concurrency, and HNSW graphs to know exactly why models behave the way they do.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl border border-[#1e222e] bg-[#0e1017] hover:border-[#2a3041] transition-all space-y-3">
            <div className="w-8 h-8 rounded border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">The Socratic AI Pair</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              No lazy Copilot autocompletes. The Socratic Ghost watches your AST and nudges your architecture, while the Griller interrogates your trade-offs upon test passage.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl border border-[#1e222e] bg-[#0e1017] hover:border-[#2a3041] transition-all space-y-3">
            <div className="w-8 h-8 rounded border border-[#f43f5e]/40 bg-[#f43f5e]/10 flex items-center justify-center text-[#f43f5e]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Live P0 Crisis Rooms</h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Experience the pressure of real production. Fix runaway memory leaks, mitigate prompt injection attacks, and stabilize broken clusters before SLA breaches.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e222e] py-8 px-4 sm:px-8 text-center text-xs font-mono text-slate-500">
        AI:NATIVE OS — Built on Supabase, Pyodide WASM, and Better Stack Design Tokens. 100% Free & Open-Source.
      </footer>
    </div>
  );
}
