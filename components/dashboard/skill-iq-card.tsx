"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Award,
  Zap,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  X,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SkillScore {
  id: string;
  name: string;
  category: string;
  score: number; // 0 - 300
  tier: "Novice" | "Proficient" | "Expert";
  percentile: number; // e.g. 78th percentile
  lastAssessed: string;
  gapLesson: {
    id: string;
    title: string;
    phase: string;
  };
}

const INITIAL_SKILLS: SkillScore[] = [
  {
    id: "systems",
    name: "Python & Pydantic Data Contracts",
    category: "Foundations",
    score: 218,
    tier: "Expert",
    percentile: 88,
    lastAssessed: "3 days ago",
    gapLesson: {
      id: "node-1-4",
      title: "Pydantic v2 Guaranteed JSON Schemas & Strict Validation",
      phase: "Module 2",
    },
  },
  {
    id: "distributed",
    name: "Distributed Systems & Raft Consensus",
    category: "Infrastructure",
    score: 184,
    tier: "Proficient",
    percentile: 72,
    lastAssessed: "Yesterday",
    gapLesson: {
      id: "node-5-2",
      title: "WAL Recovery, ARIES Invariants & Slotted Pages",
      phase: "Module 5",
    },
  },
  {
    id: "algorithms",
    name: "Cache-Conscious Data Structures & LSM",
    category: "Algorithms",
    score: 162,
    tier: "Proficient",
    percentile: 65,
    lastAssessed: "1 week ago",
    gapLesson: {
      id: "node-3-6",
      title: "SkipList Probabilistic Indexing & Lock-Free Reads",
      phase: "Module 4",
    },
  },
  {
    id: "ai-systems",
    name: "Transformers, Autograd & vLLM Serving",
    category: "AI/ML",
    score: 135,
    tier: "Proficient",
    percentile: 54,
    lastAssessed: "Not completed",
    gapLesson: {
      id: "node-10-1",
      title: "Scaled Dot-Product Self-Attention from First Principles",
      phase: "Module 7",
    },
  },
];

interface DiagnosticQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillId: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    skillId: "systems",
    question: "Why does standard `malloc(size)` typically allocate memory with 8-byte or 16-byte alignment rather than arbitrary byte boundaries?",
    options: [
      "To prevent internal fragmentation of small allocations",
      "Because CPU architecture instructions require word alignment to avoid multi-cycle split memory bus access",
      "To allow the Linux kernel virtual memory subsystem to map 4KB pages",
      "To maintain compatibility with 32-bit POSIX signal handlers",
    ],
    correctIndex: 1,
    explanation: "Unaligned memory accesses on modern x86/ARM CPUs trigger hardware alignment penalties or split bus transactions across cache lines.",
  },
  {
    skillId: "distributed",
    question: "In the Raft consensus algorithm, how does a candidate node prevent split-brain scenarios when two candidates start elections simultaneously?",
    options: [
      "By electing the node with the lowest IP address",
      "By requiring randomized election timeouts and strict majority (N/2 + 1) votes",
      "By deferring all state machine updates to an external ZooKeeper coordinator",
      "By aborting terms when heartbeat latency exceeds 15 milliseconds",
    ],
    correctIndex: 1,
    explanation: "Randomized election timeouts de-synchronize candidates so one wins a strict majority quorum (N/2 + 1) before others time out.",
  },
  {
    skillId: "ai-systems",
    question: "In self-attention ($Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}})V$), why is the dot product scaled by $\\sqrt{d_k}$?",
    options: [
      "To preserve numerical stability and prevent softmax gradients from vanishing due to extreme magnitudes",
      "To reduce the matrix multiplication computational complexity from O(N²) to O(N)",
      "To normalize the query vector so its L2 norm equals 1",
      "To compress multi-head attention heads into a unified embedding dimension",
    ],
    correctIndex: 0,
    explanation: "For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with vanishingly small gradients.",
  },
];

