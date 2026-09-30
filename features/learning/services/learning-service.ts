import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { LearningRepository } from "../repositories/learning-repository";
import { ProgressRepository } from "../repositories/progress-repository";
import { ProgressCalculator } from "./progress-calculator";
import type {
  LearningPath,
  LearningPathDetail,
  ModuleWithLessons,
  LessonNavigationContext,
  UserLearningProgress,
  LearningResponse,
  ProgressMetrics,
} from "../types";
import { logger } from "@/lib/logger";

export class LearningService {
  private readonly learningRepo: LearningRepository;
  private readonly progressRepo: ProgressRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.learningRepo = new LearningRepository(supabase);
    this.progressRepo = new ProgressRepository(supabase);
  }

  /**
   * Retrieves all published learning paths enriched with user progress metrics if user is authenticated
   */
  public async getLearningPaths(
    userId?: string
  ): Promise<LearningResponse<(LearningPath & { metrics: ProgressMetrics })[]>> {
    try {
      const paths = await this.learningRepo.getPublishedLearningPaths();
      const allUserProgress = userId ? await this.progressRepo.getAllUserProgress(userId) : [];

      const enrichedPaths: (LearningPath & { metrics: ProgressMetrics })[] = [];

      for (const path of paths) {
        const pathLessons = await this.learningRepo.getAllPublishedLessonsForPath(path.id);
        const pathLessonIds = pathLessons.map((l) => l.id);
        const pathProgressRecords = allUserProgress.filter((p) => p.learningPathId === path.id);

        const metrics = ProgressCalculator.calculateFromRecords(
          pathLessonIds,
          pathProgressRecords
        );

        enrichedPaths.push({
          ...path,
          metrics,
        });
      }

      return {
        success: true,
        data: enrichedPaths,
      };
    } catch (err) {
      logger.error("Failed to fetch learning paths with metrics", err);
      return {
        success: false,
        error: "Failed to retrieve learning paths.",
      };
    }
  }

  /**
   * Retrieves learning path detail with its modules, lesson summaries, and progress metrics
   */
  public async getLearningPathDetail(
    pathSlug: string,
    userId?: string
  ): Promise<LearningResponse<LearningPathDetail>> {
    try {
      const path = await this.learningRepo.getLearningPathBySlug(pathSlug);
      if (!path) {
        return { success: false, error: "Learning path not found." };
      }

      const modules = await this.learningRepo.getModulesByPathId(path.id);
      const userProgress = userId
        ? await this.progressRepo.getUserProgressForPath(userId, path.id)
        : [];

      const progressByLesson = new Map<string, UserLearningProgress>();
      userProgress.forEach((p) => progressByLesson.set(p.lessonId, p));

      const modulesWithLessons: ModuleWithLessons[] = [];
      const allPathLessonIds: string[] = [];

      for (const mod of modules) {
        const lessons = await this.learningRepo.getLessonsByModuleId(mod.id);
        const modLessonIds = lessons.map((l) => l.id);
        allPathLessonIds.push(...modLessonIds);

        const modProgressRecords = userProgress.filter((p) => p.moduleId === mod.id);
        const modMetrics = ProgressCalculator.calculateFromRecords(
          modLessonIds,
          modProgressRecords
        );

        const lessonsWithProgress = lessons.map((l) => ({
          ...l,
          progress: progressByLesson.get(l.id) || null,
        }));

        modulesWithLessons.push({
          ...mod,
          lessons: lessonsWithProgress,
          metrics: modMetrics,
        });
      }

      const pathMetrics = ProgressCalculator.calculateFromRecords(
        allPathLessonIds,
        userProgress
      );

      return {
        success: true,
        data: {
          ...path,
          modules: modulesWithLessons,
          metrics: pathMetrics,
        },
      };
    } catch (err) {
      logger.error("Failed to fetch learning path detail", { pathSlug, err });
      return { success: false, error: "Failed to retrieve learning path details." };
    }
  }

  /**
   * Retrieves module detail with lessons and metrics
   */
  public async getModuleDetail(
    pathSlug: string,
    moduleSlug: string,
    userId?: string
  ): Promise<LearningResponse<{ path: LearningPath; module: ModuleWithLessons }>> {
    try {
      const result = await this.learningRepo.getModuleByPathAndSlug(pathSlug, moduleSlug);
      if (!result) {
        return { success: false, error: "Module not found in the specified learning path." };
      }

      const { path, module } = result;
      const lessons = await this.learningRepo.getLessonsByModuleId(module.id);
      const modLessonIds = lessons.map((l) => l.id);

      const userProgress = userId
        ? await this.progressRepo.getUserProgressForModule(userId, module.id)
        : [];

      const progressByLesson = new Map<string, UserLearningProgress>();
      userProgress.forEach((p) => progressByLesson.set(p.lessonId, p));

      const modMetrics = ProgressCalculator.calculateFromRecords(
        modLessonIds,
        userProgress
      );

      const lessonsWithProgress = lessons.map((l) => ({
        ...l,
        progress: progressByLesson.get(l.id) || null,
      }));

      return {
        success: true,
        data: {
          path,
          module: {
            ...module,
            lessons: lessonsWithProgress,
            metrics: modMetrics,
          },
        },
      };
    } catch (err) {
      logger.error("Failed to fetch module detail", { pathSlug, moduleSlug, err });
      return { success: false, error: "Failed to retrieve module details." };
    }
  }

  /**
   * Retrieves lesson detail, content, adjacent lessons navigation context, and progress
   */
  public async getLessonDetail(
    pathSlug: string,
    moduleSlug: string,
    lessonSlug: string,
    userId?: string
  ): Promise<LearningResponse<LessonNavigationContext>> {
    try {
      const lessonResult = await this.learningRepo.getLessonBySlugs(
        pathSlug,
        moduleSlug,
        lessonSlug
      );

      if (!lessonResult) {
        return { success: false, error: "Lesson not found." };
      }

      const { path, module, lesson } = lessonResult;

      // Resolve adjacent lessons across the entire published learning path
      const allLessons = await this.learningRepo.getAllPublishedLessonsForPath(path.id);
      const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);

      const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined;
      const nextItem =
        currentIndex >= 0 && currentIndex < allLessons.length - 1
          ? allLessons[currentIndex + 1]
          : undefined;

      const previousLesson = prevItem
        ? {
            pathSlug: path.slug,
            moduleSlug: prevItem.moduleSlug,
            lessonSlug: prevItem.slug,
            title: prevItem.title,
          }
        : null;

      const nextLesson = nextItem
        ? {
            pathSlug: path.slug,
            moduleSlug: nextItem.moduleSlug,
            lessonSlug: nextItem.slug,
            title: nextItem.title,
            summary: nextItem.summary,
            estimatedMinutes: nextItem.estimatedMinutes,
            orderIndex: nextItem.lessonOrder,
          }
        : null;

      const progress = userId
        ? await this.progressRepo.getUserLessonProgress(userId, lesson.id)
        : null;

      const [dbCompetency, exercise] = await Promise.all([
        this.learningRepo.getLessonCompetency(lesson.id),
        this.learningRepo.getLessonExercise(lesson.id, userId),
      ]);

      // Default fallback if database mapping is not yet migrated
      const competency = dbCompetency || {
        code: "DEV-00",
        title: "Developer Environment & Tooling Fluency",
        targetState: "introduced" as const,
        capabilityGate: "Gate 1: Foundations",
      };

      return {
        success: true,
        data: {
          currentLesson: lesson,
          currentModule: module,
          currentPath: path,
          previousLesson,
          nextLesson,
          progress,
          competency,
          exercise,
        },
      };
    } catch (err) {
      logger.error("Failed to fetch lesson detail", { pathSlug, moduleSlug, lessonSlug, err });
      return { success: false, error: "Failed to retrieve lesson." };
    }
  }

  /**
   * Starts a lesson for the user (sets progress to in_progress if not already completed)
   */
  public async startLesson(
    userId: string,
    pathSlug: string,
    moduleSlug: string,
    lessonSlug: string
  ): Promise<LearningResponse<UserLearningProgress>> {
    try {
      const lessonResult = await this.learningRepo.getLessonBySlugs(
        pathSlug,
        moduleSlug,
        lessonSlug
      );

      if (!lessonResult) {
        return { success: false, error: "Cannot start non-existent or unpublished lesson." };
      }

      const { path, module, lesson } = lessonResult;

      const existingProgress = await this.progressRepo.getUserLessonProgress(
        userId,
        lesson.id
      );

      // If already completed, do not revert to in_progress
      if (existingProgress && existingProgress.status === "completed") {
        return {
          success: true,
          data: existingProgress,
        };
      }

      const updatedProgress = await this.progressRepo.upsertLessonProgress(
        userId,
        path.id,
        module.id,
        lesson.id,
        "in_progress"
      );

      if (!updatedProgress) {
        return { success: false, error: "Failed to update lesson progress to in_progress." };
      }

      return {
        success: true,
        data: updatedProgress,
      };
    } catch (err) {
      logger.error("Failed to start lesson", { userId, lessonSlug, err });
      return { success: false, error: "Failed to start lesson." };
    }
  }

  /**
   * Completes a lesson for the user
   */
  public async completeLesson(
    userId: string,
    pathSlug: string,
    moduleSlug: string,
    lessonSlug: string
  ): Promise<LearningResponse<UserLearningProgress>> {
    try {
      const lessonResult = await this.learningRepo.getLessonBySlugs(
        pathSlug,
        moduleSlug,
        lessonSlug
      );

      if (!lessonResult) {
        return { success: false, error: "Cannot complete non-existent or unpublished lesson." };
      }

      const { path, module, lesson } = lessonResult;

      const updatedProgress = await this.progressRepo.upsertLessonProgress(
        userId,
        path.id,
        module.id,
        lesson.id,
        "completed"
      );

      if (!updatedProgress) {
        return { success: false, error: "Failed to mark lesson as completed." };
      }

      return {
        success: true,
        data: updatedProgress,
      };
    } catch (err) {
      logger.error("Failed to complete lesson", { userId, lessonSlug, err });
      return { success: false, error: "Failed to complete lesson." };
    }
  }
}
