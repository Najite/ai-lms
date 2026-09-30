import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { AchievementRepository } from "../repositories/achievement.repository";
import { AchievementProgressRepository } from "../repositories/achievement-progress.repository";
import { AchievementAwardRepository } from "../repositories/achievement-award.repository";
import { XPTransactionRepository } from "../repositories/xp-transaction.repository";
import { AchievementEvidenceRepository } from "../repositories/achievement-evidence.repository";
import type {
  AchievementProgress,
  AchievementResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class AchievementProgressService {
  private readonly achievementRepo: AchievementRepository;
  private readonly progressRepo: AchievementProgressRepository;
  private readonly awardRepo: AchievementAwardRepository;
  private readonly xpRepo: XPTransactionRepository;
  private readonly evidenceRepo: AchievementEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.achievementRepo = new AchievementRepository(supabase);
    this.progressRepo = new AchievementProgressRepository(supabase);
    this.awardRepo = new AchievementAwardRepository(supabase);
    this.xpRepo = new XPTransactionRepository(supabase);
    this.evidenceRepo = new AchievementEvidenceRepository(supabase);
  }

  /**
   * Updates progress for a user on an achievement and evaluates completion criteria
   */
  public async updateProgress(
    userId: string,
    achievementId: string,
    progressValue: number
  ): Promise<
    AchievementResponse<{
      progress: AchievementProgress;
      isCompleted: boolean;
      xpAwarded?: number;
    }>
  > {
    try {
      const achievement = await this.achievementRepo.getAchievementByIdOrSlug(achievementId);
      if (!achievement) {
        return { success: false, error: "Achievement not found." };
      }

      const targetValue =
        achievement.requirements?.[0]?.requirementValue ?? 1;

      const isCompleted = progressValue >= targetValue;

      const updatedProgress = await this.progressRepo.upsertProgress(
        userId,
        achievement.id,
        progressValue,
        isCompleted
      );

      if (!updatedProgress) {
        return { success: false, error: "Failed to persist achievement progress." };
      }

      let xpAwarded: number | undefined;

      // If achievement completed, award achievement and grant XP if not already awarded
      if (isCompleted) {
        const existingAward = await this.awardRepo.getAward(userId, achievement.id);
        if (!existingAward) {
          await this.awardRepo.awardAchievement(userId, achievement.id);
          await this.evidenceRepo.createEvidence(
            userId,
            achievement.id,
            "progress_completion",
            `Reached target progress of ${progressValue}/${targetValue} for achievement '${achievement.name}'.`
          );

          if (achievement.xpReward > 0) {
            const tx = await this.xpRepo.createTransaction(
              userId,
              "achievement",
              achievement.id,
              achievement.xpReward
            );
            if (tx) {
              xpAwarded = tx.amount;
            }
          }

          logger.info("achievement.awarded", {
            userId,
            achievementId: achievement.id,
            achievementSlug: achievement.slug,
            xpReward: achievement.xpReward,
          });
        }
      }

      return {
        success: true,
        data: {
          progress: updatedProgress,
          isCompleted,
          xpAwarded,
        },
      };
    } catch (err) {
      logger.error("Failed to update achievement progress", err);
      return { success: false, error: "Unable to update achievement progress." };
    }
  }

  /**
   * Calculates current progress percentage and target metrics for an achievement
   */
  public async calculateProgress(
    userId: string,
    achievementId: string
  ): Promise<
    AchievementResponse<{
      progressValue: number;
      targetValue: number;
      percentage: number;
      isCompleted: boolean;
    }>
  > {
    try {
      const achievement = await this.achievementRepo.getAchievementByIdOrSlug(achievementId);
      if (!achievement) {
        return { success: false, error: "Achievement not found." };
      }

      const progress = await this.progressRepo.getProgress(userId, achievement.id);
      const targetValue =
        achievement.requirements?.[0]?.requirementValue ?? 1;

      const progressValue = progress ? progress.progressValue : 0;
      const percentage = Math.min(100, Math.round((progressValue / targetValue) * 100));
      const isCompleted = progressValue >= targetValue || progress?.completedAt !== null;

      return {
        success: true,
        data: {
          progressValue,
          targetValue,
          percentage,
          isCompleted,
        },
      };
    } catch (err) {
      logger.error("Failed to calculate achievement progress", err);
      return { success: false, error: "Unable to calculate achievement progress." };
    }
  }
}
