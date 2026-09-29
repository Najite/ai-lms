import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExerciseEvidenceService } from "@/domains/exercise/services/exercise-evidence.service";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get("exerciseId") || undefined;

    const service = new ExerciseEvidenceService(supabase);
    const result = await service.retrieveEvidence(user.id, exerciseId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/users/me/exercise-evidence failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
