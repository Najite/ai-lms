"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "../services/competency-service";
import {
  competencyQuerySchema,
  moduleCompetenciesQuerySchema,
  lessonCompetenciesQuerySchema,
  updateCompetencyProgressSchema,
  type CompetencyQueryInput,
  type ModuleCompetenciesQueryInput,
  type LessonCompetenciesQueryInput,
  type UpdateCompetencyProgressInput,
} from "../schemas";
import type {
  CompetencyResponse,
  CompetencyWithProgress,
  CompetencyCategory,
  CompetencyDetail,
  UserCompetencyProgress,
  Competency,
  CompetencyState,
} from "../types";
import { logger } from "@/lib/logger";

/**
 * Server Action: Fetches all competencies with user progress if authenticated
 */
export async function getCompetenciesAction(): Promise<
  CompetencyResponse<CompetencyWithProgress[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const competencyService = new CompetencyService(supabase);
    return await competencyService.getCompetencies(user?.id);
  } catch (err) {
    logger.error("Failed getCompetenciesAction", err);
    return { success: false, error: "Failed to retrieve competencies." };
  }
}

/**
 * Server Action: Fetches all competency categories
 */
export async function getCompetencyCategoriesAction(): Promise<
  CompetencyResponse<CompetencyCategory[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const competencyService = new CompetencyService(supabase);
    return await competencyService.getCategories();
  } catch (err) {
    logger.error("Failed getCompetencyCategoriesAction", err);
    return { success: false, error: "Failed to retrieve categories." };
  }
}

/**
 * Server Action: Fetches detailed competency information
 */
export async function getCompetencyDetailAction(
  input: CompetencyQueryInput
): Promise<CompetencyResponse<CompetencyDetail>> {
  try {
    const validation = competencyQuerySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid competency query parameters.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const competencyService = new CompetencyService(supabase);
    return await competencyService.getCompetencyDetail(validation.data, user?.id);
  } catch (err) {
    logger.error("Failed getCompetencyDetailAction", err);
    return { success: false, error: "Failed to retrieve competency details." };
  }
}

/**
 * Server Action: Fetches competencies for a module
 */
export async function getModuleCompetenciesAction(
  input: ModuleCompetenciesQueryInput
): Promise<
  CompetencyResponse<(Competency & { weight: number; progress?: UserCompetencyProgress | null })[]>
> {
  try {
    const validation = moduleCompetenciesQuerySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid module query parameters.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const competencyService = new CompetencyService(supabase);
    return await competencyService.getCompetenciesByModuleId(validation.data.moduleId, user?.id);
  } catch (err) {
    logger.error("Failed getModuleCompetenciesAction", err);
    return { success: false, error: "Failed to retrieve module competencies." };
  }
}

/**
 * Server Action: Fetches competencies for a lesson
 */
export async function getLessonCompetenciesAction(
  input: LessonCompetenciesQueryInput
): Promise<
  CompetencyResponse<
    (Competency & {
      targetState: CompetencyState;
      contributionPoints: number;
      progress?: UserCompetencyProgress | null;
    })[]
  >
> {
  try {
    const validation = lessonCompetenciesQuerySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid lesson query parameters.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const competencyService = new CompetencyService(supabase);
    return await competencyService.getCompetenciesByLessonId(validation.data.lessonId, user?.id);
  } catch (err) {
    logger.error("Failed getLessonCompetenciesAction", err);
    return { success: false, error: "Failed to retrieve lesson competencies." };
  }
}

/**
 * Server Action: Fetches user competency progress list
 */
export async function getUserCompetenciesAction(): Promise<
  CompetencyResponse<UserCompetencyProgress[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const competencyService = new CompetencyService(supabase);
    return await competencyService.getUserCompetencies(user.id);
  } catch (err) {
    logger.error("Failed getUserCompetenciesAction", err);
    return { success: false, error: "Failed to retrieve user competencies." };
  }
}

/**
 * Server Action: Updates competency progress and records evidence
 */
export async function updateCompetencyProgressAction(
  input: UpdateCompetencyProgressInput
): Promise<CompetencyResponse<UserCompetencyProgress>> {
  try {
    const validation = updateCompetencyProgressSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid progress update payload.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to update competency progress." };
    }

    const competencyService = new CompetencyService(supabase);
    const result = await competencyService.updateCompetencyProgress(user.id, validation.data);

    if (result.success) {
      revalidatePath("/competencies");
      revalidatePath("/competencies/progress");
    }

    return result;
  } catch (err) {
    logger.error("Failed updateCompetencyProgressAction", err);
    return { success: false, error: "Failed to update competency progress." };
  }
}
