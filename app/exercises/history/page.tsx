import Link from "next/link";
import { ExerciseHistoryTable } from "@/features/exercises/components/exercise-history-table";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExerciseHistoryPage() {

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
                { label: "Attempt & Verification History" },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5">
            <Link href="/exercises">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Exercises</span>
            </Link>
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 gap-1.5 px-3 py-1 font-semibold text-xs"
            >
              <History className="h-3.5 w-3.5" />
              Audit Log & Preserved Evidence
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Exercise Attempt History
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Review your submission history, automated validation outputs, and competency evidence generated across all completed exercises.
          </p>
        </section>

        <section>
          <ExerciseHistoryTable />
        </section>
      </main>
    </div>
  );
}
