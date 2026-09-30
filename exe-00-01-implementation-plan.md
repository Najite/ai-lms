# EXE-00-01 Production Implementation Plan
# POSIX Filesystem Navigation & Directory Tree Reconstruction

**Exercise Code:** `EXE-00-01`  
**Target Competency:** `DEV-00` (Tooling & Development Environment)  
**State Progression:** `Introduced` &rarr; `Practicing`  
**Parent Module:** `MOD-00` (Digital Foundations)  
**Classification:** Core Implementation Blueprint  
**Status:** Implemented & Verified in Production LMS

---

## 1. Executive Overview

This document specifies the end-to-end production implementation of **`EXE-00-01: POSIX Filesystem Navigation & Directory Tree Reconstruction`** inside the `ai-native-lms` platform.

### Core Implementation Principles:
1. **Zero CLI / Terminal Knowledge**: The learner interacts exclusively with a high-fidelity visual workspace. No commands (`cd`, `ls`, `pwd`, `chmod`) or programming scripts are required.
2. **Zero Raw JSON Typing**: The learner interacts with visual node builders, coordinate pickers, and permission switchboards. The UI automatically synthesizes the validated JSON `submission_payload` in memory.
3. **Deterministic Zero-Trust Evaluation**: Submissions are evaluated against 14 automated assertions (6 visible tests [40%] + 8 hidden tests [60%]).
4. **Competency Evidence Automation**: Scoring &ge; 90% atomically transitions `DEV-00` from `Introduced` to `Practicing`, logs telemetry in `assessment_runs`, and records evidence in `competency_evidence` and `portfolio_evidence`.

---

## 2. Full Architecture & Component Hierarchy

```mermaid
graph TD
    classDef route fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef view fill:#0f172a,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef comp fill:#042f2e,stroke:#14b8a6,stroke-width:2px,color:#fff;
    classDef back fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;

    R["app/exercises/[slug]/page.tsx<br/>(Server Component)"]:::route --> W["ExerciseWorkspace.tsx<br/>(Polymorphic Client Workspace)"]:::view
    
    W -->|isVisualFilesystem| M["FilesystemReconstructionWorkspace.tsx<br/>(Master Visual Workbench)"]:::view
    
    M --> T1["FilesystemTreeBuilder.tsx<br/>(1. Topology & Parent Assign)"]:::comp
    M --> T2["PathChallengeWorkbench.tsx<br/>(2. Absolute & Relative Vectors)"]:::comp
    M --> T3["PermissionsMatrixEditor.tsx<br/>(3. Dotfiles & rwx Matrix)"]:::comp
    
    M -->|onSubmitPayload(json)| ACT["exercise-actions.ts / submitExerciseAction"]:::back
    ACT --> SRV["ExerciseService.submitExercise()"]:::back
    SRV --> EVAL["ExerciseStateMachine.evaluateSubmission()"]:::back
    EVAL --> ASS["assessment_runs Telemetry"]:::back
    
    M -->|onCompleteExercise()| CMP["ExerciseService.completeExercise()"]:::back
    CMP --> EVID["competency_evidence (DEV-00: Practicing)"]:::back
    CMP --> PROG["user_learning_progress (Completed)"]:::back
```

---

## 3. Challenge Workbench Breakdown

The learner experiences four visual challenge modules organized into three tabbed workbench interfaces:

| Module | UI Component | Learner Interactions | Technical Validation |
| :--- | :--- | :--- | :--- |
| **Challenge 1: Inverted Tree Topology** | `FilesystemTreeBuilder.tsx` | Select parent directories for 12 system/user nodes starting from `/` down to `/home/alex/projects/cloud-app/src`. | Evaluates acyclic graph hierarchy, Root `null` parent, and correct nesting of project repository. |
| **Challenge 2: Absolute Path Coordinates** | `PathChallengeWorkbench.tsx` | Select unambiguous global addresses starting from `/` for 5 key server assets (`/etc/nginx.conf`, `/var/log/app.log`, etc.). | Verifies leading `/` anchors and exact directory path coordinates without ambiguity. |
| **Challenge 3: Relative Path Vectors** | `PathChallengeWorkbench.tsx` | Choose relative vectors from dynamic CWDs (`.`, `..`, `../../Documents/...`, `../../../../var/log/app.log`). | Verifies relative traversal rules and multi-hop parent stepping without root anchors. |
| **Challenge 4: Dotfiles & Permissions** | `PermissionsMatrixEditor.tsx` | Toggle hidden dotfile flags and configure `rwx` switches across Owner, Group, and Others for 3 server assets. | Enforces least-privilege security (e.g. `.env` locked from public/group read, `index.js` executable). |

