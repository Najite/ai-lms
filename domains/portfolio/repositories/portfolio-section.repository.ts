import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioSection, PortfolioSectionType } from "../models";
import { logger } from "@/lib/logger";

type SectionRow = Database["public"]["Tables"]["portfolio_sections"]["Row"];

export class PortfolioSectionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves all sections for a portfolio ordered by display_order
   */
  public async getSections(portfolioId: string): Promise<PortfolioSection[]> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_sections")
        .select("*")
        .eq("portfolio_id", portfolioId)
        .order("display_order", { ascending: true });

      if (error) {
        logger.error("Failed to fetch portfolio sections", error);
        return [];
      }

      return (data || []).map((row) => this.mapSection(row));
    } catch (err) {
      logger.error("Unexpected error in getSections", err);
      return [];
    }
  }

  /**
   * Upserts default sections for a portfolio
   */
  public async ensureDefaultSections(portfolioId: string): Promise<PortfolioSection[]> {
    const defaultSections: { sectionType: PortfolioSectionType; title: string; order: number }[] = [
      { sectionType: "projects", title: "Featured Production Projects", order: 1 },
      { sectionType: "professional_evidence", title: "Verified Competency & Gate Proof", order: 2 },
      { sectionType: "competencies", title: "Mastered Capabilities & Skills", order: 3 },
      { sectionType: "achievements", title: "Milestone Badges & Honors", order: 4 },
      { sectionType: "artifacts", title: "Engineering Documentation & Schemas", order: 5 },
      { sectionType: "generated_work", title: "AI-Augmented Code Deliverables", order: 6 },
    ];

    try {
      for (const sec of defaultSections) {
        await this.supabase.from("portfolio_sections").upsert(
          {
            portfolio_id: portfolioId,
            section_type: sec.sectionType,
            title: sec.title,
            display_order: sec.order,
          },
          { onConflict: "portfolio_id, section_type" }
        );
      }

      return await this.getSections(portfolioId);
    } catch (err) {
      logger.error("Unexpected error in ensureDefaultSections", err);
      return [];
    }
  }

  private mapSection(row: SectionRow): PortfolioSection {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      sectionType: row.section_type as PortfolioSectionType,
      title: row.title,
      displayOrder: row.display_order,
    };
  }
}
