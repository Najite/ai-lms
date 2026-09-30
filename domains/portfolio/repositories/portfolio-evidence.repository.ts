import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioEvidence } from "../models";
import { logger } from "@/lib/logger";

type EvidenceRow = Database["public"]["Tables"]["portfolio_evidence"]["Row"];

export class PortfolioEvidenceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Adds an evidence record to the portfolio
   */
  public async createEvidence(
    portfolioId: string,
    evidenceType: string,
    evidenceReference: string,
    competencyId?: string | null
  ): Promise<PortfolioEvidence | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_evidence")
        .insert({
          portfolio_id: portfolioId,
          evidence_type: evidenceType,
          evidence_reference: evidenceReference,
          competency_id: competencyId || null,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create portfolio evidence", error);
        return null;
      }

      logger.info("portfolio.evidence.created", {
        portfolioId,
        evidenceId: data.id,
        evidenceType,
      });

      return this.mapEvidence(data);
    } catch (err) {
      logger.error("Unexpected error in createEvidence", err);
      return null;
    }
  }

  /**
   * Retrieves all evidence for a portfolio
   */
  public async getEvidence(
    portfolioId: string,
    competencyId?: string
  ): Promise<PortfolioEvidence[]> {
    try {
      let query = this.supabase
        .from("portfolio_evidence")
        .select("*")
        .eq("portfolio_id", portfolioId);

      if (competencyId) {
        query = query.eq("competency_id", competencyId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch portfolio evidence", error);
        return [];
      }

      return (data || []).map((row) => this.mapEvidence(row));
    } catch (err) {
      logger.error("Unexpected error in getEvidence", err);
      return [];
    }
  }

  private mapEvidence(row: EvidenceRow): PortfolioEvidence {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      evidenceType: row.evidence_type,
      evidenceReference: row.evidence_reference,
      competencyId: row.competency_id,
      createdAt: row.created_at,
    };
  }
}