---

## 4. Assessment & Test Engine Integration

### Weighted Scoring Formula
- **Visible Test Suite (40% / 6 Tests)**: `VIS-01` to `VIS-06`
- **Hidden Test Suite (60% / 8 Tests)**: `HID-01` to `HID-08`
- **Pass Threshold**: Final Score &ge; **90.0%**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               EXE-00-01 TEST SUITE SPECIFICATION                                │
├──────────┬────────┬────────────────────────────────────────┬─────────────────────┬──────────────┤
│ Test ID  │ Type   │ Target Evaluation Area                 │ Sub-Criterion       │ Weight       │
├──────────┼────────┼────────────────────────────────────────┼─────────────────────┼──────────────┤
│ `VIS-01` │ Visible│ Root Directory is Single Origin Anchor │ `DEV-00.FS-ROOT`    │ 6.0%         │
│ `VIS-02` │ Visible│ User Workspace & Project Subfolders    │ `DEV-00.FS-HOME`    │ 6.0%         │
│ `VIS-03` │ Visible│ System File Absolute Paths (/etc, /var)│ `DEV-00.PATH-ABS`   │ 7.0%         │
│ `VIS-04` │ Visible│ Project Secrets & Architecture Notes   │ `DEV-00.PATH-ABS`   │ 7.0%         │
│ `VIS-05` │ Visible│ Local Relative Path & Subfolders       │ `DEV-00.PATH-REL`   │ 7.0%         │
│ `VIS-06` │ Visible│ Hidden Dotfile Flag & Secret Privacy   │ `DEV-00.SEC-DOT`    │ 7.0%         │
├──────────┼────────┼────────────────────────────────────────┼─────────────────────┼──────────────┤
│ `HID-01` │ Hidden │ Multi-Hop Sibling Traversal (../../)   │ `DEV-00.PATH-REL`   │ 8.0%         │
│ `HID-02` │ Hidden │ Cross-Root Traversal (../../../../)    │ `DEV-00.PATH-REL`   │ 8.0%         │
│ `HID-03` │ Hidden │ Downward Relative Traversal from Home  │ `DEV-00.PATH-REL`   │ 7.0%         │
│ `HID-04` │ Hidden │ Executable Script Permissions (index)  │ `DEV-00.SEC-RWX`    │ 8.0%         │
│ `HID-05` │ Hidden │ Nginx Configuration Least Privilege    │ `DEV-00.SEC-RWX`    │ 8.0%         │
│ `HID-06` │ Hidden │ Inverted Tree Graph Integrity (12 nodes)│ `DEV-00.FS-ROOT`   │ 7.0%         │
│ `HID-07` │ Hidden │ Canonical Path Sanitization & Anti-Spoof│ `DEV-00.SEC-DOT`   │ 7.0%         │
│ `HID-08` │ Hidden │ Deep Entrypoint Absolute Coordinate    │ `DEV-00.PATH-ABS`   │ 7.0%         │
└──────────┴────────┴────────────────────────────────────────┴─────────────────────┴──────────────┘
```

---

## 5. Verification Gates

1. `npx tsc --noEmit` &rarr; **0 errors**.
2. `npm run lint` &rarr; **0 errors, 0 warnings**.
3. `npx vitest run` &rarr; **23/23 suites passed (206/206 tests green)**.
4. Database synchronization confirmed on live PostgreSQL project `lfsyndffrfwvdfzjsagl`.
