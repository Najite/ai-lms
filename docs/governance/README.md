# Engineering Governance & Compliance

## 1. Purpose

The `/docs/governance` documentation domain defines the engineering standards, code review criteria, zero-regression policies, security controls, compliance mandates, and contribution protocols governing the codebase.

---

## 2. Ownership

- **Lead Owner:** Technical Program Manager & Head of Engineering
- **Secondary Stakeholders:** Principal Software Architect, Security Officer, Compliance Officer
- **Review Cadence:** Quarterly audit & policy review

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `zero-regression-rules.md` | Domain Isolation | Invariant rules preventing modification or refactoring of previously certified domains | Active |
| `code-review-standards.md` | PR Checklist | Criteria for Pull Request approvals: 100% test pass rate, 0 lint warnings, type safety | Active |
| `git-workflow.md` | Trunk-Based Dev | Branching strategy, conventional commit messages, and automated CI pipelines | Active |
| `security-compliance.md` | OWASP & GDPR | Data protection standards, user privacy, RLS verification, audit logging rules | Active |
| `dependency-management.md` | Package Governance | Vulnerability scanning, lockfile maintenance, and third-party library approval process | Active |

---

## 4. The Core Zero-Regression Invariants

When developing on the platform, engineers and automated agents MUST adhere to these non-negotiable rules:

1. **Certified Domains are Read-Only**: Once a domain is implemented and verified (Foundation, Auth, Learning, Competency, Exercise, Achievement & XP, Gates), its core architecture and schema must not be arbitrarily modified or refactored.
2. **Strict Bounded Context Isolation**: Domains must never directly mutate another domain's database tables or bypass service contracts.
3. **Continuous Test Enforcement**: Every PR must maintain a 100% pass rate across all unit, integration, and schema test suites (`npx vitest run`).
4. **Zero Type Errors & Zero Lint Warnings**: Code must compile cleanly with `npx tsc --noEmit` and pass `npm run lint` with 0 warnings.
5. **Auditable Artifact Requirement**: High-stakes operations (XP grants, gate completions, competency state promotions) must generate immutable audit records.

---

## 5. Dependencies & Relationships

- **Upstream Inputs:**
  - Academy Educational Philosophy & Security/Compliance Regulations.
- **Downstream Consumers:**
  - All engineering domains (`domains/*`, `features/*`, `app/*`).
  - CI/CD Automation & GitHub Action Workflows.
  - [`/docs/audits`](file:///home/gamp/Documents/lms/docs/audits/README.md) — Auditing and compliance reporting.