export function SkillIQCard({
  onResumeLesson,
}: {
  onResumeLesson: (lessonId: string) => void;
}) {
  const [skills, setSkills] = React.useState<SkillScore[]>(INITIAL_SKILLS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [currentQIndex, setCurrentQIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const averageIQ = Math.round(
    skills.reduce((acc, s) => acc + s.score, 0) / skills.length
  );

  const handleStartAssessment = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
    setIsModalOpen(true);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    const nextAnswers = [...answers, selectedOption];
    setAnswers(nextAnswers);
    setSelectedOption(null);

    if (currentQIndex + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate results
      let scoreGain = 0;
      nextAnswers.forEach((ans, idx) => {
        if (ans === DIAGNOSTIC_QUESTIONS[idx].correctIndex) {
          scoreGain += 15;
        } else {
          scoreGain -= 5;
        }
      });

      // Update state
      setSkills((prev) =>
        prev.map((s) => ({
          ...s,
          score: Math.min(300, Math.max(80, s.score + scoreGain)),
          lastAssessed: "Just now",
        }))
      );
      setIsCompleted(true);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Expert":
        return "text-[#5e6ad2] bg-[#5e6ad2]/10 border-[#5e6ad2]/30";
      case "Proficient":
        return "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30";
      default:
        return "text-[#e5993e] bg-[#e5993e]/10 border-[#e5993e]/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill IQ Overview Banner */}
      <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#5e6ad2]/15 text-[#5e6ad2] border border-[#5e6ad2]/30 font-semibold">
                PLURALSIGHT SKILL IQ ENGINE
              </span>
              <span className="text-xs font-mono text-[#8a8f98]">Norm-Referenced Adaptive Benchmark</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f7f8f8] tracking-tight flex items-center gap-3">
              <span>Overall Skill IQ:</span>
              <span className="text-[#5e6ad2] font-mono">{averageIQ}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]">
                {averageIQ >= 200 ? "Expert" : averageIQ >= 100 ? "Proficient" : "Novice"} (Top 22%)
              </span>
            </h3>
            <p className="text-xs text-[#8a8f98] max-w-2xl leading-relaxed">
              Skill IQ replaces blind lesson counts with precision engineering assessment. Instead of doing the full 700-lesson curriculum blindly, test your proficiency to identify and close exact architectural gaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={handleStartAssessment}
              className="gap-2 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white shadow-md shadow-[#5e6ad2]/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Take Diagnostic Assessment (5 min)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid of Skill Gauges (4 core disciplines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const pct = Math.round((skill.score / 300) * 100);

          return (
            <div
              key={skill.id}
              className="rounded-lg bg-[#0f1011] border border-[#23252a] p-5 space-y-4 hover:border-[#3b3e48] transition-all shadow-md group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#f7f8f8] group-hover:text-white transition-colors">
                      {skill.name}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#8a8f98]">
                    {skill.category} • Assessed: {skill.lastAssessed}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-[#f7f8f8]">
                    {skill.score}
                    <span className="text-xs text-[#565961]"> / 300</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border inline-block",
                      getTierColor(skill.tier)
                    )}
                  >
                    {skill.tier} • Top {100 - skill.percentile}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with 3-Zone Benchmark Markers (Novice: 0-99, Proficient: 100-199, Expert: 200-300) */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#18191a] h-2 rounded-full overflow-hidden border border-[#23252a] relative">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      skill.tier === "Expert"
                        ? "bg-[#5e6ad2]"
                        : skill.tier === "Proficient"
                        ? "bg-[#10b981]"
                        : "bg-[#e5993e]"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                  {/* Zone tick lines at 33% and 66% */}
                  <div className="absolute inset-y-0 left-[33%] w-px bg-[#23252a]" />
                  <div className="absolute inset-y-0 left-[66%] w-px bg-[#23252a]" />
                </div>

                <div className="flex justify-between text-[9px] font-mono text-[#565961]">
                  <span>Novice (0-99)</span>
                  <span>Proficient (100-199)</span>
                  <span>Expert (200-300)</span>
                </div>
              </div>

              {/* Prescriptive Gap Analysis: Next lesson to level up */}
              <div className="p-3 rounded bg-[#08090a] border border-[#1b1c20] flex items-center justify-between gap-3 text-xs font-mono">
                <div className="min-w-0">
                  <span className="text-[10px] text-[#e5993e] flex items-center gap-1 font-semibold uppercase">
                    <Target className="w-3 h-3" />
                    Prescribed Gap Closer ({skill.gapLesson.phase}):
                  </span>
                  <div className="text-[#f7f8f8] text-[11px] truncate pt-0.5">
                    {skill.gapLesson.title}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onResumeLesson(skill.gapLesson.id)}
                  className="text-[#5e6ad2] hover:text-[#6f7cf0] shrink-0 gap-1 text-[11px]"
                >
                  <span>Close Gap</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assessment Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-xl bg-[#0f1011] border border-[#23252a] shadow-2xl p-6 space-y-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded text-[#8a8f98] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!isCompleted ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#1b1c20] pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#5e6ad2]" />
                    <span className="text-xs font-mono text-[#f7f8f8] font-semibold">
                      Skill IQ Adaptive Diagnostic
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#8a8f98]">
                    Question {currentQIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#f7f8f8] leading-relaxed">
                    {DIAGNOSTIC_QUESTIONS[currentQIndex].question}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {DIAGNOSTIC_QUESTIONS[currentQIndex].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedOption(idx)}
                          className={cn(
                            "w-full text-left p-3 rounded-[6px] text-xs font-mono border transition-all flex items-start gap-2.5",
                            isSelected
                              ? "bg-[#5e6ad2]/15 border-[#5e6ad2] text-white shadow-sm"
                              : "bg-[#08090a] border-[#23252a] text-[#d0d6e0] hover:border-[#3b3e48] hover:text-white"
                          )}
                        >
                          <span
                            className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5",
                              isSelected
                                ? "border-[#5e6ad2] text-[#5e6ad2] font-bold"
                                : "border-[#3b3e48] text-[#8a8f98]"
                            )}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#1b1c20]">
                  <span className="text-[11px] font-mono text-[#565961]">
                    Adaptive Scoring Active
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className="gap-2 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0]"
                  >
                    <span>
                      {currentQIndex + 1 < DIAGNOSTIC_QUESTIONS.length
                        ? "Next Question →"
                        : "Submit Diagnostic"}
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 mx-auto flex items-center justify-center text-[#10b981]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-[#f7f8f8]">
                    Diagnostic Assessment Complete!
                  </h4>
                  <p className="text-xs text-[#8a8f98] max-w-md mx-auto">
                    Your Skill IQ radar has been updated with verified answers. Your lowest scoring gap has been highlighted with an immediate lesson recommendation.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsModalOpen(false)}
                    className="font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0]"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
