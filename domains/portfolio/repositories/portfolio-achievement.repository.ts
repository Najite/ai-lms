import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioAchievement } from "../models";
import { logger } from "@/lib/logger";

type PortfolioAchievementRow = Database["public"]["Tables"]["portfolio_achievements"]["Row"] & {
  achievements?: Database["public"]["Tables"]["achievements"]["Row"] | null;
};

export class PortfolioAchievementRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Syncs achievements into a portfolio idempotently
   */
  public async syncAchievements(
    portfolioId: string,
    achievementIds: string[]
  ): Promise<PortfolioAchievement[]> {
    try {
      for (const achId of achievementIds) {
        await this.supabase
          .from("portfolio_achievements")
          .upsert(
            {
              portfolio_id: portfolioId,
              achievement_id: achId,
            },
            { onConflict: "portfolio_id, achievement_id" }
          );
      }

      return await this.getAchievements(portfolioId);
    } catch (err) {
      logger.error("Unexpected error in syncAchievements", err);
      return [];
    }
  }

  /**
   * Retrieves all achievements for a portfolio with achievement metadata
   */
  public async getAchievements(portfolioId: string): Promise<PortfolioAchievement[]> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_achievements")
        .select(`
          *,
          achievements (*)
        `)
        .eq("portfolio_id", portfolioId);

      if (error) {
        logger.error("Failed to fetch portfolio achievements", error);
        return [];
      }

      return (data || []).map((row) => this.mapAchievement(row));
    } catch (err) {
      logger.error("Unexpected error in getAchievements", err);
      return [];
    }
  }

  private mapAchievement(row: PortfolioAchievementRow): PortfolioAchievement {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      achievementId: row.achievement_id,
      achievement: row.achievements
        ? {
            id: row.achievements.id,
            slug: row.achievements.slug,
            name: row.achievements.name,
            description: row.achievements.description,
            icon: row.achievements.icon,
            tier: "bronze",
            xpReward: row.achievements.xp_reward,
          }
        : undefined,
    };
  }
}
