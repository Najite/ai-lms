# CLAUDE.md: AI Assistant Engineering & Architectural Guidelines

> **Brutal Honesty Mandate**: This repository hosts an enterprise-grade, multi-tenant AI-Native Learning Management System. When generating or modifying code for this project, you must adhere strictly to these engineering standards. You are forbidden from introducing generic SaaS templates, AI slop, bloated third-party dependencies, or unstructured code.

---

## 1. Core Principles & Philosophy

1. **Strict Design System Fidelity**: Every visual element must strictly follow [DESIGN.md](file:///home/sawacha/lms/DESIGN.md). Never invent ad-hoc colors, arbitrary border radii, or loose shadow tokens. Use the defined CSS variables (`--color-canvas`, `--surface-1`, `--border-standard`, `--brand-primary`, etc.).
2. **Zero AI Slop**: Do not generate purple/cyan ambient gradient meshes, spinning 3D glass spheres, frosted blur overload (`backdrop-blur-3xl`), cartoon doodles, or marketing buzzword headlines ("Supercharge your potential").
3. **High-Density Mechanical Minimalism (Banning Consumer Whitespace Voids)**: Enforce tool-grade mechanical minimalism (zero decorative debt, 100% technical utility). Strictly avoid Apple/Notion-style sparse voids or hidden menus. Maintain maximum information density: prioritize code snippets, terminal execution traces, concrete AST grading indicators, and structured roadmap data over empty decorative padding.
4. **Keyboard-Native Accessibility**: Ensure every interactive component has explicit keyboard shortcuts, visible focus states (`ring-1 ring-brand-primary`), and valid ARIA attributes satisfying WCAG 2.1 AA.
5. **Type Safety & Separation of Concerns**: All components must be strictly typed with TypeScript. Business logic, data models, and UI rendering must remain clean and decoupled.

---

## 2. Frontend Tech Stack Specifications

Refer to [project.md](file:///home/sawacha/lms/project.md) for firm technology selections.

| Layer | Decision | Usage Rules |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | Server Components by default. Use `'use client'` only when state, event listeners, or browser APIs are required. |
| **Styling** | Tailwind CSS + CSS Variables | Configure Tailwind to consume CSS variables from `DESIGN.md`. Avoid arbitrary values like `bg-[#123456]` in JSX; use semantic tokens (`bg-surface-1`, `border-standard`). |
| **Component Primitives** | shadcn/ui (Radix UI) | Clean, accessible primitives customized with Linear hairline borders and obsidian surfaces. |
| **Icons** | Lucide React | Use crisp, 1.5px stroke width icons (`strokeWidth={1.5}`) sized to 14px–18px. |
| **Code Display** | Monaco Editor / Shiki | Syntax highlighting with obsidian theme. No low-contrast code themes. |
| **State Management** | Zustand (Client), TanStack Query v5 (Server) | Do not introduce heavy Redux or unnecessary contexts. |
| **Typography** | Inter + Geist Mono / JetBrains Mono | Configure variable font loaders in Next.js `layout.tsx`. |

---

## 3. Project Directory Architecture

```
/home/sawacha/lms/
├── DESIGN.md                          # Source of truth for design tokens & component blueprints
├── CLAUDE.md                          # This file: engineering instructions for AI agents
├── SKILL.md                           # Reusable agent skill for UI component generation
├── curriculum.md                      # 500-lesson engineering curriculum
├── project.md                         # Enterprise project architecture & technical specification
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, fonts, metadata, global styles
│   │   ├── page.tsx                   # High-density landing page
│   │   ├── curriculum/                # Deep curriculum explorer routes
│   │   └── api/                       # tRPC / API routes
│   ├── components/
│   │   ├── landing/                   # Atomic landing page sections
│   │   │   ├── Navbar.tsx             # Hairline sticky header with ⌘K search
│   │   │   ├── Hero.tsx               # High-impact engineering hero + live telemetry
│   │   │   ├── CurriculumExplorer.tsx # Interactive 15-phase roadmap matrix
│   │   │   ├── IdePreview.tsx         # Dual-pane Monaco + AST test runner console
│   │   │   ├── ArchitectureTrace.tsx  # RAG vector retrieval pipeline visualization
│   │   │   ├── BenchmarkMatrix.tsx    # Brutal honesty comparison table
│   │   │   ├── CapstoneGrid.tsx       # 22 enterprise projects showcase
│   │   │   ├── TerminalCta.tsx        # Keyboard-first terminal prompt CTA
│   │   │   └── Footer.tsx             # Minimal engineering footer
│   │   ├── ui/                        # Reusable atomic design system primitives
│   │   │   ├── button.tsx             # Linear-style button with bevel highlight
│   │   │   ├── badge.tsx              # Monospace status and phase tags
│   │   │   ├── card.tsx               # Hairline bordered obsidian card
│   │   │   ├── kbd.tsx                # Keyboard shortcut keycaps
│   │   │   └── dialog.tsx             # Accessible modal dialogs
│   │   └── shared/                    # Layout wrappers, theme providers
│   ├── lib/
│   │   ├── curriculum-data.ts         # Structured parser for curriculum.md data
│   │   ├── utils.ts                   # Class name merger (clsx + tailwind-merge)
│   │   └── constants.ts               # Global telemetry & navigation constants
│   └── styles/
│       └── globals.css                # CSS variables and baseline typography rules
```

---

## 4. Component Implementation Rules

### 4.1 Surface & Border Pairing Standard
Never render a surface without an accompanying hairline border. Contrast on dark surfaces must be razor-sharp:
- **Default Card**: `bg-surface-1 border border-border-standard`
- **Hovered Card**: `hover:bg-surface-2 hover:border-border-emphasis transition-colors duration-150`
- **Active / Selected Item**: `bg-brand-surface border-brand-border text-text-primary`

### 4.2 Button Architecture
Buttons must follow the Linear mechanical aesthetic:
- **Primary**: Lavender (`bg-brand-primary text-white`), 1px inset highlight (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]`), hover: `bg-brand-hover`, active: `bg-brand-active`.
- **Secondary**: Obsidian surface (`bg-surface-2 text-text-secondary border border-border-standard`), hover: `bg-surface-3 border-border-emphasis text-text-primary`.
- **Ghost**: Transparent (`hover:bg-surface-1 text-text-muted hover:text-text-primary`).
- **Typography**: Medium weight (`font-medium`), tracking tight (`tracking-tight`), icon sizing 14px–16px.

### 4.3 Monospace Badges & Chips
Status indicators must use monospace fonts for technical clarity:
- Always format curriculum tags as: `PHASE 01 • LESSON 042`.
- Use semantic colors with matching 12% opacity surface backgrounds:
  - Passed / Completed: `text-semantic-success bg-semantic-success-surface border-semantic-success/20`
  - In Progress: `text-brand-primary bg-brand-surface border-brand-border`
  - Warning: `text-semantic-warning bg-semantic-warning-surface border-semantic-warning/20`

---

## 5. Coding Style & Quality Standards

1. **TypeScript Strictness**:
   - Explicit types for all props and function returns.
   - No `any` types. Use proper generics or unknown with type guards.
2. **Performance Optimization**:
   - Zero layout shift (specify dimensions for all containers and media).
   - Use CSS transforms (`transform`, `translate3d`, `opacity`) for animations; never animate `width`, `height`, or `margin`.
   - Lazy-load heavy components (e.g., Monaco Editor, complex interactive graphs).
3. **Accessibility (WCAG 2.1 AA Checklist)**:
   - Every button and link must have an accessible name (`aria-label` when icon-only).
   - High text contrast: minimum 4.5:1 for body text, 3:1 for large display headers against dark canvas (`#010102`).
   - Full keyboard navigability: `tabIndex={0}`, custom `onKeyDown` handlers for custom interactive widgets.
4. **Copywriting Standards**:
   - Never use marketing hyperbole ("unleash", "game-changing", "effortless", "seamless").
   - Use precise engineering vocabulary ("deterministic AST analysis", "sub-100ms vector search", "zero hallucinations", "SIMD memory alignment").

---

## 6. Pre-Commit Verification Checklist for Frontend Changes

Before claiming any frontend task is complete:
- [ ] Visual inspection matches the Linear design spec in `DESIGN.md`.
- [ ] No rainbow gradients or glowing blur blobs are present.
- [ ] All colors use CSS variables / semantic Tailwind classes.
- [ ] Mobile and tablet layouts do not overflow horizontally.
- [ ] Keyboard navigation works (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
- [ ] Zero TypeScript errors (`tsc --noEmit` clean).
- [ ] Zero lint warnings or console errors.
