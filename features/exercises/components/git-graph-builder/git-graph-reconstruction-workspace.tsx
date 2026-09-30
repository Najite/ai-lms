"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_HELIOS_COMMITS,
  MOCK_HELIOS_BRANCHES,
  INITIAL_INVESTIGATION_FORM_STATE,
} from "./mock-repository-data";
import type { GitInvestigationFormState } from "./types";
import { CommitGraphCanvas } from "./commit-graph-canvas";
import { BranchTimelineViewer } from "./branch-timeline-viewer";
import { MergeInvestigationPanel } from "./merge-investigation-panel";
import { CommitMetadataInspector } from "./commit-metadata-inspector";
import { DagAnalysisWorkspace } from "./dag-analysis-workspace";
import {
  Network,
  GitBranch,
  GitMerge,
  ShieldCheck,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Terminal,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ValidationResultOutput } from "../../types";

export interface GitGraphReconstructionWorkspaceProps {
  exerciseTitle?: string;
  estimatedMinutes?: number;
  isSubmitting: boolean;
  isCompleting: boolean;
  validationOutput: ValidationResultOutput | null;
  activeAttemptState?: string;
  isCompleted: boolean;
  onSubmitPayload: (jsonPayload: string) => void;
  onCompleteExercise: () => void;
  className?: string;
}

