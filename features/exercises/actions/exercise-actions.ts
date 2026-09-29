"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExerciseService } from "../services/exercise-service";
import {
  startExerciseSchema,
  submitExerciseSchema,
  completeExerciseSchema,
  exerciseQuerySchema,
  exerciseIdentifierSchema,
  type StartExerciseInput,
  type SubmitExerciseInput,
  type CompleteExerciseInput,
  type ExerciseQueryInput,
} from "../schemas";
import type {
  ExerciseResponse,
  ExerciseWithDetails,
  ExerciseCategory,
  ExerciseAttempt,
  ExerciseSubmission,
  ExerciseCompletion,
  ExerciseEvidence,
  ExerciseHistoryItem,
  ValidationResultOutput,
} from "../types";
import { logger } from "@/lib/logger";

/**
 * Server Action: Fetches all published exercises with optional filtering
 */
export async function getExercisesAction(
  input?: ExerciseQueryInput
): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
  try {
    const validated = input ? exerciseQuerySchema.safeParse(input) : { success: true, data: undefined };
    if (!validated.success) {
      return { success: false, error: "Invalid query parameters." };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new ExerciseService(supabase);
    return await service.getExercises(validated.data, user?.id);
  } catch (err) {
    logger.error("Failed getExercisesAction", err);
    return { success: false, error: "Failed to retrieve exercises." };
  }
}

/**
 * Server Action: Fetches all exercise categories
 */
export async function getExerciseCategoriesAction(): Promise<
  ExerciseResponse<ExerciseCategory[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const service = new ExerciseService(supabase);
    return await service.getCategories();
  } catch (err) {
    logger.error("Failed getExerciseCategoriesAction", err);
    return { success: false, error: "Failed to retrieve categories." };
  }
}

/**
 * Server Action: Fetches full exercise detail with user context
 */
export async function getExerciseDetailAction(idOrSlug: string): Promise<
  ExerciseResponse<{
    exercise: ExerciseWithDetails;
    attempts: ExerciseAttempt[];
    activeAttempt: ExerciseAttempt | null;
    latestSubmission: ExerciseSubmission | null;
    completion: ExerciseCompletion | null;
    evidence: ExerciseEvidence[];
  }>
> {
  try {
    const validated = exerciseIdentifierSchema.safeParse({ idOrSlug });
    if (!validated.success) {
      return { success: false, error: "Invalid exercise identifier." };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new ExerciseService(supabase);
    return await service.getExerciseDetail(validated.data.idOrSlug, user?.id);
  } catch (err) {
    logger.error(`Failed getExerciseDetailAction for '${idOrSlug}'`, err);
    return { success: false, error: "Failed to retrieve exercise details." };
  }
}

/**
 * Server Action: Fetches exercises for a given lesson
 */
export async function getExercisesByLessonAction(
  lessonId: string
): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new ExerciseService(supabase);
    return await service.getExercisesByLesson(lessonId, user?.id);
  } catch (err) {
    logger.error(`Failed getExercisesByLessonAction for lesson '${lessonId}'`, err);
    return { success: false, error: "Failed to retrieve lesson exercises." };
  }
}

/**
 * Server Action: Starts an exercise attempt
 */
export async function startExerciseAction(
  input: StartExerciseInput
): Promise<ExerciseResponse<ExerciseAttempt>> {
  try {
    const validated = startExerciseSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid input.",
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to start exercise." };
    }

    const service = new ExerciseService(supabase);
    const result = await service.startExercise(user.id, validated.data.exerciseId);

    if (result.success) {
      revalidatePath(`/exercises`);
      revalidatePath(`/exercises/${validated.data.exerciseId}`);
    }

    return result;
  } catch (err) {
    logger.error("Failed startExerciseAction", err);
    return { success: false, error: "Failed to start exercise attempt." };
  }
}

/**
 * Server Action: Submits an exercise code solution for validation
 */
export async function submitExerciseAction(
  input: SubmitExerciseInput
): Promise<
  ExerciseResponse<{
    submission: ExerciseSubmission;
    validationOutput: ValidationResultOutput;
    attempt: ExerciseAttempt;
  }>
> {
  try {
    const validated = submitExerciseSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid submission input.",
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to submit solution." };
    }

    const service = new ExerciseService(supabase);
    const result = await service.submitExercise(
      user.id,
      validated.data.exerciseId,
      validated.data.attemptId,
      validated.data.submittedCode
    );

    if (result.success) {
      revalidatePath(`/exercises`);
      revalidatePath(`/exercises/${validated.data.exerciseId}`);
    }

    return result;
  } catch (err) {
    logger.error("Failed submitExerciseAction", err);
    return { success: false, error: "Failed to submit exercise solution." };
  }
}

/**
 * Server Action: Finalizes completion of an exercise after successful validation
 */
export async function completeExerciseAction(
  input: CompleteExerciseInput
): Promise<
  ExerciseResponse<{
    completion: ExerciseCompletion;
    attempt: ExerciseAttempt;
    evidence: ExerciseEvidence[];
  }>
> {
  try {
    const validated = completeExerciseSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid completion input.",
      };
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to complete exercise." };
    }

    const service = new ExerciseService(supabase);
    const result = await service.completeExercise(
      user.id,
      validated.data.exerciseId,
      validated.data.attemptId
    );

    if (result.success) {
      revalidatePath(`/exercises`);
      revalidatePath(`/exercises/${validated.data.exerciseId}`);
      revalidatePath(`/exercises/history`);
      revalidatePath(`/competencies`);
    }

    return result;
  } catch (err) {
    logger.error("Failed completeExerciseAction", err);
    return { success: false, error: "Failed to complete exercise." };
  }
}

/**
 * Server Action: Retrieves user exercise history
 */
export async function getUserExerciseHistoryAction(): Promise<
  ExerciseResponse<ExerciseHistoryItem[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const service = new ExerciseService(supabase);
    return await service.getUserExerciseHistory(user.id);
  } catch (err) {
    logger.error("Failed getUserExerciseHistoryAction", err);
    return { success: false, error: "Failed to retrieve exercise history." };
  }
}
