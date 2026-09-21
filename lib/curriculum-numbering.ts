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

/**
 * Parses a node ID (e.g. "node-0-1", "node-1-12") or title and returns 1-indexed phase and lesson numbers.
 */
export function parseLessonCoordinates(nodeId: string, originalTitle?: string): FormattedLessonNumber {
  let phaseNum = 1;
  let lessonIdx = 1;

  const nodeMatch = nodeId.match(/node-(\d+)-(\d+)/);
  if (nodeMatch) {
    const rawPhase = parseInt(nodeMatch[1], 10);
    const rawLesson = parseInt(nodeMatch[2], 10);
    // 0-based DB phase -> 1-based display phase
    phaseNum = rawPhase + 1;
    lessonIdx = rawLesson;
  } else if (originalTitle) {
    const titleMatch = originalTitle.match(/Lesson\s+(\d+)\.(\d+)/i);
    if (titleMatch) {
      const rawPhase = parseInt(titleMatch[1], 10);
      const rawLesson = parseInt(titleMatch[2], 10);
      phaseNum = rawPhase + 1;
      lessonIdx = rawLesson;
    }
  }

  const cleanTitleCore = originalTitle
    ? originalTitle.replace(/^Lesson\s+[\d.]+:\s*/i, "").replace(/^Phase\s+\d+:\s*/i, "")
    : "Module";

  return {
    phaseNumber: phaseNum,
    lessonIndex: lessonIdx,
    displayPhase: `Phase ${phaseNum}`,
    displayLesson: `Lesson ${phaseNum}.${lessonIdx}`,
    displayTitle: `Lesson ${phaseNum}.${lessonIdx}: ${cleanTitleCore}`,
  };
}

/**
 * Returns formatted phase title (e.g., "Phase 1: Computing & Developer Environment")
 */
export function formatPhaseTitle(rawOrderIndexOrId: number | string, originalTitle?: string): string {
  let phaseNum = 1;
  if (typeof rawOrderIndexOrId === "number") {
    phaseNum = rawOrderIndexOrId + 1;
  } else {
    const m = rawOrderIndexOrId.match(/phase-(\d+)/);
    if (m) {
      phaseNum = parseInt(m[1], 10) + 1;
    }
  }

  const cleanTitle = originalTitle
    ? originalTitle.replace(/^Phase\s+\d+:\s*/i, "")
    : "";

  return cleanTitle ? `Phase ${phaseNum}: ${cleanTitle}` : `Phase ${phaseNum}`;
}

/**
 * Returns formatted lab identifier (e.g., "Lab 1.1.1", "Lab 2.4.6")
 */
export function formatLabIdentifier(lessonId: string, orderIndex: number): string {
  const coords = parseLessonCoordinates(lessonId);
  return `Lab ${coords.phaseNumber}.${coords.lessonIndex}.${orderIndex}`;
}
