import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioArtifactRepository } from "../repositories/portfolio-artifact.repository";
import type {
  PortfolioArtifact,
  PortfolioArtifactType,
  DomainResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class PortfolioArtifactService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly artifactRepo: PortfolioArtifactRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.artifactRepo = new PortfolioArtifactRepository(supabase);
  }

  /**
   * Creates an engineering artifact inside a user's portfolio
   */
  public async createArtifact(
    userId: string,
    artifactType: PortfolioArtifactType,
    sourceDomain: string,
    title: string,
    description?: string | null,
    sourceId?: string | null
  ): Promise<DomainResponse<PortfolioArtifact>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const artifact = await this.artifactRepo.createArtifact(
        portfolio.id,
        artifactType,
        sourceDomain,
        title,
        description,
        sourceId
      );

      if (!artifact) {
        return { success: false, error: "Failed to create artifact." };
      }

      return { success: true, data: artifact };
    } catch (err) {
      logger.error("Error in createArtifact", err);
      return { success: false, error: "Internal error creating artifact." };
    }
  }

  /**
   * Retrieves artifacts for a user's portfolio
   */
  public async retrieveArtifacts(
    userId: string,
    artifactType?: PortfolioArtifactType
  ): Promise<DomainResponse<PortfolioArtifact[]>> {
    try {
      const portfolio = await this.portfolioRepo.getByUserId(userId);
      if (!portfolio) {
        return { success: true, data: [] };
      }

      const artifacts = await this.artifactRepo.getArtifacts(portfolio.id, artifactType);
      return { success: true, data: artifacts };
    } catch (err) {
      logger.error("Error in retrieveArtifacts", err);
      return { success: false, error: "Failed to retrieve artifacts." };
    }
  }
}
