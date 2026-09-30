# ADR-005: Build-First & Test-Driven Educational Pedagogy

## Status
**ACCEPTED** (2026-09)

## Context
In the age of AI coding assistants, passive consumption of syntax lectures is obsolete because LLMs can write standard syntax instantly. What modern engineers must master is the ability to **specify contracts, construct rigorous test harnesses, direct AI implementation, debug edge cases, and verify code quality**. Passive video-watching models fail completely to cultivate these high-order skills.

## Decision
We adopt a **Build-First, Specification-Driven, and Test-Driven Educational Pedagogy**:
1. **Interactive Code Sandboxes**: Every lesson is coupled with hands-on coding challenges executed within an isolated in-browser evaluation harness.
2. **Contract-First Instruction**: Lessons instruct students to write Zod schemas, TypeScript types, and SQL constraints before asking AI to implement logic.
3. **Intentional Failure & Hallucination Injection**: Exercises intentionally present buggy, unoptimized, or hallucinated AI outputs that learners must detect, debug, and remediate using automated tests.
4. **Immediate Feedback Loops**: Automated test suites evaluate student submissions in < 2.5s and return structured assertion diffs.

## Alternatives Considered
- **Video-First MOOC Model (Coursera/Udemy style)**: Passive video watching leads to the "tutorial illusion", where students feel competent while watching but cannot build when faced with a blank IDE.
- **Multiple-Choice Quizzes**: Test rote recall rather than genuine engineering execution and problem decomposition.

## Tradeoffs
- **Higher Authoring Overhead**: Creating interactive exercises, starter templates, solution code, and deterministic test harnesses requires significantly more curriculum engineering than recording videos.
- **Strict Learner Experience**: Learners must actively code and cannot passively skip ahead.

## Risks
- **Flaky or Non-Deterministic Tests**: Poorly written test suites could frustrate learners with false negative failures.
- **Mitigation**: All test harnesses run in isolated Node/Vitest environments with mocked clocks and zero external network calls.

## Consequences
- Students graduate with hands-on muscle memory for prompt engineering, schema validation, and test harness authoring.
- Every passed exercise generates immutable competency evidence in the database.
