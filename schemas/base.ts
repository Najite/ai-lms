import { z } from "zod";

/**
 * Base Primitive Validation Schemas
 */

export const idSchema = z.string().uuid("Invalid UUID format");

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug cannot be empty")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.string().email("Invalid email address"));

export const isoDateTimeSchema = z.string().datetime({ message: "Invalid ISO 8601 datetime format" });

export const semverSchema = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
    "Invalid Semantic Version format (e.g. 1.0.0)"
  );

/**
 * Base Pagination Query Schema
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * Base Paginated Response Schema Builder
 */
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
  });
}
