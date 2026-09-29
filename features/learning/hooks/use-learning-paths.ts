"use client";

import { useEffect, useCallback } from "react";
import { useLearningStore } from "../stores/use-learning-store";
import { getLearningPathsAction } from "../actions/learning-actions";

export function useLearningPaths() {
  const paths = useLearningStore((state) => state.paths);
  const isLoading = useLearningStore((state) => state.isLoading);
  const error = useLearningStore((state) => state.error);
  const setPaths = useLearningStore((state) => state.setPaths);
  const setLoading = useLearningStore((state) => state.setLoading);
  const setError = useLearningStore((state) => state.setError);

  const fetchPaths = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLearningPathsAction();
      if (res.success && res.data) {
        setPaths(res.data);
      } else {
        setError(res.error || "Failed to fetch learning paths.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setPaths]);

  useEffect(() => {
    if (paths.length === 0) {
      fetchPaths();
    }
  }, [paths.length, fetchPaths]);

  return {
    paths,
    isLoading,
    error,
    refetch: fetchPaths,
  };
}
