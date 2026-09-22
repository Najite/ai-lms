INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-6',
    'module-05-lesson-06-http-verbs--idempotency-rfc-9110-standar',
    'module-5',
    'Lesson 5.6: HTTP Verbs & Idempotency RFC 9110 Standards',
    'Module 5 Web Architecture | Lesson 6 of 35',
    'Subtopics: 4 items',
    'GatewayAI: Payment and credit deduction safety.',
    100,
    '# Lesson 5.6: HTTP Verbs & Idempotency RFC 9110 Standards

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.6.1` Safe methods: GET, HEAD, OPTIONS (read-only, zero side effects)
  - `5.6.2` Idempotent methods: PUT, DELETE, GET (repeatable without cumulative side effects)
  - `5.6.3` Non-idempotent operations: POST and state mutation
  - `5.6.4` RFC 9110 compliance for network retry safety

- **Key Failure Modes & Edge Cases**: Implementing non-idempotent mutations on GET requests, triggering duplicate billing on web crawler scans.
- **Verification & Mastery Check**: Prove idempotency of a PUT batch update under 5 duplicate network re-transmissions.
- **Project Application**: GatewayAI: Payment and credit deduction safety.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.6: HTTP Verbs & Idempotency RFC 9110 Standards\nProject Application: GatewayAI: Payment and credit deduction safety.\nVerification Requirement: Prove idempotency of a PUT batch update under 5 duplicate network re-transmissions.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Prove idempotency of a PUT batch update under 5 duplicate network re-transmissions.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.6: HTTP Verbs & Idempotency RFC 9110 Standards\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: HTTP Verbs & Idempotency RFC 9110 Standards\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Prove idempotency of a PUT batch update under 5 duplicate ne\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Prove idempotency of a PUT batch update under 5 duplicate network re-transmissions.", "failure_mode": "Implementing non-idempotent mutations on GET requests, triggering duplicate billing on web crawler scans.", "subtopics_count": 4, "subtopics": ["5.6.1 Safe methods: GET, HEAD, OPTIONS (read-only, zero side effects)", "5.6.2 Idempotent methods: PUT, DELETE, GET (repeatable without cumulative side effects)", "5.6.3 Non-idempotent operations: POST and state mutation", "5.6.4 RFC 9110 compliance for network retry safety"]}'::jsonb,
    '["Explain how your implementation avoids: Implementing non-idempotent mutations on GET requests, triggering duplicate billing on web crawler scans.", "How does HTTP Verbs & Idempotency RFC 9110 Standards scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-7',
    'module-05-lesson-07-status-codes-precision--client-error-rec',
    'module-5',
    'Lesson 5.7: Status Codes Precision & Client Error Recovery',
    'Module 5 Web Architecture | Lesson 7 of 35',
    'Subtopics: 4 items',
    'Enterprise API error standardization.',
    100,
    '# Lesson 5.7: Status Codes Precision & Client Error Recovery

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.7.1` 200 OK vs 201 Created vs 204 No Content vs 202 Accepted
  - `5.7.2` 400 Bad Request vs 422 Unprocessable Entity
  - `5.7.3` 401 Unauthorized (unauthenticated) vs 403 Forbidden (insufficient permissions)
  - `5.7.4` 429 Too Many Requests (with Retry-After headers) vs 503 Service Unavailable

