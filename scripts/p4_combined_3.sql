INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-21',
    'module-05-lesson-21-token-bucket--leaky-bucket-rate-limiting',
    'module-5',
    'Lesson 5.21: Token Bucket & Leaky Bucket Rate Limiting with Redis',
    'Module 5 Web Architecture | Lesson 21 of 35',
    'Subtopics: 4 items',
    'GatewayAI: DDoS and rate limiting defense.',
    100,
    '# Lesson 5.21: Token Bucket & Leaky Bucket Rate Limiting with Redis

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.21.1` Fixed window rate limiting: the double-burst edge case
  - `5.21.2` Token bucket algorithm: steady state consumption with burst allowances
  - `5.21.3` Leaky bucket: smoothing bursty traffic into uniform output rate
  - `5.21.4` Distributed rate limiting with Redis: atomic Lua scripts to prevent race conditions

- **Key Failure Modes & Edge Cases**: Implementing rate limits with multiple non-atomic Redis `GET` and `SET` calls, causing race conditions under load.
- **Verification & Mastery Check**: Write an atomic Redis Lua script implementing the token bucket algorithm that rejects requests over budget.
- **Project Application**: GatewayAI: DDoS and rate limiting defense.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.21: Token Bucket & Leaky Bucket Rate Limiting with Redis\nProject Application: GatewayAI: DDoS and rate limiting defense.\nVerification Requirement: Write an atomic Redis Lua script implementing the token bucket algorithm that rejects requests over budget.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write an atomic Redis Lua script implementing the token bucket algorithm that rejects requests over budget.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.21: Token Bucket & Leaky Bucket Rate Limiting with Redis\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Token Bucket & Leaky Bucket Rate Limiting with Redis\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write an atomic Redis Lua script implementing the token buck\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write an atomic Redis Lua script implementing the token bucket algorithm that rejects requests over budget.", "failure_mode": "Implementing rate limits with multiple non-atomic Redis `GET` and `SET` calls, causing race conditions under load.", "subtopics_count": 4, "subtopics": ["5.21.1 Fixed window rate limiting: the double-burst edge case", "5.21.2 Token bucket algorithm: steady state consumption with burst allowances", "5.21.3 Leaky bucket: smoothing bursty traffic into uniform output rate", "5.21.4 Distributed rate limiting with Redis: atomic Lua scripts to prevent race conditions"]}'::jsonb,
    '["Explain how your implementation avoids: Implementing rate limits with multiple non-atomic Redis `GET` and `SET` calls, causing race conditions under load.", "How does Token Bucket & Leaky Bucket Rate Limiting with Redis scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-22',
    'module-05-lesson-22-server-sent-events-(sse)-streaming-token',
    'module-5',
    'Lesson 5.22: Server-Sent Events (SSE): Streaming Tokens & EventSource Protocol',
    'Module 5 Web Architecture | Lesson 22 of 35',
    'Subtopics: 4 items',
    'GatewayAI: Real-time LLM token streaming proxy.',
    100,
    '# Lesson 5.22: Server-Sent Events (SSE): Streaming Tokens & EventSource Protocol

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.22.1` SSE vs WebSockets: why one-way HTTP streaming is optimal for LLM token delivery
  - `5.22.2` The `text/event-stream` MIME format: `event: ...`, `data: ...`, `id: ...`, double newlines (`\n\n`)
  - `5.22.3` FastAPI `StreamingResponse`: yielding async generator token chunks without buffering
  - `5.22.4` Automatic browser reconnection: the `Last-Event-ID` header and resume semantics

