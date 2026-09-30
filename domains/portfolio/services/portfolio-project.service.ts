import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioProjectRepository } from "../repositories/portfolio-project.repository";
import type { PortfolioProject, PortfolioProjectStatus, DomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class PortfolioProjectService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly projectRepo: PortfolioProjectRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.projectRepo = new PortfolioProjectRepository(supabase);
  }

  /**
   * Adds a new project to the user's portfolio
   */
  public async createProject(
    userId: string,
    title: string,
    description?: string | null,
    projectType = "production_app",
    status: PortfolioProjectStatus = "completed"
  ): Promise<DomainResponse<PortfolioProject>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const project = await this.projectRepo.createProject(
        portfolio.id,
        title,
        description,
        projectType,
        status
      );

      if (!project) {
        return { success: false, error: "Failed to create project." };
      }

      return { success: true, data: project };
    } catch (err) {
      logger.error("Error in createProject", err);
      return { success: false, error: "Internal error creating project." };
    }
  }

  /**
   * Retrieves all projects in the user's portfolio
   */
  public async retrieveProjects(userId: string): Promise<DomainResponse<PortfolioProject[]>> {
    try {
      const portfolio = await this.portfolioRepo.getByUserId(userId);
      if (!portfolio) {
        return { success: true, data: [] };
      }

      const projects = await this.projectRepo.getProjects(portfolio.id);
      return { success: true, data: projects };
    } catch (err) {
      logger.error("Error in retrieveProjects", err);
      return { success: false, error: "Failed to retrieve projects." };
    }
  }
}
