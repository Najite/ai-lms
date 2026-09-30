/**
 * Supported XP Sources in the platform
 */
export type XPSourceType =
  | "lesson_completion"
  | "exercise_completion"
  | "competency_progression"
  | "achievement";

export const XP_SOURCE_TYPES: XPSourceType[] = [
  "lesson_completion",
  "exercise_completion",
  "competency_progression",
  "achievement",
];

/**
 * Standard Default XP Values for Activity Milestones
 */
export const XP_REWARDS: Record<XPSourceType, number> = {
  lesson_completion: 50,
  exercise_completion: 75,
  competency_progression: 100,
  achievement: 100, // Default base reward if not specified by achievement definition
};

/**
 * Achievement Requirement Types
 */
export type RequirementType =
  | "lesson_completion_count"
  | "exercise_completion_count"
  | "competency_reinforced_count"
  | "streak_days"
  | "learning_activity_count"
  | string;

/**
 * Achievement Category Model
 */
export interface AchievementCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

/**
 * Achievement Requirement Model
 */
export interface AchievementRequirement {
  id: string;
  achievementId: string;
  requirementType: RequirementType;
  requirementValue: number;
}

/**
 * Core Achievement Model
 */
export interface Achievement {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  xpReward: number;
  isActive: boolean;
  createdAt: string;
  category?: AchievementCategory;
  requirements?: AchievementRequirement[];
}

/**
 * Achievement Progress Tracking Model
 */
export interface AchievementProgress {
  id: string;
  userId: string;
  achievementId: string;
  progressValue: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  achievement?: Achievement;
}

/**
 * Achievement Award Model
 */
export interface AchievementAward {
  id: string;
  userId: string;
  achievementId: string;
  awardedAt: string;
  achievement?: Achievement;
}

/**
 * Achievement Evidence Model
 */
export interface AchievementEvidence {
  id: string;
  userId: string;
  achievementId: string;
  evidenceType: string;
  evidenceReference: string;
  createdAt: string;
  achievement?: Achievement;
}

/**
 * XP Transaction Ledger Entry Model
 */
export interface XPTransaction {
  id: string;
  userId: string;
  sourceType: XPSourceType;
  sourceId: string;
  amount: number;
  createdAt: string;
}

/**
 * User XP Balance Model
 */
export interface XPBalance {
  userId: string;
  totalXp: number;
  updatedAt: string;
}

/**
 * XP Event Log Model
 */
export interface XPEvent {
  id: string;
  userId: string;
  eventType: string;
  eventReference: string;
  createdAt: string;
}

/**
 * Rich User Achievement View (progress + award status + requirements)
 */
export interface UserAchievementView {
  achievement: Achievement;
  progressValue: number;
  targetValue: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  evidence: AchievementEvidence[];
}

/**
 * Standard Result Response for Achievement Domain
 */
export interface AchievementResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
