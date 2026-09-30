import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { LearningPath, Module, Lesson, LessonSummary, LessonExerciseSummary } from "../types";
import { logger } from "@/lib/logger";

export class LearningRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all published learning paths ordered by order_index
   */
  public async getPublishedLearningPaths(): Promise<LearningPath[]> {
    try {
      const { data, error } = await this.supabase
        .from("learning_paths")
        .select("*")
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error) {
        logger.error("Failed to fetch learning paths", error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        difficulty: row.difficulty,
        estimatedHours: row.estimated_hours,
        orderIndex: row.order_index,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getPublishedLearningPaths", err);
      return [];
    }
  }

  /**
   * Fetches a learning path by its slug
   */
  public async getLearningPathBySlug(slug: string): Promise<LearningPath | null> {
    try {
      const { data, error } = await this.supabase
        .from("learning_paths")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        estimatedHours: data.estimated_hours,
        orderIndex: data.order_index,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getLearningPathBySlug", err);
      return null;
    }
  }

  /**
   * Fetches modules for a given learning path ID
   */
  public async getModulesByPathId(pathId: string): Promise<Module[]> {
    try {
      const { data, error } = await this.supabase
        .from("modules")
        .select("*")
        .eq("learning_path_id", pathId)
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error) {
        logger.error("Failed to fetch modules for path", { pathId, error });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        learningPathId: row.learning_path_id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        orderIndex: row.order_index,
        estimatedMinutes: row.estimated_minutes,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getModulesByPathId", err);
      return [];
    }
  }

  /**
   * Fetches a module and its parent path by their slugs
   */
  public async getModuleByPathAndSlug(
    pathSlug: string,
    moduleSlug: string
  ): Promise<{ path: LearningPath; module: Module } | null> {
    try {
      const path = await this.getLearningPathBySlug(pathSlug);
      if (!path) return null;

      const { data, error } = await this.supabase
        .from("modules")
        .select("*")
        .eq("learning_path_id", path.id)
        .eq("slug", moduleSlug)
        .eq("is_published", true)
        .single();

      if (error || !data) return null;

      const moduleData: Module = {
        id: data.id,
        learningPathId: data.learning_path_id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        orderIndex: data.order_index,
        estimatedMinutes: data.estimated_minutes,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return { path, module: moduleData };
    } catch (err) {
      logger.error("Unexpected error in getModuleByPathAndSlug", err);
      return null;
    }
  }

  /**
   * Fetches lesson summaries for a given module ID along with published exercises
   */
  public async getLessonsByModuleId(moduleId: string): Promise<LessonSummary[]> {
    try {
      const { data, error } = await this.supabase
        .from("lessons")
        .select(`
          id, module_id, slug, title, summary, order_index, estimated_minutes, is_published,
          exercises (
            id, lesson_id, category_id, slug, title, description, difficulty, estimated_minutes, objective, expected_outcome, success_criteria, order_index, is_published
          )
        `)
        .eq("module_id", moduleId)
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error) {
        logger.error("Failed to fetch lessons for module", { moduleId, error });
        return [];
      }

      return (data || []).map((row) => {
        const exList = (row.exercises as unknown as Array<{
          id: string;
          lesson_id: string;
          category_id: string;
          slug: string;
          title: string;
          description: string;
          difficulty: string;
          estimated_minutes: number;
          objective?: string;
          expected_outcome?: string;
          success_criteria?: string;
          order_index: number;
          is_published: boolean;
        }>) || [];

        const pubEx = exList.find((e) => e.is_published);
        const exercise: LessonExerciseSummary | null = pubEx
          ? {
              id: pubEx.id,
              lessonId: pubEx.lesson_id,
              categoryId: pubEx.category_id,
              slug: pubEx.slug,
              title: pubEx.title,
              description: pubEx.description,
              difficulty: pubEx.difficulty,
              estimatedMinutes: pubEx.estimated_minutes,
              objective: pubEx.objective,
              expectedOutcome: pubEx.expected_outcome,
              successCriteria: pubEx.success_criteria,
              orderIndex: pubEx.order_index,
              isPublished: pubEx.is_published,
              completion: null,
            }
          : null;

        return {
          id: row.id,
          moduleId: row.module_id,
          slug: row.slug,
          title: row.title,
          summary: row.summary,
          orderIndex: row.order_index,
          estimatedMinutes: row.estimated_minutes,
          isPublished: row.is_published,
          exercise,
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getLessonsByModuleId", err);
      return [];
    }
  }

  /**
   * Fetches full lesson details along with its module and path
   */
  public async getLessonBySlugs(
    pathSlug: string,
    moduleSlug: string,
    lessonSlug: string
  ): Promise<{ path: LearningPath; module: Module; lesson: Lesson } | null> {
    try {
      const moduleContext = await this.getModuleByPathAndSlug(pathSlug, moduleSlug);
      if (!moduleContext) return null;

      const { path, module } = moduleContext;

      const { data, error } = await this.supabase
        .from("lessons")
        .select("*")
        .eq("module_id", module.id)
        .eq("slug", lessonSlug)
        .eq("is_published", true)
        .single();

      if (error || !data) return null;

      const lesson: Lesson = {
        id: data.id,
        moduleId: data.module_id,
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        content: data.content,
        orderIndex: data.order_index,
        estimatedMinutes: data.estimated_minutes,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return { path, module, lesson };
    } catch (err) {
      logger.error("Unexpected error in getLessonBySlugs", err);
      return null;
    }
  }

  /**
   * Fetches associated practical exercise for a given lesson
   */
  public async getLessonExercise(
    lessonId: string,
    userId?: string
  ): Promise<LessonExerciseSummary | null> {
    try {
      const { data, error } = await this.supabase
        .from("exercises")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("is_published", true)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      let completion: { id: string; score: number; completedAt: string } | null = null;
      if (userId) {
        const { data: compData } = await this.supabase
          .from("exercise_completion")
          .select("id, score, completed_at")
          .eq("exercise_id", data.id)
          .eq("user_id", userId)
          .maybeSingle();

        if (compData) {
          completion = {
            id: compData.id,
            score: compData.score,
            completedAt: compData.completed_at,
          };
        }
      }

      return {
        id: data.id,
        lessonId: data.lesson_id,
        categoryId: data.category_id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        estimatedMinutes: data.estimated_minutes,
        objective: data.objective,
        expectedOutcome: data.expected_outcome,
        successCriteria: data.success_criteria,
        orderIndex: data.order_index,
        isPublished: data.is_published,
        completion,
      };
    } catch (err) {
      logger.error("Unexpected error in getLessonExercise", err);
      return null;
    }
  }

  /**
   * Fetches competency alignment for a given lesson
   */
  public async getLessonCompetency(lessonId: string): Promise<import("../types").LessonCompetencyInfo | null> {
    try {
      const { data, error } = await this.supabase
        .from("lesson_competencies")
        .select(`
          target_state,
          contribution_points,
          competencies (
            id,
            code,
            title,
            description,
            category_id,
            level
          )
        `)
        .eq("lesson_id", lessonId)
        .limit(1)
        .maybeSingle();

      if (error || !data || !data.competencies) {
        return null;
      }

      const comp = data.competencies as unknown as {
        id: string;
        code: string;
        title: string;
        description: string | null;
        category_id?: string;
        level: string;
      };

      return {
        code: comp.code,
        title: comp.title,
        description: comp.description,
        targetState: data.target_state as "introduced" | "practicing" | "reinforced" | "mastered",
        capabilityGate: "Gate 1: Foundations",
        contributionPoints: data.contribution_points,
      };
    } catch (err) {
      logger.error("Unexpected error in getLessonCompetency", err);
      return null;
    }
  }

  /**
   * Fetches all published lessons across the entire path in order to resolve adjacent lessons and calculate total progress
   */
  public async getAllPublishedLessonsForPath(
    pathId: string
  ): Promise<
    {
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      estimatedMinutes: number;
      moduleId: string;
      moduleSlug: string;
      moduleOrder: number;
      lessonOrder: number;
    }[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("modules")
        .select(`
          id,
          slug,
          order_index,
          lessons (
            id,
            slug,
            title,
            summary,
            estimated_minutes,
            order_index,
            is_published
          )
        `)
        .eq("learning_path_id", pathId)
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error || !data) return [];

      const flattenedLessons: {
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        estimatedMinutes: number;
        moduleId: string;
        moduleSlug: string;
        moduleOrder: number;
        lessonOrder: number;
      }[] = [];

      for (const mod of data) {
        const publishedLessons = ((mod.lessons as unknown as Array<{
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          estimated_minutes: number;
          order_index: number;
          is_published: boolean;
        }>) || [])
          .filter((l) => l.is_published)
          .sort((a, b) => a.order_index - b.order_index);

        for (const l of publishedLessons) {
          flattenedLessons.push({
            id: l.id,
            slug: l.slug,
            title: l.title,
            summary: l.summary,
            estimatedMinutes: l.estimated_minutes,
            moduleId: mod.id,
            moduleSlug: mod.slug,
            moduleOrder: mod.order_index,
            lessonOrder: l.order_index,
          });
        }
      }

      return flattenedLessons;
    } catch (err) {
      logger.error("Unexpected error in getAllPublishedLessonsForPath", err);
      return [];
    }
  }
}
