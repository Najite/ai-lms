import type { Database } from "@/lib/supabase/types";

/**
 * Competency State
 */
export type CompetencyState = Database["public"]["Enums"]["competency_state"];

/**
 * Competency Level
 */
export type CompetencyLevel = Database["public"]["Enums"]["competency_level"];

/**
 * Competency Evidence Source
 */
export type CompetencyEvidenceSource = Database["public"]["Enums"]["competency_evidence_source"];

/**
 * Core Competency Category Entity
 */
export interface CompetencyCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Core Competency Entity
 */
export interface Competency {
  id: string;
  categoryId: string;
  slug: string;
  code: string;
  title: string;
  description: string;
  statement: string;
  level: CompetencyLevel;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Module to Competency Mapping
 */
export interface ModuleCompetencyMapping {
  id: string;
  moduleId: string;
  competencyId: string;
  weight: number;
  createdAt: string;
}

/**
 * Lesson to Competency Mapping
 */
export interface LessonCompetencyMapping {
  id: string;
  lessonId: string;
  competencyId: string;
  targetState: CompetencyState;
  contributionPoints: number;
  createdAt: string;
}

/**
 * User Competency Progress Record
 */
export interface UserCompetencyProgress {
  id: string;
  userId: string;
  competencyId: string;
  state: CompetencyState;
  score: number; // 0 to 100
  evidenceCount: number;
  firstDemonstratedAt: string | null;
  lastEvaluatedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Competency Evidence Item
 */
export interface CompetencyEvidence {
  id: string;
  userId: string;
  competencyId: string;
  sourceType: CompetencyEvidenceSource;
  sourceId: string;
  sourceTitle: string;
  summary: string;
  createdAt: string;
}

/**
 * Enriched Competency with Category and User Progress
 */
export interface CompetencyWithProgress extends Competency {
  category?: CompetencyCategory;
  progress?: UserCompetencyProgress | null;
}

/**
 * Detailed Competency view with related curriculum and evidence
 */
export interface CompetencyDetail extends Competency {
  category: CompetencyCategory;
  progress: UserCompetencyProgress | null;
  evidence: CompetencyEvidence[];
  relatedModules: {
    id: string;
    slug: string;
    title: string;
    pathSlug: string;
    pathTitle: string;
    weight: number;
  }[];
  relatedLessons: {
    id: string;
    slug: string;
    title: string;
    moduleSlug: string;
    pathSlug: string;
    targetState: CompetencyState;
    contributionPoints: number;
  }[];
}

/**
 * Standard Competency Domain Response
 */
export interface CompetencyResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
