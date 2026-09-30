/**
 * Competency Gate Domain Models
 */

export type GateStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "under_review"
  | "validated"
  | "completed";

export const GATE_STATUSES: GateStatus[] = [
  "locked",
  "available",
  "in_progress",
  "under_review",
  "validated",
  "completed",
];

export type GateAttemptStatus =
  | "in_progress"
  | "submitted"
  | "passed"
  | "failed"
  | "abandoned";

export type GateRequirementType =
  | "competency"
  | "lesson"
  | "exercise"
  | "achievement"
  | "xp"
  | "artifact";

export const GATE_REQUIREMENT_TYPES: GateRequirementType[] = [
  "competency",
  "lesson",
  "exercise",
  "achievement",
  "xp",
  "artifact",
];

/**
 * Valid State Transition Mapping
 */
export const VALID_GATE_TRANSITIONS: Record<GateStatus, GateStatus[]> = {
  locked: ["available"],
  available: ["in_progress", "locked"],
  in_progress: ["under_review", "available"],
  under_review: ["validated", "in_progress"],
  validated: ["completed", "in_progress"],
  completed: [], // Terminal permanent state
};

export interface CompetencyGate {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  gateLevel: number;
  isActive: boolean;
  createdAt: string;
  requirements?: GateRequirement[];
  competencies?: GateCompetencyMapping[];
}

export interface GateRequirement {
  id: string;
  gateId: string;
  requirementType: GateRequirementType;
  requirementValue: Record<string, unknown>;
  createdAt: string;
}

export interface GateCompetencyMapping {
  id: string;
  gateId: string;
  competencyId: string;
  competency?: {
    id: string;
    code: string;
    title: string;
    level: string;
    slug: string;
  };
}

export interface UserGateProgress {
  id: string;
  userId: string;
  gateId: string;
  progressPercentage: number;
  status: GateStatus;
  updatedAt: string;
  gate?: CompetencyGate;
}

export interface GateAttempt {
  id: string;
  userId: string;
  gateId: string;
  startedAt: string;
  completedAt: string | null;
  status: GateAttemptStatus;
  createdAt: string;
}

export interface GateEvidence {
  id: string;
  userId: string;
  gateId: string;
  attemptId: string | null;
  evidenceType: string;
  evidenceReference: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface GateValidation {
  id: string;
  userId: string;
  gateId: string;
  attemptId: string | null;
  validationResult: {
    passed: boolean;
    score?: number;
    feedback?: string;
    criteriaResults?: Array<{
      criterion: string;
      satisfied: boolean;
      details?: string;
    }>;
  };
  validatedAt: string;
}

export interface GateCompletion {
  id: string;
  userId: string;
  gateId: string;
  completedAt: string;
}

export interface UserGateStatusView {
  gate: CompetencyGate;
  status: GateStatus;
  progressPercentage: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  activeAttempt?: GateAttempt;
  latestValidation?: GateValidation;
  evidenceCount: number;
  requirementsEvaluation: Array<{
    type: GateRequirementType;
    required: Record<string, unknown>;
    satisfied: boolean;
    currentValue?: unknown;
    message?: string;
  }>;
}

export interface GateDomainResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