export function GitGraphReconstructionWorkspace({
  exerciseTitle = "Visual Git Graph Reconstruction & Version Control Diagnostics",
  estimatedMinutes = 20,
  isSubmitting,
  isCompleting,
  validationOutput,
  activeAttemptState,
  isCompleted,
  onSubmitPayload,
  onCompleteExercise,
  className,
}: GitGraphReconstructionWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "timelines" | "merge" | "investigation">("graph");
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>("C7");
  const [formState, setFormState] = useState<GitInvestigationFormState>(INITIAL_INVESTIGATION_FORM_STATE);

  const selectedCommit = useMemo(() => {
    if (!selectedCommitId) return null;
    return MOCK_HELIOS_COMMITS.find((c) => c.id === selectedCommitId) || null;
  }, [selectedCommitId]);

  const handleSelectCommitById = (commitId: string) => {
    setSelectedCommitId(commitId);
  };

  const handleFormChange = (updates: Partial<GitInvestigationFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const completedCount = useMemo(() => {
    let count = 0;
    if (formState.task1_rootGenesisCommitId) count++;
    if (formState.task1_activeHeadBranch) count++;
    if (formState.task1_activeHeadCommitId) count++;
    if (formState.task1_featureBranchTipId) count++;
    if (formState.task2_directParentOfC2) count++;
    if (formState.task2_c4AncestryChain.length > 0) count++;
    if (formState.task2_arrowDirection) count++;
    if (formState.task3_commonAncestorBaseCommit) count++;
    if (formState.task3_branchStorageType) count++;
    if (formState.task4_mergeCommitId) count++;
    if (formState.task4_mergeParent1Id && formState.task4_mergeParent2Id) count++;
    if (formState.task5_dagAcyclicGuarantee) count++;
    if (formState.task5_unpushedLocalCommits.length > 0) count++;
    return count;
  }, [formState]);

  const totalFields = 13;
  const progressPercent = Math.round((completedCount / totalFields) * 100);

  const handleSubmit = () => {
    const payload = {
      root_commit: formState.task1_rootGenesisCommitId,
      active_branch: formState.task1_activeHeadBranch,
      head_commit: formState.task1_activeHeadCommitId,
      feature_branch_tip: formState.task1_featureBranchTipId,
      direct_parent_c2: formState.task2_directParentOfC2,
      c4_ancestry_chain: formState.task2_c4AncestryChain,
      arrow_direction: formState.task2_arrowDirection,
      common_ancestor: formState.task3_commonAncestorBaseCommit,
      branch_storage_type: formState.task3_branchStorageType,
      merge_commit_id: formState.task4_mergeCommitId,
      merge_parents: [
        formState.task4_mergeParent1Id,
        formState.task4_mergeParent2Id,
      ].filter(Boolean),
      dag_acyclic_guarantee: formState.task5_dagAcyclicGuarantee,
      unpushed_commits: formState.task5_unpushedLocalCommits,
    };

    onSubmitPayload(JSON.stringify(payload, null, 2));
  };

  const handleResetForm = () => {
    setFormState(INITIAL_INVESTIGATION_FORM_STATE);
  };

  return (
    <div className={cn("flex flex-col w-full min-h-screen bg-zinc-950 text-foreground space-y-6 pb-16", className)}>
      {/* Exercise Mission Header */}
      <header className="rounded-2xl border border-border/80 bg-zinc-900/60 p-5 md:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary/20 text-primary border border-primary/40">
                EXE-00-04
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                MOD-00 Digital Foundations
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                DEV-00: Advanced Practicing &rarr; Mastered
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Terminal className="w-3 h-3 line-through" />
                Zero-CLI Assessment
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                Est: {estimatedMinutes}m
              </span>
              {activeAttemptState && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {activeAttemptState}
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {exerciseTitle}
            </h1>

            <p className="text-xs md:text-sm text-zinc-400 max-w-4xl">
              Incident #5012: The Helios core engineering team has lost visual graph clarity.
              Analyze the repository topology below, trace commit ancestry chains, identify the 3-way merge junction,
              and record your diagnostic findings in the forensic investigation station.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-mono text-zinc-400">Diagnostic Checkpoints</div>
              <div className="text-lg font-bold font-mono text-primary">
                {completedCount} / {totalFields}{" "}
                <span className="text-xs text-zinc-400 font-normal">({progressPercent}%)</span>
              </div>
            </div>
            
            <div className="w-36 h-2 bg-zinc-800 rounded-full overflow-hidden border border-border/40">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Validation Results Banner (if evaluated) */}
      {validationOutput && (
        <div
          className={cn(
            "rounded-2xl border p-5 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 duration-300",
            validationOutput.passed
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/40 border-red-500/40 text-red-200"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {validationOutput.passed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base text-white">
                    {validationOutput.passed ? "Competency Mastered: Passed (>= 90%)" : "Diagnostic Checkpoint Incomplete"}
                  </h2>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded text-xs font-mono font-bold",
                      validationOutput.passed ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    )}
                  >
                    Score: {validationOutput.score}%
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  {validationOutput.passed
                    ? "All 14 DAG and version control topological invariants verified. Repository is fully diagnosed."
                    : "Some topological assertions do not match repository ground truth. Check the feedback below."}
                </p>
              </div>
            </div>

            {validationOutput.passed && (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={onCompleteExercise}
                  disabled={isCompleting || isCompleted}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 shadow-md flex items-center gap-1.5"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Recording Evidence...
                    </>
                  ) : isCompleted ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Competency Recorded
                    </>
                  ) : (
                    <>
                      <Award className="w-3.5 h-3.5" />
                      Finalize & Record Competency
                    </>
                  )}
                </Button>

                <Link
                  href="/lessons/les-00-05"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 shadow-md transition-all"
                >
                  <span>Proceed to LES-00-05</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Test cases breakdown grid */}
          {validationOutput.feedback && validationOutput.feedback.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 block">
                Verification Suite Breakdown (14 Checks)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {validationOutput.feedback.map((t, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-lg border text-xs font-mono flex items-start gap-2.5",
                      t.passed
                        ? "bg-emerald-950/60 border-emerald-500/30 text-emerald-300"
                        : "bg-red-950/60 border-red-500/30 text-red-300"
                    )}
                  >
                    {t.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
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
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        {t.message || (t.passed ? "Topological invariant verified" : "Incorrect assertion")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation View Switcher */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeTab === "graph" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("graph")}
            className="text-xs flex items-center gap-2"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Interactive DAG Canvas</span>
          </Button>

          <Button
            variant={activeTab === "timelines" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("timelines")}
            className="text-xs flex items-center gap-2"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Branch Timeline Explorer</span>
          </Button>

          <Button
            variant={activeTab === "merge" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("merge")}
            className="text-xs flex items-center gap-2"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>3-Way Merge Analyzer</span>
          </Button>

          <Button
            variant={activeTab === "investigation" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("investigation")}
            className="text-xs flex items-center gap-2 md:hidden"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investigation Form</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetForm}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Main Multi-Column Interactive Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visualizers (7 Cols) */}
        <div className={cn("space-y-6", activeTab === "investigation" ? "hidden lg:block lg:col-span-7" : "col-span-1 lg:col-span-7")}>
          {activeTab === "graph" && (
            <CommitGraphCanvas
              commits={MOCK_HELIOS_COMMITS}
              selectedCommitId={selectedCommitId}
              onSelectCommit={handleSelectCommitById}
            />
          )}

          {activeTab === "timelines" && (
            <BranchTimelineViewer
              commits={MOCK_HELIOS_COMMITS}
              branches={MOCK_HELIOS_BRANCHES}
              selectedCommitId={selectedCommitId}
              onSelectCommit={handleSelectCommitById}
            />
          )}

          {activeTab === "merge" && (
            <MergeInvestigationPanel
              commits={MOCK_HELIOS_COMMITS}
              onSelectCommit={handleSelectCommitById}
            />
          )}

          {/* Commit Metadata Inspector (Under graph) */}
          <CommitMetadataInspector
            commit={selectedCommit}
            onClose={() => setSelectedCommitId(null)}
          />
        </div>

        {/* Right Column: Diagnostic Inquiry Workspace (5 Cols) */}
        <div className={cn("space-y-4", activeTab === "investigation" ? "col-span-1 lg:col-span-5" : "col-span-1 lg:col-span-5")}>
          <DagAnalysisWorkspace
            formState={formState}
            onChange={handleFormChange}
            commits={MOCK_HELIOS_COMMITS}
            onSelectCommit={handleSelectCommitById}
          />

          {/* Submission Action Card */}
          <div className="rounded-2xl border border-primary/40 bg-zinc-900/90 p-5 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Ready for Evaluation</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Transmits your 14 topological assertions to the assessment state machine.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || completedCount === 0}
              size="default"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Diagnostic Report</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
