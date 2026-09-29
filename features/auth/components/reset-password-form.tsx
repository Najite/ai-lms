"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas";
import { authService } from "../services/auth-service";
import { AuthCard } from "./auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    const result = await authService.resetPasswordForEmail(data);

    if (!result.success) {
      setServerError(result.error || "Failed to send reset link.");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthCard
        title="Recovery Email Sent"
        description="Check your inbox for a secure password reset link"
        badgeText="Security"
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
            If an account is associated with this email, a one-time cryptographic reset token has been dispatched.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email to receive a secure recovery token"
      badgeText="Identity Recovery"
      footer={
        <div>
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to Sign In
          </Link>
        </div>
      }
    >
      {serverError && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive font-medium mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-foreground">
            Account Email
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

        <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Sending Token...</span>
            </>
          ) : (
            <span>Send Reset Instructions</span>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
