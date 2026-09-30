import type { CapstoneState } from "../models";

export interface PolicyUser {
  id: string;
  role: "learner" | "instructor" | "admin";
}

export class CapstonePolicy {
  /**
   * Validates state transitions in the Capstone finite state machine
   */
  public static canTransition(from: CapstoneState, to: CapstoneState): boolean {
    if (from === to) return true;

    // Terminal state protection: COMPLETED cannot transition to any other state
    if (from === "completed") {
      return false;
    }

    switch (from) {
      case "locked":
        return to === "available";

      case "available":
        return to === "in_progress";

      case "in_progress":
        return to === "submitted";

      case "submitted":
        return to === "under_review" || to === "approved" || to === "in_progress";

      case "under_review":
        return to === "approved" || to === "in_progress";

      case "approved":
        return to === "completed";

      default:
        return false;
    }
  }

  /**
   * Evaluates if a user can view a capstone
   */
  public static canViewCapstone(user: PolicyUser): boolean {
    return !!user;
  }

  /**
   * Evaluates if a user can start a capstone attempt
   */
  public static canStartCapstone(
    user: PolicyUser,
    targetUserId: string,
    currentState: CapstoneState,
    allPrerequisitesMet: boolean
  ): boolean {
    if (user.role === "admin") return true;
    if (user.id !== targetUserId) return false;
    if (!allPrerequisitesMet) return false;
    return currentState === "available";
  }

  /**
   * Evaluates if a user can submit deliverables for a capstone
   */
  public static canSubmitCapstone(
    user: PolicyUser,
    targetUserId: string,
    currentState: CapstoneState
  ): boolean {
    if (user.role === "admin") return true;
    if (user.id !== targetUserId) return false;
    return currentState === "in_progress" || currentState === "submitted";
  }

  /**
   * Evaluates if a user can review a capstone submission
   */
  public static canReviewCapstone(user: PolicyUser): boolean {
    return user.role === "admin" || user.role === "instructor";
  }

  /**
   * Evaluates if a user can complete a capstone
   */
  public static canCompleteCapstone(
    user: PolicyUser,
    targetUserId: string,
    currentState: CapstoneState,
    allDeliverablesSatisfied: boolean
  ): boolean {
    if (!allDeliverablesSatisfied) return false;
    if (user.role === "admin" || user.role === "instructor") return true;
    if (user.id !== targetUserId) return false;
    return currentState === "approved" || currentState === "in_progress";
  }
}
