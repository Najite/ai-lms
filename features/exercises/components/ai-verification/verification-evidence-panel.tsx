"use client";

import { XCircle, AlertCircle, FileSearch } from "lucide-react";
import type { AiCaseItem, AiInvestigationPayload } from "./types";
import { cn } from "@/lib/utils";

interface VerificationEvidencePanelProps {
  currentCase: AiCaseItem;
  payload: AiInvestigationPayload;
  onChange: (updates: Partial<AiInvestigationPayload>) => void;
}

export function VerificationEvidencePanel({
  currentCase,
  payload,
  onChange,
}: VerificationEvidencePanelProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Verification Evidence Panel</h3>
            <p className="text-xs text-muted-foreground">
              Deterministic ground truth logs from compilers, package registries, and test harnesses.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-border/60 text-zinc-400 font-mono">
          Ground Truth Auditor
        </span>
      </div>

      {/* Evidence Logs List */}
      <div className="space-y-3">
        {currentCase.evidenceLogs.map((log, i) => (
          <div
            key={i}
            className="p-3.5 rounded-lg bg-zinc-950 border border-border/80 space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {log.status === "error" || log.status === "failed" ? (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="font-semibold text-zinc-200">{log.source}</span>
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase px-2 py-0.5 rounded border",
                  log.status === "error"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                )}
              >
                {log.type.replace("_", " ")}
              </span>
            </div>

            <pre className="p-2.5 rounded bg-zinc-900/90 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              <code>{log.output}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* Formative Evidence Mapping Controls */}
      <div className="p-3 rounded-lg bg-zinc-950/70 border border-border/60 space-y-2">
        <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
          <span>Primary Verification Evidence Source (PR-101):</span>
          <span className="text-[10px] text-cyan-400 font-mono">VIS-05</span>
        </label>
        <select
          value={payload.task_1_verification_evidence_source}
          onChange={(e) => onChange({ task_1_verification_evidence_source: e.target.value })}
          className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
        >
          <option value="">-- Select Deterministic Evidence Source --</option>
          <option value="npm_registry_404_ts_compiler_ts2307">
            npm_registry_404_ts_compiler_ts2307 (Registry 404 + TS2307 Module Missing)
          </option>
          <option value="human_visual_review_only">human_visual_review_only (Skimming generated text)</option>
          <option value="ai_self_reported_confidence">ai_self_reported_confidence (Asking AI if sure)</option>
          <option value="lint_whitespace_warning">lint_whitespace_warning (Formatting check)</option>
        </select>
        <p className="text-[11px] text-zinc-400 leading-tight">
          Select the definitive deterministic verification sources that disprove the AI output.
        </p>
      </div>
    </div>
  );
}
