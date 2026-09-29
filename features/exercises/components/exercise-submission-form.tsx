"use client";

import React, { useState } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ValidationResultOutput } from "../types";

export interface ExerciseSubmissionFormProps {
  code: string;
  starterCode: string;
  isSubmitting: boolean;
  isCompleted: boolean;
  hasActiveAttempt: boolean;
  validationOutput?: ValidationResultOutput | null;
  onCodeChange: (code: string) => void;
  onSubmit: () => void;
  onStartAttempt?: () => void;
}

export function ExerciseSubmissionForm({
  code,
  starterCode,
  isSubmitting,
  isCompleted,
  hasActiveAttempt,
  validationOutput,
  onCodeChange,
  onSubmit,
  onStartAttempt,
}: ExerciseSubmissionFormProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetStarter = () => {
    onCodeChange(starterCode);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono font-medium text-foreground">solution.ts</span>
          <Badge variant="outline" className="text-[10px] font-mono py-0 h-4">
            TypeScript / Zod
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-7 px-2 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetStarter}
            disabled={isSubmitting || !hasActiveAttempt}
            className="h-7 px-2 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Code Textarea / Editor */}
      <div className="relative flex-1 min-h-[340px] rounded-b-xl overflow-hidden border border-border/60 bg-card/60">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="// Write your code solution here..."
          disabled={isSubmitting || !hasActiveAttempt || isCompleted}
          aria-label="Exercise solution code editor"
          spellCheck={false}
          className="w-full h-full min-h-[340px] p-4 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none leading-relaxed"
        />

        {!hasActiveAttempt && !isCompleted && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 text-center">
            <div className="space-y-3 max-w-sm">
              <AlertCircle className="mx-auto h-8 w-8 text-primary/80" />
              <h4 className="text-sm font-bold text-foreground">Attempt Required</h4>
              <p className="text-xs text-muted-foreground">
                You must initialize an exercise attempt before editing code or submitting solutions.
              </p>
              {onStartAttempt && (
                <Button size="sm" onClick={onStartAttempt} className="gap-1.5 font-mono text-xs">
                  <Play className="h-3.5 w-3.5" />
                  <span>Start Exercise Attempt</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-xs text-muted-foreground font-mono">
          {code.length} characters
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !hasActiveAttempt || isCompleted || code.trim().length === 0}
          className="gap-2 font-mono text-xs font-semibold px-5"
        >
          {isSubmitting ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              <span>Submit & Validate</span>
            </>
          )}
        </Button>
      </div>

      {/* Validation Feedback Report */}
      {validationOutput && (
        <Card
          className={cn(
            "p-4 border transition-all mt-4",
            validationOutput.passed
              ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
              : "bg-rose-950/20 border-rose-500/40 text-rose-300"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {validationOutput.passed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-400" />
              )}
              <h4 className="text-sm font-bold font-mono">
                {validationOutput.passed
                  ? "All Validation Rules Passed"
                  : "Validation Criteria Failed"}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-xs px-2.5 py-0.5",
                  validationOutput.passed
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                    : "border-rose-500/40 text-rose-400 bg-rose-500/10"
                )}
              >
                Score: {validationOutput.score}%
              </Badge>
              <span className="text-[11px] text-muted-foreground font-mono">
                {validationOutput.execution_time_ms}ms
              </span>
            </div>
          </div>

          {/* Feedback items */}
          <div className="space-y-2 text-xs">
            {validationOutput.feedback.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-2 p-2 rounded-lg border",
                  item.passed
                    ? "bg-emerald-950/30 border-emerald-500/20 text-emerald-200"
                    : "bg-rose-950/30 border-rose-500/20 text-rose-200"
                )}
              >
                {item.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold font-mono">{item.rule}</div>
                  <div className="text-muted-foreground text-[11px] mt-0.5">{item.message}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
