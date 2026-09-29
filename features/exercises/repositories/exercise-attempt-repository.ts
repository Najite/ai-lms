import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/types";
import type {
  ExerciseAttempt,
  ExerciseSubmission,
  ExerciseCompletion,
  ExerciseEvidence,
  ExerciseState,
  ExerciseSubmissionStatus,
  ValidationResultOutput,
  ExerciseHistoryItem,
} from "../types";
import { logger } from "@/lib/logger";

type ExerciseEvidenceRowWithCompetency = Database["public"]["Tables"]["exercise_evidence"]["Row"] & {
  competencies: {
    code: string;
    title: string;
  } | null;
};

type ExerciseAttemptRowWithHistory = Database["public"]["Tables"]["exercise_attempts"]["Row"] & {
  exercises: {
    id: string;
    slug: string;
    title: string;
    exercise_categories: {
      name: string;
    } | null;
  } | null;
  exercise_submissions: Database["public"]["Tables"]["exercise_submissions"]["Row"][];
  exercise_evidence: ExerciseEvidenceRowWithCompetency[];
};

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
   * Fetches attempt by ID
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
   * Updates state and metadata on an exercise attempt
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
   * Creates a submission record with validation results
   */
  public async createSubmission(
    attemptId: string,
    userId: string,
    exerciseId: string,
    code: string,
    status: ExerciseSubmissionStatus,
    validationOutput: ValidationResultOutput
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
        status: data.status,
        validationOutput: data.validation_output as unknown as ValidationResultOutput,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createSubmission", err);
      return null;
    }
  }

  /**
   * Fetches latest submission for an attempt
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
        status: data.status,
        validationOutput: data.validation_output as unknown as ValidationResultOutput,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error(`Unexpected error in getLatestSubmissionForAttempt('${attemptId}')`, err);
      return null;
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

  /**
   * Creates an exercise evidence record
   */
  public async createEvidence(
    userId: string,
    exerciseId: string,
    attemptId: string,
    competencyId: string,
    summary: string
  ): Promise<ExerciseEvidence | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_evidence")
        .upsert(
          {
            user_id: userId,
            exercise_id: exerciseId,
            attempt_id: attemptId,
            competency_id: competencyId,
            summary,
          },
          { onConflict: "user_id,exercise_id,attempt_id,competency_id" }
        )
        .select()
        .single();

      if (error || !data) {
        logger.error("Failed to create exercise evidence", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        exerciseId: data.exercise_id,
        attemptId: data.attempt_id,
        competencyId: data.competency_id,
        summary: data.summary,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createEvidence", err);
      return null;
    }
  }

  /**
   * Fetches all evidence generated for an exercise by a user
   */
  public async getEvidenceForExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseEvidence[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_evidence")
        .select(`
          *,
          competencies (
            code,
            title
          )
        `)
        .eq("user_id", userId)
        .eq("exercise_id", exerciseId)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch exercise evidence", error);
        return [];
      }

      return ((data || []) as unknown as ExerciseEvidenceRowWithCompetency[]).map((row) => ({
        id: row.id,
        userId: row.user_id,
        exerciseId: row.exercise_id,
        attemptId: row.attempt_id,
        competencyId: row.competency_id,
        summary: row.summary,
        createdAt: row.created_at,
        competency: row.competencies
          ? {
              code: row.competencies.code,
              title: row.competencies.title,
            }
          : undefined,
      }));
    } catch (err) {
      logger.error("Unexpected error in getEvidenceForExercise", err);
      return [];
    }
  }

  /**
   * Fetches complete exercise history for a user
   */
  public async getUserExerciseHistory(
    userId: string
  ): Promise<ExerciseHistoryItem[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_attempts")
        .select(`
          *,
          exercises (
            id,
            slug,
            title,
            exercise_categories (
              name
            )
          ),
          exercise_submissions (*),
          exercise_evidence (
            *,
            competencies (
              code,
              title
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        logger.error("Failed to fetch user exercise history", error);
        return [];
      }

      // Fetch completions for this user
      const { data: completions } = await this.supabase
        .from("exercise_completion")
        .select("*")
        .eq("user_id", userId);

      const completionMap = new Map<string, ExerciseCompletion>();
      (completions || []).forEach((c) => {
        completionMap.set(c.exercise_id, {
          id: c.id,
          userId: c.user_id,
          exerciseId: c.exercise_id,
          bestAttemptId: c.best_attempt_id,
          status: c.status,
          score: Number(c.score),
          completedAt: c.completed_at,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        });
      });

      return (data as unknown as ExerciseAttemptRowWithHistory[]).map((row) => {
        const ex = row.exercises;
        const cat = ex?.exercise_categories;
        const submissions = Array.isArray(row.exercise_submissions)
          ? [...row.exercise_submissions].sort(
              (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
          : [];
        const latestSub = submissions[0] || null;

        const evidence = Array.isArray(row.exercise_evidence)
          ? row.exercise_evidence.map((ev) => ({
              id: ev.id,
              userId: ev.user_id,
              exerciseId: ev.exercise_id,
              attemptId: ev.attempt_id,
              competencyId: ev.competency_id,
              summary: ev.summary,
              createdAt: ev.created_at,
              competency: ev.competencies
                ? {
                    code: ev.competencies.code,
                    title: ev.competencies.title,
                  }
                : undefined,
            }))
          : [];

        return {
          exercise: {
            id: ex?.id || row.exercise_id,
            slug: ex?.slug || "",
            title: ex?.title || "Exercise",
            categoryName: cat?.name || "General",
          },
          attempt: {
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
          },
          latestSubmission: latestSub
            ? {
                id: latestSub.id,
                attemptId: latestSub.attempt_id,
                userId: latestSub.user_id,
                exerciseId: latestSub.exercise_id,
                submittedCode: latestSub.submitted_code,
                status: latestSub.status,
                validationOutput:
                  latestSub.validation_output as unknown as ValidationResultOutput,
                createdAt: latestSub.created_at,
              }
            : null,
          completion: completionMap.get(row.exercise_id) || null,
          evidence,
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getUserExerciseHistory", err);
      return [];
    }
  }
}
