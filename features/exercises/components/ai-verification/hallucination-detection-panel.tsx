"use client";

import { ShieldAlert } from "lucide-react";
import type { AiInvestigationPayload } from "./types";

interface HallucinationDetectionPanelProps {
  payload: AiInvestigationPayload;
  onChange: (updates: Partial<AiInvestigationPayload>) => void;
}

export function HallucinationDetectionPanel({
  payload,
  onChange,
}: HallucinationDetectionPanelProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Hallucination Detection Panel</h3>
          <p className="text-xs text-muted-foreground">
            Audit PR-101 and PR-103 to flag non-existent packages, fabricated options, and logic inversions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task 1.1: Hallucinated Package */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>1. Flag Hallucinated Dependency (PR-101):</span>
            <span className="text-[10px] text-amber-400 font-mono">VIS-01</span>
          </label>
          <select
            value={payload.task_1_hallucinated_package_name}
            onChange={(e) => onChange({ task_1_hallucinated_package_name: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Identified Package --</option>
            <option value="@auth/jwt-auto-verify-v2">@auth/jwt-auto-verify-v2 (Non-existent)</option>
            <option value="jsonwebtoken">jsonwebtoken (Standard official package)</option>
            <option value="jose">jose (Verified standard library)</option>
            <option value="crypto">crypto (Node.js built-in module)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Inspect the package import declaration. Does it exist in the public registry?
          </p>
        </div>

        {/* Task 1.2: Hallucinated Config Parameter */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>2. Fabricated Config Parameter (PR-101):</span>
            <span className="text-[10px] text-zinc-400 font-mono">HID-06</span>
          </label>
          <select
            value={payload.task_1_hallucinated_config_parameter}
            onChange={(e) => onChange({ task_1_hallucinated_config_parameter: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Config Parameter --</option>
            <option value="cacheTtlSeconds">cacheTtlSeconds (Hallucinated options key)</option>
            <option value="algorithm">algorithm (Valid crypto field)</option>
            <option value="autoFetchJwks">autoFetchJwks (Valid option)</option>
            <option value="token">token (Required input argument)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Identify fabricated option parameters not supported by the underlying cryptography APIs.
          </p>
        </div>

        {/* Task 1.3: Unsupported Claim */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>3. Unsupported Performance Claim (PR-101):</span>
            <span className="text-[10px] text-amber-400 font-mono">VIS-03</span>
          </label>
          <select
            value={payload.task_1_unsupported_performance_claim}
            onChange={(e) => onChange({ task_1_unsupported_performance_claim: e.target.value })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Unsupported Claim --</option>
            <option value="zero_overhead_native_caching">zero_overhead_native_caching (Unsubstantiated)</option>
            <option value="standard_rs256_algorithm">standard_rs256_algorithm (Accurate)</option>
            <option value="asynchronous_promise_return">asynchronous_promise_return (Accurate)</option>
            <option value="typescript_type_annotation">typescript_type_annotation (Accurate)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Flag marketing-style claims made by the model that lack empirical benchmarks.
          </p>
        </div>

        {/* Task 3.1: Logic Inversion & Confidence */}
        <div className="space-y-2 p-3 rounded-lg bg-zinc-950/70 border border-border/60">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>4. Rate Limiter Logic Defect (PR-103):</span>
            <span className="text-[10px] text-amber-400 font-mono">VIS-06 / HID-05</span>
          </label>
          <select
            value={payload.task_3_logic_defect_type}
            onChange={(e) => onChange({
              task_3_logic_defect_type: e.target.value,
              task_3_confidence_misalignment: "authoritative_tone_with_flawed_logic",
              task_3_false_api_property: "thread_safe_guarantee_unsupported",
            })}
            className="w-full bg-zinc-900 border border-border/80 rounded-md px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Select Logic Defect --</option>
            <option value="inverted_boolean_boundary">inverted_boolean_boundary (&apos;&lt;&apos; returns true when under limit)</option>
            <option value="syntax_type_error">syntax_type_error (Missing parameter types)</option>
            <option value="memory_leak_closure">memory_leak_closure (Unreleased event listener)</option>
            <option value="null_pointer_exception">null_pointer_exception (Undefined variable access)</option>
          </select>
          <p className="text-[11px] text-zinc-400 leading-tight">
            Notice how the model&apos;s confident tone contradicts the fatal boolean inversion.
          </p>
        </div>
      </div>
    </div>
  );
}
