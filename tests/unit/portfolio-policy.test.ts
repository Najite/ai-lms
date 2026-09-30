import { describe, it, expect } from "vitest";
import { PortfolioPolicy, PolicyUser } from "@/domains/portfolio/policies/portfolio-policy";

describe("Portfolio Domain Policy & Authorization", () => {
  const learnerA: PolicyUser = { id: "user-111", role: "learner" };
  const learnerB: PolicyUser = { id: "user-222", role: "learner" };
  const instructor: PolicyUser = { id: "user-333", role: "instructor" };
  const admin: PolicyUser = { id: "user-444", role: "admin" };

  describe("canViewPortfolio", () => {
    it("allows a learner to view their own portfolio", () => {
      expect(PortfolioPolicy.canViewPortfolio(learnerA, "user-111")).toBe(true);
    });

    it("forbids a learner from viewing another learner's portfolio", () => {
      expect(PortfolioPolicy.canViewPortfolio(learnerA, "user-222")).toBe(false);
      expect(PortfolioPolicy.canViewPortfolio(learnerB, "user-111")).toBe(false);
    });

    it("allows instructors to view any learner's portfolio", () => {
      expect(PortfolioPolicy.canViewPortfolio(instructor, "user-111")).toBe(true);
      expect(PortfolioPolicy.canViewPortfolio(instructor, "user-222")).toBe(true);
    });

    it("allows admins to view any learner's portfolio", () => {
      expect(PortfolioPolicy.canViewPortfolio(admin, "user-111")).toBe(true);
      expect(PortfolioPolicy.canViewPortfolio(admin, "user-222")).toBe(true);
    });
  });

  describe("canManagePortfolio", () => {
    it("allows a learner to manage their own portfolio", () => {
      expect(PortfolioPolicy.canManagePortfolio(learnerA, "user-111")).toBe(true);
    });

    it("forbids a learner from managing another user's portfolio", () => {
      expect(PortfolioPolicy.canManagePortfolio(learnerA, "user-222")).toBe(false);
    });

    it("allows admins to manage any portfolio", () => {
      expect(PortfolioPolicy.canManagePortfolio(admin, "user-111")).toBe(true);
    });
  });

  describe("canDeletePortfolioItem", () => {
    it("allows a learner to delete their own portfolio items", () => {
      expect(PortfolioPolicy.canDeletePortfolioItem(learnerA, "user-111")).toBe(true);
    });

    it("forbids a learner from deleting another user's portfolio items", () => {
      expect(PortfolioPolicy.canDeletePortfolioItem(learnerA, "user-222")).toBe(false);
    });

    it("allows admins to delete portfolio items", () => {
      expect(PortfolioPolicy.canDeletePortfolioItem(admin, "user-111")).toBe(true);
    });
  });
});
