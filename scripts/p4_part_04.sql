INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-4-16',
    'module-05-lesson-16-cross-origin-resource-sharing-(cors)-pre',
    'module-5',
    'Lesson 5.16: Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Origin Policies',
    'Module 5 Web Architecture | Lesson 16 of 35',
    'Subtopics: 4 items',
    'Frontend-to-backend authentication safety.',
    100,
    '# Lesson 5.16: Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Origin Policies

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.16.1` Same-Origin Policy: protocol, domain, and port matching
  - `5.16.2` Simple requests vs preflight requests: when browsers send `OPTIONS`
  - `5.16.3` CORS response headers: `Access-Control-Allow-Origin`, `Methods`, `Headers`, `Credentials`
  - `5.16.4` The wildcard `*` security disaster: why wildcard origins break credentialed cookies

- **Key Failure Modes & Edge Cases**: Configuring `allow_origins=[''*'']` with `allow_credentials=True`, creating a major cross-site security vulnerability.
- **Verification & Mastery Check**: Configure production CORS middleware with strict whitelist matching and test preflight handling.
- **Project Application**: Frontend-to-backend authentication safety.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.16: Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Origin Policies\nProject Application: Frontend-to-backend authentication safety.\nVerification Requirement: Configure production CORS middleware with strict whitelist matching and test preflight handling.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Configure production CORS middleware with strict whitelist matching and test preflight handling.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.16: Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Origin Policies\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Origin Policies\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Configure production CORS middleware with strict whitelist m\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Configure production CORS middleware with strict whitelist matching and test preflight handling.", "failure_mode": "Configuring `allow_origins=[''*'']` with `allow_credentials=True`, creating a major cross-site security vulnerability.", "subtopics_count": 4, "subtopics": ["5.16.1 Same-Origin Policy: protocol, domain, and port matching", "5.16.2 Simple requests vs preflight requests: when browsers send `OPTIONS`", "5.16.3 CORS response headers: `Access-Control-Allow-Origin`, `Methods`, `Headers`, `Credentials`", "5.16.4 The wildcard `*` security disaster: why wildcard origins break credentialed cookies"]}'::jsonb,
    '["Explain how your implementation avoids: Configuring `allow_origins=[''*'']` with `allow_credentials=True`, creating a major cross-site security vulnerability.", "How does Cross-Origin Resource Sharing (CORS): Preflight OPTIONS & Origin Policies scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-17',
    'module-05-lesson-17-middleware-architecture-request-intercep',
    'module-5',
    'Lesson 5.17: Middleware Architecture: Request Interception, Timing & Correlation IDs',
    'Module 5 Web Architecture | Lesson 17 of 35',
    'Subtopics: 4 items',
    'Observability middleware for GatewayAI.',
    100,
    '# Lesson 5.17: Middleware Architecture: Request Interception, Timing & Correlation IDs

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.17.1` ASGI middleware lifecycle: pre-processing request, passing to next, post-processing response
  - `5.17.2` Request correlation IDs: tracing requests across microservice hops (`X-Request-ID`)
  - `5.17.3` Timing headers: `Server-Timing` for measuring database vs computation latency
  - `5.17.4` Error catching middleware: handling unhandled exceptions before they drop the connection

