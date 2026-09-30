import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { UserCapstoneProgress, CapstoneState } from "../models";
import { logger } from "@/lib/logger";

type ProgressRow = Database["public"]["Tables"]["user_capstone_progress"]["Row"];

export class UserCapstoneProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves progress record for a user on a capstone
   */
  public async getProgress(
    userId: string,
    capstoneId: string
  ): Promise<UserCapstoneProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_capstone_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("capstone_id", capstoneId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapProgress(data);
    } catch (err) {
      logger.error("Unexpected error in getProgress", err);
      return null;
    }
  }

  /**
   * Retrieves all capstone progress records for a user
   */
  public async getUserProgressList(userId: string): Promise<UserCapstoneProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_capstone_progress")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to fetch user capstone progress list", error);
        return [];
      }

      return (data || []).map((row) => this.mapProgress(row));
    } catch (err) {
      logger.error("Unexpected error in getUserProgressList", err);
      return [];
    }
  }

  /**
   * Upserts capstone progress record
   */
  public async upsertProgress(
    userId: string,
    capstoneId: string,
    status: CapstoneState,
    progressPercentage: number,
    startedAt?: string | null
  ): Promise<UserCapstoneProgress | null> {
    try {
      const payload: Partial<Database["public"]["Tables"]["user_capstone_progress"]["Insert"]> = {
        user_id: userId,
        capstone_id: capstoneId,
        status,
        progress_percentage: progressPercentage,
        last_activity_at: new Date().toISOString(),
      };

      if (startedAt !== undefined) {
        payload.started_at = startedAt;
      }

      const { data, error } = await this.supabase
        .from("user_capstone_progress")
        .upsert(payload as Database["public"]["Tables"]["user_capstone_progress"]["Insert"], {
          onConflict: "user_id, capstone_id",
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to upsert user capstone progress", error);
        return null;
      }

      return this.mapProgress(data);
    } catch (err) {
      logger.error("Unexpected error in upsertProgress", err);
      return null;
    }
  }

  private mapProgress(row: ProgressRow): UserCapstoneProgress {
    return {
      id: row.id,
      userId: row.user_id,
      capstoneId: row.capstone_id,
      status: row.status as CapstoneState,
      progressPercentage: row.progress_percentage,
      startedAt: row.started_at,
      lastActivityAt: row.last_activity_at,
    };
  }
}
