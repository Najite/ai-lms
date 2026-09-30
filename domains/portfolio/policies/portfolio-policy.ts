export interface PolicyUser {
  id: string;
  role: "learner" | "instructor" | "admin";
}

export class PortfolioPolicy {
  /**
   * Evaluates if a user can view a given portfolio
   * Learners can view their own portfolio; Instructors and Admins can view any portfolio
   */
  public static canViewPortfolio(user: PolicyUser, portfolioOwnerId: string): boolean {
    if (user.role === "admin" || user.role === "instructor") {
      return true;
    }
    return user.id === portfolioOwnerId;
  }

  /**
   * Evaluates if a user can modify a given portfolio or add projects/artifacts
   */
  public static canManagePortfolio(user: PolicyUser, portfolioOwnerId: string): boolean {
    if (user.role === "admin") {
      return true;
    }
    return user.id === portfolioOwnerId;
  }

  /**
   * Evaluates if a user can delete projects or portfolio items
   */
  public static canDeletePortfolioItem(user: PolicyUser, portfolioOwnerId: string): boolean {
    if (user.role === "admin") {
      return true;
    }
    return user.id === portfolioOwnerId;
  }
}
