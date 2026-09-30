# Competency Evidence Map: EXE-00-05
## AI-Assisted Engineering: AI Verification & Evaluation Investigation

**Target Competency:** `AIE-00` (AI Engineering Foundations)  
**State Progression:** `Practicing` &rarr; `Verified`  
**Assessment Type:** Visual AI Investigation & Forensic Diagnostics  
**Pass Threshold:** $\ge 90\%$ (Visible: 40%, Hidden: 60%)  
**Evidence Emitter:** `public.competency_evidence`  

---

## 1. Competency Progression Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AIE-00 COMPETENCY PROGRESSION                      │
├─────────────────┬─────────────────┬──────────────────────┬──────────────────┤
│   INTRODUCED    │   PRACTICING    │       VERIFIED       │     MASTERED     │
│   (LES-00-05)   │   (Self-Check)  │     (EXE-00-05)      │     (MC-00)      │
│   Theory, Desk  │ Formative Card  │ Forensic Audit Pass  │ Capstone System  │
│   Mental Model  │   Checkpoints   │    Score >= 90%      │ Verification Log │
└─────────────────┴─────────────────┴──────────────────────┴──────────────────┘
```

---

## 2. Test-to-Evidence Matrix

| Test ID | Suite | Rule Description | Field Evaluated | Weight | Target Competency Facet |
| :---: | :---: | :--- | :--- | :---: | :--- |
| **VIS-01** | Visible | Hallucinated Package Detection | `task_1_hallucinated_package_name` | 7% | Identifies fabricated dependencies (`@auth/jwt-auto-verify-v2`). |
| **VIS-02** | Visible | Missing Context Identification | `task_2_missing_context_element` | 7% | Detects environmental context gaps (database table schema). |
| **VIS-03** | Visible | Unsupported Performance Claim | `task_1_unsupported_performance_claim` | 6% | Distinguishes marketing claims from empirical proof. |
| **VIS-04** | Visible | Best Candidate Selection | `task_4_best_candidate_response_id` | 7% | Selects safe, parameterized RLS solution (Candidate B). |
| **VIS-05** | Visible | Verification Source Identification | `task_1_verification_evidence_source` | 6% | Utilizes deterministic compiler & registry logs as ground truth. |
| **VIS-06** | Visible | Confidence vs Correctness Disconnect | `task_3_confidence_misalignment` | 7% | Detects authoritative tone masking fatal logic errors. |
| **HID-01** | Hidden | False API Property Generation | `task_3_false_api_property` | 8% | Identifies invalid 'thread-safe' claims on non-atomic functions. |
| **HID-02** | Hidden | Fake Documentation Citation | `task_2_fake_documentation_citation` | 7% | Catches fabricated RFC numbers in PostgreSQL migration docs. |
| **HID-03** | Hidden | Deployment Sequence Defect | `task_2_deployment_sequence_defect` | 8% | Flags race condition: restarting workers before migration completion. |
| **HID-04** | Hidden | Security Architecture Flaw | `task_4_candidate_a_security_defect` | 8% | Flags client-side auth bypass violating PostgreSQL RLS. |
| **HID-05** | Hidden | Inverted Boundary Condition | `task_3_logic_defect_type` | 8% | Detects inverted `<` boolean check in rate limiter. |
| **HID-06** | Hidden | Hallucinated Config Parameter | `task_1_hallucinated_config_parameter` | 7% | Identifies non-existent `cacheTtlSeconds` options. |
| **HID-07** | Hidden | Insecure Candidate Rejection | `task_4_worst_candidate_response_id` | 7% | Rejects security-critical candidate (Candidate A). |
| **HID-08** | Hidden | Multi-Response Comparative Ranking | `task_4_candidate_rankings` | 7% | Produces complete ranking: Candidate B > Candidate C > Candidate A. |

---

## 3. Emitted Competency Evidence Payload

When a learner scores $\ge 90\%$ on `EXE-00-05`, the system generates an immutable evidence record in `public.competency_evidence`:

```json
{
  "evidence_id": "ev-exe-00-05-<uuid>",
  "user_id": "<learner_uuid>",
  "competency_id": "a1e00000-0000-0000-0000-000000000000",
  "competency_code": "AIE-00",
  "competency_title": "AI Engineering Foundations",
  "previous_state": "practicing",
  "new_state": "verified",
  "score": 100,
  "exercise_slug": "exe-00-05-ai-verification-evaluation-investigation",
  "artifacts": {
    "hallucinated_package_detected": "@auth/jwt-auto-verify-v2",
    "verification_evidence_source": "npm_registry_404_ts_compiler_ts2307",
    "inverted_boundary_detected": true,
    "fake_rfc_citation_flagged": "rfc_8812_postgres_migration",
    "best_candidate_selected": "candidate_b",
    "candidate_comparative_ranking": ["candidate_b", "candidate_c", "candidate_a"]
  },
  "evaluated_at": "2026-09-30T17:00:00.000Z",
  "evaluator": "DeterministicExerciseValidator"
}
```
