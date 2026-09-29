import type { Database, Json } from "@/lib/supabase/types";
import type { Competency } from "@/features/competencies/types";

/**
 * Exercise State Machine States
 */
export type ExerciseState = Database["public"]["Enums"]["exercise_state"];

export type ExerciseStateUppercase =
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "VALIDATED"
  | "COMPLETED";

/**
 * Exercise Submission Status
 */
export type ExerciseSubmissionStatus =
  Database["public"]["Enums"]["exercise_submission_status"];

/**
 * Rules for validating exercise code submissions
 */
export interface ExerciseValidationRules {
  required_patterns?: string[];
  forbidden_patterns?: string[];
  min_length?: number;
  custom_checks?: string[];
  [key: string]: unknown;
}

/**
 * Feedback for an individual validation rule check
 */
export interface ValidationFeedbackItem {
  rule: string;
  passed: boolean;
  message: string;
}

/**
 * Complete validation output structure stored in submissions
 */
export interface ValidationResultOutput {
  passed: boolean;
  score: number; // 0 to 100
  feedback: ValidationFeedbackItem[];
  execution_time_ms: number;
  error?: string;
}

/**
 * Exercise Category Entity
 */
export interface ExerciseCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Core Exercise Entity
 */
export interface Exercise {
  id: string;
  lessonId: string;
  categoryId: string;
  slug: string;
  title: string;
  description: string;
  objective?: string;
  instructions: string;
  expectedOutcome?: string;
  successCriteria?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  starterCode: string;
  solutionTemplate: string;
  validationRules: ExerciseValidationRules;
  estimatedMinutes: number;
  maxAttempts: number | null;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exercise to Competency Reinforcement Mapping
 */
export interface ExerciseCompetency {
  id: string;
  exerciseId: string;
  competencyId: string;
  weight: number;
  createdAt: string;
  competency?: Competency;
}

/**
 * Exercise Attempt Entity
 */
export interface ExerciseAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  attemptNumber: number;
  state: ExerciseState;
  status?: string;
  startedAt: string;
  submittedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exercise Submission Entity
 */
export interface ExerciseSubmission {
  id: string;
  attemptId: string;
  userId: string;
  exerciseId: string;
  content?: string;
  submittedCode: string;
  status: ExerciseSubmissionStatus;
  validationOutput: ValidationResultOutput;
  submittedAt?: string;
  createdAt: string;
}

/**
 * Exercise Completion Entity
 */
export interface ExerciseCompletion {
  id: string;
  userId: string;
  exerciseId: string;
  bestAttemptId: string;
  status: string;
  score: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Exercise Evidence Entity
 */
export interface ExerciseEvidence {
  id: string;
  userId: string;
  exerciseId: string;
  attemptId: string;
  competencyId: string;
  evidenceType?: string;
  evidencePayload?: Record<string, unknown> | Json;
  summary: string;
  createdAt: string;
  competency?: {
    code: string;
    title: string;
  };
}

/**
 * Rich Exercise with category and competency details
 */
export interface ExerciseWithDetails extends Exercise {
  category: ExerciseCategory;
  competencies: {
    id: string;
    code: string;
    title: string;
    level: string;
    weight: number;
  }[];
  userCompletion?: ExerciseCompletion | null;
  activeAttempt?: ExerciseAttempt | null;
}

/**
 * User Exercise History Item
 */
export interface ExerciseHistoryItem {
  exercise: {
    id: string;
    slug: string;
    title: string;
    categoryName: string;
  };
  attempt: ExerciseAttempt;
  latestSubmission?: ExerciseSubmission | null;
  completion?: ExerciseCompletion | null;
  evidence: ExerciseEvidence[];
}

/**
 * Standard Result Response
 */
export interface ExerciseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
