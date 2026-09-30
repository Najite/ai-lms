import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { AchievementProgress } from "../models";
import { logger } from "@/lib/logger";

export class AchievementProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches progress for a specific user and achievement
   */
  public async getProgress(
    userId: string,
    achievementId: string
  ): Promise<AchievementProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("achievement_id", achievementId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        achievementId: data.achievement_id,
        progressValue: data.progress_value,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getProgress", err);
      return null;
    }
  }

  /**
   * Fetches all achievement progress records for a user
   */
  public async getUserProgressList(
    userId: string
  ): Promise<AchievementProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_progress")
        .select("*")
        .eq("user_id", userId);

      if (error || !data) {
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        achievementId: row.achievement_id,
        progressValue: row.progress_value,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getUserProgressList", err);
      return [];
    }
  }

  /**
   * Upserts progress value for a user and achievement
   */
  public async upsertProgress(
    userId: string,
    achievementId: string,
    progressValue: number,
    isCompleted?: boolean
  ): Promise<AchievementProgress | null> {
    try {
      const payload: Database["public"]["Tables"]["achievement_progress"]["Insert"] = {
        user_id: userId,
        achievement_id: achievementId,
        progress_value: progressValue,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabase
        .from("achievement_progress")
        .upsert(payload, { onConflict: "user_id,achievement_id" })
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to upsert achievement progress", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        achievementId: data.achievement_id,
        progressValue: data.progress_value,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in upsertProgress", err);
      return null;
    }
  }
}
