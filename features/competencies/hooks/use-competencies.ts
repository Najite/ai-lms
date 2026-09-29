"use client";

import { useEffect, useCallback } from "react";
import { useCompetencyStore } from "../stores/use-competency-store";
import { getCompetenciesAction } from "../actions/competency-actions";

export function useCompetencies() {
  const competencies = useCompetencyStore((state) => state.competencies);
  const selectedCategorySlug = useCompetencyStore((state) => state.selectedCategorySlug);
  const isLoading = useCompetencyStore((state) => state.isLoading);
  const error = useCompetencyStore((state) => state.error);
  const setCompetencies = useCompetencyStore((state) => state.setCompetencies);
  const setLoading = useCompetencyStore((state) => state.setLoading);
  const setError = useCompetencyStore((state) => state.setError);

  const fetchCompetencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCompetenciesAction();
      if (res.success && res.data) {
        setCompetencies(res.data);
      } else {
        setError(res.error || "Failed to fetch competencies.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCompetencies]);

  useEffect(() => {
    if (competencies.length === 0) {
      fetchCompetencies();
    }
  }, [competencies.length, fetchCompetencies]);

  const filteredCompetencies = selectedCategorySlug
    ? competencies.filter((c) => c.category?.slug === selectedCategorySlug)
    : competencies;

  return {
    competencies: filteredCompetencies,
    allCompetencies: competencies,
    isLoading,
    error,
    refetch: fetchCompetencies,
  };
}
