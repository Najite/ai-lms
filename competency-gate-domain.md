# Competency Gate Domain Reference

## Architectural Alignment

The **Competency Gate Domain** guarantees mastery verification across the curriculum.

### Key Capabilities
- **7 Pre-Seeded Industry Competency Gates** (Levels 1 through 7)
- **Multi-Type Requirement Verification Engine** (Competencies, Lessons, Exercises, Achievements, XP, Artifacts)
- **Traceable Evidence Ledger** (`gate_evidence`)
- **State Machine Engine** (`locked` &rarr; `available` &rarr; `in_progress` &rarr; `under_review` &rarr; `validated` &rarr; `completed`)
- **Single Permanent Completion Guarantee** (`UNIQUE(user_id, gate_id)` on `gate_completion`)
- **Supabase Row Level Security (RLS)** protecting all tables.
