import { describe, it, expect, beforeEach } from "vitest";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  useAuthStore,
} from "@/features/auth";
import type { AuthUser, AuthSession } from "@/features/auth";

describe("Auth Validation Schemas", () => {
  describe("loginSchema", () => {
    it("validates correct login credentials", () => {
      const valid = { email: "engineer@academy.internal", password: "Password123" };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email and empty password", () => {
      const invalid = { email: "not-an-email", password: "" };
      const result = loginSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe("registerSchema", () => {
    it("validates valid registration payload", () => {
      const valid = {
        fullName: "Grace Hopper",
        email: "grace@navy.mil",
        password: "ValidPassword1",
        confirmPassword: "ValidPassword1",
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const invalid = {
        fullName: "Alan Turing",
        email: "alan@bletchley.uk",
        password: "Password123",
        confirmPassword: "DifferentPassword123",
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.includes("confirmPassword"));
        expect(issue?.message).toBe("Passwords do not match");
      }
    });

    it("rejects weak passwords lacking numbers or uppercase", () => {
      const invalid = {
        fullName: "Test User",
        email: "test@academy.org",
        password: "weakpassword",
        confirmPassword: "weakpassword",
        termsAccepted: true,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects unaccepted terms and conditions", () => {
      const invalid = {
        fullName: "Test User",
        email: "test@academy.org",
        password: "Password123",
        confirmPassword: "Password123",
        termsAccepted: false,
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema & updatePasswordSchema", () => {
    it("validates reset email", () => {
      expect(resetPasswordSchema.safeParse({ email: "dev@academy.org" }).success).toBe(true);
      expect(resetPasswordSchema.safeParse({ email: "not-email" }).success).toBe(false);
    });

    it("validates new password update matching", () => {
      const valid = { password: "NewStrongPassword1", confirmPassword: "NewStrongPassword1" };
      expect(updatePasswordSchema.safeParse(valid).success).toBe(true);

      const mismatch = { password: "NewStrongPassword1", confirmPassword: "MismatchedPassword1" };
      expect(updatePasswordSchema.safeParse(mismatch).success).toBe(false);
    });
  });
});

describe("Zustand Auth Store", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it("initializes in logged-out loading state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets user and updates isAuthenticated state", () => {
    const mockUser: AuthUser = {
      id: "usr-123",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: "engineer@academy.internal",
      profile: {
        id: "usr-123",
        email: "engineer@academy.internal",
        fullName: "Claude Shannon",
        username: "shannon",
        avatarUrl: null,
        role: "learner",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("sets session and extracts user", () => {
    const mockSession = {
      access_token: "mock-token",
      refresh_token: "mock-refresh",
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: "usr-456",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        email: "hopper@academy.internal",
      },
    } as AuthSession;

    useAuthStore.getState().setSession(mockSession);
    const state = useAuthStore.getState();
    expect(state.session).toEqual(mockSession);
    expect(state.user?.id).toBe("usr-456");
    expect(state.isAuthenticated).toBe(true);
  });

  it("resets state on logout", () => {
    useAuthStore.getState().setUser({ id: "usr-999" } as AuthUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().reset();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
