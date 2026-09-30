# ADR-001: Core Technology Stack & Framework Selection

## Status
**ACCEPTED** (2026-09)

## Context
The AI-Native Software Engineering LMS requires a modern, high-performance, fullstack web foundation capable of delivering rapid Server-Side Rendering (SSR) for educational curriculum content, low-latency client-side reactivity for code execution sandboxes and interactive state machines, and end-to-end type safety across client, server, and datastore boundaries.

## Decision
We adopt a unified TypeScript fullstack ecosystem:
1. **Core Framework**: Next.js 15 (App Router) with React 19.
2. **Language & Validation**: TypeScript 5 (Strict Mode) with Zod runtime schema validation.
3. **Styling & Design System**: Tailwind CSS with custom curated HSL dark-theme tokens and Lucide React icons.
4. **State Management**: Zustand for isolated client feature stores.
5. **Backend Datastore**: Supabase PostgreSQL 15+ with native Row-Level Security (RLS).
6. **Testing Harness**: Vitest with JSDOM and React Testing Library.

## Alternatives Considered
- **Vite SPA + Node.js Express/NestJS API**: Separating frontend and backend into distinct repositories introduced contract drift, duplicate TypeScript interfaces, and CORS/cookie complexity for auth sessions.
- **Remix / React Router v7**: Strong fullstack primitives, but lacks the mature ecosystem, edge caching optimizations, and Vercel/Supabase native integration depth of Next.js 15 App Router.
- **Tailwind with component libraries (MUI / Chakra)**: Heavy runtime bundle overhead and difficulty customizing dark glassmorphic aesthetics.

## Tradeoffs
- **App Router Learning Curve**: Server vs. Client Component boundaries require disciplined hook hygiene (`let ignore = false` cleanup routines) and explicit separation of server actions.
- **Framework Coupling**: Next.js Server Actions and Route Handlers couple application routing closely to the Next.js runtime.

## Risks
- **Next.js Breaking Changes**: Version upgrades across Next.js / React 19 might introduce breaking changes in server actions or caching defaults.
- **Mitigation**: Locked dependency versions, comprehensive automated test suites (`npx vitest run`), and strict linting.

## Consequences
- Single language across the entire engineering surface (TypeScript fullstack).
- Seamless end-to-end type inference from database tables to UI components.
- Zero-overhead server-side rendering for marketing, syllabus, and lesson pages with sub-800ms P95 page load times.
