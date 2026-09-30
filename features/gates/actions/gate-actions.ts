"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GateAttemptRepository } from "@/domains/gates/repositories/gate-attempt.repository";
import { GateProgressService } from "@/domains/gates/services/gate-progress.service";
import { GateEvidenceService } from "@/domains/gates/services/gate-evidence.service";
import { GateValidationService } from "@/domains/gates/services/gate-validation.service";
import { GateCompletionService } from "@/domains/gates/services/gate-completion.service";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";
import {
  collectGateEvidenceSchema,
  validateGateSchema,
  type CollectGateEvidenceInput,
  type ValidateGateInput,
} from "../schemas";

/**
 * Starts an attempt on a competency gate
 */
export async function startGateAttemptAction(gateId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const queryService = new GateQueryService(supabase);
  const statusRes = await queryService.getUserGateStatus(user.id, gateId);
  if (!statusRes.success || !statusRes.data) {
    return { success: false, error: "Gate not found." };
  }

  if (statusRes.data.status === "locked") {
    return {
      success: false,
      error: "Gate is locked. Complete previous level prerequisites first.",
    };
  }

  if (statusRes.data.isCompleted) {
    return { success: false, error: "Gate is already completed." };
  }

  const attemptRepo = new GateAttemptRepository(supabase);
  const progressService = new GateProgressService(supabase);

  let attempt = await attemptRepo.getActiveAttempt(user.id, statusRes.data.gate.id);
  if (!attempt) {
    attempt = await attemptRepo.createAttempt(user.id, statusRes.data.gate.id);
  }

  if (!attempt) {
    return { success: false, error: "Failed to initialize gate attempt." };
  }

  await progressService.updateProgress(user.id, statusRes.data.gate.id, 70, "in_progress");

  revalidatePath("/gates");
  revalidatePath(`/gates/${statusRes.data.gate.slug}`);

  return { success: true, data: attempt };
}

/**
 * Submits evidence for a gate attempt
 */
export async function collectGateEvidenceAction(input: CollectGateEvidenceInput) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = collectGateEvidenceSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid evidence input format." };
  }

  const evidenceService = new GateEvidenceService(supabase);
  const result = await evidenceService.collectEvidence(
    user.id,
    parsed.data.gateId,
    parsed.data.evidenceType,
    parsed.data.evidenceReference,
    parsed.data.attemptId,
    parsed.data.metadata
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/gates");
  return { success: true, data: result.data };
}

/**
 * Validates a gate attempt outcome
 */
export async function validateGateAction(input: ValidateGateInput) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = validateGateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid validation input format." };
  }

  const validationService = new GateValidationService(supabase);
  const result = await validationService.validateGate(
    user.id,
    parsed.data.gateId,
    parsed.data.passed,
    parsed.data.score,
    parsed.data.feedback,
    parsed.data.criteriaResults,
    parsed.data.attemptId
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/gates");
  return { success: true, data: result.data };
}

/**
 * Permanently completes a competency gate
 */
export async function completeGateAction(gateId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const completionService = new GateCompletionService(supabase);
  const result = await completionService.completeGate(user.id, gateId);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/gates");
  return { success: true, data: result.data };
}

/**
 * Recalculates user gate progress and status
 */
export async function recalculateGateProgressAction(gateId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const progressService = new GateProgressService(supabase);
  const result = await progressService.calculateProgress(user.id, gateId);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/gates");
  return { success: true, data: result.data };
}
