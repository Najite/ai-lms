export type PortfolioSectionType =
  | "projects"
  | "competencies"
  | "achievements"
  | "artifacts"
  | "professional_evidence"
  | "generated_work";

export type PortfolioArtifactType =
  | "lesson_evidence"
  | "exercise_evidence"
  | "competency_evidence"
  | "achievement_evidence"
  | "gate_evidence"
  | "documentation_artifact"
  | "design_artifact"
  | "project_artifact";

export type PortfolioProjectStatus = "in_progress" | "completed" | "archived";

export type HiringSignalType =
  | "competency_demonstrated"
  | "exercise_completed"
  | "achievement_earned"
  | "gate_completed"
  | "artifact_produced";

export type HiringSignalStrength = "high" | "medium" | "low" | "strong" | "moderate";

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioSection {
  id: string;
  portfolioId: string;
  sectionType: PortfolioSectionType;
  title: string;
  displayOrder: number;
}

export interface PortfolioArtifact {
  id: string;
  portfolioId: string;
  artifactType: PortfolioArtifactType;
  sourceDomain: string;
  sourceId: string | null;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface PortfolioEvidence {
  id: string;
  portfolioId: string;
  evidenceType: string;
  evidenceReference: string;
  competencyId: string | null;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  portfolioId: string;
  title: string;
  description: string | null;
  projectType: string;
  status: PortfolioProjectStatus;
  createdAt: string;
}

export interface PortfolioCompetency {
  id: string;
  portfolioId: string;
  competencyId: string;
  competency?: {
    id: string;
    code: string;
    title: string;
    level: string;
    slug: string;
  };
}

export interface PortfolioAchievement {
  id: string;
  portfolioId: string;
  achievementId: string;
  achievement?: {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    tier: string;
    xpReward: number;
  };
}

export interface PortfolioHiringSignal {
  id: string;
  portfolioId: string;
  signalType: HiringSignalType;
  signalStrength: HiringSignalStrength;
  generatedAt: string;
}

export interface PortfolioSummaryView {
  portfolio: Portfolio;
  sections: PortfolioSection[];
  projects: PortfolioProject[];
  competencies: PortfolioCompetency[];
  achievements: PortfolioAchievement[];
  artifacts: PortfolioArtifact[];
  evidence: PortfolioEvidence[];
  hiringSignals: PortfolioHiringSignal[];
  stats: {
    totalProjects: number;
    totalCompetencies: number;
    totalAchievements: number;
    totalArtifacts: number;
    totalEvidence: number;
    totalSignals: number;
  };
}
