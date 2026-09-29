import type { User as SupabaseUser, Session as SupabaseSession } from "@supabase/supabase-js";

/**
 * User Roles in the AI-Native Academy
 */
export type UserRole = "learner" | "instructor" | "admin" | "auditor";

/**
 * Core User Profile Entity
 */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Extended Auth User combining Supabase User with Academy Profile
 */
export interface AuthUser extends SupabaseUser {
  profile?: UserProfile | null;
}

/**
 * Auth Session Representation
 */
export type AuthSession = SupabaseSession;

/**
 * Supported OAuth Providers
 */
export type OAuthProvider = "github" | "google";

/**
 * Auth Response Object
 */
export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
