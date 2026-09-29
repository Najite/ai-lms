import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { ExerciseEvidenceRepository } from "../repositories/exercise-evidence.repository";
import type {
  ExerciseEvidence,
  ExerciseResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class ExerciseEvidenceService {
  private readonly evidenceRepo: ExerciseEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.evidenceRepo = new ExerciseEvidenceRepository(supabase);
  }

  /**
   * Creates a new evidence record for an exercise attempt
   */
  public async createEvidence(
    userId: string,
    exerciseId: string,
    attemptId: string,
    competencyId: string,
    summary: string,
    payload?: Record<string, unknown>
  ): Promise<ExerciseResponse<ExerciseEvidence>> {
    try {
      const evidence = await this.evidenceRepo.createEvidence(
        userId,
        exerciseId,
        attemptId,
        competencyId,
        summary,
        "exercise_validation",
        payload
      );

      if (!evidence) {
        return { success: false, error: "Failed to persist exercise evidence record." };
      }

      return { success: true, data: evidence };
    } catch (err) {
      logger.error("Failed to create exercise evidence", err);
      return { success: false, error: "Unable to create exercise evidence." };
    }
  }

  /**
   * Retrieves exercise evidence records for a user, optionally filtered by exercise
   */
  public async retrieveEvidence(
    userId: string,
    exerciseId?: string
  ): Promise<ExerciseResponse<ExerciseEvidence[]>> {
    try {
      const evidence = await this.evidenceRepo.retrieveEvidence(
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
