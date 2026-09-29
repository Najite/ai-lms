import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | AI-Native Academy",
  description: "Secure cryptographic identity and session management for the AI-Native Software Engineering Academy.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-gradient-to-b from-background via-background/95 to-card relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full relative z-10">{children}</div>
    </div>
  );
}
