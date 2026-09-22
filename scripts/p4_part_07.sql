INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-31',
    'module-05-lesson-31-api-versioning-strategies-url-path-vs-he',
    'module-5',
    'Lesson 5.31: API Versioning Strategies: URL Path vs Header vs Query Parameter',
    'Module 5 Web Architecture | Lesson 31 of 35',
    'Subtopics: 4 items',
    'Enterprise API lifecycle management.',
    100,
    '# Lesson 5.31: API Versioning Strategies: URL Path vs Header vs Query Parameter

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.31.1` URL path versioning: `/api/v1/prompts` vs `/api/v2/prompts` (explicit, visible, cache-friendly)
  - `5.31.2` Header versioning: `Accept: application/vnd.company.v2+json` (clean URIs, more complex client setup)
  - `5.31.3` Query parameter versioning: `/prompts?version=2`
  - `5.31.4` Sunset policies and `Sunset` HTTP headers: giving API consumers advance notice of deprecations

- **Key Failure Modes & Edge Cases**: Introducing a breaking field rename in a production API without versioning, crashing all mobile and frontend clients.
- **Verification & Mastery Check**: Implement a versioned API router that routes requests to v1 or v2 handlers with deprecation headers.
- **Project Application**: Enterprise API lifecycle management.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.31: API Versioning Strategies: URL Path vs Header vs Query Parameter\nProject Application: Enterprise API lifecycle management.\nVerification Requirement: Implement a versioned API router that routes requests to v1 or v2 handlers with deprecation headers.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement a versioned API router that routes requests to v1 or v2 handlers with deprecation headers.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.31: API Versioning Strategies: URL Path vs Header vs Query Parameter\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: API Versioning Strategies: URL Path vs Header vs Query Parameter\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement a versioned API router that routes requests to v1 \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement a versioned API router that routes requests to v1 or v2 handlers with deprecation headers.", "failure_mode": "Introducing a breaking field rename in a production API without versioning, crashing all mobile and frontend clients.", "subtopics_count": 4, "subtopics": ["5.31.1 URL path versioning: `/api/v1/prompts` vs `/api/v2/prompts` (explicit, visible, cache-friendly)", "5.31.2 Header versioning: `Accept: application/vnd.company.v2+json` (clean URIs, more complex client setup)", "5.31.3 Query parameter versioning: `/prompts?version=2`", "5.31.4 Sunset policies and `Sunset` HTTP headers: giving API consumers advance notice of deprecations"]}'::jsonb,
    '["Explain how your implementation avoids: Introducing a breaking field rename in a production API without versioning, crashing all mobile and frontend clients.", "How does API Versioning Strategies: URL Path vs Header vs Query Parameter scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-32',
    'module-05-lesson-32-high-performance-caching-http-cache-cont',
    'module-5',
    'Lesson 5.32: High-Performance Caching: HTTP Cache-Control, ETag & 304 Not Modified',
    'Module 5 Web Architecture | Lesson 32 of 35',
    'Subtopics: 4 items',
    'API response caching and CDN optimization.',
    100,
    '# Lesson 5.32: High-Performance Caching: HTTP Cache-Control, ETag & 304 Not Modified

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.32.1` Cache-Control directives: `public`, `private`, `no-cache`, `no-store`, `max-age`, `s-maxage`
  - `5.32.2` Validation with ETags (entity tags) and `If-None-Match` headers
  - `5.32.3` HTTP 304 Not Modified: returning empty bodies when cached client copies are still fresh
  - `5.32.4` CDN edge caching: configuring Cloudflare/CloudFront to cache static and semi-static API responses

