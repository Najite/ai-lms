# EXE-00-03 Competency Evidence Map

**Exercise:** `EXE-00-03: Network Request Investigation & HTTP Diagnostics`  
**Target Competency:** `DEV-00` (*Developer Environment & Tooling Fluency*)  
**Target Progression:** `Reinforced` &rarr; `Verified`  
**Parent Module:** `MOD-00 Digital Foundations`  
**Evaluation Standard:** 100% Automated Criteria Evaluation ($\ge 90\%$ Score)  

---

## 1. Competency Architecture & Progression Criteria

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DEV-00 COMPETENCY PROGRESSION                             │
├───────────────────┬───────────────────┬────────────────────────┬───────────────────────┤
│ Introduced        │ Practicing        │ Reinforced             │ Verified              │
├───────────────────┼───────────────────┼────────────────────────┼───────────────────────┤
│ LES-00-01 Concept │ EXE-00-01 Sandbox │ LES-00-03 Concept      │ **EXE-00-03 Sandbox** │
│ Filesystem model  │ POSIX Tree recon  │ Web, HTTP, DevTools    │ Network Diagnostics   │
└───────────────────┴───────────────────┴────────────────────────┴───────────────────────┘
```

When a learner successfully achieves a score of $\ge 90\%$ on `EXE-00-03`, the platform emits verifiable evidence proving operational fluency across four key developer domains:
1. **Network Observation**: Navigating browser Developer Tools to trace live HTTP request lifecycles.
2. **Protocol Analysis**: Decoding status code semantics, headers, and protocol encryption.
3. **Data Extraction**: Reading structured JSON payloads and extracting diagnostic values.
4. **Systems Triage**: Performing root-cause deduction from multi-request timeline data.

---

## 2. Test-to-Competency Criteria Mapping

| Test ID | Test Name | Target Field | Competency Dimension | Weight |
| :--- | :--- | :--- | :--- | :---: |
| `VIS-01` | Successful Request (200 OK) | `task_1_successful_catalog_request_id` | `DEV-00.HTTP.SUCCESS` | 6.67% |
| `VIS-02` | Missing Resource (404) | `task_1_missing_asset_request_id` | `DEV-00.HTTP.CLIENT_ERR` | 6.67% |
| `VIS-03` | Server Failure (500) | `task_4_backend_crash_request_id` | `DEV-00.HTTP.SERVER_ERR` | 6.67% |
| `VIS-04` | Locate JSON Payload | `task_5_error_code_payload` | `DEV-00.DATA.JSON_PARSING` | 6.67% |
| `VIS-05` | Insecure Plain HTTP | `task_2_insecure_http_request_id` | `DEV-00.SEC.HTTPS_TLS` | 6.67% |
| `VIS-06` | Redirection Header | `task_2_redirect_target_url` | `DEV-00.HTTP.HEADERS` | 6.67% |
| `HID-01` | DNS IP Resolution | `task_5_resolved_api_ip_address` | `DEV-00.NET.DNS_MAPPING` | 7.50% |
| `HID-02` | Redirect Chain Analysis | `task_2_redirect_target_url` | `DEV-00.HTTP.REDIRECT_CHAIN` | 7.50% |
| `HID-03` | Authentication Error (401) | `task_3_unauthenticated_request_id` | `DEV-00.AUTH.401_CHALLENGE` | 7.50% |
| `HID-04` | Authorization Error (403) | `task_3_forbidden_request_id` | `DEV-00.AUTH.403_FORBIDDEN` | 7.50% |
| `HID-05` | Gateway Timeout (504) | `task_4_timeout_bottleneck_request_id` | `DEV-00.PERF.504_TIMEOUT` | 7.50% |
| `HID-06` | Protocol Isolation | `task_2_insecure_http_request_id` | `DEV-00.SEC.PROTOCOL_DIFF` | 7.50% |
| `HID-07` | JSON Payload Extraction | `task_5_error_code_payload` | `DEV-00.DATA.JSON_EXTRACTION`| 7.50% |
| `HID-08` | Root Cause Synthesis | `task_6_primary_root_cause` | `DEV-00.TRIAGE.ROOT_CAUSE` | 7.50% |

---

## 3. Emitted Competency Evidence Payload

Upon successful submission validation, the Assessment Service constructs and records the following cryptographic evidence row in `public.competency_evidence`:

```json
{
  "user_id": "<uuid>",
  "competency_code": "DEV-00",
  "evidence_type": "exercise_completion",
  "evidence_reference": "exe-00-03",
  "score": 100,
  "passed": true,
  "criteria_met": [
    "DEV-00.HTTP.SUCCESS",
    "DEV-00.HTTP.CLIENT_ERR",
    "DEV-00.HTTP.SERVER_ERR",
    "DEV-00.DATA.JSON_PARSING",
    "DEV-00.SEC.HTTPS_TLS",
    "DEV-00.HTTP.HEADERS",
    "DEV-00.NET.DNS_MAPPING",
    "DEV-00.HTTP.REDIRECT_CHAIN",
    "DEV-00.AUTH.401_CHALLENGE",
    "DEV-00.AUTH.403_FORBIDDEN",
    "DEV-00.PERF.504_TIMEOUT",
    "DEV-00.DATA.JSON_EXTRACTION",
    "DEV-00.TRIAGE.ROOT_CAUSE"
  ],
  "assessment_run_id": "<assessment_run_uuid>",
  "demonstrated_at": "2026-09-30T15:00:00Z"
}
```
