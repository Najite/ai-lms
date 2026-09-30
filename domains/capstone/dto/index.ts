import type {
  CapstoneDifficulty,
  CapstoneReviewType,
  CapstoneReviewResult,
  DeliverableType,
  CapstoneState,
} from "../models";

export interface CreateCapstoneDTO {
  typeId: string;
  title: string;
  slug: string;
  description: string;
  difficulty?: CapstoneDifficulty;
  status?: "draft" | "active" | "archived";
  estimatedHours?: number;
  competencyIds?: string[];
  dependencyCapstoneIds?: string[];
}

export interface CreateCapstoneDeliverableDTO {
  capstoneId: string;
  title: string;
  description: string;
  required?: boolean;
  deliverableType?: DeliverableType;
}

export interface SubmitCapstoneDTO {
  capstoneId: string;
  userId: string;
  deliverables: {
    deliverableId: string;
    title: string;
    url?: string;
    content?: string;
  }[];
  repositoryUrl?: string | null;
  liveUrl?: string | null;
  documentationUrl?: string | null;
  notes?: string | null;
}

export interface ReviewCapstoneDTO {
  capstoneId: string;
  userId: string;
  submissionId?: string | null;
  reviewerId?: string | null;
  reviewType: CapstoneReviewType;
  reviewResult: CapstoneReviewResult;
  score?: number | null;
  feedbackText: string;
}

export interface CollectCapstoneEvidenceDTO {
  capstoneId: string;
  userId: string;
  evidenceType: string;
  evidenceReference: string;
}

export interface UpdateCapstoneProgressDTO {
  userId: string;
  capstoneId: string;
  status?: CapstoneState;
  progressPercentage?: number;
}
