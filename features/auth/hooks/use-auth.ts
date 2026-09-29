"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "../stores/use-auth-store";
import { authService } from "../services/auth-service";

export function useAuth() {
  const { user, session, isLoading, isAuthenticated, setUser, setSession, setLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // 1. Fetch current active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        authService.getProfile(session.user.id).then((profile) => {
          setUser({ ...session.user, profile });
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await authService.getProfile(session.user.id);
        setUser({ ...session.user, profile });
      } else {
        reset();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, reset]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    signOut: authService.signOut.bind(authService),
  };
}
