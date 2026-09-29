import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { ExerciseRepository } from "../repositories/exercise.repository";
import { ExerciseAttemptRepository } from "../repositories/exercise-attempt.repository";
import { ExerciseSubmissionRepository } from "../repositories/exercise-submission.repository";
import {
  ExerciseStateMachine,
  InvalidExerciseStateTransitionError,
} from "@/features/exercises/state-machine/exercise-state-machine";
import type {
  ExerciseSubmission,
  ExerciseAttempt,
  ValidationResultOutput,
  ExerciseResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class ExerciseSubmissionService {
  private readonly exerciseRepo: ExerciseRepository;
  private readonly attemptRepo: ExerciseAttemptRepository;
  private readonly submissionRepo: ExerciseSubmissionRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.exerciseRepo = new ExerciseRepository(supabase);
    this.attemptRepo = new ExerciseAttemptRepository(supabase);
    this.submissionRepo = new ExerciseSubmissionRepository(supabase);
  }

  /**
   * Submits code for validation
   * Emits: exercise.submitted, exercise.validated
   */
  public async submit(
    userId: string,
    exerciseId: string,
    attemptId: string,
    submittedCode: string,
    content?: string
  ): Promise<
    ExerciseResponse<{
      submission: ExerciseSubmission;
      validationOutput: ValidationResultOutput;
      attempt: ExerciseAttempt;
    }>
  > {
    try {
      const attempt = await this.attemptRepo.getAttemptById(attemptId);
      if (!attempt) {
        return { success: false, error: "Attempt not found." };
      }

      if (attempt.userId !== userId || attempt.exerciseId !== exerciseId) {
        return { success: false, error: "Unauthorized access to attempt." };
      }

      if (attempt.state === "completed") {
        return {
          success: false,
          error: "Completed attempts cannot accept new submissions.",
        };
      }

      const exercise = await this.exerciseRepo.getById(exerciseId);
      if (!exercise) {
        return { success: false, error: "Exercise not found." };
      }

      // Observability: exercise.submitted
      logger.info("exercise.submitted", {
        userId,
        exerciseId,
        attemptId,
        codeLength: submittedCode.length,
      });

      // Automated Rule-based Code Evaluation
      const validationOutput = ExerciseStateMachine.evaluateSubmission(
        submittedCode,
        exercise.validationRules
      );

      const submissionStatus = validationOutput.passed ? "passed" : "failed";

      // Transition attempt to validated
      ExerciseStateMachine.assertValidTransition(attempt.state, "submitted");
      ExerciseStateMachine.assertValidTransition("submitted", "validated");

      const submission = await this.submissionRepo.createSubmission(
        attempt.id,
        userId,
        exercise.id,
        submittedCode,
        submissionStatus,
        validationOutput,
        content
      );

      if (!submission) {
        return { success: false, error: "Failed to record submission." };
      }

      const updatedAttempt = await this.attemptRepo.updateAttemptState(
        attempt.id,
        "validated",
        { submittedAt: new Date().toISOString() }
      );

      // Observability: exercise.validated
      logger.info("exercise.validated", {
        userId,
        exerciseId,
        attemptId,
        submissionId: submission.id,
        score: validationOutput.score,
        passed: validationOutput.passed,
        executionTimeMs: validationOutput.execution_time_ms,
      });

      return {
        success: true,
        data: {
          submission,
          validationOutput,
          attempt: updatedAttempt || attempt,
        },
      };
    } catch (err: unknown) {
      if (err instanceof InvalidExerciseStateTransitionError) {
        return { success: false, error: err.message };
      }
      logger.error("Failed to submit exercise solution", err);
      return { success: false, error: "Unable to submit exercise solution." };
    }
  }
}
