import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { AchievementEvidence } from "../models";
import { logger } from "@/lib/logger";

export class AchievementEvidenceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates an achievement evidence record
   */
  public async createEvidence(
    userId: string,
    achievementId: string,
    evidenceType: string,
    evidenceReference: string
  ): Promise<AchievementEvidence | null> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_evidence")
        .insert({
          user_id: userId,
          achievement_id: achievementId,
          evidence_type: evidenceType,
          evidence_reference: evidenceReference,
        })
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to create achievement evidence", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        achievementId: data.achievement_id,
        evidenceType: data.evidence_type,
        evidenceReference: data.evidence_reference,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createEvidence", err);
      return null;
    }
  }

  /**
   * Retrieves evidence records for a user
   */
  public async getEvidence(
    userId: string,
    achievementId?: string
  ): Promise<AchievementEvidence[]> {
    try {
      let query = this.supabase
        .from("achievement_evidence")
        .select(`
          *,
          achievements (*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (achievementId) {
        query = query.eq("achievement_id", achievementId);
      }

      const { data, error } = await query;

      if (error || !data) {
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        achievementId: row.achievement_id,
        evidenceType: row.evidence_type,
        evidenceReference: row.evidence_reference,
        createdAt: row.created_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getEvidence", err);
      return [];
    }
  }
}
