import type { Database } from "@/lib/supabase/types";

/**
 * Learning Path Difficulty
 */
export type LearningPathDifficulty = Database["public"]["Enums"]["learning_path_difficulty"];

/**
 * Learning Progress Status
 */
export type LearningProgressStatus = Database["public"]["Enums"]["learning_progress_status"];

/**
 * Core Learning Path Entity
 */
export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: LearningPathDifficulty;
  estimatedHours: number;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Core Module Entity
 */
export interface Module {
  id: string;
  learningPathId: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedMinutes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Core Lesson Entity
 */
export interface Lesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  orderIndex: number;
  estimatedMinutes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Minimal Lesson Summary for listings
 */
export interface LessonSummary {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  summary: string | null;
  orderIndex: number;
  estimatedMinutes: number;
  isPublished: boolean;
  exercise?: LessonExerciseSummary | null;
}

/**
 * Associated Practical Exercise Summary for a Lesson
 */
export interface LessonExerciseSummary {
  id: string;
  lessonId: string;
  categoryId: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedMinutes: number;
  objective?: string;
  expectedOutcome?: string;
  successCriteria?: string;
  orderIndex: number;
  isPublished: boolean;
  completion?: {
    id: string;
    score: number;
    completedAt: string;
  } | null;
}

/**
 * User Learning Progress Entity
 */
export interface UserLearningProgress {
  id: string;
  userId: string;
  learningPathId: string;
  moduleId: string;
  lessonId: string;
  status: LearningProgressStatus;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculated Progress Metric for a container (Module or Path)
 */
export interface ProgressMetrics {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  notStartedLessons: number;
  percentage: number;
  isCompleted: boolean;
  isStarted: boolean;
}

/**
 * Staff-only Curriculum Engineering Metadata (Progressive Disclosure)
 */
export interface StaffLessonMetadata {
  lessonCode: string | null;
  sourcePath: string | null;
  blueprintPath: string | null;
  version: string | null;
  status: string | null;
  targetCompetency: string | null;
  targetGate: string | null;
  prerequisites: string[];
}

/**
 * Competency Information for Learner Display (Plain English First)
 */
export interface LessonCompetencyInfo {
  code: string;
  title: string;
  description?: string | null;
  targetState: "introduced" | "practicing" | "reinforced" | "mastered";
  capabilityGate: string;
  contributionPoints?: number;
}

/**
 * Enriched Next Lesson Preview for Navigation
 */
export interface NextLessonPreview {
  pathSlug: string;
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  summary?: string | null;
  estimatedMinutes?: number;
  orderIndex?: number;
}

/**
 * Lesson Navigation Context (Adjacent Lessons & Enriched Metadata)
 */
export interface LessonNavigationContext {
  currentLesson: Lesson;
  currentModule: Module;
  currentPath: LearningPath;
  previousLesson: {
    pathSlug: string;
    moduleSlug: string;
    lessonSlug: string;
    title: string;
  } | null;
  nextLesson: NextLessonPreview | null;
  progress: UserLearningProgress | null;
  competency?: LessonCompetencyInfo | null;
  exercise?: LessonExerciseSummary | null;
  staffMetadata?: StaffLessonMetadata | null;
}

/**
 * Module with nested Lessons and calculated Progress
 */
export interface ModuleWithLessons extends Module {
  lessons: (LessonSummary & { progress?: UserLearningProgress | null })[];
  metrics?: ProgressMetrics;
}

/**
 * Learning Path with nested Modules and calculated Progress
 */
export interface LearningPathDetail extends LearningPath {
  modules: ModuleWithLessons[];
  metrics?: ProgressMetrics;
}

/**
 * Learning Domain Standard Response
 */
export interface LearningResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
