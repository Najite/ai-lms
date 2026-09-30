import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { XPTransactionRepository } from "../repositories/xp-transaction.repository";
import { XPBalanceRepository } from "../repositories/xp-balance.repository";
import {
  XP_REWARDS,
  type XPSourceType,
  type XPTransaction,
  type XPBalance,
  type AchievementResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class XPTransactionService {
  private readonly transactionRepo: XPTransactionRepository;
  private readonly balanceRepo: XPBalanceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.transactionRepo = new XPTransactionRepository(supabase);
    this.balanceRepo = new XPBalanceRepository(supabase);
  }

  /**
   * Creates an immutable XP transaction ledger entry
   */
  public async createTransaction(
    userId: string,
    sourceType: XPSourceType,
    sourceId: string,
    amount: number
  ): Promise<AchievementResponse<XPTransaction>> {
    try {
      if (amount <= 0) {
        return { success: false, error: "XP transaction amount must be positive." };
      }

      const tx = await this.transactionRepo.createTransaction(
        userId,
        sourceType,
        sourceId,
        amount
      );

      if (!tx) {
        return { success: false, error: "Failed to record XP transaction." };
      }

      return { success: true, data: tx };
    } catch (err) {
      logger.error("Failed to create XP transaction", err);
      return { success: false, error: "Unable to create XP transaction." };
    }
  }

  /**
   * Awards XP for a verified platform milestone/event
   * Emits: xp.awarded
   */
  public async awardXP(
    userId: string,
    sourceType: XPSourceType,
    sourceId: string,
    customAmount?: number
  ): Promise<
    AchievementResponse<{
      transaction: XPTransaction;
      balance: XPBalance;
      isDuplicateGrant: boolean;
    }>
  > {
    try {
      const amount = customAmount && customAmount > 0 ? customAmount : XP_REWARDS[sourceType] || 50;

      // Check if already awarded (idempotency check)
      const existing = await this.transactionRepo.getTransaction(
        userId,
        sourceType,
        sourceId
      );

      if (existing) {
        const balance = (await this.balanceRepo.getBalance(userId)) || {
          userId,
          totalXp: 0,
          updatedAt: new Date().toISOString(),
        };

        return {
          success: true,
          data: {
            transaction: existing,
            balance,
            isDuplicateGrant: true,
          },
        };
      }

      const tx = await this.transactionRepo.createTransaction(
        userId,
        sourceType,
        sourceId,
        amount
      );

      if (!tx) {
        return { success: false, error: "Failed to persist XP ledger transaction." };
      }

      // Record XP Event audit entry
      try {
        await this.supabase.from("xp_events").insert({
          user_id: userId,
          event_type: `xp_award_${sourceType}`,
          event_reference: sourceId,
        });
      } catch (eventErr) {
        logger.warn("Failed to write xp_event log entry", { error: String(eventErr) });
      }

      const balance = (await this.balanceRepo.getBalance(userId)) || {
        userId,
        totalXp: tx.amount,
        updatedAt: new Date().toISOString(),
      };

      // Observability: xp.awarded
      logger.info("xp.awarded", {
        userId,
        sourceType,
        sourceId,
        amount,
        newTotalXp: balance.totalXp,
      });

      return {
        success: true,
        data: {
          transaction: tx,
          balance,
          isDuplicateGrant: false,
        },
      };
    } catch (err) {
      logger.error("Failed to award XP", err);
      return { success: false, error: "Unable to award XP." };
    }
  }

  /**
   * Retrieves transaction history for a user
   */
  public async getUserTransactions(
    userId: string,
    limit: number = 50
  ): Promise<AchievementResponse<XPTransaction[]>> {
    try {
      const history = await this.transactionRepo.getUserTransactions(userId, limit);
      return { success: true, data: history };
    } catch (err) {
      logger.error("Failed to retrieve user XP transactions", err);
      return { success: false, error: "Unable to retrieve XP transaction history." };
    }
  }
}
