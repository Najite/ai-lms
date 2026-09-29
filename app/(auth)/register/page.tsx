import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Enroll & Register | AI-Native Academy",
  description: "Create an identity to begin the AI-Native Software Engineering Academy curriculum.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
