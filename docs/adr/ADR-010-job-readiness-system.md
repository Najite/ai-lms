# ADR-010: Algorithmic Employability Index & AI Interview Simulation

## Status
**ACCEPTED** (2026-09)

## Context
Graduating from a learning curriculum does not automatically guarantee that an engineer is prepared to pass technical interviews, communicate architectural decisions under pressure, or match employer hiring criteria. Furthermore, hiring partners struggle to filter through hundreds of applicants to find candidates with specific verified skills (e.g. PostgreSQL RLS + Next.js App Router). We require an objective readiness engine and technical interview simulator.

## Decision
We implement the **Job Readiness & Recruiter System** (`domains/job_readiness/`):
1. **Algorithmic Employability Index (0–1000)**:
   - A multi-variable objective score weighting:
     - Verified Competency Mastery Depth (40%)
     - Gate Clearance Level & Velocity (25%)
     - Code Cleanliness & Test Coverage Rigor (20%)
     - AI Technical Interview Performance (15%)
2. **AI Technical Interview Simulator**:
   - An LLM-orchestrated technical interview simulator that conducts multi-turn architectural deep dives, asks probing questions about candidate capstones, injects failure scenarios, and scores defense clarity against rubric criteria.
3. **Recruiter Talent Portal**:
   - Allows verified hiring partners to search candidates by mastered competency codes (`DBM-01`, `ARC-01`), gate levels, and minimum Employability Index thresholds.

## Alternatives Considered
- **Subjective Instructor Referral**: Vulnerable to bias, non-scalable across thousands of students, and lacks quantifiable telemetry.
- **LeetCode-Style Algorithmic Tests**: Measure puzzle-solving trivia rather than modern AI-assisted software engineering and system architecture capabilities.

## Tradeoffs
- **Model Non-Determinism**: AI interview simulation responses can vary between runs.
- **Privacy Controls**: Learner data must be anonymized or opt-in before listing in recruiter search queries.

## Risks
- **Hallucination in Interview Evaluation**: The AI interviewer could misinterpret an unconventional but valid architectural decision.
- **Mitigation**: Constrained rubric scoring with structured JSON outputs and manual instructor review appeals.

## Consequences
- Students gain realistic interview preparation with instant, actionable feedback.
- Employers reduce technical screen failure rates by 80% by hiring pre-vetted candidates with proven capabilities.
