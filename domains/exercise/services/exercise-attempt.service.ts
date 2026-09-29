import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { ExerciseRepository } from "../repositories/exercise.repository";
import { ExerciseAttemptRepository } from "../repositories/exercise-attempt.repository";
import {
  ExerciseAttemptLimitExceededError,
} from "@/features/exercises/state-machine/exercise-state-machine";
import type { ExerciseAttempt, ExerciseResponse } from "../models";
import { logger } from "@/lib/logger";

export class ExerciseAttemptService {
  private readonly exerciseRepo: ExerciseRepository;
  private readonly attemptRepo: ExerciseAttemptRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.exerciseRepo = new ExerciseRepository(supabase);
    this.attemptRepo = new ExerciseAttemptRepository(supabase);
  }

  /**
   * Starts a new exercise attempt or resumes an existing active attempt
   * Emits: exercise.started
   */
  public async startAttempt(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseResponse<ExerciseAttempt>> {
    try {
      const exercise = await this.exerciseRepo.getById(exerciseId);
      if (!exercise) {
        return { success: false, error: "Exercise not found." };
      }

      const attempts = await this.attemptRepo.getAttempts(userId, exercise.id);

      // Reuse active attempt if available
      const activeAttempt = attempts.find(
        (a) => a.state === "in_progress" || a.state === "validated" || a.state === "submitted"
      );
      if (activeAttempt) {
        return { success: true, data: activeAttempt };
      }

      // Check max attempts
      if (
        exercise.maxAttempts !== null &&
        exercise.maxAttempts > 0 &&
        attempts.length >= exercise.maxAttempts
      ) {
        throw new ExerciseAttemptLimitExceededError(
          exercise.maxAttempts,
          attempts.length
        );
      }

      const nextAttemptNumber = attempts.length + 1;
      const newAttempt = await this.attemptRepo.createAttempt(
        userId,
        exercise.id,
        nextAttemptNumber
      );

      if (!newAttempt) {
        return { success: false, error: "Failed to initialize exercise attempt." };
      }

      // Observability: exercise.started
      logger.info("exercise.started", {
        userId,
        exerciseId: exercise.id,
        exerciseSlug: exercise.slug,
        attemptId: newAttempt.id,
        attemptNumber: nextAttemptNumber,
      });

      return { success: true, data: newAttempt };
    } catch (err: unknown) {
      if (err instanceof ExerciseAttemptLimitExceededError) {
        return { success: false, error: err.message };
      }
      logger.error("Failed to start exercise attempt", err);
      return { success: false, error: "Unable to start exercise attempt." };
    }
  }

  /**
   * Resumes an existing attempt
   */
  public async resumeAttempt(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseResponse<ExerciseAttempt>> {
    try {
      const attempt = await this.attemptRepo.getLatestAttempt(userId, exerciseId);
      if (!attempt) {
        return { success: false, error: "No attempt found to resume." };
      }

      if (attempt.state === "completed") {
        return { success: false, error: "Latest attempt is already completed." };
      }

      return { success: true, data: attempt };
    } catch (err) {
      logger.error("Failed to resume exercise attempt", err);
      return { success: false, error: "Unable to resume exercise attempt." };
    }
  }

  /**
   * Cancels an active attempt
   */
  public async cancelAttempt(
    userId: string,
    attemptId: string
  ): Promise<ExerciseResponse<boolean>> {
    try {
      const attempt = await this.attemptRepo.getAttemptById(attemptId);
      if (!attempt) {
        return { success: false, error: "Attempt not found." };
      }

      if (attempt.userId !== userId) {
        return { success: false, error: "Unauthorized access to attempt." };
      }

      if (attempt.state === "completed") {
        return { success: false, error: "Completed attempts cannot be cancelled." };
      }

      const success = await this.attemptRepo.cancelAttempt(attemptId, userId);
      return { success, data: success };
    } catch (err) {
      logger.error("Failed to cancel exercise attempt", err);
      return { success: false, error: "Unable to cancel exercise attempt." };
    }
  }
}