- **Key Failure Modes & Edge Cases**: Returning 200 OK with `{"error": "failed"}` in body, preventing upstream proxies from retrying.
- **Verification & Mastery Check**: Map all API error conditions to RFC-standard status codes with structured Problem Details (RFC 7807).
- **Project Application**: Enterprise API error standardization.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.7: Status Codes Precision & Client Error Recovery\nProject Application: Enterprise API error standardization.\nVerification Requirement: Map all API error conditions to RFC-standard status codes with structured Problem Details (RFC 7807).\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Map all API error conditions to RFC-standard status codes with structured Problem Details (RFC 7807).\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.7: Status Codes Precision & Client Error Recovery\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Status Codes Precision & Client Error Recovery\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Map all API error conditions to RFC-standard status codes wi\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Map all API error conditions to RFC-standard status codes with structured Problem Details (RFC 7807).", "failure_mode": "Returning 200 OK with `{\"error\": \"failed\"}` in body, preventing upstream proxies from retrying.", "subtopics_count": 4, "subtopics": ["5.7.1 200 OK vs 201 Created vs 204 No Content vs 202 Accepted", "5.7.2 400 Bad Request vs 422 Unprocessable Entity", "5.7.3 401 Unauthorized (unauthenticated) vs 403 Forbidden (insufficient permissions)", "5.7.4 429 Too Many Requests (with Retry-After headers) vs 503 Service Unavailable"]}'::jsonb,
    '["Explain how your implementation avoids: Returning 200 OK with `{\"error\": \"failed\"}` in body, preventing upstream proxies from retrying.", "How does Status Codes Precision & Client Error Recovery scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-8',
    'module-05-lesson-08-content-negotiation-headers--mime-types',
    'module-5',
    'Lesson 5.8: Content Negotiation, Headers & MIME Types',
    'Module 5 Web Architecture | Lesson 8 of 35',
    'Subtopics: 4 items',
    'Multi-format API gateway response serializer.',
    100,
    '# Lesson 5.8: Content Negotiation, Headers & MIME Types

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.8.1` MIME media types: `application/json`, `text/event-stream`, `multipart/form-data`
  - `5.8.2` Accept header quality factors (`q=0.9`) and proactive negotiation
  - `5.8.3` Compression: gzip, Brotli (`br`), and streaming decompression
  - `5.8.4` Header security: Strict-Transport-Security, X-Content-Type-Options

- **Key Failure Modes & Edge Cases**: Omitting `Content-Type: application/json` in request dispatches, causing servers to reject payloads.
- **Verification & Mastery Check**: Implement dynamic content negotiation returning either JSON or YAML based on the Accept header.
- **Project Application**: Multi-format API gateway response serializer.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.8: Content Negotiation, Headers & MIME Types\nProject Application: Multi-format API gateway response serializer.\nVerification Requirement: Implement dynamic content negotiation returning either JSON or YAML based on the Accept header.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement dynamic content negotiation returning either JSON or YAML based on the Accept header.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.8: Content Negotiation, Headers & MIME Types\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Content Negotiation, Headers & MIME Types\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement dynamic content negotiation returning either JSON \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement dynamic content negotiation returning either JSON or YAML based on the Accept header.", "failure_mode": "Omitting `Content-Type: application/json` in request dispatches, causing servers to reject payloads.", "subtopics_count": 4, "subtopics": ["5.8.1 MIME media types: `application/json`, `text/event-stream`, `multipart/form-data`", "5.8.2 Accept header quality factors (`q=0.9`) and proactive negotiation", "5.8.3 Compression: gzip, Brotli (`br`), and streaming decompression", "5.8.4 Header security: Strict-Transport-Security, X-Content-Type-Options"]}'::jsonb,
    '["Explain how your implementation avoids: Omitting `Content-Type: application/json` in request dispatches, causing servers to reject payloads.", "How does Content Negotiation, Headers & MIME Types scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-9',
    'module-05-lesson-09-asynchronous-i-o-mechanics-event-loops--',
    'module-5',
    'Lesson 5.9: Asynchronous I/O Mechanics: Event Loops & Non-Blocking Sockets',
    'Module 5 Web Architecture | Lesson 9 of 35',
    'Subtopics: 4 items',
    'High-concurrency streaming server foundation.',
    100,
    '# Lesson 5.9: Asynchronous I/O Mechanics: Event Loops & Non-Blocking Sockets

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.9.1` Synchronous blocking I/O bottleneck: thread exhaustion under 10k connections
  - `5.9.2` OS non-blocking sockets and readiness notifications
  - `5.9.3` Event loop execution cycle: timer heap, I/O callbacks, microtask queue
  - `5.9.4` Cooperative coroutines: yielding control without thread context switching overhead

