"use client";

import { Terminal, Clock, Cpu, FileText } from "lucide-react";
import type { AiCaseItem } from "./types";
import { cn } from "@/lib/utils";

interface AiResponseInspectorProps {
  currentCase: AiCaseItem;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  cases: AiCaseItem[];
}

export function AiResponseInspector({
  currentCase,
  selectedCaseId,
  onSelectCase,
  cases,
}: AiResponseInspectorProps) {
  return (
    <div className="space-y-4">
      {/* Case Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {cases.map((c, idx) => {
          const isSelected = c.id === selectedCaseId;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card/70 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <span className="font-mono text-[10px] opacity-80">{c.caseCode}</span>
              <span>Case {idx + 1}: {c.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Inspection Card */}
      <div className="rounded-xl border border-border/80 bg-zinc-950/80 overflow-hidden shadow-md">
        {/* Header bar with metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-border/60 bg-zinc-900/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[11px] font-bold">
              {currentCase.caseCode}
            </span>
            <span className="font-semibold text-zinc-200">{currentCase.title}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              {currentCase.metadata.model}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {currentCase.metadata.latencyMs}ms
            </span>
            <span className="hidden sm:inline text-zinc-500">
              Tokens: {currentCase.metadata.tokensGenerated}
            </span>
          </div>
        </div>

        {/* Prompt section */}
        <div className="p-4 border-b border-border/40 bg-zinc-900/30">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>ORIGINAL USER PROMPT / INTENT:</span>
          </div>
          <p className="text-sm text-zinc-200 bg-zinc-950 p-2.5 rounded-lg border border-border/40 font-mono leading-relaxed">
            &quot;{currentCase.prompt}&quot;
          </p>
        </div>

        {/* AI Output preview */}
        <div className="p-4 bg-zinc-950">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>GENERATED AI DRAFT ({currentCase.outputLanguage.toUpperCase()}):</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Candidate Code Under Review
            </span>
          </div>

          <pre className="p-3.5 rounded-lg bg-zinc-900/90 border border-border/60 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
            <code>{currentCase.modelOutput}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
