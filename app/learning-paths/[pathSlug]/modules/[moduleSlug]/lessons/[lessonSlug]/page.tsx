import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { LessonStudio } from "@/features/learning/components/lesson-studio";

export const dynamic = "force-dynamic";

interface LessonDetailPageProps {
  params: Promise<{
    pathSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
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

  const moduleResult = await learningService.getModuleDetail(
    pathSlug,
    moduleSlug,
    user?.id
  );

  const siblingLessons = moduleResult.success && moduleResult.data
    ? moduleResult.data.module.lessons
    : [];

  return (
    <LessonStudio
      initialContext={lessonResult.data}
      siblingLessons={siblingLessons}
      pathSlug={pathSlug}
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
    />
  );
}
