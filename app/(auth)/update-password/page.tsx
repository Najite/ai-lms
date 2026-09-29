import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Update Password | AI-Native Academy",
  description: "Set a new master password for your account.",
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
