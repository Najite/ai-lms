import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CapstoneSubmissionService } from "@/domains/capstone/services/capstone-submission.service";
import { SubmitCapstoneSchema } from "@/domains/capstone/validators";
import type { PolicyUser } from "@/domains/capstone/policies/capstone-policy";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
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

    const body = await req.json();
    const validation = SubmitCapstoneSchema.safeParse({
      capstoneId: id,
      userId: user.id,
      ...body,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const policyUser: PolicyUser = {
      id: user.id,
      role: (user.user_metadata?.role as "learner" | "instructor" | "admin") || "learner",
    };

    const submissionService = new CapstoneSubmissionService(supabase);
    const result = await submissionService.createSubmission(
      policyUser,
      id,
      validation.data.deliverables,
      validation.data.repositoryUrl,
      validation.data.liveUrl,
      validation.data.documentationUrl,
      validation.data.notes
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
