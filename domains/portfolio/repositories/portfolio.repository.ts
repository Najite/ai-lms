import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { Portfolio } from "../models";
import { logger } from "@/lib/logger";

type PortfolioRow = Database["public"]["Tables"]["portfolios"]["Row"];

export class PortfolioRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves or creates a user's portfolio
   */
  public async getOrCreatePortfolio(
    userId: string,
    defaultTitle = "Professional Software Engineering Portfolio",
    defaultDescription = "Verified competency, capability gates, and engineering artifacts showcase."
  ): Promise<Portfolio | null> {
    try {
      // 1. Try to fetch existing
      const { data, error } = await this.supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        return this.mapPortfolio(data);
      }

      if (error) {
        logger.error("Error checking portfolio existence", error);
      }

      // 2. Insert new portfolio
      const { data: created, error: insertError } = await this.supabase
        .from("portfolios")
        .insert({
          user_id: userId,
          title: defaultTitle,
          description: defaultDescription,
        })
        .select("*")
        .single();

      if (insertError || !created) {
        logger.error("Failed to create portfolio", insertError);
        return null;
      }

      logger.info("portfolio.created", { userId, portfolioId: created.id });
      return this.mapPortfolio(created);
    } catch (err) {
      logger.error("Unexpected error in getOrCreatePortfolio", err);
      return null;
    }
  }

  /**
   * Fetches portfolio by user ID
   */
  public async getByUserId(userId: string): Promise<Portfolio | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapPortfolio(data);
    } catch (err) {
      logger.error("Unexpected error in getByUserId", err);
      return null;
    }
  }

  /**
   * Fetches portfolio by portfolio ID
   */
  public async getById(portfolioId: string): Promise<Portfolio | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolios")
        .select("*")
        .eq("id", portfolioId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapPortfolio(data);
    } catch (err) {
      logger.error("Unexpected error in getById", err);
      return null;
    }
  }

  /**
   * Updates portfolio details
   */
  public async updatePortfolio(
    portfolioId: string,
    updates: { title?: string; description?: string | null }
  ): Promise<Portfolio | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolios")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", portfolioId)
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to update portfolio", error);
        return null;
      }

      logger.info("portfolio.updated", { portfolioId });
      return this.mapPortfolio(data);
    } catch (err) {
      logger.error("Unexpected error in updatePortfolio", err);
      return null;
    }
  }

  private mapPortfolio(row: PortfolioRow): Portfolio {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
