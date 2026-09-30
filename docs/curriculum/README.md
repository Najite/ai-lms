# Curriculum & Learning Paths

## 1. Purpose

The `/docs/curriculum` documentation domain houses the formal curriculum specifications, syllabus roadmaps, module breakdowns, lesson sequences, and competency mapping tables for the AI-Native Software Engineering curriculum.

It serves as the definitive reference for what concepts are taught, in what sequence, with what exercises, and against what competency verification rubrics.

---

## 2. Ownership

- **Lead Owner:** Curriculum Architect
- **Secondary Stakeholders:** Lead Instructors, Assessment Engineers, Subject Matter Experts (SMEs)
- **Review Cadence:** Monthly sprint-based updates & quarterly syllabus audits

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `learning-paths.md` | Path Hierarchy | Full catalogue of Learning Paths: Foundations, AI Development, Fullstack, Cloud Native | Active |
| `module-catalogue.md` | Module Specs | Detailed breakdown of modules, prerequisites, estimated effort, and learning objectives | Active |
| `lesson-taxonomy.md` | Lesson Structure | Specification of interactive lessons, hands-on tutorials, conceptual deep dives | Active |
| `exercise-taxonomy.md` | Assessment Rubrics | Taxonomy of exercises: prompt crafting, refactoring, test-driven validation, bug fixing | Active |
| `competency-alignment.md` | Skill Mapping Matrix | Precise mapping connecting each lesson & exercise to defined Competencies (`CTX-01`, etc.) | Active |
| `gate-prerequisites.md` | Gate Thresholds | Exact requirement criteria for Level 1 through Level 7 Competency Gates | Active |

---

## 4. Curriculum Structure

The curriculum is organized hierarchically into three layers:

```
Learning Path (e.g. AI-Native Software Engineer)
└── Module (e.g. Modern Web Architecture & AI Tooling)
    └── Lesson (e.g. Zod Schema Contract Validation)
        ├── Interactive Exercise (e.g. zod-schema-contract-validation)
        └── Mapped Competencies (e.g. SDD-01 Schema-Driven Development)
```

---

## 5. Supported Capability Gates

1. **Gate 1: AI-Assisted Builder** (Prompting, Cursor/Copilot workflows, context grounding)
2. **Gate 2: Frontend Engineer** (Next.js App Router, Tailwind, Zustand, component testing)
3. **Gate 3: API Integrator** (REST/RPC contract design, authentication, OpenAPI/Zod)
4. **Gate 4: Data Model Designer** (PostgreSQL, Supabase RLS, relational modeling, migrations)
5. **Gate 5: Production Deployer** (CI/CD workflows, Docker, preview deployments, monitoring)
6. **Gate 6: System Architect** (Microservices, distributed messaging, caching, resilience)
7. **Gate 7: Enterprise Engineer** (Multi-tenancy, compliance, governance, auditability)

---

## 6. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/academy`](file:///home/gamp/Documents/lms/docs/academy/README.md) — Pedagogical goals, graduate competency profile.
- **Downstream Consumers:**
  - [`/docs/architecture`](file:///home/gamp/Documents/lms/docs/architecture/README.md) — Informs bounded context schema and service logic.
  - [`/docs/content`](file:///home/gamp/Documents/lms/docs/content/README.md) — Guides authoring of actual MDX lessons, code templates, and test harnesses.
  - [`/docs/database`](file:///home/gamp/Documents/lms/docs/database/README.md) — Data seeding for learning paths, modules, lessons, and exercises.
