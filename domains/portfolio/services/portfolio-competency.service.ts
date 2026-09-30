import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioCompetencyRepository } from "../repositories/portfolio-competency.repository";
import type { PortfolioCompetency, DomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class PortfolioCompetencyService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly competencyRepo: PortfolioCompetencyRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.competencyRepo = new PortfolioCompetencyRepository(supabase);
  }

  /**
   * Syncs competency IDs into a user's portfolio
   */
  public async syncCompetencies(
    userId: string,
    competencyIds: string[]
  ): Promise<DomainResponse<PortfolioCompetency[]>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const synced = await this.competencyRepo.syncCompetencies(portfolio.id, competencyIds);
      return { success: true, data: synced };
    } catch (err) {
      logger.error("Error in syncCompetencies", err);
      return { success: false, error: "Internal error syncing competencies." };
    }
  }

  /**
   * Retrieves all competencies for a user's portfolio
   */
  public async retrieveCompetencies(userId: string): Promise<DomainResponse<PortfolioCompetency[]>> {
    try {
      const portfolio = await this.portfolioRepo.getByUserId(userId);
      if (!portfolio) {
        return { success: true, data: [] };
      }

      const competencies = await this.competencyRepo.getCompetencies(portfolio.id);
      return { success: true, data: competencies };
    } catch (err) {
      logger.error("Error in retrieveCompetencies", err);
      return { success: false, error: "Failed to retrieve competencies." };
    }
  }
}
