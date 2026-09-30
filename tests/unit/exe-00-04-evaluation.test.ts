import { describe, it, expect } from "vitest";
import { ExerciseStateMachine } from "@/features/exercises/state-machine/exercise-state-machine";

describe("EXE-00-04 Visual Git Graph Reconstruction Evaluation Engine", () => {
  const validSolutionPayload = JSON.stringify({
    exercise_id: "exe-00-04",
    task_1_root_genesis_commit_id: "C0",
    task_1_active_head_branch: "main",
    task_1_active_head_commit_id: "C7",
    task_1_feature_branch_tip_id: "C4",
    task_2_direct_parent_of_c2: "C1",
    task_2_c4_ancestry_chain: ["C4", "C3", "C1", "C0"],
    task_2_arrow_direction: "backward_to_past",
    task_3_common_ancestor_base_commit: "C1",
    task_3_branch_storage_type: "lightweight_pointer",
    task_4_merge_commit_id: "M6",
    task_4_merge_parent_1_id: "C5",
    task_4_merge_parent_2_id: "C4",
    task_5_dag_acyclic_guarantee: "time_one_way_no_loops",
    task_5_unpushed_local_commits: ["M6", "C7"],
  });

  it("evaluates a perfect forensic reconstruction submission and returns 100% score", () => {
    const result = ExerciseStateMachine.evaluateSubmission(validSolutionPayload, {
      exercise_type: "visual_git_graph_reconstruction",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback.length).toBe(14); // 6 visible + 8 hidden
    expect(result.feedback.every((f) => f.passed)).toBe(true);
  });

  it("fails a submission with incorrect root genesis and merge commit identifications", () => {
    const flawedPayload = {
      ...JSON.parse(validSolutionPayload),
      task_1_root_genesis_commit_id: "C1", // Wrong (C0 is genesis)
      task_4_merge_commit_id: "C5", // Wrong (M6 is merge)
      task_1_feature_branch_tip_id: "C3", // Wrong (C4 is tip)
    };

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(flawedPayload), {
      exercise_type: "visual_git_graph_reconstruction",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(90);

    const vis1 = result.feedback.find((f) => f.rule.includes("VIS-01"));
    expect(vis1?.passed).toBe(false);

    const vis4 = result.feedback.find((f) => f.rule.includes("VIS-04"));
    expect(vis4?.passed).toBe(false);
  });

  it("fails a submission with ancestry chain or merge parent allocation errors", () => {
    const brokenLineagePayload = {
      ...JSON.parse(validSolutionPayload),
      task_2_c4_ancestry_chain: ["C4", "C2", "C0"], // Wrong chain
      task_4_merge_parent_1_id: "C1", // Wrong parent 1
      task_5_unpushed_local_commits: ["C0"], // Wrong unpushed
    };

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(brokenLineagePayload), {
      exercise_type: "visual_git_graph_reconstruction",
    });

    expect(result.score).toBeLessThan(90);
    expect(result.passed).toBe(false);

    const vis3 = result.feedback.find((f) => f.rule.includes("VIS-03"));
    expect(vis3?.passed).toBe(false);

    const hid5 = result.feedback.find((f) => f.rule.includes("HID-05"));
    expect(hid5?.passed).toBe(false);
  });

  it("handles malformed JSON payload gracefully without throwing unhandled exceptions", () => {
    const result = ExerciseStateMachine.evaluateSubmission("Malformed { JSON code", {
      exercise_type: "visual_git_graph_reconstruction",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.feedback?.[0]?.rule).toBe("JSON Manifest Integrity");
  });
});
