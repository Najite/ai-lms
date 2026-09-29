# Architectural Specification & Layer Boundary Constitution

## 1. System Overview

The LMS platform is built on an enterprise-grade, modern Next.js 15 App Router architecture with Supabase SSR for persistence and auth, Zustand for client-side UI state, and Tailwind CSS + shadcn/ui for the design substrate.

## 2. Directory Taxonomy & Layer Boundaries

```
lms/
├── app/                  # Next.js App Router (Routing, Layouts, Error Boundaries, API Routes)
├── features/             # Isolated Domain Slices (Feature-First)
│   └── <feature>/
│       ├── components/   # Private UI components for this feature
│       ├── hooks/        # Private React hooks for this feature
│       ├── services/     # Feature-specific API and database services
│       ├── stores/       # Feature-specific Zustand stores (if required)
│       ├── schemas/      # Feature-specific Zod validation schemas
│       ├── types/        # Feature-specific TypeScript definitions
│       └── index.ts      # Public contract boundary
├── components/           # Core design system primitives (ui/, feedback/, layout/)
├── providers/            # React Context providers (Theme, RootProviders)
├── hooks/                # Reusable headless UI & browser hooks
├── services/             # Base API and HTTP abstraction layer
├── lib/                  # Core runtime libraries (Supabase, Logger, Utils, Errors)
├── schemas/              # Base validation primitives & pagination schemas
├── types/                # Global TypeScript declarations & utility contracts
├── stores/               # Root Zustand stores & hydration-safe wrappers
├── constants/            # Global application constants & HTTP status codes
├── config/               # Validated environment configuration & site metadata
├── shared/               # Cross-cutting shared modules
└── tests/                # Unit, integration, and E2E test suites
```

## 3. Dependency & Import Rules (The Four Laws)

1. **Law 1 (Downward Dependency Flow):**
   ```
   app/ (Pages & Handlers)
     ↓
   features/ (Domain Features)
     ↓
   components/ | services/ | stores/ | hooks/ (Foundation Substrate)
     ↓
   lib/ | schemas/ | types/ | constants/ | config/ (Core Primitives)
   ```
2. **Law 2 (Feature Encapsulation):** Feature `A` cannot reach into private subdirectories of Feature `B`. Imports must go through `@/features/B` (its `index.ts`).
3. **Law 3 (No Business Logic in UI):** React components must only handle presentation and user interactions. Domain logic, data fetching, and transformations must reside in `services/`, server actions, or custom hooks.
4. **Law 4 (No Circular Dependencies):** Shared types and schemas must reside in `@/types` and `@/schemas`, never imported circular across sibling feature directories.

## 4. Security & Data Isolation
- Supabase Server Client is instantiated with cookie stores in Server Components and Route Handlers.
- Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`) is strictly confined to server-only environments and never exposed to client bundles.
- All database operations are governed by PostgreSQL Row-Level Security (RLS) policies.
