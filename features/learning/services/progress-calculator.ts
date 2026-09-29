import type { ProgressMetrics, UserLearningProgress } from "../types";

/**
 * Pure progress calculator implementing Learning Domain business rules.
 */
export class ProgressCalculator {
  /**
   * Calculates progress metrics given totals and status counts.
   */
  public static calculateMetrics(
    totalLessons: number,
    completedLessons: number,
    inProgressLessons: number = 0
  ): ProgressMetrics {
    if (totalLessons <= 0) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        inProgressLessons: 0,
        notStartedLessons: 0,
        percentage: 0,
        isCompleted: false,
        isStarted: false,
      };
    }

    // Ensure non-negative and bounded numbers
    const validTotal = Math.max(0, totalLessons);
    const validCompleted = Math.min(validTotal, Math.max(0, completedLessons));
    const validInProgress = Math.min(validTotal - validCompleted, Math.max(0, inProgressLessons));
    const notStarted = Math.max(0, validTotal - validCompleted - validInProgress);

    const rawPercentage = (validCompleted / validTotal) * 100;
    const percentage = Math.round(Math.min(100, Math.max(0, rawPercentage)));

    const isCompleted = validCompleted === validTotal && validTotal > 0;
    const isStarted = validCompleted > 0 || validInProgress > 0;

    return {
      totalLessons: validTotal,
      completedLessons: validCompleted,
      inProgressLessons: validInProgress,
      notStartedLessons: notStarted,
      percentage,
      isCompleted,
      isStarted,
    };
  }

  /**
   * Calculates metrics from a list of lesson IDs and user progress records.
   */
  public static calculateFromRecords(
    lessonIds: string[],
    progressRecords: UserLearningProgress[]
  ): ProgressMetrics {
    const totalLessons = lessonIds.length;
    if (totalLessons === 0) {
      return this.calculateMetrics(0, 0, 0);
    }

    const lessonSet = new Set(lessonIds);
    let completed = 0;
    let inProgress = 0;

    for (const record of progressRecords) {
      if (lessonSet.has(record.lessonId)) {
        if (record.status === "completed") {
          completed += 1;
        } else if (record.status === "in_progress") {
          inProgress += 1;
        }
      }
    }

    return this.calculateMetrics(totalLessons, completed, inProgress);
  }
}
