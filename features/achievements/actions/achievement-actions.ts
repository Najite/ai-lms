"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AchievementQueryService } from "@/domains/achievement/services/achievement-query.service";
import { AchievementProgressService } from "@/domains/achievement/services/achievement-progress.service";
import { XPBalanceService } from "@/domains/achievement/services/xp-balance.service";
import { XPTransactionService } from "@/domains/achievement/services/xp-transaction.service";
import type {
  Achievement,
  AchievementCategory,
  UserAchievementView,
  XPBalance,
  XPTransaction,
  XPSourceType,
  AchievementResponse,
} from "../types";
import type { AchievementQueryFiltersDTO } from "@/domains/achievement/dto";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Fetches all published achievements
 */
export async function getAchievementsAction(
  filters?: AchievementQueryFiltersDTO
): Promise<AchievementResponse<Achievement[]>> {
  const supabase = await createServerSupabaseClient();
  const service = new AchievementQueryService(supabase);
  return service.getAchievements(filters);
}

/**
 * Server Action: Fetches all achievement categories
 */
export async function getAchievementCategoriesAction(): Promise<
  AchievementResponse<AchievementCategory[]>
> {
  const supabase = await createServerSupabaseClient();
  const service = new AchievementQueryService(supabase);
  return service.getCategories();
}

/**
 * Server Action: Fetches current user's achievement progress and awards
 */
export async function getUserAchievementsAction(): Promise<
  AchievementResponse<UserAchievementView[]>
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const service = new AchievementQueryService(supabase);
  return service.getUserAchievements(user.id);
}

/**
 * Server Action: Fetches current user's XP balance
 */
export async function getUserXPBalanceAction(): Promise<
  AchievementResponse<XPBalance>
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const service = new XPBalanceService(supabase);
  return service.getBalance(user.id);
}

/**
 * Server Action: Fetches current user's XP transaction history
 */
export async function getUserXPTransactionsAction(
  limit: number = 50
): Promise<AchievementResponse<XPTransaction[]>> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const service = new XPTransactionService(supabase);
  return service.getUserTransactions(user.id, limit);
}

/**
 * Server Action: Awards XP for verified activity
 */
export async function awardXPAction(
  sourceType: XPSourceType,
  sourceId: string,
  amount?: number
): Promise<
  AchievementResponse<{
    transaction: XPTransaction;
    balance: XPBalance;
    isDuplicateGrant: boolean;
  }>
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const service = new XPTransactionService(supabase);
  const result = await service.awardXP(user.id, sourceType, sourceId, amount);

  if (result.success) {
    revalidatePath("/achievements");
  }

  return result;
}

/**
 * Server Action: Updates achievement progress
 */
export async function updateAchievementProgressAction(
  achievementId: string,
  progressValue: number
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const service = new AchievementProgressService(supabase);
  const result = await service.updateProgress(user.id, achievementId, progressValue);

  if (result.success) {
    revalidatePath("/achievements");
  }

  return result;
}
