import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  ExerciseEvidence,
  ExerciseHistoryItem,
  ValidationResultOutput,
  ExerciseCompletion,
} from "../models";
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

export class ExerciseEvidenceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates or updates an exercise evidence record
   */
  public async createEvidence(
    userId: string,
    exerciseId: string,
    attemptId: string,
    competencyId: string,
    summary: string,
    evidenceType?: string,
    evidencePayload?: Record<string, unknown>
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
        evidenceType: evidenceType || "exercise_validation",
        evidencePayload,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in createEvidence", err);
      return null;
    }
  }

  /**
   * Retrieves evidence records for a specific exercise and user, or all user evidence
   */
  public async retrieveEvidence(
    userId: string,
    exerciseId?: string
  ): Promise<ExerciseEvidence[]> {
    try {
      let query = this.supabase
        .from("exercise_evidence")
        .select(`
          *,
          competencies (
            code,
            title
          )
        `)
        .eq("user_id", userId);

      if (exerciseId) {
        query = query.eq("exercise_id", exerciseId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

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
        evidenceType: "exercise_validation",
        createdAt: row.created_at,
        competency: row.competencies
          ? {
              code: row.competencies.code,
              title: row.competencies.title,
            }
          : undefined,
      }));
    } catch (err) {
      logger.error("Unexpected error in retrieveEvidence", err);
      return [];
    }
  }

  /**
   * Alias for retrieving evidence for an exercise
   */
  public async getEvidenceForExercise(
    userId: string,
    exerciseId: string
  ): Promise<ExerciseEvidence[]> {
    return this.retrieveEvidence(userId, exerciseId);
  }

  /**
   * Alias for retrieving all evidence for a user
   */
  public async getAllEvidenceForUser(
    userId: string
  ): Promise<ExerciseEvidence[]> {
    return this.retrieveEvidence(userId);
  }

  /**
   * Retrieves complete user exercise history with all attempts, submissions, and evidence
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
              evidenceType: "exercise_validation",
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
                content: latestSub.submitted_code,
                status: latestSub.status,
                validationOutput:
                  latestSub.validation_output as unknown as ValidationResultOutput,
                submittedAt: latestSub.created_at,
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
