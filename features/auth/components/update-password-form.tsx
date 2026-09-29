"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema, type UpdatePasswordInput } from "../schemas";
import { authService } from "../services/auth-service";
import { AuthCard } from "./auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password", defaultValue: "" }) || "";
  const hasLength = passwordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: UpdatePasswordInput) => {
    setServerError(null);
    const result = await authService.updatePassword(data);

    if (!result.success) {
      setServerError(result.error || "Failed to update password.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthCard
      title="Set New Password"
      description="Create a secure new password for your Academy workstation identity"
      badgeText="Security Update"
    >
      {serverError && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 border border-destructive/30 p-3 text-xs text-destructive font-medium mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-foreground">
            New Master Password
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
            Confirm New Password
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

        <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Save New Password</span>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
