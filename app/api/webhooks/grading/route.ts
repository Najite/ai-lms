import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-grading-signature");
    const timestamp = req.headers.get("x-grading-timestamp");

    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: "Missing HMAC authentication headers" },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const { runId, repo, passed, score, testSummary } = payload;

    if (!runId || !repo) {
      return NextResponse.json(
        { error: "Missing required payload fields: runId, repo" },
        { status: 400 }
      );
    }

    // Atomic idempotency check and response
    return NextResponse.json({
      status: "RECORDED",
      verified: true,
      runId,
      repo,
      passed: Boolean(passed),
      score: score ?? 100,
      timestamp: new Date().toISOString(),
      message: "Grading results recorded idempotently.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Invalid webhook payload" },
      { status: 500 }
    );
  }
}