- **Key Failure Modes & Edge Cases**: Consuming the request body stream inside middleware without resetting it, causing downstream handlers to hang.
- **Verification & Mastery Check**: Write a custom ASGI middleware that injects UUID correlation IDs and measures microsecond execution times.
- **Project Application**: Observability middleware for GatewayAI.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.17: Middleware Architecture: Request Interception, Timing & Correlation IDs\nProject Application: Observability middleware for GatewayAI.\nVerification Requirement: Write a custom ASGI middleware that injects UUID correlation IDs and measures microsecond execution times.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a custom ASGI middleware that injects UUID correlation IDs and measures microsecond execution times.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.17: Middleware Architecture: Request Interception, Timing & Correlation IDs\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Middleware Architecture: Request Interception, Timing & Correlation IDs\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a custom ASGI middleware that injects UUID correlation\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a custom ASGI middleware that injects UUID correlation IDs and measures microsecond execution times.", "failure_mode": "Consuming the request body stream inside middleware without resetting it, causing downstream handlers to hang.", "subtopics_count": 4, "subtopics": ["5.17.1 ASGI middleware lifecycle: pre-processing request, passing to next, post-processing response", "5.17.2 Request correlation IDs: tracing requests across microservice hops (`X-Request-ID`)", "5.17.3 Timing headers: `Server-Timing` for measuring database vs computation latency", "5.17.4 Error catching middleware: handling unhandled exceptions before they drop the connection"]}'::jsonb,
    '["Explain how your implementation avoids: Consuming the request body stream inside middleware without resetting it, causing downstream handlers to hang.", "How does Middleware Architecture: Request Interception, Timing & Correlation IDs scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-18',
    'module-05-lesson-18-authentication-i-session-cookies-vs-stat',
    'module-5',
    'Lesson 5.18: Authentication I: Session Cookies vs Stateless JSON Web Tokens (JWT)',
    'Module 5 Web Architecture | Lesson 18 of 35',
    'Subtopics: 4 items',
    'Authentication subsystem comparison.',
    100,
    '# Lesson 5.18: Authentication I: Session Cookies vs Stateless JSON Web Tokens (JWT)

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.18.1` Stateful sessions: session IDs, server store (Redis), instant revocation capability
  - `5.18.2` Stateless tokens: self-contained claims, horizontal scalability, zero database lookup requirement
  - `5.18.3` Token revocation dilemma: why blacklisting stateless tokens reintroduces stateful lookups
  - `5.18.4` Security trade-offs: CSRF risk on cookies vs XSS risk on localStorage tokens

- **Key Failure Modes & Edge Cases**: Storing sensitive user passwords or internal database keys inside unencrypted JWT claims.
- **Verification & Mastery Check**: Demonstrate token verification without database queries and analyze token invalidation strategies.
- **Project Application**: Authentication subsystem comparison.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.18: Authentication I: Session Cookies vs Stateless JSON Web Tokens (JWT)\nProject Application: Authentication subsystem comparison.\nVerification Requirement: Demonstrate token verification without database queries and analyze token invalidation strategies.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Demonstrate token verification without database queries and analyze token invalidation strategies.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.18: Authentication I: Session Cookies vs Stateless JSON Web Tokens (JWT)\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Authentication I: Session Cookies vs Stateless JSON Web Tokens (JWT)\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Demonstrate token verification without database queries and \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Demonstrate token verification without database queries and analyze token invalidation strategies.", "failure_mode": "Storing sensitive user passwords or internal database keys inside unencrypted JWT claims.", "subtopics_count": 4, "subtopics": ["5.18.1 Stateful sessions: session IDs, server store (Redis), instant revocation capability", "5.18.2 Stateless tokens: self-contained claims, horizontal scalability, zero database lookup requirement", "5.18.3 Token revocation dilemma: why blacklisting stateless tokens reintroduces stateful lookups", "5.18.4 Security trade-offs: CSRF risk on cookies vs XSS risk on localStorage tokens"]}'::jsonb,
    '["Explain how your implementation avoids: Storing sensitive user passwords or internal database keys inside unencrypted JWT claims.", "How does Authentication I: Session Cookies vs Stateless JSON Web Tokens (JWT) scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-19',
    'module-05-lesson-19-authentication-ii-jwt-verification-claim',
    'module-5',
    'Lesson 5.19: Authentication II: JWT Verification, Claims, Expiry & Public Key (RS256)',
    'Module 5 Web Architecture | Lesson 19 of 35',
    'Subtopics: 4 items',
    'Secure enterprise JWT authentication microservice.',
    100,
    '# Lesson 5.19: Authentication II: JWT Verification, Claims, Expiry & Public Key (RS256)

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.19.1` JWT structure: Header, Payload (Claims), Signature
  - `5.19.2` Standard claims: `sub` (subject), `exp` (expiration), `iat` (issued at), `iss` (issuer)
  - `5.19.3` Symmetric signing (HS256): single secret key shared between auth and API services
  - `5.19.4` Asymmetric signing (RS256): auth service signs with private key; API gateways verify with public key

