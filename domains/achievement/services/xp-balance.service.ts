import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { XPBalanceRepository } from "../repositories/xp-balance.repository";
import type { XPBalance, AchievementResponse } from "../models";
import { logger } from "@/lib/logger";

export class XPBalanceService {
  private readonly balanceRepo: XPBalanceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.balanceRepo = new XPBalanceRepository(supabase);
  }

  /**
   * Retrieves the current XP balance for a user
   */
  public async getBalance(userId: string): Promise<AchievementResponse<XPBalance>> {
    try {
      const balance = await this.balanceRepo.getBalance(userId);
      if (!balance) {
        return {
          success: true,
          data: {
            userId,
            totalXp: 0,
            updatedAt: new Date().toISOString(),
          },
        };
      }
      return { success: true, data: balance };
    } catch (err) {
      logger.error("Failed to get XP balance", err);
      return { success: false, error: "Unable to retrieve XP balance." };
    }
  }

  /**
   * Recalculates total balance by auditing and summing all transaction ledger records
   */
  public async calculateBalance(userId: string): Promise<AchievementResponse<XPBalance>> {
    try {
      const recalculated = await this.balanceRepo.recalculateBalance(userId);
      if (!recalculated) {
        return { success: false, error: "Failed to calculate XP balance." };
      }
      return { success: true, data: recalculated };
    } catch (err) {
      logger.error("Failed to calculate XP balance", err);
      return { success: false, error: "Unable to calculate XP balance." };
    }
  }
}
