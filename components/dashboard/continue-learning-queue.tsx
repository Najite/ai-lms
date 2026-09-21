"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Play,
  Terminal,
  FolderGit2,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurriculumProgress } from "@/lib/progress-tracker";

interface ContinueLearningQueueProps {
  onResumeLesson: (lessonId: string) => void;
  onViewCapstones: () => void;
  onViewSkillIQ: () => void;
}

export function ContinueLearningQueue({
  onResumeLesson,
  onViewCapstones,
  onViewSkillIQ,
}: ContinueLearningQueueProps) {
  const [activeLesson, setActiveLesson] = React.useState<{
    id: string;
    title: string;
    phase_id: string;
    xp_reward: number;
  } | null>(null);

  const { lastActiveLessonId, completedLessons } = useCurriculumProgress();

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      const { data } = await supabase
        .from("curriculum_nodes")
        .select("id, title, phase_id, xp_reward")
        .order("id", { ascending: true })
        .limit(100);

      if (isMounted && data && data.length > 0) {
        const parseRank = (id: string) => {
          const match = id.match(/node-(\d+)-(\d+)/);
          return match ? parseInt(match[1], 10) * 10000 + parseInt(match[2], 10) : 999999;
        };
        const sortedData = [...data].sort((a, b) => parseRank(a.id) - parseRank(b.id));

        const completedSet = new Set(completedLessons);
        const nextUncompleted = sortedData.find((n) => !completedSet.has(n.id));
        const targeted =
          sortedData.find((n) => n.id === lastActiveLessonId) ||
          nextUncompleted ||
          sortedData[0];
        setActiveLesson(targeted);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [lastActiveLessonId, completedLessons]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#23252a]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <h3 className="text-sm font-semibold text-[#f7f8f8] uppercase tracking-wider font-mono">
            Continue Learning Queue
          </h3>
        </div>
        <span className="text-xs font-mono text-[#8a8f98]">AI-Native Progression Engine</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Active In-Progress Lesson */}
        <div className="rounded-xl bg-[#0f1011] border border-[#2e3038] p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#5e6ad2]/50 transition-all group relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-[#5e6ad2]/40" />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#5e6ad2] font-semibold flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current" />
                ACTIVE LESSON
              </span>
              <span className="text-[#8a8f98]">{activeLesson?.phase_id || "phase-0"}</span>
            </div>

            <h4 className="text-base font-bold text-[#f7f8f8] group-hover:text-white transition-colors line-clamp-2">
              {activeLesson?.title || "Lesson 0.1: Bits, Bytes, & Number Representations"}
            </h4>

            <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
              In-browser WebAssembly Python 3.11 execution with automated AST invariants.
            </p>
          </div>

          <div className="pt-3 border-t border-[#1b1c20] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#10b981] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified in DB
            </span>
            <Button
              variant="primary"
              size="xs"
              onClick={() => onResumeLesson(activeLesson?.id || "node-0-1")}
              className="gap-1.5 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0]"
            >
              <span>Resume IDE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Card 2: Active Capstone Project */}
        <div className="rounded-xl bg-[#0f1011] border border-[#23252a] p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#3b3e48] transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#10b981] font-semibold flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                ACTIVE CAPSTONE
              </span>
              <span className="text-[#8a8f98]">Phase 1 Milestone</span>
            </div>

            <h4 className="text-base font-bold text-[#f7f8f8] group-hover:text-white transition-colors line-clamp-2">
              SysTrace: Custom Malloc / Free Allocator
            </h4>

            <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
              Segregated free list memory allocator tested via Valgrind &amp; GitHub Actions CI.
            </p>
          </div>

          <div className="pt-3 border-t border-[#1b1c20] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#8a8f98]">
              Automated CI Grading
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={onViewCapstones}
              className="gap-1.5 font-mono text-xs"
            >
              <span>View Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Card 3: Next Curriculum Step (AI Native Track) */}
        <div className="rounded-xl bg-[#0f1011] border border-[#23252a] p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#3b3e48] transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#5e6ad2] font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                NEXT PEDAGOGICAL STEP
              </span>
              <span className="text-[#8a8f98]">Phase 0 Foundations</span>
            </div>

            <h4 className="text-base font-bold text-[#f7f8f8] group-hover:text-white transition-colors line-clamp-2">
              Lesson 0.2: Making Decisions — How Programs Choose Paths
            </h4>

            <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
              Gentle step-by-step introduction to conditionals and if-else logic with zero jargon and visual fork diagrams.
            </p>
          </div>

          <div className="pt-3 border-t border-[#1b1c20] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#8a8f98]">
              Beginner Friendly
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onResumeLesson("node-0-2")}
              className="gap-1.5 font-mono text-xs text-[#5e6ad2] hover:text-[#6f7cf0] p-0 h-auto"
            >
              <span>Preview Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
