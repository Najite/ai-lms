import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { AchievementEvidenceRepository } from "../repositories/achievement-evidence.repository";
import type {
  AchievementEvidence,
  AchievementResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class AchievementEvidenceService {
  private readonly evidenceRepo: AchievementEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.evidenceRepo = new AchievementEvidenceRepository(supabase);
  }

  /**
   * Creates an achievement evidence record
   */
  public async createEvidence(
    userId: string,
    achievementId: string,
    evidenceType: string,
    evidenceReference: string
  ): Promise<AchievementResponse<AchievementEvidence>> {
    try {
      const evidence = await this.evidenceRepo.createEvidence(
        userId,
        achievementId,
        evidenceType,
        evidenceReference
      );

      if (!evidence) {
        return { success: false, error: "Failed to create achievement evidence record." };
      }

      return { success: true, data: evidence };
    } catch (err) {
      logger.error("Failed to create achievement evidence", err);
      return { success: false, error: "Unable to create achievement evidence." };
    }
  }

  /**
   * Retrieves evidence records for a user, optionally filtered by achievement
   */
  public async getEvidence(
    userId: string,
    achievementId?: string
  ): Promise<AchievementResponse<AchievementEvidence[]>> {
    try {
      const evidenceList = await this.evidenceRepo.getEvidence(userId, achievementId);
      return { success: true, data: evidenceList };
    } catch (err) {
      logger.error("Failed to retrieve achievement evidence", err);
      return { success: false, error: "Unable to retrieve achievement evidence." };
    }
  }
}
