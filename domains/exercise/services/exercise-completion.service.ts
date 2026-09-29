import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { ExerciseRepository } from "../repositories/exercise.repository";
import { ExerciseAttemptRepository } from "../repositories/exercise-attempt.repository";
import { ExerciseSubmissionRepository } from "../repositories/exercise-submission.repository";
import { ExerciseEvidenceRepository } from "../repositories/exercise-evidence.repository";
import {
  ExerciseStateMachine,
  InvalidExerciseStateTransitionError,
} from "@/features/exercises/state-machine/exercise-state-machine";
import type {
  ExerciseCompletion,
  ExerciseAttempt,
  ExerciseEvidence,
  ExerciseResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class ExerciseCompletionService {
  private readonly exerciseRepo: ExerciseRepository;
  private readonly attemptRepo: ExerciseAttemptRepository;
  private readonly submissionRepo: ExerciseSubmissionRepository;
  private readonly evidenceRepo: ExerciseEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.exerciseRepo = new ExerciseRepository(supabase);
    this.attemptRepo = new ExerciseAttemptRepository(supabase);
    this.submissionRepo = new ExerciseSubmissionRepository(supabase);
    this.evidenceRepo = new ExerciseEvidenceRepository(supabase);
  }

  /**
   * Validates whether an attempt is ready for completion
   */
  public async validateCompletion(
    userId: string,
    exerciseId: string,
    attemptId: string
  ): Promise<
    ExerciseResponse<{
      valid: boolean;
      score: number;
      reason?: string;
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

      const latestSubmission = await this.submissionRepo.getLatestSubmissionForAttempt(
        attemptId
      );

      if (!latestSubmission) {
        return {
          success: true,
          data: { valid: false, score: 0, reason: "No submission found for this attempt." },
        };
      }

      if (latestSubmission.status !== "passed") {
        return {
          success: true,
          data: {
            valid: false,
            score: latestSubmission.validationOutput.score || 0,
            reason: "Latest submission did not pass all validation rules.",
          },
        };
      }

      return {
        success: true,
        data: {
          valid: true,
          score: latestSubmission.validationOutput.score || 100,
        },
      };
    } catch (err) {
      logger.error("Failed to validate exercise completion", err);
      return { success: false, error: "Unable to validate completion eligibility." };
    }
  }

  /**
   * Completes an exercise after passing validation
   * Emits: exercise.completed
   */
  public async completeExercise(
    userId: string,
    exerciseId: string,
    attemptId: string
  ): Promise<
    ExerciseResponse<{
      completion: ExerciseCompletion;
      attempt: ExerciseAttempt;
      evidence: ExerciseEvidence[];
    }>
  > {
    try {
      const validationCheck = await this.validateCompletion(
        userId,
        exerciseId,
        attemptId
      );

      if (!validationCheck.success || !validationCheck.data?.valid) {
        return {
          success: false,
          error:
            validationCheck.data?.reason ||
            "Exercise cannot be completed without a passing validated submission.",
        };
      }

      const attempt = await this.attemptRepo.getAttemptById(attemptId);
      if (!attempt) {
        return { success: false, error: "Attempt not found." };
      }

      ExerciseStateMachine.assertValidTransition(attempt.state, "completed");

      const completedAttempt = await this.attemptRepo.updateAttemptState(
        attemptId,
        "completed",
        { completedAt: new Date().toISOString() }
      );

      const exercise = await this.exerciseRepo.getById(exerciseId);
      const score = validationCheck.data.score;

      // Persist Completion
      const completion = await this.attemptRepo.upsertCompletion(
        userId,
        exerciseId,
        attemptId,
        score
      );

      if (!completion) {
        return { success: false, error: "Failed to persist exercise completion." };
      }

      // Generate & Preserve Competency Evidence (Rule: produce competency evidence)
      const evidenceList: ExerciseEvidence[] = [];
      if (exercise && exercise.competencies.length > 0) {
        for (const comp of exercise.competencies) {
          const summary = `Demonstrated practical competency in '${comp.title}' (${comp.code}) by successfully completing exercise '${exercise.title}'. Validation Score: ${score}%.`;
          const ev = await this.evidenceRepo.createEvidence(
            userId,
            exercise.id,
            attemptId,
            comp.id,
            summary,
            "exercise_completion",
            { score, completedAt: completion.completedAt }
          );

          if (ev) {
            evidenceList.push(ev);
          }

          // Reinforce competency domain evidence ledger
          try {
            await this.supabase.from("competency_evidence").insert({
              user_id: userId,
              competency_id: comp.id,
              source_type: "exercise_completion",
              source_id: exercise.id,
              source_title: `Exercise: ${exercise.title}`,
              summary,
            });
          } catch (e: unknown) {
            logger.warn("Competency evidence integration log failed", {
              error: e instanceof Error ? e.message : String(e),
            });
          }
        }
      }

      // Observability: exercise.completed
      logger.info("exercise.completed", {
        userId,
        exerciseId,
        attemptId,
        score,
        evidenceCount: evidenceList.length,
      });

      return {
        success: true,
        data: {
          completion,
          attempt: completedAttempt || attempt,
          evidence: evidenceList,
        },
      };
    } catch (err: unknown) {
      if (err instanceof InvalidExerciseStateTransitionError) {
        return { success: false, error: err.message };
      }
      logger.error("Failed to complete exercise", err);
      return { success: false, error: "Unable to finalize exercise completion." };
    }
  }
}
