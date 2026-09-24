import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

/** Max age of a signed request, to blunt replay attacks. */
const MAX_CLOCK_SKEW_SECONDS = 300;

/**
 * Constant-time comparison so verification cannot leak the expected digest byte
 * by byte through response timing.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSha256Hex(secret: string, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LMS_WEBHOOK_SECRET;

    // FAIL CLOSED. Without a shared secret there is no way to authenticate the
    // caller, and this endpoint must never accept unauthenticated attestations.
    if (!secret) {
      return NextResponse.json(
        {
          error:
            "Webhook verification is not configured (LMS_WEBHOOK_SECRET is unset). " +
            "Attestations are rejected until a shared secret is provisioned.",
        },
        { status: 503 }
      );
    }

    // The signing workflow sends `x-lms-signature: sha256=<hex>`; the older
    // `x-grading-signature` name is still accepted for compatibility.
    const rawSignature =
      req.headers.get("x-lms-signature") || req.headers.get("x-grading-signature");

    if (!rawSignature) {
      return NextResponse.json(
        { error: "Missing signature header (expected 'x-lms-signature: sha256=<hex>')." },
        { status: 401 }
      );
    }

    const provided = rawSignature.startsWith("sha256=")
      ? rawSignature.slice("sha256=".length)
      : rawSignature;

    const rawBody = await req.text();
    const expected = await hmacSha256Hex(secret, rawBody);

    if (!timingSafeEqual(expected.toLowerCase(), provided.toLowerCase())) {
      return NextResponse.json({ error: "Invalid HMAC signature." }, { status: 401 });
    }

    const timestamp = req.headers.get("x-lms-timestamp") || req.headers.get("x-grading-timestamp");
    if (!timestamp) {
      return NextResponse.json({ error: "Missing timestamp header." }, { status: 401 });
    }
    const sentAt = Number(timestamp);
    if (!Number.isFinite(sentAt)) {
      return NextResponse.json({ error: "Malformed timestamp header." }, { status: 400 });
    }
    const ageSeconds = Math.abs(Date.now() / 1000 - sentAt);
    if (ageSeconds > MAX_CLOCK_SKEW_SECONDS) {
      return NextResponse.json(
        { error: `Signature expired (${Math.round(ageSeconds)}s old). Re-run the workflow.` },
        { status: 401 }
      );
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
    }

    const runId = payload?.run_id ?? payload?.runId;
    const repo = payload?.github_repo_url ?? payload?.project_slug ?? payload?.repo;

    if (!runId || !repo) {
      return NextResponse.json(
        { error: "Missing required payload fields: run_id, repo/project_slug" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Webhook persistence is not configured." }, { status: 503 });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { error: insertError } = await admin.from("grading_attestations").insert({
      run_id: runId,
      repo,
      payload,
      passed: payload?.status ? payload.status === "PASSED" : Boolean(payload?.passed),
      score: payload?.score ?? null,
      signed_at: new Date(sentAt * 1000).toISOString(),
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "This grading run was already recorded.", runId }, { status: 409 });
      }
      throw insertError;
    }

    return NextResponse.json({
      status: "ACCEPTED",
      verified: false,
      recorded: true,
      runId,
      repo,
      passed: payload?.status ? payload.status === "PASSED" : Boolean(payload?.passed),
      score: payload?.score ?? null,
      timestamp: new Date().toISOString(),
      message: "Signature verified and attestation persisted.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Invalid webhook payload" },
      { status: 500 }
    );
  }
}
