import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { UserLearningProgress, LearningProgressStatus } from "../types";
import { logger } from "@/lib/logger";

export class ProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all learning progress records for a user across all paths
   */
  public async getAllUserProgress(userId: string): Promise<UserLearningProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_learning_progress")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to fetch all user progress", { userId, error });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        learningPathId: row.learning_path_id,
        moduleId: row.module_id,
        lessonId: row.lesson_id,
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getAllUserProgress", err);
      return [];
    }
  }

  /**
   * Fetches all user progress records for a specific learning path
   */
  public async getUserProgressForPath(
    userId: string,
    pathId: string
  ): Promise<UserLearningProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_learning_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("learning_path_id", pathId);

      if (error) {
        logger.error("Failed to fetch path progress", { userId, pathId, error });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        learningPathId: row.learning_path_id,
        moduleId: row.module_id,
        lessonId: row.lesson_id,
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getUserProgressForPath", err);
      return [];
    }
  }

  /**
   * Fetches all user progress records for a specific module
   */
  public async getUserProgressForModule(
    userId: string,
    moduleId: string
  ): Promise<UserLearningProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_learning_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("module_id", moduleId);

      if (error) {
        logger.error("Failed to fetch module progress", { userId, moduleId, error });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        learningPathId: row.learning_path_id,
        moduleId: row.module_id,
        lessonId: row.lesson_id,
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getUserProgressForModule", err);
      return [];
    }
  }

  /**
   * Fetches single progress record for a user and lesson
   */
  public async getUserLessonProgress(
    userId: string,
    lessonId: string
  ): Promise<UserLearningProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_learning_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        learningPathId: data.learning_path_id,
        moduleId: data.module_id,
        lessonId: data.lesson_id,
        status: data.status,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getUserLessonProgress", err);
      return null;
    }
  }

  /**
   * Idempotently upserts a user learning progress record
   */
  public async upsertLessonProgress(
    userId: string,
    pathId: string,
    moduleId: string,
    lessonId: string,
    status: LearningProgressStatus
  ): Promise<UserLearningProgress | null> {
    try {
      const now = new Date().toISOString();
      const isCompleted = status === "completed";

      const { data, error } = await this.supabase
        .from("user_learning_progress")
        .upsert(
          {
            user_id: userId,
            learning_path_id: pathId,
            module_id: moduleId,
            lesson_id: lessonId,
            status,
            completed_at: isCompleted ? now : null,
            updated_at: now,
          },
          {
            onConflict: "user_id,lesson_id",
          }
        )
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to upsert lesson progress", { userId, lessonId, status, error });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        learningPathId: data.learning_path_id,
        moduleId: data.module_id,
        lessonId: data.lesson_id,
        status: data.status,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in upsertLessonProgress", err);
      return null;
    }
  }
}
