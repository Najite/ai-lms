"use client";

import { useEffect, useCallback } from "react";
import { useCompetencyStore } from "../stores/use-competency-store";
import { getLessonCompetenciesAction } from "../actions/competency-actions";

export function useLessonCompetencies(lessonId: string) {
  const lessonCompetenciesMap = useCompetencyStore((state) => state.lessonCompetenciesMap);
  const isLoading = useCompetencyStore((state) => state.isLoading);
  const error = useCompetencyStore((state) => state.error);
  const setLessonCompetencies = useCompetencyStore((state) => state.setLessonCompetencies);
  const setLoading = useCompetencyStore((state) => state.setLoading);
  const setError = useCompetencyStore((state) => state.setError);

  const fetchCompetencies = useCallback(async () => {
    if (!lessonId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getLessonCompetenciesAction({ lessonId });
      if (res.success && res.data) {
        setLessonCompetencies(lessonId, res.data);
      } else {
        setError(res.error || "Failed to load lesson competencies.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [lessonId, setLoading, setError, setLessonCompetencies]);

  const items = lessonCompetenciesMap[lessonId];

  useEffect(() => {
    if (!items) {
      fetchCompetencies();
    }
  }, [lessonId, items, fetchCompetencies]);

  return {
    competencies: items || [],
    isLoading,
    error,
    refetch: fetchCompetencies,
  };
}
