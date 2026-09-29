import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  ExerciseAttempt,
  ExerciseCompletion,
  ExerciseState,
} from "../models";
import { logger } from "@/lib/logger";

export class ExerciseAttemptRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all attempts for a user on a given exercise
   */
  public async getAttempts(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseAttempt[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("exercise_id", exerciseId)
        .order("attempt_number", { ascending: false });

      if (error) {
        logger.error("Failed to fetch exercise attempts", error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        exerciseId: row.exercise_id,
        attemptNumber: row.attempt_number,
        state: row.state,
        startedAt: row.started_at,
        submittedAt: row.submitted_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getAttempts", err);
      return [];
    }
  }

  /**
   * Fetches the latest attempt for a user on an exercise
   */
  public async getLatestAttempt(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseAttempt | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("exercise_id", exerciseId)
        .order("attempt_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        attemptNumber: data.attempt_number,
        state: data.state,
        startedAt: data.started_at,
        submittedAt: data.submitted_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getLatestAttempt", err);
      return null;
    }
  }

  /**
   * Fetches an attempt by ID
   */
  public async getAttemptById(
    attemptId: string
  ): Promise<ExerciseAttempt | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_attempts")
        .select("*")
        .eq("id", attemptId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        attemptNumber: data.attempt_number,
        state: data.state,
        startedAt: data.started_at,
        submittedAt: data.submitted_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error(`Unexpected error in getAttemptById('${attemptId}')`, err);
      return null;
    }
  }

  /**
   * Creates a new exercise attempt
   */
  public async createAttempt(
    userId: string,
    exerciseId: string,
    attemptNumber: number
  ): Promise<ExerciseAttempt | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_attempts")
        .insert({
          user_id: userId,
          exercise_id: exerciseId,
          attempt_number: attemptNumber,
          state: "in_progress",
        })
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to create exercise attempt", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        attemptNumber: data.attempt_number,
        state: data.state,
        startedAt: data.started_at,
        submittedAt: data.submitted_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createAttempt", err);
      return null;
    }
  }

  /**
   * Updates state and timestamps on an exercise attempt
   */
  public async updateAttemptState(
    attemptId: string,
    state: ExerciseState,
    meta?: { submittedAt?: string; completedAt?: string }
  ): Promise<ExerciseAttempt | null> {
    try {
      const updatePayload: Database["public"]["Tables"]["exercise_attempts"]["Update"] = {
        state,
      };

      if (meta?.submittedAt !== undefined) {
        updatePayload.submitted_at = meta.submittedAt;
      }
      if (meta?.completedAt !== undefined) {
        updatePayload.completed_at = meta.completedAt;
      }

      const { data, error } = await this.supabase
        .from("exercise_attempts")
        .update(updatePayload)
        .eq("id", attemptId)
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to update exercise attempt state", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        attemptNumber: data.attempt_number,
        state: data.state,
        startedAt: data.started_at,
        submittedAt: data.submitted_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error(`Unexpected error in updateAttemptState('${attemptId}')`, err);
      return null;
    }
  }

  /**
   * Cancels an active attempt
   */
  public async cancelAttempt(
    attemptId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("exercise_attempts")
        .delete()
        .eq("id", attemptId)
        .eq("user_id", userId)
        .neq("state", "completed");

      return !error;
    } catch (err) {
      logger.error("Failed to cancel attempt", err);
      return false;
    }
  }

  /**
   * Fetches user completion record for an exercise
   */
  public async getCompletion(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseCompletion | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_completion")
        .select("*")
        .eq("user_id", userId)
        .eq("exercise_id", exerciseId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        bestAttemptId: data.best_attempt_id,
        status: data.status,
        score: Number(data.score),
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getCompletion", err);
      return null;
    }
  }

  /**
   * Upserts exercise completion record
   */
  public async upsertCompletion(
    userId: string,
    exerciseId: string,
    bestAttemptId: string,
    score: number
  ): Promise<ExerciseCompletion | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_completion")
        .upsert(
          {
            user_id: userId,
            exercise_id: exerciseId,
            best_attempt_id: bestAttemptId,
            status: "completed",
            score,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,exercise_id" }
        )
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to upsert exercise completion", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        bestAttemptId: data.best_attempt_id,
        status: data.status,
        score: Number(data.score),
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in upsertCompletion", err);
      return null;
    }
  }
}
