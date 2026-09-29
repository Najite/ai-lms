import { describe, it, expect, vi, beforeEach } from "vitest";
import { LearningService } from "@/features/learning/services/learning-service";
import { useLearningStore } from "@/features/learning/stores/use-learning-store";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { UserLearningProgress } from "@/features/learning/types";

describe("LearningService and Store", () => {
  let mockSupabase: unknown;
  let service: LearningService;

  const mockPathRow = {
    id: "path-1",
    slug: "ai-native-core",
    title: "AI-Native Core",
    description: "Core concepts",
    difficulty: "beginner" as const,
    estimated_hours: 20,
    order_index: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockModuleRow = {
    id: "mod-1",
    learning_path_id: "path-1",
    slug: "mod-one",
    title: "Module One",
    description: "First module",
    order_index: 1,
    estimated_minutes: 60,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockLessonRow = {
    id: "les-1",
    module_id: "mod-1",
    slug: "les-one",
    title: "Lesson One",
    summary: "Intro lesson",
    content: "# Lesson Content",
    order_index: 1,
    estimated_minutes: 15,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const createQueryMock = (data: unknown) => {
    const builder: Record<string, unknown> = {};
    builder.select = vi.fn().mockReturnValue(builder);
    builder.eq = vi.fn().mockReturnValue(builder);
    builder.order = vi.fn().mockResolvedValue({ data: Array.isArray(data) ? data : [data], error: null });
    builder.single = vi.fn().mockResolvedValue({
      data: Array.isArray(data) ? data[0] : data,
      error: null,
    });
    builder.upsert = vi.fn().mockReturnValue(builder);
    return builder;
  };

  beforeEach(() => {
    useLearningStore.getState().reset();

    mockSupabase = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "learning_paths") {
          return createQueryMock(mockPathRow);
        }
        if (table === "modules") {
          return createQueryMock(mockModuleRow);
        }
        if (table === "lessons") {
          return createQueryMock(mockLessonRow);
        }
        if (table === "user_learning_progress") {
          const progressMock = {
            id: "prog-1",
            user_id: "user-1",
            learning_path_id: "path-1",
            module_id: "mod-1",
            lesson_id: "les-1",
            status: "in_progress",
            started_at: new Date().toISOString(),
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return createQueryMock(progressMock);
        }
        return createQueryMock(null);
      }),
    };

    service = new LearningService(mockSupabase as unknown as SupabaseClient<Database>);
  });

  it("retrieves learning paths successfully", async () => {
    const res = await service.getLearningPaths();
    expect(res.success).toBe(true);
    expect(res.data?.length).toBe(1);
    expect(res.data?.[0]?.slug).toBe("ai-native-core");
  });

  it("retrieves learning path detail with modules and lessons", async () => {
    const res = await service.getLearningPathDetail("ai-native-core");
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe("AI-Native Core");
    expect(res.data?.modules.length).toBe(1);
  });

  it("retrieves module detail with lessons and metrics", async () => {
    const res = await service.getModuleDetail("ai-native-core", "mod-one");
    expect(res.success).toBe(true);
    expect(res.data?.module.title).toBe("Module One");
  });

  it("starts a lesson and returns in_progress state", async () => {
    const res = await service.startLesson("user-1", "ai-native-core", "mod-one", "les-one");
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe("in_progress");
  });

  describe("useLearningStore state transitions", () => {
    it("updates lesson progress and sets progress map", () => {
      const mockProgress: UserLearningProgress = {
        id: "p-1",
        userId: "u-1",
        learningPathId: "path-1",
        moduleId: "mod-1",
        lessonId: "les-1",
        status: "completed",
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useLearningStore.getState().updateLessonProgress(mockProgress);
      const state = useLearningStore.getState();
      expect(state.progressMap["les-1"]).toEqual(mockProgress);
    });

    it("resets learning store to initial state", () => {
      useLearningStore.getState().setLoading(true);
      expect(useLearningStore.getState().isLoading).toBe(true);

      useLearningStore.getState().reset();
      expect(useLearningStore.getState().isLoading).toBe(false);
      expect(useLearningStore.getState().paths).toEqual([]);
    });
  });
});