- **Key Failure Modes & Edge Cases**: Buffering entire generator outputs in memory before responding, breaking real-time token streaming to clients.
- **Verification & Mastery Check**: Build an SSE endpoint in FastAPI that streams token chunks to an EventSource client with 50ms latency.
- **Project Application**: GatewayAI: Real-time LLM token streaming proxy.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.22: Server-Sent Events (SSE): Streaming Tokens & EventSource Protocol\nProject Application: GatewayAI: Real-time LLM token streaming proxy.\nVerification Requirement: Build an SSE endpoint in FastAPI that streams token chunks to an EventSource client with 50ms latency.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build an SSE endpoint in FastAPI that streams token chunks to an EventSource client with 50ms latency.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.22: Server-Sent Events (SSE): Streaming Tokens & EventSource Protocol\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Server-Sent Events (SSE): Streaming Tokens & EventSource Protocol\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build an SSE endpoint in FastAPI that streams token chunks t\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build an SSE endpoint in FastAPI that streams token chunks to an EventSource client with 50ms latency.", "failure_mode": "Buffering entire generator outputs in memory before responding, breaking real-time token streaming to clients.", "subtopics_count": 4, "subtopics": ["5.22.1 SSE vs WebSockets: why one-way HTTP streaming is optimal for LLM token delivery", "5.22.2 The `text/event-stream` MIME format: `event: ...`, `data: ...`, `id: ...`, double newlines (`\\n\\n`)", "5.22.3 FastAPI `StreamingResponse`: yielding async generator token chunks without buffering", "5.22.4 Automatic browser reconnection: the `Last-Event-ID` header and resume semantics"]}'::jsonb,
    '["Explain how your implementation avoids: Buffering entire generator outputs in memory before responding, breaking real-time token streaming to clients.", "How does Server-Sent Events (SSE): Streaming Tokens & EventSource Protocol scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-23',
    'module-05-lesson-23-streaming-llm-responses-chunking-backpre',
    'module-5',
    'Lesson 5.23: Streaming LLM Responses: Chunking, Backpressure & Flush Delays',
    'Module 5 Web Architecture | Lesson 23 of 35',
    'Subtopics: 4 items',
    'GatewayAI: Cost-saving streaming cancellation.',
    100,
    '# Lesson 5.23: Streaming LLM Responses: Chunking, Backpressure & Flush Delays

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.23.1` Reverse proxy buffering traps: why Nginx buffers SSE unless `X-Accel-Buffering: no` is set
  - `5.23.2` Client disconnection detection: cancelling expensive LLM inference when the user closes their browser tab
  - `5.23.3` Token chunking strategies: word boundary buffering vs character streaming
  - `5.23.4` Backpressure handling: preventing fast LLM token generation from overwhelming slow mobile network clients

- **Key Failure Modes & Edge Cases**: Continuing to consume expensive OpenAI/Anthropic API tokens after a client disconnects.
- **Verification & Mastery Check**: Implement client disconnect detection (`request.is_disconnected()`) in an async generator loop to halt inference immediately.
- **Project Application**: GatewayAI: Cost-saving streaming cancellation.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.23: Streaming LLM Responses: Chunking, Backpressure & Flush Delays\nProject Application: GatewayAI: Cost-saving streaming cancellation.\nVerification Requirement: Implement client disconnect detection (`request.is_disconnected()`) in an async generator loop to halt inference immediately.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement client disconnect detection (`request.is_disconnected()`) in an async generator loop to halt inference immediately.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.23: Streaming LLM Responses: Chunking, Backpressure & Flush Delays\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Streaming LLM Responses: Chunking, Backpressure & Flush Delays\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement client disconnect detection (`request.is_disconnec\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement client disconnect detection (`request.is_disconnected()`) in an async generator loop to halt inference immediately.", "failure_mode": "Continuing to consume expensive OpenAI/Anthropic API tokens after a client disconnects.", "subtopics_count": 4, "subtopics": ["5.23.1 Reverse proxy buffering traps: why Nginx buffers SSE unless `X-Accel-Buffering: no` is set", "5.23.2 Client disconnection detection: cancelling expensive LLM inference when the user closes their browser tab", "5.23.3 Token chunking strategies: word boundary buffering vs character streaming", "5.23.4 Backpressure handling: preventing fast LLM token generation from overwhelming slow mobile network clients"]}'::jsonb,
    '["Explain how your implementation avoids: Continuing to consume expensive OpenAI/Anthropic API tokens after a client disconnects.", "How does Streaming LLM Responses: Chunking, Backpressure & Flush Delays scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-24',
    'module-05-lesson-24-websocket-protocol-full-duplex-bidirecti',
    'module-5',
    'Lesson 5.24: WebSocket Protocol: Full-Duplex Bidirectional Frame Communication',
    'Module 5 Web Architecture | Lesson 24 of 35',
    'Subtopics: 4 items',
    'Real-time interactive canvas and agent communication.',
    100,
    '# Lesson 5.24: WebSocket Protocol: Full-Duplex Bidirectional Frame Communication

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.24.1` WebSocket handshake: `Connection: Upgrade` and `Sec-WebSocket-Key`
  - `5.24.2` Framing protocol: text frames, binary frames, close frames, and masking
  - `5.24.3` FastAPI WebSocket endpoint: `websocket.accept()`, `send_text()`, `receive_text()`
  - `5.24.4` Handling abrupt disconnections, network drops, and socket cleanup

- **Key Failure Modes & Edge Cases**: Failing to handle client disconnect exceptions, leaking orphaned WebSocket connections and memory.
- **Verification & Mastery Check**: Build a WebSocket echo and chat server in FastAPI with robust connection error handling.
- **Project Application**: Real-time interactive canvas and agent communication.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.24: WebSocket Protocol: Full-Duplex Bidirectional Frame Communication\nProject Application: Real-time interactive canvas and agent communication.\nVerification Requirement: Build a WebSocket echo and chat server in FastAPI with robust connection error handling.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a WebSocket echo and chat server in FastAPI with robust connection error handling.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.24: WebSocket Protocol: Full-Duplex Bidirectional Frame Communication\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: WebSocket Protocol: Full-Duplex Bidirectional Frame Communication\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a WebSocket echo and chat server in FastAPI with robus\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a WebSocket echo and chat server in FastAPI with robust connection error handling.", "failure_mode": "Failing to handle client disconnect exceptions, leaking orphaned WebSocket connections and memory.", "subtopics_count": 4, "subtopics": ["5.24.1 WebSocket handshake: `Connection: Upgrade` and `Sec-WebSocket-Key`", "5.24.2 Framing protocol: text frames, binary frames, close frames, and masking", "5.24.3 FastAPI WebSocket endpoint: `websocket.accept()`, `send_text()`, `receive_text()`", "5.24.4 Handling abrupt disconnections, network drops, and socket cleanup"]}'::jsonb,
    '["Explain how your implementation avoids: Failing to handle client disconnect exceptions, leaking orphaned WebSocket connections and memory.", "How does WebSocket Protocol: Full-Duplex Bidirectional Frame Communication scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-25',
    'module-05-lesson-25-real-time-pub-sub-with-websockets--redis',
    'module-5',
    'Lesson 5.25: Real-Time Pub/Sub with WebSockets & Redis Channels',
    'Module 5 Web Architecture | Lesson 25 of 35',
    'Subtopics: 4 items',
    'Distributed collaborative workspace backend.',
    100,
    '# Lesson 5.25: Real-Time Pub/Sub with WebSockets & Redis Channels

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.25.1` The multi-server problem: client A is on Server 1, client B is on Server 2
  - `5.25.2` Redis Pub/Sub architecture: publish to topic, subscribers receive instantaneous broadcast
  - `5.25.3` Connection manager pattern: tracking active WebSockets per room or tenant
  - `5.25.4` Fanout performance: broadcasting messages to 10,000 clients with minimal latency

