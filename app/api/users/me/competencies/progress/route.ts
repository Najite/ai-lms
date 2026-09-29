import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { updateCompetencyProgressSchema } from "@/features/competencies/schemas";
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
    const validation = updateCompetencyProgressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid progress payload.", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const service = new CompetencyService(supabase);
    const result = await service.updateCompetencyProgress(user.id, validation.data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API POST /api/users/me/competencies/progress failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
