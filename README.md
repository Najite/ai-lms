# AI-Native Software Engineering Academy — LMS Core Foundation

An enterprise-grade, high-rigor Learning Management System foundation engineered for the AI-Native Software Engineering Academy.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19, Server Components)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict mode, explicit path aliases)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Theme:** Aura Design System (Dark-mode first, HSL tokens, WCAG 2.2 AAA compliant)
- **Database & Auth:** [Supabase](https://supabase.com/) (`@supabase/ssr` with cookie session handling)
- **Validation:** [Zod](https://zod.dev/) (Runtime environment & schema assertions)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Hydration-safe UI stores)
- **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
- **Animation & Charts:** [Framer Motion](https://www.framer.com/motion/) & [Recharts](https://recharts.org/)

---

## 📁 Directory Structure

```
lms/
├── app/                  # Next.js App Router (Layouts, pages, error boundaries, middleware)
├── features/             # Feature-first domain modules (self-contained slices)
├── shared/               # Cross-cutting shared modules & components
├── components/           # Core design system primitives (ui/, feedback/)
├── providers/            # React Context providers (Theme, RootProviders)
├── hooks/                # Reusable headless UI & browser hooks
├── services/             # Base API and HTTP abstraction layer (ApiClient)
├── lib/                  # Core runtime libraries (Supabase, Logger, Utils, Errors)
├── schemas/              # Base validation primitives & pagination schemas
├── types/                # Global TypeScript declarations & utility contracts
├── stores/               # Root Zustand stores & hydration-safe wrappers
├── constants/            # Global application constants & HTTP status codes
├── config/               # Validated environment configuration & site metadata
├── docs/                 # Architectural specifications & engineering guidelines
└── tests/                # Unit, integration, and E2E test suites
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js `20.x` or `22.x` (LTS recommended)
- npm `10.x`+

### 2. Installation
```bash
git clone <repository-url>
cd lms
npm install
```

### 3. Environment Configuration
Copy the example environment template:
```bash
cp .env.example .env.local
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality & Verification Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launch local development server |
| `npm run build` | Compile production build |
| `npm run typecheck` | Execute TypeScript compiler check (`tsc --noEmit`) |
| `npm run lint` | Run ESLint across all directories |
| `npm test` | Run Vitest unit test suite |
| `npm run test:coverage` | Run unit tests with V8 code coverage report |
| `npm run format` | Format entire codebase with Prettier |
| `npm run format:check` | Check code formatting without writing |

---

## 📜 Architectural Rules
Refer to [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DEVELOPMENT_GUIDELINES.md](docs/DEVELOPMENT_GUIDELINES.md) for full layer boundaries, state management policies, and security rules.
