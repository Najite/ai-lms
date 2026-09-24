/**
 * Verified curriculum totals.
 *
 * These are the **measured** values of the live `curriculum_nodes` /
 * `curriculum_phases` tables, not aspirations. Measured 2026-09-23:
 *
 *   curriculum_nodes  → content-range: 0-0/700
 *   curriculum_phases → content-range: 0-0/14
 *   13 modules × 50 lessons, plus module 14 = node-13-1..20 + node-14-1..30
 *
 * Re-verify at any time with:
 *   node scripts/verify-curriculum-integrity.mjs
 *
 * Rules of use:
 *  1. A surface that can reach the live catalog MUST read `curriculum.totalLessons`
 *     from `useCurriculumCatalog()` instead of this constant.
 *  2. This constant exists only for surfaces that render before/without the
 *     catalog (server components, share metadata, error shells). Never type a
 *     bare lesson count into JSX again — the previous revision advertised 520,
 *     600, 15 phases and "100% of Lessons" against a 700-lesson database.
 */
export const CURRICULUM_META = {
  /** Number of modules (`curriculum_phases` rows). */
  modules: 14,
  /** Uniform lesson count per module (`order_index` 1..50 in every module). */
  lessonsPerModule: 50,
  /** `curriculum_nodes` row count. Must equal modules × lessonsPerModule. */
  totalLessons: 700,
  /** Entries in `PRODUCTION_CAPSTONES_2026` (module milestone capstones). */
  totalCapstones: 14,
} as const;

/** `700` → `"700"`. Kept as a function so call sites read intention, not formatting. */
export function formatLessonTotal(total: number = CURRICULUM_META.totalLessons): string {
  return total.toLocaleString("en-US");
}
