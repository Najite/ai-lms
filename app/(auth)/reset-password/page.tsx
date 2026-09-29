import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password | AI-Native Academy",
  description: "Recover access to your AI-Native Academy account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
