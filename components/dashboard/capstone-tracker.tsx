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
  Trophy,
  Globe,
  Brain,
  Database,
  Server,
  Code2,
} from "lucide-react";
import { useCurriculumCatalog } from "@/lib/curriculum-store";
import { cn } from "@/lib/utils";
import { useCurriculumProgress, saveVerifiedCapstone, getVerifiedCapstones } from "@/lib/progress-tracker";
import {
  PRODUCTION_CAPSTONES_2026,
  ProductionCapstoneSpec,
  COMPREHENSIVE_ENTERPRISE_CAPSTONES,
  ComprehensiveEnterpriseCapstoneSpec,
} from "@/lib/production-capstones";
import { formatPhaseTitle } from "@/lib/curriculum-numbering";

export interface CapstoneProject extends ProductionCapstoneSpec {
  id: string;
  status: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED";
  repoUrl?: string;
  lastScore?: number;
}

/** Stable module-level empties: identity must not change between renders or the
 *  derived `useMemo`s above would recompute on every paint. */
const EMPTY_CAPSTONES: CapstoneProject[] = [];
const EMPTY_OVERRIDE: Partial<CapstoneProject> = {};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE MILESTONE TAB
// ─────────────────────────────────────────────────────────────────────────────
function PhaseMilestonesTab() {
  const [selectedCapstone, setSelectedCapstone] =
    React.useState<CapstoneProject | null>(null);
  const [repoInput, setRepoInput] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  /**
   * Verification results are user actions, so they live in their own state and
   * are merged OVER the derived list. This keeps `capstones` a pure function of
   * (catalog, progress) without ever letting a revalidation wipe a just-verified
   * repository URL.
   */
  const [overrides, setOverrides] = React.useState<Record<string, Partial<CapstoneProject>>>({});

  const { curriculum, isLoading } = useCurriculumCatalog();
  const { completedLessons } = useCurriculumProgress();

  const baseCapstones = React.useMemo(() => {
    if (!curriculum) return EMPTY_CAPSTONES;

    const phases = curriculum.phases;
    const completedSet = new Set(completedLessons);

    return phases.map((p, idx): CapstoneProject => {
      const pNodes = curriculum.nodesByPhase[p.phaseId] || [];
      const spec =
        PRODUCTION_CAPSTONES_2026.find((s) => s.phaseId === idx || s.displayPhaseNumber === p.id) ||
        PRODUCTION_CAPSTONES_2026[0];
      const displayPhaseNum = p.id;

      const completedInPhase = pNodes.filter((n) => completedSet.has(n.id)).length;
      const capId = `cap-${String(displayPhaseNum).padStart(2, "0")}`;
      const verifiedMap = getVerifiedCapstones();
      const verifiedRecord = verifiedMap[capId];

      const status: "VERIFIED" | "IN_PROGRESS" | "NOT_STARTED" = verifiedRecord
        ? "VERIFIED"
        : completedInPhase === pNodes.length && pNodes.length > 0
        ? "VERIFIED"
        : completedInPhase > 0
        ? "IN_PROGRESS"
        : "NOT_STARTED";

      return {
        ...spec,
        id: capId,
        phaseId: p.id - 1,
        displayPhaseNumber: displayPhaseNum,
        phaseName: p.title,
        status,
        repoUrl: verifiedRecord?.repoUrl || undefined,
        lastScore: verifiedRecord
          ? verifiedRecord.score
          : status === "VERIFIED"
          ? 100
          : undefined,
      };
    });
  }, [curriculum, completedLessons]);

  const capstones = React.useMemo(
    () => baseCapstones.map((c) => ({ ...c, ...(overrides[c.id] ?? EMPTY_OVERRIDE) })),
    [baseCapstones, overrides]
  );

  // Keep a valid selection as the list recomputes, without clobbering the user's
  // choice on every progress change (the old effect reset selection to items[0]).
  React.useEffect(() => {
    setSelectedCapstone((current) => {
      if (!current) return capstones[0] ?? null;
      return capstones.find((c) => c.id === current.id) ?? capstones[0] ?? null;
    });
  }, [capstones]);

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
        saveVerifiedCapstone(selectedCapstone.id, repoInput, data.overallScore || 100);
        setFeedback({
          success: true,
          message: data.message || "Repository verified against grading harness and saved.",
          details: data.details,
        });
        setOverrides((prev) => ({
          ...prev,
          [selectedCapstone.id]: {
            status: "VERIFIED",
            repoUrl: repoInput,
            lastScore: data.overallScore || 100,
          },
        }));
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
      <div className="flex items-center justify-center p-24 bg-[#08090a] border border-[#23252a] rounded-xl font-mono text-sm text-[#8a8f98] gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#5e6ad2]" />
        <span>Loading phase capstone portfolio...</span>
      </div>
    );
  }

  return (
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
                    MODULE {String(cap.displayPhaseNumber || cap.phaseId + 1).padStart(2, "0")}
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
                Enter your repository identifier (e.g.
                &apos;username/{selectedCapstone.portfolioProof.githubRepoTemplate}&apos;) to verify
                against the automated CI test harness.
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
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAND ENTERPRISE CAPSTONES TAB
// ─────────────────────────────────────────────────────────────────────────────
const SECTOR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Enterprise Software & Cloud Platforms": {
    bg: "bg-[#5e6ad2]/10",
    text: "text-[#7b87f5]",
    border: "border-[#5e6ad2]/30",
  },
  "Financial Systems & Payment Infrastructure": {
    bg: "bg-[#10b981]/10",
    text: "text-[#10b981]",
    border: "border-[#10b981]/30",
  },
  "Healthcare & Clinical Informatics": {
    bg: "bg-[#ef4444]/10",
    text: "text-[#f87171]",
    border: "border-[#ef4444]/30",
  },
  "Autonomous AI & Intelligent Systems": {
    bg: "bg-[#f59e0b]/10",
    text: "text-[#fbbf24]",
    border: "border-[#f59e0b]/30",
  },
  "Real-Time Communications & Streaming": {
    bg: "bg-[#8b5cf6]/10",
    text: "text-[#a78bfa]",
    border: "border-[#8b5cf6]/30",
  },
};

