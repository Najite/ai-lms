import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { ModuleCard } from "@/features/learning/components/module-card";
import { ProgressBar } from "@/features/learning/components/progress-bar";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface LearningPathDetailPageProps {
  params: Promise<{
    pathSlug: string;
  }>;
}

export default async function LearningPathDetailPage({ params }: LearningPathDetailPageProps) {
  const { pathSlug } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const learningService = new LearningService(supabase);
  const result = await learningService.getLearningPathDetail(pathSlug, user?.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const path = result.data;
  const metrics = path.metrics || {
    totalLessons: 0,
    completedLessons: 0,
    inProgressLessons: 0,
    notStartedLessons: 0,
    percentage: 0,
    isCompleted: false,
    isStarted: false,
  };

  const difficultyVariants = {
    beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

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
                { label: "Learning Paths", href: "/learning-paths" },
                { label: path.title },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Path Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-card via-card/70 to-card/40 border border-border/70 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className={cn("capitalize font-semibold text-xs px-2.5 py-0.5", difficultyVariants[path.difficulty])}
              >
                {path.difficulty}
              </Badge>
              {metrics.isCompleted && (
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Path Mastered</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {path.estimatedHours} Hours
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                {metrics.totalLessons} Lessons
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {path.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
              {path.description}
            </p>
          </div>

          {/* Progress Bar Section */}
          <div className="pt-4 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Overall Path Progress</span>
              <span className="font-semibold text-foreground">
                {metrics.completedLessons}/{metrics.totalLessons} Lessons ({metrics.percentage}%)
              </span>
            </div>
            <ProgressBar percentage={metrics.percentage} size="md" />
          </div>
        </section>

        {/* Modules List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>Curriculum Modules</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {path.modules.length} {path.modules.length === 1 ? "Module" : "Modules"}
            </span>
          </div>

          <div className="space-y-6">
            {path.modules.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                pathSlug={path.slug}
                showLessons={true}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
