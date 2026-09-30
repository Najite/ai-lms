import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioEvidenceRepository } from "../repositories/portfolio-evidence.repository";
import type { PortfolioEvidence, DomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class PortfolioEvidenceService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly evidenceRepo: PortfolioEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.evidenceRepo = new PortfolioEvidenceRepository(supabase);
  }

  /**
   * Records a piece of evidence in the user's portfolio
   */
  public async collectEvidence(
    userId: string,
    evidenceType: string,
    evidenceReference: string,
    competencyId?: string | null
  ): Promise<DomainResponse<PortfolioEvidence>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const evidence = await this.evidenceRepo.createEvidence(
        portfolio.id,
        evidenceType,
        evidenceReference,
        competencyId
      );

      if (!evidence) {
        return { success: false, error: "Failed to record portfolio evidence." };
      }

      return { success: true, data: evidence };
    } catch (err) {
      logger.error("Error in collectEvidence", err);
      return { success: false, error: "Internal error collecting evidence." };
    }
  }

  /**
   * Retrieves all evidence in the user's portfolio
   */
  public async retrieveEvidence(
    userId: string,
    competencyId?: string
  ): Promise<DomainResponse<PortfolioEvidence[]>> {
    try {
      const portfolio = await this.portfolioRepo.getByUserId(userId);
      if (!portfolio) {
        return { success: true, data: [] };
      }

      const evidence = await this.evidenceRepo.getEvidence(portfolio.id, competencyId);
      return { success: true, data: evidence };
    } catch (err) {
      logger.error("Error in retrieveEvidence", err);
      return { success: false, error: "Failed to retrieve evidence." };
    }
  }
}
