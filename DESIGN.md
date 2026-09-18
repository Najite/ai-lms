# DESIGN.md — Better Stack × Evervault Design System Specification

This document defines the official design system for **AI:NATIVE OS**, following the `DESIGN.md` specification from [getdesign.md](https://getdesign.md/). All coding agents and engineers must adhere to these tokens, component patterns, and aesthetic constraints to prevent generic "AI slop".

---

## 1. Design Philosophy: High-Density Observability

1. **Information Density over Empty Space**:
   * Engineers value seeing the file tree, Monaco editor, live test traces, and token metrics simultaneously.
   * Never pad containers with giant, empty whitespace. Use compact 12px/16px paddings and 13px/14px body typography.
2. **Structural 1px Borders over Fuzzy Drop Shadows**:
   * Windows and panels are defined by crisp, high-contrast `1px solid var(--border-subtle)` lines.
   * Avoid generic fuzzy, floating drop shadows. Panels should feel like physical, flush instrumentation consoles.
3. **Restrained Telemetry Accents**:
   * 90% of the surface is deep obsidian and slate.
   * Bright neon colors are strictly semantic:
     * **Emerald (`#10b981`)**: Tests green, cluster healthy, 99.99% SLA.
     * **Rose (`#f43f5e`)**: P0 outage, failing assertion, red-team breach.
     * **Amber (`#f59e0b`)**: Token budget warnings, XP rewards, streaks.
     * **Cyan (`#06b6d4`)**: Active focus, interactive handles, primary actions.
     * **Violet (`#8b5cf6`)**: Socratic Ghost reflections, multi-agent nodes.
4. **No AI Slop Rule**:
   * ❌ No pastel rainbow gradients.
   * ❌ No cartoon floating illustrations.
   * ❌ No bloated `rounded-3xl` cards.
   * ❌ No unformatted text dumps.
   * ✅ Real code diffs, real AST visualizers, real terminal outputs, real latency ms counters.

---

## 2. Color Palette & Semantic Tokens

```css
:root {
  /* Surfaces & Backgrounds */
  --color-background: #07080b;          /* Deepest obsidian black */
  --color-surface-subtle: #0a0c11;      /* Secondary canvas */
  --color-surface: #0e1017;             /* Main card, panel & drawer surface */
  --color-surface-elevated: #151822;    /* Modal, tooltip & dropdown surface */
  --color-surface-hover: #1b1f2c;       /* Button hover & active list item */

  /* Structural Borders */
  --color-border-subtle: #1e222e;       /* Default 1px card & panel border */
  --color-border-muted: #2a3041;        /* Focused or hover state border */
  --color-border-accent: #3e4760;       /* Active focus ring */

  /* Typography */
  --color-text-primary: #f8fafc;        /* High-contrast crisp white */
  --color-text-secondary: #94a3b8;      /* Readable slate for body & docs */
  --color-text-muted: #64748b;          /* Secondary metadata & timestamps */
  --color-text-code: #e2e8f0;           /* Monospace editor & terminal text */

  /* Telemetry Status Accents */
  --color-status-pass: #10b981;         /* Emerald: Passing tests, healthy DB */
  --color-status-warn: #f59e0b;         /* Amber: Token warnings, streak fire */
  --color-status-fail: #f43f5e;         /* Rose: Failing test, P0 outage alarm */
  --color-status-cyan: #06b6d4;         /* Cyan: Primary action, active tab */
  --color-status-violet: #8b5cf6;       /* Violet: Socratic agent, NotebookLM */
}
```

---

## 3. Typography & Hierarchy

Following Better Stack’s official typography standards:

| Role | Font Family | Size | Weight | Tracking | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `Geist Sans`, sans-serif | 32px / 40px | 600 (Semi-bold) | `-0.035em` | `1.12` |
| **Section Heading** | `Geist Sans`, sans-serif | 20px / 24px | 600 (Semi-bold) | `-0.02em` | `1.25` |
| **Card Header** | `Geist Sans`, sans-serif | 14px / 15px | 600 (Semi-bold) | `-0.01em` | `1.35` |
| **Body Text** | `Geist Sans`, sans-serif | 13px / 14px | 400 (Regular) | `normal` | `1.55` |
| **Code & Editor** | `Geist Mono`, monospace | 12px / 13px | 400 (Regular) | `normal` | `1.5` |
| **Telemetry Badges**| `Geist Mono`, monospace | 10px / 11px | 600 (Semi-bold) | `+0.04em` | `1.0` |

---

## 4. Spacing & Spatial Rhythm

* **Grid Basis**: Strict 4px / 8px spatial grid.
* **Corner Radius**:
  * Badges & Micro-tags: `rounded-sm` or `rounded-[4px]`.
  * Buttons & Inputs: `rounded-[6px]`.
  * Cards & Modals: `rounded-lg` or `rounded-[8px]`.
  * **Rule**: Never use `rounded-2xl` or `rounded-3xl`.
* **Borders**:
  * Always explicit: `1px solid var(--color-border-subtle)`.
  * Multi-pane dividers: `border-r border-[#1e222e]` or `border-b border-[#1e222e]`.

---

## 5. Component Patterns

### 5.1 Telemetry Header & Breadcrumbs
* Better Stack uses compact monospace breadcrumbs:
  `Websites / Developer Tools / Better Stack` with subtle separators (`opacity: 0.5`).
* Status indicators feature a pulsating green or red dot (`animate-telemetry`):
  ```tsx
  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#1e222e] bg-[#0e1017] text-[10px] font-mono text-slate-400">
    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-telemetry" />
    <span>SUPABASE: ACTIVE</span>
  </div>
  ```

### 5.2 Better Stack Window Chrome (Mock Window)
* Top bar with 3 window controls (gray/dark dots), a central monospace address bar (`yoursite.com`), and an internal high-contrast code sandbox.

### 5.3 Active Tab Underline
* Active navigation tabs use an inset box-shadow underline:
  `box-shadow: inset 0 -2px 0 var(--color-cyan)`.

### 5.4 High-Density Data Tables & Telemetry Panels
* Table rows with crisp `border-b border-[#1e222e]` dividers, hover row highlights (`bg-[#151822]`), and right-aligned monospace metric columns.

---

## 6. Implementation Reference

The tokens and styles in this specification are implemented directly in:
* [`src/app/globals.css`](file:///home/gamp/Documents/lms/src/app/globals.css): CSS variables and custom scrollbars.
* [`src/components/Navbar.tsx`](file:///home/gamp/Documents/lms/src/components/Navbar.tsx): Header telemetry, streak indicators, and active view switcher.
* [`src/components/CustomQuestNode.tsx`](file:///home/gamp/Documents/lms/src/components/CustomQuestNode.tsx): Better Stack card borders and CS vs. AI tags.
* [`src/components/ContextFlamegraph.tsx`](file:///home/gamp/Documents/lms/src/components/ContextFlamegraph.tsx): Telemetry waterfall and context allocation bars.
* [`src/components/LandingPage.tsx`](file:///home/gamp/Documents/lms/src/components/LandingPage.tsx): High-converting developer landing page with the browser mock window and interactive mini-IDE.
