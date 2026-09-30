import type {
  PortfolioSectionType,
  PortfolioArtifactType,
  PortfolioProjectStatus,
  HiringSignalType,
  HiringSignalStrength,
} from "../models";

export interface CreatePortfolioDTO {
  userId: string;
  title?: string;
  description?: string;
}

export interface UpdatePortfolioDTO {
  title?: string;
  description?: string;
}

export interface CreatePortfolioSectionDTO {
  portfolioId: string;
  sectionType: PortfolioSectionType;
  title: string;
  displayOrder?: number;
}

export interface CreatePortfolioArtifactDTO {
  portfolioId: string;
  artifactType: PortfolioArtifactType;
  sourceDomain: string;
  sourceId?: string | null;
  title: string;
  description?: string | null;
}

export interface CreatePortfolioEvidenceDTO {
  portfolioId: string;
  evidenceType: string;
  evidenceReference: string;
  competencyId?: string | null;
}

export interface CreatePortfolioProjectDTO {
  portfolioId: string;
  title: string;
  description?: string | null;
  projectType?: string;
  status?: PortfolioProjectStatus;
}

export interface UpdatePortfolioProjectDTO {
  title?: string;
  description?: string | null;
  projectType?: string;
  status?: PortfolioProjectStatus;
}

export interface SyncPortfolioCompetenciesDTO {
  portfolioId: string;
  competencyIds: string[];
}

export interface SyncPortfolioAchievementsDTO {
  portfolioId: string;
  achievementIds: string[];
}

export interface GenerateHiringSignalsDTO {
  portfolioId: string;
  signals: {
    signalType: HiringSignalType;
    signalStrength: HiringSignalStrength;
  }[];
}
