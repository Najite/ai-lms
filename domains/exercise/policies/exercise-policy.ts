import type {
  Exercise,
  ExerciseAttempt,
  ExerciseSubmission,
} from "../models";

export interface UserContext {
  id: string;
  role?: string | null;
}

/**
 * Authorization Policy for the Exercise Domain
 * Enforces least privilege:
 * - Learners can view published exercises, start their own attempts, submit work,
 *   and view their own history and evidence.
 * - Learners cannot modify exercise definitions or access other learners' unshared records.
 * - Admins can perform administrative tasks.
 */
export class ExercisePolicy {
  /**
   * Evaluates if the user can read published exercises
   */
  public static canReadPublishedExercises(user?: UserContext | null): boolean {
    return user !== undefined ? true : true; // Published exercises are readable by authenticated or public catalog views
  }

  /**
   * Evaluates if the user can read unpublished exercise definitions
   */
  public static canReadUnpublishedExercises(user?: UserContext | null): boolean {
    return user?.role === "admin" || user?.role === "instructor";
  }

  /**
   * Evaluates if the user can start an attempt on the given exercise
   */
  public static canStartAttempt(
    user: UserContext | null | undefined,
    exercise: Exercise
  ): boolean {
    if (!user || !user.id) return false;
    if (!exercise.isPublished && !this.canReadUnpublishedExercises(user)) {
      return false;
    }
    return true;
  }

  /**
   * Evaluates if the user can submit work for an attempt
   */
  public static canSubmitWork(
    user: UserContext | null | undefined,
    attempt: ExerciseAttempt
  ): boolean {
    if (!user || !user.id) return false;
    if (attempt.userId !== user.id) return false;
    if (attempt.state === "completed") return false;
    return true;
  }

  /**
   * Evaluates if the user can complete an exercise attempt
   */
  public static canCompleteExercise(
    user: UserContext | null | undefined,
    attempt: ExerciseAttempt,
    latestSubmission: ExerciseSubmission | null
  ): boolean {
    if (!user || !user.id) return false;
    if (attempt.userId !== user.id) return false;
    if (!latestSubmission || latestSubmission.status !== "passed") return false;
    return true;
  }

  /**
   * Evaluates if the user can read attempt history
   */
  public static canReadHistory(
    user: UserContext | null | undefined,
    targetUserId: string
  ): boolean {
    if (!user || !user.id) return false;
    if (user.id === targetUserId) return true;
    return user.role === "admin" || user.role === "instructor";
  }

  /**
   * Evaluates if the user can read competency evidence
   */
  public static canReadEvidence(
    user: UserContext | null | undefined,
    targetUserId: string
  ): boolean {
    if (!user || !user.id) return false;
    if (user.id === targetUserId) return true;
    return user.role === "admin" || user.role === "instructor";
  }

  /**
   * Evaluates if the user can manage/edit exercise definitions
   */
  public static canManageExercises(user: UserContext | null | undefined): boolean {
    return user?.role === "admin" || user?.role === "instructor";
  }
}
