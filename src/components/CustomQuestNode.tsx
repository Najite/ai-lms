"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Cpu, Sparkles, CheckCircle2, Lock, ArrowUpRight, Zap } from "lucide-react";
import { CurriculumNode } from "@/lib/supabase";

interface CustomQuestNodeProps {
  data: {
    node: CurriculumNode;
    status: "locked" | "available" | "in_progress" | "tests_passed" | "defense_passed" | "mastered";
    isSelected: boolean;
    onSelect: (node: CurriculumNode) => void;
  };
}

export const CustomQuestNode = memo(function CustomQuestNode({ data }: CustomQuestNodeProps) {
  const { node, status, isSelected, onSelect } = data;

  const isCompleted = status === "tests_passed" || status === "defense_passed" || status === "mastered";
  const isLocked = status === "locked";

  const getBorderColor = () => {
    if (isSelected) return "border-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.25)]";
    if (isCompleted) return "border-[#10b981]/80";
    if (status === "in_progress") return "border-[#f59e0b]/80";
    if (isLocked) return "border-[#1e222e] opacity-60";
    return "border-[#2a3041] hover:border-[#3e4760]";
  };

  return (
    <div
      onClick={() => !isLocked && onSelect(node)}
      className={`w-[320px] rounded-lg bg-[#0e1017] border p-4 transition-all duration-200 cursor-pointer text-left relative group ${getBorderColor()}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-[#2a3041] !w-2 !h-2" />

      {/* Header telemetry badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1b1f2c] text-slate-400 border border-[#2a3041]">
            {node.phase_id.replace("phase-", "P").toUpperCase()}
          </span>
          <span className="text-[10px] font-mono text-slate-500">Node #{node.id.split("-")[1]}.{node.id.split("-")[2]}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#f59e0b] px-1.5 py-0.5 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/30">
            <Zap className="w-3 h-3 fill-[#f59e0b]" />
            +{node.xp_reward} XP
          </div>

          {isCompleted && (
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          )}
          {isLocked && (
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          )}
        </div>
      </div>

      {/* Title & Subtitle */}
      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-[#06b6d4] transition-colors leading-snug mb-1">
        {node.title}
      </h3>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
        {node.subtitle}
      </p>

      {/* Classical CS vs AI Convergence Dual Tags */}
      <div className="space-y-1.5 pt-2 border-t border-[#1e222e] text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Cpu className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="text-slate-500 text-[10px] uppercase">CS:</span>
          <span className="truncate text-slate-400">{node.cs_foundation}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3 h-3 text-[#06b6d4] shrink-0" />
          <span className="text-[#06b6d4] text-[10px] uppercase">AI:</span>
          <span className="truncate text-slate-300 font-medium">{node.ai_convergence}</span>
        </div>
      </div>

      {/* Hover action prompt */}
      {!isLocked && (
        <div className="mt-3 pt-2 border-t border-[#1e222e] flex items-center justify-between text-[11px] font-mono text-[#06b6d4] opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Enter Sandbox Workspace</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-[#2a3041] !w-2 !h-2" />
    </div>
  );
});
