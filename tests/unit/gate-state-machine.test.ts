import { describe, it, expect } from "vitest";
import { GatePolicy } from "@/domains/gates/policies/gate-policy";
import { VALID_GATE_TRANSITIONS, type GateStatus } from "@/domains/gates/models";

describe("Competency Gate State Machine & Policies", () => {
  describe("State Machine Transition Invariants", () => {
    it("allows valid forward transitions in the lifecycle", () => {
      expect(GatePolicy.canTransition("locked", "available")).toBe(true);
      expect(GatePolicy.canTransition("available", "in_progress")).toBe(true);
      expect(GatePolicy.canTransition("in_progress", "under_review")).toBe(true);
      expect(GatePolicy.canTransition("under_review", "validated")).toBe(true);
      expect(GatePolicy.canTransition("validated", "completed")).toBe(true);
    });

    it("allows revision loop back from under_review to in_progress", () => {
      expect(GatePolicy.canTransition("under_review", "in_progress")).toBe(true);
    });

    it("rejects invalid skipping of prerequisite states", () => {
      expect(GatePolicy.canTransition("locked", "completed")).toBe(false);
      expect(GatePolicy.canTransition("locked", "in_progress")).toBe(false);
      expect(GatePolicy.canTransition("available", "validated")).toBe(false);
      expect(GatePolicy.canTransition("available", "completed")).toBe(false);
    });

    it("rejects transitions out of completed state (Rule #4: permanent completion)", () => {
      expect(GatePolicy.canTransition("completed", "in_progress")).toBe(false);
      expect(GatePolicy.canTransition("completed", "available")).toBe(false);
      expect(GatePolicy.canTransition("completed", "locked")).toBe(false);
      expect(VALID_GATE_TRANSITIONS.completed).toEqual([]);
    });

    it("allows self-transitions (idempotent)", () => {
      const statuses: GateStatus[] = ["locked", "available", "in_progress", "under_review", "validated", "completed"];
      for (const status of statuses) {
        expect(GatePolicy.canTransition(status, status)).toBe(true);
      }
    });
  });

  describe("GatePolicy Access Control", () => {
    const learner = { id: "learner-1", role: "learner" as const };
    const otherLearner = { id: "learner-2", role: "learner" as const };
    const admin = { id: "admin-1", role: "admin" as const };
    const instructor = { id: "instructor-1", role: "instructor" as const };

    it("allows learners to view their own progress but not other learners", () => {
      expect(GatePolicy.canViewProgress(learner, "learner-1")).toBe(true);
      expect(GatePolicy.canViewProgress(learner, "learner-2")).toBe(false);
      expect(GatePolicy.canViewProgress(otherLearner, "learner-2")).toBe(true);
      expect(GatePolicy.canViewProgress(otherLearner, "learner-1")).toBe(false);
      expect(GatePolicy.canViewProgress(admin, "learner-2")).toBe(true);
      expect(GatePolicy.canViewProgress(instructor, "learner-2")).toBe(true);
    });

    it("allows starting attempts only when gate is available or in_progress", () => {
      expect(GatePolicy.canStartAttempt(learner, "learner-1", "available")).toBe(true);
      expect(GatePolicy.canStartAttempt(learner, "learner-1", "in_progress")).toBe(true);
      expect(GatePolicy.canStartAttempt(learner, "learner-1", "locked")).toBe(false);
      expect(GatePolicy.canStartAttempt(learner, "learner-1", "completed")).toBe(false);
    });

    it("restricts gate validation to instructors and admins", () => {
      expect(GatePolicy.canValidateGate(learner)).toBe(false);
      expect(GatePolicy.canValidateGate(instructor)).toBe(true);
      expect(GatePolicy.canValidateGate(admin)).toBe(true);
    });

    it("restricts gate definition management to administrators", () => {
      expect(GatePolicy.canManageGateDefinitions(learner)).toBe(false);
      expect(GatePolicy.canManageGateDefinitions(instructor)).toBe(false);
      expect(GatePolicy.canManageGateDefinitions(admin)).toBe(true);
    });
  });
});
