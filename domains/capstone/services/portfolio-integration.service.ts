import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneRepository } from "../repositories/capstone.repository";
import { CapstoneSubmissionRepository } from "../repositories/capstone-submission.repository";
import { PortfolioRepository } from "@/domains/portfolio/repositories/portfolio.repository";
import { PortfolioArtifactRepository } from "@/domains/portfolio/repositories/portfolio-artifact.repository";
import { PortfolioEvidenceRepository } from "@/domains/portfolio/repositories/portfolio-evidence.repository";
import { PortfolioProjectRepository } from "@/domains/portfolio/repositories/portfolio-project.repository";
import { PortfolioCompetencyRepository } from "@/domains/portfolio/repositories/portfolio-competency.repository";
import { PortfolioHiringSignalRepository } from "@/domains/portfolio/repositories/portfolio-hiring-signal.repository";
import type { DomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class PortfolioIntegrationService {
  private readonly capstoneRepo: CapstoneRepository;
  private readonly submissionRepo: CapstoneSubmissionRepository;
  private readonly portfolioRepo: PortfolioRepository;
  private readonly artifactRepo: PortfolioArtifactRepository;
  private readonly evidenceRepo: PortfolioEvidenceRepository;
  private readonly projectRepo: PortfolioProjectRepository;
  private readonly compRepo: PortfolioCompetencyRepository;
  private readonly signalRepo: PortfolioHiringSignalRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.capstoneRepo = new CapstoneRepository(supabase);
    this.submissionRepo = new CapstoneSubmissionRepository(supabase);
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.artifactRepo = new PortfolioArtifactRepository(supabase);
    this.evidenceRepo = new PortfolioEvidenceRepository(supabase);
    this.projectRepo = new PortfolioProjectRepository(supabase);
    this.compRepo = new PortfolioCompetencyRepository(supabase);
    this.signalRepo = new PortfolioHiringSignalRepository(supabase);
  }

  /**
   * Publishes capstone project and deliverables into the learner's professional portfolio
   * Idempotent: checks for existing artifacts before creating
   */
  public async publishCapstoneToPortfolio(
    userId: string,
    capstoneId: string
  ): Promise<
    DomainResponse<{
      portfolioId: string;
      artifactId?: string;
      projectId?: string;
      evidenceId?: string;
    }>
  > {
    try {
      const capstone = await this.capstoneRepo.getCapstoneById(capstoneId);
      if (!capstone) {
        return { success: false, error: "Capstone not found." };
      }

      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Failed to load learner portfolio." };
      }

      const submission = await this.submissionRepo.getLatestSubmission(capstoneId, userId);

      // 1. Create Portfolio Project
      const existingProjects = await this.projectRepo.getProjects(portfolio.id);
      let project = existingProjects.find((p) => p.title === capstone.title);
      if (!project) {
        project = (await this.projectRepo.createProject(
          portfolio.id,
          capstone.title,
          capstone.description,
          "capstone_project",
          "completed"
        )) || undefined;
      }

      // 2. Create Portfolio Artifact
      const existingArtifacts = await this.artifactRepo.getArtifacts(portfolio.id);
      let artifact = existingArtifacts.find(
        (a) => a.sourceDomain === "capstone" && a.sourceId === capstoneId
      );
      if (!artifact) {
        artifact = (await this.artifactRepo.createArtifact(
          portfolio.id,
          "project_artifact",
          "capstone",
          capstone.title,
          `Completed ${capstone.capstoneType?.name || "Capstone"} project. Repository: ${submission?.repositoryUrl || "verified submission"}`,
          capstoneId
        )) || undefined;
      }

      // 3. Create Portfolio Evidence
      const ref = `capstone://${capstone.slug || capstone.id}`;
      const existingEvidence = await this.evidenceRepo.getEvidence(portfolio.id);
      let evidence = existingEvidence.find((e) => e.evidenceReference === ref);
      if (!evidence) {
        evidence = (await this.evidenceRepo.createEvidence(
          portfolio.id,
          "capstone_completion",
          ref,
          null
        )) || undefined;
      }

      // 4. Generate Strong Technical Hiring Signal
      const existingSignals = await this.signalRepo.getSignals(portfolio.id);
      const signalExists = existingSignals.some(
        (s) => s.signalType === "artifact_produced" && s.signalStrength === "strong"
      );
      if (!signalExists) {
        await this.signalRepo.createSignal(portfolio.id, "artifact_produced", "strong");
      }

      // 5. Link Associated Capstone Competencies to Portfolio
      if (capstone.competencies && capstone.competencies.length > 0) {
        const compIds = capstone.competencies.map((c) => c.competencyId);
        await this.compRepo.syncCompetencies(portfolio.id, compIds);
      }

      logger.info("portfolio.capstone.integrated", {
        userId,
        capstoneId,
        portfolioId: portfolio.id,
      });

      return {
        success: true,
        data: {
          portfolioId: portfolio.id,
          artifactId: artifact?.id,
          projectId: project?.id,
          evidenceId: evidence?.id,
        },
      };
    } catch (err) {
      logger.error("Unexpected error in publishCapstoneToPortfolio", err);
      return { success: false, error: "Failed to publish capstone to portfolio." };
    }
  }

  /**
   * Alias for creating portfolio artifacts
   */
  public async createPortfolioArtifacts(
    userId: string,
    capstoneId: string
  ): Promise<DomainResponse<{ portfolioId: string }>> {
    const res = await this.publishCapstoneToPortfolio(userId, capstoneId);
    if (!res.success || !res.data) {
      return { success: false, error: res.error };
    }
    return { success: true, data: { portfolioId: res.data.portfolioId } };
  }
}
