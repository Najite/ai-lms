import { create } from "zustand";
import type {
  ExerciseWithDetails,
  ExerciseCategory,
  ExerciseAttempt,
  ExerciseSubmission,
  ExerciseCompletion,
  ExerciseEvidence,
  ValidationResultOutput,
  ExerciseHistoryItem,
} from "../types";

/**
 * Exercise Explorer & Definition Store
 */
export interface ExerciseStoreState {
  exercises: ExerciseWithDetails[];
  categories: ExerciseCategory[];
  selectedCategorySlug: string | null;
  activeExercise: ExerciseWithDetails | null;
  isLoading: boolean;
  error: string | null;
}

export interface ExerciseStoreActions {
  setExercises: (exercises: ExerciseWithDetails[]) => void;
  setCategories: (categories: ExerciseCategory[]) => void;
  setSelectedCategorySlug: (slug: string | null) => void;
  setActiveExercise: (exercise: ExerciseWithDetails | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useExerciseStore = create<ExerciseStoreState & ExerciseStoreActions>(
  (set) => ({
    exercises: [],
    categories: [],
    selectedCategorySlug: null,
    activeExercise: null,
    isLoading: false,
    error: null,

    setExercises: (exercises) => set({ exercises }),
    setCategories: (categories) => set({ categories }),
    setSelectedCategorySlug: (selectedCategorySlug) =>
      set({ selectedCategorySlug }),
    setActiveExercise: (activeExercise) => set({ activeExercise }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    reset: () =>
      set({
        exercises: [],
        categories: [],
        selectedCategorySlug: null,
        activeExercise: null,
        isLoading: false,
        error: null,
      }),
  })
);

export const ExerciseStore = useExerciseStore;

/**
 * Exercise Attempt Store
 */
export interface ExerciseAttemptStoreState {
  attempts: ExerciseAttempt[];
  activeAttempt: ExerciseAttempt | null;
  isStartingAttempt: boolean;
  error: string | null;
}

export interface ExerciseAttemptStoreActions {
  setAttempts: (attempts: ExerciseAttempt[]) => void;
  setActiveAttempt: (attempt: ExerciseAttempt | null) => void;
  setStartingAttempt: (isStarting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useExerciseAttemptStore = create<
  ExerciseAttemptStoreState & ExerciseAttemptStoreActions
>((set) => ({
  attempts: [],
  activeAttempt: null,
  isStartingAttempt: false,
  error: null,

  setAttempts: (attempts) => set({ attempts }),
  setActiveAttempt: (activeAttempt) => set({ activeAttempt }),
  setStartingAttempt: (isStartingAttempt) => set({ isStartingAttempt }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      attempts: [],
      activeAttempt: null,
      isStartingAttempt: false,
      error: null,
    }),
}));

export const ExerciseAttemptStore = useExerciseAttemptStore;

/**
 * Exercise Submission Store
 */
export interface ExerciseSubmissionStoreState {
  codeBuffer: string;
  latestSubmission: ExerciseSubmission | null;
  latestValidationOutput: ValidationResultOutput | null;
  isSubmitting: boolean;
  error: string | null;
}

export interface ExerciseSubmissionStoreActions {
  setCodeBuffer: (code: string) => void;
  setLatestSubmission: (submission: ExerciseSubmission | null) => void;
  setLatestValidationOutput: (output: ValidationResultOutput | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useExerciseSubmissionStore = create<
  ExerciseSubmissionStoreState & ExerciseSubmissionStoreActions
>((set) => ({
  codeBuffer: "",
  latestSubmission: null,
  latestValidationOutput: null,
  isSubmitting: false,
  error: null,

  setCodeBuffer: (codeBuffer) => set({ codeBuffer }),
  setLatestSubmission: (latestSubmission) => set({ latestSubmission }),
  setLatestValidationOutput: (latestValidationOutput) =>
    set({ latestValidationOutput }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      codeBuffer: "",
      latestSubmission: null,
      latestValidationOutput: null,
      isSubmitting: false,
      error: null,
    }),
}));

export const ExerciseSubmissionStore = useExerciseSubmissionStore;

/**
 * Exercise Completion & History Store
 */
export interface ExerciseCompletionStoreState {
  completion: ExerciseCompletion | null;
  evidence: ExerciseEvidence[];
  history: ExerciseHistoryItem[];
  isCompleting: boolean;
  isLoadingHistory: boolean;
  error: string | null;
}

export interface ExerciseCompletionStoreActions {
  setCompletion: (completion: ExerciseCompletion | null) => void;
  setEvidence: (evidence: ExerciseEvidence[]) => void;
  setHistory: (history: ExerciseHistoryItem[]) => void;
  setIsCompleting: (isCompleting: boolean) => void;
  setIsLoadingHistory: (isLoadingHistory: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useExerciseCompletionStore = create<
  ExerciseCompletionStoreState & ExerciseCompletionStoreActions
>((set) => ({
  completion: null,
  evidence: [],
  history: [],
  isCompleting: false,
  isLoadingHistory: false,
  error: null,

  setCompletion: (completion) => set({ completion }),
  setEvidence: (evidence) => set({ evidence }),
  setHistory: (history) => set({ history }),
  setIsCompleting: (isCompleting) => set({ isCompleting }),
  setIsLoadingHistory: (isLoadingHistory) => set({ isLoadingHistory }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      completion: null,
      evidence: [],
      history: [],
      isCompleting: false,
      isLoadingHistory: false,
      error: null,
    }),
}));

export const useExerciseHistoryStore = useExerciseCompletionStore;
export const ExerciseHistoryStore = useExerciseCompletionStore;
