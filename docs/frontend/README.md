# Frontend Architecture & Design System

## 1. Purpose

The `/docs/frontend` documentation domain details the frontend architecture, Next.js App Router structure, design tokens, component hierarchy, client state management (Zustand + React Hooks), and accessibility standards.

---

## 2. Ownership

- **Lead Owner:** Staff Frontend Engineer
- **Secondary Stakeholders:** UI/UX Designer, Design System Lead, Accessibility Specialist
- **Review Cadence:** Continuous per UI feature & sprint design review

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `design-system.md` | Design Tokens | Colors (HSL dark theme), typography, spacing, elevations, animations, glassmorphism | Active |
| `app-router-hierarchy.md` | Page Routing | Directory mapping for `app/` routes, layout nesting, loading states, and error boundaries | Active |
| `state-management.md` | Zustand & Hooks | Client store standards, custom hook lifecycles, and optimistic UI synchronization | Active |
| `component-catalogue.md` | Component Library | Core UI primitives (`components/ui/*`) and domain feature components (`features/*`) | Active |
| `accessibility-standards.md` | WCAG & A11y | Keyboard navigation, screen-reader semantics, ARIA attributes, color contrast rules | Active |

---

## 4. Frontend Architecture Pattern

The application utilizes a **Feature-Based Architecture**:

```
features/
├── auth/           # Login, registration, profile settings
├── learning/       # Path viewer, module navigator, lesson reader
├── competencies/   # Competency radar, category filter, mastery badges
├── exercises/      # Code editor, terminal runner, test feedback
├── achievements/   # Badge catalogue, XP balance widget, reward modal
└── gates/          # 7-level mastery roadmap, gate cards, proof upload modal
```

Each feature folder adheres to standard sub-modules:
- `components/` — Domain-specific React components.
- `hooks/` — Custom React data fetching and action hooks.
- `stores/` — Zustand stores for client-side state.
- `actions/` — Next.js Server Actions connecting to domain services.
- `types/` — Frontend view types and presentation contracts.
- `schemas/` — Client-side validation schemas.

---

## 5. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/api`](file:///home/gamp/Documents/lms/docs/api/README.md) — API contracts and Server Action shapes.
  - [`/docs/curriculum`](file:///home/gamp/Documents/lms/docs/curriculum/README.md) — Learning workflow and interaction patterns.
- **Downstream Consumers:**
  - App Router pages (`app/gates/page.tsx`, `app/achievements/page.tsx`, `app/learning/page.tsx`, etc.).
  - End-user learner portal and administrative interfaces.
