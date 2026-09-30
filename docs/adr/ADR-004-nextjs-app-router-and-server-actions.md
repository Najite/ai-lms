# ADR-004: Next.js App Router & Server Actions for Fullstack

## Status
**ACCEPTED** (2026-09)

## Context
The platform requires fast server-side rendering for curriculum and syllabus pages, low latency client interactivity for interactive code sandboxes and gate submissions, and tight integration with Supabase SSR session handling.

## Decision
We utilize **Next.js 15 (App Router)** with React 19, TypeScript, and Tailwind CSS.
- Route Handlers (`app/api/*`) are implemented for public and external JSON REST APIs.
- Next.js Server Actions (`features/*/actions/*`) are implemented for mutation workflows with instant cache revalidation (`revalidatePath`).
- Client components use Zustand stores for interactive UI state management and React hooks with standard cleanup lifecycles.

## Consequences
### Positive
- Unified fullstack TypeScript codebase with shared type contracts.
- Server Actions simplify mutation workflows without boilerplate manual fetch and token passing.
- High performance streaming and server-side authentication checks.

### Trade-offs & Mitigations
- Server Actions must validate caller sessions and input data strictly with Zod schemas.
- Route handlers enforce explicit JSON error envelopes.
