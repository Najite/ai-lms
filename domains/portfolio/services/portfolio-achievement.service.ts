import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioAchievementRepository } from "../repositories/portfolio-achievement.repository";
import type { PortfolioAchievement, DomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class PortfolioAchievementService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly achievementRepo: PortfolioAchievementRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.achievementRepo = new PortfolioAchievementRepository(supabase);
  }

  /**
   * Syncs achievement IDs into a user's portfolio
   */
  public async syncAchievements(
    userId: string,
    achievementIds: string[]
  ): Promise<DomainResponse<PortfolioAchievement[]>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const synced = await this.achievementRepo.syncAchievements(portfolio.id, achievementIds);
      return { success: true, data: synced };
    } catch (err) {
      logger.error("Error in syncAchievements", err);
      return { success: false, error: "Internal error syncing achievements." };
    }
  }

  /**
   * Retrieves all achievements for a user's portfolio
   */
  public async retrieveAchievements(userId: string): Promise<DomainResponse<PortfolioAchievement[]>> {
    try {
      const portfolio = await this.portfolioRepo.getByUserId(userId);
      if (!portfolio) {
        return { success: true, data: [] };
      }

      const achievements = await this.achievementRepo.getAchievements(portfolio.id);
      return { success: true, data: achievements };
    } catch (err) {
      logger.error("Error in retrieveAchievements", err);
      return { success: false, error: "Failed to retrieve achievements." };
    }
  }
}
