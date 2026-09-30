import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { GateAttempt, GateAttemptStatus } from "../models";
import { logger } from "@/lib/logger";

type GateAttemptRow = Database["public"]["Tables"]["gate_attempts"]["Row"];

export class GateAttemptRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves active attempt for a user on a gate (in_progress or submitted)
   */
  public async getActiveAttempt(
    userId: string,
    gateId: string
  ): Promise<GateAttempt | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("gate_id", gateId)
        .in("status", ["in_progress", "submitted"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapAttempt(data);
    } catch (err) {
      logger.error("Unexpected error in getActiveAttempt", err);
      return null;
    }
  }

  /**
   * Creates a new attempt for a user on a gate
   */
  public async createAttempt(
    userId: string,
    gateId: string
  ): Promise<GateAttempt | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_attempts")
        .insert({
          user_id: userId,
          gate_id: gateId,
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create gate attempt", error);
        return null;
      }

      return this.mapAttempt(data);
    } catch (err) {
      logger.error("Unexpected error in createAttempt", err);
      return null;
    }
  }

  /**
   * Updates an existing attempt status and completion time
   */
  public async updateAttemptStatus(
    attemptId: string,
    status: GateAttemptStatus,
    completedAt?: string | null
  ): Promise<GateAttempt | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_attempts")
        .update({
          status,
          completed_at: completedAt !== undefined ? completedAt : status === "passed" || status === "failed" ? new Date().toISOString() : null,
        })
        .eq("id", attemptId)
        .select("*")
        .single();

      if (error || !data) {
        logger.error(`Failed to update gate attempt ${attemptId}`, error);
        return null;
      }

      return this.mapAttempt(data);
    } catch (err) {
      logger.error("Unexpected error in updateAttemptStatus", err);
      return null;
    }
  }

  /**
   * Retrieves all attempts by user for a given gate
   */
  public async getUserGateAttempts(
    userId: string,
    gateId: string
  ): Promise<GateAttempt[]> {
    try {
      const { data, error } = await this.supabase
        .from("gate_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("gate_id", gateId)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch user gate attempts", error);
        return [];
      }

      return (data || []).map((row) => this.mapAttempt(row));
    } catch (err) {
      logger.error("Unexpected error in getUserGateAttempts", err);
      return [];
    }
  }

  private mapAttempt(row: GateAttemptRow): GateAttempt {
    return {
      id: row.id,
      userId: row.user_id,
      gateId: row.gate_id,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      status: row.status as GateAttemptStatus,
      createdAt: row.created_at,
    };
  }
}
