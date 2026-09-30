export interface UserContext {
  id: string;
  role?: string | null;
}

/**
 * Authorization Policy for Achievement & XP Domain
 * Enforces least privilege:
 * - Learners can view achievements, their own XP balances, transactions, and earned achievements/evidence.
 * - Learners cannot directly award achievements, insert arbitrary XP, or modify XP balances.
 * - Admins can manage achievement definitions and audit logs.
 */
export class AchievementPolicy {
  /**
   * Evaluates if the user can read achievement definitions
   */
  public static canReadAchievements(user?: UserContext | null): boolean {
    return user !== undefined ? true : true; // Public catalogue
  }

  /**
   * Evaluates if the user can view personal XP balance and transaction ledger
   */
  public static canViewXP(user: UserContext | null | undefined, targetUserId: string): boolean {
    if (!user || !user.id) return false;
    if (user.id === targetUserId) return true;
    return user.role === "admin" || user.role === "instructor";
  }

  /**
   * Evaluates if the user can view achievement progress
   */
  public static canViewProgress(user: UserContext | null | undefined, targetUserId: string): boolean {
    if (!user || !user.id) return false;
    if (user.id === targetUserId) return true;
    return user.role === "admin" || user.role === "instructor";
  }

  /**
   * Evaluates if the user can view achievement awards and evidence
   */
  public static canViewAwards(user: UserContext | null | undefined, targetUserId: string): boolean {
    if (!user || !user.id) return false;
    if (user.id === targetUserId) return true;
    return user.role === "admin" || user.role === "instructor";
  }

  /**
   * Evaluates if the user can manage achievement catalog definitions
   */
  public static canManageAchievements(user: UserContext | null | undefined): boolean {
    return user?.role === "admin";
  }
}
