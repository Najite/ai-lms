"use client";

import { useAuthStore } from "../stores/use-auth-store";

export function useUser() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const role = user?.profile?.role || "learner";

  return {
    user,
    profile: user?.profile ?? null,
    role,
    isLoading,
    isLearner: role === "learner",
    isInstructor: role === "instructor",
    isAdmin: role === "admin",
    isAuditor: role === "auditor",
  };
}
