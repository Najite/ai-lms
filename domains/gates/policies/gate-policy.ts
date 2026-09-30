import type { GateStatus } from "../models";
import { VALID_GATE_TRANSITIONS } from "../models";

export interface UserContext {
  id: string;
  role: "learner" | "instructor" | "admin" | "auditor";
}

export class GatePolicy {
  /**
   * Evaluates if a state transition is permitted by the state machine
   */
  public static canTransition(currentStatus: GateStatus, nextStatus: GateStatus): boolean {
    if (currentStatus === nextStatus) return true;
    const allowed = VALID_GATE_TRANSITIONS[currentStatus];
    return allowed ? allowed.includes(nextStatus) : false;
  }

  /**
   * Learner can view gate details
   */
  public static canViewGate(user?: UserContext | null): boolean {
    return !!user;
  }

  /**
   * Learner can view their own gate progress and history
   */
  public static canViewProgress(user: UserContext, targetUserId: string): boolean {
    if (user.role === "admin" || user.role === "auditor" || user.role === "instructor") {
      return true;
    }
    return user.id === targetUserId;
  }

  /**
   * Learner can start an attempt only if gate is 'available' or 'in_progress'
   */
  public static canStartAttempt(
    user: UserContext,
    targetUserId: string,
    currentGateStatus: GateStatus
  ): boolean {
    if (user.id !== targetUserId && user.role !== "admin") {
      return false;
    }
    return currentGateStatus === "available" || currentGateStatus === "in_progress";
  }

  /**
   * Learner can submit evidence for an active attempt
   */
  public static canSubmitEvidence(
    user: UserContext,
    targetUserId: string,
    currentGateStatus: GateStatus
  ): boolean {
    if (user.id !== targetUserId && user.role !== "admin") {
      return false;
    }
    return currentGateStatus === "in_progress" || currentGateStatus === "available";
  }

  /**
   * Only instructors, admins, or automated verification systems can validate gates
   */
  public static canValidateGate(user: UserContext): boolean {
    return user.role === "admin" || user.role === "instructor" || user.role === "auditor";
  }

  /**
   * Only administrators can create or modify gate definitions
   */
  public static canManageGateDefinitions(user: UserContext): boolean {
    return user.role === "admin";
  }
}
