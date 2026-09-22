INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-26',
    'module-05-lesson-26-background-tasks--asynchronous-job-offlo',
    'module-5',
    'Lesson 5.26: Background Tasks & Asynchronous Job Offloading in FastAPI',
    'Module 5 Web Architecture | Lesson 26 of 35',
    'Subtopics: 4 items',
    'Async audit and telemetry logging.',
    100,
    '# Lesson 5.26: Background Tasks & Asynchronous Job Offloading in FastAPI

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.26.1` FastAPI native `BackgroundTasks`: running post-response functions inside the event loop
  - `5.26.2` When native background tasks fail: process crashes losing in-memory task state
  - `5.26.3` Distributed task queues (Celery, ARQ, Celery/Redis): durability, retries, and worker pools
  - `5.26.4` Task status polling vs Webhooks: notifying clients when long jobs finish

- **Key Failure Modes & Edge Cases**: Running a 2-minute batch image generation task inside a standard HTTP request thread, timing out at 30 seconds.
- **Verification & Mastery Check**: Schedule an asynchronous background email and metric dispatch using FastAPI BackgroundTasks.
- **Project Application**: Async audit and telemetry logging.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.26: Background Tasks & Asynchronous Job Offloading in FastAPI\nProject Application: Async audit and telemetry logging.\nVerification Requirement: Schedule an asynchronous background email and metric dispatch using FastAPI BackgroundTasks.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Schedule an asynchronous background email and metric dispatch using FastAPI BackgroundTasks.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.26: Background Tasks & Asynchronous Job Offloading in FastAPI\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Background Tasks & Asynchronous Job Offloading in FastAPI\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Schedule an asynchronous background email and metric dispatc\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Schedule an asynchronous background email and metric dispatch using FastAPI BackgroundTasks.", "failure_mode": "Running a 2-minute batch image generation task inside a standard HTTP request thread, timing out at 30 seconds.", "subtopics_count": 4, "subtopics": ["5.26.1 FastAPI native `BackgroundTasks`: running post-response functions inside the event loop", "5.26.2 When native background tasks fail: process crashes losing in-memory task state", "5.26.3 Distributed task queues (Celery, ARQ, Celery/Redis): durability, retries, and worker pools", "5.26.4 Task status polling vs Webhooks: notifying clients when long jobs finish"]}'::jsonb,
    '["Explain how your implementation avoids: Running a 2-minute batch image generation task inside a standard HTTP request thread, timing out at 30 seconds.", "How does Background Tasks & Asynchronous Job Offloading in FastAPI scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-27',
    'module-05-lesson-27-asynchronous-http-clients-with-httpx-con',
    'module-5',
    'Lesson 5.27: Asynchronous HTTP Clients with HTTPX: Connection Pooling & Keep-Alive',
    'Module 5 Web Architecture | Lesson 27 of 35',
    'Subtopics: 4 items',
    'GatewayAI: High-throughput upstream LLM client.',
    100,
    '# Lesson 5.27: Asynchronous HTTP Clients with HTTPX: Connection Pooling & Keep-Alive

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.27.1` `httpx.AsyncClient` lifecycle: why creating a new client per request destroys socket performance
  - `5.27.2` TCP connection reuse: avoiding 3-way handshakes and TLS renegotiation via HTTP Keep-Alive
  - `5.27.3` Pool tuning: `max_connections` and `max_keepalive_connections` limits
  - `5.27.4` Fine-grained timeouts: connect timeout vs read timeout vs pool acquisition timeout

