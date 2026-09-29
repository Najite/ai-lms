import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExerciseService } from "@/features/exercises/services/exercise-service";
import { ExerciseWorkspace } from "@/features/exercises/components/exercise-workspace";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

interface ExerciseWorkspacePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ExerciseWorkspacePage({
  params,
}: ExerciseWorkspacePageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = new ExerciseService(supabase);
  const result = await service.getExerciseDetail(slug, user?.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { exercise } = result.data;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-base font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
              {siteConfig.shortName}
            </span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-border/60" />
          <div className="hidden sm:block">
            <LearningBreadcrumbs
              items={[
                { label: "Exercises", href: "/exercises" },
                { label: exercise.category?.name || "Category" },
                { label: exercise.title },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5 font-mono"
          >
            <Link href="/exercises/history">
              <History className="h-3.5 w-3.5" />
              <span>History</span>
            </Link>
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* Main Interactive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <ExerciseWorkspace slug={slug} />
      </main>
    </div>
  );
}
