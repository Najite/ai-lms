import type { GateStatus, GateRequirementType } from "../models";

export interface StartGateAttemptDTO {
  userId: string;
  gateId: string;
}

export interface SubmitGateAttemptDTO {
  userId: string;
  gateId: string;
  attemptId: string;
  notes?: string;
}

export interface CollectGateEvidenceDTO {
  userId: string;
  gateId: string;
  attemptId?: string;
  evidenceType: string;
  evidenceReference: string;
  metadata?: Record<string, unknown>;
}

export interface ValidateGateDTO {
  userId: string;
  gateId: string;
  attemptId?: string;
  passed: boolean;
  score?: number;
  feedback?: string;
  criteriaResults?: Array<{
    criterion: string;
    satisfied: boolean;
    details?: string;
  }>;
}

export interface CompleteGateDTO {
  userId: string;
  gateId: string;
}

export interface UpdateGateProgressDTO {
  userId: string;
  gateId: string;
  progressPercentage: number;
  status?: GateStatus;
}

export interface GateQueryFiltersDTO {
  gateLevel?: number;
  slug?: string;
  isActive?: boolean;
}

export interface EvaluateRequirementDTO {
  userId: string;
  gateId: string;
  requirementType?: GateRequirementType;
}
