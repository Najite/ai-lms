# EXE-00-03 Specification: Network Request Investigation & HTTP Diagnostics

**Exercise Code:** `EXE-00-03`  
**Parent Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `DEV-00` (*Developer Environment & Tooling Fluency*)  
**State Progression:** `Reinforced` &rarr; `Verified`  
**Estimated Time:** 45–60 Minutes  
**Pass Criteria:** $\ge 90\%$ Score (Automated Verification)

---

## 1. Exercise Overview

In this exercise, you take on the role of a Systems Diagnostics Engineer investigating a live network incident on **OctoStore**, an online cloud e-commerce platform.

Using the built-in **Network Diagnostics Workbench** (a realistic simulation of browser Developer Tools), you will inspect 9 recorded HTTP requests, analyze status codes, inspect headers and JSON bodies, map DNS IP addresses, and identify the root causes of system failures.

---

## 2. The 9 Captured Network Requests

```
┌────┬────────┬────────┬─────────────────────────────┬───────────────────────────────────────────┬────────┬────────┐
│ ID │ Method │ Status │ Host Domain                 │ Path & Query Parameters                   │ Scheme │ Time   │
├────┼────────┼────────┼─────────────────────────────┼───────────────────────────────────────────┼────────┼────────┤
│ R1 │ GET    │ 301    │ octostore.app               │ /                                         │ HTTP   │ 24 ms  │
│ R2 │ GET    │ 200    │ octostore.app               │ /                                         │ HTTPS  │ 48 ms  │
│ R3 │ GET    │ 200    │ api.octostore.app           │ /v1/products?category=electronics         │ HTTPS  │ 82 ms  │
│ R4 │ GET    │ 404    │ cdn.octostore.app           │ /images/products/phone_v2.png             │ HTTPS  │ 35 ms  │
│ R5 │ GET    │ 401    │ api.octostore.app           │ /v1/user/profile                          │ HTTPS  │ 41 ms  │
│ R6 │ GET    │ 403    │ api.octostore.app           │ /v1/admin/revenue                         │ HTTPS  │ 39 ms  │
│ R7 │ GET    │ 200    │ legacy-inventory.octostore  │ /check?sku=9821                           │ HTTP   │ 65 ms  │
│ R8 │ POST   │ 500    │ api.octostore.app           │ /v1/checkout/process                      │ HTTPS  │ 320 ms │
│ R9 │ POST   │ 504    │ gateway.octostore.app       │ /v1/pay                                   │ HTTPS  │ 15.0 s │
└────┴────────┴────────┴─────────────────────────────┴───────────────────────────────────────────┴────────┴────────┘
```

---

## 3. Investigation Station Structure

To complete the exercise, you will answer the diagnostic inquiries in the **Investigation Station**:

### Task 1: Successful Data Retrieval & Missing Assets
1. **Catalog Request**: Select the Request ID that successfully fetched the electronic products list.
2. **Missing Asset**: Select the Request ID that resulted in a `404 Not Found` broken image error.

### Task 2: Security & Transport Layer Encryption
1. **Redirection Target**: Identify the target URL specified in the `Location` header of Request `R1`.
2. **Insecure Connection**: Select the Request ID that transmitted data over unencrypted cleartext `HTTP` instead of `HTTPS`.

### Task 3: Access Control & Permissions
1. **Unauthenticated Request**: Select the Request ID that failed because the user was not logged in (`401 Unauthorized`).
2. **Forbidden Request**: Select the Request ID where the user was logged in but lacked administrative permissions (`403 Forbidden`).

### Task 4: Server Failures & Latency Bottlenecks
1. **Backend Crash**: Select the Request ID that crashed due to a server-side internal error (`500 Internal Server Error`).
2. **Timeout Bottleneck**: Select the Request ID that froze the browser due to an upstream gateway timeout (`504 Gateway Timeout`).

### Task 5: DNS & JSON Payload Inspection
1. **DNS IP Resolution**: What is the remote IP address resolved for domain `api.octostore.app` in Request `R3`?
2. **Error Code Extraction**: Inspect the JSON response body of Request `R8`. What is the value of the `"code"` attribute?

### Task 6: Root Cause Synthesis
1. **Primary Incident Trigger**: Which subsystem failed first to break the checkout process?
   - A. The DNS server failed to resolve `octostore.app`.
   - B. The primary database crashed during checkout (`500 DB_CONN_TIMEOUT`).
   - C. The user entered an invalid password.
   - D. The CDN deleted all product photos.

---

## 4. Submission Schema Contract

When you submit through the visual workbench, your selections automatically construct the following manifest:

```json
{
  "exercise_id": "exe-00-03",
  "task_1_successful_catalog_request_id": "R3",
  "task_1_missing_asset_request_id": "R4",
  "task_2_redirect_target_url": "https://octostore.app",
  "task_2_insecure_http_request_id": "R7",
  "task_3_unauthenticated_request_id": "R5",
  "task_3_forbidden_request_id": "R6",
  "task_4_backend_crash_request_id": "R8",
  "task_4_timeout_bottleneck_request_id": "R9",
  "task_5_resolved_api_ip_address": "140.82.121.34",
  "task_5_error_code_payload": "DB_CONN_TIMEOUT",
  "task_6_primary_root_cause": "database_connection_crash"
}
```
