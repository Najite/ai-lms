import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { Capstone, CapstoneDifficulty } from "../models";
import { logger } from "@/lib/logger";

type CapstoneRow = Database["public"]["Tables"]["capstones"]["Row"] & {
  capstone_types?: Database["public"]["Tables"]["capstone_types"]["Row"] | null;
  capstone_deliverables?: Database["public"]["Tables"]["capstone_deliverables"]["Row"][];
  capstone_competencies?: (Database["public"]["Tables"]["capstone_competencies"]["Row"] & {
    competencies?: Database["public"]["Tables"]["competencies"]["Row"] | null;
  })[];
  capstone_dependencies_capstone_dependencies_child_capstone_idTocapstones?: (Database["public"]["Tables"]["capstone_dependencies"]["Row"] & {
    capstones_capstone_dependencies_parent_capstone_idTocapstones?: Database["public"]["Tables"]["capstones"]["Row"] | null;
  })[];
};

export class CapstoneRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves capstones with optional filters
   */
  public async getCapstones(filters?: {
    typeSlug?: string;
    status?: string;
    difficulty?: CapstoneDifficulty;
  }): Promise<Capstone[]> {
    try {
      let query = this.supabase.from("capstones").select(`
        *,
        capstone_types (*),
        capstone_deliverables (*),
        capstone_competencies (
          *,
          competencies (*)
        ),
        capstone_dependencies_capstone_dependencies_child_capstone_idTocapstones (
          *,
          capstones_capstone_dependencies_parent_capstone_idTocapstones (*)
        )
      `);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.difficulty) {
        query = query.eq("difficulty", filters.difficulty);
      }

      const { data, error } = await query.order("created_at", { ascending: true });

      if (error) {
        logger.error("Failed to fetch capstones", error);
        return [];
      }

      let results = (data || []).map((row) => this.mapCapstone(row as unknown as CapstoneRow));

      if (filters?.typeSlug) {
        results = results.filter((c) => c.capstoneType?.slug === filters.typeSlug);
      }

      return results;
    } catch (err) {
      logger.error("Unexpected error in getCapstones", err);
      return [];
    }
  }

  /**
   * Retrieves a single capstone by ID
   */
  public async getCapstoneById(id: string): Promise<Capstone | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstones")
        .select(`
          *,
          capstone_types (*),
          capstone_deliverables (*),
          capstone_competencies (
            *,
            competencies (*)
          ),
          capstone_dependencies_capstone_dependencies_child_capstone_idTocapstones (
            *,
            capstones_capstone_dependencies_parent_capstone_idTocapstones (*)
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        if (error) logger.error("Failed to fetch capstone by ID", error);
        return null;
      }

      return this.mapCapstone(data as unknown as CapstoneRow);
    } catch (err) {
      logger.error("Unexpected error in getCapstoneById", err);
      return null;
    }
  }

  /**
   * Retrieves a single capstone by slug
   */
  public async getCapstoneBySlug(slug: string): Promise<Capstone | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstones")
        .select(`
          *,
          capstone_types (*),
          capstone_deliverables (*),
          capstone_competencies (
            *,
            competencies (*)
          ),
          capstone_dependencies_capstone_dependencies_child_capstone_idTocapstones (
            *,
            capstones_capstone_dependencies_parent_capstone_idTocapstones (*)
          )
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        if (error) logger.error("Failed to fetch capstone by slug", error);
        return null;
      }

      return this.mapCapstone(data as unknown as CapstoneRow);
    } catch (err) {
      logger.error("Unexpected error in getCapstoneBySlug", err);
      return null;
    }
  }

  /**
   * Creates a new capstone record
   */
  public async createCapstone(
    typeId: string,
    title: string,
    slug: string,
    description: string,
    difficulty: CapstoneDifficulty = "intermediate",
    status: "draft" | "active" | "archived" = "active",
    estimatedHours = 20
  ): Promise<Capstone | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstones")
        .insert({
          type_id: typeId,
          title,
          slug,
          description,
          difficulty,
          status,
          estimated_hours: estimatedHours,
        })
        .select(`
          *,
          capstone_types (*)
        `)
        .single();

      if (error || !data) {
        logger.error("Failed to create capstone", error);
        return null;
      }

      logger.info("capstone.created", { capstoneId: data.id, slug });
      return this.mapCapstone(data as unknown as CapstoneRow);
    } catch (err) {
      logger.error("Unexpected error in createCapstone", err);
      return null;
    }
  }

  private mapCapstone(row: CapstoneRow): Capstone {
    const dependencies = (
      row.capstone_dependencies_capstone_dependencies_child_capstone_idTocapstones || []
    ).map((dep) => ({
      id: dep.id,
      parentCapstoneId: dep.parent_capstone_id,
      childCapstoneId: dep.child_capstone_id,
      parentCapstone: dep.capstones_capstone_dependencies_parent_capstone_idTocapstones
        ? {
            id: dep.capstones_capstone_dependencies_parent_capstone_idTocapstones.id,
            title: dep.capstones_capstone_dependencies_parent_capstone_idTocapstones.title,
            slug: dep.capstones_capstone_dependencies_parent_capstone_idTocapstones.slug,
            status: dep.capstones_capstone_dependencies_parent_capstone_idTocapstones.status,
          }
        : undefined,
    }));

    return {
      id: row.id,
      typeId: row.type_id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      difficulty: row.difficulty as CapstoneDifficulty,
      status: row.status as "draft" | "active" | "archived",
      estimatedHours: row.estimated_hours,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      capstoneType: row.capstone_types
        ? {
            id: row.capstone_types.id,
            name: row.capstone_types.name,
            slug: row.capstone_types.slug,
            description: row.capstone_types.description,
            createdAt: row.capstone_types.created_at,
          }
        : undefined,
      deliverables: (row.capstone_deliverables || []).map((d) => ({
        id: d.id,
        capstoneId: d.capstone_id,
        title: d.title,
        description: d.description,
        required: d.required,
        deliverableType: d.deliverable_type,
        createdAt: d.created_at,
      })),
      competencies: (row.capstone_competencies || []).map((cc) => ({
        id: cc.id,
        capstoneId: cc.capstone_id,
        competencyId: cc.competency_id,
        competency: cc.competencies
          ? {
              id: cc.competencies.id,
              code: cc.competencies.code,
              title: cc.competencies.title,
              level: cc.competencies.level,
              slug: cc.competencies.slug,
            }
          : undefined,
      })),
      dependencies,
    };
  }
}
