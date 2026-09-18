"use client";

import React from "react";
import { CheckCircle2, Sparkles, ArrowRight, X, Unlock } from "lucide-react";
import { CurriculumNode } from "@/lib/supabase";

interface UnlockedCelebrationModalProps {
  completedNode: CurriculumNode | null;
  newlyUnlocked: CurriculumNode[];
  isOpen: boolean;
  onClose: () => void;
  onSelectNextNode: (node: CurriculumNode) => void;
}

export function UnlockedCelebrationModal({
  completedNode,
  newlyUnlocked,
  isOpen,
  onClose,
  onSelectNextNode,
}: UnlockedCelebrationModalProps) {
  if (!isOpen || !completedNode || newlyUnlocked.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07080b]/80 backdrop-blur-sm select-none font-mono">
      <div className="w-full max-w-lg rounded-xl border border-[#10b981]/50 bg-[#0e1017] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#1e222e] bg-[#10b981]/10 flex items-center justify-between text-[#10b981]">
          <div className="flex items-center gap-2">
            <Unlock className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider">LESSON MASTERED — NEXT MODULES UNLOCKED</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#10b981] font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Foundation Verified: {completedNode.title}</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              You passed the automated Moulinette test assertions and defended your architectural trade-offs with the Socratic Griller. The next stage of the curriculum is now unlocked.
            </p>
          </div>

          {/* Unlocked Lessons */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-300 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#06b6d4]" />
              Newly Unlocked Module{newlyUnlocked.length > 1 ? "s" : ""}:
            </span>

            {newlyUnlocked.map((unlocked) => (
              <div
                key={unlocked.id}
                onClick={() => {
                  onClose();
                  onSelectNextNode(unlocked);
                }}
                className="flex items-center justify-between p-3.5 rounded-lg border border-[#06b6d4]/30 bg-[#06b6d4]/5 hover:bg-[#06b6d4]/10 hover:border-[#06b6d4] transition-all cursor-pointer group shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              >
                <div>
                  <span className="text-[10px] text-[#06b6d4] font-bold block mb-0.5">
                    {unlocked.phase_id.replace("phase-", "PHASE ").toUpperCase()}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-[#06b6d4] transition-colors">
                    {unlocked.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {unlocked.subtitle}
                  </p>
                </div>

                <button className="flex items-center gap-1 px-3.5 py-1.5 rounded bg-[#06b6d4] hover:bg-[#22d3ee] text-[#07080b] text-xs font-bold shrink-0 ml-3 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  <span>Enter Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1b1f2c] hover:bg-[#252a3a] border border-[#2a3041] text-xs font-semibold text-slate-300 transition-colors"
            >
              View in Skill Galaxy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
