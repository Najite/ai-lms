import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { LearningPathCard } from "@/features/learning/components/learning-path-card";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Compass, BookOpen, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function LearningPathsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const learningService = new LearningService(supabase);
  const result = await learningService.getLearningPaths(user?.id);
  const paths = result.success && result.data ? result.data : [];

  const totalLessonsAcrossAllPaths = paths.reduce(
    (acc, p) => acc + (p.metrics?.totalLessons || 0),
    0
  );
  const completedLessonsAcrossAllPaths = paths.reduce(
    (acc, p) => acc + (p.metrics?.completedLessons || 0),
    0
  );

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
            <LearningBreadcrumbs items={[{ label: "Learning Paths" }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-border/70 p-6 md:p-8">
          <div className="relative z-10 max-w-2xl space-y-3">
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              <Compass className="w-3.5 h-3.5 mr-1 text-primary" />
              Curriculum Core
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              AI-Native Software Engineering Paths
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore structured, specification-driven learning paths crafted to transform classical engineers into high-leverage AI-Native systems architects.
            </p>
          </div>

          {/* Quick Metrics */}
          {user && totalLessonsAcrossAllPaths > 0 && (
            <div className="mt-6 pt-6 border-t border-border/40 flex items-center gap-6 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>
                  {completedLessonsAcrossAllPaths}/{totalLessonsAcrossAllPaths} Total Lessons Completed
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Paths Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>Available Learning Paths</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {paths.length} {paths.length === 1 ? "Path" : "Paths"} Available
            </span>
          </div>

          {paths.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/20">
              <Compass className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">No Published Paths</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Learning paths are currently being curated. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paths.map((path) => (
                <LearningPathCard key={path.id} path={path} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
