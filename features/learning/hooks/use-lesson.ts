"use client";

import { useEffect, useCallback } from "react";
import { useLearningStore } from "../stores/use-learning-store";
import {
  getLessonDetailAction,
  startLessonAction,
  completeLessonAction,
} from "../actions/learning-actions";

export function useLesson(pathSlug: string, moduleSlug: string, lessonSlug: string) {
  const activeLessonContext = useLearningStore((state) => state.activeLessonContext);
  const isLoading = useLearningStore((state) => state.isLoading);
  const isActionLoading = useLearningStore((state) => state.isActionLoading);
  const error = useLearningStore((state) => state.error);
  const setActiveLessonContext = useLearningStore((state) => state.setActiveLessonContext);
  const updateLessonProgress = useLearningStore((state) => state.updateLessonProgress);
  const setLoading = useLearningStore((state) => state.setLoading);
  const setActionLoading = useLearningStore((state) => state.setActionLoading);
  const setError = useLearningStore((state) => state.setError);

  const fetchLesson = useCallback(async () => {
    if (!pathSlug || !moduleSlug || !lessonSlug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getLessonDetailAction({ pathSlug, moduleSlug, lessonSlug });
      if (res.success && res.data) {
        setActiveLessonContext(res.data);
      } else {
        setError(res.error || "Failed to load lesson.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [pathSlug, moduleSlug, lessonSlug, setLoading, setError, setActiveLessonContext]);

  useEffect(() => {
    if (
      !activeLessonContext ||
      activeLessonContext.currentLesson.slug !== lessonSlug ||
      activeLessonContext.currentModule.slug !== moduleSlug ||
      activeLessonContext.currentPath.slug !== pathSlug
    ) {
      fetchLesson();
    }
  }, [pathSlug, moduleSlug, lessonSlug, activeLessonContext, fetchLesson]);

  const startLesson = useCallback(async () => {
    if (!pathSlug || !moduleSlug || !lessonSlug) return;
    try {
      setActionLoading(true);
      const res = await startLessonAction({ pathSlug, moduleSlug, lessonSlug });
      if (res.success && res.data) {
        updateLessonProgress(res.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start lesson.");
    } finally {
      setActionLoading(false);
    }
  }, [pathSlug, moduleSlug, lessonSlug, setActionLoading, updateLessonProgress, setError]);

  const completeLesson = useCallback(async () => {
    if (!pathSlug || !moduleSlug || !lessonSlug) return;
    try {
      setActionLoading(true);
      const res = await completeLessonAction({ pathSlug, moduleSlug, lessonSlug });
      if (res.success && res.data) {
        updateLessonProgress(res.data);
        return { success: true, data: res.data };
      } else {
        setError(res.error || "Failed to complete lesson.");
        return { success: false, error: res.error };
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to complete lesson.";
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setActionLoading(false);
    }
  }, [pathSlug, moduleSlug, lessonSlug, setActionLoading, updateLessonProgress, setError]);

  const isCurrent =
    activeLessonContext &&
    activeLessonContext.currentLesson.slug === lessonSlug &&
    activeLessonContext.currentModule.slug === moduleSlug &&
    activeLessonContext.currentPath.slug === pathSlug;

  const currentContext = isCurrent ? activeLessonContext : null;
  const progress = currentContext?.progress || null;
  const isCompleted = progress?.status === "completed";
  const isInProgress = progress?.status === "in_progress";

  return {
    context: currentContext,
    lesson: currentContext?.currentLesson || null,
    module: currentContext?.currentModule || null,
    path: currentContext?.currentPath || null,
    previousLesson: currentContext?.previousLesson || null,
    nextLesson: currentContext?.nextLesson || null,
    progress,
    isCompleted,
    isInProgress,
    isLoading,
    isActionLoading,
    error,
    startLesson,
    completeLesson,
    refetch: fetchLesson,
  };
}
