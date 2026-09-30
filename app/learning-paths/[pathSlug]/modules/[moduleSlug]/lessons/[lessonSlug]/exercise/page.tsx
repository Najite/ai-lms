import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { ExerciseWorkspace } from "@/features/exercises/components/exercise-workspace";
import { LearningBreadcrumbs } from "@/features/learning/components/learning-breadcrumbs";
import { UserMenu } from "@/features/auth";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface LessonExercisePageProps {
  params: Promise<{
    pathSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonExercisePage({ params }: LessonExercisePageProps) {
  const { pathSlug, moduleSlug, lessonSlug } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const learningService = new LearningService(supabase);
  const lessonResult = await learningService.getLessonDetail(
    pathSlug,
    moduleSlug,
    lessonSlug,
    user?.id
  );

  if (!lessonResult.success || !lessonResult.data) {
    notFound();
  }

  const { currentLesson, currentModule, currentPath, exercise } = lessonResult.data;

  if (!exercise) {
    notFound();
  }

  const lessonUrl = `/learning-paths/${pathSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-base font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
              {siteConfig.shortName}
            </span>
          </Link>
          <div className="hidden md:block h-4 w-px bg-border/60 shrink-0" />
          <div className="hidden md:block truncate">
            <LearningBreadcrumbs
              items={[
                { label: "Learning Paths", href: "/learning-paths" },
                { label: currentPath.title, href: `/learning-paths/${currentPath.slug}` },
                {
                  label: currentModule.title,
                  href: `/learning-paths/${currentPath.slug}/modules/${currentModule.slug}`,
                },
                { label: currentLesson.title, href: lessonUrl },
                { label: `Exercise: ${exercise.title}` },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs h-8 gap-1.5 font-medium">
            <Link href={lessonUrl}>
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Back to Lesson Notes</span>
            </Link>
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* Main Interactive Exercise Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        <ExerciseWorkspace slug={exercise.slug} />
      </main>
    </div>
  );
}