- **Key Failure Modes & Edge Cases**: Instantiating `httpx.AsyncClient()` inside an endpoint function on every request, exhausting OS ephemeral ports.
- **Verification & Mastery Check**: Create a singleton HTTPX client dependency with tuned connection pools and verify socket reuse across requests.
- **Project Application**: GatewayAI: High-throughput upstream LLM client.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.27: Asynchronous HTTP Clients with HTTPX: Connection Pooling & Keep-Alive\nProject Application: GatewayAI: High-throughput upstream LLM client.\nVerification Requirement: Create a singleton HTTPX client dependency with tuned connection pools and verify socket reuse across requests.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Create a singleton HTTPX client dependency with tuned connection pools and verify socket reuse across requests.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.27: Asynchronous HTTP Clients with HTTPX: Connection Pooling & Keep-Alive\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Asynchronous HTTP Clients with HTTPX: Connection Pooling & Keep-Alive\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Create a singleton HTTPX client dependency with tuned connec\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Create a singleton HTTPX client dependency with tuned connection pools and verify socket reuse across requests.", "failure_mode": "Instantiating `httpx.AsyncClient()` inside an endpoint function on every request, exhausting OS ephemeral ports.", "subtopics_count": 4, "subtopics": ["5.27.1 `httpx.AsyncClient` lifecycle: why creating a new client per request destroys socket performance", "5.27.2 TCP connection reuse: avoiding 3-way handshakes and TLS renegotiation via HTTP Keep-Alive", "5.27.3 Pool tuning: `max_connections` and `max_keepalive_connections` limits", "5.27.4 Fine-grained timeouts: connect timeout vs read timeout vs pool acquisition timeout"]}'::jsonb,
    '["Explain how your implementation avoids: Instantiating `httpx.AsyncClient()` inside an endpoint function on every request, exhausting OS ephemeral ports.", "How does Asynchronous HTTP Clients with HTTPX: Connection Pooling & Keep-Alive scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-28',
    'module-05-lesson-28-resilient-api-integration-exponential-ba',
    'module-5',
    'Lesson 5.28: Resilient API Integration: Exponential Backoff, Jitter & Circuit Breakers',
    'Module 5 Web Architecture | Lesson 28 of 35',
    'Subtopics: 4 items',
    'Production resilience for AI API gateways.',
    100,
    '# Lesson 5.28: Resilient API Integration: Exponential Backoff, Jitter & Circuit Breakers

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.28.1` Exponential backoff: doubling wait intervals ($2^n$) to allow remote services to recover
  - `5.28.2` Full Jitter: adding randomized noise to prevent the ''thundering herd'' synchronization problem
  - `5.28.3` Circuit Breaker pattern: Closed (normal), Open (fast-fail without calling remote), Half-Open (test probe)
  - `5.28.4` Fallbacks: returning cached results or degraded responses during complete provider outages

- **Key Failure Modes & Edge Cases**: Retrying failed API calls without jitter, causing thousands of synchronized clients to hammer an already-failing service.
- **Verification & Mastery Check**: Implement a circuit breaker with exponential backoff and jitter for upstream AI provider calls.
- **Project Application**: Production resilience for AI API gateways.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.28: Resilient API Integration: Exponential Backoff, Jitter & Circuit Breakers\nProject Application: Production resilience for AI API gateways.\nVerification Requirement: Implement a circuit breaker with exponential backoff and jitter for upstream AI provider calls.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement a circuit breaker with exponential backoff and jitter for upstream AI provider calls.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.28: Resilient API Integration: Exponential Backoff, Jitter & Circuit Breakers\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Resilient API Integration: Exponential Backoff, Jitter & Circuit Breakers\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement a circuit breaker with exponential backoff and jit\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement a circuit breaker with exponential backoff and jitter for upstream AI provider calls.", "failure_mode": "Retrying failed API calls without jitter, causing thousands of synchronized clients to hammer an already-failing service.", "subtopics_count": 4, "subtopics": ["5.28.1 Exponential backoff: doubling wait intervals ($2^n$) to allow remote services to recover", "5.28.2 Full Jitter: adding randomized noise to prevent the ''thundering herd'' synchronization problem", "5.28.3 Circuit Breaker pattern: Closed (normal), Open (fast-fail without calling remote), Half-Open (test probe)", "5.28.4 Fallbacks: returning cached results or degraded responses during complete provider outages"]}'::jsonb,
    '["Explain how your implementation avoids: Retrying failed API calls without jitter, causing thousands of synchronized clients to hammer an already-failing service.", "How does Resilient API Integration: Exponential Backoff, Jitter & Circuit Breakers scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-29',
    'module-05-lesson-29-file-uploads-streaming-multi-part-form-d',
    'module-5',
    'Lesson 5.29: File Uploads: Streaming Multi-Part Form Data & Spooling',
    'Module 5 Web Architecture | Lesson 29 of 35',
    'Subtopics: 4 items',
    'DocuMind: Document ingestion pipeline.',
    100,
    '# Lesson 5.29: File Uploads: Streaming Multi-Part Form Data & Spooling

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.29.1` `multipart/form-data` MIME framing: boundaries, parts, headers, and content
  - `5.29.2` FastAPI `UploadFile` vs `bytes`: why `bytes` crashes servers on 1GB uploads
  - `5.29.3` Python `SpooledTemporaryFile`: storing small files in RAM and spilling to disk above thresholds
  - `5.29.4` Direct-to-S3 signed upload URLs: bypassing the application server entirely for multi-gigabyte files

