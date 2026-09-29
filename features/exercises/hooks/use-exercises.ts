"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getExercisesAction,
  getExerciseCategoriesAction,
  getExerciseDetailAction,
  getExercisesByLessonAction,
  startExerciseAction,
  submitExerciseAction,
  completeExerciseAction,
  getUserExerciseHistoryAction,
} from "../actions/exercise-actions";
import {
  useExerciseStore,
  useExerciseAttemptStore,
  useExerciseSubmissionStore,
  useExerciseCompletionStore,
} from "../stores/use-exercise-store";
import type {
  ExerciseWithDetails,
} from "../types";

/**
 * Hook to manage exercise catalog and categories
 */
export function useExercises(options?: {
  lessonId?: string;
  categoryId?: string;
}) {
  const {
    exercises,
    categories,
    selectedCategorySlug,
    isLoading,
    error,
    setExercises,
    setCategories,
    setSelectedCategorySlug,
    setLoading,
    setError,
  } = useExerciseStore();

  const lessonId = options?.lessonId;
  const categoryId = options?.categoryId;

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [exRes, catRes] = await Promise.all([
        getExercisesAction({ lessonId, categoryId }),
        getExerciseCategoriesAction(),
      ]);

      if (exRes.success && exRes.data) {
        setExercises(exRes.data);
      } else {
        setError(exRes.error || "Failed to load exercises.");
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load exercises.");
    } finally {
      setLoading(false);
    }
  }, [lessonId, categoryId, setCategories, setError, setExercises, setLoading]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [exRes, catRes] = await Promise.all([
          getExercisesAction({ lessonId, categoryId }),
          getExerciseCategoriesAction(),
        ]);

        if (!ignore) {
          if (exRes.success && exRes.data) {
            setExercises(exRes.data);
          } else {
            setError(exRes.error || "Failed to load exercises.");
          }

          if (catRes.success && catRes.data) {
            setCategories(catRes.data);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load exercises.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [lessonId, categoryId, setCategories, setError, setExercises, setLoading]);

  const filteredExercises = selectedCategorySlug
    ? exercises.filter((ex) => ex.category.slug === selectedCategorySlug)
    : exercises;

  return {
    exercises: filteredExercises,
    allExercises: exercises,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    isLoading,
    error,
    refetch: fetchExercises,
  };
}

/**
 * Hook to manage a single interactive exercise workspace session
 */
