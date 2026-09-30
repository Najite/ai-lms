import { create } from "zustand";
import type {
  Portfolio,
  PortfolioSummaryView,
  PortfolioArtifact,
  PortfolioProject,
  PortfolioCompetency,
  PortfolioAchievement,
  PortfolioHiringSignal,
} from "../types";

// 1. Main Portfolio Store
export interface PortfolioState {
  summary: PortfolioSummaryView | null;
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  setSummary: (summary: PortfolioSummaryView | null) => void;
  setPortfolio: (portfolio: Portfolio | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  summary: null,
  portfolio: null,
  isLoading: false,
  error: null,
  setSummary: (summary) => set({ summary }),
  setPortfolio: (portfolio) => set({ portfolio }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// 2. Portfolio Artifact Store
export interface PortfolioArtifactState {
  artifacts: PortfolioArtifact[];
  selectedFilter: string;
  setArtifacts: (artifacts: PortfolioArtifact[]) => void;
  setSelectedFilter: (filter: string) => void;
}

export const usePortfolioArtifactStore = create<PortfolioArtifactState>((set) => ({
  artifacts: [],
  selectedFilter: "all",
  setArtifacts: (artifacts) => set({ artifacts }),
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
}));

// 3. Portfolio Project Store
export interface PortfolioProjectState {
  projects: PortfolioProject[];
  isCreateModalOpen: boolean;
  setProjects: (projects: PortfolioProject[]) => void;
  setCreateModalOpen: (open: boolean) => void;
}

export const usePortfolioProjectStore = create<PortfolioProjectState>((set) => ({
  projects: [],
  isCreateModalOpen: false,
  setProjects: (projects) => set({ projects }),
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
}));

// 4. Portfolio Competency Store
export interface PortfolioCompetencyState {
  competencies: PortfolioCompetency[];
  setCompetencies: (competencies: PortfolioCompetency[]) => void;
}

export const usePortfolioCompetencyStore = create<PortfolioCompetencyState>((set) => ({
  competencies: [],
  setCompetencies: (competencies) => set({ competencies }),
}));

// 5. Portfolio Achievement Store
export interface PortfolioAchievementState {
  achievements: PortfolioAchievement[];
  setAchievements: (achievements: PortfolioAchievement[]) => void;
}

export const usePortfolioAchievementStore = create<PortfolioAchievementState>((set) => ({
  achievements: [],
  setAchievements: (achievements) => set({ achievements }),
}));

// 6. Hiring Signal Store
export interface HiringSignalState {
  signals: PortfolioHiringSignal[];
  setSignals: (signals: PortfolioHiringSignal[]) => void;
}

export const useHiringSignalStore = create<HiringSignalState>((set) => ({
  signals: [],
  setSignals: (signals) => set({ signals }),
}));
