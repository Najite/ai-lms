export type CapstoneState =
  | "locked"
  | "available"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "completed";

export type CapstoneDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type CapstoneReviewType = "automated" | "peer" | "instructor";

export type CapstoneReviewResult = "approved" | "changes_requested" | "rejected";

export type CapstoneSubmissionStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "changes_requested";

export type DeliverableType =
  | "repository"
  | "architecture_doc"
  | "live_deployment"
  | "test_suite"
  | "video_walkthrough";

export interface CapstoneType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface CapstoneDeliverable {
  id: string;
  capstoneId: string;
  title: string;
  description: string;
  required: boolean;
  deliverableType: string;
  createdAt: string;
}

export interface CapstoneCompetency {
  id: string;
  capstoneId: string;
  competencyId: string;
  competency?: {
    id: string;
    code: string;
    title: string;
    level: string;
    slug: string;
  };
}

export interface CapstoneDependency {
  id: string;
  parentCapstoneId: string;
  childCapstoneId: string;
  parentCapstone?: {
    id: string;
    title: string;
    slug: string;
    status: string;
  };
}

export interface Capstone {
  id: string;
  typeId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: CapstoneDifficulty;
  status: "draft" | "active" | "archived";
  estimatedHours: number;
  createdAt: string;
  updatedAt: string;
  capstoneType?: CapstoneType;
  deliverables?: CapstoneDeliverable[];
  competencies?: CapstoneCompetency[];
  dependencies?: CapstoneDependency[];
}

export interface CapstoneSubmissionDeliverableItem {
  deliverableId: string;
  title: string;
  url?: string;
  content?: string;
}

export interface CapstoneSubmission {
  id: string;
  capstoneId: string;
  userId: string;
  deliverablesPayload: CapstoneSubmissionDeliverableItem[];
  repositoryUrl: string | null;
  liveUrl: string | null;
  documentationUrl: string | null;
  notes: string | null;
  submittedAt: string;
  status: CapstoneSubmissionStatus;
}

export interface CapstoneEvidence {
  id: string;
  capstoneId: string;
  userId: string;
  evidenceType: string;
  evidenceReference: string;
  createdAt: string;
}

export interface CapstoneFeedback {
  id: string;
  reviewId: string;
  feedbackText: string;
  createdAt: string;
}

export interface CapstoneReview {
  id: string;
  capstoneId: string;
  submissionId: string | null;
  userId: string;
  reviewerId: string | null;
  reviewType: CapstoneReviewType;
  reviewResult: CapstoneReviewResult;
  score: number | null;
  reviewedAt: string;
  feedback?: CapstoneFeedback[];
}

export interface CapstoneCompletion {
  id: string;
  capstoneId: string;
  userId: string;
  completedAt: string;
}

export interface UserCapstoneProgress {
  id: string;
  userId: string;
  capstoneId: string;
  status: CapstoneState;
  progressPercentage: number;
  startedAt: string | null;
  lastActivityAt: string;
}

export interface UserCapstoneStatusView {
  capstone: Capstone;
  status: CapstoneState;
  progressPercentage: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  submission?: CapstoneSubmission | null;
  latestReview?: CapstoneReview | null;
  evidenceCount: number;
  unmetDependencies: string[];
}

export interface DomainResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
