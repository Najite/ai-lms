import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CapstoneDependency } from "../models";
import { logger } from "@/lib/logger";

type DependencyRow = Database["public"]["Tables"]["capstone_dependencies"]["Row"] & {
  capstones_capstone_dependencies_parent_capstone_idTocapstones?: Database["public"]["Tables"]["capstones"]["Row"] | null;
};

export class CapstoneDependencyRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves all parent dependencies for a capstone
   */
  public async getDependencies(capstoneId: string): Promise<CapstoneDependency[]> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_dependencies")
        .select(`
          *,
          capstones_capstone_dependencies_parent_capstone_idTocapstones (*)
        `)
        .eq("child_capstone_id", capstoneId);

      if (error) {
        logger.error("Failed to fetch capstone dependencies", error);
        return [];
      }

      return (data || []).map((row) => this.mapDependency(row as unknown as DependencyRow));
    } catch (err) {
      logger.error("Unexpected error in getDependencies", err);
      return [];
    }
  }

  /**
   * Links a parent capstone dependency to a child capstone
   */
  public async addDependency(
    parentCapstoneId: string,
    childCapstoneId: string
  ): Promise<CapstoneDependency | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_dependencies")
        .insert({
          parent_capstone_id: parentCapstoneId,
          child_capstone_id: childCapstoneId,
        })
        .select(`
          *,
          capstones_capstone_dependencies_parent_capstone_idTocapstones (*)
        `)
        .single();

      if (error || !data) {
        logger.error("Failed to add capstone dependency", error);
        return null;
      }

      return this.mapDependency(data as unknown as DependencyRow);
    } catch (err) {
      logger.error("Unexpected error in addDependency", err);
      return null;
    }
  }

  private mapDependency(row: DependencyRow): CapstoneDependency {
    const parent = row.capstones_capstone_dependencies_parent_capstone_idTocapstones;
    return {
      id: row.id,
      parentCapstoneId: row.parent_capstone_id,
      childCapstoneId: row.child_capstone_id,
      parentCapstone: parent
        ? {
            id: parent.id,
            title: parent.title,
            slug: parent.slug,
            status: parent.status,
          }
        : undefined,
    };
  }
}
