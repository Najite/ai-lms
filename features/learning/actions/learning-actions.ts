"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "../services/learning-service";
import {
  startLessonSchema,
  completeLessonSchema,
  learningPathQuerySchema,
  moduleQuerySchema,
  lessonQuerySchema,
  type StartLessonInput,
  type CompleteLessonInput,
  type LearningPathQueryInput,
  type ModuleQueryInput,
  type LessonQueryInput,
} from "../schemas";
import type {
  LearningResponse,
  LearningPath,
  LearningPathDetail,
  ModuleWithLessons,
  LessonNavigationContext,
  UserLearningProgress,
  ProgressMetrics,
} from "../types";
import { logger } from "@/lib/logger";

/**
 * Server Action: Fetches all learning paths with progress metrics
 */
export async function getLearningPathsAction(): Promise<
  LearningResponse<(LearningPath & { metrics: ProgressMetrics })[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const learningService = new LearningService(supabase);
    return await learningService.getLearningPaths(user?.id);
  } catch (err) {
    logger.error("Failed getLearningPathsAction", err);
    return { success: false, error: "Failed to retrieve learning paths." };
  }
}

/**
 * Server Action: Fetches a learning path with all modules and progress
 */
export async function getLearningPathDetailAction(
  input: LearningPathQueryInput
): Promise<LearningResponse<LearningPathDetail>> {
  try {
    const validation = learningPathQuerySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid learning path query parameters.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const learningService = new LearningService(supabase);
    return await learningService.getLearningPathDetail(validation.data.pathSlug, user?.id);
  } catch (err) {
    logger.error("Failed getLearningPathDetailAction", err);
    return { success: false, error: "Failed to retrieve learning path details." };
  }
}

/**
 * Server Action: Fetches a module with all lessons and progress
 */
export async function getModuleDetailAction(
  input: ModuleQueryInput
): Promise<LearningResponse<{ path: LearningPath; module: ModuleWithLessons }>> {
  try {
    const validation = moduleQuerySchema.safeParse(input);
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

    const learningService = new LearningService(supabase);
    return await learningService.getModuleDetail(
      validation.data.pathSlug,
      validation.data.moduleSlug,
      user?.id
    );
  } catch (err) {
    logger.error("Failed getModuleDetailAction", err);
    return { success: false, error: "Failed to retrieve module details." };
  }
}

/**
 * Server Action: Fetches lesson detail, content, adjacent navigation and progress
 */
export async function getLessonDetailAction(
  input: LessonQueryInput
): Promise<LearningResponse<LessonNavigationContext>> {
  try {
    const validation = lessonQuerySchema.safeParse(input);
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

    const learningService = new LearningService(supabase);
    return await learningService.getLessonDetail(
      validation.data.pathSlug,
      validation.data.moduleSlug,
      validation.data.lessonSlug,
      user?.id
    );
  } catch (err) {
    logger.error("Failed getLessonDetailAction", err);
    return { success: false, error: "Failed to retrieve lesson." };
  }
}

/**
 * Server Action: Starts a lesson for the current authenticated user
 */
export async function startLessonAction(
  input: StartLessonInput
): Promise<LearningResponse<UserLearningProgress>> {
  try {
    const validation = startLessonSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid start lesson input.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to start a lesson." };
    }

    const learningService = new LearningService(supabase);
    const result = await learningService.startLesson(
      user.id,
      validation.data.pathSlug,
      validation.data.moduleSlug,
      validation.data.lessonSlug
    );

    if (result.success) {
      revalidatePath(`/learning-paths/${validation.data.pathSlug}`);
      revalidatePath(
        `/learning-paths/${validation.data.pathSlug}/modules/${validation.data.moduleSlug}`
      );
    }

    return result;
  } catch (err) {
    logger.error("Failed startLessonAction", err);
    return { success: false, error: "An unexpected error occurred while starting the lesson." };
  }
}

/**
 * Server Action: Completes a lesson for the current authenticated user
 */
export async function completeLessonAction(
  input: CompleteLessonInput
): Promise<LearningResponse<UserLearningProgress>> {
  try {
    const validation = completeLessonSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid complete lesson input.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to complete a lesson." };
    }

    const learningService = new LearningService(supabase);
    const result = await learningService.completeLesson(
      user.id,
      validation.data.pathSlug,
      validation.data.moduleSlug,
      validation.data.lessonSlug
    );

    if (result.success) {
      revalidatePath("/learning-paths");
      revalidatePath(`/learning-paths/${validation.data.pathSlug}`);
      revalidatePath(
        `/learning-paths/${validation.data.pathSlug}/modules/${validation.data.moduleSlug}`
      );
      revalidatePath(
        `/learning-paths/${validation.data.pathSlug}/modules/${validation.data.moduleSlug}/lessons/${validation.data.lessonSlug}`
      );
    }

    return result;
  } catch (err) {
    logger.error("Failed completeLessonAction", err);
    return { success: false, error: "An unexpected error occurred while completing the lesson." };
  }
}
