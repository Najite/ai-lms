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

export class LessonUnavailableError extends Error {
  constructor(lessonId: string) {
    super(`Lesson ${lessonId} is unavailable. Retry when the connection is restored.`);
    this.name = "LessonUnavailableError";
  }
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
import { withExponentialBackoff } from "@/lib/network-resilience";

export interface LiveCurriculumResult {
  phases: PhaseViewModel[];
  allNodes: DatabaseNode[];
  nodesMap: Map<string, DatabaseNode>;
  nodeIndexMap: Map<string, number>;
  nodesByPhase: Record<string, DatabaseNode[]>;
  totalLessons: number;
  totalPhases: number;
}

export interface DatabaseNodeDetail {
  id: string;
  title: string;
  phase_id: string;
  handbook_markdown: string;
  starter_code: Record<string, string> | string;
  test_suite: any;
  defense_prompts?: any;
  criteria?: string;
  failure_mode?: string;
  xp_reward?: number;
}

const CATALOG_CACHE_KEY = "ai_lms_curriculum_catalog_v2";
// Bump this whenever the handbook contract changes so stale local lesson
// content cannot hide newly populated Supabase content.
const LESSON_DETAIL_PREFIX = "ai_lms_lesson_detail_v7_";
/** Bookkeeping key holding the LRU order of cached lesson handbooks. */
const LESSON_DETAIL_INDEX_KEY = "ai_lms_lesson_detail_index_v7";

/**
 * Hard cap on cached lesson handbooks.
 *
 * Each handbook is 5-20 kB. 700 lessons would be 3.5-14 MB against a ~5 MB
 * localStorage quota, so the cache is bounded and evicted oldest-first. Before
 * this existed the write was unbounded and its QuotaExceededError was swallowed
 * by an empty `catch {}`, which silently stopped caching mid-curriculum.
 */
const MAX_CACHED_LESSON_DETAILS = 40;

/**
 * Minimum gap between background revalidations of an already-warm catalog.
 * Prevents a burst of mounted consumers from turning into a request storm on 2G.
 */
const MIN_REVALIDATE_INTERVAL_MS = 60_000;

// In-memory singleton cache and in-flight promise deduplication
let memoryCachedCurriculum: LiveCurriculumResult | null = null;
let inFlightCurriculumPromise: Promise<LiveCurriculumResult> | null = null;
let lastRevalidatedAt = 0;
const memoryLessonDetails = new Map<string, DatabaseNodeDetail>();

/**
 * Catalog subscribers.
 *
 * Six components need this data. Before this existed each one owned a private
 * copy plus a private `isLoading`, and each had to `await` a network round trip
 * to find out what to render — even when the catalog was already on disk. The
 * store learned this lesson for progress state; the curriculum had no equivalent.
 */
const curriculumSubscribers = new Set<() => void>();

function notifyCurriculumSubscribers(): void {
  curriculumSubscribers.forEach((listener) => {
    listener();
  });
}

/**
 * Subscribes a reader to catalog changes. `useSyncExternalStore` requires this
 * function to be referentially stable, so it is a module-level declaration.
 */
export function subscribeToCurriculum(listener: () => void): () => void {
  curriculumSubscribers.add(listener);
  return () => {
    curriculumSubscribers.delete(listener);
  };
}

/** Server snapshot. Always `null` so hydration cannot disagree with cached client state. */
export function getServerCurriculumSnapshot(): null {
  return null;
}

/** Publishes a new catalog to every mounted consumer. */
function commitCurriculum(result: LiveCurriculumResult): void {
  memoryCachedCurriculum = result;
  lastRevalidatedAt = Date.now();
  notifyCurriculumSubscribers();
}

// Synchronously hydrate from persistent local storage on client boot
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const hasValidShape = parsed && Array.isArray(parsed.phases) && Array.isArray(parsed.allNodes);
      const isLegacyCatalog =
        parsed &&
        (parsed.allNodes?.length !== 700 || parsed.phases?.length !== 14);

      if (hasValidShape && !isLegacyCatalog) {
        const nodesMap = new Map<string, DatabaseNode>();
        const nodeIndexMap = new Map<string, number>();
        const nodesByPhase: Record<string, DatabaseNode[]> = {};

        parsed.allNodes.forEach((node: DatabaseNode, idx: number) => {
          nodesMap.set(node.id, node);
          nodeIndexMap.set(node.id, idx);
          if (!nodesByPhase[node.phase_id]) {
            nodesByPhase[node.phase_id] = [];
          }
          nodesByPhase[node.phase_id].push(node);
        });

        memoryCachedCurriculum = {
          phases: parsed.phases,
          allNodes: parsed.allNodes,
          nodesMap,
          nodeIndexMap,
          nodesByPhase,
          totalLessons: parsed.allNodes.length,
          totalPhases: parsed.phases.length,
        };
      } else if (isLegacyCatalog) {
        localStorage.removeItem(CATALOG_CACHE_KEY);
      }
    }
  } catch (err) {
    console.warn("Could not hydrate curriculum catalog from localStorage", err);
  }
}

