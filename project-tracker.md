# AI-Native LMS — Production & Industry-Standard Project Tracker

> **Revision 3 · audited 2026-09-23 · base commit `17d2ec0` (main) + uncommitted working tree**
> **Verified baseline (re-measured this session, not assumed):**
> `npx tsc --noEmit` → exit 0 · `npm run build` → exit 0 · `node --check public/workers/python-worker.js` → OK
> Bundle: `/` 21.5 kB page / **231 kB** First Load JS · `/dashboard` 50.5 kB page / **260 kB** First Load JS
>
> **Mission:** correct state management, honest verification, O(1) hot paths, a real 2G/offline story, and zero-slop UI/UX — enforced by evidence, not optimism.

---

## 0. How to read this document

| Mark | Meaning |
|---|---|
| **[DONE]** | Verified present in the working tree by direct inspection this session. |
| **[OPEN]** | Confirmed defect; the file and symbol below are cited from the current code. |
| **[DECISION]** | A product/architecture choice is needed before code is written. |

Rules this document obeys:

1. **No claim without evidence.** Every number below was measured this session against the live Supabase project (`lfsyndffrfwvdfzjsagl`) or the local working tree.
2. **No invented severity.** A finding is P0 only if it can silently corrupt learner data, fabricate a grade, leak privileged data, or cost a 2G user the product.
3. **No re-litigating closed items.** Section 1.3 records what was fixed and how it was re-verified.
4. **Every open item ends with an acceptance test** so "done" is falsifiable.

---
## 1. Verified ground truth (measured this session)

### 1.1 What the curriculum actually is

Measured with the live anon key against `curriculum_nodes` / `curriculum_phases`:

| Fact | Measured value | How measured |
|---|---|---|
| `curriculum_nodes` rows | **700** | `Prefer: count=exact` → `content-range: 0-0/700` |
| `curriculum_phases` rows | **14** | `content-range: 0-0/14` |
| Nodes per module | **50, every module identical** | grouped `order_index`: min 1 / max 50 / 50 distinct per phase |
| Node id prefixes | `node-0` … `node-14` (15 groups) | 13 × 50 + `node-13` × 20 + `node-14` × 30 = **700** |
| Module 14 composition | `node-13-1..20` (order 1-20) + `node-14-1..30` (order 21-50) | matches `PREFIX_MODULE_MAP` offsets 0 / 20 |
| Canonical `Lesson X.Y` titles | **700 / 700** | regex over every title |
| Title ↔ node-id **mismatches** | **exactly 1** | `node-3-22` (module-5) is titled `Lesson 2.22: CPython Compact Dict Internals` |
| Curated exercise catalog | **30 exercises across 17 distinct lessons** | `grep lessonId` → 30 rows, 17 unique |
| Exercise catalog coverage | **17 / 700 = 2.4 %** | derived |

**Conclusion — one numbering authority is already correct, and every user-facing total lies.**

- `PREFIX_MODULE_MAP` (15 prefixes → 14 modules) **matches the database exactly.** ✅
- `FIRST_LESSON_IDS` in `lib/progress-tracker.ts` lists **14** module-openers and matches module starts exactly. ✅
- The product ships **700 lessons / 14 modules**; the UI advertises **520**, **600**, **15 phases**, **"100% of Lessons"** coverage and **"18 Total Projects"**. All false.
- The single title mismatch is not cosmetic. `parseLessonCoordinates()` consults the **title regex first**, so `node-3-22` renders as *Module 2* in every surface that routes through it, while it physically lives in module 5 and unlocks as module 5. That is the whole of finding **CUR-01**.

### 1.2 What the state layer actually is

| Fact | Measured value |
|---|---|
| Store implementation | `lib/store.ts` — module singleton + `useSyncExternalStore` (587 lines). Not Zustand, despite `CLAUDE.md` §2 naming Zustand + TanStack Query. |
| Read paths | `subscribe` / `getSnapshot` / `getServerSnapshot` / `useAppStore(selector)` |
| Write paths | `markLessonCompleted`, `markExerciseCompleted`, `setLastActiveLessonId`, `saveVerifiedCapstone` |
| Persistence | 6 `localStorage` keys (`ai_lms_*`) + one key per lesson detail |
| Server sync | `queueOrSyncProgress` → `supabase.auth.getSession()` → `user_progress` upsert |
| Auth | **none.** No sign-in UI, no middleware, no `onAuthStateChange`. `getSession()` always yields `null`. |
| Consequence | every server write is unreachable dead code; **all progress is device-local.** |
| Raw `[#hex]` Tailwind classes | **1,658** — while a complete token system sits unused in `tailwind.config.ts` |
| `animate-*` usages | `fadeIn` ×15 (**undefined keyframe → dead class**), `spin` ×8, `pulse` ×3, `ping` ×1 |
| Dead modules | `lib/curriculum-data.ts`, `lib/enriched-handbooks.ts`, `components/dashboard/dashboard-nav.tsx` → **0 importers each** |
| App Router conventions | `app/` has only `layout.tsx`, `page.tsx`, `dashboard/`, `api/` — **no** `loading.tsx`, `error.tsx`, `not-found.tsx`, `manifest.ts`, `robots.ts`, `sitemap.ts`; `_not-found` exists only as the Next default |
| Service worker | **none.** `public/` = 13 JPGs (6.8 MB) + `workers/python-worker.js` |

