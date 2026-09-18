"use client";

import React, { useState } from "react";
import Markdown from "markdown-to-jsx";
import {
  BookOpen,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CurriculumNode } from "@/lib/supabase";

interface DualModeViewerProps {
  node: CurriculumNode;
}

export function DualModeViewer({ node }: DualModeViewerProps) {
  const [activeTab, setActiveTab] = useState<"handbook" | "notebooklm">("handbook");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progress, setProgress] = useState(25); // percentage for mock visualizer
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  // NotebookLM Source Prompt for this exact module
  const notebookLmPrompt = `You are hosting an advanced engineering deep-dive discussion between two staff engineers on "${node.title}".
Analyze the transition from the classical CS foundation (${node.cs_foundation}) to the modern AI-native convergence (${node.ai_convergence}).
Discuss production edge-cases, why naive implementations fail at scale, and explain the code architecture step-by-step. Keep the discussion technical, fast-paced, and engaging.`;

  const copyNotebookLmPrompt = () => {
    navigator.clipboard.writeText(notebookLmPrompt);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1017] border-r border-[#1e222e]">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e222e] bg-[#07080b]/50">
        <div className="flex items-center gap-1 p-0.5 rounded border border-[#1e222e] bg-[#07080b]">
          <button
            onClick={() => setActiveTab("handbook")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === "handbook"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#06b6d4]" />
            Technical Handbook
          </button>
          <button
            onClick={() => setActiveTab("notebooklm")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === "notebooklm"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-[#8b5cf6]" />
            NotebookLM Audio
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            XP Reward: <span className="text-amber-400 font-bold">+{node.xp_reward}</span>
          </span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "handbook" ? (
          <div className="max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
            {/* Phase & Title metadata */}
            <div className="pb-4 border-b border-[#1e222e]">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#06b6d4] uppercase mb-1">
                <span>{node.phase_id.replace("-", " // ")}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                {node.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {node.subtitle}
              </p>
            </div>

            {/* Classical CS vs AI Convergence Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-lg border border-[#1e222e] bg-[#07080b]/60">
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Classical CS Foundation
                </div>
                <div className="text-xs text-slate-200 font-medium font-mono">
                  {node.cs_foundation}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#06b6d4]/20 bg-[#06b6d4]/5">
                <div className="text-[10px] font-mono uppercase text-[#06b6d4] mb-1">
                  AI-Native Convergence
                </div>
                <div className="text-xs text-slate-200 font-medium font-mono">
                  {node.ai_convergence}
                </div>
              </div>
            </div>

            {/* Rendered Technical Markdown */}
            <div className="prose prose-invert prose-headings:text-slate-100 prose-headings:font-mono prose-p:text-slate-300 prose-pre:bg-[#07080b] prose-pre:border prose-pre:border-[#1e222e] prose-code:text-[#06b6d4] prose-code:font-mono prose-strong:text-slate-100">
              <Markdown>{node.handbook_markdown}</Markdown>
            </div>
          </div>
        ) : (
          /* NotebookLM Audio & Discussion Pane */
          <div className="flex flex-col space-y-6">
            {/* Player Card */}
            <div className="p-5 rounded-xl border border-[#2a3041] bg-[#07080b] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b5cf6]">
                  <Sparkles className="w-4 h-4" />
                  <span>NOTEBOOKLM DEEP-DIVE AUDIO</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">11:34 Audio Overview</span>
              </div>

              <h3 className="text-base font-semibold text-slate-100 mb-1">
                {node.title} — Two-Host Discussion
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                AI co-hosts dissecting memory management, edge-case failures, and architectural design choices.
              </p>

              {/* Animated Waveform Visualizer */}
              <div className="h-12 flex items-center justify-between gap-1 px-2 py-1 rounded bg-[#0e1017] border border-[#1e222e] mb-4">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      i < (progress / 100) * 36
                        ? "bg-[#8b5cf6]"
                        : "bg-[#1e222e]"
                    }`}
                    style={{
                      height: isPlaying
                        ? `${Math.max(15, Math.sin(i * 0.8 + Date.now() * 0.005) * 80 + 20)}%`
                        : `${(i % 5 + 2) * 15}%`,
                    }}
                  />
                ))}
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-[#8b5cf6] hover:bg-[#9d72f9] text-white flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setProgress(0)}
                    className="w-8 h-8 rounded border border-[#1e222e] hover:border-[#2a3041] flex items-center justify-center text-slate-400 hover:text-slate-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed toggle */}
                  <div className="flex items-center rounded border border-[#1e222e] p-0.5 text-xs font-mono">
                    {[1, 1.25, 1.5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 rounded transition-all ${
                          playbackSpeed === speed
                            ? "bg-[#1e222e] text-[#06b6d4] font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <Volume2 className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Google NotebookLM Generation Toolkit */}
            <div className="p-4 rounded-lg border border-[#1e222e] bg-[#07080b]/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#06b6d4]" />
                  NotebookLM Source & Directional Prompt
                </span>
                <a
                  href="https://notebooklm.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-[#06b6d4] hover:underline flex items-center gap-1"
                >
                  Open NotebookLM <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-400">
                You can generate a fresh podcast episode for this module in Google NotebookLM for $0. Paste this custom prompt into your NotebookLM Audio Overview settings:
              </p>

              <div className="p-3 rounded bg-[#0e1017] border border-[#1e222e] font-mono text-xs text-slate-300 select-all">
                {notebookLmPrompt}
              </div>

              <button
                onClick={copyNotebookLmPrompt}
                className="w-full py-2 rounded bg-[#1b1f2c] hover:bg-[#252a3a] border border-[#2a3041] text-xs font-mono text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                {isPromptCopied ? "✓ Copied to Clipboard!" : "Copy NotebookLM Prompt"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
