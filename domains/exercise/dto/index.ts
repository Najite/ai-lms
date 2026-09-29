/**
 * DTOs for Exercise Domain operations
 */

export interface StartExerciseDTO {
  exerciseId: string;
}

export interface SubmitExerciseDTO {
  exerciseId: string;
  attemptId: string;
  submittedCode: string;
  content?: string;
}

export interface CompleteExerciseDTO {
  exerciseId: string;
  attemptId: string;
}

export interface ExerciseEvidenceDTO {
  exerciseId: string;
  attemptId: string;
  competencyId: string;
  summary: string;
  evidenceType?: string;
  evidencePayload?: Record<string, unknown>;
}

export interface ExerciseQueryFiltersDTO {
  lessonId?: string;
  categoryId?: string;
  competencyId?: string;
  slug?: string;
  isPublished?: boolean;
}
