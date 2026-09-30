export type {
  GateStatus,
  GateAttemptStatus,
  GateRequirementType,
  CompetencyGate,
  GateRequirement,
  GateCompetencyMapping,
  UserGateProgress,
  GateAttempt,
  GateEvidence,
  GateValidation,
  GateCompletion,
  UserGateStatusView,
  GateDomainResponse,
} from "@/domains/gates/models";

export type {
  StartGateAttemptDTO,
  SubmitGateAttemptDTO,
  CollectGateEvidenceDTO,
  ValidateGateDTO,
  CompleteGateDTO,
  UpdateGateProgressDTO,
  GateQueryFiltersDTO,
} from "@/domains/gates/dto";
