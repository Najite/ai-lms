import { describe, it, expect } from "vitest";
import {
  ExerciseStateMachine,
  InvalidExerciseStateTransitionError,
  ExerciseAttemptLimitExceededError,
} from "@/features/exercises/state-machine/exercise-state-machine";

describe("ExerciseStateMachine Business Rules & State Transitions", () => {
  describe("Valid Transitions Graph", () => {
    it("allows transition from available to in_progress", () => {
      expect(ExerciseStateMachine.canTransition("available", "in_progress")).toBe(true);
    });

    it("allows transition from in_progress to submitted", () => {
      expect(ExerciseStateMachine.canTransition("in_progress", "submitted")).toBe(true);
    });

    it("allows transition from submitted to validated and back to in_progress", () => {
      expect(ExerciseStateMachine.canTransition("submitted", "validated")).toBe(true);
      expect(ExerciseStateMachine.canTransition("submitted", "in_progress")).toBe(true);
    });

    it("allows transition from validated to completed and back to in_progress", () => {
      expect(ExerciseStateMachine.canTransition("validated", "completed")).toBe(true);
      expect(ExerciseStateMachine.canTransition("validated", "in_progress")).toBe(true);
    });
  });

  describe("Invalid Transitions & Boundary Enforcement", () => {
    it("prohibits skipping directly from available to completed", () => {
      expect(ExerciseStateMachine.canTransition("available", "completed")).toBe(false);
    });

    it("prohibits skipping directly from available to validated", () => {
      expect(ExerciseStateMachine.canTransition("available", "validated")).toBe(false);
    });

    it("prohibits skipping directly from in_progress to completed", () => {
      expect(ExerciseStateMachine.canTransition("in_progress", "completed")).toBe(false);
    });

    it("prohibits mutating completed attempts", () => {
      expect(ExerciseStateMachine.canTransition("completed", "in_progress")).toBe(false);
      expect(ExerciseStateMachine.canTransition("completed", "submitted")).toBe(false);
      expect(ExerciseStateMachine.canTransition("completed", "available")).toBe(false);
    });

    it("throws InvalidExerciseStateTransitionError on assertValidTransition with invalid transition", () => {
      expect(() => {
        ExerciseStateMachine.assertValidTransition("available", "completed");
      }).toThrow(InvalidExerciseStateTransitionError);
    });

    it("does not throw on assertValidTransition with valid transition", () => {
      expect(() => {
        ExerciseStateMachine.assertValidTransition("available", "in_progress");
      }).not.toThrow();
    });
  });

  describe("Submission Code Evaluation Engine", () => {
    const sampleRules = {
      min_length: 50,
      required_patterns: ["export const", "z.object", "tool_name"],
      forbidden_patterns: ["eval(", "Math.random"],
      custom_checks: ["Must export strict schema"],
    };

    it("passes when all criteria, required patterns, and length are satisfied", () => {
      const validCode = `
        import { z } from "zod";
        export const toolSchema = z.object({
          tool_name: z.string()
        });
      `;

      const result = ExerciseStateMachine.evaluateSubmission(validCode, sampleRules);

      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
      expect(result.feedback.length).toBe(7);
      expect(result.execution_time_ms).toBeGreaterThanOrEqual(0);
    });

    it("fails and lowers score when required pattern is missing", () => {
      const missingPatternCode = `
        import { z } from "zod";
        export const toolSchema = z.object({
          name: z.string()
        });
      `;

      const result = ExerciseStateMachine.evaluateSubmission(missingPatternCode, sampleRules);

      expect(result.passed).toBe(false);
      expect(result.score).toBeLessThan(100);
      const failedCheck = result.feedback.find((f) => !f.passed);
      expect(failedCheck?.rule).toContain('Required Pattern: "tool_name"');
    });

    it("fails when prohibited pattern is detected", () => {
      const forbiddenCode = `
        import { z } from "zod";
        export const toolSchema = z.object({
          tool_name: z.string()
        });
        const dynamic = eval("dangerous()");
      `;

      const result = ExerciseStateMachine.evaluateSubmission(forbiddenCode, sampleRules);

      expect(result.passed).toBe(false);
      const forbiddenCheck = result.feedback.find((f) => f.rule.includes("Forbidden Pattern"));
      expect(forbiddenCheck?.passed).toBe(false);
      expect(forbiddenCheck?.message).toContain("prohibited keyword");
    });

    it("fails when code is below minimum length threshold", () => {
      const shortCode = `short`;

      const result = ExerciseStateMachine.evaluateSubmission(shortCode, sampleRules);

      expect(result.passed).toBe(false);
      const lengthCheck = result.feedback.find((f) => f.rule === "Minimum Code Length");
      expect(lengthCheck?.passed).toBe(false);
      expect(lengthCheck?.message).toContain("too short");
    });
  });

  describe("Attempt Limit Error", () => {
    it("formats message with maximum and current attempt counts", () => {
      const err = new ExerciseAttemptLimitExceededError(3, 3);
      expect(err.message).toContain("Maximum allowed: 3");
      expect(err.message).toContain("current attempts: 3");
      expect(err.name).toBe("ExerciseAttemptLimitExceededError");
    });
  });
});
