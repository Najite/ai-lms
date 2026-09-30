# Exercise Blueprint: EXE-00-05
## AI Verification & Evaluation Investigation

**Document Version:** 1.0.0  
**Exercise Code:** `EXE-00-05`  
**Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `AIE-00` (AI Engineering Foundations)  
**State Progression:** `Practicing` &rarr; `Verified`  
**Prerequisite:** `LES-00-05` (AI-Assisted Engineering: Context, Verification & Evals)  
**Successor:** `MC-00` (Developer Bootstrap Capstone)  
**Auditor:** Principal Assessment Architect & Verification Engineering Specialist  

---

## 1. Executive Summary & Assessment Rationale

`EXE-00-05` evaluates the learner's operational ability to act as an **AI Verification Analyst** in a modern software engineering organization. Rather than testing trivia or requiring coding/scripting, this exercise measures real-world diagnostic competencies:

- Can the learner spot hallucinations in AI-generated code, documentation, and configuration options?
- Can the learner identify missing environmental context that caused an AI agent to produce invalid deployment steps?
- Can the learner recognize logic inversions and false security claims masked by fluent, authoritative docstrings?
- Can the learner evaluate competing candidate solutions and rank them using objective engineering criteria?

---

## 2. Visual Workspace Architecture (6 Panels)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 EXE-00-05 VISUAL AI INVESTIGATION WORKSPACE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. AI Response Inspector       │ Inspects raw prompts, candidate responses, │
│                                │ tone metrics, and generated docstrings.   │
├────────────────────────────────┼─────────────────────────────────────────────┤
│ 2. Hallucination Detection     │ Flags phantom npm packages, fake APIs,     │
│    Panel                       │ fabricated RFCs, and non-existent options. │
├────────────────────────────────┼─────────────────────────────────────────────┤
│ 3. Verification Evidence Panel │ Displays compiler exits (TS2307), package  │
│                                │ registry HTTP 404s, and test failure logs. │
├────────────────────────────────┼─────────────────────────────────────────────┤
│ 4. Context Gap Analyzer        │ Diagnoses missing table schemas, constraint│
│                                │ rules, and environmental interfaces.       │
├────────────────────────────────┼─────────────────────────────────────────────┤
│ 5. Evaluation Scoring Matrix   │ Scores candidates across Schema Compliance,│
│                                │ Security (RLS), Correctness, and Quality.  │
├────────────────────────────────┼─────────────────────────────────────────────┤
│ 6. Candidate Comparison        │ Side-by-side comparative ranking workspace │
│    Workspace                   │ for selecting the production-grade PR.     │
└────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 3. Investigation Scenarios

### Case 1: The Cryptographic Auth Service PR (`PR-101`)
- **Prompt:** *"Write a fast Node.js helper function to verify RS256 authentication tokens and cache the public keys."*
- **Candidate A Output:** Imports `@auth/jwt-auto-verify-v2` and passes `cacheTtlSeconds: 3600`.
- **Ground Truth Evidence:**
  - npm registry returns `404 Not Found`.
  - TypeScript compiler logs `TS2307: Cannot find module '@auth/jwt-auto-verify-v2'`.
- **Findings:** Phantom package, hallucinated parameter, unsupported "zero-overhead" claim.

### Case 2: Database Migration & Deployment Plan (`PR-102`)
- **Prompt:** *"Provide zero-downtime deployment steps for adding the non-null `organization_id` column to `users`."*
- **Candidate B Output:** Restarts background workers before running `ALTER TABLE users ADD COLUMN organization_id UUID NOT NULL;`.
- **Ground Truth Evidence:**
  - PostgreSQL runtime crash: `ERROR: column "organization_id" contains null values`.
  - Cites non-existent "PostgreSQL RFC-8812".
- **Findings:** Incorrect sequence, fake RFC documentation citation, missing table schema/row volume context.

### Case 3: Rate Limiter Guard Implementation (`PR-103`)
- **Prompt:** *"Write a TypeScript function to check if a user request is within allowed rate limits."*
- **Candidate C Output:**
  ```typescript
  export function isRateLimited(currentRequests: number, maxAllowed: number): boolean {
    if (currentRequests < maxAllowed) {
      return true; // Bug: Inverted logic!
    }
    return false;
  }
  ```
- **Ground Truth Evidence:** Unit tests fail (`currentRequests: 2, maxAllowed: 100` returns `true`).
- **Findings:** Inverted boolean boundary, authoritative tone masking flawed logic, unsupported thread-safety claim.

### Case 4: Multi-Candidate Evaluation & Comparative Ranking (`PR-104`)
- **Candidate A:** Disables RLS, performs checks in client JavaScript (Security Critical Defect).
- **Candidate B:** Uses PostgreSQL parameterized RLS policy `auth.uid() = user_id`, strict Zod schema validation, handles null checks (Optimal: 96%).
- **Candidate C:** Enables RLS but uses raw unparameterized SQL concatenation (SQL Injection Risk: 62%).
- **Ranking:** Candidate B (1st) &rarr; Candidate C (2nd) &rarr; Candidate A (3rd / Rejected).

---

## 4. Assessment Suites & Pass Criteria

- **Visible Test Suite (40%):** 6 visible rules (`VIS-01` through `VIS-06`).
- **Hidden Test Suite (60%):** 8 hidden rules (`HID-01` through `HID-08`).
- **Pass Threshold:** $\ge 90\%$.
- **Competency Emitted:** `AIE-00` (Practicing &rarr; Verified).
