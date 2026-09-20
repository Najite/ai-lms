---
name: lms-frontend-design
description: Design, build, and review high-density, anti-slop frontend components for the AI-Native LMS following the Linear design system specification. Use when creating landing pages, curriculum navigators, terminal previews, or dashboard interfaces.
---

# LMS Frontend Design Skill: Linear Precision Engineering

This skill provides step-by-step operational workflows, design token recipes, and component templates to build high-performance, accessible, and information-dense interfaces for the AI-Native Learning Management System.

Follow this skill to ensure **zero AI slop**, **zero generic landing page clichés**, and complete adherence to [DESIGN.md](file:///home/sawacha/lms/DESIGN.md) and [CLAUDE.md](file:///home/sawacha/lms/CLAUDE.md).

---

## 1. When to Activate This Skill

Activate this skill whenever you are asked to:
- Build, style, or refactor any frontend page, layout, or component for the LMS.
- Create landing page sections (Hero, Navigation, Curriculum Explorer, IDE Preview, RAG Trace, Benchmarks, Capstones, CTA, Footer).
- Implement interactive student dashboard components, code editors, or grading consoles.
- Review or audit frontend code for visual design quality, typography, spacing, and anti-slop compliance.

---

## 2. Mandatory Design Constraints

Every component you design or implement must satisfy these non-negotiable rules:

1. **Obsidian Canvas Grounding**: Base canvas is always `--color-canvas` (`#010102`). Never use pure `#000000` or washed-out grays (`#1f2937`).
2. **Hairline Border Rule**: Every card, container, and window must have a 1px border (`#23252a` or `--border-standard`). No borderless floating blocks.
3. **Single Restrained Chromatic Accent**: Linear Lavender (`#5e6ad2`) is used exclusively for primary CTAs, active states, and focal points. Never use rainbow gradients or saturated multi-color accents.
4. **High-Density Mechanical Minimalism**: Adhere strictly to tool-grade mechanical minimalism (zero decorative debt, maximal utility) rather than consumer minimalism (empty voids, hidden text). Always deliver concrete, dense technical data (e.g., lesson IDs `PHASE 01 // L024`, AST assertions `PASSED (14/14)`, exact CLI commands, benchmark matrices).
5. **No AI Slop**: Strict ban on:
   - Floating glowing blurred spheres (`blur-3xl bg-purple-500/20`).
   - Frosted glass overload (`backdrop-blur-2xl` on content cards).
   - Cartoon illustrations or 3D isometric graphics.
   - Vague marketing fluff words ("Supercharge", "Unleash", "Game-changing").

---

## 3. Core Design Token Quick Reference

### Colors & Surfaces
```css
--color-canvas: #010102;     /* Canvas base */
--surface-0: #08090a;        /* Gutters, recessed wells */
--surface-1: #0f1011;        /* Cards, section blocks */
--surface-2: #141516;        /* Card hovers, dialogs */
--surface-3: #18191a;        /* Code containers, terminal inner */
--surface-4: #1e2023;        /* Tooltips, popovers */

--border-subtle: #1c1d22;
--border-standard: #23252a;
--border-emphasis: #34343a;
--border-active: #5e6ad2;

--text-primary: #f7f8f8;
--text-secondary: #d0d6e0;
--text-muted: #8a8f98;
--text-tertiary: #62666d;

--brand-primary: #5e6ad2;
--brand-hover: #6f7cf0;
--brand-surface: rgba(94, 106, 210, 0.12);
--brand-border: rgba(94, 106, 210, 0.35);

--semantic-success: #10b981;
--semantic-warning: #f59e0b;
--semantic-error: #f43f5e;
--semantic-cyan: #06b6d4;
```

### Geometry & Shadows
```css
--radius-xs: 4px;      /* Keyboard keycaps, micro badges */
--radius-sm: 6px;      /* Standard buttons, input controls */
--radius-md: 8px;      /* Cards, menu dropdowns */
--radius-lg: 12px;     /* Terminal windows, main containers */
--radius-pill: 9999px; /* Status chips */

--shadow-bevel: inset 0 1px 0 0 rgba(255, 255, 255, 0.06);
--shadow-card: 0 1px 2px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
```

---

## 4. Standard Component Recipes

### Recipe A: Linear Primary Action Button
```tsx
export function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-150 rounded-[6px] bg-[#5e6ad2] hover:bg-[#6f7cf0] active:bg-[#4e5ac0] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]/50 focus:ring-offset-2 focus:ring-offset-[#010102]"
    >
      {children}
    </button>
  );
}
```

### Recipe B: Secondary Obsidian Surface Button
```tsx
export function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#d0d6e0] transition-all duration-150 rounded-[6px] bg-[#141516] hover:bg-[#18191a] hover:text-[#f7f8f8] border border-[#23252a] hover:border-[#34343a] focus:outline-none focus:ring-1 focus:ring-[#5e6ad2]"
    >
      {children}
    </button>
  );
}
```

### Recipe C: Monospace Technical Status Chip
```tsx
export function StatusChip({ status, label }: { status: 'success' | 'brand' | 'warning' | 'error'; label: string }) {
  const styles = {
    success: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30',
    brand: 'text-[#5e6ad2] bg-[#5e6ad2]/10 border-[#5e6ad2]/30',
    warning: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30',
    error: 'text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/30',
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
```

### Recipe D: Hairline Obsidian Card with Inset Bevel
```tsx
export function ObsidianCard({ title, subtitle, badge, children }: { title: string; subtitle?: string; badge?: string; children?: React.ReactNode }) {
  return (
    <div className="relative p-5 rounded-[8px] bg-[#0f1011] hover:bg-[#141516] border border-[#23252a] hover:border-[#34343a] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.3)] group">
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06] rounded-t-[8px]" />
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-medium text-[#f7f8f8] tracking-tight group-hover:text-white">
          {title}
        </h3>
        {badge && (
          <span className="text-xs font-mono text-[#8a8f98] px-2 py-0.5 rounded bg-[#18191a] border border-[#23252a]">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-[#8a8f98] leading-relaxed mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}
```

### Recipe E: Interactive Terminal Output Box
```tsx
export function TerminalSnippet({ command, output }: { command: string; output: string[] }) {
  return (
    <div className="rounded-[12px] bg-[#08090a] border border-[#23252a] overflow-hidden font-mono text-xs shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1011] border-b border-[#23252a]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#23252a]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#23252a]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#23252a]" />
          <span className="ml-2 text-xs text-[#8a8f98]">bash // test_suite_runner</span>
        </div>
        <span className="text-[11px] text-[#10b981] font-mono">AST Rubric: Passed (14/14)</span>
      </div>
      <div className="p-4 space-y-1.5 text-[#d0d6e0]">
        <div className="flex items-center gap-2 text-[#5e6ad2]">
          <span className="select-none text-[#8a8f98]">$</span>
          <span>{command}</span>
        </div>
        {output.map((line, idx) => (
          <div key={idx} className="text-[#8a8f98] leading-relaxed">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Step-by-Step Implementation Workflow

When building any LMS component:

1. **Verify Token Mapping**: Never write raw hex values directly in custom CSS. Map them to Tailwind tokens or CSS variables.
2. **Structure Semantic HTML**:
   - Use `<header>`, `<main>`, `<section>`, `<nav>`, `<article>`, `<footer>`.
   - Ensure proper heading levels (`<h1>` for Hero, `<h2>` for sections, `<h3>` for cards).
3. **Layer the Dark Surface**:
   - Canvas: `#010102`
   - Card: `#0f1011`
   - Well/Snippet: `#18191a` or `#08090a`
   - Border: `#23252a`
4. **Implement Keyboard Navigation**:
   - Add focus indicators: `focus-visible:ring-1 focus-visible:ring-[#5e6ad2]`.
   - Support `Escape` on dialogs/drawers.
   - Use `<kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#18191a] border border-[#23252a] text-[#8a8f98]">⌘K</kbd>`.
5. **Audit Against Anti-Slop Rules**:
   - Are there any purple/pink gradient backgrounds? (Remove them).
   - Are there floating blurred bubbles? (Remove them).
   - Is there any fluffy marketing copy? (Replace with exact engineering facts).
