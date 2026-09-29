import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { LessonItem } from "@/features/learning/components/lesson-item";
import { ProgressBar } from "@/features/learning/components/progress-bar";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface ModuleDetailPageProps {
  params: Promise<{
    pathSlug: string;
    moduleSlug: string;
  }>;
}

export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { pathSlug, moduleSlug } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const learningService = new LearningService(supabase);
  const result = await learningService.getModuleDetail(pathSlug, moduleSlug, user?.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const { path, module } = result.data;
  const metrics = module.metrics || {
    totalLessons: module.lessons.length,
    completedLessons: 0,
    inProgressLessons: 0,
    notStartedLessons: module.lessons.length,
    percentage: 0,
    isCompleted: false,
    isStarted: false,
  };

  const firstLesson = module.lessons[0];

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
                { label: path.title, href: `/learning-paths/${path.slug}` },
                { label: module.title },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Module Overview Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-card via-card/70 to-card/40 border border-border/70 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Module {module.orderIndex}
              </Badge>
              {metrics.isCompleted && (
                <Badge variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Module Completed</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {module.estimatedMinutes} Minutes
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                {module.lessons.length} Lessons
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {module.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Module Progress */}
          <div className="pt-4 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Module Progress</span>
              <span className="font-semibold text-foreground">
                {metrics.completedLessons}/{metrics.totalLessons} Lessons ({metrics.percentage}%)
              </span>
            </div>
            <ProgressBar percentage={metrics.percentage} size="md" />
          </div>
        </section>

        {/* Lessons List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Lessons in this Module
            </h2>
            {firstLesson && (
              <Button asChild size="sm" variant="default" className="gap-1.5">
                <Link
                  href={`/learning-paths/${path.slug}/modules/${module.slug}/lessons/${firstLesson.slug}`}
                >
                  <span>{metrics.isStarted ? "Resume Lesson" : "Start First Lesson"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>

          <div className="space-y-2.5">
            {module.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                pathSlug={path.slug}
                moduleSlug={module.slug}
              />
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-4 flex justify-between items-center border-t border-border/40">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href={`/learning-paths/${path.slug}`}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Path Overview</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
