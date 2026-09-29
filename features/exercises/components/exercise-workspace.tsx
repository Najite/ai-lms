"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Award,
  FileCheck,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Check,
  Copy,
} from "lucide-react";
import { useExerciseDetail } from "../hooks/use-exercises";
import { ExerciseStatusBadge } from "./exercise-status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ExerciseWorkspaceProps {
  slug: string;
}

export function ExerciseWorkspace({ slug }: ExerciseWorkspaceProps) {
  const {
    exercise,
    attempts,
    activeAttempt,
    latestValidationOutput,
    completion,
    evidence,
    codeBuffer,
    setCodeBuffer,
    isLoading,
    isStartingAttempt,
    isSubmitting,
    isCompleting,
    errorMessage,
    startAttempt,
    submitSolution,
    completeExercise,
  } = useExerciseDetail(slug);

  const [activeTab, setActiveTab] = useState<"instructions" | "competencies" | "attempts">("instructions");
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Terminal className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground font-mono">Initializing Exercise Environment...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Card className="max-w-md p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
          <h2 className="text-lg font-bold">Exercise Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {errorMessage || "The requested exercise could not be located."}
          </p>
          <Button asChild variant="outline">
            <Link href="/exercises">Back to Exercise Explorer</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const isCompleted = !!completion;
  const isAttemptCompleted = activeAttempt?.state === "completed";
  const isValidatedPassed =
    latestValidationOutput?.passed === true &&
    (activeAttempt?.state === "validated" || activeAttempt?.state === "in_progress");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeBuffer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetStarter = () => {
    setCodeBuffer(exercise.starterCode);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status Header */}
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
            <span className="font-medium text-foreground">{exercise.category.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {exercise.title}
            </h1>
            <ExerciseStatusBadge
              state={isCompleted ? "completed" : activeAttempt?.state || "available"}
              isCompleted={isCompleted}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border/70 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Est: {exercise.estimatedMinutes}m</span>
          </div>
          {activeAttempt && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border/70 text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              <span>Attempt #{activeAttempt.attemptNumber}</span>
            </div>
          )}
          {completion && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Score: {completion.score}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Two-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        {/* Left Column: Instructions, Competencies, Attempts */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-secondary/40 border border-border/60 rounded-lg">
            <button
              onClick={() => setActiveTab("instructions")}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                activeTab === "instructions"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileCheck className="h-3.5 w-3.5" />
              Instructions
            </button>
            <button
              onClick={() => setActiveTab("competencies")}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                activeTab === "competencies"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Award className="h-3.5 w-3.5" />
              Competencies
            </button>
            <button
              onClick={() => setActiveTab("attempts")}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                activeTab === "attempts"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              History ({attempts.length})
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="flex-1 bg-card/60 border border-border/70 rounded-xl p-5 backdrop-blur-md overflow-y-auto space-y-4 max-h-[600px]">
            {activeTab === "instructions" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Objective
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {exercise.description}
                  </p>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Implementation Requirements
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-xs leading-relaxed whitespace-pre-line text-foreground/80 bg-background/50 p-4 rounded-lg border border-border/40 font-mono">
                    {exercise.instructions}
                  </div>
                </div>

                {exercise.validationRules && (
                  <div className="border-t border-border/50 pt-4 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Automated Verification Criteria
                    </h3>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {exercise.validationRules.min_length ? (
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary" />
                          <span>Minimum code length: {exercise.validationRules.min_length} characters</span>
                        </li>
                      ) : null}
                      {exercise.validationRules.required_patterns?.map((pat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-primary" />
                          <span>Required token: <code className="font-mono text-foreground font-semibold">&apos;{pat}&apos;</code></span>
                        </li>
                      ))}
                      {exercise.validationRules.forbidden_patterns?.map((pat, i) => (
                        <li key={i} className="flex items-center gap-2 text-destructive/80">
                          <XCircle className="h-3 w-3" />
                          <span>Prohibited construct: <code className="font-mono font-semibold">&apos;{pat}&apos;</code></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "competencies" && (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground">
                  Completing this exercise generates verifiable evidence and reinforces the following competencies:
                </div>

                <div className="space-y-3">
                  {exercise.competencies.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3.5 rounded-lg border border-border/60 bg-background/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
                            {comp.code}
                          </span>
                          <span className="text-xs font-semibold">{comp.title}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                          {comp.level}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1 border-t border-border/30">
                        <span>Reinforcement Weight</span>
                        <span className="font-mono font-bold text-foreground">{comp.weight}x multiplier</span>
                      </div>
                    </div>
                  ))}
                </div>

                {evidence.length > 0 && (
                  <div className="border-t border-border/50 pt-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Preserved Evidence Records ({evidence.length})
                    </h4>
                    <div className="space-y-2">
                      {evidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-xs text-foreground/90 space-y-1"
                        >
                          <p>{ev.summary}</p>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Recorded {new Date(ev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "attempts" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Total Attempts: {attempts.length}
                    {exercise.maxAttempts ? ` / Max: ${exercise.maxAttempts}` : " (Unlimited)"}
                  </span>
                  {!activeAttempt && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startAttempt}
                      disabled={isStartingAttempt}
                      className="text-xs h-7"
                    >
                      Start New Attempt
                    </Button>
                  )}
                </div>

                {attempts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No attempts recorded yet. Click &apos;Start Attempt&apos; or submit code to begin.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {attempts.map((att) => (
                      <div
                        key={att.id}
                        className={cn(
                          "p-3 rounded-lg border text-xs space-y-1 transition-all",
                          att.id === activeAttempt?.id
                            ? "bg-primary/5 border-primary/40 shadow-sm"
                            : "bg-background/40 border-border/50"
                        )}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-foreground">
                            Attempt #{att.attemptNumber}
                          </span>
                          <ExerciseStatusBadge state={att.state} />
                        </div>
                        <div className="text-[11px] text-muted-foreground flex justify-between">
                          <span>Started: {new Date(att.startedAt).toLocaleTimeString()}</span>
                          {att.completedAt && (
                            <span className="text-emerald-400">
                              Completed: {new Date(att.completedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Live Validation Console */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between p-2 px-3 bg-secondary/50 border border-border/60 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono font-semibold text-foreground">
                solution.ts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetStarter}
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                title="Reset to starter code"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCode}
                className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Monospaced Code Textarea */}
          <div className="relative -mt-4">
            <textarea
              value={codeBuffer}
              onChange={(e) => setCodeBuffer(e.target.value)}
              placeholder="// Write your solution here..."
              rows={16}
              spellCheck={false}
              className="w-full rounded-b-xl border border-border/70 bg-[#0c1017] p-4 font-mono text-xs leading-relaxed text-emerald-300 placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
            />
          </div>

          {/* Action Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-card/60 border border-border/70">
            <div className="text-xs text-muted-foreground">
              {activeAttempt ? (
                <span>
                  Active Session: <strong className="text-foreground">Attempt #{activeAttempt.attemptNumber}</strong> ({activeAttempt.state})
                </span>
              ) : (
                <span>No active attempt initialized.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => submitSolution()}
                disabled={isSubmitting || isCompleting}
                className="gap-1.5 font-semibold text-xs h-9 bg-primary hover:bg-primary/90"
              >
                <Play className="h-3.5 w-3.5" />
                {isSubmitting ? "Evaluating..." : "Run & Submit Solution"}
              </Button>

              {isValidatedPassed && !isAttemptCompleted && (
                <Button
                  onClick={completeExercise}
                  disabled={isCompleting}
                  className="gap-1.5 font-semibold text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isCompleting ? "Finalizing..." : "Complete Exercise"}
                </Button>
              )}
            </div>
          </div>

          {/* Validation Output Console */}
          {latestValidationOutput && (
            <div
              className={cn(
                "rounded-xl border p-4 space-y-3 transition-all",
                latestValidationOutput.passed
                  ? "border-emerald-500/40 bg-emerald-950/20"
                  : "border-destructive/40 bg-destructive/10"
              )}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  {latestValidationOutput.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-xs font-bold tracking-tight">
                    {latestValidationOutput.passed
                      ? "Validation Passed (Ready to Complete)"
                      : "Validation Criteria Unmet"}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-muted-foreground">
                    Time: {latestValidationOutput.execution_time_ms}ms
                  </span>
                  <span
                    className={cn(
                      "font-bold px-2 py-0.5 rounded border",
                      latestValidationOutput.passed
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-destructive/20 text-destructive border-destructive/30"
                    )}
                  >
                    Score: {latestValidationOutput.score}%
                  </span>
                </div>
              </div>

              {/* Feedback Checks */}
              <div className="space-y-1.5">
                {latestValidationOutput.feedback.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                  >
                    {item.passed ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        item.passed
                          ? "text-muted-foreground"
                          : "text-foreground font-medium"
                      }
                    >
                      {item.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
