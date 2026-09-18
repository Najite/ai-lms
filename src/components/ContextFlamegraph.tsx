"use client";

import React from "react";
import { BarChart3, Clock, DollarSign, Cpu, Layers } from "lucide-react";

interface ContextFlamegraphProps {
  totalTokens?: number;
  maxTokens?: number;
  systemTokens?: number;
  exemplarTokens?: number;
  ragTokens?: number;
  historyTokens?: number;
  ttftMs?: number;
  retrievalMs?: number;
}

export function ContextFlamegraph({
  totalTokens = 3850,
  maxTokens = 8192,
  systemTokens = 250,
  exemplarTokens = 800,
  ragTokens = 2200,
  historyTokens = 600,
  ttftMs = 145,
  retrievalMs = 28,
}: ContextFlamegraphProps) {
  const percentUsed = Math.round((totalTokens / maxTokens) * 100);

  const sysPercent = (systemTokens / totalTokens) * 100;
  const exPercent = (exemplarTokens / totalTokens) * 100;
  const ragPercent = (ragTokens / totalTokens) * 100;
  const histPercent = (historyTokens / totalTokens) * 100;

  const estimatedCost = (totalTokens * 0.0000015).toFixed(6);

  return (
    <div className="p-3.5 rounded-lg border border-[#1e222e] bg-[#07080b] font-mono text-xs space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <BarChart3 className="w-3.5 h-3.5 text-[#06b6d4]" />
          <span className="font-bold tracking-tight">CONTEXT FLAMEGRAPH & LATENCY PROFILER</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-[#06b6d4]" />
            TTFT: <strong className="text-slate-200">{ttftMs}ms</strong>
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <DollarSign className="w-3 h-3 text-[#10b981]" />
            Cost: <strong className="text-slate-200">${estimatedCost}</strong>
          </span>
        </div>
      </div>

      {/* Visual Context Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Context Allocation ({totalTokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens)</span>
          <span className="font-semibold text-slate-300">{percentUsed}% Capacity</span>
        </div>

        <div className="w-full h-3 rounded bg-[#111318] border border-[#1e222e] overflow-hidden flex">
          {/* System */}
          <div
            className="h-full bg-[#06b6d4] hover:brightness-110 transition-all"
            style={{ width: `${sysPercent}%` }}
            title={`System: ${systemTokens} tokens (${sysPercent.toFixed(1)}%)`}
          />
          {/* Exemplars */}
          <div
            className="h-full bg-[#8b5cf6] hover:brightness-110 transition-all"
            style={{ width: `${exPercent}%` }}
            title={`Few-Shot Exemplars: ${exemplarTokens} tokens (${exPercent.toFixed(1)}%)`}
          />
          {/* RAG Context */}
          <div
            className="h-full bg-[#3b82f6] hover:brightness-110 transition-all"
            style={{ width: `${ragPercent}%` }}
            title={`Retrieved RAG: ${ragTokens} tokens (${ragPercent.toFixed(1)}%)`}
          />
          {/* History */}
          <div
            className="h-full bg-[#f59e0b] hover:brightness-110 transition-all"
            style={{ width: `${histPercent}%` }}
            title={`History: ${historyTokens} tokens (${histPercent.toFixed(1)}%)`}
          />
        </div>
      </div>

      {/* Legend & Latency Waterfall */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-slate-400 border-t border-[#1e222e]/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#06b6d4]" />
          <span>System ({systemTokens}t)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#8b5cf6]" />
          <span>Exemplars ({exemplarTokens}t)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#3b82f6]" />
          <span>RAG Chunks ({ragTokens}t)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#f59e0b]" />
          <span>History ({historyTokens}t)</span>
        </div>
      </div>
    </div>
  );
}
