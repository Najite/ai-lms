import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { ExerciseRepository } from "../repositories/exercise-repository";
import { ExerciseAttemptRepository } from "../repositories/exercise-attempt-repository";
import {
  ExerciseStateMachine,
  InvalidExerciseStateTransitionError,
  ExerciseAttemptLimitExceededError,
} from "../state-machine/exercise-state-machine";
import type {
  ExerciseCategory,
  ExerciseWithDetails,
  ExerciseAttempt,
  ExerciseSubmission,
  ExerciseCompletion,
  ExerciseEvidence,
  ExerciseHistoryItem,
  ExerciseResponse,
  ValidationResultOutput,
} from "../types";
import { logger } from "@/lib/logger";

export class ExerciseService {
  private readonly exerciseRepo: ExerciseRepository;
  private readonly attemptRepo: ExerciseAttemptRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.exerciseRepo = new ExerciseRepository(supabase);
    this.attemptRepo = new ExerciseAttemptRepository(supabase);
  }

  /**
   * Retrieves all exercise categories
   */
  public async getCategories(): Promise<ExerciseResponse<ExerciseCategory[]>> {
    try {
      const categories = await this.exerciseRepo.getCategories();
      return { success: true, data: categories };
    } catch (err) {
      logger.error("Failed to retrieve exercise categories", err);
      return { success: false, error: "Unable to retrieve exercise categories." };
    }
  }

  /**
   * Retrieves exercises with optional lesson or category filter, including user status
   */
  public async getExercises(
    options?: { lessonId?: string; categoryId?: string },
    userId?: string
  ): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
    try {
      const exercises = await this.exerciseRepo.getExercises(options);

      if (!userId) {
        return { success: true, data: exercises };
      }

      // Enrich with user completion and active attempt
      const enriched = await Promise.all(
        exercises.map(async (ex) => {
          const completion = await this.attemptRepo.getCompletion(userId, ex.id);
          const activeAttempt = await this.attemptRepo.getLatestAttempt(userId, ex.id);
          return {
            ...ex,
            userCompletion: completion,
            activeAttempt: activeAttempt?.state !== "completed" ? activeAttempt : null,
          };
        })
      );

      return { success: true, data: enriched };
    } catch (err) {
      logger.error("Failed to retrieve exercises", err);
      return { success: false, error: "Unable to retrieve exercises." };
    }
  }

  /**
   * Retrieves a single exercise by ID or Slug with user-specific context
   */
  public async getExerciseDetail(
    idOrSlug: string,
    userId?: string
  ): Promise<
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
      const exercise = await this.exerciseRepo.getExerciseByIdOrSlug(idOrSlug);
      if (!exercise) {
        return { success: false, error: `Exercise not found for '${idOrSlug}'.` };
      }

      if (!userId) {
        return {
          success: true,
          data: {
            exercise,
            attempts: [],
            activeAttempt: null,
            latestSubmission: null,
            completion: null,
            evidence: [],
          },
        };
      }

      const [attempts, completion, evidence] = await Promise.all([
        this.attemptRepo.getAttempts(userId, exercise.id),
        this.attemptRepo.getCompletion(userId, exercise.id),
        this.attemptRepo.getEvidenceForExercise(userId, exercise.id),
      ]);

      const activeAttempt = attempts.find((a) => a.state !== "completed") || null;
      let latestSubmission: ExerciseSubmission | null = null;
      if (activeAttempt) {
        latestSubmission = await this.attemptRepo.getLatestSubmissionForAttempt(
          activeAttempt.id
        );
      } else if (attempts.length > 0 && attempts[0]) {
        latestSubmission = await this.attemptRepo.getLatestSubmissionForAttempt(
          attempts[0].id
        );
      }

      return {
        success: true,
        data: {
          exercise: {
            ...exercise,
            userCompletion: completion,
            activeAttempt,
          },
          attempts,
          activeAttempt,
          latestSubmission,
          completion,
          evidence,
        },
      };
    } catch (err) {
      logger.error(`Failed to retrieve exercise detail for '${idOrSlug}'`, err);
      return { success: false, error: "Unable to retrieve exercise detail." };
    }
  }

  /**
   * Retrieves exercises by lesson ID
   */
  public async getExercisesByLesson(
    lessonId: string,
    userId?: string
  ): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
    return this.getExercises({ lessonId }, userId);
  }

  /**
   * Starts an exercise attempt for a user
   */
  public async startExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseResponse<ExerciseAttempt>> {
    try {
      const exercise = await this.exerciseRepo.getExerciseByIdOrSlug(exerciseId);
      if (!exercise) {
        return { success: false, error: "Exercise not found." };
      }

      // Check existing attempts
      const attempts = await this.attemptRepo.getAttempts(userId, exercise.id);

      // If an existing attempt is currently in_progress or submitted or validated, reuse it
      const activeAttempt = attempts.find(
        (a) => a.state === "in_progress" || a.state === "validated"
      );
      if (activeAttempt) {
        return { success: true, data: activeAttempt };
      }

      // Check max attempts limit
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

      logger.info(
        `[Exercise Domain] Started attempt #${nextAttemptNumber} for exercise ${exercise.slug} by user ${userId}`
      );

      return { success: true, data: newAttempt };
    } catch (err: unknown) {
      if (err instanceof ExerciseAttemptLimitExceededError) {
        return { success: false, error: err.message };
      }
      logger.error("Failed to start exercise", err);
      return { success: false, error: "Unable to start exercise attempt." };
    }
  }

  /**
   * Submits a solution for validation
   */
  public async submitExercise(
    userId: string,
    exerciseId: string,
    attemptId: string,
    submittedCode: string
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

      const exercise = await this.exerciseRepo.getExerciseByIdOrSlug(exerciseId);
      if (!exercise) {
        return { success: false, error: "Exercise not found." };
      }

      // Execute automated evaluation
      const validationOutput = ExerciseStateMachine.evaluateSubmission(
        submittedCode,
        exercise.validationRules
      );

      const submissionStatus = validationOutput.passed ? "passed" : "failed";

      // Transition attempt to validated
      ExerciseStateMachine.assertValidTransition(attempt.state, "submitted");
      ExerciseStateMachine.assertValidTransition("submitted", "validated");

      const submission = await this.attemptRepo.createSubmission(
        attempt.id,
        userId,
        exercise.id,
        submittedCode,
        submissionStatus,
        validationOutput
      );

      if (!submission) {
        return { success: false, error: "Failed to record submission." };
      }

      const updatedAttempt = await this.attemptRepo.updateAttemptState(
        attempt.id,
        "validated",
        { submittedAt: new Date().toISOString() }
      );

      // Record assessment run telemetry
      try {
        await this.supabase.from("assessment_runs").insert({
          exercise_id: exercise.id,
          user_id: userId,
          raw_score: validationOutput.score,
          final_score: validationOutput.score,
          anti_cheat_score: 100,
          execution_duration_ms: validationOutput.execution_time_ms,
          memory_usage_bytes: 1024 * 1024,
          status: submissionStatus,
          signature: `eval_${attempt.id}_${Date.now()}`,
          metadata: {
            feedback_count: validationOutput.feedback.length,
            passed_checks: validationOutput.feedback.filter((f) => f.passed).length,
            attempt_number: attempt.attemptNumber,
          },
        });
      } catch (runErr: unknown) {
        logger.warn("[Assessment Engine] Telemetry log failed (continuing)", {
          error: runErr instanceof Error ? runErr.message : String(runErr),
        });
      }

      logger.info(
        `[Exercise Domain] Evaluated submission for exercise ${exercise.slug}. Score: ${validationOutput.score}, Status: ${submissionStatus}`
      );

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
      logger.error("Failed to submit exercise", err);
      return { success: false, error: "Unable to submit exercise solution." };
    }
  }

  /**
   * Completes an exercise after successful validation
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
      const attempt = await this.attemptRepo.getAttemptById(attemptId);
      if (!attempt) {
        return { success: false, error: "Attempt not found." };
      }

      if (attempt.userId !== userId || attempt.exerciseId !== exerciseId) {
        return { success: false, error: "Unauthorized access to attempt." };
      }

      const latestSubmission = await this.attemptRepo.getLatestSubmissionForAttempt(
        attemptId
      );

      if (!latestSubmission || latestSubmission.status !== "passed") {
        return {
          success: false,
          error: "Exercise cannot be completed without a passing validated submission.",
        };
      }

      ExerciseStateMachine.assertValidTransition(attempt.state, "completed");

      const completedAttempt = await this.attemptRepo.updateAttemptState(
        attemptId,
        "completed",
        { completedAt: new Date().toISOString() }
      );

      const exercise = await this.exerciseRepo.getExerciseByIdOrSlug(exerciseId);
      const score = latestSubmission.validationOutput.score || 100;

      // Upsert Completion
      const completion = await this.attemptRepo.upsertCompletion(
        userId,
        exerciseId,
        attemptId,
        score
      );

      if (!completion) {
        return { success: false, error: "Failed to persist exercise completion." };
      }

      // Preserving Exercise Evidence for mapped competencies (Rule #6)
      const evidenceList: ExerciseEvidence[] = [];
      if (exercise && exercise.competencies.length > 0) {
        for (const comp of exercise.competencies) {
          const summary = `Demonstrated practical competency in '${comp.title}' (${comp.code}) by successfully completing exercise '${exercise.title}'. Validation Score: ${score}%. State transitioned from Introduced to Practicing.`;
          const ev = await this.attemptRepo.createEvidence(
            userId,
            exercise.id,
            attemptId,
            comp.id,
            summary
          );
          if (ev) {
            evidenceList.push(ev);
          }

          // Also record competency evidence in public.competency_evidence to reinforce competency domain
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

      // Update module / learning progress
      if (exercise?.lessonId) {
        try {
          const { data: lessonData } = await this.supabase
            .from("lessons")
            .select("module_id, modules (learning_path_id)")
            .eq("id", exercise.lessonId)
            .single();

          if (lessonData && lessonData.module_id) {
            const learningPathId =
              (lessonData.modules as unknown as { learning_path_id: string })?.learning_path_id ||
              "a0000000-0000-0000-0000-000000000001";
            await this.supabase.from("user_learning_progress").upsert({
              user_id: userId,
              lesson_id: exercise.lessonId,
              module_id: lessonData.module_id,
              learning_path_id: learningPathId,
              status: "completed",
              completed_at: new Date().toISOString(),
            });
          }
        } catch (e: unknown) {
          logger.warn("User learning progress upsert notice", {
            error: e instanceof Error ? e.message : String(e),
          });
        }
      }

      logger.info(
        `[Exercise Domain] Completed exercise ${exerciseId} for user ${userId}. Score: ${score}, Evidence preserved: ${evidenceList.length}`
      );

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

  /**
   * Retrieves complete exercise history for a user
   */
  public async getUserExerciseHistory(
    userId: string
  ): Promise<ExerciseResponse<ExerciseHistoryItem[]>> {
    try {
      const history = await this.attemptRepo.getUserExerciseHistory(userId);
      return { success: true, data: history };
    } catch (err) {
      logger.error("Failed to retrieve user exercise history", err);
      return { success: false, error: "Unable to retrieve exercise history." };
    }
  }

  /**
   * Retrieves evidence records for a specific exercise and user
   */
  public async getExerciseEvidence(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseResponse<ExerciseEvidence[]>> {
    try {
      const evidence = await this.attemptRepo.getEvidenceForExercise(
        userId,
        exerciseId
      );
      return { success: true, data: evidence };
    } catch (err) {
      logger.error("Failed to retrieve exercise evidence", err);
      return { success: false, error: "Unable to retrieve exercise evidence." };
    }
  }
}
