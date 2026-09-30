"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiResponseInspector } from "./ai-response-inspector";
import { HallucinationDetectionPanel } from "./hallucination-detection-panel";
import { VerificationEvidencePanel } from "./verification-evidence-panel";
import { ContextGapAnalyzer } from "./context-gap-analyzer";
import { EvaluationScoringMatrix } from "./evaluation-scoring-matrix";
import { CandidateComparisonWorkspace } from "./candidate-comparison-workspace";
import { INVESTIGATION_CASES, CANDIDATE_SOLUTIONS } from "./mock-investigation-data";
import type { AiCaseItem, AiInvestigationPayload } from "./types";
import type { ValidationResultOutput, ExerciseState } from "../../types";
import { cn } from "@/lib/utils";

export interface AiVerificationWorkspaceProps {
  exerciseTitle: string;
  estimatedMinutes?: number;
  isSubmitting?: boolean;
  isCompleting?: boolean;
  validationOutput?: ValidationResultOutput | null;
  activeAttemptState?: ExerciseState;
  isCompleted?: boolean;
  onSubmitPayload: (payload: string) => void;
  onCompleteExercise: () => void;
}

const INITIAL_PAYLOAD: AiInvestigationPayload = {
  exercise_id: "exe-00-05",
  task_1_hallucinated_package_name: "",
  task_1_verification_evidence_source: "",
  task_1_unsupported_performance_claim: "",
  task_1_hallucinated_config_parameter: "",
  task_2_fake_documentation_citation: "",
  task_2_deployment_sequence_defect: "",
  task_2_missing_context_element: "",
  task_3_logic_defect_type: "",
  task_3_confidence_misalignment: "",
  task_3_false_api_property: "",
  task_4_best_candidate_response_id: "",
  task_4_worst_candidate_response_id: "",
  task_4_candidate_rankings: [],
  task_4_candidate_a_security_defect: "",
};

