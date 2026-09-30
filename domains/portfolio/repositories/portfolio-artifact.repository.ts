import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioArtifact, PortfolioArtifactType } from "../models";
import { logger } from "@/lib/logger";

type ArtifactRow = Database["public"]["Tables"]["portfolio_artifacts"]["Row"];

export class PortfolioArtifactRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates an artifact in the portfolio
   */
  public async createArtifact(
    portfolioId: string,
    artifactType: PortfolioArtifactType,
    sourceDomain: string,
    title: string,
    description?: string | null,
    sourceId?: string | null
  ): Promise<PortfolioArtifact | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_artifacts")
        .insert({
          portfolio_id: portfolioId,
          artifact_type: artifactType,
          source_domain: sourceDomain,
          source_id: sourceId || null,
          title,
          description: description || null,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create portfolio artifact", error);
        return null;
      }

      logger.info("portfolio.artifact.created", {
        portfolioId,
        artifactId: data.id,
        artifactType,
      });

      return this.mapArtifact(data);
    } catch (err) {
      logger.error("Unexpected error in createArtifact", err);
      return null;
    }
  }

  /**
   * Retrieves all artifacts for a portfolio
   */
  public async getArtifacts(
    portfolioId: string,
    artifactType?: PortfolioArtifactType
  ): Promise<PortfolioArtifact[]> {
    try {
      let query = this.supabase
        .from("portfolio_artifacts")
        .select("*")
        .eq("portfolio_id", portfolioId);

      if (artifactType) {
        query = query.eq("artifact_type", artifactType);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch portfolio artifacts", error);
        return [];
      }

      return (data || []).map((row) => this.mapArtifact(row));
    } catch (err) {
      logger.error("Unexpected error in getArtifacts", err);
      return [];
    }
  }

  private mapArtifact(row: ArtifactRow): PortfolioArtifact {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      artifactType: row.artifact_type as PortfolioArtifactType,
      sourceDomain: row.source_domain,
      sourceId: row.source_id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
    };
  }
}
