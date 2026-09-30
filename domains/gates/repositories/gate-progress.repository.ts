import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { UserGateProgress, GateStatus } from "../models";
import { logger } from "@/lib/logger";

type UserGateProgressRow = Database["public"]["Tables"]["user_gate_progress"]["Row"];

export class GateProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves all gate progress entries for a given user
   */
  public async getUserProgressList(userId: string): Promise<UserGateProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_gate_progress")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to fetch user gate progress list", error);
        return [];
      }

      return (data || []).map((row) => this.mapProgress(row));
    } catch (err) {
      logger.error("Unexpected error in getUserProgressList", err);
      return [];
    }
  }

  /**
   * Retrieves user progress for a specific gate
   */
  public async getProgress(
    userId: string,
    gateId: string
  ): Promise<UserGateProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_gate_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("gate_id", gateId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapProgress(data);
    } catch (err) {
      logger.error("Unexpected error in getProgress", err);
      return null;
    }
  }

  /**
   * Upserts progress percentage and status for a user and gate
   */
  public async upsertProgress(
    userId: string,
    gateId: string,
    progressPercentage: number,
    status: GateStatus
  ): Promise<UserGateProgress | null> {
    try {
      const clampedPercentage = Math.max(0, Math.min(100, Math.round(progressPercentage)));

      const { data, error } = await this.supabase
        .from("user_gate_progress")
        .upsert(
          {
            user_id: userId,
            gate_id: gateId,
            progress_percentage: clampedPercentage,
            status,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,gate_id",
          }
        )
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to upsert user gate progress", error);
        return null;
      }

      return this.mapProgress(data);
    } catch (err) {
      logger.error("Unexpected error in upsertProgress", err);
      return null;
    }
  }

  private mapProgress(row: UserGateProgressRow): UserGateProgress {
    return {
      id: row.id,
      userId: row.user_id,
      gateId: row.gate_id,
      progressPercentage: row.progress_percentage,
      status: row.status as GateStatus,
      updatedAt: row.updated_at,
    };
  }
}