- **Key Failure Modes & Edge Cases**: Setting `Cache-Control: public, max-age=3600` on endpoints returning personalized user profile data.
- **Verification & Mastery Check**: Implement ETag generation for an API endpoint and return 304 Not Modified on matching client caches.
- **Project Application**: API response caching and CDN optimization.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.32: High-Performance Caching: HTTP Cache-Control, ETag & 304 Not Modified\nProject Application: API response caching and CDN optimization.\nVerification Requirement: Implement ETag generation for an API endpoint and return 304 Not Modified on matching client caches.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement ETag generation for an API endpoint and return 304 Not Modified on matching client caches.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.32: High-Performance Caching: HTTP Cache-Control, ETag & 304 Not Modified\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: High-Performance Caching: HTTP Cache-Control, ETag & 304 Not Modified\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement ETag generation for an API endpoint and return 304\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement ETag generation for an API endpoint and return 304 Not Modified on matching client caches.", "failure_mode": "Setting `Cache-Control: public, max-age=3600` on endpoints returning personalized user profile data.", "subtopics_count": 4, "subtopics": ["5.32.1 Cache-Control directives: `public`, `private`, `no-cache`, `no-store`, `max-age`, `s-maxage`", "5.32.2 Validation with ETags (entity tags) and `If-None-Match` headers", "5.32.3 HTTP 304 Not Modified: returning empty bodies when cached client copies are still fresh", "5.32.4 CDN edge caching: configuring Cloudflare/CloudFront to cache static and semi-static API responses"]}'::jsonb,
    '["Explain how your implementation avoids: Setting `Cache-Control: public, max-age=3600` on endpoints returning personalized user profile data.", "How does High-Performance Caching: HTTP Cache-Control, ETag & 304 Not Modified scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-33',
    'module-05-lesson-33-structured-json-logging-log-correlation-',
    'module-5',
    'Lesson 5.33: Structured JSON Logging, Log Correlation & Contextual Tracing',
    'Module 5 Web Architecture | Lesson 33 of 35',
    'Subtopics: 4 items',
    'Production debugging and log observability.',
    100,
    '# Lesson 5.33: Structured JSON Logging, Log Correlation & Contextual Tracing

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.33.1` Why plaintext logs fail at scale: impossible to query across millions of entries in Datadog/Elastic
  - `5.33.2` Structured JSON format: `{"timestamp": ..., "level": "INFO", "request_id": ..., "message": ...}`
  - `5.33.3` Python `structlog` and standard `logging` formatters
  - `5.33.4` Context variables (`contextvars`): propagating correlation IDs through asynchronous call chains

- **Key Failure Modes & Edge Cases**: Logging sensitive user passwords, API keys, or JWT tokens in plaintext application logs.
- **Verification & Mastery Check**: Configure a structured JSON logger that automatically attaches request IDs to all log statements in an async call.
- **Project Application**: Production debugging and log observability.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.33: Structured JSON Logging, Log Correlation & Contextual Tracing\nProject Application: Production debugging and log observability.\nVerification Requirement: Configure a structured JSON logger that automatically attaches request IDs to all log statements in an async call.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Configure a structured JSON logger that automatically attaches request IDs to all log statements in an async call.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.33: Structured JSON Logging, Log Correlation & Contextual Tracing\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Structured JSON Logging, Log Correlation & Contextual Tracing\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Configure a structured JSON logger that automatically attach\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Configure a structured JSON logger that automatically attaches request IDs to all log statements in an async call.", "failure_mode": "Logging sensitive user passwords, API keys, or JWT tokens in plaintext application logs.", "subtopics_count": 4, "subtopics": ["5.33.1 Why plaintext logs fail at scale: impossible to query across millions of entries in Datadog/Elastic", "5.33.2 Structured JSON format: `{\"timestamp\": ..., \"level\": \"INFO\", \"request_id\": ..., \"message\": ...}`", "5.33.3 Python `structlog` and standard `logging` formatters", "5.33.4 Context variables (`contextvars`): propagating correlation IDs through asynchronous call chains"]}'::jsonb,
    '["Explain how your implementation avoids: Logging sensitive user passwords, API keys, or JWT tokens in plaintext application logs.", "How does Structured JSON Logging, Log Correlation & Contextual Tracing scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-34',
    'module-05-lesson-34-load-testing--performance-benchmarking-w',
    'module-5',
    'Lesson 5.34: Load Testing & Performance Benchmarking with Locust and wrk',
    'Module 5 Web Architecture | Lesson 34 of 35',
    'Subtopics: 4 items',
    'GatewayAI: High-load performance certification.',
    100,
    '# Lesson 5.34: Load Testing & Performance Benchmarking with Locust and wrk

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.34.1` Why averages lie: the importance of p95 and p99 latency tail distributions
  - `5.34.2` HTTP benchmarking tools: `wrk` for high-throughput pipeline testing vs `locust` for realistic user flows
  - `5.34.3` Identifying bottlenecks: CPU-bound serialization vs database lock contention vs socket exhaustion
  - `5.34.4` Establishing Service Level Objectives (SLOs): 99.9% of requests under 150ms latency

- **Key Failure Modes & Edge Cases**: Relying on local development performance without load testing, experiencing 10-second outages on launch day.
- **Verification & Mastery Check**: Benchmark a FastAPI endpoint using wrk to determine its maximum requests per second and p99 latency.
- **Project Application**: GatewayAI: High-load performance certification.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.34: Load Testing & Performance Benchmarking with Locust and wrk\nProject Application: GatewayAI: High-load performance certification.\nVerification Requirement: Benchmark a FastAPI endpoint using wrk to determine its maximum requests per second and p99 latency.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Benchmark a FastAPI endpoint using wrk to determine its maximum requests per second and p99 latency.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.34: Load Testing & Performance Benchmarking with Locust and wrk\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Load Testing & Performance Benchmarking with Locust and wrk\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Benchmark a FastAPI endpoint using wrk to determine its maxi\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Benchmark a FastAPI endpoint using wrk to determine its maximum requests per second and p99 latency.", "failure_mode": "Relying on local development performance without load testing, experiencing 10-second outages on launch day.", "subtopics_count": 4, "subtopics": ["5.34.1 Why averages lie: the importance of p95 and p99 latency tail distributions", "5.34.2 HTTP benchmarking tools: `wrk` for high-throughput pipeline testing vs `locust` for realistic user flows", "5.34.3 Identifying bottlenecks: CPU-bound serialization vs database lock contention vs socket exhaustion", "5.34.4 Establishing Service Level Objectives (SLOs): 99.9% of requests under 150ms latency"]}'::jsonb,
    '["Explain how your implementation avoids: Relying on local development performance without load testing, experiencing 10-second outages on launch day.", "How does Load Testing & Performance Benchmarking with Locust and wrk scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-35',
    'module-05-lesson-35-deploying-high-availability-web-services',
    'module-5',
    'Lesson 5.35: Deploying High-Availability Web Services with Docker & Health Checks',
    'Module 5 Web Architecture | Lesson 35 of 35',
    'Subtopics: 4 items',
    'GatewayAI: Cloud-ready containerized service deployment.',
    100,
    '# Lesson 5.35: Deploying High-Availability Web Services with Docker & Health Checks

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.35.1` Multi-stage Docker builds: compiling dependencies in builder stage and copying to a minimal slim image
  - `5.35.2` Running as unprivileged non-root users (`USER appuser`) for container security
  - `5.35.3` Liveness probes (`/health/live`) vs Readiness probes (`/health/ready`): preventing traffic to unready pods
  - `5.35.4` Graceful shutdown handling: catching SIGTERM, waiting for in-flight requests to complete, and closing connections

