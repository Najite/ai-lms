import { z } from "zod";

export const CreateProjectFormSchema = z.object({
  title: z.string().min(2, "Project title must be at least 2 characters").max(200),
  description: z.string().max(3000).optional(),
  projectType: z.string().min(1).default("production_app"),
  status: z.enum(["in_progress", "completed", "archived"]).default("completed"),
});

export type CreateProjectFormValues = z.infer<typeof CreateProjectFormSchema>;
