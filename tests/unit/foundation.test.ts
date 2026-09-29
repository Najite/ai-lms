import { describe, it, expect, beforeEach } from "vitest";
import { cn, safeJsonParse } from "@/lib/utils";
import { AppError, DomainError, NotFoundError, ValidationError } from "@/lib/errors/app-error";
import { validateData, assertValidData } from "@/lib/validation";
import { idSchema, emailSchema, semverSchema, paginationQuerySchema } from "@/schemas/base";
import { useUIStore } from "@/stores/use-ui-store";

describe("Core Foundation Utilities", () => {
  it("cn correctly merges Tailwind classes and resolves conflicts", () => {
    expect(cn("px-2 py-1", "bg-red-500", "px-4")).toBe("py-1 bg-red-500 px-4");
    expect(cn("text-sm", false && "hidden", undefined, "font-bold")).toBe("text-sm font-bold");
  });

  it("safeJsonParse handles valid and invalid JSON safely", () => {
    expect(safeJsonParse('{"key":"value"}', {})).toEqual({ key: "value" });
    expect(safeJsonParse("invalid-json", { fallback: true })).toEqual({ fallback: true });
    expect(safeJsonParse(null, "default")).toBe("default");
  });
});

describe("Structured Error Classes", () => {
  it("creates structured DomainError with correct status and serialization", () => {
    const error = new DomainError("Operation rejected", { reason: "limit_exceeded" });
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.errorCode).toBe("DOMAIN_ERROR");
    expect(error.isOperational).toBe(true);
    expect(error.toJSON()).toMatchObject({
      message: "Operation rejected",
      statusCode: 400,
      errorCode: "DOMAIN_ERROR",
      isOperational: true,
      details: { reason: "limit_exceeded" },
    });
  });

  it("creates NotFoundError with entity and identifier", () => {
    const error = new NotFoundError("Lesson", "uuid-123");
    expect(error.statusCode).toBe(404);
    expect(error.errorCode).toBe("NOT_FOUND");
    expect(error.message).toContain("Lesson with identifier 'uuid-123' was not found");
  });

  it("creates ValidationError with structured issue map", () => {
    const error = new ValidationError("Invalid payload", { email: ["Invalid email"] });
    expect(error.statusCode).toBe(422);
    expect(error.errorCode).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual({ email: ["Invalid email"] });
  });
});

describe("Zod Base Validation Schemas", () => {
  it("validates UUID schema", () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(idSchema.safeParse(validUuid).success).toBe(true);
    expect(idSchema.safeParse("not-a-uuid").success).toBe(false);
  });

  it("validates email schema and normalizes casing", () => {
    const result = emailSchema.safeParse("  Engineer@Academy.Internal ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("engineer@academy.internal");
    }
  });

  it("validates SemVer schema", () => {
    expect(semverSchema.safeParse("1.0.0").success).toBe(true);
    expect(semverSchema.safeParse("2.14.3-beta.1").success).toBe(true);
    expect(semverSchema.safeParse("invalid.version").success).toBe(false);
  });

  it("validates and defaults pagination parameters", () => {
    const result = paginationQuerySchema.parse({});
    expect(result).toEqual({
      page: 1,
      limit: 20,
      sortOrder: "asc",
    });
  });

  it("validateData and assertValidData handle valid and invalid inputs", () => {
    const resValid = validateData(emailSchema, "dev@academy.org");
    expect(resValid.success).toBe(true);

    const resInvalid = validateData(emailSchema, "invalid-email");
    expect(resInvalid.success).toBe(false);
    expect(resInvalid.error).toHaveProperty("_global");

    expect(() => assertValidData(emailSchema, "invalid-email", "UserEmail")).toThrow(ValidationError);
  });
});

describe("Foundational UI Zustand Store", () => {
  beforeEach(() => {
    useUIStore.setState({
      theme: "dark",
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      _hasHydrated: true,
    });
  });

  it("toggles sidebar state", () => {
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
  });

  it("updates theme mode", () => {
    expect(useUIStore.getState().theme).toBe("dark");
    useUIStore.getState().setTheme("light");
    expect(useUIStore.getState().theme).toBe("light");
  });

  it("toggles command palette", () => {
    expect(useUIStore.getState().commandPaletteOpen).toBe(false);
    useUIStore.getState().setCommandPaletteOpen(true);
    expect(useUIStore.getState().commandPaletteOpen).toBe(true);
  });
});
