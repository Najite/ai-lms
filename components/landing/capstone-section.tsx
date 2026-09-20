"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Github,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  Terminal,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CapstoneSection() {
  const [repoUrl, setRepoUrl] = React.useState("torvalds/linux");
  const [selectedPhase, setSelectedPhase] = React.useState("1");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationResult, setVerificationResult] = React.useState<{
    success: boolean;
    message: string;
    details?: {
      repo: string;
      workflowFound: boolean;
      stars: number;
      defaultBranch: string;
    };
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch("/api/capstone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          phaseId: selectedPhase,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setVerificationResult({
          success: true,
          message: data.message || "Repository verified successfully.",
          details: data.details,
        });
      } else {
        setVerificationResult({
          success: false,
          message: data.error || "Verification failed.",
          details: data.details,
        });
      }
    } catch (err: any) {
      setVerificationResult({
        success: false,
        message: err.message || "Network error while validating repository.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section id="capstones" className="py-24 border-t border-[#23252a] bg-[#010102]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <StatusChip status="brand" label="TAMPER-PROOF VERIFICATION" />
              <span className="text-xs font-mono text-[#8a8f98]">22 Industry Capstones</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold text-[#f7f8f8] tracking-tight">
              Real Repositories. Real CI/CD. No Multiple-Choice Quizzes.
            </h2>

            <p className="text-base text-[#8a8f98] leading-relaxed">
              Unlike traditional platforms that grade on simplistic multiple-choice quizzes, every phase concludes with
              a production-grade capstone project developed in your own GitHub repository.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[#0f1011] border border-[#23252a] text-[#10b981] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#f7f8f8]">Tamper-Proof GitHub Actions Runner</h4>
                  <p className="text-xs text-[#8a8f98] mt-1">
                    Grading workflows execute in clean ephemeral runners with secret HMAC webhook callbacks. Students cannot spoof test outputs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[#0f1011] border border-[#23252a] text-[#5e6ad2] mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#f7f8f8]">Strict Resource & Memory Profiling</h4>
                  <p className="text-xs text-[#8a8f98] mt-1">
                    Valgrind, ASan (AddressSanitizer), and throughput benchmarks enforce zero memory leaks and deterministic O(1)/O(log N) constraints.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-[#0f1011] border border-[#23252a] text-[#f59e0b] mt-0.5">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#f7f8f8]">Public Portfolio That Speaks For Itself</h4>
                  <p className="text-xs text-[#8a8f98] mt-1">
                    Your code resides on your personal GitHub profile with commit history, PRs, and verifiable CI badges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right interactive verification box */}
          <div className="lg:col-span-6">
            <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#23252a] mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#5e6ad2]" />
                  <span className="text-xs font-mono text-[#f7f8f8]">CAPSTONE_VERIFIER // v1.2</span>
                </div>
                <span className="text-[11px] font-mono text-[#10b981]">Online // Ready</span>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#8a8f98] mb-1.5">
                    SELECT PHASE CAPSTONE
                  </label>
                  <select
                    value={selectedPhase}
                    onChange={(e) => setSelectedPhase(e.target.value)}
                    className="w-full bg-[#0f1011] border border-[#23252a] rounded-md px-3 py-2 text-xs text-[#f7f8f8] font-mono focus:outline-none focus:border-[#5e6ad2]"
                  >
                    <option value="1">Phase 01: Custom Virtual Memory Allocator</option>
                    <option value="2">Phase 02: Lock-Free Ring Buffer & SPSC Queue</option>
                    <option value="3">Phase 03: B-Tree Indexed Storage Engine</option>
                    <option value="5">Phase 05: Preemptive Microkernel Scheduler</option>
                    <option value="9">Phase 09: Raft Consensus Cluster</option>
                    <option value="14">Phase 14: HNSW Vector Database</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8a8f98] mb-1.5">
                    GITHUB REPOSITORY (OWNER/REPO OR URL)
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="e.g. your-github-user/custom-malloc"
                      className="w-full bg-[#0f1011] border border-[#23252a] rounded-md pl-9 pr-3 py-2 text-xs font-mono text-[#f7f8f8] placeholder-[#565961] focus:outline-none focus:border-[#5e6ad2]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating Repository Structure...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Capstone Repository</span>
                    </>
                  )}
                </Button>
              </form>

              {/* Verification Feedback Result */}
              {verificationResult && (
                <div
                  className={cn(
                    "mt-5 p-4 rounded-md border text-xs font-mono transition-all",
                    verificationResult.success
                      ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                      : "bg-[#f43f5e]/10 border-[#f43f5e]/30 text-[#f43f5e]"
                  )}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    {verificationResult.success ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{verificationResult.message}</span>
                  </div>

                  {verificationResult.details && (
                    <div className="mt-2 pt-2 border-t border-current/20 text-[#8a8f98] space-y-1">
                      <div>Repo: {verificationResult.details.repo}</div>
                      <div>Branch: {verificationResult.details.defaultBranch}</div>
                      <div>Stars: {verificationResult.details.stars}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
