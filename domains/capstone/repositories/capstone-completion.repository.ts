import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CapstoneCompletion } from "../models";
import { logger } from "@/lib/logger";

type CompletionRow = Database["public"]["Tables"]["capstone_completion"]["Row"];

export class CapstoneCompletionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Records capstone completion idempotently
   */
  public async completeCapstone(
    capstoneId: string,
    userId: string
  ): Promise<CapstoneCompletion | null> {
    try {
      const existing = await this.getCompletion(capstoneId, userId);
      if (existing) {
        return existing;
      }

      const { data, error } = await this.supabase
        .from("capstone_completion")
        .insert({
          capstone_id: capstoneId,
          user_id: userId,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to record capstone completion", error);
        return null;
      }

      logger.info("capstone.completed", {
        capstoneId,
        userId,
        completionId: data.id,
      });

      return this.mapCompletion(data);
    } catch (err) {
      logger.error("Unexpected error in completeCapstone", err);
      return null;
    }
  }

  /**
   * Retrieves completion record
   */
  public async getCompletion(
    capstoneId: string,
    userId: string
  ): Promise<CapstoneCompletion | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_completion")
        .select("*")
        .eq("capstone_id", capstoneId)
        .eq("user_id", userId)
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
   * Checks if user has completed a capstone
   */
  public async isCompleted(capstoneId: string, userId: string): Promise<boolean> {
    const record = await this.getCompletion(capstoneId, userId);
    return !!record;
  }

  /**
   * Retrieves all completed capstones for a user
   */
  public async getUserCompletions(userId: string): Promise<CapstoneCompletion[]> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_completion")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch user capstone completions", error);
        return [];
      }

      return (data || []).map((row) => this.mapCompletion(row));
    } catch (err) {
      logger.error("Unexpected error in getUserCompletions", err);
      return [];
    }
  }

  private mapCompletion(row: CompletionRow): CapstoneCompletion {
    return {
      id: row.id,
      capstoneId: row.capstone_id,
      userId: row.user_id,
      completedAt: row.completed_at,
    };
  }
}
