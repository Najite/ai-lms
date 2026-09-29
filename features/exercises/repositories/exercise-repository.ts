import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  ExerciseCategory,
  ExerciseWithDetails,
  ExerciseValidationRules,
} from "../types";
import { logger } from "@/lib/logger";

type ExerciseRowWithRelations = Database["public"]["Tables"]["exercises"]["Row"] & {
  exercise_categories: Database["public"]["Tables"]["exercise_categories"]["Row"];
  exercise_competencies: {
    weight: number;
    competencies: {
      id: string;
      code: string;
      title: string;
      level: string;
    } | null;
  }[];
};

export class ExerciseRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all exercise categories ordered by order_index
   */
  public async getCategories(): Promise<ExerciseCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from("exercise_categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        logger.error("Failed to fetch exercise categories", error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        orderIndex: row.order_index,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getCategories", err);
      return [];
    }
  }

  /**
   * Fetches exercises with optional filters for lesson or category
   */
  public async getExercises(options?: {
    lessonId?: string;
    categoryId?: string;
  }): Promise<ExerciseWithDetails[]> {
    try {
      let query = this.supabase
        .from("exercises")
        .select(`
          *,
          exercise_categories (*),
          exercise_competencies (
            weight,
            competencies (
              id,
              code,
              title,
              level
            )
          )
        `)
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (options?.lessonId) {
        query = query.eq("lesson_id", options.lessonId);
      }
      if (options?.categoryId) {
        query = query.eq("category_id", options.categoryId);
      }

      const { data, error } = await query;

      if (error || !data) {
        logger.error("Failed to fetch exercises", error);
        return [];
      }

      return (data as unknown as ExerciseRowWithRelations[]).map((row) =>
        this.mapExerciseWithDetails(row)
      );
    } catch (err) {
      logger.error("Unexpected error in getExercises", err);
      return [];
    }
  }

  /**
   * Fetches an exercise by its unique UUID or slug with full relation graph
   */
  public async getExerciseByIdOrSlug(
    idOrSlug: string
  ): Promise<ExerciseWithDetails | null> {
    try {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          idOrSlug
        );

      let query = this.supabase
        .from("exercises")
        .select(`
          *,
          exercise_categories (*),
          exercise_competencies (
            weight,
            competencies (
              id,
              code,
              title,
              level
            )
          )
        `);

      if (isUUID) {
        query = query.eq("id", idOrSlug);
      } else {
        query = query.eq("slug", idOrSlug);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        logger.warn(`Exercise not found for '${idOrSlug}'`, { error: error?.message });
        return null;
      }

      return this.mapExerciseWithDetails(data as unknown as ExerciseRowWithRelations);
    } catch (err) {
      logger.error(`Unexpected error in getExerciseByIdOrSlug('${idOrSlug}')`, err);
      return null;
    }
  }

  /**
   * Fetches all exercises associated with a lesson
   */
  public async getExercisesByLessonId(
    lessonId: string
  ): Promise<ExerciseWithDetails[]> {
    return this.getExercises({ lessonId });
  }

  /**
   * Helper to map raw Supabase row to domain model
   */
  private mapExerciseWithDetails(row: ExerciseRowWithRelations): ExerciseWithDetails {
    const category = row.exercise_categories;
    const comps = Array.isArray(row.exercise_competencies)
      ? row.exercise_competencies
          .filter((ec) => ec.competencies !== null)
          .map((ec) => ({
            id: ec.competencies!.id,
            code: ec.competencies!.code,
            title: ec.competencies!.title,
            level: ec.competencies!.level,
            weight: Number(ec.weight) || 1.0,
          }))
      : [];

    return {
      id: row.id,
      lessonId: row.lesson_id,
      categoryId: row.category_id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      instructions: row.instructions,
      starterCode: row.starter_code || "",
      solutionTemplate: row.solution_template || "",
      validationRules: (row.validation_rules || {}) as ExerciseValidationRules,
      estimatedMinutes: row.estimated_minutes,
      maxAttempts: row.max_attempts,
      orderIndex: row.order_index,
      isPublished: row.is_published,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      category: {
        id: category?.id || "",
        slug: category?.slug || "",
        name: category?.name || "",
        description: category?.description || "",
        orderIndex: category?.order_index || 0,
        createdAt: category?.created_at || "",
        updatedAt: category?.updated_at || "",
      },
      competencies: comps,
    };
  }
}
