import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { CompetencyCard } from "@/features/competencies/components/competency-card";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, ShieldCheck, Flame, Sparkles, Award, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompetencyProgressPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/competencies/progress");
  }

  const service = new CompetencyService(supabase);
  const result = await service.getCompetencies(user.id);
  const competencies = result.success && result.data ? result.data : [];

  const totalCount = competencies.length;
  const masteredList = competencies.filter((c) => c.progress?.state === "mastered");
  const reinforcedList = competencies.filter((c) => c.progress?.state === "reinforced");
  const practicingList = competencies.filter((c) => c.progress?.state === "practicing");
  const introducedList = competencies.filter((c) => c.progress?.state === "introduced");
  const notStartedList = competencies.filter(
    (c) => !c.progress || c.progress.state === "not_started"
  );

  const averageScore =
    totalCount > 0
      ? Math.round(
          competencies.reduce((sum, c) => sum + (c.progress?.score || 0), 0) / totalCount
        )
      : 0;

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
                { label: "Competencies", href: "/competencies" },
                { label: "My Progress Dashboard" },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-card border border-border/70 p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                <Trophy className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Learner Mastery Matrix
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                My Competency Progress
              </h1>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                Comprehensive overview of your verified capability milestones. Every state transition is backed by authenticated evidence in your ledger.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card/60 border border-border/70 text-center shrink-0 font-mono">
              <span className="text-[10px] text-muted-foreground uppercase block">Average Mastery</span>
              <span className="text-2xl font-extrabold text-foreground">{averageScore}%</span>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-border/40 text-xs font-mono">
            <div className="p-3 rounded-xl bg-card/40 border border-border/60">
              <span className="text-muted-foreground block text-[10px] uppercase">Not Started</span>
              <span className="text-lg font-bold text-foreground">{notStartedList.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <span className="text-purple-400 block text-[10px] uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Introduced
              </span>
              <span className="text-lg font-bold text-purple-300">{introducedList.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-amber-400 block text-[10px] uppercase flex items-center gap-1">
                <Flame className="w-3 h-3" /> Practicing
              </span>
              <span className="text-lg font-bold text-amber-300">{practicingList.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-cyan-400 block text-[10px] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Reinforced
              </span>
              <span className="text-lg font-bold text-cyan-300">{reinforcedList.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 col-span-2 sm:col-span-1">
              <span className="text-emerald-400 block text-[10px] uppercase flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Mastered
              </span>
              <span className="text-lg font-bold text-emerald-300">{masteredList.length}</span>
            </div>
          </div>
        </section>

        {/* Competencies Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>All Competencies & Real-Time Status</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competencies.map((comp) => (
              <CompetencyCard key={comp.id} competency={comp} />
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-4 border-t border-border/40">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/competencies">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explorer</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
