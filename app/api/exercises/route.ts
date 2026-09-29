import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExerciseService } from "@/features/exercises/services/exercise-service";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new ExerciseService(supabase);
    const result = await service.getExercises({ lessonId, categoryId }, user?.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/exercises failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
