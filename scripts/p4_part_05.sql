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