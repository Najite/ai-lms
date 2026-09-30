import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { GateValidation } from "../models";
import { logger } from "@/lib/logger";

type GateValidationRow = Database["public"]["Tables"]["gate_validation"]["Row"];

export class GateValidationRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Persists a gate validation outcome
   */
  public async createValidation(
    userId: string,
    gateId: string,
    validationResult: GateValidation["validationResult"],
    attemptId?: string | null
  ): Promise<GateValidation | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_validation")
        .insert({
          user_id: userId,
          gate_id: gateId,
          attempt_id: attemptId || null,
          validation_result: validationResult as unknown as Database["public"]["Tables"]["gate_validation"]["Insert"]["validation_result"],
          validated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create gate validation", error);
        return null;
      }

      return this.mapValidation(data);
    } catch (err) {
      logger.error("Unexpected error in createValidation", err);
      return null;
    }
  }

  /**
   * Retrieves the latest validation record for a user and gate
   */
  public async getLatestValidation(
    userId: string,
    gateId: string
  ): Promise<GateValidation | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_validation")
        .select("*")
        .eq("user_id", userId)
        .eq("gate_id", gateId)
        .order("validated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapValidation(data);
    } catch (err) {
      logger.error("Unexpected error in getLatestValidation", err);
      return null;
    }
  }

  private mapValidation(row: GateValidationRow): GateValidation {
    return {
      id: row.id,
      userId: row.user_id,
      gateId: row.gate_id,
      attemptId: row.attempt_id,
      validationResult: (row.validation_result as GateValidation["validationResult"]) || {
        passed: false,
      },
      validatedAt: row.validated_at,
    };
  }
}
