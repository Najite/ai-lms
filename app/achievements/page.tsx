import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AchievementQueryService } from "@/domains/achievement/services/achievement-query.service";
import { XPTransactionService } from "@/domains/achievement/services/xp-transaction.service";
import { XPBalanceDisplay } from "@/features/achievements/components/xp-balance-display";
import { AchievementProgressList } from "@/features/achievements/components/achievement-progress-list";
import { XPTransactionTable } from "@/features/achievements/components/xp-transaction-table";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Trophy, History, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const achService = new AchievementQueryService(supabase);
  const xpService = new XPTransactionService(supabase);

  const [categoriesRes, userAchRes, txRes] = await Promise.all([
    achService.getCategories(),
    user ? achService.getUserAchievements(user.id) : Promise.resolve({ success: true, data: [] }),
    user ? xpService.getUserTransactions(user.id, 20) : Promise.resolve({ success: true, data: [] }),
  ]);

  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
  const userAchievements = userAchRes.success && userAchRes.data ? userAchRes.data : [];
  const transactions = txRes.success && txRes.data ? txRes.data : [];

  const unlockedCount = userAchievements.filter((a) => a.isUnlocked).length;
  const totalAchievements = userAchievements.length;

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
            <LearningBreadcrumbs items={[{ label: "Achievements & XP" }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-mono gap-1.5 py-1 px-2.5">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>{unlockedCount}/{totalAchievements} Unlocked</span>
          </Badge>
          <UserMenu />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-10">
        {/* XP Balance Gauge */}
        <XPBalanceDisplay />

        {/* Achievement Catalogue & Progress List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Curriculum Milestones & Badges</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Earn verifiable milestone badges as you complete lessons, exercises, and competency goals.
              </p>
            </div>
          </div>

          <AchievementProgressList
            userAchievements={userAchievements}
            categories={categories}
          />
        </section>

        {/* XP Audit Ledger */}
        <section className="space-y-4 pt-4 border-t border-border/40">
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span>Immutable XP Transaction Ledger</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Auditable transaction logs for all XP grants issued to your account.
            </p>
          </div>

          <XPTransactionTable transactions={transactions} />
        </section>
      </main>
    </div>
  );
}
