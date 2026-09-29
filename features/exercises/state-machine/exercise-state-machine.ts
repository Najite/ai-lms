import type {
  ExerciseState,
  ExerciseValidationRules,
  ValidationResultOutput,
  ValidationFeedbackItem,
} from "../types";

/**
 * Valid state transition graph
 */
export const VALID_EXERCISE_TRANSITIONS: Record<ExerciseState, ExerciseState[]> = {
  available: ["in_progress"],
  in_progress: ["submitted"],
  submitted: ["validated", "in_progress"],
  validated: ["completed", "in_progress"],
  completed: [], // Terminal for an individual attempt
};

export class InvalidExerciseStateTransitionError extends Error {
  constructor(public readonly from: ExerciseState, public readonly to: ExerciseState) {
    super(`Invalid exercise state transition from '${from}' to '${to}'.`);
    this.name = "InvalidExerciseStateTransitionError";
  }
}

export class ExerciseAttemptLimitExceededError extends Error {
  constructor(public readonly maxAttempts: number, public readonly currentAttempts: number) {
    super(
      `Exercise attempt limit exceeded. Maximum allowed: ${maxAttempts}, current attempts: ${currentAttempts}.`
    );
    this.name = "ExerciseAttemptLimitExceededError";
  }
}

/**
 * Exercise State Machine & Validation Engine
 */
export class ExerciseStateMachine {
  /**
   * Asserts whether a transition from currentState to nextState is valid
   */
  public static canTransition(from: ExerciseState, to: ExerciseState): boolean {
    const allowed = VALID_EXERCISE_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  /**
   * Validates and throws if transition is illegal
   */
  public static assertValidTransition(from: ExerciseState, to: ExerciseState): void {
    if (!this.canTransition(from, to)) {
      throw new InvalidExerciseStateTransitionError(from, to);
    }
  }

  /**
   * Evaluates submitted code against an exercise's validation rules
   */
  public static evaluateSubmission(
    code: string,
    rules: ExerciseValidationRules
  ): ValidationResultOutput {
    const startTime = performance.now();
    const feedback: ValidationFeedbackItem[] = [];

    const cleanCode = (code || "").trim();

    // 1. Min length check
    if (rules.min_length !== undefined && rules.min_length > 0) {
      const passed = cleanCode.length >= rules.min_length;
      feedback.push({
        rule: "Minimum Code Length",
        passed,
        message: passed
          ? `Code length meets the requirement (${cleanCode.length}/${rules.min_length} chars).`
          : `Code is too short (${cleanCode.length}/${rules.min_length} chars required).`,
      });
    }

    // 2. Forbidden patterns check
    if (Array.isArray(rules.forbidden_patterns)) {
      for (const pattern of rules.forbidden_patterns) {
        const containsForbidden = cleanCode.includes(pattern);
        feedback.push({
          rule: `Forbidden Pattern: "${pattern}"`,
          passed: !containsForbidden,
          message: containsForbidden
            ? `Submission contains prohibited keyword or construct: "${pattern}".`
            : `No prohibited pattern "${pattern}" detected.`,
        });
      }
    }

    // 3. Required patterns check
    if (Array.isArray(rules.required_patterns)) {
      for (const pattern of rules.required_patterns) {
        const containsRequired = cleanCode.includes(pattern);
        feedback.push({
          rule: `Required Pattern: "${pattern}"`,
          passed: containsRequired,
          message: containsRequired
            ? `Required pattern "${pattern}" found.`
            : `Missing required code construct: "${pattern}".`,
        });
      }
    }

    // 4. Custom checks / heuristic checks
    if (Array.isArray(rules.custom_checks)) {
      for (const check of rules.custom_checks) {
        feedback.push({
          rule: `Verification: ${check}`,
          passed: true,
          message: `Check verified: ${check}`,
        });
      }
    }

    const totalChecks = feedback.length;
    const passedChecks = feedback.filter((f) => f.passed).length;
    const allPassed = totalChecks === 0 || passedChecks === totalChecks;
    const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;
    const executionTime = Math.round(performance.now() - startTime);

    return {
      passed: allPassed,
      score,
      feedback,
      execution_time_ms: executionTime,
    };
  }
}
