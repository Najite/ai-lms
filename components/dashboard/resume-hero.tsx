"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Play,
  Terminal,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Sparkles,
  Layers,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurriculumProgress } from "@/lib/progress-tracker";

interface ResumeHeroProps {
  onResumeWorkspace: (lessonId?: string) => void;
  onViewCurriculum: () => void;
  completedLessonsCount?: number;
}

export function ResumeHero({
  onResumeWorkspace,
  onViewCurriculum,
  completedLessonsCount = 0,
}: ResumeHeroProps) {
  const [activeLesson, setActiveLesson] = React.useState<{
    id: string;
    title: string;
    phase_id: string;
    xp_reward: number;
    handbook_markdown?: string;
  } | null>(null);
  const [totalDbLessons, setTotalDbLessons] = React.useState(600);
  const [isLoading, setIsLoading] = React.useState(true);

  const { lastActiveLessonId, completedLessons } = useCurriculumProgress();

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);

      // Fetch all nodes ordered to find next uncompleted lesson or current active
      const { data, count } = await supabase
        .from("curriculum_nodes")
        .select("id, title, phase_id, xp_reward, handbook_markdown", { count: "exact" })
        .order("id", { ascending: true })
        .limit(600);

      if (isMounted) {
        if (data && data.length > 0) {
          // Find first uncompleted node or fall back to lastActiveLessonId or first node
          const completedSet = new Set(completedLessons);
          const nextUncompleted = data.find((n) => !completedSet.has(n.id));
          const targeted =
            data.find((n) => n.id === lastActiveLessonId) ||
            nextUncompleted ||
            data[0];

          setActiveLesson(targeted);
        }
        if (count) {
          setTotalDbLessons(count);
        }
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [lastActiveLessonId, completedLessons]);

  const percentage = ((completedLessonsCount / (totalDbLessons || 600)) * 100).toFixed(1);

  return (
    <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle top bevel hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Active Lesson & Launch CTAs (Codecademy Style) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status="brand" label="CONTINUE LEARNING" />
            <span className="text-xs font-mono text-[#8a8f98]">
              {activeLesson?.phase_id || "phase-0"}
            </span>
            <span className="text-xs font-mono text-[#383b42]">•</span>
            <span className="text-xs font-mono text-[#10b981] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified in Supabase Database
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#f7f8f8] tracking-tight">
            {isLoading ? "Loading next lesson from database..." : activeLesson?.title || "Lesson 0.1: Bits, Bytes, & Number Representations"}
          </h2>

          <p className="text-sm text-[#8a8f98] max-w-2xl leading-relaxed">
            Execute code in the split-screen IDE against automated AST rubrics and Pyodide unit tests.
            All curriculum nodes and starter templates are synced with live database records.
          </p>

          {/* Action row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onResumeWorkspace(activeLesson?.id)}
              className="gap-2 font-mono text-xs bg-[#5e6ad2] hover:bg-[#6f7cf0] text-white shadow-lg shadow-[#5e6ad2]/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume in Split IDE →</span>
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onViewCurriculum}
              className="gap-2 font-mono text-xs w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Full 600 Lessons</span>
            </Button>
          </div>
        </div>

        {/* Right: Progress & Telemetry Metric Card */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0f1011] border border-[#23252a] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8a8f98]">CURRICULUM COMPLETION</span>
            <span className="text-xs font-mono text-[#10b981] font-semibold">{percentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-[#1c1d20] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#10b981] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(parseFloat(percentage), 2)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#08090a] border border-[#23252a]">
              <span className="text-[#8a8f98] block text-[10px]">TOTAL LESSONS</span>
              <span className="text-[#f7f8f8] text-base font-semibold">{totalDbLessons}</span>
            </div>
            <div className="p-2.5 rounded bg-[#08090a] border border-[#23252a]">
              <span className="text-[#8a8f98] block text-[10px]">PHASES ACTIVE</span>
              <span className="text-[#5e6ad2] text-base font-semibold">15</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#565961] pt-1">
            <span>Guaranteed Zero Urgency</span>
            <span className="text-[#10b981]">100% Free / Self-Paced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
