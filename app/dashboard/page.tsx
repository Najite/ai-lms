import * as React from "react";
import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard // AI-Native Software Engineer Platform",
  description: "Interactive learning workspace, real-time code editor, and curriculum tracker.",
};

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#010102] flex items-center justify-center text-[#8a8f98] font-mono text-xs">
          Loading learning dashboard...
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}
