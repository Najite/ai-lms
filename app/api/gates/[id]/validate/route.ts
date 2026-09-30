import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GateValidationService } from "@/domains/gates/services/gate-validation.service";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";
import { validateGateSchema } from "@/domains/gates/validators";

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
    const parsed = validateGateSchema.safeParse({
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

    const validationService = new GateValidationService(supabase);
    const result = await validationService.validateGate(
      user.id,
      gateRes.data.id,
      parsed.data.passed,
      parsed.data.score,
      parsed.data.feedback,
      parsed.data.criteriaResults,
      parsed.data.attemptId
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while validating gate." },
      { status: 500 }
    );
  }
}
