import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const service = new GateQueryService(supabase);
    const result = await service.getGateById(id);

    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error || "Gate not found." }, { status: 404 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching competency gate." },
      { status: 500 }
    );
  }
}