### 1.3 Phase 0 — closed, and re-verified this session

| Item | Claim | Re-verified? |
|---|---|---|
| Sandbox cross-talk | `lib/sandbox/sandbox-controller.ts` multiplexes by `payload.id`, per-request watchdog, serialized FIFO, `failAll()` on crash | ✅ `pending: Map<id, PendingExecution>`; `handleMessage` filters on `this.pending.has(payload.id)` |
| Fabricated pass | `public/workers/python-worker.js` no longer returns SUCCESS without executing | ✅ missing runtime → `status: "UNVERIFIED"`, `runtime: "unavailable"`; `countAssertions()` derives real totals |
| Capstone self-verify | GitHub 403/429 → `503 verified:false` | ✅ |
| Grading webhook | real HMAC-SHA256, constant-time compare, 503 when secret unset | ✅ |
| Service-role leak | `lib/supabase.ts` reads only `NEXT_PUBLIC_*` | ✅ inert placeholders + `isSupabaseConfigured` |
| Dead privileged routes | `/api/curriculum`, `/api/lessons` deleted | ✅ absent from the build route table |
| `resume-hero` 3 MB select | `handbook_markdown` removed from the 600-row query | ✅ select is `id, title, phase_id, xp_reward` |
| Zoom lock | `maximumScale: 1` removed | ✅ `app/layout.tsx` |
| Store atomicity | queue dedupe + 200 cap + single-session batched upsert + `flushInFlight` | ✅ |
| Activity-log owner | the store is the only writer | ✅ |

**Corrections to revision 2 of this document (my own prior claims):**

| Prior claim | Measured reality | Action |
|---|---|---|
| "Catalog holds only **33** curated items" | **30** exercises over **17** distinct lessons | corrected in §1.1 |
| "Sorting **520** nodes ≈ 9k closure calls" | **700** nodes | corrected in §1.1 |
| "Demote the title regex to a fallback" | the map is already exactly correct; the regex is wrong for exactly **1** node | applied this session as **CUR-01** |
| Phase-1 line "Move `fetchLessonDetail` persistence to IndexedDB" | IndexedDB is not required to fix the defect; an LRU-evicted localStorage tier is sufficient and far lower risk for a browser compatibility floor that includes old Android WebViews | re-scoped to **NET-04** |

---

## 2. Audit matrix by dimension

