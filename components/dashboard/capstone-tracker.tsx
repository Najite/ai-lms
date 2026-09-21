"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  FolderGit2,
  Github,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Terminal,
  Cpu,
  TrendingUp,
  Layers,
  Sparkles,
  Zap,
  Briefcase,
  FileCheck,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useCurriculumProgress } from "@/lib/progress-tracker";
import { PRODUCTION_CAPSTONES_2026, ProductionCapstoneSpec } from "@/lib/production-capstones";
import { formatPhaseTitle } from "@/lib/curriculum-numbering";

export interface CapstoneProject extends ProductionCapstoneSpec {
  id: string;
  status: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED";
  repoUrl?: string;
  lastScore?: number;
}

export function CapstoneTracker() {
  const [capstones, setCapstones] = React.useState<CapstoneProject[]>([]);
  const [selectedCapstone, setSelectedCapstone] = React.useState<CapstoneProject | null>(null);
  const [repoInput, setRepoInput] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [feedback, setFeedback] = React.useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const { completedLessons } = useCurriculumProgress();

  // Fetch real phases and nodes from Supabase, then merge with 2026 production specifications
  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const [phasesRes, nodesRes] = await Promise.all([
        supabase.from("curriculum_phases").select("*").order("order_index", { ascending: true }),
        supabase.from("curriculum_nodes").select("id, title, slug, phase_id, xp_reward").order("id", { ascending: true }),
      ]);

      if (isMounted) {
        const phases = phasesRes.data || [];
        const nodes = nodesRes.data || [];

        // Build capstones by joining each phase with its 2026 production specification
        const items: CapstoneProject[] = phases.map((p) => {
          const pNodes = nodes.filter((n) => n.phase_id === p.id);
          const spec = PRODUCTION_CAPSTONES_2026.find((s) => s.phaseId === p.order_index) || PRODUCTION_CAPSTONES_2026[0];
          const displayPhaseNum = p.order_index + 1;

          // Check real completion status based on database lesson IDs
          const completedInPhase = pNodes.filter((n) => completedLessons.includes(n.id)).length;
          const status: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED" =
            completedInPhase === pNodes.length && pNodes.length > 0
              ? "VERIFIED"
              : completedInPhase > 0
              ? "IN_PROGRESS"
              : "NOT_STARTED";

          return {
            ...spec,
            id: `cap-${String(displayPhaseNum).padStart(2, "0")}`,
            phaseId: p.order_index,
            displayPhaseNumber: displayPhaseNum,
            phaseName: formatPhaseTitle(p.order_index, p.title),
            status,
            repoUrl: undefined,
            lastScore: status === "VERIFIED" ? 100 : undefined,
          };
        });

        setCapstones(items);
        if (items.length > 0) {
          setSelectedCapstone(items[0]);
          setRepoInput(items[0].repoUrl || "");
        }
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [completedLessons]);

  const handleSelectCapstone = (cap: CapstoneProject) => {
    setSelectedCapstone(cap);
    setRepoInput(cap.repoUrl || "");
    setFeedback(null);
  };

  const handleVerifyRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim() || !selectedCapstone) return;

    setIsVerifying(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/capstone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoInput,
          phaseId: String(selectedCapstone.phaseId),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({
          success: true,
          message: data.message || "Repository verified against grading harness.",
          details: data.details,
        });
        setCapstones((prev) =>
          prev.map((c) =>
            c.id === selectedCapstone.id
              ? { ...c, status: "VERIFIED", repoUrl: repoInput, lastScore: 100 }
              : c
          )
        );
      } else {
        setFeedback({
          success: false,
          message: data.error || "Verification failed. Check repository accessibility.",
        });
      }
    } catch (err: any) {
      setFeedback({
        success: false,
        message: err.message || "Failed to reach verification endpoint.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-32 bg-[#08090a] border border-[#23252a] rounded-xl font-mono text-sm text-[#8a8f98] gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#5e6ad2]" />
        <span>Loading 2026 production capstone portfolio architecture...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-[#08090a] border border-[#23252a]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusChip status="brand" label="2026 PRODUCTION PORTFOLIO STANDARDS" />
            <span className="text-xs font-mono text-[#8a8f98]">
              {capstones.length} High-Employability Capstones
            </span>
            <span className="text-[#383b42]">•</span>
            <span className="text-xs font-mono text-[#10b981]">
              Zero Generic Clones • Zero Re-Invented Wheels
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f7f8f8] tracking-tight mt-1">
            Production Engineering Portfolio & Employability Hub
          </h2>
          <p className="text-xs font-mono text-[#8a8f98] mt-1 max-w-3xl leading-relaxed">
            Every project mirrors real unicorn infrastructure (Datadog, Modal, vLLM, Cursor, Temporal, Stripe).
            Evaluated against automated CI test harnesses, stress loads, and architectural defenses.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3 py-2 rounded-lg bg-[#0f1011] border border-[#23252a] text-[#8a8f98] space-y-1">
            <div className="text-[10px] text-[#565961] uppercase tracking-wider">Average Employability</div>
            <div className="text-[#10b981] font-bold text-sm">96.8% In-Demand</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#0f1011] border border-[#23252a] text-[#8a8f98] space-y-1">
            <div className="text-[10px] text-[#565961] uppercase tracking-wider">Portfolio Defense</div>
            <div className="text-[#f7f8f8] font-bold text-sm">
              {capstones.filter((c) => c.status === "VERIFIED").length} / {capstones.length} Done
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Capstone list */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {capstones.map((cap) => {
            const isSelected = selectedCapstone?.id === cap.id;
            return (
              <div
                key={cap.id}
                onClick={() => handleSelectCapstone(cap)}
                className={cn(
                  "p-4 rounded-xl border text-left cursor-pointer transition-all group",
                  isSelected
                    ? "bg-[#141516] border-[#5e6ad2]/60 shadow-[0_4px_20px_rgba(94,106,210,0.15)]"
                    : "bg-[#08090a] border-[#23252a] hover:bg-[#0e0f11] hover:border-[#383b42]"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-[#5e6ad2] font-semibold">
                      PHASE {String(cap.displayPhaseNumber || cap.phaseId + 1).padStart(2, "0")}
                    </span>
                    {cap.sector && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
                        {cap.sector}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#5e6ad2]/10 text-[#7b87f5] border border-[#5e6ad2]/30">
                      {cap.employabilityBadge}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border font-semibold",
                      cap.status === "VERIFIED"
                        ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                        : cap.status === "IN_PROGRESS"
                        ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                        : "bg-[#16171a] text-[#8a8f98] border-[#23252a]"
                    )}
                  >
                    {cap.status}
                  </span>
                </div>

                <h4
                  className={cn(
                    "text-sm font-semibold transition-colors line-clamp-1",
                    isSelected ? "text-[#f7f8f8]" : "text-[#d0d6e0] group-hover:text-white"
                  )}
                >
                  {cap.title}
                </h4>

                <p className="text-[11px] text-[#8a8f98] line-clamp-2 mt-1 leading-relaxed">
                  {cap.oneLineHook}
                </p>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#1b1c20] text-[10px] font-mono">
                  <span className="text-[#56b6c2] truncate">
                    {cap.industryArchetype}
                  </span>
                  <span className="text-[#10b981] font-semibold shrink-0">
                    {cap.employabilityRating}% Match
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Capstone Inspector & Submission */}
        {selectedCapstone && (
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#23252a]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#5e6ad2]" />
                    <span className="text-xs font-mono text-[#8a8f98]">
                      {selectedCapstone.phaseName}
                    </span>
                    {selectedCapstone.sector && (
                      <>
                        <span className="text-[#383b42]">•</span>
                        <span className="text-xs font-mono text-[#10b981] font-semibold bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                          {selectedCapstone.sector}
                        </span>
                      </>
                    )}
                    <span className="text-[#383b42]">•</span>
                    <span className="text-xs font-mono text-[#5e6ad2] font-semibold">
                      {selectedCapstone.employabilityRating}% Employability Match
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#f7f8f8] tracking-tight">
                    {selectedCapstone.title}
                  </h3>
                </div>

                <span
                  className={cn(
                    "text-xs font-mono px-2.5 py-1 rounded border font-semibold shrink-0 self-start sm:self-auto",
                    selectedCapstone.status === "VERIFIED"
                      ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
                      : selectedCapstone.status === "IN_PROGRESS"
                      ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
                      : "bg-[#16171a] text-[#8a8f98] border-[#23252a]"
                  )}
                >
                  STATUS: {selectedCapstone.status}
                </span>
              </div>

              {/* Enterprise Story & Scenario */}
              {selectedCapstone.storyScenario && (
                <div className="p-4 rounded-lg bg-[#0b0c0e] border border-[#1f2126] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#5e6ad2] uppercase tracking-wider font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Story & Enterprise Scenario</span>
                  </div>
                  <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans">
                    {selectedCapstone.storyScenario}
                  </p>
                </div>
              )}

              {/* Problem to Solve */}
              {selectedCapstone.problemToSolve && (
                <div className="p-4 rounded-lg bg-[#0d0e11] border border-[#23252a] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#f59e0b] uppercase tracking-wider font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>The Engineering Problem to Solve</span>
                  </div>
                  <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans">
                    {selectedCapstone.problemToSolve}
                  </p>
                </div>
              )}

              {/* 2026 Industry Reality Check & Salary Band */}
              <div className="p-4 rounded-lg bg-[#0d0e11] border border-[#23252a] space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
                  <span className="text-[#e5993e] flex items-center gap-1.5 font-semibold">
                    <Briefcase className="w-3.5 h-3.5" />
                    Target Industry Archetype: {selectedCapstone.industryArchetype}
                  </span>
                  <span className="text-[#10b981] font-semibold">
                    {selectedCapstone.salaryBand2026}
                  </span>
                </div>
                <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans">
                  <strong>Engineering Rationale:</strong> {selectedCapstone.whyThisMatters2026}
                </p>
              </div>

              {/* Architecture Breakdown */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#5e6ad2]" />
                  System Architecture Pipeline
                </h5>
                <div className="p-3.5 rounded-lg bg-[#040405] border border-[#23252a] text-xs font-mono text-[#56b6c2] leading-relaxed break-words">
                  {selectedCapstone.systemArchitecture}
                </div>
              </div>

              {/* What to build (Concrete Deliverables) */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#10b981]" />
                  Non-Trivial Engineering Deliverables
                </h5>
                <div className="grid grid-cols-1 gap-2">
                  {selectedCapstone.whatToBuild.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#0b0c0e] border border-[#1f2126] text-xs text-[#d0d6e0] flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Technologies & Automated CI Harness Checks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider">
                    Core Technical Stack
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCapstone.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#101114] border border-[#23252a] text-[11px] font-mono text-[#c1c7d0]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider">
                    Automated Invariant Checks
                  </h5>
                  <ul className="space-y-1 text-[11px] font-mono text-[#8a8f98]">
                    {selectedCapstone.automatedChecks.map((chk, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-[#10b981] mt-0.5 shrink-0" />
                        <span className="text-[#a0a5af]">{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Resume & Portfolio Proof */}
              <div className="p-3.5 rounded-lg bg-[#07080a] border border-[#5e6ad2]/20 space-y-1.5 text-xs font-mono">
                <div className="text-[#5e6ad2] font-semibold flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Resume Proof Bullet (Zero Fluff):</span>
                </div>
                <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans pl-5 italic">
                  &ldquo;{selectedCapstone.portfolioProof.resumeImpactBullet}&rdquo;
                </p>
              </div>

              {/* GitHub Submission Form */}
              <div className="p-4 rounded-lg bg-[#010102] border border-[#23252a] space-y-3">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-[#f7f8f8]" />
                  <span className="text-xs font-mono text-[#f7f8f8] font-semibold">
                    Public GitHub Repository Automated Grader
                  </span>
                </div>
                <p className="text-[11px] text-[#8a8f98]">
                  Enter your repository identifier (e.g. &apos;username/{selectedCapstone.portfolioProof.githubRepoTemplate}&apos;) to verify against the automated CI test harness.
                </p>

                <form onSubmit={handleVerifyRepo} className="flex gap-2">
                  <input
                    type="text"
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    placeholder={`username/${selectedCapstone.portfolioProof.githubRepoTemplate}`}
                    className="flex-1 bg-[#08090a] border border-[#23252a] rounded px-3 py-1.5 text-xs font-mono text-[#f7f8f8] placeholder-[#565961] focus:outline-none focus:border-[#5e6ad2]"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isVerifying || !repoInput.trim()}
                    className="gap-1.5 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white shrink-0"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying CI...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Trigger CI Grader</span>
                      </>
                    )}
                  </Button>
                </form>

                {feedback && (
                  <div
                    className={cn(
                      "p-3.5 rounded-lg border font-mono text-xs space-y-2.5",
                      feedback.success
                        ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                        : "bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 font-semibold">
                      <div className="flex items-center gap-2">
                        {feedback.success ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        <span>{feedback.message}</span>
                      </div>
                      {feedback.details?.overallScore !== undefined && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 border border-current">
                          Score: {feedback.details.overallScore}/100
                        </span>
                      )}
                    </div>

                    {/* Multi-point Grading Rubric Scorecard */}
                    {feedback.details?.checks && feedback.details.checks.length > 0 && (
                      <div className="pt-2 border-t border-current/20 space-y-1.5 text-[11px]">
                        <div className="text-[#8a8f98] uppercase tracking-wider font-bold">
                          Automated CI Grading Scorecard:
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {feedback.details.checks.map((chk: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5"
                            >
                              <div className="flex items-center gap-2">
                                <span className={chk.passed ? "text-[#10b981]" : "text-[#eb5757]"}>
                                  {chk.passed ? "✓" : "✗"}
                                </span>
                                <span className="text-[#f7f8f8]">{chk.name}</span>
                                <span className="text-[#8a8f98] text-[10px]">({chk.details})</span>
                              </div>
                              <span className="text-[#d0d6e0] font-semibold">{chk.score} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {feedback.details && !feedback.details.checks && (
                      <div className="mt-2 text-[11px] text-[#8a8f98] space-y-0.5">
                        <div>Repository: {feedback.details.repo}</div>
                        <div>Stars: {feedback.details.stars}</div>
                        <div>Branch: {feedback.details.defaultBranch}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[#23252a] flex items-center justify-between text-xs font-mono text-[#8a8f98]">
                <span>Automated AST + Load Stress Test + CI Invariants</span>
                <span className="text-[#10b981]">100% Free / Self-Paced</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

