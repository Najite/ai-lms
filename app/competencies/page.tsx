import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { CompetencyCard } from "@/features/competencies/components/competency-card";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ShieldCheck, Trophy, Sparkles, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

interface CompetenciesPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function CompetenciesPage({ searchParams }: CompetenciesPageProps) {
  const { category: categorySlug } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = new CompetencyService(supabase);
  const [compRes, catRes] = await Promise.all([
    service.getCompetencies(user?.id),
    service.getCategories(),
  ]);

  const allCompetencies = compRes.success && compRes.data ? compRes.data : [];
  const categories = catRes.success && catRes.data ? catRes.data : [];

  const filteredCompetencies = categorySlug
    ? allCompetencies.filter((c) => c.category?.slug === categorySlug)
    : allCompetencies;

  // Compute breakdown stats
  const totalCount = allCompetencies.length;
  const masteredCount = allCompetencies.filter((c) => c.progress?.state === "mastered").length;
  const reinforcedCount = allCompetencies.filter((c) => c.progress?.state === "reinforced").length;
  const practicingCount = allCompetencies.filter((c) => c.progress?.state === "practicing").length;
  const introducedCount = allCompetencies.filter((c) => c.progress?.state === "introduced").length;

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
            <LearningBreadcrumbs items={[{ label: "Competencies" }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-primary/5 to-card border border-border/70 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                <Award className="w-3.5 h-3.5 mr-1 text-primary" />
                Competency Framework
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                AI-Native Competency Explorer
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Track your progressive capability milestones across context architecture, formal specifications, and agentic protocols. Every competency is verified through demonstrated curriculum activity.
              </p>
            </div>

            {user && (
              <Button asChild variant="secondary" className="shrink-0 gap-2">
                <Link href="/competencies/progress">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>My Mastery Dashboard</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Quick Metrics */}
          {user && totalCount > 0 && (
            <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-card/60 border border-border/60">
                <span className="text-muted-foreground block text-[10px] uppercase">Total</span>
                <span className="text-lg font-bold text-foreground">{totalCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-purple-400 block text-[10px] uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Introduced
                </span>
                <span className="text-lg font-bold text-purple-300">{introducedCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-amber-400 block text-[10px] uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Practicing
                </span>
                <span className="text-lg font-bold text-amber-300">{practicingCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-cyan-400 block text-[10px] uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Reinforced
                </span>
                <span className="text-lg font-bold text-cyan-300">{reinforcedCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 col-span-2 sm:col-span-1">
                <span className="text-emerald-400 block text-[10px] uppercase flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Mastered
                </span>
                <span className="text-lg font-bold text-emerald-300">{masteredCount}</span>
              </div>
            </div>
          )}
        </section>

        {/* Category Filters */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Competency Catalog</span>
            </h2>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                variant={!categorySlug ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs h-8 px-4"
              >
                <Link href="/competencies">All Categories</Link>
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  asChild
                  variant={categorySlug === cat.slug ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs h-8 px-4"
                >
                  <Link href={`/competencies?category=${cat.slug}`}>{cat.name}</Link>
                </Button>
              ))}
            </div>
          </div>

          {filteredCompetencies.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/20">
              <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground">No Competencies Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                No competencies match the selected category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetencies.map((comp) => (
                <CompetencyCard key={comp.id} competency={comp} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
