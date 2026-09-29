"use client";

import { useEffect, useCallback } from "react";
import { useLearningStore } from "../stores/use-learning-store";
import { getModuleDetailAction } from "../actions/learning-actions";

export function useModule(pathSlug: string, moduleSlug: string) {
  const activeModule = useLearningStore((state) => state.activeModule);
  const isLoading = useLearningStore((state) => state.isLoading);
  const error = useLearningStore((state) => state.error);
  const setActiveModule = useLearningStore((state) => state.setActiveModule);
  const setLoading = useLearningStore((state) => state.setLoading);
  const setError = useLearningStore((state) => state.setError);

  const fetchModule = useCallback(async () => {
    if (!pathSlug || !moduleSlug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getModuleDetailAction({ pathSlug, moduleSlug });
      if (res.success && res.data) {
        setActiveModule(res.data.module);
      } else {
        setError(res.error || "Failed to fetch module details.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [pathSlug, moduleSlug, setLoading, setError, setActiveModule]);

  useEffect(() => {
    if (!activeModule || activeModule.slug !== moduleSlug) {
      fetchModule();
    }
  }, [pathSlug, moduleSlug, activeModule, fetchModule]);

  return {
    module: activeModule && activeModule.slug === moduleSlug ? activeModule : null,
    isLoading,
    error,
    refetch: fetchModule,
  };
}
