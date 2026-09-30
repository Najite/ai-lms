# Canonical Module Blueprint Specification Template
# AI-Native Software Engineering Academy (`ai-native-lms`)

**Document Version:** 1.0.0  
**Status:** Canonical Authoritative Blueprint Standard  
**Authority:** Master Instructional Designer & Curriculum Systems Architect  
**Classification:** Core Curriculum Standard  
**Target Repository:** `ai-native-lms`  
**Effective Date:** September 30, 2026

---

## Instructions for Module Authors

This document defines the **mandatory structural template** and **automated validation rules** for all 14 curriculum modules (`MOD-00` through `MOD-13`) in the AI-Native Software Engineering Academy.

Every module blueprint authored for this academy MUST instantiate every section defined below. Incomplete blueprints, stub sections, missing validation invariants, or unmapped competencies will be rejected by the automated curriculum linter.

---

```
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                           MODULE BLUEPRINT METADATA BLOCK                              ║
╠══════════════════════════════╦═════════════════════════════════════════════════════════╣
║ Module Identifier            ║ MOD-[XX] (e.g., MOD-03)                                 ║
║ Module Title                 ║ [Full Descriptive Engineering Title]                    ║
║ Curriculum Phase             ║ Phase [N]: [Phase Name] (Months [M]–[N])                ║
║ Target Capability Gate       ║ Gate [G]: [Gate Name]                                   ║
║ Recommended Pacing           ║ [N] Weeks ([Hours] Total Dedicated Study Hours)         ║
║ Lead Domain Bounded Context  ║ `domains/[domain_name]/`                                ║
║ Version & Status             ║ v1.0.0 (DRAFT / IN_REVIEW / PRODUCTION_READY)           ║
╚══════════════════════════════╩═════════════════════════════════════════════════════════╝
```

---

## 1. Module Purpose & Strategic Context

### 1.1 Industrial Context & Enterprise Rationale
- **The "Why This Matters" Narrative**: Explain the mission-critical enterprise engineering need this module addresses.
- **Catastrophic Failure Scenario**: Detail the real-world production incident, security exploit, or architectural collapse that occurs when software engineers lack the competencies taught in this module.

### 1.2 Learner Transformation Statement
- **Initial State**: What the learner knows, assumes, or struggles with prior to this module.
- **Target Transformed State**: The exact cognitive mental models, practical skills, and architectural instincts the learner possesses upon graduation from this module.

### 1.3 Strict Anti-Goals
List explicitly what is **deliberately NOT covered** in this module to protect cognitive bandwidth:
1. *Anti-Goal 1*: [E.g., "Advanced micro-frontend orchestration is excluded until MOD-10."]
2. *Anti-Goal 2*: [E.g., "Manual CSS layout hacks without CSS Grid/Flexbox primitives are prohibited."]

---

## 2. Competency Mapping & Traceability Matrix

