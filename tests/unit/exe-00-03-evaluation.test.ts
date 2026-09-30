import { describe, it, expect } from "vitest";
import { ExerciseStateMachine } from "@/features/exercises/state-machine/exercise-state-machine";

describe("EXE-00-03 Network Request Investigation Evaluation Engine", () => {
  const validSolutionPayload = JSON.stringify({
    exercise_id: "exe-00-03",
    task_1_successful_catalog_request_id: "R3",
    task_1_missing_asset_request_id: "R4",
    task_2_redirect_target_url: "https://octostore.app",
    task_2_insecure_http_request_id: "R7",
    task_3_unauthenticated_request_id: "R5",
    task_3_forbidden_request_id: "R6",
    task_4_backend_crash_request_id: "R8",
    task_4_timeout_bottleneck_request_id: "R9",
    task_5_resolved_api_ip_address: "140.82.121.34",
    task_5_error_code_payload: "DB_CONN_TIMEOUT",
    task_6_primary_root_cause: "database_connection_crash",
  });

  it("evaluates a perfect diagnostic submission and returns 100% score", () => {
    const result = ExerciseStateMachine.evaluateSubmission(validSolutionPayload, {
      exercise_type: "network_request_diagnostics",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback.length).toBe(14); // 6 visible + 8 hidden
    expect(result.feedback.every((f) => f.passed)).toBe(true);
  });

  it("fails a submission with incorrect status code identifications", () => {
    const flawedPayload = {
      ...JSON.parse(validSolutionPayload),
      task_1_successful_catalog_request_id: "R1", // Wrong (301)
      task_1_missing_asset_request_id: "R3", // Wrong (200)
      task_4_backend_crash_request_id: "R9", // Wrong (504 instead of 500)
    };

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(flawedPayload), {
      exercise_type: "network_request_diagnostics",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(90);

    const vis1 = result.feedback.find((f) => f.rule.includes("VIS-01"));
    expect(vis1?.passed).toBe(false);
  });

  it("fails a submission missing DNS resolution and JSON extraction", () => {
    const incompletePayload = {
      ...JSON.parse(validSolutionPayload),
      task_5_resolved_api_ip_address: "127.0.0.1", // Wrong IP
      task_5_error_code_payload: "UNKNOWN_ERROR", // Wrong payload code
    };

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(incompletePayload), {
      exercise_type: "network_request_diagnostics",
    });

    expect(result.score).toBeLessThan(90);
    expect(result.passed).toBe(false);
  });

  it("handles malformed JSON payload gracefully without throwing unhandled exceptions", () => {
    const result = ExerciseStateMachine.evaluateSubmission("Not JSON { broken", {
      exercise_type: "network_request_diagnostics",
    });

    expect(result.passed).toBe(false);
    expect(result.feedback?.[0]?.rule).toBe("JSON Manifest Integrity");
  });
});