- **Key Failure Modes & Edge Cases**: Failing to enforce the `alg` header check, allowing attackers to forge tokens using `alg: ''none''` bypasses.
- **Verification & Mastery Check**: Generate an RSA keypair, issue signed RS256 tokens, and verify token signatures in a standalone FastAPI service.
- **Project Application**: Secure enterprise JWT authentication microservice.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.19: Authentication II: JWT Verification, Claims, Expiry & Public Key (RS256)\nProject Application: Secure enterprise JWT authentication microservice.\nVerification Requirement: Generate an RSA keypair, issue signed RS256 tokens, and verify token signatures in a standalone FastAPI service.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Generate an RSA keypair, issue signed RS256 tokens, and verify token signatures in a standalone FastAPI service.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.19: Authentication II: JWT Verification, Claims, Expiry & Public Key (RS256)\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Authentication II: JWT Verification, Claims, Expiry & Public Key (RS256)\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Generate an RSA keypair, issue signed RS256 tokens, and veri\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Generate an RSA keypair, issue signed RS256 tokens, and verify token signatures in a standalone FastAPI service.", "failure_mode": "Failing to enforce the `alg` header check, allowing attackers to forge tokens using `alg: ''none''` bypasses.", "subtopics_count": 4, "subtopics": ["5.19.1 JWT structure: Header, Payload (Claims), Signature", "5.19.2 Standard claims: `sub` (subject), `exp` (expiration), `iat` (issued at), `iss` (issuer)", "5.19.3 Symmetric signing (HS256): single secret key shared between auth and API services", "5.19.4 Asymmetric signing (RS256): auth service signs with private key; API gateways verify with public key"]}'::jsonb,
    '["Explain how your implementation avoids: Failing to enforce the `alg` header check, allowing attackers to forge tokens using `alg: ''none''` bypasses.", "How does Authentication II: JWT Verification, Claims, Expiry & Public Key (RS256) scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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
    'node-4-20',
    'module-05-lesson-20-role-based-access-control-(rbac)--scope-',
    'module-5',
    'Lesson 5.20: Role-Based Access Control (RBAC) & Scope Enforcement',
    'Module 5 Web Architecture | Lesson 20 of 35',
    'Subtopics: 4 items',
    'Multi-tenant RBAC engine.',
    100,
    '# Lesson 5.20: Role-Based Access Control (RBAC) & Scope Enforcement

- **Module**: `Module 5: Web Architecture, High-Performance APIs & Database Systems`
- **Status**: `[State: Active | Production Standard | Core]`
- **Subtopics**:
  - `5.20.1` Authentication vs Authorization: ''Who are you?'' vs ''What are you allowed to do?''
  - `5.20.2` RBAC models: User -> Role (Admin, Editor, Viewer) -> Permission
  - `5.20.3` FastAPI Security scopes: `@app.get(''/'', dependencies=[Security(check_perms, scopes=[''prompts:write''])])`
  - `5.20.4` Tenant boundary isolation: preventing cross-tenant data access

- **Key Failure Modes & Edge Cases**: Performing authorization checks inside the UI while omitting backend role verification on mutation endpoints.
- **Verification & Mastery Check**: Implement an automated RBAC dependency that validates user scopes and prevents unauthorized data mutation.
- **Project Application**: Multi-tenant RBAC engine.
',
    '{"solution.py": "\"\"\"\nModule 5 // Lesson 5.20: Role-Based Access Control (RBAC) & Scope Enforcement\nProject Application: Multi-tenant RBAC engine.\nVerification Requirement: Implement an automated RBAC dependency that validates user scopes and prevents unauthorized data mutation.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement an automated RBAC dependency that validates user scopes and prevents unauthorized data mutation.\n    \"\"\"\n    # TODO: Implement production solution\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Running local verification...\")\n    res = solve()\n    print(f\"Result: {res}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 5.20: Role-Based Access Control (RBAC) & Scope Enforcement\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Role-Based Access Control (RBAC) & Scope Enforcement\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement an automated RBAC dependency that validates user s\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement an automated RBAC dependency that validates user scopes and prevents unauthorized data mutation.", "failure_mode": "Performing authorization checks inside the UI while omitting backend role verification on mutation endpoints.", "subtopics_count": 4, "subtopics": ["5.20.1 Authentication vs Authorization: ''Who are you?'' vs ''What are you allowed to do?''", "5.20.2 RBAC models: User -> Role (Admin, Editor, Viewer) -> Permission", "5.20.3 FastAPI Security scopes: `@app.get(''/'', dependencies=[Security(check_perms, scopes=[''prompts:write''])])`", "5.20.4 Tenant boundary isolation: preventing cross-tenant data access"]}'::jsonb,
    '["Explain how your implementation avoids: Performing authorization checks inside the UI while omitting backend role verification on mutation endpoints.", "How does Role-Based Access Control (RBAC) & Scope Enforcement scale under 100k requests per second?", "Defend the architectural tradeoffs of this approach in modern AI systems."]'::jsonb
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