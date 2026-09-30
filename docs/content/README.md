# Content Engineering & Authoring

## 1. Purpose

The `/docs/content` documentation domain establishes the standards, workflows, templates, and review processes for authoring instructional content, interactive MDX lessons, coding exercises, test harnesses, and competency rubrics.

---

## 2. Ownership

- **Lead Owner:** Content Engineering Lead
- **Secondary Stakeholders:** Curriculum Architect, Technical Writers, Lead Instructors
- **Review Cadence:** Sprint-based per module authoring cycle

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `mdx-authoring-guide.md` | Lesson Formatting | MDX syntax, custom components (Callouts, CodePlaygrounds, DiffViewers), typography | Active |
| `exercise-template-spec.md` | Coding Challenges | Standard JSON/TypeScript structure for exercise starter code, solution, and test suites | Active |
| `rubric-standards.md` | Assessment Rubrics | Objective criteria definitions for grading coding artifacts and architecture submissions | Active |
| `asset-management.md` | Media & Diagrams | Guidelines for architecture diagrams (Mermaid, SVG), images, and embedded interactive sandboxes | Active |
| `content-qa-checklist.md` | Review Checklist | Quality assurance verification before publishing content to production seeds | Active |

---

## 4. Exercise Content Structure

Every exercise authored for the platform follows a strict structure:

```json
{
  "slug": "zod-schema-contract-validation",
  "title": "Zod Schema Contract Validation",
  "instructions": "Implement strict input validation for user registration payloads...",
  "starter_code": "import { z } from 'zod';\n\nexport const RegisterSchema = z.object({\n  // TODO\n});",
  "test_harness": "import { describe, it, expect } from 'vitest';\n...",
  "solution_code": "import { z } from 'zod';\n\nexport const RegisterSchema = z.object({\n  email: z.string().email(),\n  password: z.string().min(8)\n});",
  "competencies": ["SDD-01"]
}
```

---

## 5. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/curriculum`](file:///home/gamp/Documents/lms/docs/curriculum/README.md) — Syllabus requirements, learning objectives, and competency mappings.
- **Downstream Consumers:**
  - [`/docs/database`](file:///home/gamp/Documents/lms/docs/database/README.md) — Seeding into `lessons`, `exercises`, and `gate_requirements`.
  - Frontend Exercise & Lesson Renderers (`features/exercises/`, `features/learning/`).