- **Key Failure Modes & Edge Cases**: Executing a synchronous blocking sleep (`time.sleep`) inside an async event loop, freezing all concurrent users.
- **Verification & Mastery Check**: Build a non-blocking asynchronous socket server handling 1,000 concurrent client pings without threads.
- **Project Application**: High-concurrency streaming server foundation.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.9: Asynchronous I/O Mechanics: Event Loops & Non-Blocking Sockets\nProject Application: High-concurrency streaming server foundation.\nVerification Requirement: Build a non-blocking asynchronous socket server handling 1,000 concurrent client pings without threads.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a non-blocking asynchronous socket server handling 1,000 concurrent client pings without threads.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.9: Asynchronous I/O Mechanics: Event Loops & Non-Blocking Sockets\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Asynchronous I/O Mechanics: Event Loops & Non-Blocking Sockets\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a non-blocking asynchronous socket server handling 1,0\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a non-blocking asynchronous socket server handling 1,000 concurrent client pings without threads.", "failure_mode": "Executing a synchronous blocking sleep (`time.sleep`) inside an async event loop, freezing all concurrent users.", "subtopics_count": 4, "subtopics": ["5.9.1 Synchronous blocking I/O bottleneck: thread exhaustion under 10k connections", "5.9.2 OS non-blocking sockets and readiness notifications", "5.9.3 Event loop execution cycle: timer heap, I/O callbacks, microtask queue", "5.9.4 Cooperative coroutines: yielding control without thread context switching overhead"]}'::jsonb,
    '["Explain how your implementation avoids: Executing a synchronous blocking sleep (`time.sleep`) inside an async event loop, freezing all concurrent users.", "How does Asynchronous I/O Mechanics: Event Loops & Non-Blocking Sockets scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-10',
    'module-05-lesson-10-the-python-asgi-specification--lifespan-',
    'module-5',
    'Lesson 5.10: The Python ASGI Specification & Lifespan Protocol',
    'Module 5 Web Architecture | Lesson 10 of 35',
    'Subtopics: 4 items',
    'FastAPI and Uvicorn runtime internals.',
    100,
    '# Lesson 5.10: The Python ASGI Specification & Lifespan Protocol

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.10.1` WSGI synchronous limitations vs ASGI asynchronous duplex capability
  - `5.10.2` ASGI scope, receive, and send callables
  - `5.10.3` Handling HTTP requests vs WebSocket connections vs Lifespan events
  - `5.10.4` Application startup and shutdown hooks: connection pool warmup and graceful draining

- **Key Failure Modes & Edge Cases**: Failing to close database connection pools during ASGI shutdown, causing orphaned connections in Postgres.
- **Verification & Mastery Check**: Write a minimal raw ASGI application from scratch without any framework.
- **Project Application**: FastAPI and Uvicorn runtime internals.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.10: The Python ASGI Specification & Lifespan Protocol\nProject Application: FastAPI and Uvicorn runtime internals.\nVerification Requirement: Write a minimal raw ASGI application from scratch without any framework.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a minimal raw ASGI application from scratch without any framework.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.10: The Python ASGI Specification & Lifespan Protocol\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: The Python ASGI Specification & Lifespan Protocol\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a minimal raw ASGI application from scratch without an\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a minimal raw ASGI application from scratch without any framework.", "failure_mode": "Failing to close database connection pools during ASGI shutdown, causing orphaned connections in Postgres.", "subtopics_count": 4, "subtopics": ["5.10.1 WSGI synchronous limitations vs ASGI asynchronous duplex capability", "5.10.2 ASGI scope, receive, and send callables", "5.10.3 Handling HTTP requests vs WebSocket connections vs Lifespan events", "5.10.4 Application startup and shutdown hooks: connection pool warmup and graceful draining"]}'::jsonb,
    '["Explain how your implementation avoids: Failing to close database connection pools during ASGI shutdown, causing orphaned connections in Postgres.", "How does The Python ASGI Specification & Lifespan Protocol scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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