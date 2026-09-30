import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  CompetencyGate,
  GateRequirement,
  GateCompetencyMapping,
  GateRequirementType,
} from "../models";
import type { GateQueryFiltersDTO } from "../dto";
import { logger } from "@/lib/logger";

type RequirementRow = Database["public"]["Tables"]["gate_requirements"]["Row"];
type GateCompetencyRow = Database["public"]["Tables"]["gate_competencies"]["Row"] & {
  competencies?: Database["public"]["Tables"]["competencies"]["Row"] | null;
};
type GateRawWithRelations = Database["public"]["Tables"]["competency_gates"]["Row"] & {
  gate_requirements?: RequirementRow[] | null;
  gate_competencies?: GateCompetencyRow[] | null;
};

export class GateRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all active competency gates ordered by gate level
   */
  public async getGates(filters?: GateQueryFiltersDTO): Promise<CompetencyGate[]> {
    try {
      let query = this.supabase
        .from("competency_gates")
        .select(`
          *,
          gate_requirements (*),
          gate_competencies (
            *,
            competencies (*)
          )
        `)
        .order("gate_level", { ascending: true });

      if (filters?.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
      } else {
        query = query.eq("is_active", true);
      }

      if (filters?.gateLevel !== undefined) {
        query = query.eq("gate_level", filters.gateLevel);
      }

      if (filters?.slug) {
        query = query.eq("slug", filters.slug);
      }

      const { data, error } = await query;

      if (error) {
        logger.error("Failed to fetch competency gates from DB", error);
        return [];
      }

      return (data || []).map((row) => this.mapGateWithRelations(row));
    } catch (err) {
      logger.error("Unexpected error in getGates", err);
      return [];
    }
  }

  /**
   * Fetches a single competency gate by UUID or slug with requirements and competencies
   */
  public async getGateByIdOrSlug(idOrSlug: string): Promise<CompetencyGate | null> {
    try {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          idOrSlug
        );

      let query = this.supabase
        .from("competency_gates")
        .select(`
          *,
          gate_requirements (*),
          gate_competencies (
            *,
            competencies (*)
          )
        `);

      if (isUUID) {
        query = query.eq("id", idOrSlug);
      } else {
        query = query.eq("slug", idOrSlug);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        return null;
      }

      return this.mapGateWithRelations(data);
    } catch (err) {
      logger.error(`Unexpected error in getGateByIdOrSlug('${idOrSlug}')`, err);
      return null;
    }
  }

  private mapGateWithRelations(row: GateRawWithRelations): CompetencyGate {
    const requirements: GateRequirement[] = Array.isArray(row.gate_requirements)
      ? row.gate_requirements.map((req: RequirementRow) => ({
          id: req.id,
          gateId: req.gate_id,
          requirementType: req.requirement_type as GateRequirementType,
          requirementValue: (req.requirement_value as Record<string, unknown>) || {},
          createdAt: req.created_at,
        }))
      : [];

    const competencies: GateCompetencyMapping[] = Array.isArray(row.gate_competencies)
      ? row.gate_competencies.map((gc: GateCompetencyRow) => ({
          id: gc.id,
          gateId: gc.gate_id,
          competencyId: gc.competency_id,
          competency: gc.competencies
            ? {
                id: gc.competencies.id,
                code: gc.competencies.code,
                title: gc.competencies.title,
                level: gc.competencies.level,
                slug: gc.competencies.slug,
              }
            : undefined,
        }))
      : [];

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      gateLevel: row.gate_level,
      isActive: row.is_active,
      createdAt: row.created_at,
      requirements,
      competencies,
    };
  }
}
