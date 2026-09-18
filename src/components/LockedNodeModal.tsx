"use client";

import React from "react";
import { Lock, AlertCircle, ArrowRight, ShieldCheck, X } from "lucide-react";
import { CurriculumNode } from "@/lib/supabase";

interface LockedNodeModalProps {
  node: CurriculumNode | null;
  missingPrereqs: CurriculumNode[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPrereq: (node: CurriculumNode) => void;
}

export function LockedNodeModal({
  node,
  missingPrereqs,
  isOpen,
  onClose,
  onSelectPrereq,
}: LockedNodeModalProps) {
  if (!isOpen || !node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07080b]/80 backdrop-blur-sm select-none font-mono">
      <div className="w-full max-w-lg rounded-xl border border-[#f43f5e]/40 bg-[#0e1017] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#1e222e] bg-[#f43f5e]/10 flex items-center justify-between text-[#f43f5e]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider">MODULE LOCKED — PREREQUISITE REQUIRED</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">
              {node.title}
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              This curriculum enforces industrial prerequisite discipline. You cannot skip directly to advanced retrieval, streaming, or multi-agent systems without mastering the underlying foundation lessons first.
            </p>
          </div>

          {/* Missing Prerequisites Box */}
          <div className="p-4 rounded-lg border border-[#1e222e] bg-[#07080b] space-y-3">
            <span className="text-[11px] font-semibold text-slate-300 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Complete the following prerequisite(s) first:
            </span>

            <div className="space-y-2">
              {missingPrereqs.map((prereq) => (
                <div
                  key={prereq.id}
                  onClick={() => {
                    onClose();
                    onSelectPrereq(prereq);
                  }}
                  className="flex items-center justify-between p-3 rounded border border-[#2a3041] bg-[#111318] hover:border-[#06b6d4] transition-all cursor-pointer group"
                >
                  <div>
                    <span className="text-[10px] text-[#06b6d4] font-bold block mb-0.5">
                      {prereq.phase_id.replace("phase-", "PHASE ").toUpperCase()}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-[#06b6d4] transition-colors">
                      {prereq.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {prereq.subtitle}
                    </p>
                  </div>

                  <button className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-[#06b6d4] border border-[#06b6d4]/30 text-xs font-semibold shrink-0 ml-3 transition-colors">
                    <span>Start Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#1b1f2c] hover:bg-[#252a3a] border border-[#2a3041] text-xs font-semibold text-slate-300 transition-colors"
            >
              Back to Constellation
            </button>
            {missingPrereqs[0] && (
              <button
                onClick={() => {
                  onClose();
                  onSelectPrereq(missingPrereqs[0]);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#06b6d4] hover:bg-[#22d3ee] text-[#07080b] text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Go to Prerequisite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
