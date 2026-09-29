import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ExerciseService } from "@/features/exercises/services/exercise-service";
import { ExerciseCard } from "@/features/exercises/components/exercise-card";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Terminal,
  History,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ExercisesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const { category: categorySlug } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = new ExerciseService(supabase);
  const [exRes, catRes, histRes] = await Promise.all([
    service.getExercises(undefined, user?.id),
    service.getCategories(),
    user ? service.getUserExerciseHistory(user.id) : Promise.resolve({ success: true, data: [] }),
  ]);

  const allExercises = exRes.success && exRes.data ? exRes.data : [];
  const categories = catRes.success && catRes.data ? catRes.data : [];
  const history = histRes.success && histRes.data ? histRes.data : [];

  const filteredExercises = categorySlug
    ? allExercises.filter((e) => e.category?.slug === categorySlug)
    : allExercises;

  // Stats
  const totalCount = allExercises.length;
  const completedCount = allExercises.filter((e) => !!e.userCompletion).length;
  const inProgressCount = allExercises.filter((e) => !e.userCompletion && !!e.activeAttempt).length;
  const totalEvidenceCount = history.reduce((acc, h) => acc + h.evidence.length, 0);

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
            <LearningBreadcrumbs items={[{ label: "Exercises" }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5 font-mono">
            <Link href="/exercises/history">
              <History className="h-3.5 w-3.5" />
              <span>Exercise History</span>
            </Link>
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-card border border-border/70 p-6 md:p-8">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1.5 px-3 py-1 font-semibold text-xs"
              >
                <Code2 className="h-3.5 w-3.5" />
                Practical Assessment Engine
              </Badge>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/30 px-3 py-1 font-mono text-xs"
              >
                Zero-Simulations
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Engineering Exercise Workspace
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Reinforce lesson concepts and demonstrate core engineering competencies through rigorous, automated code verification. Every validated submission produces auditable evidence.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur-sm">
                <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Total Exercises
                </div>
                <div className="text-2xl font-bold font-mono text-foreground mt-0.5">
                  {totalCount}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-3 backdrop-blur-sm">
                <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
                  Completed
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                  {completedCount}
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-3 backdrop-blur-sm">
                <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider">
                  In Progress
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
                  {inProgressCount}
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 backdrop-blur-sm">
                <div className="text-[11px] font-medium text-primary uppercase tracking-wider">
                  Evidence Preserved
                </div>
                <div className="text-2xl font-bold font-mono text-primary mt-0.5">
                  {totalEvidenceCount}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="sm"
                variant={!categorySlug ? "default" : "outline"}
                className="h-8 text-xs font-semibold"
              >
                <Link href="/exercises">All Categories ({totalCount})</Link>
              </Button>
              {categories.map((cat) => {
                const count = allExercises.filter((e) => e.categoryId === cat.id).length;
                const isSelected = categorySlug === cat.slug;
                return (
                  <Button
                    key={cat.id}
                    asChild
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className="h-8 text-xs font-semibold"
                  >
                    <Link href={`/exercises?category=${cat.slug}`}>
                      {cat.name} ({count})
                    </Link>
                  </Button>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Showing {filteredExercises.length} of {totalCount} exercises
            </div>
          </div>

          {/* Exercise Grid */}
          {filteredExercises.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-card/40 p-12 text-center backdrop-blur-sm">
              <Terminal className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="text-base font-bold text-foreground">No Exercises Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                No exercises match the selected category filter.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/exercises">View All Exercises</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
