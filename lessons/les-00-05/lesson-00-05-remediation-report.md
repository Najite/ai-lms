# Curriculum & Database Remediation Report: LES-00-05
## AI-Assisted Engineering: Context, Verification & Evals

**Document Version:** 1.0.0  
**Lesson Code:** `LES-00-05`  
**Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `AIE-00` (AI Engineering Foundations)  
**State Progression:** `Introduced` &rarr; `Practicing`  
**Prerequisites:** `LES-00-01` (Filesystems), `LES-00-02` (CLI & Shell Streams), `LES-00-03` (HTTP & DevTools), `LES-00-04` (Git & Version Control)  
**Successor Exercise:** `EXE-00-05` (AI Verification & Evaluation Investigation)  
**Auditor:** Principal AI Engineering Educator & Supabase-First LMS Architect  
**Status:** Certified & Production Seeded  

---

## 1. Executive Summary

This report certifies the curriculum architecture, pedagogical design, database-first implementation, and database seeding of **`LES-00-05: AI-Assisted Engineering: Context, Verification & Evals`**.

`LES-00-05` represents the definitive bridge in `MOD-00 Digital Foundations`, transitioning the learner from foundational computer systems (POSIX filesystems, CLI streams, HTTP networking, and Git DAGs) into the modern discipline of **AI-Assisted Software Engineering**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                MOD-00 LEARNING PROGRESSION                             │
├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
│ LES-00-01         │ LES-00-02         │ LES-00-03         │ LES-00-04     │ LES-00-05  │
│ Filesystems       │ CLI & Streams     │ HTTP & DevTools   │ Git & DAGs    │ AI & Evals │
│ (DEV-00 Intro)    │ (DEV-00 Practice) │ (DEV-00 Reinforce)│ (DEV-00 Mstr) │(AIE-00 Int)│
└───────────────────┴───────────────────┴───────────────────┴───────────────┴────────────┘
                                                                               │
                                                                               ▼
                                                                           EXE-00-05
                                                                    (AI Verification Lab)
