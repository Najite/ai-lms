import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";
import { GateRoadmap } from "@/features/gates/components/gate-roadmap";
import { GateCard } from "@/features/gates/components/gate-card";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompetencyGatesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryService = new GateQueryService(supabase);
  const overviewRes = user
    ? await queryService.getUserGatesOverview(user.id)
    : await queryService.getGates({ isActive: true }).then((r) => ({
        success: true,
        data: (r.data || []).map((g) => ({
          gate: g,
          status: g.gateLevel === 1 ? ("available" as const) : ("locked" as const),
          progressPercentage: 0,
          isUnlocked: g.gateLevel === 1,
          isCompleted: false,
          completedAt: null,
          evidenceCount: 0,
          requirementsEvaluation: [],
        })),
      }));

  const gatesOverview = overviewRes.success && overviewRes.data ? overviewRes.data : [];
  const completedCount = gatesOverview.filter((g) => g.isCompleted).length;
  const totalCount = gatesOverview.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-base font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
              {siteConfig.shortName}
            </span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-border/60" />
          <div className="hidden sm:block">
            <LearningBreadcrumbs items={[{ label: "Competency Gates" }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono gap-1.5 py-1 px-2.5 border-emerald-500/30 text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{completedCount}/{totalCount} Gates Mastered</span>
          </Badge>
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-10">
        {/* Roadmap Progression Bar */}
        <GateRoadmap gates={gatesOverview} />

        {/* Competency Gate Cards Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground font-display">
                Mastery Verification Checkpoints
              </h2>
              <p className="text-xs text-muted-foreground">
                Each gate verifies essential engineering competencies, lesson milestones, and code exercise proofs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gatesOverview.map((statusView) => (
              <GateCard key={statusView.gate.id} statusView={statusView} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