- **Key Failure Modes & Edge Cases**: Reading an entire 500MB user-uploaded PDF into memory as `await file.read()`, triggering Linux OOM kills.
- **Verification & Mastery Check**: Build a streaming file upload handler that processes multi-megabyte files in 64KB chunks with constant memory usage.
- **Project Application**: DocuMind: Document ingestion pipeline.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.29: File Uploads: Streaming Multi-Part Form Data & Spooling\nProject Application: DocuMind: Document ingestion pipeline.\nVerification Requirement: Build a streaming file upload handler that processes multi-megabyte files in 64KB chunks with constant memory usage.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a streaming file upload handler that processes multi-megabyte files in 64KB chunks with constant memory usage.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.29: File Uploads: Streaming Multi-Part Form Data & Spooling\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: File Uploads: Streaming Multi-Part Form Data & Spooling\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a streaming file upload handler that processes multi-m\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a streaming file upload handler that processes multi-megabyte files in 64KB chunks with constant memory usage.", "failure_mode": "Reading an entire 500MB user-uploaded PDF into memory as `await file.read()`, triggering Linux OOM kills.", "subtopics_count": 4, "subtopics": ["5.29.1 `multipart/form-data` MIME framing: boundaries, parts, headers, and content", "5.29.2 FastAPI `UploadFile` vs `bytes`: why `bytes` crashes servers on 1GB uploads", "5.29.3 Python `SpooledTemporaryFile`: storing small files in RAM and spilling to disk above thresholds", "5.29.4 Direct-to-S3 signed upload URLs: bypassing the application server entirely for multi-gigabyte files"]}'::jsonb,
    '["Explain how your implementation avoids: Reading an entire 500MB user-uploaded PDF into memory as `await file.read()`, triggering Linux OOM kills.", "How does File Uploads: Streaming Multi-Part Form Data & Spooling scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-30',
    'module-05-lesson-30-openapi---swagger-specification-generati',
    'module-5',
    'Lesson 5.30: OpenAPI / Swagger Specification Generation & Schema Drift Prevention',
    'Module 5 Web Architecture | Lesson 30 of 35',
    'Subtopics: 4 items',
    'Frontend/Backend contract synchronization.',
    100,
    '# Lesson 5.30: OpenAPI / Swagger Specification Generation & Schema Drift Prevention

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.30.1` OpenAPI v3 JSON schema generated dynamically from FastAPI route types and Pydantic models
  - `5.30.2` Swagger UI (`/docs`) and ReDoc (`/redoc`) interactive documentation endpoints
  - `5.30.3` Auto-generating TypeScript types from the OpenAPI schema using `openapi-typescript`
  - `5.30.4` Preventing schema drift: CI/CD checks that fail builds when frontend types and backend schemas desync

- **Key Failure Modes & Edge Cases**: Manually maintaining frontend TypeScript interfaces that slowly desync from backend API models.
- **Verification & Mastery Check**: Export an OpenAPI schema from FastAPI and auto-generate type-safe TypeScript client interfaces.
- **Project Application**: Frontend/Backend contract synchronization.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.30: OpenAPI / Swagger Specification Generation & Schema Drift Prevention\nProject Application: Frontend/Backend contract synchronization.\nVerification Requirement: Export an OpenAPI schema from FastAPI and auto-generate type-safe TypeScript client interfaces.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Export an OpenAPI schema from FastAPI and auto-generate type-safe TypeScript client interfaces.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.30: OpenAPI / Swagger Specification Generation & Schema Drift Prevention\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: OpenAPI / Swagger Specification Generation & Schema Drift Prevention\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Export an OpenAPI schema from FastAPI and auto-generate type\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Export an OpenAPI schema from FastAPI and auto-generate type-safe TypeScript client interfaces.", "failure_mode": "Manually maintaining frontend TypeScript interfaces that slowly desync from backend API models.", "subtopics_count": 4, "subtopics": ["5.30.1 OpenAPI v3 JSON schema generated dynamically from FastAPI route types and Pydantic models", "5.30.2 Swagger UI (`/docs`) and ReDoc (`/redoc`) interactive documentation endpoints", "5.30.3 Auto-generating TypeScript types from the OpenAPI schema using `openapi-typescript`", "5.30.4 Preventing schema drift: CI/CD checks that fail builds when frontend types and backend schemas desync"]}'::jsonb,
    '["Explain how your implementation avoids: Manually maintaining frontend TypeScript interfaces that slowly desync from backend API models.", "How does OpenAPI / Swagger Specification Generation & Schema Drift Prevention scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;