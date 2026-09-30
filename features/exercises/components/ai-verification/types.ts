export interface AiCaseItem {
  id: string;
  caseCode: string;
  title: string;
  prompt: string;
  modelOutput: string;
  outputLanguage: string;
  metadata: {
    latencyMs: number;
    model: string;
    temperature: number;
    tokensGenerated: number;
  };
  evidenceLogs: {
    type: "compiler_error" | "registry_404" | "unit_test_failure" | "documentation_audit";
    source: string;
    output: string;
    status: "error" | "failed" | "unverified";
  }[];
  defects: {
    category: "hallucination" | "logic_inversion" | "missing_context" | "unsupported_claim";
    description: string;
  }[];
}

export interface CandidateSolution {
  id: string;
  name: string;
  approach: string;
  codeSnippet: string;
  securityScore: number;
  correctnessScore: number;
  maintainabilityScore: number;
  schemaComplianceScore: number;
  flaws: string[];
}

export interface AiInvestigationPayload {
  exercise_id: string;
  task_1_hallucinated_package_name: string;
  task_1_verification_evidence_source: string;
  task_1_unsupported_performance_claim: string;
  task_1_hallucinated_config_parameter: string;
  task_2_fake_documentation_citation: string;
  task_2_deployment_sequence_defect: string;
  task_2_missing_context_element: string;
  task_3_logic_defect_type: string;
  task_3_confidence_misalignment: string;
  task_3_false_api_property: string;
  task_4_best_candidate_response_id: string;
  task_4_worst_candidate_response_id: string;
  task_4_candidate_rankings: string[];
  task_4_candidate_a_security_defect: string;
}