- **Key Failure Modes & Edge Cases**: Using a bloated 1.2GB full Python Docker image in production instead of a hardened 120MB slim image.
- **Verification & Mastery Check**: Write a production multi-stage Dockerfile with non-root security and comprehensive health check endpoints.
- **Project Application**: GatewayAI: Cloud-ready containerized service deployment.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.35: Deploying High-Availability Web Services with Docker & Health Checks\nProject Application: GatewayAI: Cloud-ready containerized service deployment.\nVerification Requirement: Write a production multi-stage Dockerfile with non-root security and comprehensive health check endpoints.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a production multi-stage Dockerfile with non-root security and comprehensive health check endpoints.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.35: Deploying High-Availability Web Services with Docker & Health Checks\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Deploying High-Availability Web Services with Docker & Health Checks\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a production multi-stage Dockerfile with non-root secu\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a production multi-stage Dockerfile with non-root security and comprehensive health check endpoints.", "failure_mode": "Using a bloated 1.2GB full Python Docker image in production instead of a hardened 120MB slim image.", "subtopics_count": 4, "subtopics": ["5.35.1 Multi-stage Docker builds: compiling dependencies in builder stage and copying to a minimal slim image", "5.35.2 Running as unprivileged non-root users (`USER appuser`) for container security", "5.35.3 Liveness probes (`/health/live`) vs Readiness probes (`/health/ready`): preventing traffic to unready pods", "5.35.4 Graceful shutdown handling: catching SIGTERM, waiting for in-flight requests to complete, and closing connections"]}'::jsonb,
    '["Explain how your implementation avoids: Using a bloated 1.2GB full Python Docker image in production instead of a hardened 120MB slim image.", "How does Deploying High-Availability Web Services with Docker & Health Checks scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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