"use client";

import { Layers } from "lucide-react";
import type { AiInvestigationPayload } from "./types";

interface ContextGapAnalyzerProps {
  payload: AiInvestigationPayload;
  onChange: (updates: Partial<AiInvestigationPayload>) => void;
}

export function ContextGapAnalyzer({
  payload,
  onChange,
}: ContextGapAnalyzerProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Context Gap Analyzer</h3>
            <p className="text-xs text-muted-foreground">
              Diagnose prompt deficiencies, missing environmental schemas, and sequencing defects in PR-102.
            </p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-border/60 text-zinc-400 font-mono">
          Context & Flow Auditor
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task 2.1: Missing Context */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>1. Missing Environmental Context (PR-102):</span>
            <span className="text-[10px] text-indigo-400 font-mono">VIS-02</span>
          </label>
          <select
            value={payload.task_2_missing_context_element}
            onChange={(e) => onChange({ task_2_missing_context_element: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Omitted Context --</option>
            <option value="table_schema_existing_row_volume">
              table_schema_existing_row_volume (Existing row volume &amp; NOT NULL constraints)
            </option>
            <option value="css_color_palette">css_color_palette (Frontend styling rules)</option>
            <option value="git_commit_hash">git_commit_hash (Current branch HEAD)</option>
            <option value="developer_name">developer_name (Author attribution)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Adding a NOT NULL column without default/backfill fails on 45,820 existing rows.
          </p>
        </div>

        {/* Task 2.2: Fake Documentation Citation */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>2. Fabricated Documentation Citation (PR-102):</span>
            <span className="text-[10px] text-zinc-400 font-mono">HID-02</span>
          </label>
          <select
            value={payload.task_2_fake_documentation_citation}
            onChange={(e) => onChange({ task_2_fake_documentation_citation: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Fabricated Citation --</option>
            <option value="rfc_8812_postgres_migration">
              rfc_8812_postgres_migration (&quot;PostgreSQL RFC-8812&quot; does not exist)
            </option>
            <option value="official_postgresql_16_docs">official_postgresql_16_docs (Valid documentation)</option>
            <option value="ansi_sql_standard">ansi_sql_standard (Valid ISO specification)</option>
            <option value="posix_filesystem_spec">posix_filesystem_spec (Valid standard)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            IETF RFCs specify internet protocols, not PostgreSQL relational DDL operations.
          </p>
        </div>

        {/* Task 2.3: Deployment Sequence Defect */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>3. Deployment Sequencing Defect (PR-102):</span>
            <span className="text-[10px] text-zinc-400 font-mono">HID-03</span>
          </label>
          <select
            value={payload.task_2_deployment_sequence_defect}
            onChange={(e) => onChange({ task_2_deployment_sequence_defect: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Sequencing Defect --</option>
            <option value="workers_started_before_migration_completed">
              workers_started_before_migration_completed (Restarting workers before DB migration causes crash)
            </option>
            <option value="using_standard_https_port">using_standard_https_port (Valid networking)</option>
            <option value="verifying_telemetry_after_deploy">verifying_telemetry_after_deploy (Standard practice)</option>
            <option value="deploying_api_gateway_last">deploying_api_gateway_last (Valid practice)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Worker nodes will attempt to query a non-existent column if restarted before migration completes.
          </p>
        </div>
      </div>
    </div>
  );
}
