import { describe, it, expect } from "vitest";
import {
  CompetencyStateMachine,
  COMPETENCY_STATE_ORDER,
} from "@/features/competencies/state-machine/competency-state-machine";

describe("CompetencyStateMachine Business Rules", () => {
  describe("State Ordering & Weights", () => {
    it("strictly preserves the ordinal hierarchy of competency milestones", () => {
      expect(COMPETENCY_STATE_ORDER.not_started).toBe(0);
      expect(COMPETENCY_STATE_ORDER.introduced).toBe(1);
      expect(COMPETENCY_STATE_ORDER.practicing).toBe(2);
      expect(COMPETENCY_STATE_ORDER.reinforced).toBe(3);
      expect(COMPETENCY_STATE_ORDER.mastered).toBe(4);

      expect(COMPETENCY_STATE_ORDER.introduced).toBeGreaterThan(COMPETENCY_STATE_ORDER.not_started);
      expect(COMPETENCY_STATE_ORDER.practicing).toBeGreaterThan(COMPETENCY_STATE_ORDER.introduced);
      expect(COMPETENCY_STATE_ORDER.reinforced).toBeGreaterThan(COMPETENCY_STATE_ORDER.practicing);
      expect(COMPETENCY_STATE_ORDER.mastered).toBeGreaterThan(COMPETENCY_STATE_ORDER.reinforced);
    });
  });

  describe("isValidTransition", () => {
    it("permits forward transitions", () => {
      expect(CompetencyStateMachine.isValidTransition("not_started", "introduced")).toBe(true);
      expect(CompetencyStateMachine.isValidTransition("introduced", "practicing")).toBe(true);
      expect(CompetencyStateMachine.isValidTransition("practicing", "reinforced")).toBe(true);
      expect(CompetencyStateMachine.isValidTransition("reinforced", "mastered")).toBe(true);
      expect(CompetencyStateMachine.isValidTransition("not_started", "mastered")).toBe(true);
    });

    it("permits idempotent (same state) transitions", () => {
      expect(CompetencyStateMachine.isValidTransition("practicing", "practicing")).toBe(true);
      expect(CompetencyStateMachine.isValidTransition("mastered", "mastered")).toBe(true);
    });

    it("rejects backwards state transitions", () => {
      expect(CompetencyStateMachine.isValidTransition("mastered", "reinforced")).toBe(false);
      expect(CompetencyStateMachine.isValidTransition("reinforced", "practicing")).toBe(false);
      expect(CompetencyStateMachine.isValidTransition("practicing", "introduced")).toBe(false);
      expect(CompetencyStateMachine.isValidTransition("introduced", "not_started")).toBe(false);
    });
  });

  describe("deriveStateFromScore", () => {
    it("derives not_started for score 0", () => {
      expect(CompetencyStateMachine.deriveStateFromScore(0)).toBe("not_started");
    });

    it("derives introduced for score between 1 and 29", () => {
      expect(CompetencyStateMachine.deriveStateFromScore(10)).toBe("introduced");
      expect(CompetencyStateMachine.deriveStateFromScore(29)).toBe("introduced");
    });

    it("derives practicing for score between 30 and 59", () => {
      expect(CompetencyStateMachine.deriveStateFromScore(30)).toBe("practicing");
      expect(CompetencyStateMachine.deriveStateFromScore(59)).toBe("practicing");
    });

    it("derives reinforced for score between 60 and 89", () => {
      expect(CompetencyStateMachine.deriveStateFromScore(60)).toBe("reinforced");
      expect(CompetencyStateMachine.deriveStateFromScore(89)).toBe("reinforced");
    });

    it("derives mastered for score >= 90", () => {
      expect(CompetencyStateMachine.deriveStateFromScore(90)).toBe("mastered");
      expect(CompetencyStateMachine.deriveStateFromScore(100)).toBe("mastered");
    });

    it("handles negative and out-of-bound scores safely", () => {
      expect(CompetencyStateMachine.deriveStateFromScore(-10)).toBe("not_started");
      expect(CompetencyStateMachine.deriveStateFromScore(150)).toBe("mastered");
    });
  });

  describe("computeProgression", () => {
    it("advances score and state appropriately on activity contribution", () => {
      const result = CompetencyStateMachine.computeProgression("not_started", 0, 35);
      expect(result.nextScore).toBe(35);
      expect(result.nextState).toBe("practicing");
    });

    it("respects curriculum targetState if higher than score-derived state", () => {
      const result = CompetencyStateMachine.computeProgression(
        "not_started",
        0,
        15,
        "practicing"
      );
      expect(result.nextScore).toBe(15);
      expect(result.nextState).toBe("practicing");
    });

    it("never regresses an already higher state", () => {
      const result = CompetencyStateMachine.computeProgression(
        "reinforced",
        65,
        5,
        "introduced"
      );
      expect(result.nextScore).toBe(70);
      expect(result.nextState).toBe("reinforced");
    });

    it("caps maximum score at 100", () => {
      const result = CompetencyStateMachine.computeProgression("reinforced", 85, 40);
      expect(result.nextScore).toBe(100);
      expect(result.nextState).toBe("mastered");
    });
  });
});
