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
import {
  fetchLiveCurriculum,
  getLiveCurriculumSync,
  resolveLearningQueue,
} from "@/lib/db-curriculum";
import { useCurriculumProgress } from "@/lib/progress-tracker";
import { parseLessonCoordinates, formatPhaseTitle } from "@/lib/curriculum-numbering";

const CANONICAL_INITIAL_ACTIVE = {
  id: "node-0-1",
  title: "Lesson 1.1: Python Basics & Data Types",
  phase_id: "module-1",
  xp_reward: 100,
};

const CANONICAL_INITIAL_NEXT = {
  id: "node-0-2",
  title: "Lesson 1.2: Operators & Token Bill Math",
  phase_id: "module-1",
};

const CANONICAL_INITIAL_CAPSTONE = {
  id: "module-01-capstone-promptcli-workbench",
  title: "PromptCLI: Developer AI Workbench",
  phaseName: "Module 1 Capstone",
  oneLineHook: "Dynamic prompt templating, token budgeting, and exponential backoff retry engine in Python.",
};

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
  const { lastActiveLessonId, completedLessons } = useCurriculumProgress();

  // Initialize state synchronously using O(1) cache if available, or canonical Lesson 1.1
  const [activeLesson, setActiveLesson] = React.useState<{
    id: string;
    title: string;
    phase_id: string;
    xp_reward?: number;
  }>(() => {
    const cached = getLiveCurriculumSync();
    if (cached) {
      const q = resolveLearningQueue(cached, lastActiveLessonId, completedLessons);
      return q.activeLesson;
    }
    return CANONICAL_INITIAL_ACTIVE;
  });

  const [nextLesson, setNextLesson] = React.useState<{
    id: string;
    title: string;
    phase_id: string;
  }>(() => {
    const cached = getLiveCurriculumSync();
    if (cached) {
      const q = resolveLearningQueue(cached, lastActiveLessonId, completedLessons);
      return q.nextLesson;
    }
    return CANONICAL_INITIAL_NEXT;
  });

  const [activeCapstone, setActiveCapstone] = React.useState<{
    id: string;
    title: string;
    phaseName: string;
    oneLineHook: string;
  }>(() => {
    const cached = getLiveCurriculumSync();
    if (cached) {
      const q = resolveLearningQueue(cached, lastActiveLessonId, completedLessons);
      return q.activeCapstone;
    }
    return CANONICAL_INITIAL_CAPSTONE;
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const requestIdRef = React.useRef(0);

  // Sync with live curriculum database: O(1) cached lookups with race condition guard
  React.useEffect(() => {
    let isMounted = true;
    const reqId = ++requestIdRef.current;

    async function syncQueue() {
      try {
        const curriculum = await fetchLiveCurriculum();
        // Guard against race conditions and unmounted state
        if (!isMounted || reqId !== requestIdRef.current) return;

        const queue = resolveLearningQueue(curriculum, lastActiveLessonId, completedLessons);
        setActiveLesson(queue.activeLesson);
        setNextLesson(queue.nextLesson);
        setActiveCapstone(queue.activeCapstone);
      } catch (err) {
        console.error("Failed to load queue data from Supabase", err);
      } finally {
        if (isMounted && reqId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }

    syncQueue();

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
              {activeLessonCoords ? activeLessonCoords.displayTitle : CANONICAL_INITIAL_ACTIVE.title}
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
              {nextLessonCoords ? nextLessonCoords.displayTitle : CANONICAL_INITIAL_NEXT.title}
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
