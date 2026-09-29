import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { startLessonSchema } from "@/features/learning/schemas";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = startLessonSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid payload.", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const learningService = new LearningService(supabase);
    const result = await learningService.startLesson(
      user.id,
      validation.data.pathSlug,
      validation.data.moduleSlug,
      validation.data.lessonSlug
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API POST /api/learning/lessons/start failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