function getSectorStyle(sector: string) {
  return (
    SECTOR_COLORS[sector] || {
      bg: "bg-[#8a8f98]/10",
      text: "text-[#8a8f98]",
      border: "border-[#8a8f98]/30",
    }
  );
}

function GrandEnterpriseCapstonesTab() {
  const capstones = COMPREHENSIVE_ENTERPRISE_CAPSTONES;
  const [selected, setSelected] =
    React.useState<ComprehensiveEnterpriseCapstoneSpec>(capstones[0]);
  const [repoInput, setRepoInput] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleSelect = (cap: ComprehensiveEnterpriseCapstoneSpec) => {
    setSelected(cap);
    setRepoInput("");
    setFeedback(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setIsVerifying(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/capstone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoInput,
          phaseId: selected.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        saveVerifiedCapstone(selected.id, repoInput, data.overallScore || 100);
        setFeedback({
          success: true,
          message: data.message || "Repository verified against grading harness and saved.",
          details: data.details,
        });
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

  const sectorStyle = getSectorStyle(selected.sector);
  const deliverableCategories = [
    { label: "Frontend", icon: Globe, items: selected.deliverables.frontend, color: "text-[#5e6ad2]" },
    { label: "Backend", icon: Server, items: selected.deliverables.backend, color: "text-[#10b981]" },
    { label: "AI Pipeline", icon: Brain, items: selected.deliverables.aiPipeline, color: "text-[#f59e0b]" },
    { label: "DevOps & CI", icon: Code2, items: selected.deliverables.devOps, color: "text-[#8b5cf6]" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Capstone list */}
      <div className="lg:col-span-4 space-y-2 max-h-[800px] overflow-y-auto pr-1">
        {capstones.map((cap) => {
          const isSelected = selected.id === cap.id;
          const sc = getSectorStyle(cap.sector);
          return (
            <div
              key={cap.id}
              onClick={() => handleSelect(cap)}
              className={cn(
                "p-3.5 rounded-xl border cursor-pointer transition-all group",
                isSelected
                  ? "bg-[#141516] border-[#5e6ad2]/60 shadow-[0_4px_20px_rgba(94,106,210,0.12)]"
                  : "bg-[#08090a] border-[#23252a] hover:bg-[#0e0f11] hover:border-[#383b42]"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-[#5e6ad2] font-bold">
                    #{String(cap.orderIndex).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 rounded border",
                      sc.bg,
                      sc.text,
                      sc.border
                    )}
                  >
                    {cap.sector}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#10b981] font-bold shrink-0">
                  {cap.employabilityRating}%
                </span>
              </div>
              <h4
                className={cn(
                  "text-xs font-semibold transition-colors line-clamp-2 leading-snug",
                  isSelected ? "text-[#f7f8f8]" : "text-[#d0d6e0] group-hover:text-white"
                )}
              >
                {cap.title}
              </h4>
              <p className="text-[10px] text-[#565961] mt-1 font-mono truncate">
                {cap.industryArchetype}
              </p>
            </div>
          );
        })}
      </div>

      {/* Right: Detail panel */}
      <div className="lg:col-span-8">
        <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 shadow-2xl space-y-6 max-h-[800px] overflow-y-auto">
          {/* Header */}
          <div className="pb-4 border-b border-[#23252a] space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Trophy className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-[10px] font-mono text-[#8a8f98] uppercase tracking-wider">
                Grand Enterprise Capstone #{String(selected.orderIndex).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border font-semibold",
                  sectorStyle.bg,
                  sectorStyle.text,
                  sectorStyle.border
                )}
              >
                {selected.sector}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#f7f8f8] tracking-tight leading-tight">
              {selected.title}
            </h3>
            <p className="text-xs text-[#8a8f98] leading-relaxed font-sans">
              {selected.oneLineHook}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono flex-wrap pt-1">
              <span className="text-[#10b981] font-semibold">{selected.salaryBand2026}</span>
              <span className="text-[#565961]">•</span>
              <span className="text-[#7b87f5]">{selected.employabilityRating}% Market Demand</span>
              <span className="text-[#565961]">•</span>
              <span className="text-[#56b6c2]">{selected.industryArchetype}</span>
            </div>
          </div>

          {/* Story */}
          <div className="p-4 rounded-lg bg-[#0b0c0e] border border-[#1f2126] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#5e6ad2] uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Story & Business Problem</span>
            </div>
            <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans">
              {selected.storyScenario}
            </p>
          </div>

          {/* Problem to Solve */}
          <div className="p-4 rounded-lg bg-[#0d0e11] border border-[#23252a] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#f59e0b] uppercase tracking-wider font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>The Engineering Challenge</span>
            </div>
            <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans">
              {selected.problemToSolve}
            </p>
          </div>

          {/* Engineering Rationale */}
          <div className="p-4 rounded-lg bg-[#0d0e11] border border-[#23252a] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] uppercase tracking-wider font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Why This Matters in 2026</span>
            </div>
            <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans">
              {selected.whyThisMatters2026}
            </p>
          </div>

          {/* System Architecture */}
          <div className="space-y-2">
            <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#5e6ad2]" />
              System Architecture Pipeline
            </h5>
            <div className="p-3.5 rounded-lg bg-[#040405] border border-[#23252a] text-xs font-mono text-[#56b6c2] leading-relaxed break-words">
              {selected.systemArchitecture}
            </div>
          </div>

          {/* Tech Stacks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Frontend Stack", items: selected.frontendStack, color: "text-[#5e6ad2]" },
              { label: "Backend Stack", items: selected.backendStack, color: "text-[#10b981]" },
              { label: "AI Stack", items: selected.aiStack, color: "text-[#f59e0b]" },
            ].map(({ label, items, color }) => (
              <div key={label} className="space-y-2">
                <h5 className={cn("text-[10px] font-mono uppercase tracking-wider font-semibold", color)}>
                  {label}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {items.map((t, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-[#101114] border border-[#23252a] text-[10px] font-mono text-[#c1c7d0]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#10b981]" />
              Enterprise Deliverables — By Engineering Discipline
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deliverableCategories.map(({ label, icon: Icon, items, color }) => (
                <div key={label} className="p-3 rounded-lg bg-[#0b0c0e] border border-[#1f2126] space-y-2">
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider", color)}>
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#d0d6e0]">
                        <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0 opacity-60" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Checks */}
          <div className="space-y-2">
            <h5 className="text-xs font-mono text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              Automated CI Invariant Checks
            </h5>
            <ul className="space-y-2">
              {selected.automatedChecks.map((chk, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#040505] border border-[#1a2f24] text-[11px] text-[#a0a5af] font-mono flex items-start gap-2"
                >
                  <Check className="w-3 h-3 text-[#10b981] mt-0.5 shrink-0" />
                  <span>{chk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume Proof */}
          <div className="p-3.5 rounded-lg bg-[#07080a] border border-[#5e6ad2]/20 space-y-1.5 text-xs font-mono">
            <div className="text-[#5e6ad2] font-semibold flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Resume Proof Bullet (Zero Fluff):</span>
            </div>
            <p className="text-xs text-[#d0d6e0] leading-relaxed font-sans pl-5 italic">
              &ldquo;{selected.portfolioProof.resumeImpactBullet}&rdquo;
            </p>
          </div>

          {/* GitHub Submission */}
          <div className="p-4 rounded-lg bg-[#010102] border border-[#23252a] space-y-3">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-[#f7f8f8]" />
              <span className="text-xs font-mono text-[#f7f8f8] font-semibold">
                Public GitHub Repository Automated Grader
              </span>
            </div>
            <p className="text-[11px] text-[#8a8f98]">
              Enter your repository (e.g. &apos;username/{selected.portfolioProof.githubRepoTemplate}&apos;) to trigger automated CI checks.
            </p>

            <form onSubmit={handleVerify} className="flex gap-2">
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder={`username/${selected.portfolioProof.githubRepoTemplate}`}
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
                    <span>Verifying...</span>
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
                  "p-3.5 rounded-lg border font-mono text-xs space-y-2",
                  feedback.success
                    ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                    : "bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]"
                )}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {feedback.success ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED COMPONENT WITH TABS
// ─────────────────────────────────────────────────────────────────────────────
export function CapstoneTracker() {
  const [activeTab, setActiveTab] = React.useState<"phase" | "grand">("phase");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-[#08090a] border border-[#23252a]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusChip status="brand" label="2026 PRODUCTION PORTFOLIO STANDARDS" />
            <span className="text-xs font-mono text-[#8a8f98]">
              14 Module Milestones · 10 Grand Enterprise Capstones
            </span>
            <span className="text-[#383b42]">•</span>
            <span className="text-xs font-mono text-[#10b981]">
              Zero Generic Clones · Zero Re-Invented Wheels
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#f7f8f8] tracking-tight mt-1">
            Production Engineering Portfolio & Employability Hub
          </h2>
          <p className="text-xs font-mono text-[#8a8f98] mt-1 max-w-3xl leading-relaxed">
            Module milestones build core skills progressively. Grand enterprise capstones synthesize the entire curriculum into
            deployable, AI-powered, enterprise-grade web platforms that reflect real industry systems.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3 py-2 rounded-lg bg-[#0f1011] border border-[#23252a] text-[#8a8f98] space-y-1">
            <div className="text-[10px] text-[#565961] uppercase tracking-wider">Avg Employability</div>
            <div className="text-[#10b981] font-bold text-sm">97.2% In-Demand</div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#0f1011] border border-[#23252a] text-[#8a8f98] space-y-1">
            <div className="text-[10px] text-[#565961] uppercase tracking-wider">Enterprise Capstones</div>
            <div className="text-[#f7f8f8] font-bold text-sm">
              {COMPREHENSIVE_ENTERPRISE_CAPSTONES.length} Total Projects
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#08090a] border border-[#23252a] w-full sm:w-fit">
        <button
          onClick={() => setActiveTab("phase")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all",
            activeTab === "phase"
              ? "bg-[#5e6ad2] text-white shadow-[0_2px_8px_rgba(94,106,210,0.4)]"
              : "text-[#8a8f98] hover:text-[#d0d6e0] hover:bg-[#101114]"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          Module Milestones
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-bold",
            activeTab === "phase" ? "bg-white/20 text-white" : "bg-[#23252a] text-[#565961]"
          )}>8</span>
        </button>
        <button
          onClick={() => setActiveTab("grand")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all",
            activeTab === "grand"
              ? "bg-[#5e6ad2] text-white shadow-[0_2px_8px_rgba(94,106,210,0.4)]"
              : "text-[#8a8f98] hover:text-[#d0d6e0] hover:bg-[#101114]"
          )}
        >
          <Trophy className="w-3.5 h-3.5" />
          Grand Enterprise Capstones
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-bold",
            activeTab === "grand" ? "bg-white/20 text-white" : "bg-[#23252a] text-[#565961]"
          )}>10</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "phase" ? <PhaseMilestonesTab /> : <GrandEnterpriseCapstonesTab />}
    </div>
  );
}
