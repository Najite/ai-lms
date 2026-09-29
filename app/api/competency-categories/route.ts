import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const service = new CompetencyService(supabase);
    const result = await service.getCategories();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/competency-categories failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
