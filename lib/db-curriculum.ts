import { supabase } from "@/lib/supabase";
import { formatPhaseTitle, parseLessonCoordinates } from "@/lib/curriculum-numbering";

export interface DatabasePhase {
  id: string;
  order_index: number;
  title: string;
  description: string;
}

export interface DatabaseNode {
  id: string;
  slug: string;
  phase_id: string;
  title: string;
  subtitle: string;
  cs_foundation?: string;
  ai_convergence?: string;
  xp_reward: number;
  order_index?: number;
  level_required?: number;
  position_x?: number;
  position_y?: number;
  handbook_markdown?: string;
  starter_code?: Record<string, string>;
  test_suite?: any;
  defense_prompts?: any;
}

export interface StandaloneTrack {
  trackId: string;
  trackCode: "A" | "B" | "C" | "D";
  title: string;
  domain: string;
  description: string;
  badge: string;
  nodes: DatabaseNode[];
  capstoneTitle: string;
}

export interface PhaseViewModel {
  id: number;
  phaseId: string;
  slug: string;
  title: string;
  category: "Systems" | "Algorithms" | "Distributed" | "AI/ML" | "Full-Stack" | "Specializations";
  lessonsCount: number;
  subtopicsCount: number;
  capstonesCount: number;
  capstoneTitle: string;
  description: string;
  keyTopics: string[];
  isSpecializedPhase?: boolean;
  tracks?: StandaloneTrack[];
}

// Assign clean category based on module order_index (0 to 13)
export function getCategoryForPhase(phaseNum: number): PhaseViewModel["category"] {
  if ([0, 1].includes(phaseNum)) return "Systems";      // Python Foundations, Craftsmanship & OOP
  if ([2, 3, 4].includes(phaseNum)) return "Algorithms"; // Discrete Math, Linear Algebra, DSA
  if ([5, 6].includes(phaseNum)) return "Distributed";   // Web Protocols/ASGI, PostgreSQL Internals
  if ([7].includes(phaseNum)) return "Full-Stack";       // Modern Frontend & Next.js
  if ([8, 9].includes(phaseNum)) return "Distributed";   // System Design, Distributed Consensus
  if ([10, 11, 12].includes(phaseNum)) return "AI/ML";   // Vector RAG, Profiling/Evals, AI Agents
  if ([13].includes(phaseNum)) return "Specializations"; // Advanced Infra & Capstone Defense
  return "Systems";
}

// Map database phases and nodes into UI view models
export function transformDbPhases(
  dbPhases: DatabasePhase[],
  nodesByPhase: Record<string, DatabaseNode[]>
): PhaseViewModel[] {
  return dbPhases.map((p) => {
    const rawPhaseNum = p.order_index;
    const displayPhaseNum = rawPhaseNum + 1;
    const rawNodes = nodesByPhase[p.id] || [];
    const nodes = rawNodes.map((n) => {
      const coords = parseLessonCoordinates(n.id, n.title);
      return {
        ...n,
        title: coords.displayTitle,
      };
    });
    const lessonsCount = nodes.length;

    // Extract subtopics or use realistic 5 per lesson
    const subtopicsCount = lessonsCount * 5;

    // Find capstone project if any
    const capstoneNode = nodes.find(
      (n) => n.title.toLowerCase().includes("capstone") || n.title.toLowerCase().includes("project")
    );
    const capstoneTitle = capstoneNode
      ? capstoneNode.title
      : `Module ${displayPhaseNum} Synthesis Capstone Project`;

    // Extract key topics from lesson titles
    const keyTopics = nodes.slice(0, 5).map((n) => {
      const parts = n.title.split(":");
      return parts.length > 1 ? parts[1].trim() : n.title;
    });

    return {
      id: displayPhaseNum,
      phaseId: p.id,
      slug: p.id.startsWith("module-") ? p.id : `module-${displayPhaseNum}`,
      title: formatPhaseTitle(rawPhaseNum, p.title),
      category: getCategoryForPhase(rawPhaseNum),
      lessonsCount,
      subtopicsCount,
      capstonesCount: 1,
      capstoneTitle,
      description: p.description,
      keyTopics: keyTopics.length > 0 ? keyTopics : ["Core Foundations", "Verification Suite", "Architectural Invariants"],
      isSpecializedPhase: false,
    };
  });
}

import { PRODUCTION_CAPSTONES_2026 } from "@/lib/production-capstones";

export interface LiveCurriculumResult {
  phases: PhaseViewModel[];
  allNodes: DatabaseNode[];
  nodesMap: Map<string, DatabaseNode>;
  nodeIndexMap: Map<string, number>;
  nodesByPhase: Record<string, DatabaseNode[]>;
  totalLessons: number;
  totalPhases: number;
}

// In-memory singleton cache and in-flight promise deduplication
let memoryCachedCurriculum: LiveCurriculumResult | null = null;
let inFlightCurriculumPromise: Promise<LiveCurriculumResult> | null = null;

/**
 * Returns the in-memory cached curriculum synchronously if available.
 * Time complexity: O(1)
 */
export function getLiveCurriculumSync(): LiveCurriculumResult | null {
  return memoryCachedCurriculum;
}

