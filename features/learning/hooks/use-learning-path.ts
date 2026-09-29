"use client";

import { useEffect, useCallback } from "react";
import { useLearningStore } from "../stores/use-learning-store";
import { getLearningPathDetailAction } from "../actions/learning-actions";

export function useLearningPath(pathSlug: string) {
  const activePath = useLearningStore((state) => state.activePath);
  const isLoading = useLearningStore((state) => state.isLoading);
  const error = useLearningStore((state) => state.error);
  const setActivePath = useLearningStore((state) => state.setActivePath);
  const setLoading = useLearningStore((state) => state.setLoading);
  const setError = useLearningStore((state) => state.setError);

  const fetchPath = useCallback(async () => {
    if (!pathSlug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getLearningPathDetailAction({ pathSlug });
      if (res.success && res.data) {
        setActivePath(res.data);
      } else {
        setError(res.error || "Failed to fetch learning path details.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [pathSlug, setLoading, setError, setActivePath]);

  useEffect(() => {
    if (!activePath || activePath.slug !== pathSlug) {
      fetchPath();
    }
  }, [pathSlug, activePath, fetchPath]);

  return {
    path: activePath && activePath.slug === pathSlug ? activePath : null,
    isLoading,
    error,
    refetch: fetchPath,
  };
}
