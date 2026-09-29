import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/types";
import type {
  ExerciseSubmission,
  ExerciseSubmissionStatus,
  ValidationResultOutput,
} from "../models";
import { logger } from "@/lib/logger";

export class ExerciseSubmissionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates a submission record with validation results
   */
  public async createSubmission(
    attemptId: string,
    userId: string,
    exerciseId: string,
    code: string,
    status: ExerciseSubmissionStatus,
    validationOutput: ValidationResultOutput,
    content?: string
  ): Promise<ExerciseSubmission | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_submissions")
        .insert({
          attempt_id: attemptId,
          user_id: userId,
          exercise_id: exerciseId,
          submitted_code: code,
          status,
          validation_output: validationOutput as unknown as Json,
        })
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to create exercise submission", error);
        return null;
      }

      return {
        id: data.id,
        attemptId: data.attempt_id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        submittedCode: data.submitted_code,
        content: content || data.submitted_code,
        status: data.status,
        validationOutput: data.validation_output as unknown as ValidationResultOutput,
        submittedAt: data.created_at,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createSubmission", err);
      return null;
    }
  }

  /**
   * Fetches the latest submission for an attempt
   */
  public async getLatestSubmissionForAttempt(
    attemptId: string
  ): Promise<ExerciseSubmission | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_submissions")
        .select("*")
        .eq("attempt_id", attemptId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        attemptId: data.attempt_id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        submittedCode: data.submitted_code,
        content: data.submitted_code,
        status: data.status,
        validationOutput: data.validation_output as unknown as ValidationResultOutput,
        submittedAt: data.created_at,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error(`Unexpected error in getLatestSubmissionForAttempt('${attemptId}')`, err);
      return null;
    }
  }

  /**
   * Fetches all submissions for an attempt
   */
  public async getSubmissionsForAttempt(
    attemptId: string
  ): Promise<ExerciseSubmission[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_submissions")
        .select("*")
        .eq("attempt_id", attemptId)
        .order("created_at", { ascending: true });

      if (error || !data) {
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        attemptId: row.attempt_id,
        userId: row.user_id,
        exerciseId: row.exercise_id,
        submittedCode: row.submitted_code,
        content: row.submitted_code,
        status: row.status,
        validationOutput: row.validation_output as unknown as ValidationResultOutput,
        submittedAt: row.created_at,
        createdAt: row.created_at,
      }));
    } catch (err) {
      logger.error(`Unexpected error in getSubmissionsForAttempt('${attemptId}')`, err);
      return [];
    }
  }
}
