"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseWorkspace } from "./exercise-workspace";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";

export interface ExerciseDetailPageProps {
  slug: string;
}

export function ExerciseDetailPage({ slug }: ExerciseDetailPageProps) {
  return (
    <div className="space-y-6">
      {/* Header Navigation Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1 font-mono">
            <Link href="/exercises">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Exercises</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-border/60" />
          <LearningBreadcrumbs
            items={[
              { label: "Exercises", href: "/exercises" },
              { label: slug },
            ]}
          />
        </div>

        <Button asChild variant="outline" size="sm" className="h-8 text-xs font-mono gap-1.5">
          <Link href="/exercises/history">
            <History className="h-3.5 w-3.5" />
            <span>Audit History</span>
          </Link>
        </Button>
      </div>

      {/* Main Workspace */}
      <ExerciseWorkspace slug={slug} />
    </div>
  );
}
