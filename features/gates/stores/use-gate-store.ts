import { create } from "zustand";
import type { UserGateStatusView } from "../types";

export interface GateState {
  selectedGate: UserGateStatusView | null;
  statusFilter: "all" | "available" | "in_progress" | "completed" | "locked";
  searchQuery: string;
  isEvidenceModalOpen: boolean;
  isSubmitting: boolean;

  // Actions
  setSelectedGate: (gate: UserGateStatusView | null) => void;
  setStatusFilter: (filter: "all" | "available" | "in_progress" | "completed" | "locked") => void;
  setSearchQuery: (query: string) => void;
  setEvidenceModalOpen: (open: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
}

export const useGateStore = create<GateState>((set) => ({
  selectedGate: null,
  statusFilter: "all",
  searchQuery: "",
  isEvidenceModalOpen: false,
  isSubmitting: false,

  setSelectedGate: (gate) => set({ selectedGate: gate }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setEvidenceModalOpen: (isEvidenceModalOpen) => set({ isEvidenceModalOpen }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
}));
