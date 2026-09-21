"use client";

import * as React from "react";
import { fetchLiveCurriculum, PhaseViewModel, DatabaseNode } from "@/lib/db-curriculum";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  ChevronRight,
  Layers,
  Award,
  Clock,
  Terminal,
  CheckCircle2,
  Filter,
  Loader2,
  Play,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurriculumProgress, isLessonUnlocked } from "@/lib/progress-tracker";

interface CurriculumBrowserProps {
  onStartLesson?: (nodeId: string) => void;
}

export function CurriculumBrowser({ onStartLesson }: CurriculumBrowserProps) {
  const [phases, setPhases] = React.useState<PhaseViewModel[]>([]);
  const [selectedPhase, setSelectedPhase] = React.useState<PhaseViewModel | null>(null);
  const [nodesByPhase, setNodesByPhase] = React.useState<Record<string, DatabaseNode[]>>({});
  const [totalLessons, setTotalLessons] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("ALL");
  const [allLessonIds, setAllLessonIds] = React.useState<string[]>([]);

  const { completedLessons, completedCount } = useCurriculumProgress();

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const data = await fetchLiveCurriculum();
      if (isMounted) {
        setPhases(data.phases);
        setTotalLessons(data.totalLessons);
        setAllLessonIds(data.allNodes.map((n) => n.id));
        if (data.phases.length > 0) {
          setSelectedPhase(data.phases[0]);
        }
        const grouped: Record<string, DatabaseNode[]> = {};
        for (const n of data.allNodes) {
          if (!grouped[n.phase_id]) grouped[n.phase_id] = [];
          grouped[n.phase_id].push(n);
        }
        setNodesByPhase(grouped);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ["ALL", "Systems", "Algorithms", "Distributed", "AI/ML", "Full-Stack", "Specializations"];

  const filteredPhases = phases.filter((phase) => {
    const matchesCategory = activeCategory === "ALL" || phase.category === activeCategory;
    const matchesSearch =
      phase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.capstoneTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.keyTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="curriculum" className="py-24 border-t border-[#23252a] bg-[#010102] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <StatusChip status="brand" label="LIVE DATABASE SYLLABUS" />
              <span className="text-xs font-mono text-[#8a8f98]">
                {totalLessons > 0 ? `${totalLessons} Lessons // Verified Supabase DB` : "Connecting to Supabase..."}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#f7f8f8] tracking-tight">
              Curriculum Architecture
            </h2>
            <p className="mt-2 text-base text-[#8a8f98] max-w-2xl leading-relaxed">
              Educative-grade deep text-first rigor combined with Codecademy-grade interactive runnable execution.
              Fetched directly from live database tables with zero mock placeholders.
            </p>
          </div>

          {/* Stats quick view */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#08090a] border border-[#23252a] font-mono text-xs">
            <div className="pr-4 border-r border-[#23252a]">
              <span className="text-[#8a8f98] block">PHASES</span>
              <span className="text-sm font-semibold text-[#f7f8f8]">{phases.length || 15}</span>
            </div>
            <div className="pr-4 border-r border-[#23252a]">
              <span className="text-[#8a8f98] block">LESSONS</span>
              <span className="text-sm font-semibold text-[#f7f8f8]">{totalLessons || 500}</span>
            </div>
            <div className="pr-4 border-r border-[#23252a]">
              <span className="text-[#8a8f98] block">COMPLETED</span>
              <span className="text-sm font-semibold text-[#10b981]">{completedCount}</span>
            </div>
            <div className="pr-4 border-r border-[#23252a]">
              <span className="text-[#8a8f98] block">CAPSTONES</span>
              <span className="text-sm font-semibold text-[#5e6ad2]">{phases.length || 15}</span>
            </div>
            <div>
              <span className="text-[#8a8f98] block">PACING</span>
              <span className="text-sm font-semibold text-[#10b981]">100% Free / Self-Paced</span>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-[#5e6ad2] text-white shadow-sm"
                    : "bg-[#0f1011] text-[#8a8f98] hover:text-[#f7f8f8] border border-[#23252a]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, capstones..."
              className="w-full bg-[#08090a] border border-[#23252a] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#f7f8f8] placeholder-[#565961] focus:outline-none focus:border-[#5e6ad2]"
            />
          </div>
        </div>

        {/* Dual-column browser: Educative Sidebar + Detailed Inspector */}
        {isLoading ? (
          <div className="flex items-center justify-center p-24 bg-[#08090a] border border-[#23252a] rounded-xl font-mono text-sm text-[#8a8f98] gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#5e6ad2]" />
            <span>Loading curriculum nodes directly from Supabase database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Phase List (Left Column) */}
            <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-2">
              {filteredPhases.map((phase) => {
                const isSelected = selectedPhase?.id === phase.id;
                return (
                  <div
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase)}
                    className={cn(
                      "p-3.5 rounded-lg cursor-pointer transition-all border text-left group",
                      isSelected
                        ? "bg-[#141516] border-[#5e6ad2]/50 shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                        : "bg-[#08090a] border-[#23252a] hover:bg-[#0f1011] hover:border-[#34343a]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#5e6ad2]">
                        PHASE {String(phase.id).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16171a] border border-[#23252a] text-[#8a8f98]">
                        {phase.category}
                      </span>
                    </div>
                    <h4
                      className={cn(
                        "text-sm font-medium transition-colors line-clamp-1",
                        isSelected ? "text-[#f7f8f8]" : "text-[#d0d6e0] group-hover:text-white"
                      )}
                    >
                      {phase.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-[#8a8f98]">
                      <span>{phase.lessonsCount} lessons</span>
                      <span>•</span>
                      <span>{phase.subtopicsCount} subtopics</span>
                      <span>•</span>
                      <span className="text-[#5e6ad2]">{phase.capstonesCount} capstone</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Inspector (Right Column) */}
            {selectedPhase && (
              <div className="lg:col-span-7">
                <div className="bg-[#08090a] border border-[#23252a] rounded-xl p-6 relative overflow-hidden h-full flex flex-col justify-between shadow-2xl">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-[#23252a] mb-6">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-mono rounded bg-[#5e6ad2]/10 text-[#5e6ad2] border border-[#5e6ad2]/30">
                          PHASE {String(selectedPhase.id).padStart(2, "0")} SPECIFICATION
                        </span>
                        <span className="text-xs font-mono text-[#8a8f98]">
                          Category: {selectedPhase.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#10b981]">
                        Grading: Automated AST + Unit Tests
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold text-[#f7f8f8] mb-3">
                      {selectedPhase.title}
                    </h3>
                    <p className="text-sm text-[#8a8f98] leading-relaxed mb-6">
                      {selectedPhase.description}
                    </p>

                    {/* If Phase 13, render as 4 Standalone Specialized Tracks */}
                    {selectedPhase.isSpecializedPhase && selectedPhase.tracks && selectedPhase.tracks.length > 0 ? (
                      <div className="mb-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-mono text-[#8a8f98] flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-[#5e6ad2]" />
                            <span>STANDALONE SPECIALIZATION TRACKS (CHOOSE ANY TRACK)</span>
                          </h5>
                          <span className="text-[11px] font-mono text-[#10b981] px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20">
                            100% Self-Contained
                          </span>
                        </div>

                        <div className="space-y-3">
                          {selectedPhase.tracks.map((track) => (
                            <div
                              key={track.trackId}
                              className="rounded-lg bg-[#0b0c0e] border border-[#23252a] p-4 transition-all hover:border-[#5e6ad2]/40"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5e6ad2] text-white">
                                      Track {track.trackCode}
                                    </span>
                                    <h4 className="text-sm font-semibold text-[#f7f8f8]">
                                      {track.title}
                                    </h4>
                                  </div>
                                  <div className="text-[11px] font-mono text-[#5e6ad2] mt-0.5">
                                    {track.domain}
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16171a] text-[#8a8f98] border border-[#23252a] shrink-0">
                                  {track.badge}
                                </span>
                              </div>

                              <p className="text-xs text-[#8a8f98] leading-relaxed mb-3">
                                {track.description}
                              </p>

                              {/* Track Lessons */}
                              <div className="space-y-1.5 pt-2 border-t border-[#1e2025]">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-[#565961] mb-1">
                                  Track Syllabus ({track.nodes.length} Lessons + Capstone):
                                </div>
                                {track.nodes.map((node) => {
                                  const completed = completedLessons.includes(node.id);
                                  const unlocked = isLessonUnlocked(node.id, allLessonIds, completedLessons);

                                  return (
                                    <div
                                      key={node.id}
                                      onClick={() => {
                                        if (onStartLesson) {
                                          onStartLesson(node.id);
                                        } else if (typeof window !== "undefined") {
                                          window.location.href = `/dashboard?lesson=${encodeURIComponent(node.id)}#workspace`;
                                        }
                                      }}
                                      className={cn(
                                        "px-2.5 py-1.5 text-xs font-mono rounded border flex items-center justify-between cursor-pointer group/lesson transition-all",
                                        completed
                                          ? "bg-[#10b981]/5 border-[#10b981]/20 hover:border-[#10b981]/40 text-[#f7f8f8]"
                                          : unlocked
                                          ? "bg-[#101114] hover:bg-[#16171d] border-[#23252a] hover:border-[#5e6ad2]/50 text-[#d0d6e0] hover:text-[#f7f8f8]"
                                          : "bg-[#0b0c0e]/50 border-[#1a1c20] text-[#565961] hover:text-[#8a8f98] opacity-75"
                                      )}
                                    >
                                      <div className="flex items-center gap-2 truncate pr-2">
                                        {completed ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                                        ) : unlocked ? (
                                          <Play className="w-3 h-3 text-[#5e6ad2] opacity-60 group-hover/lesson:opacity-100 fill-current shrink-0" />
                                        ) : (
                                          <Lock className="w-3 h-3 text-[#565961] shrink-0" />
                                        )}
                                        <span className={cn("truncate", completed && "text-[#d0d6e0]")}>
                                          {node.title.replace(/^Track [A-D]:\s*/, "")}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        {completed ? (
                                          <span className="text-[10px] font-medium text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded">
                                            Completed
                                          </span>
                                        ) : unlocked ? (
                                          <>
                                            <span className="text-[10px] text-[#5e6ad2]">+{node.xp_reward} XP</span>
                                            <span className="text-[10px] font-semibold text-[#10b981] opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                              Start →
                                            </span>
                                          </>
                                        ) : (
                                          <span className="text-[10px] text-[#565961]">Locked</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Standard Phase Lessons List */
                      <div className="mb-6">
                        <h5 className="text-xs font-mono text-[#8a8f98] mb-3 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#5e6ad2]" />
                          DATABASE VERIFIED LESSONS ({nodesByPhase[selectedPhase.phaseId]?.length || selectedPhase.lessonsCount})
                        </h5>
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {(nodesByPhase[selectedPhase.phaseId] || []).map((node) => {
                            const completed = completedLessons.includes(node.id);
                            const unlocked = isLessonUnlocked(node.id, allLessonIds, completedLessons);

                            return (
                              <div
                                key={node.id}
                                onClick={() => {
                                  if (onStartLesson) {
                                    onStartLesson(node.id);
                                  } else if (typeof window !== "undefined") {
                                    window.location.href = `/dashboard?lesson=${encodeURIComponent(node.id)}#workspace`;
                                  }
                                }}
                                className={cn(
                                  "px-3 py-2 text-xs font-mono rounded-md border flex items-center justify-between cursor-pointer group/lesson transition-all",
                                  completed
                                    ? "bg-[#10b981]/5 border-[#10b981]/20 hover:border-[#10b981]/40 text-[#f7f8f8]"
                                    : unlocked
                                    ? "bg-[#0f1011] hover:bg-[#16171a] border-[#23252a] hover:border-[#5e6ad2]/50 text-[#d0d6e0] hover:text-[#f7f8f8]"
                                    : "bg-[#08090a]/60 border-[#1a1c20] text-[#565961] hover:text-[#8a8f98] opacity-75"
                                )}
                              >
                                <div className="flex items-center gap-2 truncate pr-2">
                                  {completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                                  ) : unlocked ? (
                                    <Play className="w-3 h-3 text-[#5e6ad2] opacity-60 group-hover/lesson:opacity-100 fill-current shrink-0" />
                                  ) : (
                                    <Lock className="w-3 h-3 text-[#565961] shrink-0" />
                                  )}
                                  <span className={cn("truncate", completed && "text-[#d0d6e0]")}>
                                    {node.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {completed ? (
                                    <span className="text-[10px] font-medium text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded">
                                      Completed
                                    </span>
                                  ) : unlocked ? (
                                    <>
                                      <span className="text-[10px] text-[#5e6ad2]">+{node.xp_reward} XP</span>
                                      <span className="text-[10px] font-semibold text-[#10b981] opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                        Start →
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-[10px] text-[#565961]">Locked</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Capstone Deliverable Card */}
                    <div className="p-4 rounded-lg bg-[#0f1011] border border-[#23252a] mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-[#f59e0b]" />
                        <span className="text-xs font-mono text-[#f59e0b] font-medium uppercase tracking-wider">
                          Required Phase Capstone
                        </span>
                      </div>
                      <h4 className="text-base font-medium text-[#f7f8f8] mb-1">
                        {selectedPhase.capstoneTitle}
                      </h4>
                      <p className="text-xs text-[#8a8f98] leading-relaxed">
                        Submitted via public GitHub repository. Graded through a tamper-proof GitHub Actions workflow
                        asserting performance benchmarks, zero memory leaks, and 100% test coverage.
                      </p>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="pt-4 border-t border-[#23252a] flex items-center justify-between">
                    <div className="text-xs font-mono text-[#8a8f98]">
                      <span>Phase DB ID: </span>
                      <span className="text-[#f7f8f8]">{selectedPhase.phaseId}</span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white font-mono text-xs shadow-md shadow-[#5e6ad2]/20"
                      onClick={() => {
                        const firstNode = (nodesByPhase[selectedPhase.phaseId] || [])[0];
                        const targetId = firstNode ? firstNode.id : "node-0-1";
                        if (onStartLesson) {
                          onStartLesson(targetId);
                        } else if (typeof window !== "undefined") {
                          window.location.href = `/dashboard?lesson=${encodeURIComponent(targetId)}#workspace`;
                        }
                      }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Phase {String(selectedPhase.id).padStart(2, "0")} in Workspace →</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
