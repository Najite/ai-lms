/**
 * Utility functions to consistently format curriculum numbering starting from 1 across the platform.
 * 
 * Rules:
 * 1. Phases start at Phase 1 (Database order_index 0 or 'phase-0' -> Phase 1).
 * 2. Lessons in Phase 0 (node-0-X) are displayed as Lesson 1.X.
 *    Lessons in Phase 1 (node-1-X) are displayed as Lesson 2.X, and so on up to Phase 15.
 * 3. Labs / Hands-on exercises are displayed as Lab <Phase>.<Lesson>.<Drill> (e.g. Lab 1.1.1 through Lab 1.1.6).
 * 4. Exercise tier numbering is 1 to 6.
 */

export interface FormattedLessonNumber {
  phaseNumber: number;
  lessonIndex: number;
  displayPhase: string;
  displayLesson: string;
  displayTitle: string;
}

const PREFIX_MODULE_MAP: Record<number, { moduleNum: number; offset: number }> = {
  0: { moduleNum: 1, offset: 0 },   // Module 1: Python Foundations (node-0-1..50)
  1: { moduleNum: 2, offset: 0 },   // Module 2: Software Craftsmanship & OOP (node-1-1..50)
  2: { moduleNum: 3, offset: 0 },   // Module 3: Discrete Mathematics (node-2-1..35)
  9: { moduleNum: 4, offset: 0 },   // Module 4: Linear Algebra & Autograd (node-9-1..35)
  3: { moduleNum: 5, offset: 0 },   // Module 5: Data Structures & Algorithms (node-3-1..45)
  4: { moduleNum: 6, offset: 0 },   // Module 6: Web Protocols & ASGI (node-4-1..35)
  5: { moduleNum: 7, offset: 0 },   // Module 7: PostgreSQL Internals & Databases (node-5-1..45)
  6: { moduleNum: 8, offset: 0 },   // Module 8: Modern Frontend & Next.js (node-6-1..40)
  8: { moduleNum: 9, offset: 0 },   // Module 9: System Design & Scalability (node-8-1..25)
  7: { moduleNum: 10, offset: 0 },  // Module 10: Distributed Systems & Consensus (node-7-1..35)
  10: { moduleNum: 11, offset: 0 }, // Module 11: Production RAG & Vector Search (node-10-1..35)
  11: { moduleNum: 12, offset: 0 }, // Module 12: Performance Profiling & AI Observability (node-11-1..25)
  12: { moduleNum: 13, offset: 0 }, // Module 13: Autonomous AI Agents & Tool Orchestration (node-12-1..30)
  13: { moduleNum: 14, offset: 0 }, // Module 14 Part 1: Advanced Infra (node-13-1..20)
  14: { moduleNum: 14, offset: 20 },// Module 14 Part 2: Enterprise Capstones (node-14-1..15 -> 21..35)
};

/**
 * Parses a node ID (e.g. "node-0-1", "node-9-1") or title and returns 1-indexed module and lesson numbers.
 */
export function parseLessonCoordinates(nodeId: string, originalTitle?: string): FormattedLessonNumber {
  let moduleNum = 1;
  let lessonIdx = 1;
  let matched = false;

  // AUTHORITY: the node id.
  //
  // PREFIX_MODULE_MAP was verified against all 700 live `curriculum_nodes` rows:
  // node-0..node-12 hold 50 lessons each, node-13 holds 1-20 and node-14 holds
  // 1-30 (both inside module 14), and every module's `order_index` runs 1-50.
  // Deriving the number from the id is therefore exact for the whole catalog.
  //
  // The title regex below is only a fallback for ids outside the map. It used to
  // run first, which let exactly one stale title corrupt its own numbering:
  // `node-3-22` is titled "Lesson 2.22" but lives in module 5, so the app showed
  // it under Module 2 while unlocking it against its module-5 neighbours.
  if (nodeId) {
    const nodeMatch = nodeId.match(/node-(\d+)-(\d+)/);
    if (nodeMatch) {
      const prefix = parseInt(nodeMatch[1], 10);
      const rawLesson = parseInt(nodeMatch[2], 10);
      const mapping = PREFIX_MODULE_MAP[prefix];
      if (mapping) {
        moduleNum = mapping.moduleNum;
        lessonIdx = mapping.offset + rawLesson;
        matched = true;
      }
    }
  }

  // FALLBACK: canonical "Lesson X.Y" title, for any id the map does not cover.
  if (!matched && originalTitle) {
    const titleMatch = originalTitle.match(/Lesson\s+(\d+)\.(\d+)/i);
    if (titleMatch) {
      moduleNum = parseInt(titleMatch[1], 10);
      lessonIdx = parseInt(titleMatch[2], 10);
      matched = true;
    }
  }

  const cleanTitleCore = originalTitle
    ? originalTitle
        .replace(/^Lesson\s+[\d.]+:\s*/i, "")
        .replace(/^Phase\s+\d+:\s*/i, "")
        .replace(/^Module\s+\d+:\s*/i, "")
    : "Module";

  return {
    phaseNumber: moduleNum,
    lessonIndex: lessonIdx,
    displayPhase: `Module ${moduleNum}`,
    displayLesson: `Lesson ${moduleNum}.${lessonIdx}`,
    displayTitle: `Lesson ${moduleNum}.${lessonIdx}: ${cleanTitleCore}`,
  };
}

/**
 * Returns formatted module/phase title (e.g., "Module 1: Programming Foundations & Developer Fluency")
 */
export function formatPhaseTitle(rawOrderIndexOrId: number | string, originalTitle?: string): string {
  if (originalTitle && /^Module\s+\d+/i.test(originalTitle)) {
    return originalTitle;
  }

  let modNum = 1;
  if (typeof rawOrderIndexOrId === "number") {
    modNum = rawOrderIndexOrId + 1;
  } else {
    const modMatch = String(rawOrderIndexOrId).match(/module-(\d+)/i);
    const phaseMatch = String(rawOrderIndexOrId).match(/phase-(\d+)/i);
    if (modMatch) {
      modNum = parseInt(modMatch[1], 10);
    } else if (phaseMatch) {
      modNum = parseInt(phaseMatch[1], 10) + 1;
    }
  }

  const cleanTitle = originalTitle
    ? originalTitle.replace(/^(Phase|Module)\s+\d+:\s*/i, "")
    : "";

  return cleanTitle ? `Module ${modNum}: ${cleanTitle}` : `Module ${modNum}`;
}

/**
 * Returns formatted lab identifier (e.g., "Lab 1.1.1", "Lab 2.4.6")
 */
export function formatLabIdentifier(lessonId: string, orderIndex: number): string {
  const coords = parseLessonCoordinates(lessonId);
  return `Lab ${coords.phaseNumber}.${coords.lessonIndex}.${orderIndex}`;
}
