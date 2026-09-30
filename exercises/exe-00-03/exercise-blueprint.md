# EXE-00-03 Blueprint: Network Request Investigation & HTTP Diagnostics

**Document Version:** 1.0.0  
**Exercise Code:** `EXE-00-03`  
**Parent Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `DEV-00` (*Developer Environment & Tooling Fluency*)  
**Competency State Progression:** `Reinforced` &rarr; `Verified`  
**Prerequisites:** `LES-00-03: How the Web Works: HTTP, Networks & Browser DevTools`  
**Successor:** `LES-00-04: Git & Version Control from First Principles`  
**Estimated Time:** 45–60 minutes (Interactive simulation diagnostics)  
**Pass Threshold:** $\ge 90\%$ (Visible Suite: 40%, Hidden Suite: 60%)  

---

## 1. Executive Summary & Assessment Philosophy

`EXE-00-03` is a zero-code, interactive simulation exercise designed to evaluate a learner's diagnostic fluency with web protocols, client–server communication, HTTP status codes, headers, JSON payloads, DNS resolution, and Browser Developer Tools.

In production engineering, over 70% of day-to-day web debugging starts inside the browser's **Network Tab**. Rather than requiring learners to write JavaScript or backend code, `EXE-00-03` places the learner in the role of a Junior Systems Diagnostics Engineer investigating **CloudOps Incident #4081**: an e-commerce platform (`OctoStore`) suffering from missing product assets, broken checkouts, security certificate downgrades, and gateway timeouts.

Learners explore an authentic DevTools Network simulation, filter traffic, inspect request/response headers, examine JSON payloads, trace DNS mappings, and record diagnostic findings in a visual investigation station.

---

## 2. Assessment Objectives & Competency Alignment

| Objective ID | Competency Dimension | Observable Assessment Indicator |
| :--- | :--- | :--- |
| **OBJ-01** | `DEV-00.NET.01` | Trace complete web request lifecycle (DNS lookup &rarr; Handshake &rarr; Request &rarr; Response). |
| **OBJ-02** | `DEV-00.NET.02` | Identify successful requests (`200 OK`, `201 Created`) and locate response bodies. |
| **OBJ-03** | `DEV-00.NET.03` | Diagnose client errors (`401 Unauthorized`, `403 Forbidden`, `404 Not Found`). |
| **OBJ-04** | `DEV-00.NET.04` | Diagnose server failures (`500 Internal Server Error`, `504 Gateway Timeout`). |
| **OBJ-05** | `DEV-00.NET.05` | Distinguish unencrypted HTTP cleartext from encrypted HTTPS/TLS connections. |
| **OBJ-06** | `DEV-00.NET.06` | Inspect and interpret response metadata headers (`Content-Type`, `Location`, `WWW-Authenticate`). |
| **OBJ-07** | `DEV-00.NET.07` | Navigate and parse structured JSON response payloads without writing code. |
| **OBJ-08** | `DEV-00.NET.08` | Perform multi-request root-cause analysis to pinpoint the primary failure in a request cascade. |

---

## 3. Incident Scenario: CloudOps Incident #4081

### Context
At 14:22 UTC, the alert monitoring system for **OctoStore Global** triggered a severity-2 incident. Customers reported broken images, failed checkouts, and security warnings.

