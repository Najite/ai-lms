import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { AchievementRepository } from "../repositories/achievement.repository";
import { AchievementProgressRepository } from "../repositories/achievement-progress.repository";
import { AchievementAwardRepository } from "../repositories/achievement-award.repository";
import { AchievementEvidenceRepository } from "../repositories/achievement-evidence.repository";
import type {
  Achievement,
  AchievementCategory,
  UserAchievementView,
  AchievementResponse,
} from "../models";
import type { AchievementQueryFiltersDTO } from "../dto";
import { logger } from "@/lib/logger";

export class AchievementQueryService {
  private readonly achievementRepo: AchievementRepository;
  private readonly progressRepo: AchievementProgressRepository;
  private readonly awardRepo: AchievementAwardRepository;
  private readonly evidenceRepo: AchievementEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.achievementRepo = new AchievementRepository(supabase);
    this.progressRepo = new AchievementProgressRepository(supabase);
    this.awardRepo = new AchievementAwardRepository(supabase);
    this.evidenceRepo = new AchievementEvidenceRepository(supabase);
  }

  /**
   * Retrieves all achievement categories
   */
  public async getCategories(): Promise<AchievementResponse<AchievementCategory[]>> {
    try {
      const categories = await this.achievementRepo.getCategories();
      return { success: true, data: categories };
    } catch (err) {
      logger.error("Failed to retrieve achievement categories", err);
      return { success: false, error: "Unable to retrieve achievement categories." };
    }
  }

  /**
   * Retrieves achievements with optional filters
   */
  public async getAchievements(
    filters?: AchievementQueryFiltersDTO
  ): Promise<AchievementResponse<Achievement[]> > {
    try {
      const achievements = await this.achievementRepo.getAchievements(filters);
      return { success: true, data: achievements };
    } catch (err) {
      logger.error("Failed to retrieve achievements", err);
      return { success: false, error: "Unable to retrieve achievements." };
    }
  }

  /**
   * Retrieves a single achievement by ID or slug
   */
  public async getAchievementById(
    idOrSlug: string
  ): Promise<AchievementResponse<Achievement>> {
    try {
      const achievement = await this.achievementRepo.getAchievementByIdOrSlug(idOrSlug);
      if (!achievement) {
        return { success: false, error: `Achievement '${idOrSlug}' not found.` };
      }
      return { success: true, data: achievement };
    } catch (err) {
      logger.error(`Failed to retrieve achievement '${idOrSlug}'`, err);
      return { success: false, error: "Unable to retrieve achievement." };
    }
  }

  /**
   * Retrieves user achievements with progress, award status, and evidence
   */
  public async getUserAchievements(
    userId: string
  ): Promise<AchievementResponse<UserAchievementView[]>> {
    try {
      const [achievements, progressList, awards, evidenceList] = await Promise.all([
        this.achievementRepo.getAchievements({ isActive: true }),
        this.progressRepo.getUserProgressList(userId),
        this.awardRepo.getAwards(userId),
        this.evidenceRepo.getEvidence(userId),
      ]);

      const progressMap = new Map(progressList.map((p) => [p.achievementId, p]));
      const awardMap = new Map(awards.map((a) => [a.achievementId, a]));

      const userViews: UserAchievementView[] = achievements.map((ach) => {
        const prog = progressMap.get(ach.id);
        const award = awardMap.get(ach.id);
        const evidence = evidenceList.filter((e) => e.achievementId === ach.id);
        const targetValue =
          ach.requirements?.[0]?.requirementValue ?? 1;
        const progressVal = prog ? prog.progressValue : award ? targetValue : 0;
        const isUnlocked = !!award || (prog?.completedAt !== null && prog?.completedAt !== undefined);

        return {
          achievement: ach,
          progressValue: progressVal,
          targetValue,
          isUnlocked,
          unlockedAt: award?.awardedAt || prog?.completedAt || null,
          evidence,
        };
      });

      return { success: true, data: userViews };
    } catch (err) {
      logger.error("Failed to retrieve user achievements", err);
      return { success: false, error: "Unable to retrieve user achievements." };
    }
  }
}
