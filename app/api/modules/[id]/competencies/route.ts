import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { moduleCompetenciesQuerySchema } from "@/features/competencies/schemas";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id: moduleId } = await params;
    const validation = moduleCompetenciesQuerySchema.safeParse({ moduleId });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid module ID format.", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new CompetencyService(supabase);
    const result = await service.getCompetenciesByModuleId(validation.data.moduleId, user?.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/modules/[id]/competencies failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
