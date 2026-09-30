"use client";

import React, { useState } from "react";
import {
  Activity,
  Server,
  FileCheck2,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Award,
  Loader2,
  HelpCircle,
  Terminal,
  ShieldCheck,
  Check,
  ChevronRight,
  Wifi,
} from "lucide-react";
import { MOCK_NETWORK_REQUESTS, type NetworkRequestItem } from "./network-mock-data";
import { NetworkRequestTable } from "./network-request-table";
import { NetworkRequestInspector } from "./network-request-inspector";
import {
  NetworkInvestigationStation,
  type InvestigationAnswers,
} from "./network-investigation-station";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ValidationResultOutput } from "../../types";

export interface NetworkDiagnosticsWorkspaceProps {
  exerciseTitle: string;
  estimatedMinutes: number;
  isSubmitting: boolean;
  isCompleting: boolean;
  validationOutput: ValidationResultOutput | null;
  activeAttemptState?: string;
  isCompleted: boolean;
  onSubmitPayload: (jsonPayload: string) => void;
  onCompleteExercise: () => void;
}

const INITIAL_ANSWERS: InvestigationAnswers = {
  task_1_successful_catalog_request_id: "",
  task_1_missing_asset_request_id: "",
  task_2_redirect_target_url: "",
  task_2_insecure_http_request_id: "",
  task_3_unauthenticated_request_id: "",
  task_3_forbidden_request_id: "",
  task_4_backend_crash_request_id: "",
  task_4_timeout_bottleneck_request_id: "",
  task_5_resolved_api_ip_address: "",
  task_5_error_code_payload: "",
  task_6_primary_root_cause: "",
};

