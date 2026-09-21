import { supabase } from "@/lib/supabase";

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

// Assign clean category based on phase number
export function getCategoryForPhase(phaseNum: number): PhaseViewModel["category"] {
  if (phaseNum === 13) return "Specializations";
  if ([0, 1, 4, 11].includes(phaseNum)) return "Systems";
  if ([2, 3, 8].includes(phaseNum)) return "Algorithms";
  if ([5, 7].includes(phaseNum)) return "Distributed";
  if ([9, 10, 12].includes(phaseNum)) return "AI/ML";
  return "Full-Stack"; // 6, 14
}

const SPECIALIZED_TRACK_DEFINITIONS: Record<"A" | "B" | "C" | "D", { title: string; domain: string; description: string; badge: string; capstone: string }> = {
  A: {
    title: "Track A: Enterprise Product Engineering",
    domain: "Micro-Frontends, Local-First Sync, Canvas 2D/WebGL & Wasm",
    description: "Standalone deep dive into high-performance web applications, module federation, CRDTs (Yjs), and multi-tenant SaaS billing engines.",
    badge: "Product Specialist",
    capstone: "Enterprise Local-First Collaborative Application with Canvas Engine",
  },
  B: {
    title: "Track B: High-Throughput MLOps & Distributed Training",
    domain: "AllReduce, FSDP ZeRO-3, vLLM / TensorRT-LLM, Ray & Feast",
    description: "Standalone specialization in large-scale multi-GPU training clusters, optimizer sharding, custom inference runtimes, and real-time feature stores.",
    badge: "MLOps Specialist",
    capstone: "Distributed FSDP Training Pipeline with vLLM PagedAttention Cluster",
  },
  C: {
    title: "Track C: Systems Security & Cloud Infrastructure Hardening",
    domain: "eBPF (Cilium/Tetragon), mTLS (SPIFFE), HSM Key Management & DevSecOps",
    description: "Standalone specialization in kernel-level security telemetry, zero-trust infrastructure, envelope encryption, and automated adversary red-teaming.",
    badge: "Security Specialist",
    capstone: "Kernel eBPF Threat Monitoring & Zero-Trust Service Mesh Defense",
  },
  D: {
    title: "Track D: Frontier AI Research & Custom Kernel Engineering",
    domain: "DPO / RLHF, Mixture of Experts (MoE), State Space Models & Triton Kernels",
    description: "Standalone specialization in cutting-edge alignment science, sparse MoE routing, Mamba architectures, and GPU kernel programming with OpenAI Triton.",
    badge: "AI Research Specialist",
    capstone: "Sparse MoE Transformer with Custom Triton FP8 Kernels & DPO Alignment",
  },
};

// Map database phases and nodes into UI view models
export function transformDbPhases(
  dbPhases: DatabasePhase[],
  nodesByPhase: Record<string, DatabaseNode[]>
): PhaseViewModel[] {
  return dbPhases.map((p) => {
    const phaseNum = p.order_index;
    const nodes = nodesByPhase[p.id] || [];
    const lessonsCount = nodes.length;

    // Extract subtopics or use realistic 5 per lesson
    const subtopicsCount = lessonsCount * 5;

    // Special handling for Phase 13 standalone tracks
    let tracks: StandaloneTrack[] | undefined = undefined;
    if (phaseNum === 13) {
      tracks = (["A", "B", "C", "D"] as const).map((trackCode) => {
        const def = SPECIALIZED_TRACK_DEFINITIONS[trackCode];
        const trackNodes = nodes.filter((n) => n.title.includes(`Track ${trackCode}`));
        return {
          trackId: `track-${trackCode.toLowerCase()}`,
          trackCode,
          title: def.title,
          domain: def.domain,
          description: def.description,
          badge: def.badge,
          nodes: trackNodes,
          capstoneTitle: def.capstone,
        };
      });
    }

    // Find capstone project if any
    const capstoneNode = nodes.find(
      (n) => n.title.toLowerCase().includes("capstone") || n.title.toLowerCase().includes("project")
    );
    const capstoneTitle = capstoneNode
      ? capstoneNode.title
      : phaseNum === 13
      ? "Choose 1 of 4 Standalone Specialization Capstones"
      : `Phase ${phaseNum} Synthesis Capstone Project`;

    // Extract key topics from lesson titles
    const keyTopics =
      phaseNum === 13
        ? [
            "Track A: Enterprise Product Engineering",
            "Track B: MLOps & Distributed Training (FSDP)",
            "Track C: Systems Security & eBPF Observability",
            "Track D: Frontier AI Research & Triton Kernels",
          ]
        : nodes.slice(0, 5).map((n) => {
            const parts = n.title.split(":");
            return parts.length > 1 ? parts[1].trim() : n.title;
          });

    return {
      id: phaseNum,
      phaseId: p.id,
      slug: `phase-${String(phaseNum).padStart(2, "0")}`,
      title: p.title,
      category: getCategoryForPhase(phaseNum),
      lessonsCount,
      subtopicsCount,
      capstonesCount: phaseNum === 13 ? 4 : 1,
      capstoneTitle,
      description:
        phaseNum === 13
          ? "Four completely independent, standalone engineering tracks designed for advanced career specialization. Select any single track or master all four in parallel."
          : p.description,
      keyTopics: keyTopics.length > 0 ? keyTopics : ["Core Foundations", "Verification Suite", "Architectural Invariants"],
      isSpecializedPhase: phaseNum === 13,
      tracks,
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
        .select("id, slug, phase_id, title, subtitle, xp_reward")
        .order("id", { ascending: true }),
    ]);

    const dbPhases: DatabasePhase[] = phasesRes.data || [];
    let allNodes: DatabaseNode[] = nodesRes.data || [];

    // Helper to naturally sort nodes by phase and lesson index: "node-0-1", "node-0-2", ... "node-0-10"
    const parseNodeRank = (id: string) => {
      const match = id.match(/node-(\d+)-(\d+)/);
      if (match) {
        return parseInt(match[1], 10) * 10000 + parseInt(match[2], 10);
      }
      return 999999;
    };

    allNodes.sort((a, b) => parseNodeRank(a.id) - parseNodeRank(b.id));

    const nodesByPhase: Record<string, DatabaseNode[]> = {};
    for (const node of allNodes) {
      if (!nodesByPhase[node.phase_id]) {
        nodesByPhase[node.phase_id] = [];
      }
      nodesByPhase[node.phase_id].push(node);
    }

    // Ensure within each phase, nodes are ordered monotonically
    for (const phaseId in nodesByPhase) {
      nodesByPhase[phaseId].sort((a, b) => parseNodeRank(a.id) - parseNodeRank(b.id));
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
