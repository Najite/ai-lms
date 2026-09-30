import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { AchievementAward } from "../models";
import { logger } from "@/lib/logger";

export class AchievementAwardRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all awards for a user
   */
  public async getAwards(userId: string): Promise<AchievementAward[]> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_awards")
        .select(`
          *,
          achievements (
            *,
            achievement_categories (*)
          )
        `)
        .eq("user_id", userId)
        .order("awarded_at", { ascending: false });

      if (error || !data) {
        logger.error("Failed to fetch achievement awards", error);
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        achievementId: row.achievement_id,
        awardedAt: row.awarded_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getAwards", err);
      return [];
    }
  }

  /**
   * Fetches specific achievement award for a user
   */
  public async getAward(
    userId: string,
    achievementId: string
  ): Promise<AchievementAward | null> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_awards")
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
        awardedAt: data.awarded_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getAward", err);
      return null;
    }
  }

  /**
   * Records an achievement award for a user (idempotent, single grant guarantee)
   */
  public async awardAchievement(
    userId: string,
    achievementId: string
  ): Promise<AchievementAward | null> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_awards")
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          awarded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !data) {
        // If already awarded, retrieve existing
        const existing = await this.getAward(userId, achievementId);
        if (existing) {
          return existing;
        }
        logger.error("Failed to insert achievement award", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        achievementId: data.achievement_id,
        awardedAt: data.awarded_at,
      };
    } catch (err) {
      logger.error("Unexpected error in awardAchievement", err);
      return null;
    }
  }
}
