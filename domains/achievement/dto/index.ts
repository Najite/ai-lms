import type { XPSourceType } from "../models";

/**
 * DTOs for Achievement & XP operations
 */

export interface AwardXPDTO {
  userId: string;
  sourceType: XPSourceType;
  sourceId: string;
  amount?: number;
}

export interface CreateXPTransactionDTO {
  userId: string;
  sourceType: XPSourceType;
  sourceId: string;
  amount: number;
}

export interface UpdateAchievementProgressDTO {
  userId: string;
  achievementId: string;
  progressValue: number;
}

export interface AwardAchievementDTO {
  userId: string;
  achievementId: string;
  evidenceType?: string;
  evidenceReference?: string;
}

export interface CreateAchievementEvidenceDTO {
  userId: string;
  achievementId: string;
  evidenceType: string;
  evidenceReference: string;
}

export interface AchievementQueryFiltersDTO {
  categoryId?: string;
  slug?: string;
  isActive?: boolean;
}
