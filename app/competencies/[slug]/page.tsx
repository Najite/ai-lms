import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { CompetencyBadge } from "@/features/competencies/components/competency-badge";
import { CompetencyLevelStepper } from "@/features/competencies/components/competency-level-stepper";
import { CompetencyEvidenceList } from "@/features/competencies/components/competency-evidence-list";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Layers, ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CompetencyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CompetencyDetailPage({ params }: CompetencyDetailPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = new CompetencyService(supabase);
  const result = await service.getCompetencyDetail({ slug }, user?.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const comp = result.data;
  const progressState = comp.progress?.state || "not_started";
  const progressScore = comp.progress?.score || 0;

  const levelVariants = {
    foundational: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    intermediate: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    advanced: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    expert: "bg-amber-500/10 text-amber-400 border-amber-500/30",
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
                { label: "Competencies", href: "/competencies" },
                { label: `${comp.code} - ${comp.title}` },
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
        {/* Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-card via-card/70 to-card/40 border border-border/70 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/30">
                {comp.code}
              </span>
              <Badge
                variant="outline"
                className={`capitalize font-semibold text-xs px-2.5 py-0.5 ${levelVariants[comp.level]}`}
              >
                {comp.level}
              </Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground border-border/70">
                {comp.category.name}
              </Badge>
            </div>

            <CompetencyBadge state={progressState} className="text-xs" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {comp.title}
            </h1>

            {/* Behavioral Statement */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm font-medium text-foreground/90 leading-relaxed">
              <span className="font-bold text-primary mr-1.5">Behavioral Capability Statement:</span>
              &ldquo;{comp.statement}&rdquo;
            </div>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {comp.description}
            </p>
          </div>

          {/* Stepper Progress Section */}
          <div className="pt-6 border-t border-border/40">
            <CompetencyLevelStepper currentState={progressState} score={progressScore} />
          </div>
        </section>

        {/* Contributing Curriculum Mappings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Related Modules */}
          <Card className="border-border/70 bg-card/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Contributing Modules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comp.relatedModules.length === 0 ? (
                <p className="text-xs text-muted-foreground">No direct modules mapped.</p>
              ) : (
                comp.relatedModules.map((mod) => (
                  <Link
                    key={mod.id}
                    href={`/learning-paths/${mod.pathSlug}/modules/${mod.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-border transition-all text-xs group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                        {mod.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate">
                        Path: {mod.pathTitle}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Related Lessons */}
          <Card className="border-border/70 bg-card/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Contributing Lessons</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comp.relatedLessons.length === 0 ? (
                <p className="text-xs text-muted-foreground">No direct lessons mapped.</p>
              ) : (
                comp.relatedLessons.map((les) => (
                  <Link
                    key={les.id}
                    href={`/learning-paths/${les.pathSlug}/modules/${les.moduleSlug}/lessons/${les.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-border transition-all text-xs group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors block truncate">
                        {les.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="capitalize text-primary">Target: {les.targetState}</span>
                        <span>•</span>
                        <span>+{les.contributionPoints} pts</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verified Evidence Ledger */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>Verified Evidence Ledger</span>
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {comp.evidence.length} Evidence Record{comp.evidence.length === 1 ? "" : "s"}
            </span>
          </div>

          <CompetencyEvidenceList evidence={comp.evidence} />
        </section>

        {/* Footer Back Action */}
        <div className="pt-4 border-t border-border/40">
          <Link
            href="/competencies"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Competency Explorer</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