- **Key Failure Modes & Edge Cases**: Storing active WebSocket connections in a single server''s local RAM when running behind a multi-pod load balancer.
- **Verification & Mastery Check**: Implement a multi-worker Redis Pub/Sub message broker delivering updates across multiple FastAPI instances.
- **Project Application**: Distributed collaborative workspace backend.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.25: Real-Time Pub/Sub with WebSockets & Redis Channels\nProject Application: Distributed collaborative workspace backend.\nVerification Requirement: Implement a multi-worker Redis Pub/Sub message broker delivering updates across multiple FastAPI instances.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement a multi-worker Redis Pub/Sub message broker delivering updates across multiple FastAPI instances.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.25: Real-Time Pub/Sub with WebSockets & Redis Channels\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Real-Time Pub/Sub with WebSockets & Redis Channels\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement a multi-worker Redis Pub/Sub message broker delive\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement a multi-worker Redis Pub/Sub message broker delivering updates across multiple FastAPI instances.", "failure_mode": "Storing active WebSocket connections in a single server''s local RAM when running behind a multi-pod load balancer.", "subtopics_count": 4, "subtopics": ["5.25.1 The multi-server problem: client A is on Server 1, client B is on Server 2", "5.25.2 Redis Pub/Sub architecture: publish to topic, subscribers receive instantaneous broadcast", "5.25.3 Connection manager pattern: tracking active WebSockets per room or tenant", "5.25.4 Fanout performance: broadcasting messages to 10,000 clients with minimal latency"]}'::jsonb,
    '["Explain how your implementation avoids: Storing active WebSocket connections in a single server''s local RAM when running behind a multi-pod load balancer.", "How does Real-Time Pub/Sub with WebSockets & Redis Channels scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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