import { describe, it, expect } from "vitest";
import { ProgressCalculator } from "@/features/learning/services/progress-calculator";
import type { UserLearningProgress } from "@/features/learning/types";

describe("ProgressCalculator Business Rules", () => {
  describe("calculateMetrics", () => {
    it("returns zero metrics when total lessons is zero", () => {
      const metrics = ProgressCalculator.calculateMetrics(0, 0, 0);
      expect(metrics).toEqual({
        totalLessons: 0,
        completedLessons: 0,
        inProgressLessons: 0,
        notStartedLessons: 0,
        percentage: 0,
        isCompleted: false,
        isStarted: false,
      });
    });

    it("handles zero completed out of total", () => {
      const metrics = ProgressCalculator.calculateMetrics(5, 0, 0);
      expect(metrics.percentage).toBe(0);
      expect(metrics.totalLessons).toBe(5);
      expect(metrics.completedLessons).toBe(0);
      expect(metrics.notStartedLessons).toBe(5);
      expect(metrics.isCompleted).toBe(false);
      expect(metrics.isStarted).toBe(false);
    });

    it("calculates accurate percentage and flags isStarted when lessons are in progress", () => {
      const metrics = ProgressCalculator.calculateMetrics(4, 1, 2);
      expect(metrics.totalLessons).toBe(4);
      expect(metrics.completedLessons).toBe(1);
      expect(metrics.inProgressLessons).toBe(2);
      expect(metrics.notStartedLessons).toBe(1);
      expect(metrics.percentage).toBe(25);
      expect(metrics.isStarted).toBe(true);
      expect(metrics.isCompleted).toBe(false);
    });

    it("rounds percentage to nearest integer", () => {
      const metrics = ProgressCalculator.calculateMetrics(3, 1, 0);
      // 1 / 3 = 33.333% -> 33%
      expect(metrics.percentage).toBe(33);
    });

    it("accurately marks 100% completion", () => {
      const metrics = ProgressCalculator.calculateMetrics(5, 5, 0);
      expect(metrics.percentage).toBe(100);
      expect(metrics.isCompleted).toBe(true);
      expect(metrics.isStarted).toBe(true);
      expect(metrics.notStartedLessons).toBe(0);
    });

    it("clamps completed count to total lessons if input exceeds total", () => {
      const metrics = ProgressCalculator.calculateMetrics(5, 10, 0);
      expect(metrics.totalLessons).toBe(5);
      expect(metrics.completedLessons).toBe(5);
      expect(metrics.percentage).toBe(100);
      expect(metrics.isCompleted).toBe(true);
    });

    it("handles negative input values gracefully", () => {
      const metrics = ProgressCalculator.calculateMetrics(-5, -2, -1);
      expect(metrics.percentage).toBe(0);
      expect(metrics.totalLessons).toBe(0);
    });
  });

  describe("calculateFromRecords", () => {
    const lessonIds = ["lesson-1", "lesson-2", "lesson-3", "lesson-4"];

    it("returns zero metrics when lesson list is empty", () => {
      const metrics = ProgressCalculator.calculateFromRecords([], []);
      expect(metrics.totalLessons).toBe(0);
      expect(metrics.percentage).toBe(0);
    });

    it("computes correct progress from mixed records", () => {
      const records: UserLearningProgress[] = [
        {
          id: "p1",
          userId: "u1",
          learningPathId: "path1",
          moduleId: "mod1",
          lessonId: "lesson-1",
          status: "completed",
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "p2",
          userId: "u1",
          learningPathId: "path1",
          moduleId: "mod1",
          lessonId: "lesson-2",
          status: "in_progress",
          startedAt: new Date().toISOString(),
          completedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const metrics = ProgressCalculator.calculateFromRecords(lessonIds, records);
      expect(metrics.totalLessons).toBe(4);
      expect(metrics.completedLessons).toBe(1);
      expect(metrics.inProgressLessons).toBe(1);
      expect(metrics.notStartedLessons).toBe(2);
      expect(metrics.percentage).toBe(25);
      expect(metrics.isStarted).toBe(true);
      expect(metrics.isCompleted).toBe(false);
    });

    it("ignores records for lessons not in the given list", () => {
      const records: UserLearningProgress[] = [
        {
          id: "p-other",
          userId: "u1",
          learningPathId: "path-other",
          moduleId: "mod-other",
          lessonId: "lesson-foreign",
          status: "completed",
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const metrics = ProgressCalculator.calculateFromRecords(lessonIds, records);
      expect(metrics.completedLessons).toBe(0);
      expect(metrics.percentage).toBe(0);
      expect(metrics.notStartedLessons).toBe(4);
    });
  });
});
