import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioSectionRepository } from "../repositories/portfolio-section.repository";
import { PortfolioArtifactRepository } from "../repositories/portfolio-artifact.repository";
import { PortfolioEvidenceRepository } from "../repositories/portfolio-evidence.repository";
import { PortfolioProjectRepository } from "../repositories/portfolio-project.repository";
import { PortfolioCompetencyRepository } from "../repositories/portfolio-competency.repository";
import { PortfolioAchievementRepository } from "../repositories/portfolio-achievement.repository";
import { PortfolioHiringSignalRepository } from "../repositories/portfolio-hiring-signal.repository";
import type {
  Portfolio,
  PortfolioSection,
  PortfolioSummaryView,
  DomainResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class PortfolioQueryService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly sectionRepo: PortfolioSectionRepository;
  private readonly artifactRepo: PortfolioArtifactRepository;
  private readonly evidenceRepo: PortfolioEvidenceRepository;
  private readonly projectRepo: PortfolioProjectRepository;
  private readonly competencyRepo: PortfolioCompetencyRepository;
  private readonly achievementRepo: PortfolioAchievementRepository;
  private readonly signalRepo: PortfolioHiringSignalRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.sectionRepo = new PortfolioSectionRepository(supabase);
    this.artifactRepo = new PortfolioArtifactRepository(supabase);
    this.evidenceRepo = new PortfolioEvidenceRepository(supabase);
    this.projectRepo = new PortfolioProjectRepository(supabase);
    this.competencyRepo = new PortfolioCompetencyRepository(supabase);
    this.achievementRepo = new PortfolioAchievementRepository(supabase);
    this.signalRepo = new PortfolioHiringSignalRepository(supabase);
  }

  /**
   * Retrieves or initializes a user's portfolio
   */
  public async getPortfolio(userId: string): Promise<DomainResponse<Portfolio>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Failed to retrieve or create portfolio." };
      }

      await this.sectionRepo.ensureDefaultSections(portfolio.id);
      return { success: true, data: portfolio };
    } catch (err) {
      logger.error("Error in getPortfolio", err);
      return { success: false, error: "Internal server error retrieving portfolio." };
    }
  }

  /**
   * Retrieves full aggregated portfolio summary for display
   */
  public async getPortfolioSummary(userId: string): Promise<DomainResponse<PortfolioSummaryView>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      await this.sectionRepo.ensureDefaultSections(portfolio.id);

      // Concurrent fetch across all portfolio dimensions
      const [
        sections,
        projects,
        competencies,
        achievements,
        artifacts,
        evidence,
        hiringSignals,
      ] = await Promise.all([
        this.sectionRepo.getSections(portfolio.id),
        this.projectRepo.getProjects(portfolio.id),
        this.competencyRepo.getCompetencies(portfolio.id),
        this.achievementRepo.getAchievements(portfolio.id),
        this.artifactRepo.getArtifacts(portfolio.id),
        this.evidenceRepo.getEvidence(portfolio.id),
        this.signalRepo.getSignals(portfolio.id),
      ]);

      const summaryView: PortfolioSummaryView = {
        portfolio,
        sections,
        projects,
        competencies,
        achievements,
        artifacts,
        evidence,
        hiringSignals,
        stats: {
          totalProjects: projects.length,
          totalCompetencies: competencies.length,
          totalAchievements: achievements.length,
          totalArtifacts: artifacts.length,
          totalEvidence: evidence.length,
          totalSignals: hiringSignals.length,
        },
      };

      return { success: true, data: summaryView };
    } catch (err) {
      logger.error("Error in getPortfolioSummary", err);
      return { success: false, error: "Internal server error retrieving portfolio summary." };
    }
  }

  /**
   * Retrieves portfolio sections
   */
  public async getPortfolioSections(userId: string): Promise<DomainResponse<PortfolioSection[]>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const sections = await this.sectionRepo.ensureDefaultSections(portfolio.id);
      return { success: true, data: sections };
    } catch (err) {
      logger.error("Error in getPortfolioSections", err);
      return { success: false, error: "Internal server error retrieving portfolio sections." };
    }
  }
}
