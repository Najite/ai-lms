# ADR-004: Competency-Driven Learning & Mastery Model

## Status
**ACCEPTED** (2026-09)

## Context
Traditional learning management systems measure learner progress through vanity metrics such as course completion percentages, video playback time, or quiz multiple-choice scores. In software engineering—particularly AI-augmented software engineering—these metrics fail to evaluate whether a learner has attained genuine capability. We require an assessment model centered strictly on verified competency mastery.

## Decision
We implement a **5-State Competency Mastery Model**:
`NOT_STARTED` &rarr; `INTRODUCED` &rarr; `PRACTICING` &rarr; `REINFORCED` &rarr; `MASTERED`

1. **Standard Competency Codes**: Every skill is defined with a global code (e.g. `CTX-01` Context Engineering, `SDD-01` Schema-Driven Development, `DBM-01` Relational Modeling).
2. **Evidence-Based Transitions**: State transitions from `practicing` to `reinforced` and `mastered` require passing scores on coding exercises or verified submissions mapped via `competency_evidence_mapping`.
3. **Multi-Domain Mapping**: Lessons, coding exercises, and competency gates explicitly map to competency codes, ensuring every activity reinforces a measurable capability.

## Alternatives Considered
- **Binary Pass/Fail per Module**: Too coarse-grained; fails to represent whether a student needs further reinforcement on a specific sub-skill.
- **Continuous 0–100 Percentage Only**: Percentages alone lack pedagogical semantics (e.g. 70% does not differentiate between someone who understands the theory vs. someone who can build production software).

## Tradeoffs
- **Increased System Complexity**: Requires maintaining `competencies`, `user_competency_progress`, and `competency_evidence_mapping` alongside standard lesson progress.
- **Strict Scoring Thresholds**: Learners cannot "game" course completion without satisfying competency criteria.

## Risks
- **Score Inflation / Subjective Grading**: Inconsistent exercise scoring could artificially advance competency states.
- **Mitigation**: Deterministic automated test harnesses (Vitest) enforce objective scoring rubrics.

## Consequences
- Transparent skill inventory for learners displaying their exact strengths and growth areas.
- Verifiable skill matrix available for recruiters, hiring managers, and employer partners.
- Feeds directly into Competency Gate prerequisite evaluations.