export function NetworkDiagnosticsWorkspace({
  exerciseTitle,
  estimatedMinutes,
  isSubmitting,
  isCompleting,
  validationOutput,
  isCompleted,
  onSubmitPayload,
  onCompleteExercise,
}: NetworkDiagnosticsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"devtools" | "investigation" | "scenario">("devtools");
  const [selectedRequestId, setSelectedRequestId] = useState<string>("R3");
  const [answers, setAnswers] = useState<InvestigationAnswers>(INITIAL_ANSWERS);

  const selectedRequest =
    MOCK_NETWORK_REQUESTS.find((r: NetworkRequestItem) => r.id === selectedRequestId) || null;

  const handleAnswerChange = (field: keyof InvestigationAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCompletedCount = () => {
    let count = 0;
    if (answers.task_1_successful_catalog_request_id && answers.task_1_missing_asset_request_id) count++;
    if (answers.task_2_redirect_target_url && answers.task_2_insecure_http_request_id) count++;
    if (answers.task_3_unauthenticated_request_id && answers.task_3_forbidden_request_id) count++;
    if (answers.task_4_backend_crash_request_id && answers.task_4_timeout_bottleneck_request_id) count++;
    if (answers.task_5_resolved_api_ip_address && answers.task_5_error_code_payload) count++;
    if (answers.task_6_primary_root_cause) count++;
    return count;
  };

  const completedTasksCount = calculateCompletedCount();

  const handlePresetSolution = () => {
    setAnswers({
      task_1_successful_catalog_request_id: "R3",
      task_1_missing_asset_request_id: "R4",
      task_2_redirect_target_url: "https://octostore.app",
      task_2_insecure_http_request_id: "R7",
      task_3_unauthenticated_request_id: "R5",
      task_3_forbidden_request_id: "R6",
      task_4_backend_crash_request_id: "R8",
      task_4_timeout_bottleneck_request_id: "R9",
      task_5_resolved_api_ip_address: "140.82.121.34",
      task_5_error_code_payload: "DB_CONN_TIMEOUT",
      task_6_primary_root_cause: "database_connection_crash",
    });
  };

  const handleReset = () => {
    setAnswers(INITIAL_ANSWERS);
  };

  const handleRunDiagnostics = () => {
    const payload = JSON.stringify({
      exercise_id: "exe-00-03",
      ...answers,
    });
    onSubmitPayload(payload);
  };

  const isPassed = validationOutput?.passed === true || isCompleted;

  return (
    <div className="space-y-6">
      {/* Exercise Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary font-bold">MOD-00</span>
            <ChevronRight className="w-3 h-3" />
            <span>Digital Foundations</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-semibold">EXE-00-03</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              <span>{exerciseTitle || "Network Request Investigation & HTTP Diagnostics"}</span>
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-xs px-2.5 py-0.5",
                isPassed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              )}
            >
              {isPassed ? "Completed" : "Active Simulation"}
            </Badge>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border/70 text-xs font-mono text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Est: {estimatedMinutes || 25}m</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePresetSolution}
            className="text-xs font-mono text-muted-foreground hover:text-foreground h-8"
            title="Populate correct answers from DevTools analysis"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Auto-Fill Diagnostics
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs font-mono text-muted-foreground hover:text-foreground h-8"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>

          {isPassed ? (
            <Button
              onClick={onCompleteExercise}
              disabled={isCompleting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-8 shadow-sm"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Recording Evidence...
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  Verify Competency DEV-00
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleRunDiagnostics}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Evaluating Network Findings...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Investigation Findings
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Scenario Context Banner */}
      <div className="rounded-xl border border-border/80 bg-gradient-to-r from-card/80 via-primary/5 to-card/80 p-4 backdrop-blur-md shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 border border-primary/30 text-primary">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">
                  Incident #4081: Intermittent Checkout Failures & Resource Degradation
                </h2>
                <Badge variant="outline" className="text-[10px] font-mono bg-rose-500/10 border-rose-500/30 text-rose-400">
                  CRITICAL SEV-2
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Target App: <span className="font-mono text-foreground font-semibold">https://octostore.app</span> | Diagnostic Capture: 9 In-Flight HTTP Requests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-xs">
            <span className="text-muted-foreground">Progress:</span>
            <span className={cn(
              "font-bold px-2 py-0.5 rounded border",
              completedTasksCount === 6
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/15 text-amber-400 border-amber-500/30"
            )}>
              {completedTasksCount} / 6 Tasks Answered
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60">
        <button
          onClick={() => setActiveTab("devtools")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-all",
            activeTab === "devtools"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Wifi className="w-4 h-4" />
          <span>1. DevTools Network Tab & Request Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab("investigation")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-all relative",
            activeTab === "investigation"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>2. Diagnostic Findings Station</span>
          {completedTasksCount === 6 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("scenario")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-all",
            activeTab === "scenario"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <HelpCircle className="w-4 h-4" />
          <span>3. Incident Briefing & Target Topology</span>
        </button>
      </div>

      {/* Workspace Body Content */}
      <div className="space-y-6">
        {activeTab === "devtools" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Top: Network Request Table */}
            <div className="lg:col-span-7">
              <NetworkRequestTable
                requests={MOCK_NETWORK_REQUESTS}
                selectedRequestId={selectedRequestId}
                onSelectRequest={(id) => setSelectedRequestId(id)}
              />
            </div>

            {/* Right/Bottom: Request Inspector */}
            <div className="lg:col-span-5 sticky top-4">
              <NetworkRequestInspector request={selectedRequest} />
            </div>
          </div>
        )}

        {activeTab === "investigation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <NetworkInvestigationStation
                answers={answers}
                onChange={handleAnswerChange}
                onRequestSelectHint={(id) => {
                  setSelectedRequestId(id);
                  setActiveTab("devtools");
                }}
              />
            </div>

            <div className="lg:col-span-4 space-y-4 sticky top-4">
              {/* Quick DevTools Reference Widget */}
              <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    <span>Quick Network Inspector</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("devtools")}
                    className="h-6 text-[10px] px-2 text-primary"
                  >
                    Open Full DevTools &rarr;
                  </Button>
                </div>

                <div className="space-y-1.5 text-muted-foreground">
                  <p className="text-[11px]">Selected Request in DevTools:</p>
                  {selectedRequest ? (
                    <div className="p-2 rounded bg-muted/60 border border-border/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{selectedRequest.id}: {selectedRequest.name}</span>
                        <span className="text-[10px] font-bold text-primary">{selectedRequest.status}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-1">
                        {selectedRequest.url}
                      </div>
                    </div>
                  ) : (
                    <p className="italic text-[11px]">No request selected.</p>
                  )}
                </div>

                <div className="pt-2 border-t border-border/50 space-y-2">
                  <Button
                    onClick={handleRunDiagnostics}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Send className="w-3.5 h-3.5 mr-1" />
                    )}
                    Run Diagnostics Engine
                  </Button>
                </div>
              </div>

              {/* Assessment Criteria Checklist */}
              <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-2.5 text-xs font-mono">
                <span className="font-bold text-foreground block uppercase text-[10px] tracking-wider text-muted-foreground">
                  Assessment Weight Breakdown
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Visible Suite (6 Tests):</span>
                    <span className="font-bold text-primary">40% Weight</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Hidden Suite (8 Tests):</span>
                    <span className="font-bold text-purple-400">60% Weight</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <span className="text-foreground font-semibold">Pass Threshold:</span>
                    <span className="font-bold text-emerald-400">&ge; 90% Required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "scenario" && (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-xl border border-border/80 bg-card/60 p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                <span>Incident Briefing: CloudOps Ticket #4081</span>
              </h2>
              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  At 14:15 UTC, the telemetry alerts fired on OctoStore (<span className="font-mono text-foreground">https://octostore.app</span>).
                  Customers reported that while browsing the storefront works in some sections, checkout is completely broken,
                  certain product images are failing to display, and admin dashboards are inaccessible.
                </p>
                <p>
                  As the on-call engineer, you captured the client browser network activity into the DevTools Network log.
                  Your task is to inspect each captured request, diagnose HTTP status codes, trace redirect chains, inspect headers and JSON bodies,
                  and synthesize the root cause to report back to the reliability engineering team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60 font-mono text-xs">
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase">Domain</span>
                  <span className="font-bold text-foreground">octostore.app</span>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase">API Gateway IP</span>
                  <span className="font-bold text-primary">140.82.121.34</span>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <span className="text-muted-foreground block text-[10px] uppercase">Target Competency</span>
                  <span className="font-bold text-emerald-400">DEV-00: Verified</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setActiveTab("devtools")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                >
                  Start Network Tab Investigation &rarr;
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Feedback & Telemetry Output */}
      {validationOutput && (
        <div
          className={cn(
            "rounded-xl border p-5 space-y-4 backdrop-blur-md transition-all",
            validationOutput.passed
              ? "border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-950/20"
              : "border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/20"
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div className="flex items-center gap-3">
              {validationOutput.passed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {validationOutput.passed
                    ? "Incident Solved: All HTTP & Network Diagnostics Verified!"
                    : "Diagnostic Evaluation Failed: Refine Your Network Findings"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {validationOutput.passed
                    ? "Your network diagnostic synthesis successfully identified all HTTP status codes, DNS mappings, headers, and the database connection crash root cause."
                    : "Review the test results below to inspect which inquiries need correction."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
              <span className="text-xs text-muted-foreground">Overall Score:</span>
              <span
                className={cn(
                  "text-base font-bold px-3 py-1 rounded-md border",
                  validationOutput.passed
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                )}
              >
                {validationOutput.score}%
              </span>
            </div>
          </div>

          {/* Test Cases Results Grid */}
          {validationOutput.feedback && validationOutput.feedback.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground block">
                Verification Suite Breakdown
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {validationOutput.feedback.map((t, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg border text-xs font-mono flex items-start gap-2.5",
                      t.passed
                        ? "bg-emerald-500/5 border-emerald-500/25 text-foreground"
                        : "bg-rose-500/5 border-rose-500/25 text-foreground"
                    )}
                  >
                    {t.passed ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold truncate">{t.rule || `Check #${idx + 1}`}</span>
                        <span
                          className={cn(
                            "text-[10px] uppercase font-bold",
                            t.passed ? "text-emerald-400" : "text-rose-400"
                          )}
                        >
                          {t.passed ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {t.message || (t.passed ? "Evaluation passed" : "Incorrect diagnostic result")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Verification Call to Action */}
          {validationOutput.passed && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 bg-emerald-500/5 -mx-5 -mb-5 p-5 rounded-b-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Competency DEV-00 verified ready for emission to learning record.</span>
              </div>
              <Button
                onClick={onCompleteExercise}
                disabled={isCompleting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shadow-md"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Recording Evidence...
                  </>
                ) : (
                  <>
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    Finalize & Record Competency
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
