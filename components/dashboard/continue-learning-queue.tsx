import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Play,
  FolderGit2,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurriculumProgress } from "@/lib/progress-tracker";
import { parseLessonCoordinates, formatPhaseTitle } from "@/lib/curriculum-numbering";
import { PRODUCTION_CAPSTONES_2026 } from "@/lib/production-capstones";

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

  const [nextLesson, setNextLesson] = React.useState<{
    id: string;
    title: string;
    phase_id: string;
  } | null>(null);

  const [activeCapstone, setActiveCapstone] = React.useState<{
    id: string;
    title: string;
    phaseName: string;
    oneLineHook: string;
  } | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);

  const { lastActiveLessonId, completedLessons } = useCurriculumProgress();

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const [phasesRes, nodesRes] = await Promise.all([
          supabase
            .from("curriculum_phases")
            .select("id, title, order_index")
            .order("order_index", { ascending: true }),
          supabase
            .from("curriculum_nodes")
            .select("id, title, phase_id, xp_reward, order_index")
            .order("order_index", { ascending: true }),
        ]);

        if (isMounted && phasesRes.data && nodesRes.data) {
          const phases = phasesRes.data;
          const nodes = nodesRes.data;
          const completedSet = new Set(completedLessons);

          // Build a phase order lookup map
          const phaseOrderMap = new Map<string, number>();
          phases.forEach((p) => phaseOrderMap.set(p.id, p.order_index));

          // Sort nodes globally: phase.order_index ASC, node.order_index ASC
          const sortedNodes = [...nodes].sort((a, b) => {
            const pA = phaseOrderMap.get(a.phase_id) ?? 999;
            const pB = phaseOrderMap.get(b.phase_id) ?? 999;
            if (pA !== pB) return pA - pB;
            return (a.order_index || 0) - (b.order_index || 0);
          });

          // 1. Resolve Active In-Progress Lesson
          const targeted =
            sortedNodes.find((n) => n.id === lastActiveLessonId) ||
            sortedNodes.find((n) => !completedSet.has(n.id)) ||
            sortedNodes[0];
          setActiveLesson(targeted);

          // 2. Resolve Next Pedagogical Step
          const targetIdx = sortedNodes.findIndex((n) => n.id === targeted.id);
          const subsequent =
            sortedNodes.slice(targetIdx + 1).find((n) => !completedSet.has(n.id)) ||
            sortedNodes.find((n) => !completedSet.has(n.id) && n.id !== targeted.id) ||
            sortedNodes[Math.min(targetIdx + 1, sortedNodes.length - 1)];
          setNextLesson(subsequent);

          // 3. Resolve Relevant Capstone based on active phase
          const activePhaseObj = phases.find((p) => p.id === targeted.phase_id);
          const phaseNum = activePhaseObj ? activePhaseObj.order_index + 1 : 1;
          const matchedCap =
            PRODUCTION_CAPSTONES_2026.find(
              (c) => c.displayPhaseNumber === phaseNum || c.phaseId === phaseNum - 1
            ) || PRODUCTION_CAPSTONES_2026[0];

          setActiveCapstone({
            id: matchedCap.projectSlug,
            title: matchedCap.title,
            phaseName: matchedCap.phaseName,
            oneLineHook: matchedCap.oneLineHook,
          });
        }
      } catch (err) {
        console.error("Failed to load queue data from Supabase", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [lastActiveLessonId, completedLessons]);

  const activeLessonCoords = activeLesson
    ? parseLessonCoordinates(activeLesson.id, activeLesson.title)
    : null;

  const nextLessonCoords = nextLesson
    ? parseLessonCoordinates(nextLesson.id, nextLesson.title)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#23252a]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <h3 className="text-sm font-semibold text-[#f7f8f8] uppercase tracking-wider font-mono">
            Continue Learning Queue
          </h3>
        </div>
        <span className="text-xs font-mono text-[#8a8f98]">Live Database Progression</span>
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
              <span className="text-[#8a8f98]">
                {activeLesson ? formatPhaseTitle(activeLesson.phase_id) : "Module 1"}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#f7f8f8] group-hover:text-white transition-colors line-clamp-2">
              {activeLessonCoords ? activeLessonCoords.displayTitle : "Lesson 1.1: Foundations"}
            </h4>

            <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
              In-browser Python 3.12 WebAssembly environment with automated AST tests.
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

        {/* Card 2: Active Phase Capstone Project */}
        <div className="rounded-xl bg-[#0f1011] border border-[#23252a] p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#3b3e48] transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#10b981] font-semibold flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5" />
                ACTIVE CAPSTONE
              </span>
              <span className="text-[#8a8f98] truncate max-w-[140px]">
                {activeCapstone ? activeCapstone.phaseName : "Module 1 Capstone"}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#f7f8f8] group-hover:text-white transition-colors line-clamp-2">
              {activeCapstone ? activeCapstone.title : "PromptCLI: Developer AI Workbench"}
            </h4>

            <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
              {activeCapstone
                ? activeCapstone.oneLineHook
                : "Dynamic prompt templating, token budgeting, and exponential backoff retry engine in Python."}
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
              <span>View Capstones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Card 3: Next Curriculum Step */}
        <div className="rounded-xl bg-[#0f1011] border border-[#23252a] p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-[#3b3e48] transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#5e6ad2] font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                NEXT PEDAGOGICAL STEP
              </span>
              <span className="text-[#8a8f98]">
                {nextLesson ? formatPhaseTitle(nextLesson.phase_id) : "Next Step"}
              </span>
            </div>

            <h4 className="text-base font-bold text-[#f7f8f8] group-hover:text-white transition-colors line-clamp-2">
              {nextLessonCoords ? nextLessonCoords.displayTitle : "Next Lesson"}
            </h4>

            <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
              Sequential progression with zero fluff, step-by-step guidance, and real AST verification.
            </p>
          </div>

          <div className="pt-3 border-t border-[#1b1c20] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#8a8f98]">
              Sequential Path
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onResumeLesson(nextLesson?.id || "node-0-2")}
              className="gap-1.5 font-mono text-xs text-[#5e6ad2] hover:text-[#6f7cf0] p-0 h-auto"
            >
              <span>Start Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