export function useExerciseDetail(idOrSlug: string) {
  const { activeExercise, setActiveExercise } = useExerciseStore();
  const {
    attempts,
    activeAttempt,
    isStartingAttempt,
    setAttempts,
    setActiveAttempt,
    setStartingAttempt,
  } = useExerciseAttemptStore();

  const {
    codeBuffer,
    latestSubmission,
    latestValidationOutput,
    isSubmitting,
    setCodeBuffer,
    setLatestSubmission,
    setLatestValidationOutput,
    setIsSubmitting,
  } = useExerciseSubmissionStore();

  const {
    completion,
    evidence,
    isCompleting,
    setCompletion,
    setEvidence,
    setIsCompleting,
  } = useExerciseCompletionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!idOrSlug) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await getExerciseDetailAction(idOrSlug);
      if (res.success && res.data) {
        const { exercise, attempts: atts, activeAttempt: actAtt, latestSubmission: lSub, completion: comp, evidence: evList } =
          res.data;

        setActiveExercise(exercise);
        setAttempts(atts);
        setActiveAttempt(actAtt);
        setCompletion(comp);
        setEvidence(evList);

        if (lSub) {
          setLatestSubmission(lSub);
          setLatestValidationOutput(lSub.validationOutput);
          setCodeBuffer(lSub.submittedCode);
        } else {
          setCodeBuffer(exercise.starterCode);
          setLatestSubmission(null);
          setLatestValidationOutput(null);
        }
      } else {
        setErrorMessage(res.error || "Exercise not found.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load exercise details.");
    } finally {
      setIsLoading(false);
    }
  }, [
    idOrSlug,
    setActiveExercise,
    setAttempts,
    setActiveAttempt,
    setCompletion,
    setEvidence,
    setLatestSubmission,
    setLatestValidationOutput,
    setCodeBuffer,
  ]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!idOrSlug) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await getExerciseDetailAction(idOrSlug);
        if (!ignore) {
          if (res.success && res.data) {
            const { exercise, attempts: atts, activeAttempt: actAtt, latestSubmission: lSub, completion: comp, evidence: evList } =
              res.data;

            setActiveExercise(exercise);
            setAttempts(atts);
            setActiveAttempt(actAtt);
            setCompletion(comp);
            setEvidence(evList);

            if (lSub) {
              setLatestSubmission(lSub);
              setLatestValidationOutput(lSub.validationOutput);
              setCodeBuffer(lSub.submittedCode);
            } else {
              setCodeBuffer(exercise.starterCode);
              setLatestSubmission(null);
              setLatestValidationOutput(null);
            }
          } else {
            setErrorMessage(res.error || "Exercise not found.");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to load exercise details.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [
    idOrSlug,
    setActiveExercise,
    setAttempts,
    setActiveAttempt,
    setCompletion,
    setEvidence,
    setLatestSubmission,
    setLatestValidationOutput,
    setCodeBuffer,
  ]);

  // Start attempt
  const startAttempt = useCallback(async () => {
    if (!activeExercise) return;
    setStartingAttempt(true);
    setErrorMessage(null);
    try {
      const res = await startExerciseAction({ exerciseId: activeExercise.id });
      if (res.success && res.data) {
        setActiveAttempt(res.data);
        setAttempts([res.data, ...attempts]);
      } else {
        setErrorMessage(res.error || "Failed to start attempt.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to start attempt.");
    } finally {
      setStartingAttempt(false);
    }
  }, [activeExercise, attempts, setActiveAttempt, setAttempts, setStartingAttempt]);

  // Submit code solution
  const submitSolution = useCallback(
    async (codeToSubmit?: string) => {
      if (!activeExercise) return;
      const code = codeToSubmit !== undefined ? codeToSubmit : codeBuffer;
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        let attempt = activeAttempt;
        if (!attempt) {
          const startRes = await startExerciseAction({ exerciseId: activeExercise.id });
          if (!startRes.success || !startRes.data) {
            setErrorMessage(startRes.error || "Failed to start attempt before submitting.");
            setIsSubmitting(false);
            return;
          }
          attempt = startRes.data;
          setActiveAttempt(attempt);
        }

        const res = await submitExerciseAction({
          exerciseId: activeExercise.id,
          attemptId: attempt.id,
          submittedCode: code,
        });

        if (res.success && res.data) {
          setLatestSubmission(res.data.submission);
          setLatestValidationOutput(res.data.validationOutput);
          setActiveAttempt(res.data.attempt);
        } else {
          setErrorMessage(res.error || "Submission failed.");
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to submit solution.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      activeExercise,
      codeBuffer,
      activeAttempt,
      setActiveAttempt,
      setLatestSubmission,
      setLatestValidationOutput,
      setIsSubmitting,
    ]
  );

  // Complete exercise
  const completeExercise = useCallback(async () => {
    if (!activeExercise || !activeAttempt) return;
    setIsCompleting(true);
    setErrorMessage(null);

    try {
      const res = await completeExerciseAction({
        exerciseId: activeExercise.id,
        attemptId: activeAttempt.id,
      });

      if (res.success && res.data) {
        setCompletion(res.data.completion);
        setActiveAttempt(res.data.attempt);
        setEvidence(res.data.evidence);
      } else {
        setErrorMessage(res.error || "Completion failed.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to complete exercise.");
    } finally {
      setIsCompleting(false);
    }
  }, [
    activeExercise,
    activeAttempt,
    setCompletion,
    setActiveAttempt,
    setEvidence,
    setIsCompleting,
  ]);

  return {
    exercise: activeExercise,
    attempts,
    activeAttempt,
    latestSubmission,
    latestValidationOutput,
    completion,
    evidence,
    codeBuffer,
    setCodeBuffer,
    isLoading,
    isStartingAttempt,
    isSubmitting,
    isCompleting,
    errorMessage,
    startAttempt,
    submitSolution,
    completeExercise,
    refetch: fetchDetail,
  };
}

/**
 * Hook to fetch exercises for a given lesson
 */
export function useLessonExercises(lessonId: string) {
  const [exercises, setExercises] = useState<ExerciseWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessonExercises = useCallback(async () => {
    if (!lessonId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getExercisesByLessonAction(lessonId);
      if (res.success && res.data) {
        setExercises(res.data);
      } else {
        setError(res.error || "Failed to load lesson exercises.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load lesson exercises.");
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getExercisesByLessonAction(lessonId);
        if (!ignore) {
          if (res.success && res.data) {
            setExercises(res.data);
          } else {
            setError(res.error || "Failed to load lesson exercises.");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Failed to load lesson exercises.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    if (lessonId) {
      load();
    }
    return () => {
      ignore = true;
    };
  }, [lessonId]);

  return { exercises, isLoading, error, refetch: fetchLessonExercises };
}

/**
 * Hook to fetch user's full exercise history
 */
export function useExerciseHistory() {
  const { history, isLoadingHistory, error, setHistory, setIsLoadingHistory, setError } =
    useExerciseCompletionStore();

  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setError(null);
    try {
      const res = await getUserExerciseHistoryAction();
      if (res.success && res.data) {
        setHistory(res.data);
      } else {
        setError(res.error || "Failed to load exercise history.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load exercise history.");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [setHistory, setIsLoadingHistory, setError]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading: isLoadingHistory, error, refetch: fetchHistory };
}
