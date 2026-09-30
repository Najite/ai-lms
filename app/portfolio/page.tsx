import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PortfolioQueryService } from "@/domains/portfolio/services/portfolio-query.service";
import { PortfolioAggregationService } from "@/domains/portfolio/services/portfolio-aggregation.service";
import { PortfolioDashboard } from "@/features/portfolio/components/portfolio-dashboard";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Engineering Portfolio | AI Software Engineer LMS",
  description:
    "Auditable software engineering portfolio aggregating validated competencies, automated exercise evidence, milestone achievements, and hiring signals.",
};

export default async function PortfolioPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialSummary = null;

  if (user) {
    // Run aggregation engine to sync evidence, competencies, achievements, and hiring signals
    const aggregationService = new PortfolioAggregationService(supabase);
    await aggregationService.aggregateUserPortfolio(user.id);

    const queryService = new PortfolioQueryService(supabase);
    const summaryRes = await queryService.getPortfolioSummary(user.id);
    if (summaryRes.success && summaryRes.data) {
      initialSummary = summaryRes.data;
    }
  }

  const verifiedEvidenceCount = initialSummary?.stats.totalEvidence || 0;

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
            <LearningBreadcrumbs items={[{ label: "Professional Portfolio" }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-xs font-mono gap-1.5 py-1 px-2.5 border-emerald-500/30 text-emerald-300"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{verifiedEvidenceCount} Verified Records</span>
          </Badge>
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <PortfolioDashboard initialSummary={initialSummary} />
      </main>
    </div>
  );
}
