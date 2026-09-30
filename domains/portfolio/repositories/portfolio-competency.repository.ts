import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioCompetency } from "../models";
import { logger } from "@/lib/logger";

type PortfolioCompetencyRow = Database["public"]["Tables"]["portfolio_competencies"]["Row"] & {
  competencies?: Database["public"]["Tables"]["competencies"]["Row"] | null;
};

export class PortfolioCompetencyRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Syncs competencies into a portfolio idempotently
   */
  public async syncCompetencies(
    portfolioId: string,
    competencyIds: string[]
  ): Promise<PortfolioCompetency[]> {
    try {
      for (const compId of competencyIds) {
        await this.supabase
          .from("portfolio_competencies")
          .upsert(
            {
              portfolio_id: portfolioId,
              competency_id: compId,
            },
            { onConflict: "portfolio_id, competency_id" }
          );
      }

      return await this.getCompetencies(portfolioId);
    } catch (err) {
      logger.error("Unexpected error in syncCompetencies", err);
      return [];
    }
  }

  /**
   * Retrieves all competencies for a portfolio with competency metadata
   */
  public async getCompetencies(portfolioId: string): Promise<PortfolioCompetency[]> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_competencies")
        .select(`
          *,
          competencies (*)
        `)
        .eq("portfolio_id", portfolioId);

      if (error) {
        logger.error("Failed to fetch portfolio competencies", error);
        return [];
      }

      return (data || []).map((row) => this.mapCompetency(row));
    } catch (err) {
      logger.error("Unexpected error in getCompetencies", err);
      return [];
    }
  }

  private mapCompetency(row: PortfolioCompetencyRow): PortfolioCompetency {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      competencyId: row.competency_id,
      competency: row.competencies
        ? {
            id: row.competencies.id,
            code: row.competencies.code,
            title: row.competencies.title,
            level: String(row.competencies.level),
            slug: row.competencies.slug,
          }
        : undefined,
    };
  }
}
