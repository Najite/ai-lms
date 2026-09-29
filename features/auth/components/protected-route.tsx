"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import type { UserRole } from "../types";
import { Loader2 } from "lucide-react";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-mono">Verifying authentication token...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.profile?.role || "learner";
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="flex min-h-[60vh] w-full items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-2">
            <h2 className="text-lg font-bold text-destructive">Access Restricted</h2>
            <p className="text-xs text-muted-foreground">
              Your account role ({userRole}) does not have permission to view this section.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
