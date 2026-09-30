import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { XPTransaction, XPSourceType } from "../models";
import { logger } from "@/lib/logger";

export class XPTransactionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates an immutable XP transaction ledger entry
   * Idempotency guarantee: UNIQUE(user_id, source_type, source_id)
   */
  public async createTransaction(
    userId: string,
    sourceType: XPSourceType,
    sourceId: string,
    amount: number
  ): Promise<XPTransaction | null> {
    try {
      if (amount <= 0) {
        throw new Error("XP transaction amount must be positive.");
      }

      const { data, error } = await this.supabase
        .from("xp_transactions")
        .insert({
          user_id: userId,
          source_type: sourceType,
          source_id: sourceId,
          amount,
        })
        .select()
        .single();

      if (error || !data) {
        // If already exists, return existing transaction for idempotency
        const existing = await this.getTransaction(userId, sourceType, sourceId);
        if (existing) {
          return existing;
        }
        logger.error("Failed to create XP transaction", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        sourceType: data.source_type as XPSourceType,
        sourceId: data.source_id,
        amount: data.amount,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createTransaction", err);
      return null;
    }
  }

  /**
   * Fetches transaction by user, source type, and source ID
   */
  public async getTransaction(
    userId: string,
    sourceType: string,
    sourceId: string
  ): Promise<XPTransaction | null> {
    try {
      const { data, error } = await this.supabase
        .from("xp_transactions")
        .select("*")
        .eq("user_id", userId)
        .eq("source_type", sourceType)
        .eq("source_id", sourceId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        sourceType: data.source_type as XPSourceType,
        sourceId: data.source_id,
        amount: data.amount,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getTransaction", err);
      return null;
    }
  }

  /**
   * Fetches transaction history for a user
   */
  public async getUserTransactions(
    userId: string,
    limit: number = 50
  ): Promise<XPTransaction[]> {
    try {
      const { data, error } = await this.supabase
        .from("xp_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data) {
        logger.error("Failed to fetch user XP transactions", error);
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        sourceType: row.source_type as XPSourceType,
        sourceId: row.source_id,
        amount: row.amount,
        createdAt: row.created_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getUserTransactions", err);
      return [];
    }
  }
}