// Fetch live curriculum data from Supabase with in-memory caching and request deduplication
export async function fetchLiveCurriculum(forceRefresh = false): Promise<LiveCurriculumResult> {
  if (!forceRefresh && memoryCachedCurriculum) {
    return memoryCachedCurriculum;
  }

  if (!forceRefresh && inFlightCurriculumPromise) {
    return inFlightCurriculumPromise;
  }

  inFlightCurriculumPromise = (async () => {
    try {
      const [phasesRes, nodesRes] = await Promise.all([
        supabase.from("curriculum_phases").select("*").order("order_index", { ascending: true }),
        supabase
          .from("curriculum_nodes")
          .select("id, slug, phase_id, title, subtitle, xp_reward, order_index")
          .order("order_index", { ascending: true }),
      ]);

      const dbPhases: DatabasePhase[] = phasesRes.data || [];
      let allNodes: DatabaseNode[] = nodesRes.data || [];

      const phaseOrderMap = new Map<string, number>();
      dbPhases.forEach((p) => phaseOrderMap.set(p.id, p.order_index));

      // Order nodes strictly by phase order_index first, then node order_index
      const parseNodeRank = (n: any) => {
        const pRank = phaseOrderMap.get(n.phase_id) ?? 999;
        const order = typeof n.order_index === "number" ? n.order_index : 99999;
        return pRank * 100000 + order;
      };

      allNodes.sort((a, b) => parseNodeRank(a) - parseNodeRank(b));

      const nodesMap = new Map<string, DatabaseNode>();
      const nodeIndexMap = new Map<string, number>();
      const nodesByPhase: Record<string, DatabaseNode[]> = {};

      allNodes.forEach((node, idx) => {
        nodesMap.set(node.id, node);
        nodeIndexMap.set(node.id, idx);
        if (!nodesByPhase[node.phase_id]) {
          nodesByPhase[node.phase_id] = [];
        }
        nodesByPhase[node.phase_id].push(node);
      });

      const phases = transformDbPhases(dbPhases, nodesByPhase);

      const result: LiveCurriculumResult = {
        phases,
        allNodes,
        nodesMap,
        nodeIndexMap,
        nodesByPhase,
        totalLessons: allNodes.length,
        totalPhases: phases.length,
      };

      memoryCachedCurriculum = result;
      return result;
    } catch (error) {
      console.error("Failed to fetch live curriculum from Supabase:", error);
      return {
        phases: [],
        allNodes: [],
        nodesMap: new Map(),
        nodeIndexMap: new Map(),
        nodesByPhase: {},
        totalLessons: 0,
        totalPhases: 0,
      };
    } finally {
      inFlightCurriculumPromise = null;
    }
  })();

  return inFlightCurriculumPromise;
}

export interface ResolvedLearningQueue {
  activeLesson: DatabaseNode;
  nextLesson: DatabaseNode;
  activeCapstone: {
    id: string;
    title: string;
    phaseName: string;
    oneLineHook: string;
  };
}

/**
 * Resolves active lesson, next lesson, and active capstone with O(1) amortized time complexity.
 */
export function resolveLearningQueue(
  curriculum: LiveCurriculumResult,
  lastActiveLessonId?: string,
  completedLessons: string[] = []
): ResolvedLearningQueue {
  const { allNodes, nodesMap, nodeIndexMap, phases } = curriculum;
  const completedSet = new Set(completedLessons);

  // 1. Resolve Active In-Progress Lesson (O(1) lookup if lastActiveLessonId is in Map)
  let activeNode: DatabaseNode | undefined;
  if (lastActiveLessonId && nodesMap.has(lastActiveLessonId)) {
    activeNode = nodesMap.get(lastActiveLessonId);
  } else {
    // Single forward pass to find first incomplete lesson
    activeNode = allNodes.find((n) => !completedSet.has(n.id)) || allNodes[0];
  }

  if (!activeNode && allNodes.length > 0) {
    activeNode = allNodes[0];
  }

  // Canonical fallback if allNodes is empty
  const fallbackNode: DatabaseNode = {
    id: "node-0-1",
    slug: "phase-00-lesson-01-python-basics",
    phase_id: "module-1",
    title: "Lesson 1.1: Python Basics & Data Types",
    subtitle: "Python 3.12 syntax, memory model, and primitive types",
    xp_reward: 100,
    order_index: 1,
  };

  const finalActive = activeNode || fallbackNode;

  // 2. Resolve Next Pedagogical Step (O(1) index lookup)
  const activeIdx = nodeIndexMap.get(finalActive.id) ?? 0;
  let nextNode: DatabaseNode | undefined;

  // Scan forward for next uncompleted lesson
  for (let i = activeIdx + 1; i < allNodes.length; i++) {
    if (!completedSet.has(allNodes[i].id)) {
      nextNode = allNodes[i];
      break;
    }
  }

  // Fallback to immediate next node or first incomplete node
  if (!nextNode) {
    nextNode =
      allNodes[Math.min(activeIdx + 1, allNodes.length - 1)] ||
      allNodes.find((n) => !completedSet.has(n.id) && n.id !== finalActive.id) ||
      allNodes[1] ||
      finalActive;
  }

  // 3. Resolve Relevant Capstone based on active phase (O(1))
  const activePhase = phases.find((p) => p.phaseId === finalActive.phase_id);
  const phaseNum = activePhase ? activePhase.id : 1;
  const matchedCap =
    PRODUCTION_CAPSTONES_2026.find(
      (c) => c.displayPhaseNumber === phaseNum || c.phaseId === phaseNum - 1
    ) || PRODUCTION_CAPSTONES_2026[0];

  return {
    activeLesson: finalActive,
    nextLesson: nextNode,
    activeCapstone: {
      id: matchedCap.projectSlug,
      title: matchedCap.title,
      phaseName: matchedCap.phaseName,
      oneLineHook: matchedCap.oneLineHook,
    },
  };
}
