import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { GateCompletion } from "../models";
import { logger } from "@/lib/logger";

type GateCompletionRow = Database["public"]["Tables"]["gate_completion"]["Row"];

export class GateCompletionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves a gate completion record for a user
   */
  public async getCompletion(
    userId: string,
    gateId: string
  ): Promise<GateCompletion | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_completion")
        .select("*")
        .eq("user_id", userId)
        .eq("gate_id", gateId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapCompletion(data);
    } catch (err) {
      logger.error("Unexpected error in getCompletion", err);
      return null;
    }
  }

  /**
   * Retrieves all completed gates for a given user
   */
  public async getUserCompletions(userId: string): Promise<GateCompletion[]> {
    try {
      const { data, error } = await this.supabase
        .from("gate_completion")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: true });

      if (error) {
        logger.error("Failed to fetch user gate completions", error);
        return [];
      }

      return (data || []).map((row) => this.mapCompletion(row));
    } catch (err) {
      logger.error("Unexpected error in getUserCompletions", err);
      return [];
    }
  }

  /**
   * Completes a gate permanently with idempotency guarantee
   */
  public async completeGate(
    userId: string,
    gateId: string
  ): Promise<GateCompletion | null> {
    try {
      // Check existing completion (idempotency guarantee)
      const existing = await this.getCompletion(userId, gateId);
      if (existing) {
        return existing;
      }

      const { data, error } = await this.supabase
        .from("gate_completion")
        .insert({
          user_id: userId,
          gate_id: gateId,
          completed_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to complete gate", error);
        return null;
      }

      return this.mapCompletion(data);
    } catch (err) {
      logger.error("Unexpected error in completeGate", err);
      return null;
    }
  }

  private mapCompletion(row: GateCompletionRow): GateCompletion {
    return {
      id: row.id,
      userId: row.user_id,
      gateId: row.gate_id,
      completedAt: row.completed_at,
    };
  }
}
