"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, User, Loader2 } from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
          Sign In
        </Button>
        <Button variant="default" size="sm" onClick={() => router.push("/register")}>
          Register
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    router.push("/login");
    router.refresh();
  };

  const displayName = user.profile?.fullName || user.email?.split("@")[0] || "Engineer";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const role = user.profile?.role || "learner";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary font-mono">
          {initials || <User className="h-4 w-4" />}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-foreground">{displayName}</span>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 uppercase">
              {role}
            </Badge>
          </div>
          <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{user.email}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        title="Sign Out"
        disabled={isSigningOut}
        onClick={handleSignOut}
      >
        {isSigningOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      </Button>
    </div>
  );
}
