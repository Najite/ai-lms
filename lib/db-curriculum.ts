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

// Fetch live curriculum data from Supabase
export async function fetchLiveCurriculum(): Promise<{
  phases: PhaseViewModel[];
  allNodes: DatabaseNode[];
  totalLessons: number;
  totalPhases: number;
}> {
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

    const nodesByPhase: Record<string, DatabaseNode[]> = {};
    for (const node of allNodes) {
      if (!nodesByPhase[node.phase_id]) {
        nodesByPhase[node.phase_id] = [];
      }
      nodesByPhase[node.phase_id].push(node);
    }

    // Ensure within each phase, nodes are ordered monotonically
    for (const phaseId in nodesByPhase) {
      nodesByPhase[phaseId].sort((a, b) => parseNodeRank(a) - parseNodeRank(b));
    }

    const phases = transformDbPhases(dbPhases, nodesByPhase);

    return {
      phases,
      allNodes,
      totalLessons: allNodes.length,
      totalPhases: phases.length,
    };
  } catch (error) {
    console.error("Failed to fetch live curriculum from Supabase:", error);
    return {
      phases: [],
      allNodes: [],
      totalLessons: 0,
      totalPhases: 0,
    };
  }
}
