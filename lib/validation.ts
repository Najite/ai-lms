import { z } from "zod";
import { ValidationError } from "@/lib/errors/app-error";

export type ValidationResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Record<string, string[]> };

/**
 * Validates data against a Zod schema and returns a typed result object.
 */
export function validateData<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const formattedErrors: Record<string, string[]> = {};
  const issues = result.error.issues;

  for (const issue of issues) {
    const path = issue.path.join(".") || "_global";
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(issue.message);
  }

  return { success: false, error: formattedErrors };
}

/**
 * Validates data and throws a structured ValidationError if validation fails.
 */
export function assertValidData<T>(schema: z.ZodType<T>, data: unknown, context?: string): T {
  const result = validateData(schema, data);
  if (!result.success) {
    throw new ValidationError(
      context ? `Validation failed for ${context}` : "Validation failed",
      result.error
    );
  }
  return result.data;
}
