import type { CompetencyState } from "../types";

/**
 * Ordered numerical weights for competency states
 */
export const COMPETENCY_STATE_ORDER: Record<CompetencyState, number> = {
  not_started: 0,
  introduced: 1,
  practicing: 2,
  reinforced: 3,
  mastered: 4,
};

/**
 * Competency State Machine governing domain state transitions and score calculations.
 */
export class CompetencyStateMachine {
  /**
   * Validates whether a state transition from current to next is allowed.
   */
  public static isValidTransition(current: CompetencyState, next: CompetencyState): boolean {
    const currentWeight = COMPETENCY_STATE_ORDER[current];
    const nextWeight = COMPETENCY_STATE_ORDER[next];

    // State progression must be non-decreasing (idempotent or forward progression)
    return nextWeight >= currentWeight;
  }

  /**
   * Derives competency state based on cumulative score
   */
  public static deriveStateFromScore(score: number): CompetencyState {
    const clampedScore = Math.min(100, Math.max(0, score));

    if (clampedScore >= 90) return "mastered";
    if (clampedScore >= 60) return "reinforced";
    if (clampedScore >= 30) return "practicing";
    if (clampedScore > 0) return "introduced";
    return "not_started";
  }

  /**
   * Resolves the maximum state between derived score state and explicit target state
   */
  public static resolveHighestState(
    stateA: CompetencyState,
    stateB: CompetencyState
  ): CompetencyState {
    const weightA = COMPETENCY_STATE_ORDER[stateA];
    const weightB = COMPETENCY_STATE_ORDER[stateB];

    return weightA >= weightB ? stateA : stateB;
  }

  /**
   * Computes next progress state and score after evidence contribution
   */
  public static computeProgression(
    currentState: CompetencyState,
    currentScore: number,
    contributionPoints: number,
    targetState?: CompetencyState
  ): {
    nextState: CompetencyState;
    nextScore: number;
  } {
    const validCurrentScore = Math.min(100, Math.max(0, currentScore));
    const validContribution = Math.max(0, contributionPoints);
    const nextScore = Math.min(100, validCurrentScore + validContribution);

    const scoreDerivedState = this.deriveStateFromScore(nextScore);
    const candidateState = targetState
      ? this.resolveHighestState(scoreDerivedState, targetState)
      : scoreDerivedState;

    const nextState = this.resolveHighestState(currentState, candidateState);

    return {
      nextState,
      nextScore,
    };
  }
}
