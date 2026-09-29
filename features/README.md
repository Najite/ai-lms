# Feature-First Architecture Guide

The LMS codebase strictly follows a **Feature-First Domain Structure**. All domain-specific capabilities are organized into isolated slices under the `features/` directory.

## Feature Folder Structure

Each feature slice must follow this strict organization:

```
features/<feature-name>/
├── components/          # Feature-specific UI components (e.g. LessonViewer, GateCard)
├── hooks/               # Feature-specific React hooks (e.g. useGateProgress)
├── services/            # Feature-specific API and database services
├── stores/              # Feature-specific Zustand stores (if client state is needed)
├── schemas/             # Feature-specific Zod validation schemas
├── types/               # Feature-specific TypeScript declarations
└── index.ts             # Public API boundary (only export what other features need)
```

## Boundary Rules

1. **Feature Isolation:** Feature `A` cannot reach into the internal implementation files of Feature `B`. Feature `A` may only import from `features/B/index.ts`.
2. **Layering Direction:**
   ```
   app/ (Routes & Pages)
     ↓
   features/ (Domain Feature Slices)
     ↓
   shared/ | components/ui/ | services/ | stores/ | lib/ (Core Substrate)
   ```
3. **No Direct Database Calls in UI Components:** UI components must call services or server actions, never raw database or external APIs directly.
