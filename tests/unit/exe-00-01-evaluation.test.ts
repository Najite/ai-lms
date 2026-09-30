import { describe, it, expect } from "vitest";
import { ExerciseStateMachine } from "@/features/exercises/state-machine/exercise-state-machine";

describe("EXE-00-01 Visual Filesystem Reconstruction Evaluation Engine", () => {
  const validSolutionPayload = JSON.stringify({
    exercise_code: "EXE-00-01",
    learner_workspace: "/home/alex",
    section_1_topology: [
      { path: "/", parent: null, type: "directory" },
      { path: "/bin", parent: "/", type: "directory" },
      { path: "/etc", parent: "/", type: "directory" },
      { path: "/home", parent: "/", type: "directory" },
      { path: "/var", parent: "/", type: "directory" },
      { path: "/tmp", parent: "/", type: "directory" },
      { path: "/var/log", parent: "/var", type: "directory" },
      { path: "/home/alex", parent: "/home", type: "directory" },
      { path: "/home/alex/Documents", parent: "/home/alex", type: "directory" },
      { path: "/home/alex/projects", parent: "/home/alex", type: "directory" },
      { path: "/home/alex/projects/cloud-app", parent: "/home/alex/projects", type: "directory" },
      { path: "/home/alex/projects/cloud-app/src", parent: "/home/alex/projects/cloud-app", type: "directory" },
    ],
    section_2_absolute_paths: {
      nginx_config: "/etc/nginx.conf",
      application_log: "/var/log/app.log",
      architecture_notes: "/home/alex/Documents/architecture-notes.md",
      production_env_secrets: "/home/alex/projects/cloud-app/.env",
      application_entrypoint: "/home/alex/projects/cloud-app/src/index.js",
    },
    section_3_relative_paths: {
      from_cloud_app_to_package_json: "package.json",
      from_cloud_app_to_index_js: "src/index.js",
      from_cloud_app_to_architecture_notes: "../../Documents/architecture-notes.md",
      from_src_to_application_log: "../../../../var/log/app.log",
      from_home_to_env_secrets: "projects/cloud-app/.env",
    },
    section_4_permissions_and_dotfiles: {
      nginx_config: {
        is_hidden: false,
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        others: { read: true, write: false, execute: false },
      },
      env_secrets: {
        is_hidden: true,
        owner: { read: true, write: true, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
      },
      application_entrypoint: {
        is_hidden: false,
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
      },
    },
  });

  it("evaluates a 100% correct solution and passes with 100% score", () => {
    const result = ExerciseStateMachine.evaluateSubmission(validSolutionPayload, {
      exercise_type: "visual_filesystem_reconstruction",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback.length).toBe(14); // 6 visible + 8 hidden
    expect(result.feedback.every((f) => f.passed)).toBe(true);
  });

  it("fails when production .env secrets are made world-readable (Security Invariant)", () => {
    const insecurePayload = JSON.parse(validSolutionPayload);
    insecurePayload.section_4_permissions_and_dotfiles.env_secrets.others.read = true; // Security leak!

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(insecurePayload), {
      exercise_type: "visual_filesystem_reconstruction",
    });

    const secretCheck = result.feedback.find((f) => f.rule.includes("VIS-06"));
    expect(secretCheck?.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
  });

  it("fails when multi-hop relative parent paths are miscalculated", () => {
    const brokenHopsPayload = JSON.parse(validSolutionPayload);
    brokenHopsPayload.section_3_relative_paths.from_src_to_application_log = "../../var/log/app.log"; // Only 2 hops instead of 4

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(brokenHopsPayload), {
      exercise_type: "visual_filesystem_reconstruction",
    });

    const deepHopCheck = result.feedback.find((f) => f.rule.includes("HID-02"));
    expect(deepHopCheck?.passed).toBe(false);
  });

  it("fails when topology has missing or unassigned directory nodes", () => {
    const brokenTopologyPayload = JSON.parse(validSolutionPayload);
    brokenTopologyPayload.section_1_topology = brokenTopologyPayload.section_1_topology.slice(0, 5); // Missing half the tree

    const result = ExerciseStateMachine.evaluateSubmission(JSON.stringify(brokenTopologyPayload), {
      exercise_type: "visual_filesystem_reconstruction",
    });

    const treeCheck = result.feedback.find((f) => f.rule.includes("HID-06"));
    expect(treeCheck?.passed).toBe(false);
    expect(result.score).toBeLessThan(90);
    expect(result.passed).toBe(false);
  });
});
