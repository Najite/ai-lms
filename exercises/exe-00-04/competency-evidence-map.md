# Competency Evidence Map: EXE-00-04

**Competency Code:** `DEV-00`  
**Competency Title:** Developer Environment & Tooling Fluency  
**Progression:** `Advanced Practicing` &rarr; `Mastered` (Terminal Progression)  
**Exercise:** `EXE-00-04: Visual Git Graph Reconstruction & Version Control Diagnostics`  

---

## 1. Mastery Rubric & Observable Evidence Criteria

To attain **Mastered** state in `DEV-00`, a software engineer must demonstrate robust visual and spatial reasoning over version control topologies without relying on superficial command memorization.

| Criterion Code | Competency Sub-Dimension | Required Observable Evidence | Verified By |
| :--- | :--- | :--- | :--- |
| **CRIT-DEV00-GIT-01** | Repository Genesis & History Anchor | Identifies root commit (`C0`) with 0 parent links as the immutable genesis point of the repository graph. | `VIS-01`, `HID-01` |
| **CRIT-DEV00-GIT-02** | Active State & Pointer Navigation | Identifies `HEAD` and branch pointers as lightweight named references, locating current position on `main` at `C7`. | `VIS-02`, `HID-08` |
| **CRIT-DEV00-GIT-03** | Directed Parent Causality | Traces ancestry backward through parent links (`C4 -> C3 -> C1 -> C0`), validating that arrows point backward in time. | `VIS-03`, `HID-03` |
| **CRIT-DEV00-GIT-04** | Common Ancestor Resolution | Determines the base commit (`C1`) where two parallel lines of development diverged before merging. | `VIS-05`, `HID-02` |
| **CRIT-DEV00-GIT-05** | 3-Way Merge Topology & Dual Parents | Identifies merge commit `M6` and verifies that dual parent pointers connect `Target (C5)` and `Incoming (C4)`. | `VIS-04`, `HID-05` |
| **CRIT-DEV00-GIT-06** | Lightweight Reference Semantics | Proves that creating and advancing branches manipulates 41-byte text pointers rather than copying folders. | `HID-04` |
| **CRIT-DEV00-GIT-07** | DAG Invariant & Acyclic Guarantee | Explains why Git commit graphs are acyclic and enforce strict temporal non-circularity. | `HID-07` |
| **CRIT-DEV00-GIT-08** | Distributed State & Remote Delta | Compares local DAG against remote `origin/main` to identify pending unpushed commit nodes (`M6`, `C7`). | `HID-06` |

---

## 2. Telemetry & Evidence Record Schema

Upon scoring $\ge 90\%$, the LMS Assessment Engine emits a persistent evidence record to `public.competency_evidence`:

```json
{
  "competency_code": "DEV-00",
  "exercise_id": "e0000000-0000-0000-0000-000000000004",
  "previous_state": "advanced_practicing",
  "new_state": "mastered",
  "score": 100,
  "passed": true,
  "evidence_type": "exercise_completion",
  "mastery_criteria": [
    "CRIT-DEV00-GIT-01",
    "CRIT-DEV00-GIT-02",
    "CRIT-DEV00-GIT-03",
    "CRIT-DEV00-GIT-04",
    "CRIT-DEV00-GIT-05",
    "CRIT-DEV00-GIT-06",
    "CRIT-DEV00-GIT-07",
    "CRIT-DEV00-GIT-08"
  ],
  "evaluated_at": "2026-09-30T16:00:00Z"
}
```
