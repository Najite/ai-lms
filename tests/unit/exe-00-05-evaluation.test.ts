import { describe, it, expect } from "vitest";
import { ExerciseStateMachine } from "@/features/exercises/state-machine/exercise-state-machine";

describe("EXE-00-05 AI Verification & Evaluation Investigation Engine", () => {
  const validSolutionPayload = JSON.stringify({
    exercise_id: "exe-00-05",
    task_1_hallucinated_package_name: "@auth/jwt-auto-verify-v2",
    task_1_verification_evidence_source: "npm_registry_404_ts_compiler_ts2307",
    task_1_unsupported_performance_claim: "zero_overhead_native_caching",
    task_1_hallucinated_config_parameter: "cacheTtlSeconds",
    task_2_fake_documentation_citation: "rfc_8812_postgres_migration",
    task_2_deployment_sequence_defect: "workers_started_before_migration_completed",
    task_2_missing_context_element: "table_schema_existing_row_volume",
    task_3_logic_defect_type: "inverted_boolean_boundary",
    task_3_confidence_misalignment: "authoritative_tone_with_flawed_logic",
    task_3_false_api_property: "thread_safe_guarantee_unsupported",
    task_4_best_candidate_response_id: "candidate_b",
    task_4_worst_candidate_response_id: "candidate_a",
    task_4_candidate_rankings: ["candidate_b", "candidate_c", "candidate_a"],
    task_4_candidate_a_security_defect: "client_side_authorization_bypassing_rls",
  });

  it("evaluates a perfect AI verification submission and returns 100% score", () => {
    const result = ExerciseStateMachine.evaluateSubmission(validSolutionPayload, {
      exercise_type: "ai_verification_evaluation",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback.length).toBe(14); // 6 visible + 8 hidden
    expect(result.feedback.every((f) => f.passed)).toBe(true);
  });

  it("fails a submission with wrong hallucinated package and missing context", () => {
    const flawedPayload = {
      ...JSON.parse(validSolutionPayload),
      task_1_hallucinated_package_name: "jsonwebtoken", // Wrong (not hallucinated)
      task_2_missing_context_element: "wrong_context",
    };

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(flawedPayload), {
      exercise_type: "ai_verification_evaluation",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(90);

    const vis1 = result.feedback.find((f) => f.rule.includes("VIS-01"));
    expect(vis1?.passed).toBe(false);

    const vis2 = result.feedback.find((f) => f.rule.includes("VIS-02"));
    expect(vis2?.passed).toBe(false);
  });

  it("fails a submission with inverted candidate ranking", () => {
    const flawedRankingPayload = {
      ...JSON.parse(validSolutionPayload),
      task_4_best_candidate_response_id: "candidate_a", // Wrong (insecure candidate)
      task_4_candidate_rankings: ["candidate_a", "candidate_b", "candidate_c"],
    };

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(flawedRankingPayload), {
      exercise_type: "ai_verification_evaluation",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(90);

    const vis4 = result.feedback.find((f) => f.rule.includes("VIS-04"));
    expect(vis4?.passed).toBe(false);

    const hid8 = result.feedback.find((f) => f.rule.includes("HID-08"));
    expect(hid8?.passed).toBe(false);
  });

  it("fails on invalid JSON payload", () => {
    const result = ExerciseStateMachine.evaluateSubmission("not valid json", {
      exercise_type: "ai_verification_evaluation",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.feedback?.[0]?.rule).toBe("JSON Payload Structure");
  });
});
