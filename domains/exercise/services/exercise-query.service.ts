import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { ExerciseRepository } from "../repositories/exercise.repository";
import { ExerciseAttemptRepository } from "../repositories/exercise-attempt.repository";
import type {
  ExerciseCategory,
  ExerciseWithDetails,
  ExerciseResponse,
} from "../models";
import type { ExerciseQueryFiltersDTO } from "../dto";
import { logger } from "@/lib/logger";

export class ExerciseQueryService {
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
   * Retrieves an exercise by its unique UUID or slug, with user progress context
   */
  public async getById(
    idOrSlug: string,
    userId?: string
  ): Promise<ExerciseResponse<ExerciseWithDetails>> {
    try {
      const exercise = await this.exerciseRepo.getById(idOrSlug);
      if (!exercise) {
        return { success: false, error: `Exercise not found for '${idOrSlug}'.` };
      }

      if (!userId) {
        return { success: true, data: exercise };
      }

      const [completion, activeAttempt] = await Promise.all([
        this.attemptRepo.getCompletion(userId, exercise.id),
        this.attemptRepo.getLatestAttempt(userId, exercise.id),
      ]);

      return {
        success: true,
        data: {
          ...exercise,
          userCompletion: completion,
          activeAttempt: activeAttempt?.state !== "completed" ? activeAttempt : null,
        },
      };
    } catch (err) {
      logger.error(`Failed to retrieve exercise by ID '${idOrSlug}'`, err);
      return { success: false, error: "Unable to retrieve exercise." };
    }
  }

  /**
   * Retrieves all exercises associated with a lesson
   */
  public async getByLesson(
    lessonId: string,
    userId?: string
  ): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
    try {
      const exercises = await this.exerciseRepo.getByLesson(lessonId);

      if (!userId) {
        return { success: true, data: exercises };
      }

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
      logger.error(`Failed to retrieve exercises for lesson '${lessonId}'`, err);
      return { success: false, error: "Unable to retrieve lesson exercises." };
    }
  }

  /**
   * Retrieves all exercises associated with a competency
   */
  public async getByCompetency(
    competencyId: string,
    userId?: string
  ): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
    try {
      const exercises = await this.exerciseRepo.getByCompetency(competencyId);

      if (!userId) {
        return { success: true, data: exercises };
      }

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
      logger.error(`Failed to retrieve exercises for competency '${competencyId}'`, err);
      return { success: false, error: "Unable to retrieve competency exercises." };
    }
  }

  /**
   * Retrieves exercises matching query filters
   */
  public async getAll(
    filters?: ExerciseQueryFiltersDTO,
    userId?: string
  ): Promise<ExerciseResponse<ExerciseWithDetails[]>> {
    try {
      const exercises = await this.exerciseRepo.getExercises(filters);

      if (!userId) {
        return { success: true, data: exercises };
      }

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
      logger.error("Failed to retrieve exercises with filters", err);
      return { success: false, error: "Unable to retrieve exercises." };
    }
  }
}
