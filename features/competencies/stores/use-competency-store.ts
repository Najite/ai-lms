import { create } from "zustand";
import type {
  CompetencyWithProgress,
  CompetencyCategory,
  CompetencyDetail,
  UserCompetencyProgress,
  Competency,
  CompetencyState,
} from "../types";

export interface CompetencyStoreState {
  competencies: CompetencyWithProgress[];
  categories: CompetencyCategory[];
  selectedCategorySlug: string | null;
  activeCompetency: CompetencyDetail | null;
  moduleCompetenciesMap: Record<string, (Competency & { weight: number; progress?: UserCompetencyProgress | null })[]>;
  lessonCompetenciesMap: Record<
    string,
    (Competency & {
      targetState: CompetencyState;
      contributionPoints: number;
      progress?: UserCompetencyProgress | null;
    })[]
  >;
  userProgressMap: Record<string, UserCompetencyProgress>; // Keyed by competencyId
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
}

export interface CompetencyStoreActions {
  setCompetencies: (competencies: CompetencyWithProgress[]) => void;
  setCategories: (categories: CompetencyCategory[]) => void;
  setSelectedCategorySlug: (slug: string | null) => void;
  setActiveCompetency: (competency: CompetencyDetail | null) => void;
  setModuleCompetencies: (
    moduleId: string,
    items: (Competency & { weight: number; progress?: UserCompetencyProgress | null })[]
  ) => void;
  setLessonCompetencies: (
    lessonId: string,
    items: (Competency & {
      targetState: CompetencyState;
      contributionPoints: number;
      progress?: UserCompetencyProgress | null;
    })[]
  ) => void;
  setUserProgressMap: (records: UserCompetencyProgress[]) => void;
  updateProgress: (progress: UserCompetencyProgress) => void;
  setLoading: (isLoading: boolean) => void;
  setActionLoading: (isActionLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCompetencyStore = create<CompetencyStoreState & CompetencyStoreActions>((set) => ({
  competencies: [],
  categories: [],
  selectedCategorySlug: null,
  activeCompetency: null,
  moduleCompetenciesMap: {},
  lessonCompetenciesMap: {},
  userProgressMap: {},
  isLoading: false,
  isActionLoading: false,
  error: null,

  setCompetencies: (competencies) => set({ competencies }),

  setCategories: (categories) => set({ categories }),

  setSelectedCategorySlug: (selectedCategorySlug) => set({ selectedCategorySlug }),

  setActiveCompetency: (activeCompetency) => set({ activeCompetency }),

  setModuleCompetencies: (moduleId, items) =>
    set((state) => ({
      moduleCompetenciesMap: {
        ...state.moduleCompetenciesMap,
        [moduleId]: items,
      },
    })),

  setLessonCompetencies: (lessonId, items) =>
    set((state) => ({
      lessonCompetenciesMap: {
        ...state.lessonCompetenciesMap,
        [lessonId]: items,
      },
    })),

  setUserProgressMap: (records) => {
    const map: Record<string, UserCompetencyProgress> = {};
    records.forEach((r) => {
      map[r.competencyId] = r;
    });
    set({ userProgressMap: map });
  },

  updateProgress: (progress) =>
    set((state) => {
      const updatedMap = {
        ...state.userProgressMap,
        [progress.competencyId]: progress,
      };

      const updatedCompetencies = state.competencies.map((c) =>
        c.id === progress.competencyId ? { ...c, progress } : c
      );

      let updatedActive = state.activeCompetency;
      if (state.activeCompetency && state.activeCompetency.id === progress.competencyId) {
        updatedActive = {
          ...state.activeCompetency,
          progress,
        };
      }

      return {
        userProgressMap: updatedMap,
        competencies: updatedCompetencies,
        activeCompetency: updatedActive,
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setActionLoading: (isActionLoading) => set({ isActionLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      competencies: [],
      categories: [],
      selectedCategorySlug: null,
      activeCompetency: null,
      moduleCompetenciesMap: {},
      lessonCompetenciesMap: {},
      userProgressMap: {},
      isLoading: false,
      isActionLoading: false,
      error: null,
    }),
}));
