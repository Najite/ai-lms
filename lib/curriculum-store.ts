"use client";

import * as React from "react";
import {
  fetchLiveCurriculum,
  getLiveCurriculumSync,
  getServerCurriculumSnapshot,
  subscribeToCurriculum,
  type LiveCurriculumResult,
} from "./db-curriculum";

export interface CurriculumCatalog {
  /** The catalog, or `null` while a cold boot is still resolving. */
  curriculum: LiveCurriculumResult | null;
  /** True only until the first successful load; a warm cache is never `true`. */
  isLoading: boolean;
}

/**
 * The single curriculum subscription for the whole app.
 *
 * Why `useSyncExternalStore` and not `useState(getLiveCurriculumSync())`:
 * `lib/db-curriculum.ts` hydrates the cache from `localStorage` at module
 * evaluation, which on the client happens *before* the hydration render. Seeding
 * state from it would render client data against server HTML and produce a
 * hydration mismatch. `useSyncExternalStore` is given a `null` server snapshot
 * and swaps to the live cache immediately after hydration, which is the
 * supported way to express "this value only exists in the browser".
 *
 * Guarantees:
 *  · Warm cache → `isLoading` is `false` on the very first client render, so a
 *    view switch on 2G paints curriculum content instead of a spinner.
 *  · Cold cache → exactly one deduped fetch is issued, and every mounted
 *    consumer re-renders together when it commits (see `commitCurriculum`).
 *  · Never throws: the loader resolves with an empty catalog on total failure,
 *    so `isLoading` cannot hang forever behind a dead network.
 */
export function useCurriculumCatalog(): CurriculumCatalog {
  const curriculum = React.useSyncExternalStore(
    subscribeToCurriculum,
    getLiveCurriculumSync,
    getServerCurriculumSnapshot
  );

  // Tracks "a load attempt has settled" so an unreachable database shows the
  // empty state rather than an eternal spinner.
  const [loadSettled, setLoadSettled] = React.useState(false);

  React.useEffect(() => {
    if (curriculum) return;
    let active = true;
    void fetchLiveCurriculum().finally(() => {
      if (active) setLoadSettled(true);
    });
    return () => {
      active = false;
    };
  }, [curriculum]);

  return {
    curriculum,
    isLoading: curriculum === null && !loadSettled,
  };
}

/**
 * Imperative escape hatch for callers outside React (rare).
 * Prefer `useCurriculumCatalog()`.
 */
export function refreshCurriculumCatalog(): Promise<LiveCurriculumResult> {
  return fetchLiveCurriculum(true);
}
