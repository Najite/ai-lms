"use client";

import { useEffect, useCallback } from "react";
import { useCompetencyStore } from "../stores/use-competency-store";
import { getModuleCompetenciesAction } from "../actions/competency-actions";

export function useModuleCompetencies(moduleId: string) {
  const moduleCompetenciesMap = useCompetencyStore((state) => state.moduleCompetenciesMap);
  const isLoading = useCompetencyStore((state) => state.isLoading);
  const error = useCompetencyStore((state) => state.error);
  const setModuleCompetencies = useCompetencyStore((state) => state.setModuleCompetencies);
  const setLoading = useCompetencyStore((state) => state.setLoading);
  const setError = useCompetencyStore((state) => state.setError);

  const fetchCompetencies = useCallback(async () => {
    if (!moduleId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getModuleCompetenciesAction({ moduleId });
      if (res.success && res.data) {
        setModuleCompetencies(moduleId, res.data);
      } else {
        setError(res.error || "Failed to load module competencies.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [moduleId, setLoading, setError, setModuleCompetencies]);

  const items = moduleCompetenciesMap[moduleId];

  useEffect(() => {
    if (!items) {
      fetchCompetencies();
    }
  }, [moduleId, items, fetchCompetencies]);

  return {
    competencies: items || [],
    isLoading,
    error,
    refetch: fetchCompetencies,
  };
}
