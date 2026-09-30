"use client";

import React, { useState } from "react";
import type { PortfolioSummaryView } from "../types";
import { PortfolioOverview } from "./portfolio-overview";
import { PortfolioProjectsView } from "./portfolio-projects-view";
import { PortfolioEvidenceView } from "./portfolio-evidence-view";
import { PortfolioCompetencyView } from "./portfolio-competency-view";
import { PortfolioAchievementView } from "./portfolio-achievement-view";
import { HiringSignalView } from "./hiring-signal-view";
import { ArtifactExplorer } from "./artifact-explorer";
import { CreateProjectModal } from "./create-project-modal";
import { usePortfolioSummary } from "../hooks/use-portfolio";

export interface PortfolioDashboardProps {
  initialSummary: PortfolioSummaryView | null;
}

export function PortfolioDashboard({ initialSummary }: PortfolioDashboardProps) {
  const { summary: clientSummary, isLoading, refetch } = usePortfolioSummary();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Use client summary if loaded, otherwise fallback to server initialSummary
  const currentSummary = clientSummary || initialSummary;

  return (
    <div className="space-y-12">
      {/* Portfolio Overview & Statistics Header */}
      <PortfolioOverview summary={currentSummary} isLoading={isLoading && !currentSummary} />

      {/* Structured User Flow: Projects -> Evidence -> Competencies -> Achievements -> Hiring Signals */}

      {/* 1. Projects View */}
      <PortfolioProjectsView
        projects={currentSummary?.projects || []}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isLoading={isLoading && !currentSummary}
      />

      {/* 2. Professional Evidence Stream */}
      <PortfolioEvidenceView
        evidence={currentSummary?.evidence || []}
        isLoading={isLoading && !currentSummary}
      />

      {/* 3. Mastered Competencies View */}
      <PortfolioCompetencyView
        competencies={currentSummary?.competencies || []}
        isLoading={isLoading && !currentSummary}
      />

      {/* 4. Earned Achievements View */}
      <PortfolioAchievementView
        achievements={currentSummary?.achievements || []}
        isLoading={isLoading && !currentSummary}
      />

      {/* 5. Technical Hiring Signals */}
      <HiringSignalView
        signals={currentSummary?.hiringSignals || []}
        isLoading={isLoading && !currentSummary}
      />

      {/* Categorized Technical Artifact Explorer */}
      <ArtifactExplorer
        artifacts={currentSummary?.artifacts || []}
        isLoading={isLoading && !currentSummary}
      />

      {/* Create Custom Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={() => {
          refetch();
        }}
      />
    </div>
  );
}
