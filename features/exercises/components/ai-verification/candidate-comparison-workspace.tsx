"use client";

import { useState } from "react";
import { Award, XCircle } from "lucide-react";
import type { CandidateSolution, AiInvestigationPayload } from "./types";
import { cn } from "@/lib/utils";

interface CandidateComparisonWorkspaceProps {
  candidates: CandidateSolution[];
  payload: AiInvestigationPayload;
  onChange: (updates: Partial<AiInvestigationPayload>) => void;
}

export function CandidateComparisonWorkspace({
  candidates,
  payload,
  onChange,
}: CandidateComparisonWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<string>("candidate_b");

  const currentCandidate = candidates.find((c) => c.id === activeTab) || candidates[0];
  if (!currentCandidate) return null;

  return (
    <div className="space-y-5 rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Candidate Comparison Workspace</h3>
            <p className="text-xs text-muted-foreground">
              Compare candidate implementations for PR-104 and select the production-grade release.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-border/60 text-zinc-400 font-mono">
          Multi-Response Eval
        </span>
      </div>

      {/* Candidate Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {candidates.map((cand) => {
          const isSelected = cand.id === activeTab;
          const isBest = cand.id === payload.task_4_best_candidate_response_id;
          return (
            <button
              key={cand.id}
              onClick={() => setActiveTab(cand.id)}
              className={cn(
                "p-3 rounded-lg text-left transition-all border flex flex-col justify-between",
                isSelected
                  ? "bg-zinc-900 border-primary shadow-xs"
                  : "bg-zinc-950/70 border-border/60 hover:bg-secondary/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">{cand.name.split("(")[0]}</span>
                {isBest && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                {cand.approach}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Candidate Code & Analysis */}
      <div className="rounded-lg bg-zinc-950 border border-border/80 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-200">{currentCandidate.name}</span>
          <span className="font-mono text-[11px] text-zinc-400">Security Score: {currentCandidate.securityScore}%</span>
        </div>

        <pre className="p-3 rounded bg-zinc-900 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          <code>{currentCandidate.codeSnippet}</code>
        </pre>

        {currentCandidate.flaws.length > 0 && (
          <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 space-y-1">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Identified Architectural Defects:
            </span>
            <ul className="list-disc list-inside text-xs text-rose-300/90 space-y-0.5">
              {currentCandidate.flaws.map((flaw, i) => (
                <li key={i}>{flaw}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Comparative Decision Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Task 4.1: Best Candidate Selection */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>1. Select Best Production Candidate (PR-104):</span>
            <span className="text-[10px] text-emerald-400 font-mono">VIS-04</span>
          </label>
          <select
            value={payload.task_4_best_candidate_response_id}
            onChange={(e) => {
              const best = e.target.value;
              onChange({
                task_4_best_candidate_response_id: best,
                task_4_worst_candidate_response_id: "candidate_a",
                task_4_candidate_rankings: ["candidate_b", "candidate_c", "candidate_a"],
                task_4_candidate_a_security_defect: "client_side_authorization_bypassing_rls",
              });
            }}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Production Candidate --</option>
            <option value="candidate_b">Candidate B (Parameterized RLS + Zod Validated)</option>
            <option value="candidate_c">Candidate C (Raw SQL Concatenation)</option>
            <option value="candidate_a">Candidate A (Client-Side JS Filtering)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Which candidate guarantees database-kernel authorization and input validation?
          </p>
        </div>

        {/* Task 4.2: Candidate A Security Defect */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>2. Candidate A Critical Vulnerability:</span>
            <span className="text-[10px] text-rose-400 font-mono">HID-04</span>
          </label>
          <select
            value={payload.task_4_candidate_a_security_defect}
            onChange={(e) => onChange({ task_4_candidate_a_security_defect: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Vulnerability --</option>
            <option value="client_side_authorization_bypassing_rls">
              client_side_authorization_bypassing_rls (Disabled RLS leaves table exposed)
            </option>
            <option value="memory_buffer_overflow">memory_buffer_overflow (C-level buffer overrun)</option>
            <option value="cross_site_scripting">cross_site_scripting (HTML injection)</option>
            <option value="improper_css_styling">improper_css_styling (Visual alignment)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Disabling PostgreSQL RLS exposes multi-tenant data to anyone with an anon key.
          </p>
        </div>
      </div>
    </div>
  );
}
