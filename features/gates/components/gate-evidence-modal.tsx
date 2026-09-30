"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, FileCode } from "lucide-react";
import { collectGateEvidenceAction } from "../actions/gate-actions";
import type { UserGateStatusView } from "../types";

export interface GateEvidenceModalProps {
  gateView: UserGateStatusView | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GateEvidenceModal({
  gateView,
  isOpen,
  onClose,
  onSuccess,
}: GateEvidenceModalProps) {
  const [evidenceType, setEvidenceType] = useState("project_repository");
  const [evidenceReference, setEvidenceReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !gateView) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceReference.trim()) {
      setErrorMessage("Please enter an evidence link or artifact reference.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await collectGateEvidenceAction({
        userId: "", // Inferred by session
        gateId: gateView.gate.id,
        attemptId: gateView.activeAttempt?.id,
        evidenceType,
        evidenceReference: evidenceReference.trim(),
        metadata: {
          submittedVia: "web_ui",
          gateLevel: gateView.gate.gateLevel,
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to submit evidence.");
        return;
      }

      setEvidenceReference("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-background/95 p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold text-foreground font-display">
                Submit Gate Evidence
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Provide traceable proof for {gateView.gate.name}. Evidence is permanently archived for audit validation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground">Evidence Type</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="project_repository">GitHub Repository / PR Link</option>
              <option value="deployment_url">Live Deployment / Preview URL</option>
              <option value="architecture_diagram">System Architecture Design Doc</option>
              <option value="test_suite_run">Automated Test Execution Suite</option>
              <option value="schema_contract">API / Database Contract Spec</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted-foreground">
              Evidence Reference / URL
            </label>
            <Input
              type="text"
              placeholder="e.g. https://github.com/user/project or https://preview.domain.app"
              value={evidenceReference}
              onChange={(e) => setEvidenceReference(e.target.value)}
              className="h-9 text-xs font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="font-mono text-xs gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Proof"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
