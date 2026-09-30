# ADR-007: Gamification Ledger & Double-Entry XP Architecture

## Status
**ACCEPTED** (2026-09)

## Context
Gamification mechanics (XP, levels, achievement badges) drive learner engagement, sustained motivation, and daily practice habits. However, in an educational platform where achievements may link to employer certifications and hiring rankings, a naive XP counter stored as a single mutable integer (`UPDATE users SET xp = xp + 100`) is vulnerable to race conditions, unauthorized manipulation, and audit failure.

## Decision
We implement a **Double-Entry Style Append-Only Transaction Ledger** for the Achievement & XP Domain:
1. **`xp_transactions`**: An immutable, append-only log capturing every XP grant, source reference (`exercise_id`, `lesson_id`, `gate_id`), timestamp, and transaction type (`earned`, `spent`, `bonus`, `adjusted`).
2. **`xp_balances`**: A cached projection storing `total_xp` and derived `level` updated atomically during transactions.
3. **`achievements` & `achievement_awards`**: Tiered badges (`bronze`, `silver`, `gold`, `platinum`) awarded idempotently via `UNIQUE(user_id, achievement_id)`.
4. **Database-Enforced Integrity**: RLS blocks `UPDATE` and `DELETE` queries on `xp_transactions`, ensuring a tamper-proof audit trail.

## Alternatives Considered
- **Single Mutable Integer Column**: Simple to implement, but leaves zero historical traceability regarding when, why, and how XP was granted, making fraud detection impossible.
- **Client-Side Gamification Storage (LocalStorage)**: Unacceptable; easily manipulated and lost across devices.

## Tradeoffs
- **Additional Storage**: Logging every interaction in `xp_transactions` requires more database rows over time.
- **Two-Table Updates**: Requires wrapping the ledger insert and balance update in a single atomic transaction.

## Risks
- **High Write Volume under Concurrency**: Rapid exercise completions could cause write contention on `xp_balances`.
- **Mitigation**: Optimized single-row atomic increments and composite B-tree indexes on `(user_id, created_at DESC)`.

## Consequences
- 100% auditability: Any user's XP balance can be mathematically verified by summing their transaction ledger.
- Gamification metrics are reliable enough to serve as prerequisite criteria for Competency Gates and Job Readiness scoring.
