import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { XPBalance } from "../models";
import { logger } from "@/lib/logger";

export class XPBalanceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches the current XP balance for a user
   */
  public async getBalance(userId: string): Promise<XPBalance | null> {
    try {
      const { data, error } = await this.supabase
        .from("xp_balances")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        logger.error("Failed to fetch user XP balance", error);
        return null;
      }

      if (!data) {
        // Return initial 0 balance if no record exists yet
        return {
          userId,
          totalXp: 0,
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        userId: data.user_id,
        totalXp: data.total_xp,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getBalance", err);
      return null;
    }
  }

  /**
   * Recalculates and persists total XP balance by summing all ledger transactions
   */
  public async recalculateBalance(userId: string): Promise<XPBalance | null> {
    try {
      const { data: transactions, error } = await this.supabase
        .from("xp_transactions")
        .select("amount")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to fetch transactions for recalculation", error);
        return null;
      }

      const totalXp = (transactions || []).reduce(
        (sum, tx) => sum + (tx.amount || 0),
        0
      );

      const { data, error: upsertError } = await this.supabase
        .from("xp_balances")
        .upsert(
          {
            user_id: userId,
            total_xp: totalXp,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (upsertError || !data) {
        logger.error("Failed to upsert recalculated XP balance", upsertError);
        return null;
      }

      return {
        userId: data.user_id,
        totalXp: data.total_xp,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in recalculateBalance", err);
      return null;
    }
  }
}