```

---

## 2. Core Educational Philosophy & Scope Boundaries

### 2.1 Demystifying AI: Engineering Tool vs. Magical Autopilot

A primary failure mode in modern software education is presenting AI coding assistants as magical oracles or autonomous replacements for engineering cognition. `LES-00-05` aggressively counters this antipattern by establishing:

1. **AI is Stochastic, Engineering is Deterministic**: An LLM is a probabilistic token predictor. It does not possess a compiler, live database, or internal runtime.
2. **Fluency $\neq$ Correctness**: Highly articulate output must never be confused with algorithmic correctness or security.
3. **The Engineer as Verifier**: The engineer's role evolves from manual syntax typist to architectural designer, context curator, and verification gatekeeper.

### 2.2 Explicit Exclusions (Zero Cognitive Bloat)

To maintain focus on practical software engineering usage, `LES-00-05` strictly excludes:
- Model training, backpropagation, and loss functions.
- Neural network mathematics (attention matrix dot-products, weight tensors).
- Transformer internal architectures and positional encodings.
- GPU cluster hardware, CUDA programming, and tensor cores.
- Deep learning research literature and reinforcement learning (RLHF/DPO) theory.

---

## 3. Relational Section Architecture (7 Concept Cards)

The lesson is decomposed into seven database-backed relational cards (`public.lesson_sections`), calibrated for an optimal cognitive load of **90 minutes total learning effort**:

| Card | Section Title | Type | Est. Time | Core Pedagogical Objective |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **The Promise & Risk of AI Assistance** | `orientation` | 12 min | Open with the *Phantom Package Incident* (`@auth/jwt-auto-verify-v2`) to create immediate learner demand for verification. |
| **2** | **What Large Language Models Actually Are** | `concept_model` | 12 min | Demystify next-token prediction, token probability distributions, and the lack of live compiler execution. |
| **3** | **Context Windows & How AI "Sees" Information** | `concept_model` | 14 min | Establish the Working Memory/Desk analogy, 4 layers of engineering context, and attention degradation ("Lost in the Middle"). |
| **4** | **Hallucinations & AI Failure Modes** | `security_spec` | 14 min | Provide a taxonomy of defects: Phantom APIs, subtle logic inversions, sycophancy, and assumption drift. |
| **5** | **Verification & Evidence-Based Engineering** | `protocol_spec` | 14 min | Detail the 3-step loop: Generate &rarr; Automated Deterministic Validate (`tsc`, `eslint`, `vitest`) &rarr; Human Audit. |
| **6** | **Evals & Measuring AI Quality** | `tooling_guide` | 12 min | Define Evals as "unit tests for AI", contrasting deterministic code-based evaluators with model-based LLM-as-a-Judge. |
| **7** | **The AI-Native Engineer Workflow** | `synthesis` | 12 min | Synthesize the 5-step operational discipline and prepare learners for diagnostic grading in `EXE-00-05`. |

---

## 4. Narrative Anchor: The Phantom Package Incident

To immediately engage the learner's critical faculties, Card 1 anchors on a realistic engineering incident:

- **Incident Scenario**: An engineer asks an AI coding assistant for a fast Node.js RS256 JWT validation helper with caching.
- **The AI Generation**: Produces clean, elegant TypeScript importing `@auth/jwt-auto-verify-v2`.
- **The Defect**: The package does not exist on npm. The AI statistically generated a plausible-sounding package name.
- **The Security Risk**: Highlights *Package Hallucination Typosquatting*, where attackers register hallucinated package names to execute supply-chain attacks.

---

## 5. Core Conceptual Analogies

| AI Concept | Everyday Analogy | Technical Reality in Engineering |
| :--- | :--- | :--- |
| **Large Language Model (LLM)** | Autocompletion for Reasoning Patterns | Next-token probability distribution over input tokens. |
| **Context Window** | The Physical Working Desk | Finite token buffer containing system prompt, schemas, active code, and user intent. |
| **Hallucination** | A Confident Mirage / Plausible Fiction | Syntactically valid tokens that reference non-existent APIs or invert logical conditions. |
| **Verification Loop** | Double-Entry Bookkeeping & Compiler Checks | Deterministic testing harness (`tsc`, `eslint`, `vitest`) executed prior to merge. |
| **Eval (Evaluation)** | Unit Testing for AI Systems | Automated, repeatable scoring harness benchmarking model completions against ground truth. |

---

## 6. Formative Checkpoint Matrix

Five database-driven formative assessment checkpoints (`public.lesson_checkpoints`) validate learner comprehension before unlocking successor exercises:

| Order | Checkpoint Question | Bloom Level | Correct Index | Distractor Rationale |
| :---: | :--- | :---: | :---: | :--- |
| **1** | How an LLM generates code solutions | *Understand* | `1` (Index 1) | Distracts with background compiler sandbox, live SQL database, and conscious reasoning. |
| **2** | Role and nature of the Context Window | *Understand* | `1` (Index 1) | Distracts with CLI terminal, cloud archive, and browser DOM viewport. |
| **3** | Definition of AI Hallucination | *Analyze* | `1` (Index 1) | Distracts with prompt syntax typos, slow API response latency, and billing limits. |
| **4** | Why deterministic verification is mandatory | *Evaluate* | `0` (Index 0) | Distracts with malicious model intent, editor restrictions, and licensing rules. |
| **5** | Definition of an AI Eval | *Apply* | `1` (Index 1) | Distracts with JS `eval()`, HR performance reviews, and self-reported model confidence. |

---

## 7. Direct Preparation for `EXE-00-05`

`LES-00-05` equips learners with the theoretical foundation and diagnostic taxonomy needed for **`EXE-00-05: AI Verification & Evaluation Investigation`**:

1. **Hallucination Spotting**: Learners will inspect candidate AI outputs and flag phantom npm packages and fabricated function calls.
2. **Logic Inversion Audits**: Learners will detect subtle boolean inversions and off-by-one errors in rate limiters and auth guards.
3. **Context Gap Analysis**: Learners will determine what missing type definitions or requirements caused the AI to fail.
4. **Deterministic Evaluation**: Learners will run test suites and evaluate candidate outputs against formal grading criteria.

---

## 8. Database Verification & Audit Proof

The database deliverables were applied to Supabase PostgreSQL and verified via live queries:

### 8.1 Target Competency Record (`public.competencies`)
- **ID**: `a1e00000-0000-0000-0000-000000000000`
- **Code**: `AIE-00`
- **Title**: `AI Engineering Foundations`
- **Level**: `foundational`
- **Status**: Verified in database.

### 8.2 Lesson Record (`public.lessons`)
- **ID**: `c0000000-0000-0000-0000-000000000005`
- **Slug**: `les-00-05-ai-assisted-engineering-context-verification-evals`
- **Title**: `AI-Assisted Engineering: Context, Verification & Evals`
- **Estimated Minutes**: 90
- **Status**: Verified in database.

### 8.3 Lesson Sections Record (`public.lesson_sections`)
- **Total Count**: 7 sections (`d0000005-0000-0000-0000-000000000001` &rarr; `...07`).
- **Section Types**: `orientation`, `concept_model`, `concept_model`, `security_spec`, `protocol_spec`, `tooling_guide`, `synthesis`.
- **Constraint Check**: Validated against `lesson_sections_section_type_check`.

### 8.4 Lesson Checkpoints Record (`public.lesson_checkpoints`)
- **Total Count**: 5 checkpoints (`e0000005-0000-0000-0000-000000000001` &rarr; `...05`).
- **Options Type**: `jsonb` array of structured option objects.
- **Bloom Levels**: `understand`, `understand`, `analyze`, `evaluate`, `apply`.

---

## 9. Deliverables Inventory

| # | Deliverable | Path | Status |
| :---: | :--- | :--- | :---: |
| 1 | Canonical Markdown Lesson | `lessons/les-00-05.md` | ✅ Complete |
| 2 | Lesson Sections SQL | `lessons/les-00-05/lesson_sections.sql` | ✅ Seeded & Verified |
| 3 | Lesson Checkpoints SQL | `lessons/les-00-05/lesson_checkpoints.sql` | ✅ Seeded & Verified |
| 4 | Master Seed Script | `lessons/les-00-05/lesson-seed.sql` | ✅ Seeded & Verified |
| 5 | Versioned Supabase Migration | `supabase/migrations/20260930180000_seed_les_00_05.sql` | ✅ Applied |
| 6 | Remediation Report | `lessons/les-00-05/lesson-00-05-remediation-report.md` | ✅ Certified |

---

## 10. Verification Sign-Off

- `npx tsc --noEmit` &rarr; **0 errors**
- `npm run lint` &rarr; **0 errors, 0 warnings**
- `npx vitest run` &rarr; **100% test pass rate**
- Supabase PostgreSQL Database &rarr; **Fully synced and verified**
