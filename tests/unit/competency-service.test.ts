import { describe, it, expect, vi, beforeEach } from "vitest";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { useCompetencyStore } from "@/features/competencies/stores/use-competency-store";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { UserCompetencyProgress } from "@/features/competencies/types";

describe("CompetencyService and Store", () => {
  let mockSupabase: unknown;
  let service: CompetencyService;

  const mockCategoryRow = {
    id: "cat-1",
    slug: "context-engineering",
    name: "Context Engineering",
    description: "Token optimization and context curation",
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockCompetencyRow = {
    id: "comp-1",
    category_id: "cat-1",
    slug: "context-window-optimization",
    code: "CTX-01",
    title: "Context Window Optimization",
    description: "Structuring project context and constitutions",
    statement: "Can structure project constitution files for maximal reasoning accuracy.",
    level: "foundational" as const,
    order_index: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    competency_categories: mockCategoryRow,
  };

  const mockProgressRow = {
    id: "prog-1",
    user_id: "usr-1",
    competency_id: "comp-1",
    state: "introduced" as const,
    score: 25,
    evidence_count: 1,
    first_demonstrated_at: new Date().toISOString(),
    last_evaluated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const createQueryMock = (data: unknown) => {
    const resolvedValue = {
      data: Array.isArray(data) ? data : data !== null ? [data] : [],
      error: null,
    };

    const builder: Record<string, unknown> = {
      then: (resolve: (val: unknown) => unknown) => Promise.resolve(resolvedValue).then(resolve),
    };

    builder.select = vi.fn().mockReturnValue(builder);
    builder.eq = vi.fn().mockReturnValue(builder);
    builder.order = vi.fn().mockReturnValue(builder);
    builder.single = vi.fn().mockResolvedValue({
      data: Array.isArray(data) ? data[0] : data,
      error: null,
    });
    builder.upsert = vi.fn().mockReturnValue(builder);

    return builder;
  };

  beforeEach(() => {
    useCompetencyStore.getState().reset();

    mockSupabase = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "competency_categories") {
          return createQueryMock(mockCategoryRow);
        }
        if (table === "competencies") {
          return createQueryMock(mockCompetencyRow);
        }
        if (table === "user_competency_progress") {
          return createQueryMock(mockProgressRow);
        }
        if (table === "competency_evidence") {
          return createQueryMock({
            id: "ev-1",
            user_id: "usr-1",
            competency_id: "comp-1",
            source_type: "lesson_completion",
            source_id: "les-1",
            source_title: "Lesson Title",
            summary: "Demonstrated competency via lesson completion",
            created_at: new Date().toISOString(),
          });
        }
        if (table === "module_competencies" || table === "lesson_competencies") {
          return createQueryMock([]);
        }
        return createQueryMock(null);
      }),
    };

    service = new CompetencyService(mockSupabase as unknown as SupabaseClient<Database>);
  });

  it("retrieves published competencies with category and progress", async () => {
    const res = await service.getCompetencies("usr-1");
    expect(res.success).toBe(true);
    expect(res.data?.length).toBe(1);
    expect(res.data?.[0]?.code).toBe("CTX-01");
    expect(res.data?.[0]?.progress?.score).toBe(25);
  });

  it("retrieves competency categories", async () => {
    const res = await service.getCategories();
    expect(res.success).toBe(true);
    expect(res.data?.[0]?.slug).toBe("context-engineering");
  });

  it("retrieves competency detail by slug", async () => {
    const res = await service.getCompetencyDetail({ slug: "context-window-optimization" }, "usr-1");
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe("Context Window Optimization");
    expect(res.data?.category.name).toBe("Context Engineering");
  });

  it("updates competency progress and derives state transition", async () => {
    const res = await service.updateCompetencyProgress("usr-1", {
      competencyId: "comp-1",
      sourceType: "lesson_completion",
      sourceId: "les-1",
      sourceTitle: "Context Architecture",
      summary: "Completed comprehensive context engineering module",
      contributionPoints: 40,
      targetState: "practicing",
    });

    expect(res.success).toBe(true);
    expect(res.data?.competencyId).toBe("comp-1");
  });

  describe("useCompetencyStore state transitions", () => {
    it("updates progress in store and sets user progress map", () => {
      const mockProgress: UserCompetencyProgress = {
        id: "p-1",
        userId: "usr-1",
        competencyId: "comp-1",
        state: "reinforced",
        score: 75,
        evidenceCount: 3,
        firstDemonstratedAt: new Date().toISOString(),
        lastEvaluatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useCompetencyStore.getState().updateProgress(mockProgress);
      const state = useCompetencyStore.getState();
      expect(state.userProgressMap["comp-1"]).toEqual(mockProgress);
    });

    it("resets competency store to initial state", () => {
      useCompetencyStore.getState().setLoading(true);
      expect(useCompetencyStore.getState().isLoading).toBe(true);

      useCompetencyStore.getState().reset();
      expect(useCompetencyStore.getState().isLoading).toBe(false);
      expect(useCompetencyStore.getState().competencies).toEqual([]);
    });
  });
});
