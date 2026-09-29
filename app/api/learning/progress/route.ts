import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProgressRepository } from "@/features/learning/repositories/progress-repository";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pathId = searchParams.get("pathId");
    const moduleId = searchParams.get("moduleId");
    const lessonId = searchParams.get("lessonId");

    const progressRepo = new ProgressRepository(supabase);

    if (lessonId) {
      const progress = await progressRepo.getUserLessonProgress(user.id, lessonId);
      return NextResponse.json({ data: progress }, { status: 200 });
    }

    if (moduleId) {
      const progress = await progressRepo.getUserProgressForModule(user.id, moduleId);
      return NextResponse.json({ data: progress }, { status: 200 });
    }

    if (pathId) {
      const progress = await progressRepo.getUserProgressForPath(user.id, pathId);
      return NextResponse.json({ data: progress }, { status: 200 });
    }

    const progress = await progressRepo.getAllUserProgress(user.id);
    return NextResponse.json({ data: progress }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/learning/progress failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
