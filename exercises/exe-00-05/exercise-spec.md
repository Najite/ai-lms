# Exercise Specification: EXE-00-05
## AI Verification & Evaluation Investigation

**Document Version:** 1.0.0  
**Exercise Code:** `EXE-00-05`  
**Classification:** Core Assessment Specification  
**Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `AIE-00` (AI Engineering Foundations)  
**State Progression:** `Practicing` &rarr; `Verified`  
**Pass Threshold:** $\ge 90\%$  

---

## 1. Functional Specification

### 1.1 Role & Context
The learner assumes the role of an **AI Verification Analyst** evaluating AI agent outputs before deployment into production systems.

### 1.2 Interactive Tasks

1. **Task 1: The Phantom Package Audit (PR-101)**
   - Inspect Candidate A's JWT authentication helper.
   - Detect the hallucinated package `@auth/jwt-auto-verify-v2`.
   - Identify the hallucinated configuration parameter `cacheTtlSeconds`.
   - Flag the unsubstantiated claim `zero_overhead_native_caching`.
   - Link findings to deterministic evidence: `npm_registry_404_ts_compiler_ts2307`.

2. **Task 2: Database Migration & Deployment Ordering Audit (PR-102)**
   - Inspect Candidate B's zero-downtime deployment steps.
   - Flag the fake documentation citation `rfc_8812_postgres_migration`.
   - Detect the deployment sequence defect: `workers_started_before_migration_completed`.
   - Identify the missing environmental context: `table_schema_existing_row_volume`.

3. **Task 3: Rate Limiter Logic Inversion Audit (PR-103)**
   - Inspect Candidate C's rate limiter guard function.
   - Detect the inverted boolean boundary condition (`<` returns `true`).
   - Flag the confidence misalignment: `authoritative_tone_with_flawed_logic`.
   - Flag the false API property: `thread_safe_guarantee_unsupported`.

4. **Task 4: Multi-Candidate Evaluation & Comparative Ranking (PR-104)**
   - Evaluate Candidate A (client-side JS auth), Candidate B (parameterized RLS + Zod), and Candidate C (raw SQL).
   - Identify Candidate B as `best_candidate_response_id`.
   - Identify Candidate A as `worst_candidate_response_id` due to `client_side_authorization_bypassing_rls`.
   - Submit the comparative ranking: `["candidate_b", "candidate_c", "candidate_a"]`.

---

## 2. Input/Output Data Contracts

### 2.1 Starter Code (Initial Payload)
```json
{
  "exercise_id": "exe-00-05",
  "task_1_hallucinated_package_name": "",
  "task_1_verification_evidence_source": "",
  "task_1_unsupported_performance_claim": "",
  "task_1_hallucinated_config_parameter": "",
  "task_2_fake_documentation_citation": "",
  "task_2_deployment_sequence_defect": "",
  "task_2_missing_context_element": "",
  "task_3_logic_defect_type": "",
  "task_3_confidence_misalignment": "",
  "task_3_false_api_property": "",
  "task_4_best_candidate_response_id": "",
  "task_4_worst_candidate_response_id": "",
  "task_4_candidate_rankings": [],
  "task_4_candidate_a_security_defect": ""
}
```

### 2.2 Solution Template (Target Payload)
```json
{
  "exercise_id": "exe-00-05",
  "task_1_hallucinated_package_name": "@auth/jwt-auto-verify-v2",
  "task_1_verification_evidence_source": "npm_registry_404_ts_compiler_ts2307",
  "task_1_unsupported_performance_claim": "zero_overhead_native_caching",
  "task_1_hallucinated_config_parameter": "cacheTtlSeconds",
  "task_2_fake_documentation_citation": "rfc_8812_postgres_migration",
  "task_2_deployment_sequence_defect": "workers_started_before_migration_completed",
  "task_2_missing_context_element": "table_schema_existing_row_volume",
  "task_3_logic_defect_type": "inverted_boolean_boundary",
  "task_3_confidence_misalignment": "authoritative_tone_with_flawed_logic",
  "task_3_false_api_property": "thread_safe_guarantee_unsupported",
  "task_4_best_candidate_response_id": "candidate_b",
  "task_4_worst_candidate_response_id": "candidate_a",
  "task_4_candidate_rankings": ["candidate_b", "candidate_c", "candidate_a"],
  "task_4_candidate_a_security_defect": "client_side_authorization_bypassing_rls"
}
```