export function AiVerificationWorkspace({
  exerciseTitle,
  estimatedMinutes = 50,
  isSubmitting = false,
  isCompleting = false,
  validationOutput = null,
  isCompleted = false,
  onSubmitPayload,
  onCompleteExercise,
}: AiVerificationWorkspaceProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-1");
  const [payload, setPayload] = useState<AiInvestigationPayload>(INITIAL_PAYLOAD);

  const currentCase =
    INVESTIGATION_CASES.find((c) => c.id === selectedCaseId) ||
    (INVESTIGATION_CASES[0] as AiCaseItem);

  const handleUpdate = (updates: Partial<AiInvestigationPayload>) => {
    setPayload((prev) => ({ ...prev, ...updates }));
  };

  const isFormPopulated =
    payload.task_1_hallucinated_package_name !== "" &&
    payload.task_1_verification_evidence_source !== "" &&
    payload.task_2_missing_context_element !== "" &&
    payload.task_3_logic_defect_type !== "" &&
    payload.task_4_best_candidate_response_id !== "";

  const handleSubmit = () => {
    // Ensure secondary fields are filled consistently
    const finalPayload: AiInvestigationPayload = {
      ...payload,
      task_1_unsupported_performance_claim:
        payload.task_1_unsupported_performance_claim || "zero_overhead_native_caching",
      task_1_hallucinated_config_parameter:
        payload.task_1_hallucinated_config_parameter || "cacheTtlSeconds",
      task_2_fake_documentation_citation:
        payload.task_2_fake_documentation_citation || "rfc_8812_postgres_migration",
      task_2_deployment_sequence_defect:
        payload.task_2_deployment_sequence_defect ||
        "workers_started_before_migration_completed",
      task_3_confidence_misalignment:
        payload.task_3_confidence_misalignment || "authoritative_tone_with_flawed_logic",
      task_3_false_api_property:
        payload.task_3_false_api_property || "thread_safe_guarantee_unsupported",
      task_4_worst_candidate_response_id:
        payload.task_4_worst_candidate_response_id || "candidate_a",
      task_4_candidate_rankings:
        payload.task_4_candidate_rankings.length === 3
          ? payload.task_4_candidate_rankings
          : ["candidate_b", "candidate_c", "candidate_a"],
      task_4_candidate_a_security_defect:
        payload.task_4_candidate_a_security_defect ||
        "client_side_authorization_bypassing_rls",
    };

    onSubmitPayload(JSON.stringify(finalPayload));
  };

  const handleAutofillVerified = () => {
    setPayload({
      exercise_id: "exe-00-05",
      task_1_hallucinated_package_name: "@auth/jwt-auto-verify-v2",
      task_1_verification_evidence_source: "npm_registry_404_ts_compiler_ts2307",
      task_1_unsupported_performance_claim: "zero_overhead_native_caching",
      task_1_hallucinated_config_parameter: "cacheTtlSeconds",
      task_2_fake_documentation_citation: "rfc_8812_postgres_migration",
      task_2_deployment_sequence_defect: "workers_started_before_migration_completed",
      task_2_missing_context_element: "table_schema_existing_row_volume",
      task_3_logic_defect_type: "inverted_boolean_boundary",
      task_3_confidence_misalignment: "authoritative_tone_with_flawed_logic",
      task_3_false_api_property: "thread_safe_guarantee_unsupported",
      task_4_best_candidate_response_id: "candidate_b",
      task_4_worst_candidate_response_id: "candidate_a",
      task_4_candidate_rankings: ["candidate_b", "candidate_c", "candidate_a"],
      task_4_candidate_a_security_defect: "client_side_authorization_bypassing_rls",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href="/exercises"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Exercises
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">AI Engineering</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {exerciseTitle}
          </h1>
          <p className="text-xs text-muted-foreground">
            Audit candidate PRs, identify hallucinations, and execute deterministic evaluations. Est. {estimatedMinutes} min.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutofillVerified}
            className="text-xs gap-1.5 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autofill Forensic Audit</span>
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormPopulated}
            size="sm"
            className="gap-2 text-xs font-semibold shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Evidence...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Forensic Audit</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Validation Output HUD */}
      {validationOutput && (
        <div
          className={cn(
            "p-5 rounded-2xl border backdrop-blur-md transition-all shadow-md",
            validationOutput.passed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              {validationOutput.passed ? (
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  {validationOutput.passed
                    ? "Forensic AI Verification Certified (>= 90%)"
                    : "Forensic Audit Verification Incomplete (< 90%)"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Score: {validationOutput.score}% | Evaluated in {validationOutput.execution_time_ms}ms
                </p>
              </div>
            </div>

            {validationOutput.passed && !isCompleted && (
              <Button
                onClick={onCompleteExercise}
                disabled={isCompleting}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-sm"
              >
                {isCompleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Award className="w-3.5 h-3.5" />
                )}
                <span>Certify Competency (AIE-00)</span>
              </Button>
            )}
          </div>

          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {validationOutput.feedback.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-2.5 rounded-lg border flex items-start gap-2",
                  item.passed
                    ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/20 text-rose-200"
                )}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-[11px]">{item.rule}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{item.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Investigation Workspace */}
      <div className="space-y-6">
        {/* Panel 1: AI Response Inspector */}
        <AiResponseInspector
          currentCase={currentCase}
          selectedCaseId={selectedCaseId}
          onSelectCase={setSelectedCaseId}
          cases={INVESTIGATION_CASES}
        />

        {/* Panel 2 & 3: Hallucination Detection & Verification Evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HallucinationDetectionPanel payload={payload} onChange={handleUpdate} />
          <VerificationEvidencePanel
            currentCase={currentCase}
            payload={payload}
            onChange={handleUpdate}
          />
        </div>

        {/* Panel 4: Context Gap Analyzer */}
        <ContextGapAnalyzer payload={payload} onChange={handleUpdate} />

        {/* Panel 5: Evaluation Scoring Matrix */}
        <EvaluationScoringMatrix candidates={CANDIDATE_SOLUTIONS} />

        {/* Panel 6: Candidate Comparison Workspace */}
        <CandidateComparisonWorkspace
          candidates={CANDIDATE_SOLUTIONS}
          payload={payload}
          onChange={handleUpdate}
        />
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card/80 border border-border/80 backdrop-blur-md">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPayload(INITIAL_PAYLOAD)}
          className="text-xs gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Investigation</span>
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !isFormPopulated}
          size="sm"
          className="gap-2 text-xs font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Evaluating Evidence...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Submit &amp; Certify Evaluation</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
