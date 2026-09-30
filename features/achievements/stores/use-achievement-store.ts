import { create } from "zustand";
import type {
  Achievement,
  AchievementCategory,
  UserAchievementView,
  XPBalance,
  XPTransaction,
} from "../types";

/**
 * Achievement Explorer & Progress Store
 */
export interface AchievementStoreState {
  achievements: Achievement[];
  categories: AchievementCategory[];
  userAchievements: UserAchievementView[];
  selectedCategorySlug: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AchievementStoreActions {
  setAchievements: (achievements: Achievement[]) => void;
  setCategories: (categories: AchievementCategory[]) => void;
  setUserAchievements: (userAchievements: UserAchievementView[]) => void;
  setSelectedCategorySlug: (slug: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAchievementStore = create<
  AchievementStoreState & AchievementStoreActions
>((set) => ({
  achievements: [],
  categories: [],
  userAchievements: [],
  selectedCategorySlug: null,
  isLoading: false,
  error: null,

  setAchievements: (achievements) => set({ achievements }),
  setCategories: (categories) => set({ categories }),
  setUserAchievements: (userAchievements) => set({ userAchievements }),
  setSelectedCategorySlug: (selectedCategorySlug) =>
    set({ selectedCategorySlug }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      achievements: [],
      categories: [],
      userAchievements: [],
      selectedCategorySlug: null,
      isLoading: false,
      error: null,
    }),
}));

export const AchievementStore = useAchievementStore;

/**
 * XP Balance & Transaction History Store
 */
export interface XPStoreState {
  balance: XPBalance | null;
  transactions: XPTransaction[];
  isLoading: boolean;
  error: string | null;
}

export interface XPStoreActions {
  setBalance: (balance: XPBalance | null) => void;
  setTransactions: (transactions: XPTransaction[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useXPStore = create<XPStoreState & XPStoreActions>((set) => ({
  balance: null,
  transactions: [],
  isLoading: false,
  error: null,

  setBalance: (balance) => set({ balance }),
  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      balance: null,
      transactions: [],
      isLoading: false,
      error: null,
    }),
}));

export const XPStore = useXPStore;
