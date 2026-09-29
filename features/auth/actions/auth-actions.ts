"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, resetPasswordSchema, updatePasswordSchema } from "../schemas";
import type { AuthResponse } from "../types";
import { logger } from "@/lib/logger";

/**
 * Server action to log in with email and password
 */
export async function loginAction(formData: unknown): Promise<AuthResponse<void>> {
  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "global";
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { success: false, errors: fieldErrors };
  }

  const { email, password } = result.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    logger.warn("Server action login failed", { email }, error);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Server action to register a new user
 */
export async function registerAction(formData: unknown): Promise<AuthResponse<{ requiresConfirmation: boolean }>> {
  const result = registerSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "global";
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { success: false, errors: fieldErrors };
  }

  const { email, password, fullName } = result.data;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "learner",
      },
    },
  });

  if (error) {
    logger.warn("Server action registration failed", { email }, error);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    data: {
      requiresConfirmation: !data.session,
    },
  };
}

/**
 * Server action to log out current user
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Server action to request a password reset email
 */
export async function resetPasswordAction(formData: unknown): Promise<AuthResponse<void>> {
  const result = resetPasswordSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const { email } = result.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Server action to update user password
 */
export async function updatePasswordAction(formData: unknown): Promise<AuthResponse<void>> {
  const result = updatePasswordSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "global";
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { success: false, errors: fieldErrors };
  }

  const { password } = result.data;
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