As the triage engineer, you are provided with a live replay of the browser's Network Tab containing 9 distinct HTTP requests captured during a failed customer checkout attempt.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               OCTOSTORE NETWORK LOG (INCIDENT #4081)                                             │
├────┬────────┬──────┬────────────────────────┬───────────────────────────────────────────┬────────┬───────┬───────┤
│ ID │ Method │ Stat │ Domain                 │ Path & Query                              │ Type   │ Size  │ Time  │
├────┼────────┼──────┼────────────────────────┼───────────────────────────────────────────┼────────┼───────┼───────┤
│ #1 │ GET    │ 301  │ octostore.app          │ /                                         │ doc    │ 312 B │ 24 ms │
│ #2 │ GET    │ 200  │ octostore.app          │ /                                         │ doc    │ 14 KB │ 48 ms │
│ #3 │ GET    │ 200  │ api.octostore.app      │ /v1/products?category=electronics         │ fetch  │ 4.2 KB│ 82 ms │
│ #4 │ GET    │ 404  │ cdn.octostore.app      │ /images/products/phone_v2.png             │ img    │ 512 B │ 35 ms │
│ #5 │ GET    │ 401  │ api.octostore.app      │ /v1/user/profile                          │ fetch  │ 420 B │ 41 ms │
│ #6 │ GET    │ 403  │ api.octostore.app      │ /v1/admin/revenue                         │ fetch  │ 380 B │ 39 ms │
│ #7 │ GET    │ 200  │ legacy-inventory.octo  │ /check?sku=9821 (INSECURE HTTP)           │ fetch  │ 1.1 KB│ 65 ms │
│ #8 │ POST   │ 500  │ api.octostore.app      │ /v1/checkout/process                      │ fetch  │ 890 B │ 320 ms│
│ #9 │ POST   │ 504  │ gateway.octostore.app  │ /v1/pay                                   │ fetch  │ 210 B │ 15.0 s│
└────┴────────┴──────┴────────────────────────┴───────────────────────────────────────────┴────────┴───────┴───────┘
```

---

## 4. Assessment Suites & Weighted Scoring

### Visible Test Suite (40% Total Weight - 6 Tests)
Visible tests provide immediate, automated feedback to help learners verify foundational concepts.

- `VIS-01` (6.67%): Identify successful product catalog request (`#3`, Status `200 OK`).
- `VIS-02` (6.67%): Identify missing product image resource (`#4`, Status `404 Not Found`).
- `VIS-03` (6.67%): Identify server-side database crash (`#8`, Status `500 Internal Server Error`).
- `VIS-04` (6.67%): Locate and confirm JSON payload in product catalog response (`Content-Type: application/json`).
- `VIS-05` (6.67%): Identify unencrypted cleartext HTTP request (`#7`, Scheme `http://`, Port `80`).
- `VIS-06` (6.67%): Inspect redirection target in response headers (`#1`, `Location: https://octostore.app`).

### Hidden Test Suite (60% Total Weight - 8 Tests)
Hidden tests evaluate comprehensive diagnosis, root-cause tracing, and deep inspection.

- `HID-01` (7.5%): DNS resolution mapping (`api.octostore.app` &rarr; `140.82.121.34`).
- `HID-02` (7.5%): Redirect chain analysis (`301 Moved Permanently` HTTP &rarr; HTTPS upgrade).
- `HID-03` (7.5%): Authentication challenge detection (`#5`, `401 Unauthorized` with `WWW-Authenticate` header).
- `HID-04` (7.5%): Authorization permission boundary (`#6`, `403 Forbidden` admin access denial).
- `HID-05` (7.5%): Gateway timeout latency root cause (`#9`, `504 Gateway Timeout` after 15,000 ms).
- `HID-06` (7.5%): Header content-type validation (`application/json` vs `text/html`).
- `HID-07` (7.5%): JSON payload attribute extraction (identifying `error.code = "DB_CONN_TIMEOUT"` in `#8`).
- `HID-08` (7.5%): Multi-request root-cause synthesis (identifying that Request `#8` crashed before Request `#9` timed out).

---

## 5. Pass/Fail Threshold & Evidence Emission

- **Minimum Passing Score:** $\ge 90\%$ (Equivalent to at least 13 of the 14 total test criteria passed).
- **On Pass:** Emits competency evidence for `DEV-00`, advancing state from `Reinforced` &rarr; `Verified`.
- **Telemetry:** Logs full diagnostic run to `public.assessment_runs` with cryptographic execution hash.
