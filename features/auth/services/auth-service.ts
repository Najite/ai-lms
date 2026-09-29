import { createClient } from "@/lib/supabase/client";
import type { OAuthProvider, AuthResponse, UserProfile, AuthUser } from "../types";
import type { LoginInput, RegisterInput, ResetPasswordInput, UpdatePasswordInput } from "../schemas";
import { logger } from "@/lib/logger";

export class AuthService {
  private getClient() {
    return createClient();
  }

  /**
   * Signs in a user with email and password
   */
  public async signInWithPassword(input: LoginInput): Promise<AuthResponse<{ user: AuthUser }>> {
    try {
      const supabase = this.getClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        logger.warn("Authentication failed for user", { email: input.email }, error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: "User authentication returned empty profile." };
      }

      const profile = await this.getProfile(data.user.id);

      return {
        success: true,
        data: {
          user: {
            ...data.user,
            profile,
          },
        },
      };
    } catch (err) {
      logger.error("Unexpected error during signInWithPassword", err);
      return { success: false, error: "An unexpected authentication error occurred." };
    }
  }

  /**
   * Registers a new user with email and password
   */
  public async signUp(input: RegisterInput): Promise<AuthResponse<{ user: AuthUser; requiresConfirmation: boolean }>> {
    try {
      const supabase = this.getClient();
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            role: "learner",
          },
        },
      });

      if (error) {
        logger.warn("Registration failed for user", { email: input.email }, error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: "User registration returned empty profile." };
      }

      return {
        success: true,
        data: {
          user: data.user,
          requiresConfirmation: !data.session,
        },
      };
    } catch (err) {
      logger.error("Unexpected error during signUp", err);
      return { success: false, error: "An unexpected registration error occurred." };
    }
  }

  /**
   * Initiates OAuth login via GitHub or Google
   */
  public async signInWithOAuth(provider: OAuthProvider, redirectTo?: string): Promise<AuthResponse<{ url: string }>> {
    try {
      const supabase = this.getClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const callbackUrl = redirectTo || `${origin}/api/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl,
          scopes: provider === "github" ? "read:user user:email" : undefined,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: { url: data.url } };
    } catch (err) {
      logger.error(`Unexpected error during signInWithOAuth for ${provider}`, err);
      return { success: false, error: `Failed to initiate ${provider} authentication.` };
    }
  }

  /**
   * Requests a password reset email
   */
  public async resetPasswordForEmail(input: ResetPasswordInput): Promise<AuthResponse<void>> {
    try {
      const supabase = this.getClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      logger.error("Unexpected error during resetPasswordForEmail", err);
      return { success: false, error: "Failed to send password reset email." };
    }
  }

  /**
   * Updates user password
   */
  public async updatePassword(input: UpdatePasswordInput): Promise<AuthResponse<void>> {
    try {
      const supabase = this.getClient();
      const { error } = await supabase.auth.updateUser({
        password: input.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      logger.error("Unexpected error during updatePassword", err);
      return { success: false, error: "Failed to update password." };
    }
  }

  /**
   * Signs out the current user session
   */
  public async signOut(): Promise<AuthResponse<void>> {
    try {
      const supabase = this.getClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      logger.error("Unexpected error during signOut", err);
      return { success: false, error: "Failed to sign out." };
    }
  }

  /**
   * Fetches user profile from database with strict typing
   */
  public async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = this.getClient();
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        username: data.username,
        avatarUrl: data.avatar_url,
        role: data.role,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
