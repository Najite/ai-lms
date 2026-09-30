import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CapstoneDeliverable } from "../models";
import { logger } from "@/lib/logger";

type DeliverableRow = Database["public"]["Tables"]["capstone_deliverables"]["Row"];

export class CapstoneDeliverableRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves all deliverables for a capstone
   */
  public async getDeliverables(capstoneId: string): Promise<CapstoneDeliverable[]> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_deliverables")
        .select("*")
        .eq("capstone_id", capstoneId)
        .order("created_at", { ascending: true });

      if (error) {
        logger.error("Failed to fetch capstone deliverables", error);
        return [];
      }

      return (data || []).map((row) => this.mapDeliverable(row));
    } catch (err) {
      logger.error("Unexpected error in getDeliverables", err);
      return [];
    }
  }

  /**
   * Creates a deliverable requirement for a capstone
   */
  public async createDeliverable(
    capstoneId: string,
    title: string,
    description: string,
    required = true,
    deliverableType = "repository"
  ): Promise<CapstoneDeliverable | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_deliverables")
        .insert({
          capstone_id: capstoneId,
          title,
          description,
          required,
          deliverable_type: deliverableType,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create capstone deliverable", error);
        return null;
      }

      return this.mapDeliverable(data);
    } catch (err) {
      logger.error("Unexpected error in createDeliverable", err);
      return null;
    }
  }

  private mapDeliverable(row: DeliverableRow): CapstoneDeliverable {
    return {
      id: row.id,
      capstoneId: row.capstone_id,
      title: row.title,
      description: row.description,
      required: row.required,
      deliverableType: row.deliverable_type,
      createdAt: row.created_at,
    };
  }
}