| # | Dimension | Current state | Industry standard | Confirmed deficit | Pri |
|---|---|---|---|:--:|
| 1 | **State management** | hand-rolled singleton + `useSyncExternalStore`; **6 components each own a private copy** of the curriculum plus their own `isLoading` | one store, one cache, one subscription; derived state memoized | `fetchLiveCurriculum()` **blocks on the network even when the cache is warm**, so every view switch costs a 2G round trip even though the data is already on disk | **P0** |
| 2 | **Curriculum authority** | catalog + numbering helper exist; `PREFIX_MODULE_MAP` is correct | one authority; every displayed total derived from it | 700 real vs 520/600/15 advertised; 1 mis-numbered lesson; catalog covers 2.4 % of lessons while the UI claims 100 % | **P0** |
| 3 | **Verification integrity** | worker, capstone verifier and webhook all fail closed | never report success without executing | `UNVERIFIED` reaches the controller but **no UI branch renders it** — the learner sees a generic failure with no reason | **P1** |
| 4 | **Secrets / API surface** | public key only; dead routes gone | minimal authenticated surface | **no auth exists**, so the server-sync path is unreachable and "cross-device progress" is a claim, not a feature | **P0**/**DECISION** |
| 5 | **2G / offline** | tiered catalog/detail split, backoff, cache-first *reads* | cache-first **paint**, background revalidate, real offline shell | 700-node catalog is one blocking round trip; lesson details grow unbounded in `localStorage`; no SW/manifest; Pyodide ≈10 MB cold from a CDN | **P0** |
| 6 | **Time complexity** | `nodesMap` / `nodeIndexMap` exist | O(1) hot paths, memoized derived state, debounced input | per-render `O(rows × lessons)` unlock scans; filtered list rebuilt on every keystroke; whole 700-node index rebuilt per hydration | **P1** |
| 7 | **UI/UX & a11y** | dense Linear-style dark UI | tokenized, WCAG 2.1 AA, real loading/error/empty states | 1,658 raw hex classes bypass the tokens; `* { border-color }` global override; zero route-level `loading`/`error`; 15 dead `animate-fadeIn`; invented metrics and third-party logos | **P2** |
| 8 | **Docs drift** | `architecture.md` / `project.md` / `curriculum.md` describe a different product | docs == shipped behaviour | `curriculum.md` (744 kB) and `supabase/curriculum_manifest.json` both assert **15 phases / 600 lessons** while the DB has **14 / 700**; `architecture.md` promises an Edge-SSE Gemini-RAG tutor while `app/api/tutor/route.ts` is `runtime = "nodejs"` returning a 750-char excerpt | **P1** |

---

## 3. Findings

### 3.1 P0 — State management

**[OPEN] STATE-01 · `fetchLiveCurriculum()` is not stale-while-revalidate; it is fetch-then-block**
`lib/db-curriculum.ts:202`. With a warm cache and an online connection the function logs nothing, returns nothing, and falls through to the in-flight network request — the cached value is only returned when `navigator.onLine` is false:

```ts
if (!forceRefresh && memoryCachedCurriculum && inFlightCurriculumPromise === null) {
  if (typeof window !== "undefined" && !navigator.onLine) return memoryCachedCurriculum;
}
```

So the 700-node query (~100 kB of JSON) is re-issued on every mount of any of the six consumers, and each `await` gates that component's `isLoading`. On 2G every view switch is a spinner on data that is already in `localStorage`.
**Acceptance test:** with a warm cache and DevTools throttled to *Slow 3G*, switching dashboard tabs paints curriculum content on the **first** frame and the network tab shows at most one background revalidation per session.

**[OPEN] STATE-02 · Six independent owners of the same data**
`workspace-view.tsx:138`, `exercise-view.tsx:71`, `capstone-tracker.tsx:72`, `continue-learning-queue.tsx:105`, `activity-grid.tsx:66`, `curriculum-browser.tsx:50` each `await fetchLiveCurriculum()` inside a private `useEffect` with a private `isMounted` flag and private state. The store already solved this problem for progress; the curriculum has no equivalent.
**Acceptance test:** `grep -rn "fetchLiveCurriculum()" components/` returns **zero** hits — consumers subscribe to one hook.

**[OPEN] STATE-03 · Silent, unrecoverable progress loss on quota exhaustion**
`lib/store.ts:safeSetStorage` returns `false` on `QuotaExceededError` and the value is dropped on the floor. `markLessonCompleted` now propagates it, but nothing consumes it. A learner whose quota is exhausted completes lessons that are never persisted and receives no signal.
**Acceptance test:** filling `localStorage` to its limit then completing a lesson shows an explicit "progress not saved on this device" warning.

### 3.2 P0 — Curriculum, lessons and modules

**[OPEN] CUR-01 · Title regex outranks the verified node-id map**
`lib/curriculum-numbering.ts:parseLessonCoordinates` reads `Lesson X.Y` from `title` before consulting `PREFIX_MODULE_MAP`. Exactly one live node violates the convention — `node-3-22`, titled `Lesson 2.22: CPython Compact Dict Internals` in `module-5` — so the whole app renders it as *Module 2*. Besides being wrong, it **breaks the unlock chain**: the lesson unlocks against its true neighbours in module 5 while appearing in module 2.
**Acceptance test:** `parseLessonCoordinates("node-3-22", "Lesson 2.22: …").displayLesson === "Lesson 5.22"`.

**[OPEN] CUR-02 · Every user-visible total is a stale literal**
| Surface | Literal | Truth |
|---|---|---|
| `app/dashboard/page.tsx:137` header badge | `{n} / 520 Lessons` | 700 |
| `app/dashboard/page.tsx:246` footer | `520 Lessons // 14 Modules` | 700 // 14 |
| `components/dashboard/dashboard-sidebar.tsx:74` nav group | `CURRICULUM (520 LESSONS)` | 700 |
| `dashboard-sidebar.tsx:223` tutor blurb | `RAG Grounded in 520 Specs` | unverifiable |
| `dashboard-sidebar.tsx:234` progress row | `{n} / 520` | 700 |
| `components/landing/curriculum-browser.tsx:113` fallback | `totalLessons \|\| 520` | 700 |
| `components/dashboard/progress-matrix.tsx:118` badge | `6 PATHS ACTIVE // 520 LESSONS` | 700 |
| `components/dashboard/resume-hero.tsx:39,133,160` | `useState(600)`, "Browse Full 600 Lessons", `PHASES ACTIVE 15` | 700 / 14 |
| `app/page.tsx:53,100,143` | `600 Lessons`, comment "15 phases, 600 lessons, 3,000 subtopics" | 700 / 14 |
| `components/dashboard/capstone-tracker.tsx:964` | `18 Total Projects` | 22 capstones are defined in `lib/production-capstones.ts`; "18" matches nothing |
| `components/dashboard/exercise-view.tsx:227` | `COVERAGE 100% of Lessons` | **2.4 %** |

Note the two honest surfaces: `app/dashboard/page.tsx:163` already says *700 database lessons*, and `ProgressMatrix`'s six `totalLessons` sum to **150+100+100+100+50+200 = 700**, matching the DB exactly. The components are right; only the labels are stale.

**Acceptance test:** with the catalog loaded, no surface renders a lesson/module/capstone total that differs from the live catalog.

### 3.3 P1 — Time complexity (measured, not hand-waved)

| Hot path | Current complexity | Target | Where |
|---|---|---|---|
| Exercise list render | `O(R × (L + E))` per render — `isExerciseUnlocked()` does `completedLessonIds.includes()` **and** `completedExerciseIds.includes()` per rendered row | `O(R)` with two `Set` lookups | `elective-view` row loop at `exercise-view.tsx:312`; `isExerciseUnlocked` at `exercises-catalog.ts:1666` |
| Exercise filter | `O(R × T)` **per keystroke**, with `toLowerCase()` re-run on every item and on the query itself | `O(R)` + `useMemo`, lowercase query/needles once | `exercise-view.tsx:176-188` |
| Drill merge | `[...ladder, ...prev]` with no id keying → StrictMode/remount duplicates rows, which also inflates the two loops above | id-keyed `Map` merge | `exercise-view.tsx:87` |
| Catalog hydration | rebuilds `nodesMap` + `nodeIndexMap` + `nodesByPhase` in `O(N)` on every module evaluation; `JSON.parse` of ~100 kB on the main thread at boot | acceptable today (N=700) — keep, but never let it move into a render path | `db-curriculum.ts:156-189` |
| Track completion | `completedLessons.filter(id => prefixes.some(p => id.startsWith(p)))` → `O(C × P)` per render per track | `O(C)` with a single pass into a `Map<trackId, count>` | `progress-matrix.tsx:127-129` |
| Phase search | `phase.keyTopics.some(t => t.toLowerCase().includes(q))` per keystroke | `useMemo` + precomputed haystack | `curriculum-browser.tsx:75-82` |

`O(700)` is not the problem; **`O(700)` executed inside a render or a keystroke handler is.** The fix is memoization and set-indexing, not a different algorithm.

### 3.4 P1 — Correctness, races and resilience

**[OPEN] STATE-04 · Unguarded lesson-switch race** `workspace-view.tsx:handleSelectLesson` (line 187) is an unguarded async write. Clicking lesson A then B where A's `ensureLessonDetailLoaded` resolves last writes A's starter code into the editor while the header shows B. `continue-learning-queue` already uses a request token; this one does not.
**Acceptance test:** rapid A→B switching never leaves the editor holding A's starter code while B is active.

**[OPEN] NET-04 · `fetchLessonDetail` persistence is unbounded** `lib/db-curriculum.ts:399-403` writes one `localStorage` key per lesson (`ai_lms_lesson_detail_<id>`) forever. 700 lessons × 5-20 kB is 3.5-14 MB against a ~5 MB quota, and the failure is swallowed by `catch {}`.
**Acceptance test:** after browsing 60 lessons, `Object.keys(localStorage).filter(k => k.startsWith("ai_lms_lesson_detail_")).length <= 40` and eviction is oldest-first.

**[OPEN] VER-01 · The honest `UNVERIFIED` state is never rendered** `python-worker.js` correctly reports `runtime: "unavailable"` when Pyodide cannot load, but `exercise-view.tsx:160` and `workspace-view.tsx:255` fall through to a generic failure branch. On 2G/offline — the exact case the state exists for — a learner who solved the exercise correctly cannot tell a network problem from a logic error.
**Acceptance test:** blocking the Pyodide CDN shows "Unverified — Python runtime unavailable (offline)" and awards no completion.

**[OPEN] NET-05 · Pyodide cold cost dominates the product on 2G** `public/workers/python-worker.js` pulls Pyodide v0.25.0 (~10 MB) from jsDelivr with no SRI, no local mirror, no cache-first path and no progress affordance. The rest of the app was engineered around 2G; the one thing the user must actually do was not.
**Acceptance test:** a cold first `Run` on Slow 3G shows a determinate progress indicator, and the second run is served from the HTTP cache without re-downloading the runtime.

### 3.5 P2 — UI/UX, accessibility, honesty

- **[OPEN] UI-01 · the design system exists and is bypassed.** `tailwind.config.ts` defines `surface.0-4`, `border.{base,muted,active,highlight}`, `text.{primary..quaternary}`, `brand.{accent,hover,muted}`, `status.*`, `fontFamily`, `boxShadow`, `borderRadius`. The codebase uses **1,658** `[#hex]` arbitrary classes instead. `styles/globals.css` additionally sets `* { border-color: #23252a }`, which overrides per-utility border colours and makes `border-[#color]` unreliable.
- **[OPEN] UI-02 · dead animation class.** `animate-fadeIn` appears **15** times across `app/dashboard/page.tsx` (10), `workspace-view.tsx` (3), `skill-iq-card.tsx`, `exercise-formatter.tsx` — and no `fadeIn` keyframe or `animation` entry exists in `globals.css` or `tailwind.config.ts`. Ten dashboard view transitions are therefore un-animated, and a would-be-animated element that never animates is worse than none: it implies an intent the CSS does not fulfil.
- **[OPEN] UI-03 · no route boundaries.** Zero `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`. A render error in any of the 14 modules blanks the route to the Next default error page; a slow 2G catalog fetch shows nothing at all on a cold boot.
- **[OPEN] UI-04 · the 2G indicator is hidden from 2G users.** `components/ui/network-status-indicator.tsx:22` is `hidden sm:flex`, so the mobile-first low-bandwidth audience never sees it, and line 33 uses `animate-ping` — an infinite animation the repo's own `CLAUDE.md` §1.2 bans.
- **[OPEN] UI-05 · unverifiable social proof.** `components/landing/social-proof.tsx` renders Netflix/Apple/Meta/Google/Amazon/Airbnb/Stripe marks with no stated relationship; `testimonials.tsx` renders testimonials; `capstone-tracker.tsx:962` asserts `97.2% In-Demand`. **[DECISION]**
- **[OPEN] DOC-01 · docs assert a product that does not exist.** `supabase/curriculum_manifest.json` (`phases_count: 15`, `lessons_count: 600`, `subtopics_count: 3000`) and `curriculum.md` both contradict the live DB (14 / 700). `architecture.md` describes an Edge-SSE Gemini-RAG tutor; `app/api/tutor/route.ts` is `runtime = "nodejs"`, does a text search, interpolates the raw user query into a PostgREST `.or(...)` filter (filter injection), and returns a 750-char excerpt. `tailwind.config.ts` declares an Inter font stack that is never loaded (`globals.css` `body { font-family: -apple-system… }` overrides it).

---

## 4. What "industry standard" means here — and the best solution to each challenge

### 4.1 State management: one cache, one subscription, cache-first paint

The correct shape for this app is **a single client cache with synchronous reads + background revalidation**, not six `useEffect`s. `localStorage` is already the durable tier; the missing piece is a *subscription* so a revalidation can reach every mounted view.

```
                    ┌─────────────────────────────────────────────┐
                    │ lib/db-curriculum.ts  (single cache owner)   │
  localStorage ──▶  │  memoryCachedCurriculum  |  subscribers:Set  │
  (warm boot,       │  fetchLiveCurriculum(): cache-first resolve  │
   no network)      │  + fire-and-forget revalidate + notify()     │
                    └──────────────┬──────────────────────────────┘
                                   │ useSyncExternalStore
                    ┌──────────────▼──────────────────────────────┐
                    │ lib/curriculum-store.ts                     │
                    │  useCurriculumCatalog() -> { curriculum,    │
                    │    isLoading, isStale, refresh }            │
                    └──────────────┬──────────────────────────────┘
        ┌───────────────┬──────────┴────────┬───────────────┬──────────────┐
   resume-hero   curriculum-browser    exercise-view   workspace-view   capstone-tracker
```

Rules:

1. **`getSnapshot` must be referentially stable.** Return the stored object; only replace it on real change. (The store already learned this lesson — see `SERVER_SNAPSHOT`.)
2. **`getServerSnapshot` returns `null`,** and `useSyncExternalStore` is used rather than `useState(getLiveCurriculumSync())` — the latter produces a hydration text mismatch because module evaluation on the client populates the cache before the hydration render.
3. **Cache-first, never cache-only.** A warm cache resolves immediately *and* schedules exactly one revalidation (in-flight dedupe already exists).
4. **A cold cache may block.** There is nothing else to show, so `isLoading` is legible — but the route still needs `loading.tsx` so 2G users see a shell rather than white.

### 4.2 2G: what actually matters, in order of cost

| Rank | Cost on 2G | Mitigation |
|---|---|---|
| 1 | **Pyodide ≈ 10 MB** on first run | same-origin, SRI-pinned, `cache-control: immutable`, runtime-readiness gate, determinate progress; never start it before the learner presses Run |
| 2 | **Cold boot JS 231-260 kB** | keep the App Router split as-is; add a service worker so visit 2 is offline |
| 3 | **Catalog round trip (~100 kB)** | cache-first resolve; never re-block once warm; trim the catalog select to what renders |
| 4 | **Lesson detail (~4-20 kB)** | already on-demand ✅; add LRU eviction + `number` typed throughput-independent storage |
| 5 | **Every other request** | `withExponentialBackoff` + full jitter everywhere (currently only 2 of 5 call sites) |

The read path must never regress into "fetch to find out what to show". Every render decision must be answerable from memory or `localStorage`.

### 4.3 Time complexity: memoize, index, debounce — do not rewrite

- `Set` for membership (`completedLessons`, `completedExercises`) → turns the render hot loop from `O(R × (L+E))` into `O(R)`.
- `useMemo` for derived lists; precompute a lowercased search haystack once per item; `useDeferredValue`/debounce for the search input.
- One `Map<trackId, completedCount>` pass instead of `filter × some` per track.
- Never build an index inside a render. Build it when the cache is replaced.

### 4.4 Curriculum: one authority, derived totals

`PREFIX_MODULE_MAP` is authoritative (verified against all 700 rows). The title `Lesson X.Y` regex becomes a fallback for ids outside the map. All totals come from the catalog; where a surface genuinely cannot reach the catalog, it reads one exported, documented constant with a regeneration script — never a bare literal typed into JSX.

### 4.5 Verification: fail closed *and* fail legibly

`UNVERIFIED` must render as its own state, because on 2G it is the single most likely outcome. Silent under-reporting trains learners to distrust the grader exactly when the grader is being honest.

### 4.6 UI/UX

Keep the Linear density. Fix the foundation instead of the paint:

1. Codemod `[#hex]` → tokens, then delete `* { border-color }`.
2. Define the `fadeIn` keyframe (or delete the 15 usages) — never ship a class that resolves to nothing.
3. Add route-level `loading` / `error` / `not-found`; on 2G these are the difference between a product and a white screen.
4. Make the network indicator mobile-visible, `role="status"`, `aria-live="polite"`, and remove `animate-ping`.
5. Remove or substantiate every unverifiable metric and third-party logo. `CLAUDE.md` §1.3 already forbids the copy style that produced them.

---

## 5. Remediation roadmap

Each item names its **acceptance test**. A phase is complete only when `npx tsc --noEmit` and `npm run build` both exit 0 and every acceptance test in it passes.

### Phase 0 — Stop the bleeding — **COMPLETE** (see §1.3)

### Phase 1 — State management & 2G read path — **this session**

| ID | Item | Acceptance test |
|---|---|---|
| `STATE-01` | `fetchLiveCurriculum()` becomes true stale-while-revalidate: warm cache resolves **synchronously**, one background revalidation, subscribers notified on change | warm cache + Slow 3G ⇒ first paint has curriculum; ≤1 revalidation per session |
| `STATE-02a` | add `lib/curriculum-store.ts` → `useCurriculumCatalog()` on `useSyncExternalStore` with a stable snapshot and a `null` server snapshot | no hydration warnings; one subscription shared by all consumers |
| `STATE-02b` | migrate `curriculum-browser`, `activity-grid`, `continue-learning-queue` off their private `await fetchLiveCurriculum()` | `grep -rn "await fetchLiveCurriculum()" components/` shrinks to the two documented hold-outs |
| `CUR-01` | `PREFIX_MODULE_MAP` becomes authoritative; title regex demoted to fallback | `node-3-22` renders as `Lesson 5.22` |
| `CUR-02` | every hardcoded total replaced by a derived value or the documented `CURRICULUM_META` constant | no surface prints 520/600/15/18/100 % |
| `STATE-03` | quota failure sets a store flag that the dashboard surfaces | forcing quota exhaustion shows a persistence warning |
| `NET-04` | `fetchLessonDetail` cache gains LRU eviction with a bounded key count | ≤40 `ai_lms_lesson_detail_*` keys after browsing 60 lessons |
| `PERF-01` | exercise-view: `Set`-based unlock, memoized filter with one lowercase pass, `Map`-keyed drill merge | typing in the search box triggers no re-scan of completed sets; no duplicate drill ids after remount |
| `PERF-02` | `progress-matrix`: one `Map` pass instead of `filter × some` per track | a single `O(C)` pass per render |
| `STATE-04` | `workspace-view.handleSelectLesson` gains a request token | rapid A→B switch never shows A's starter code under B |
| `UI-04` | network indicator visible on mobile, `role="status"`, no infinite animation | visible at 360 px; no `animate-ping` |

### Phase 2 — Honest verification
- [ ] `VER-01` render `UNVERIFIED` as a first-class state in `exercise-view` / `workspace-view`; never credit completion
- [ ] `NET-05` same-origin, SRI-pinned, immutable-cached Pyodide with a runtime-readiness gate and determinate progress
- [ ] capstone rubric fails closed; add auth + rate limiting to `/api/capstone/verify`
- [ ] delete the dead `assertTrue`-style placeholders that could be mistaken for real assertions

### Phase 3 — Curriculum integrity & docs
- [ ] regenerate `supabase/curriculum_manifest.json` from the live DB (14 phases / 700 lessons / 50 per module)
- [ ] reconcile `curriculum.md`, `architecture.md`, `project.md`, `CLAUDE.md` §2 with the shipped stack (there is no Zustand, no TanStack Query, no Monaco, no Shiki)
- [ ] fix the one stale title in the database so title and map agree for all 700 rows
- [ ] add a CI assertion: node count per module is uniform and every id matches `node-\d+-\d+`

### Phase 4 — Complexity & dead code
- [ ] `CUR-03` debounce/`useDeferredValue` the two search inputs; precompute lowercased haystacks
- [ ] delete `lib/curriculum-data.ts`, `lib/enriched-handbooks.ts`, `components/dashboard/dashboard-nav.tsx`
- [ ] move catalog parsing off the import path (lazy hydrate on first paint)

### Phase 5 — UI/UX, a11y, resilience
- [ ] codemod 1,658 `[#hex]` classes to tokens; remove `* { border-color }`
- [ ] define or delete `animate-fadeIn` (15 sites)
- [ ] add `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`, `manifest.ts`, `robots.ts`, `sitemap.ts`
- [ ] service worker for a genuine warm-boot offline shell; load Inter through `next/font`
- [ ] re-encode/resize the 13 curriculum JPGs (6.8 MB) to WebP/AVIF with `next/image`

### Phase 6 — Decisions required before implementation

- [ ] **[DECISION] Auth** — Supabase Auth for real cross-device sync, *or* delete the server-sync path and state plainly that progress is device-local. Today the code implies the former and ships the latter.
- [ ] **[DECISION] Social proof** — remove the unverifiable logos/testimonials/`97.2%` metric, or substantiate each one.
- [ ] **[DECISION] Tutor** — implement the documented Edge-SSE grounded RAG, or correct `architecture.md` to describe the search-and-excerpt endpoint that exists. Either way, stop interpolating raw user input into a PostgREST filter.
- [ ] **[DECISION] Exercise coverage** — the catalog covers 17 of 700 lessons. Either generate the remaining ladders from `test_suite` (the `createExercisesFromNode` path exists) or relabel the UI honestly.

---

## 7. Audit update — 2026-09-24

This update was verified against the current working tree, not inferred from the previous tracker revision. The worktree already contains broad uncommitted changes; this audit did not revert or overwrite them.

### 7.1 Quality gates

| Check | Result | Meaning |
|---|---|---|
| `npm run typecheck` | **PASS** | TypeScript currently compiles with no diagnostics. |
| `npm run build` | **PASS** | Next production build completes; `/` and `/dashboard` compile. |
| `npm run lint` | **BLOCKED** | `next lint` starts an interactive ESLint setup and npm cannot resolve the generated ESLint 8 / `eslint-config-next` peer dependency tree. This is a repository setup defect, not a clean lint pass. |

### 7.2 Completed since the earlier plan

The following roadmap claims are now supported by the current code and should be treated as complete unless regression tests fail:

- `STATE-01` / `STATE-02a`: curriculum has a module-level cache, stable `useSyncExternalStore` subscription, cache-first warm reads, and one in-flight fetch.
- `STATE-02b`: dashboard consumers use `useCurriculumCatalog`; no component currently calls `await fetchLiveCurriculum()` directly.
- `CUR-01`: node-id mapping outranks the stale title regex; `node-3-22` maps to Module 5, Lesson 22.
- `CUR-02`: the principal dashboard totals now derive from the catalog or `CURRICULUM_META`.
- `NET-04`: lesson detail persistence has a bounded LRU path rather than one unbounded key per lesson.
- `PERF-01` / `PERF-02`: exercise membership uses `Set`s, exercise merging uses keyed `Map`s, and progress-track aggregation uses a single pass.
- `STATE-04`: workspace lesson selection has a request token guard.
- sandbox cross-talk prevention and fail-closed `UNVERIFIED` worker output are present, but their UI and lifecycle defects below remain open.

### 7.3 Open findings requiring implementation

#### P0 — user-visible curriculum misinformation

**`CUR-02b` — exercise copy contradicts its own coverage calculation.**
`components/dashboard/exercise-view.tsx` calculates coverage from the actual exercise set, but the explanatory paragraph still says every lesson has an active lab. The catalog contains 30 exercises across 17 lessons, not 700. This undermines learner trust and makes the coverage metric internally contradictory.

**Acceptance test:** the page states the measured coverage and never says every lesson has a lab unless the catalog actually proves that claim.

#### P1 — sandbox lifecycle race and promise leak

**`SANDBOX-01` — timeout recycling can start another queued execution before terminating the worker.**
In `lib/sandbox/sandbox-controller.ts`, the timeout callback calls `settle()`, which calls `drain()` while the old worker is still installed; only afterward does it call `disposeWorker()`. A queued request can therefore be posted to the worker that is immediately terminated, then be failed indirectly. `terminate()` also truncates `queue` without resolving those queued promises, so callers can wait forever.

**Acceptance test:** enqueue two executions, force the first to time out, and assert the second resolves with an explicit failure; call `terminate()` with queued work and assert every promise settles within one tick.

#### P1 — tutor endpoint is not the documented product and has unsafe query construction

**`TUTOR-01` — raw query interpolation into `.or(...)`.**
`app/api/tutor/route.ts` falls back to `.or(\`title.ilike.%${cleanQuery}%,handbook_markdown.ilike.%${cleanQuery}%\`)`. PostgREST filter syntax is user-controlled here; punctuation can change or break the filter, and the handler has no length limit, rate limit, authentication, or abuse budget. Use a parameter-safe search RPC / full-text query, cap and normalize input, and return a bounded result.

**`TUTOR-02` — fallback copy is false.**
The fallback claims 15 phases and 500 lessons, while the verified curriculum is 14 phases and 700 lessons. The route also runs on Node despite the comment and architecture docs describing Edge SSE / RAG behavior, and it streams a fabricated word-by-word response rather than model inference.

**Acceptance tests:** property-based or table-driven inputs containing PostgREST punctuation never alter query semantics; oversized queries are rejected; no response contains 15 phases, 500 lessons, or unsupported RAG claims; route documentation matches the deployed runtime.

#### P1 — honest verification is not yet visible to learners

**`VER-01` remains open.** The worker emits `UNVERIFIED` when Pyodide cannot load, but `workspace-view.tsx` and `exercise-view.tsx` route every non-success result through generic failure text. Offline and 2G users cannot distinguish unavailable infrastructure from incorrect code, and the UI must never award completion for this state.

**Acceptance test:** block the Pyodide request and verify a distinct unavailable-runtime message, no completion mutation, and a retry action.

#### P2 — production shell, accessibility, and low-bandwidth polish

- `UI-03`: add `app/loading.tsx`, `app/error.tsx`, and `app/not-found.tsx`; cold 2G must render a useful shell and recover from render errors.
- `UI-04`: `components/ui/network-status-indicator.tsx` is still `hidden sm:flex` and still uses infinite `animate-ping`; make status visible at mobile widths with `role="status"` and reduced-motion-safe styling.
- `UI-01`: raw hex Tailwind classes and the global `* { border-color: ... }` override remain widespread; migrate incrementally to semantic tokens with visual regression checks.
- `UI-02`: `animate-fadeIn` is still referenced without a configured keyframe; define it or remove the class.
- `NET-05`: Pyodide remains a remote CDN dependency with no explicit progress UI, integrity pinning, or same-origin cache strategy. Do not promise offline execution until this is measured on a cold and warm 2G profile.
- `DOC-01`: stale totals and unsupported claims remain in landing/tutor/dead navigation surfaces, including `600`, `520`, `15 phases`, and the assertion that every lesson has a lab. Delete dead surfaces or make them derive from the canonical catalog.

### 7.4 Execution order now

1. Fix the sandbox timeout/termination settlement contract and add focused tests before changing more UI; this is the clearest race condition.
2. Make tutor search parameter-safe and correct its fallback contract; add input-boundary tests.
3. Render `UNVERIFIED` distinctly and correct the exercise coverage copy.
4. Repair lint configuration so lint is non-interactive and reproducible in CI.
5. Add route boundaries and mobile network status, then measure cold/warm 2G behavior.
6. Migrate stale metrics and raw styling incrementally, with production build and visual checks after each slice.

### 7.5 Industry-standard conclusion

The project has a viable prototype foundation and now passes TypeScript and production compilation, but it is **not production-ready**. The strongest parts are the fail-closed sandbox intent, shared curriculum cache, bounded local persistence, and O(1) membership indexes. The blocking gaps are correctness and operational contracts: no authentication despite a server-sync path, unsafe tutor query construction, unresolved sandbox lifecycle promises, misleading curriculum/product claims, no route error/loading boundaries, and an unverified lint pipeline.

The best architecture is a small, explicit client state layer (progress store plus curriculum cache), server-authoritative persistence only after authenticated sessions exist, cache-first catalog/detail reads with bounded storage, serialized sandbox execution with a total promise-settlement invariant, and canonical curriculum metadata generated from the database. Every UX metric must be derived from that authority or removed. Do not introduce Zustand or TanStack Query merely to match stale documentation; adopt them only if the team needs their cache invalidation, devtools, or server-state policy after the current contracts are tested.

---

## 8. Production-safe implementation completed (2026-09-24)

The following production-hardening steps were implemented without introducing new runtime risk:

- canonical metadata corrected in [app/layout.tsx](app/layout.tsx): stale copy now reflects the verified database reality instead of unsupported 500/22 claims
- mobile network indicator fixed in [components/ui/network-status-indicator.tsx](components/ui/network-status-indicator.tsx): it is visible on small screens, uses a semantic status role, and no longer uses the infinite `animate-ping` pattern
- route shells added to prevent blank screens on cold boot or render failures: [app/loading.tsx](app/loading.tsx), [app/error.tsx](app/error.tsx), and [app/not-found.tsx](app/not-found.tsx)
- the app continues to use the verified curriculum metadata and local cached state model rather than introducing a large framework or a race-prone global store
- tutor route sanitized and bounded in [app/api/tutor/route.ts](app/api/tutor/route.ts): raw query interpolation is replaced with bounded token filtering and truthful database-backed copy
- landing-page curriculum messaging aligned with the verified 14 modules / 700 lessons in [components/landing/navbar.tsx](components/landing/navbar.tsx) and [components/landing/hero-split.tsx](components/landing/hero-split.tsx)

Acceptance checks:
- `npm run typecheck && npm run build` still exits 0
- no user-facing blank-screen route remains on cold render or route failure
- the low-bandwidth status indicator is visible on mobile widths
- app-level metadata now reflects the database-backed totals instead of stale product copy

---
