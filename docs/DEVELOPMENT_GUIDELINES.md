# Engineering & Development Guidelines

## 1. Code Standards & Typing

- **TypeScript Strict Mode:** All code must pass `tsc --noEmit` with zero errors. Avoid `any`; use `unknown` with Zod validation assertions (`assertValidData`).
- **ESLint & Prettier:** Run `npm run lint` and `npm run format:check` before committing.
- **Pure Functions & Immutability:** Write deterministic, side-effect-free helpers wherever possible.

## 2. State Management Guidelines (Zustand)

- **Server State vs. Client State:** Use React Server Components (RSC) and server actions for server-side state. Use Zustand exclusively for client-side ephemeral UI state (e.g. modals, active sidebars, theme).
- **Hydration Safety:** Use `useSafeStore` when reading persisted Zustand state on the client to avoid SSR hydration warnings.

## 3. Error Handling & Structured Logging

- Use structured error classes from `@/lib/errors/app-error`:
  - `DomainError`: Business rule violations.
  - `ValidationError`: Zod schema failures.
  - `NotFoundError`: Missing resources.
  - `UnauthorizedError` / `ForbiddenError`: Access violations.
- Always use `logger` from `@/lib/logger` instead of `console.log` in production-facing code.

## 4. Testing Standards

- **Unit Tests:** Place in `tests/unit/` or adjacent `*.test.ts` files. Run with `npm test`.
- **Target Coverage:** Maintain $\ge 85\%$ branch coverage across all business logic and service clients.
