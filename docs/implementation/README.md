# Implementation Roadmap & Runbooks

## 1. Purpose

The `/docs/implementation` documentation domain tracks the phased engineering implementation roadmap, domain readiness dashboard, environment configuration runbooks, and developer onboarding guides.

---

## 2. Ownership

- **Lead Owner:** Technical Program Manager & Lead Architect
- **Secondary Stakeholders:** Engineering Team Leads, DevOps/Platform Engineer
- **Review Cadence:** Sprint-based roadmap updates & release milestone reviews

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `roadmap.md` | Phased Roadmap | Complete Phase 1 through Phase 8 domain delivery schedule and status | Active |
| `local-development.md` | Setup Guide | Environment variables, local Supabase instance, Node.js tooling, test execution | Active |
| `deployment-runbook.md` | Production Deploy | Vercel deployment, Supabase production migrations, database seed runs | Active |
| `domain-status-dashboard.md` | Domain Status | Real-time status of all domains (Auth, Learning, Competency, Exercise, XP, Gates, etc.) | Active |
| `troubleshooting.md` | Known Issues | Debugging guidelines for common SSR, database session, or test mocking issues | Active |

---

## 4. Domain Implementation Status Dashboard

| Domain / Phase | Status | Test Coverage | Schema Migration | API Handlers | UI Feature |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Phase 0: Foundation Layer** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 1: Auth & Identity** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 2: Learning Domain** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 3: Competency Domain** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 4: Exercise Domain** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 5: Achievement & XP** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 6: Competency Gates** | ✅ Complete | 100% | Applied | Complete | Complete |
| **Phase 7: Portfolio Domain** | ⏳ Planned | — | — | — | — |
| **Phase 8: Capstone Domain** | ⏳ Planned | — | — | — | — |
| **Phase 9: Analytics & Job Readiness** | ⏳ Planned | — | — | — | — |

---

## 5. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/architecture`](file:///home/gamp/Documents/lms/docs/architecture/README.md) & [`/docs/governance`](file:///home/gamp/Documents/lms/docs/governance/README.md).
- **Downstream Consumers:**
  - Day-to-day engineering sprint planning and milestone deliverables.
  - New engineer and contractor onboarding.
