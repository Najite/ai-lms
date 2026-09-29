import { create } from "zustand";
import type {
  LearningPath,
  LearningPathDetail,
  ModuleWithLessons,
  LessonNavigationContext,
  UserLearningProgress,
  ProgressMetrics,
} from "../types";

export interface LearningState {
  paths: (LearningPath & { metrics: ProgressMetrics })[];
  activePath: LearningPathDetail | null;
  activeModule: ModuleWithLessons | null;
  activeLessonContext: LessonNavigationContext | null;
  progressMap: Record<string, UserLearningProgress>; // keyed by lessonId
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
}

export interface LearningActions {
  setPaths: (paths: (LearningPath & { metrics: ProgressMetrics })[]) => void;
  setActivePath: (path: LearningPathDetail | null) => void;
  setActiveModule: (mod: ModuleWithLessons | null) => void;
  setActiveLessonContext: (context: LessonNavigationContext | null) => void;
  setProgressMap: (records: UserLearningProgress[]) => void;
  updateLessonProgress: (progress: UserLearningProgress) => void;
  setLoading: (isLoading: boolean) => void;
  setActionLoading: (isActionLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useLearningStore = create<LearningState & LearningActions>((set) => ({
  paths: [],
  activePath: null,
  activeModule: null,
  activeLessonContext: null,
  progressMap: {},
  isLoading: false,
  isActionLoading: false,
  error: null,

  setPaths: (paths) => set({ paths }),

  setActivePath: (activePath) => set({ activePath }),

  setActiveModule: (activeModule) => set({ activeModule }),

  setActiveLessonContext: (activeLessonContext) => set({ activeLessonContext }),

  setProgressMap: (records) => {
    const map: Record<string, UserLearningProgress> = {};
    records.forEach((r) => {
      map[r.lessonId] = r;
    });
    set({ progressMap: map });
  },

  updateLessonProgress: (progress) =>
    set((state) => {
      const updatedMap = {
        ...state.progressMap,
        [progress.lessonId]: progress,
      };

      // Also update activeLessonContext if it matches current lesson
      let updatedContext = state.activeLessonContext;
      if (
        state.activeLessonContext &&
        state.activeLessonContext.currentLesson.id === progress.lessonId
      ) {
        updatedContext = {
          ...state.activeLessonContext,
          progress,
        };
      }

      return {
        progressMap: updatedMap,
        activeLessonContext: updatedContext,
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setActionLoading: (isActionLoading) => set({ isActionLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      paths: [],
      activePath: null,
      activeModule: null,
      activeLessonContext: null,
      progressMap: {},
      isLoading: false,
      isActionLoading: false,
      error: null,
    }),
}));
