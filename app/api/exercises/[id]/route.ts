import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExerciseService } from "@/features/exercises/services/exercise-service";
import { logger } from "@/lib/logger";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new ExerciseService(supabase);
    const result = await service.getExerciseDetail(id, user?.id);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/exercises/:id failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
