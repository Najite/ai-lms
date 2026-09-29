"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas";
import { authService } from "../services/auth-service";
import { AuthCard } from "./auth-card";
import { OAuthButtons } from "./oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";

export interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await authService.signInWithPassword(data);

    if (!result.success) {
      setServerError(result.error || "Invalid email or password.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Enter your engineering credentials to access your Command Center"
      badgeText="Authentication"
      footer={
        <div className="space-y-2">
          <div>
            Don&apos;t have an academy account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </div>
          <div>
            <Link href="/reset-password" className="text-muted-foreground hover:text-foreground transition-colors">
              Forgot your password?
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <OAuthButtons onError={(err) => setServerError(err)} />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-border/60 w-full" />
          <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
            Or continue with email
          </span>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="engineer@academy.internal"
              autoComplete="email"
              disabled={isSubmitting}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("email")}
            />
            {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-foreground">
                Password
              </label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("password")}
            />
            {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                className="rounded border-border bg-transparent text-primary focus:ring-primary"
                {...register("rememberMe")}
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Studio</span>
            )}
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