Every module must map to one or more competencies from the [competency-framework.md](file:///home/gamp/Documents/lms/competency-framework.md). **Zero orphaned competencies are permitted.**

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                COMPETENCY TARGETING SPECIFICATION                                │
├───────────┬───────────────────────────────┬───────────────────┬──────────────────┬───────────────┤
│ Code      │ Competency Title              │ Inbound State     │ Outbound State   │ Weight Factor │
├───────────┼───────────────────────────────┼───────────────────┼──────────────────┼───────────────┤
│ [XXX-01]  │ [Primary Competency Title]    │ introduced        │ reinforced       │ 40%           │
│ [XXX-02]  │ [Secondary Competency Title]  │ unencountered     │ introduced       │ 30%           │
│ [XXX-03]  │ [Applied Architectural Comp]  │ reinforced        │ mastered         │ 30%           │
└───────────┴───────────────────────────────┴───────────────────┴──────────────────┴───────────────┘
```

### 2.1 Unbroken End-to-End Traceability Vector

```mermaid
graph LR
    classDef lrn fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef exe fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef art fill:#042f2e,stroke:#14b8a6,stroke-width:2px,color:#fff;
    classDef cap fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#fff;
    classDef por fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    L["Lesson: LES-[XX]-01"]:::lrn --> E["Exercise: EXE-[XX]-01"]:::exe
    E --> A["Artifact: ART-[XX]-01"]:::art
    A --> C["Module Capstone: MC-[XX]"]:::cap
    C --> P["Portfolio Asset: PORT-[XX]"]:::por
```

---

## 3. Prerequisite Gating & Readiness Checks

### 3.1 Hard Programmatic Gate Dependencies
Before a learner can unlock this module, the LMS capability engine must verify:
- **Prior Module Completion**: `MOD-[XX-1]` completed with all exercises $> 90\%$.
- **Prior Capability Gate**: `Gate [N-1]` sealed and validated.
- **Required Inbound Competencies**: All prerequisite competencies at their required minimum state.

### 3.2 Learner Diagnostic Pre-Flight Checklist
A 3-point self-diagnostic check presented to the learner upon entering the module:
- [ ] *Diagnostic 1*: [Can you explain X without referencing documentation?]
- [ ] *Diagnostic 2*: [Can you write a basic implementation of Y in the sandbox?]
- [ ] *Diagnostic 3*: [Have you completed all exercises in prerequisite module MOD-[XX-1]?]

### 3.3 Remediation Protocol
If a learner fails the pre-flight diagnostic:
- Direct routing to specific refresher exercises in `MOD-[XX-1]`.
- Remediation reading links to specific sections of prerequisite lessons.

---

## 4. Lesson Specifications (Structural Outlines)

*Note: This section specifies lesson architectures. Actual lesson prose is authored separately according to [content-standards.md](file:///home/gamp/Documents/lms/content-standards.md).*

### Lesson 1 Specification: `LES-[XX]-01: [Lesson Title]`
- **Word Count Target**: 900 to 1,500 words of rigorous technical prose.
- **Target Competencies**: `[XXX-01]`, `[XXX-02]`
- **Section 1: Industrial Hook & Prereqs**: [Define the enterprise incident / scenario].
- **Section 2: Interactive Sandbox Preview**: [Define the embedded REPL component].
- **Section 3: Guided Walkthrough**:
  - *Required Architecture Diagram*: [Mermaid Sequence / State / Flowchart].
  - *Annotated Code Snippet 1*: [Production-grade implementation pattern].
  - *Annotated Code Snippet 2*: [State transition or database query pattern].
- **Section 4: Core Mental Models & Runtime Mechanics**: [Under-the-hood memory/runtime mechanics].
- **Section 5: Failure Modes & Hallucination Analysis**: [Common anti-patterns and AI code hallucination traps].
- **Section 6: Lab Challenge Bridge**: [Direct segue to `EXE-[XX]-01`].

*(Repeat Lesson Specification structure for all lessons in the module, typically 3–5 lessons per module).*

---

## 5. Interactive Coding Exercises & Lab Specifications

Coding exercises must be evaluated by the Sandboxed Vitest Execution Engine defined in [assessment-engine-spec.md](file:///home/gamp/Documents/lms/assessment-engine-spec.md).

### Exercise 1 Specification: `EXE-[XX]-01: [Exercise Title]`
- **Target Competency**: `[XXX-01]` (Primary)
- **Challenge Type**: `Algorithm Implementation` | `Architectural Refactoring` | `Security Penetration Patch` | `Schema Migration`
- **Execution Runtime**: Sandboxed Node.js / Vitest VM (0.5 vCPU, 64MB RAM, 2,500ms timeout, zero egress).
- **Pass Threshold**: Weighted Score $\ge 90\%$; Zero TypeScript errors; Zero failed assertions.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TEST SUITE COMPOSITION SPECIFICATION                             │
├────────────────────┬──────────────────┬──────────────────────────────────────────────────────────┤
│ Test Category      │ Weight Factor    │ Test Description & Invariant Checked                     │
├────────────────────┼──────────────────┼──────────────────────────────────────────────────────────┤
│ Visible Test 1     │ 15%              │ Happy-path validation with standard input payloads.      │
│ Visible Test 2     │ 15%              │ Type contract adherence and expected return structure.   │
│ Visible Test 3     │ 10%              │ Synchronous/asynchronous lifecycle resolution.           │
├────────────────────┼──────────────────┼──────────────────────────────────────────────────────────┤
│ Hidden Test 1      │ 20%              │ Dynamic mutation / fuzz input (guards against hardcoding)│
│ Hidden Test 2      │ 20%              │ Malicious input, SQL/AST injection & boundary edge-cases │
│ Hidden Test 3      │ 20%              │ Memory / scale limit & high-iteration concurrency test.  │
└────────────────────┴──────────────────┴──────────────────────────────────────────────────────────┘
```

- **Mandatory Reflection Prompts**:
  1. *Architectural Trade-Off*: [Why is this solution preferred over a naive implementation?]
  2. *Failure Mode Diagnosis*: [Under what scale or race condition would this code break?]

*(Repeat Exercise Specification structure for all exercises in the module).*

---

## 6. Verifiable Artifact Specifications

Every module must produce tangible, cryptographically logged engineering artifacts:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MODULE ARTIFACT SPECIFICATION                                  │
├───────────┬─────────────────────────────┬─────────────────────────┬──────────────────────────────┤
│ Artifact  │ Deliverable Title           │ Deliverable Type        │ Verification Invariant       │
├───────────┼─────────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ ART-[XX]-1│ [E.g., Zod Validation Schema│ Production Code / File  │ Passes strict runtime parser │
│           │ for Tenant Gateway]         │                         │ with 100% type inference.    │
├───────────┼─────────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ ART-[XX]-2│ [E.g., Idempotent Migration │ PostgreSQL Migration SQL│ Executes cleanly with RLS    │
│           │ with Row-Level Security]    │                         │ enabled; zero data leaks.    │
├───────────┼─────────────────────────────┼─────────────────────────┼──────────────────────────────┤
│ ART-[XX]-3│ [E.g., Architectural        │ Markdown Document (ADR) │ Adheres to ADR-001 template  │
│           │ Decision Record (ADR)]      │                         │ with verified trade-offs.    │
└───────────┴─────────────────────────────┴─────────────────────────┴──────────────────────────────┘
```

- **Persistence Sink**: All artifact records logged to PostgreSQL `competency_evidence` and `portfolio_artifacts`.

---

## 7. Module Capstone Specification

The Module Capstone synthesizes all lessons, exercises, and competencies into an integrated micro-project.

### 7.1 Capstone Metadata
- **Capstone Identifier**: `MC-[XX]`
- **Capstone Title**: [E.g., Multi-Tenant Authentication & Session Management Gateway]
- **Target Gate Contribution**: Directly feeds into Capability `Gate [N]`.
- **Target Portfolio Tier**: Module Capstone Artifact.

### 7.2 The Industrial Engineering Scenario
- [Detailed 200–300 word real-world enterprise scenario describing the system to be engineered, existing legacy constraints, and target performance requirements].

### 7.3 Four Mandatory Portfolio Deliverables
1. **Public Git Repository**: GitHub repository with atomic commit history (minimum 15 commits).
2. **Live Cloud Deployment**: Hosted URL (Vercel/AWS/Railway) with health-check endpoint.
3. **Architectural Decision Record**: `docs/adr/ADR-[XX].md` documenting architectural rationale.
4. **Recorded Technical Defense**: 5–10 minute screencast walking through code, RLS policies, and tests.

### 7.4 Multi-Factor Evaluation Rubric

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                CAPSTONE EVALUATION RUBRIC MATRIX                                 │
├────────────────────┬──────────┬─────────────────────────────────┬────────────────────────────────┤
│ Evaluation Factor  │ Weight   │ Minimum Passing Standard        │ Flawless Mastery Standard      │
├────────────────────┼──────────┼─────────────────────────────────┼────────────────────────────────┤
│ 1. Correctness     │ 35%      │ 100% Vitest assertions green.   │ Comprehensive edge-case tests. │
├────────────────────┼──────────┼─────────────────────────────────┼────────────────────────────────┤
│ 2. Security & RLS  │ 25%      │ RLS enabled; all policies pass. │ Multi-tenant fuzz test green.  │
├────────────────────┼──────────┼─────────────────────────────────┼────────────────────────────────┤
│ 3. Architecture    │ 20%      │ Clean DDD separation in repo.   │ Zero circular dependencies.    │
├────────────────────┼──────────┼─────────────────────────────────┼────────────────────────────────┤
│ 4. Oral Defense    │ 20%      │ Clear architectural walkthrough.│ Defends trade-offs under QA.   │
└────────────────────┴──────────┴─────────────────────────────────┴────────────────────────────────┘
```

---

## 8. Blueprint Validation Rules & Compliance Gate

Before any module blueprint is accepted into the academy curriculum repository, it must pass the **Automated Module Blueprint Compliance Linter**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              MODULE BLUEPRINT VALIDATION RULES                         │
├────┬─────────────────────────┬─────────────────────────────────────────────────────────┤
│ #  │ Validation Rule         │ Verification Check / Invariant                          │
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 1  │ Zero-Orphan Invariant   │ Every targeted competency must map to $\ge 1$ lesson,   │
│    │                         │ $\ge 1$ exercise, and $\ge 1$ artifact.                 │
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 2  │ Word Count Rule         │ Every lesson specification must specify 900–1,500 words.│
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 3  │ Build-First Rule        │ All lessons must define the 6-stage instructional flow. │
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 4  │ Test Quality Invariant  │ Exercises must define $\ge 3$ visible and $\ge 3$       │
│    │                         │ hidden mutation tests. Zero regex / string matching.    │
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 5  │ Artifact Generation     │ Every module must produce $\ge 2$ verifiable artifacts. │
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 6  │ Capstone Deliverables   │ Capstones must mandate Git repo, Live URL, ADR, and     │
│    │                         │ video defense deliverables.                             │
├────┼─────────────────────────┼─────────────────────────────────────────────────────────┤
│ 7  │ Dependency Consistency  │ Inbound prerequisites must strictly match outbound      │
│    │                         │ competencies of prior modules in the DAG.               │
└────┴─────────────────────────┴─────────────────────────────────────────────────────────┘
```

---

### Blueprint Authorship Sign-Off
- **Instructional Lead**: `[Name / Lead Sign-Off]`
- **Domain Architect**: `[Name / Architect Sign-Off]`
- **Automated Linter Run ID**: `[CI/CD Execution SHA]`
- **Date Sealed**: `[YYYY-MM-DD]`
