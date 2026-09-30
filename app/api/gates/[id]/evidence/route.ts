import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GateEvidenceService } from "@/domains/gates/services/gate-evidence.service";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";
import { collectGateEvidenceSchema } from "@/domains/gates/validators";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = collectGateEvidenceSchema.safeParse({
      userId: user.id,
      gateId: id,
      ...json,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const queryService = new GateQueryService(supabase);
    const gateRes = await queryService.getGateById(id);
    if (!gateRes.success || !gateRes.data) {
      return NextResponse.json({ error: "Gate not found." }, { status: 404 });
    }

    const evidenceService = new GateEvidenceService(supabase);
    const result = await evidenceService.collectEvidence(
      user.id,
      gateRes.data.id,
      parsed.data.evidenceType,
      parsed.data.evidenceReference,
      parsed.data.attemptId,
      parsed.data.metadata
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while collecting gate evidence." },
      { status: 500 }
    );
  }
}
