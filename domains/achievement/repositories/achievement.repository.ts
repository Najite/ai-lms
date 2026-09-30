import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  Achievement,
  AchievementCategory,
  AchievementRequirement,
} from "../models";
import type { AchievementQueryFiltersDTO } from "../dto";
import { logger } from "@/lib/logger";

type AchievementRowWithRelations = Database["public"]["Tables"]["achievements"]["Row"] & {
  achievement_categories: Database["public"]["Tables"]["achievement_categories"]["Row"];
  achievement_requirements: Database["public"]["Tables"]["achievement_requirements"]["Row"][];
};

export class AchievementRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all achievement categories
   */
  public async getCategories(): Promise<AchievementCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from("achievement_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        logger.error("Failed to fetch achievement categories", error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        createdAt: row.created_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getCategories", err);
      return [];
    }
  }

  /**
   * Fetches achievements with optional filters
   */
  public async getAchievements(
    filters?: AchievementQueryFiltersDTO
  ): Promise<Achievement[]> {
    try {
      let query = this.supabase
        .from("achievements")
        .select(`
          *,
          achievement_categories (*),
          achievement_requirements (*)
        `)
        .order("xp_reward", { ascending: true });

      if (filters?.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
      } else {
        query = query.eq("is_active", true);
      }

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.slug) {
        query = query.eq("slug", filters.slug);
      }

      const { data, error } = await query;

      if (error || !data) {
        logger.error("Failed to fetch achievements", error);
        return [];
      }

      return (data as unknown as AchievementRowWithRelations[]).map((row) =>
        this.mapAchievementWithDetails(row)
      );
    } catch (err) {
      logger.error("Unexpected error in getAchievements", err);
      return [];
    }
  }

  /**
   * Fetches an achievement by unique UUID or slug
   */
  public async getAchievementByIdOrSlug(
    idOrSlug: string
  ): Promise<Achievement | null> {
    try {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          idOrSlug
        );

      let query = this.supabase
        .from("achievements")
        .select(`
          *,
          achievement_categories (*),
          achievement_requirements (*)
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

      return this.mapAchievementWithDetails(data as unknown as AchievementRowWithRelations);
    } catch (err) {
      logger.error(`Unexpected error in getAchievementByIdOrSlug('${idOrSlug}')`, err);
      return null;
    }
  }

  /**
   * Fetches all achievements within a category
   */
  public async getAchievementsByCategory(
    categoryId: string
  ): Promise<Achievement[]> {
    return this.getAchievements({ categoryId });
  }

  private mapAchievementWithDetails(row: AchievementRowWithRelations): Achievement {
    const category = row.achievement_categories;
    const requirements: AchievementRequirement[] = Array.isArray(
      row.achievement_requirements
    )
      ? row.achievement_requirements.map((req) => ({
          id: req.id,
          achievementId: req.achievement_id,
          requirementType: req.requirement_type,
          requirementValue: req.requirement_value,
        }))
      : [];

    return {
      id: row.id,
      categoryId: row.category_id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      icon: row.icon,
      xpReward: row.xp_reward,
      isActive: row.is_active,
      createdAt: row.created_at,
      category: category
        ? {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            createdAt: category.created_at,
          }
        : undefined,
      requirements,
    };
  }
}
