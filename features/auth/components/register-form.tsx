"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "../schemas";
import { authService } from "../services/auth-service";
import { AuthCard } from "./auth-card";
import { OAuthButtons } from "./oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: true,
    },
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" }) || "";

  const hasLength = passwordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const result = await authService.signUp(data);

    if (!result.success) {
      setServerError(result.error || "Failed to create academy account.");
      return;
    }

    if (result.data?.requiresConfirmation) {
      setIsSuccess(true);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  if (isSuccess) {
    return (
      <AuthCard
        title="Check Your Email"
        description="We sent an activation link to complete your enrollment"
        badgeText="Verification Required"
        footer={
          <Link href="/login" className="font-medium text-primary hover:underline">
            Return to Sign In
          </Link>
        }
      >
        <div className="text-center py-4 space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs text-muted-foreground">
            Click the confirmation link sent to your email to verify your cryptographic identity and initialize your developer workstation.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create Academy Account"
      description="Initialize your identity for the AI-Native Software Engineering Academy"
      badgeText="New Candidate"
      footer={
        <div>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        <OAuthButtons onError={(err) => setServerError(err)} />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-border/60 w-full" />
          <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
            Or register with email
          </span>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-medium text-foreground">
              Full Legal Name
            </label>
            <Input
              id="fullName"
              placeholder="Ada Lovelace"
              autoComplete="name"
              disabled={isSubmitting}
              className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("fullName")}
            />
            {errors.fullName && <p className="text-[11px] text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              Work / Primary Email
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
            <label htmlFor="password" className="text-xs font-medium text-foreground">
              Master Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("password")}
            />
            {errors.password && <p className="text-[11px] text-destructive">{errors.password.message}</p>}

            {/* Password strength indicators */}
            {passwordValue.length > 0 && (
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                <div className={`flex items-center gap-1 ${hasLength ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasLength ? "bg-emerald-400" : "bg-muted"}`} />
                  8+ characters
                </div>
                <div className={`flex items-center gap-1 ${hasUpper ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasUpper ? "bg-emerald-400" : "bg-muted"}`} />
                  Uppercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasLower ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasLower ? "bg-emerald-400" : "bg-muted"}`} />
                  Lowercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? "text-emerald-400" : "text-muted-foreground"}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasNumber ? "bg-emerald-400" : "bg-muted"}`} />
                  Number (0-9)
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-border bg-transparent text-primary focus:ring-primary"
                {...register("termsAccepted")}
              />
              <span>
                I agree to the Academy Code of Conduct, Honor Code, and Autonomous Learning Constitution.
              </span>
            </label>
            {errors.termsAccepted && <p className="text-[11px] text-destructive">{errors.termsAccepted.message}</p>}
          </div>

          <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Initializing Identity...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
