import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  CompetencyCategory,
  Competency,
  CompetencyState,
} from "../types";
import { logger } from "@/lib/logger";

export class CompetencyRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all competency categories ordered by order_index
   */
  public async getCategories(): Promise<CompetencyCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from("competency_categories")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) {
        logger.error("Failed to fetch competency categories", error);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        orderIndex: row.order_index,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getCategories", err);
      return [];
    }
  }

  /**
   * Fetches all published competencies ordered by category and order_index
   */
  public async getPublishedCompetencies(): Promise<
    (Competency & { category: CompetencyCategory })[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("competencies")
        .select(`
          *,
          competency_categories (*)
        `)
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (error || !data) {
        logger.error("Failed to fetch published competencies", error);
        return [];
      }

      return data.map((row) => {
        const cat = row.competency_categories as unknown as Database["public"]["Tables"]["competency_categories"]["Row"];
        return {
          id: row.id,
          categoryId: row.category_id,
          slug: row.slug,
          code: row.code,
          title: row.title,
          description: row.description,
          statement: row.statement,
          level: row.level,
          orderIndex: row.order_index,
          isPublished: row.is_published,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          category: {
            id: cat.id,
            slug: cat.slug,
            name: cat.name,
            description: cat.description,
            orderIndex: cat.order_index,
            createdAt: cat.created_at,
            updatedAt: cat.updated_at,
          },
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getPublishedCompetencies", err);
      return [];
    }
  }

  /**
   * Fetches a competency by slug with its parent category
   */
  public async getCompetencyBySlug(
    slug: string
  ): Promise<(Competency & { category: CompetencyCategory }) | null> {
    try {
      const { data, error } = await this.supabase
        .from("competencies")
        .select(`
          *,
          competency_categories (*)
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error || !data) return null;

      const cat = data.competency_categories as unknown as Database["public"]["Tables"]["competency_categories"]["Row"];

      return {
        id: data.id,
        categoryId: data.category_id,
        slug: data.slug,
        code: data.code,
        title: data.title,
        description: data.description,
        statement: data.statement,
        level: data.level,
        orderIndex: data.order_index,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: {
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          orderIndex: cat.order_index,
          createdAt: cat.created_at,
          updatedAt: cat.updated_at,
        },
      };
    } catch (err) {
      logger.error("Unexpected error in getCompetencyBySlug", err);
      return null;
    }
  }

  /**
   * Fetches a competency by UUID with its parent category
   */
  public async getCompetencyById(
    id: string
  ): Promise<(Competency & { category: CompetencyCategory }) | null> {
    try {
      const { data, error } = await this.supabase
        .from("competencies")
        .select(`
          *,
          competency_categories (*)
        `)
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (error || !data) return null;

      const cat = data.competency_categories as unknown as Database["public"]["Tables"]["competency_categories"]["Row"];

      return {
        id: data.id,
        categoryId: data.category_id,
        slug: data.slug,
        code: data.code,
        title: data.title,
        description: data.description,
        statement: data.statement,
        level: data.level,
        orderIndex: data.order_index,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: {
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          orderIndex: cat.order_index,
          createdAt: cat.created_at,
          updatedAt: cat.updated_at,
        },
      };
    } catch (err) {
      logger.error("Unexpected error in getCompetencyById", err);
      return null;
    }
  }

  /**
   * Fetches competencies mapped to a specific module
   */
  public async getCompetenciesByModuleId(
    moduleId: string
  ): Promise<{ competency: Competency; weight: number }[]> {
    try {
      const { data, error } = await this.supabase
        .from("module_competencies")
        .select(`
          weight,
          competencies (*)
        `)
        .eq("module_id", moduleId);

      if (error || !data) return [];

      return data.map((row) => {
        const c = row.competencies as unknown as Database["public"]["Tables"]["competencies"]["Row"];
        return {
          weight: row.weight,
          competency: {
            id: c.id,
            categoryId: c.category_id,
            slug: c.slug,
            code: c.code,
            title: c.title,
            description: c.description,
            statement: c.statement,
            level: c.level,
            orderIndex: c.order_index,
            isPublished: c.is_published,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          },
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getCompetenciesByModuleId", err);
      return [];
    }
  }

  /**
   * Fetches competencies mapped to a specific lesson
   */
  public async getCompetenciesByLessonId(
    lessonId: string
  ): Promise<
    {
      competency: Competency;
      targetState: CompetencyState;
      contributionPoints: number;
    }[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("lesson_competencies")
        .select(`
          target_state,
          contribution_points,
          competencies (*)
        `)
        .eq("lesson_id", lessonId);

      if (error || !data) return [];

      return data.map((row) => {
        const c = row.competencies as unknown as Database["public"]["Tables"]["competencies"]["Row"];
        return {
          targetState: row.target_state,
          contributionPoints: row.contribution_points,
          competency: {
            id: c.id,
            categoryId: c.category_id,
            slug: c.slug,
            code: c.code,
            title: c.title,
            description: c.description,
            statement: c.statement,
            level: c.level,
            orderIndex: c.order_index,
            isPublished: c.is_published,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          },
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getCompetenciesByLessonId", err);
      return [];
    }
  }

  /**
   * Retrieves related modules for a given competency
   */
  public async getRelatedModulesForCompetency(
    competencyId: string
  ): Promise<
    {
      id: string;
      slug: string;
      title: string;
      pathSlug: string;
      pathTitle: string;
      weight: number;
    }[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("module_competencies")
        .select(`
          weight,
          modules (
            id,
            slug,
            title,
            learning_paths (
              slug,
              title
            )
          )
        `)
        .eq("competency_id", competencyId);

      if (error || !data) return [];

      return data.map((row) => {
        const m = row.modules as unknown as {
          id: string;
          slug: string;
          title: string;
          learning_paths: { slug: string; title: string };
        };
        return {
          id: m.id,
          slug: m.slug,
          title: m.title,
          pathSlug: m.learning_paths?.slug || "",
          pathTitle: m.learning_paths?.title || "",
          weight: row.weight,
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getRelatedModulesForCompetency", err);
      return [];
    }
  }

  /**
   * Retrieves related lessons contributing to this competency
   */
  public async getRelatedLessonsForCompetency(
    competencyId: string
  ): Promise<
    {
      id: string;
      slug: string;
      title: string;
      moduleSlug: string;
      pathSlug: string;
      targetState: CompetencyState;
      contributionPoints: number;
    }[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("lesson_competencies")
        .select(`
          target_state,
          contribution_points,
          lessons (
            id,
            slug,
            title,
            modules (
              slug,
              learning_paths (
                slug
              )
            )
          )
        `)
        .eq("competency_id", competencyId);

      if (error || !data) return [];

      return data.map((row) => {
        const l = row.lessons as unknown as {
          id: string;
          slug: string;
          title: string;
          modules: {
            slug: string;
            learning_paths: { slug: string };
          };
        };

        return {
          id: l.id,
          slug: l.slug,
          title: l.title,
          moduleSlug: l.modules?.slug || "",
          pathSlug: l.modules?.learning_paths?.slug || "",
          targetState: row.target_state,
          contributionPoints: row.contribution_points,
        };
      });
    } catch (err) {
      logger.error("Unexpected error in getRelatedLessonsForCompetency", err);
      return [];
    }
  }
}