/**
 * Returns the in-memory or persisted cached curriculum synchronously if available.
 * Time complexity: O(1)
 */
export function getLiveCurriculumSync(): LiveCurriculumResult | null {
  return memoryCachedCurriculum;
}

/**
 * Runs the actual catalog query exactly once, ever, while in flight.
 * `withExponentialBackoff` handles 2G packet loss; `Promise.all` keeps the
 * phases and nodes round trips concurrent rather than serialized.
 */
function runCurriculumFetch(): Promise<LiveCurriculumResult> {
  if (inFlightCurriculumPromise) {
    return inFlightCurriculumPromise;
  }

  inFlightCurriculumPromise = (async () => {
    try {
      const [phasesRes, nodesRes] = await withExponentialBackoff(
        async (_attempt, _signal) => {
          return await Promise.all([
            supabase
              .from("curriculum_phases")
              .select("*")
              .order("order_index", { ascending: true }),
            supabase
              .from("curriculum_nodes")
              .select("id, slug, phase_id, title, subtitle, xp_reward, order_index")
              .order("order_index", { ascending: true }),
          ]);
        },
        { maxRetries: 3, baseDelayMs: 600, timeoutMs: 7000 }
      );

      if (phasesRes.error) throw phasesRes.error;
      if (nodesRes.error) throw nodesRes.error;

      const dbPhases: DatabasePhase[] = phasesRes.data || [];
      let allNodes: DatabaseNode[] = nodesRes.data || [];

      if ((dbPhases.length === 0 || allNodes.length === 0) && memoryCachedCurriculum) {
        return memoryCachedCurriculum;
      }

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

      commitCurriculum(result);

      // Save to persistent storage for offline & instant 2G boot
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            CATALOG_CACHE_KEY,
            JSON.stringify({
              phases,
              allNodes: allNodes.map((n) => ({
                id: n.id,
                slug: n.slug,
                phase_id: n.phase_id,
                title: n.title,
                subtitle: n.subtitle,
                xp_reward: n.xp_reward,
                order_index: n.order_index,
              })),
            })
          );
        } catch (storageErr) {
          console.warn("Storage quota exceeded when persisting curriculum catalog", storageErr);
        }
      }

      return result;
    } catch (error) {
      console.warn("Network query failed; falling back to persistent cache if available", error);
      if (memoryCachedCurriculum) {
        return memoryCachedCurriculum;
      }
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

/**
 * Reads the curriculum with **stale-while-revalidate** semantics.
 *
 * Behaviour contract:
 *  · Warm cache  → resolves on the current microtask with the cached value and
 *                  schedules at most one background revalidation. It never
 *                  blocks a render on the network.
 *  · Cold cache  → awaits the single deduped fetch (there is nothing to paint),
 *                  and commits the result to every subscriber.
 *  · `forceRefresh` → always awaits the network and commits the result.
 *
 * The previous revision only short-circuited to cache when the browser was
 * offline, so being *online* made the app slower: every one of the six mounted
 * consumers re-issued the same ~100 kB / 700-row query and gated its own
 * spinner on the answer.
 */
export async function fetchLiveCurriculum(forceRefresh = false): Promise<LiveCurriculumResult> {
  if (!forceRefresh && memoryCachedCurriculum) {
    const revalidateDue = Date.now() - lastRevalidatedAt > MIN_REVALIDATE_INTERVAL_MS;
    if (revalidateDue && inFlightCurriculumPromise === null) {
      const isOffline = typeof window !== "undefined" && !navigator.onLine;
      if (!isOffline) {
        // Deliberately not awaited: a stale paint beats a correct spinner on 2G.
        void runCurriculumFetch().catch(() => {
          /* handled inside runCurriculumFetch */
        });
      }
    }
    return memoryCachedCurriculum;
  }

  return runCurriculumFetch();
}

/**
 * LRU order of cached lesson details, most-recently-used last.
 * Hydrated once from localStorage so eviction survives page reloads.
 */
function readLessonDetailLru(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LESSON_DETAIL_INDEX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

let lessonDetailLru: string[] = readLessonDetailLru();

/**
 * Persists one lesson handbook under a bounded, oldest-first-evicted cache.
 *
 * A quota failure is *reportable*: the previous implementation wrote into an
 * empty `catch {}`, so caching silently stopped once the quota filled and the
 * learner lost offline access to everything they had not already opened.
 */
function persistLessonDetail(lessonId: string, detail: DatabaseNodeDetail): void {
  if (typeof window === "undefined") return;

  const nextLru = [lessonId, ...lessonDetailLru.filter((id) => id !== lessonId)];
  const evicted = nextLru.splice(MAX_CACHED_LESSON_DETAILS);

  try {
    localStorage.setItem(LESSON_DETAIL_PREFIX + lessonId, JSON.stringify(detail));
    for (const staleId of evicted) {
      localStorage.removeItem(LESSON_DETAIL_PREFIX + staleId);
    }
    localStorage.setItem(LESSON_DETAIL_INDEX_KEY, JSON.stringify(nextLru));
    lessonDetailLru = nextLru;
  } catch (err) {
    // Free the tail and retry once: a full cache must not stop the newest lesson
    // from being cached.
    try {
      for (const staleId of nextLru.slice(-Math.ceil(MAX_CACHED_LESSON_DETAILS / 2))) {
        localStorage.removeItem(LESSON_DETAIL_PREFIX + staleId);
      }
      localStorage.setItem(LESSON_DETAIL_PREFIX + lessonId, JSON.stringify(detail));
      lessonDetailLru = nextLru.slice(0, Math.ceil(MAX_CACHED_LESSON_DETAILS / 2));
    } catch (retryErr) {
      console.warn(
        `[curriculum] Dropping local cache of lesson "${lessonId}" — localStorage is full.`,
        retryErr
      );
    }
    void err;
  }
}

/**
 * On-demand single lesson detail fetcher.
 * Loads ~4KB payload for the active lesson rather than downloading 3MB across all 700 lessons.
 * Caches persistently in localStorage for full offline availability, LRU-bounded.
 */
export async function fetchLessonDetail(lessonId: string): Promise<DatabaseNodeDetail> {
  // 1. Check in-memory cache
  if (memoryLessonDetails.has(lessonId)) {
    return memoryLessonDetails.get(lessonId)!;
  }

  // 2. Check localStorage persistent cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LESSON_DETAIL_PREFIX + lessonId);
      if (raw) {
        const parsed: DatabaseNodeDetail = JSON.parse(raw);
        memoryLessonDetails.set(lessonId, parsed);
        // Promote to most-recently-used. The persisted index is only rewritten on
        // write, so a hit never costs a localStorage write.
        lessonDetailLru = [lessonId, ...lessonDetailLru.filter((id) => id !== lessonId)];
        return parsed;
      }
    } catch {}
  }

  // Never return executable placeholder content. A placeholder test can award
  // completion when the real lesson is unavailable.
  if (typeof window !== "undefined" && !navigator.onLine) {
    throw new LessonUnavailableError(lessonId);
  }

  // 4. Fetch on demand from Supabase with exponential retry
  try {
    const res = await withExponentialBackoff(
      async (_attempt, _signal) => {
        return await supabase
          .from("curriculum_nodes")
          .select("id, title, phase_id, handbook_markdown, starter_code, test_suite, defense_prompts, xp_reward")
          .eq("id", lessonId)
          .single();
      },
      { maxRetries: 3, baseDelayMs: 500, timeoutMs: 6000 }
    );

    if (res.data) {
      const d = res.data;
      let criteria: string | undefined;
      let failure_mode: string | undefined;

      if (typeof d.test_suite === "object" && d.test_suite !== null) {
        criteria = d.test_suite["verification_criteria"];
        failure_mode = d.test_suite["failure_mode"];
      }

      const detail: DatabaseNodeDetail = {
        id: d.id,
        title: d.title,
        phase_id: d.phase_id,
        handbook_markdown: d.handbook_markdown || "# Lesson Overview\n\nContent available.",
        starter_code: d.starter_code || "# Write code\npass\n",
        test_suite: d.test_suite || "# Test suite\nassert True\n",
        defense_prompts: d.defense_prompts,
        criteria,
        failure_mode,
        xp_reward: d.xp_reward || 100,
      };

      memoryLessonDetails.set(lessonId, detail);

      // Persist in localStorage (bounded LRU) for offline availability.
      persistLessonDetail(lessonId, detail);

      return detail;
    }
  } catch (err) {
    console.warn(`Failed to fetch on-demand lesson detail for ${lessonId}`, err);
    if (err instanceof LessonUnavailableError) throw err;
  }

  throw new LessonUnavailableError(lessonId);
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
