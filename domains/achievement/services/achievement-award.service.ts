import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { AchievementRepository } from "../repositories/achievement.repository";
import { AchievementProgressRepository } from "../repositories/achievement-progress.repository";
import { AchievementAwardRepository } from "../repositories/achievement-award.repository";
import { AchievementEvidenceRepository } from "../repositories/achievement-evidence.repository";
import { XPTransactionRepository } from "../repositories/xp-transaction.repository";
import type {
  AchievementAward,
  AchievementResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class AchievementAwardService {
  private readonly achievementRepo: AchievementRepository;
  private readonly progressRepo: AchievementProgressRepository;
  private readonly awardRepo: AchievementAwardRepository;
  private readonly evidenceRepo: AchievementEvidenceRepository;
  private readonly xpRepo: XPTransactionRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.achievementRepo = new AchievementRepository(supabase);
    this.progressRepo = new AchievementProgressRepository(supabase);
    this.awardRepo = new AchievementAwardRepository(supabase);
    this.evidenceRepo = new AchievementEvidenceRepository(supabase);
    this.xpRepo = new XPTransactionRepository(supabase);
  }

  /**
   * Awards an achievement to a user with evidence and grants the associated XP reward
   */
  public async awardAchievement(
    userId: string,
    achievementId: string,
    evidenceType: string = "manual_or_system_award",
    evidenceReference: string = "Verified milestone criteria met."
  ): Promise<
    AchievementResponse<{
      award: AchievementAward;
      xpGranted: number;
    }>
  > {
    try {
      const achievement = await this.achievementRepo.getAchievementByIdOrSlug(achievementId);
      if (!achievement) {
        return { success: false, error: "Achievement not found." };
      }

      // Check existing award (idempotency guarantee)
      const existingAward = await this.awardRepo.getAward(userId, achievement.id);
      if (existingAward) {
        return {
          success: true,
          data: {
            award: existingAward,
            xpGranted: 0,
          },
        };
      }

      const award = await this.awardRepo.awardAchievement(userId, achievement.id);
      if (!award) {
        return { success: false, error: "Failed to persist achievement award." };
      }

      // Mark progress complete
      const targetValue =
        achievement.requirements?.[0]?.requirementValue ?? 1;
      await this.progressRepo.upsertProgress(userId, achievement.id, targetValue, true);

      // Create evidence record
      await this.evidenceRepo.createEvidence(
        userId,
        achievement.id,
        evidenceType,
        evidenceReference
      );

      // Grant XP
      let xpGranted = 0;
      if (achievement.xpReward > 0) {
        const tx = await this.xpRepo.createTransaction(
          userId,
          "achievement",
          achievement.id,
          achievement.xpReward
        );
        if (tx) {
          xpGranted = tx.amount;
        }
      }

      // Observability: achievement.awarded
      logger.info("achievement.awarded", {
        userId,
        achievementId: achievement.id,
        achievementSlug: achievement.slug,
        xpReward: xpGranted,
      });

      return {
        success: true,
        data: {
          award,
          xpGranted,
        },
      };
    } catch (err) {
      logger.error("Failed to award achievement", err);
      return { success: false, error: "Unable to award achievement." };
    }
  }

  /**
   * Evaluates all achievements of a given requirement type against current count
   */
  public async evaluateAchievement(
    userId: string,
    requirementType: string,
    currentCount: number
  ): Promise<
    AchievementResponse<{
      evaluatedCount: number;
      newlyAwarded: string[];
    }>
  > {
    try {
      const allAchievements = await this.achievementRepo.getAchievements({ isActive: true });
      const relevantAchievements = allAchievements.filter((ach) =>
        ach.requirements?.some((req) => req.requirementType === requirementType)
      );

      const newlyAwarded: string[] = [];

      for (const ach of relevantAchievements) {
        const req = ach.requirements?.find((r) => r.requirementType === requirementType);
        if (!req) continue;

        // Update progress
        await this.progressRepo.upsertProgress(
          userId,
          ach.id,
          currentCount,
          currentCount >= req.requirementValue
        );

        if (currentCount >= req.requirementValue) {
          const existingAward = await this.awardRepo.getAward(userId, ach.id);
          if (!existingAward) {
            const awardRes = await this.awardAchievement(
              userId,
              ach.id,
              requirementType,
              `Achieved threshold of ${currentCount}/${req.requirementValue} for ${requirementType}.`
            );
            if (awardRes.success) {
              newlyAwarded.push(ach.name);
            }
          }
        }
      }

      return {
        success: true,
        data: {
          evaluatedCount: relevantAchievements.length,
          newlyAwarded,
        },
      };
    } catch (err) {
      logger.error("Failed to evaluate achievements", err);
      return { success: false, error: "Unable to evaluate achievements." };
    }
  }
}
