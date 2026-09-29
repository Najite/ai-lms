"use client";

import { useEffect, useCallback } from "react";
import { useCompetencyStore } from "../stores/use-competency-store";
import { getCompetencyDetailAction } from "../actions/competency-actions";

export function useCompetencyDetail(slug: string) {
  const activeCompetency = useCompetencyStore((state) => state.activeCompetency);
  const isLoading = useCompetencyStore((state) => state.isLoading);
  const error = useCompetencyStore((state) => state.error);
  const setActiveCompetency = useCompetencyStore((state) => state.setActiveCompetency);
  const setLoading = useCompetencyStore((state) => state.setLoading);
  const setError = useCompetencyStore((state) => state.setError);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getCompetencyDetailAction({ slug });
      if (res.success && res.data) {
        setActiveCompetency(res.data);
      } else {
        setError(res.error || "Failed to fetch competency details.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [slug, setLoading, setError, setActiveCompetency]);

  useEffect(() => {
    if (!activeCompetency || activeCompetency.slug !== slug) {
      fetchDetail();
    }
  }, [slug, activeCompetency, fetchDetail]);

  return {
    competency: activeCompetency && activeCompetency.slug === slug ? activeCompetency : null,
    isLoading,
    error,
    refetch: fetchDetail,
  };
}
