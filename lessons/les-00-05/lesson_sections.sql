-- ============================================================================
-- LES-00-05: AI-Assisted Engineering: Context, Verification & Evals
-- Database Deliverable: Lesson Sections Seed Script
-- Target Lesson ID: c0000000-0000-0000-0000-000000000005
-- ============================================================================

INSERT INTO public.lesson_sections (
  id,
  lesson_id,
  section_order,
  section_type,
  section_title,
  section_slug,
  section_content,
  section_learning_goal,
  estimated_minutes,
  diagram_reference,
  key_takeaways
) VALUES
(
  'd0000005-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000005',
  1,
  'orientation',
  'The Promise & Risk of AI Assistance',
  'promise-and-risk-of-ai-assistance',
  '### The Opening Scenario: The Phantom Package Incident

It was 2:15 PM on a Friday at a high-growth fintech startup. An engineer named Jordan needed to implement cryptographic JWT token verification for a microservice API gateway.

Jordan opened an AI coding assistant and typed a quick prompt:
> *"Write a fast Node.js helper function to verify our RS256 authentication tokens and cache the public keys."*

Within 1.8 seconds, the AI generated beautifully formatted, clean TypeScript code with detailed comments:

```typescript
import { verifyFastToken } from "@auth/jwt-auto-verify-v2";

export async function authenticateRequest(token: string) {
  // Uses high-speed native RS256 caching engine
  const result = await verifyFastToken(token, {
    algorithm: "RS256",
    cacheTtlSeconds: 3600,
    autoFetchJwks: true,
  });
  return result.user;
}
```

The code looked immaculate. The variable names were descriptive, the options matched Jordan''s exact intent, and the explanation sounded authoritative: *"This implementation utilizes the industry-standard `@auth/jwt-auto-verify-v2` package which provides zero-overhead JWKS caching."*

Jordan committed the code and pushed to the staging branch. Three minutes later, CI failed:

```
error TS2307: Cannot find module ''@auth/jwt-auto-verify-v2'' or its corresponding type declarations.
npm error 404 Not Found - GET https://registry.npmjs.org/@auth%2fjwt-auto-verify-v2 - Not found
```

Jordan searched npm. **The package `@auth/jwt-auto-verify-v2` did not exist.** It had never existed. The AI had mathematically hallucinated a plausible package name. 

### Why AI Requires Engineering Rigor

AI accelerates code production by orders of magnitude, but speed without verification is technical debt on fast-forward. When you use AI, you are not abdicating responsibility; you are shifting your role from a manual code typist to an architectural verifier and evaluator.',
  'Understand why AI code generation requires rigorous verification and recognize the dangers of phantom packages and blind trust.',
  12,
  '{"type": "narrative_case_study", "incident_code": "INC-5012", "risk_type": "phantom_package"}'::jsonb,
  ARRAY[
    'AI fluency does not equal correctness or real-world existence.',
    'Blind copy-pasting AI code causes deployment failures and security vulnerabilities.',
    'Engineers are architects and verifiers, not passive consumers of AI output.'
  ]
),
(
  'd0000005-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000005',
  2,
  'concept_model',
  'What Large Language Models Actually Are',
  'what-large-language-models-actually-are',
  '### Pattern Prediction, Not Conscious Reasoning

To use an LLM effectively, you must understand what is happening under the hood without getting bogged down in complex mathematics.

An LLM is a probabilistic mathematical model trained on vast amounts of text and code. At its core, it does one thing:
**Given a sequence of input tokens, predict the probability distribution for the next token.**

```
Input Sequence: "function calculateTax(subtotal: number, rate:"

Top Candidate Predictions:
├── " number): number {"  (Probability: 88.4%)  ◄── Selected
├── " number = 0.05) {"   (Probability: 8.1%)
└── " any) {"             (Probability: 3.5%)
```

### Core Mental Model: Autocompletion for Reasoning Patterns

Think of an LLM as supercharged **autocompletion for patterns of thought**. 

### 3 Fundamental Realities of LLMs

1. **No Live Execution Engine**: The LLM does not execute code when it generates it. It does not run a hidden TypeScript compiler or test runtime performance. It generates what valid code looks like based on patterns.
2. **No Ground Truth Memory**: The model does not query a live relational database of truth. It outputs tokens that fit statistical patterns.
3. **Fluency vs Correctness**: Humans equate articulate communication with truth. LLMs are articulate 100% of the time, even when completely wrong.',
  'Understand that LLMs operate as probabilistic next-token predictors without live execution engines or intrinsic truth verification.',
  12,
  '{"type": "flow_diagram", "concept": "next_token_prediction"}'::jsonb,
  ARRAY[
    'LLMs predict the most statistically probable next token, not mathematical truth.',
    'LLMs do not execute code or run background compilers.',
    'High linguistic confidence does not guarantee logical correctness.'
  ]
),
(
  'd0000005-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000005',
  3,
  'concept_model',
  'Context Windows & How AI "Sees" Information',
  'context-windows-and-how-ai-sees-information',
  '### The Working Memory of AI

An LLM has no persistent memory between independent API requests. Every time you ask a question, the model only "knows" what you provide in that specific request''s **Context Window**.

### The Desk Analogy

Imagine an expert software consultant sitting in an isolated room with no internet connection. Every time you open the door, you hand them a desk full of papers (the Context Window). They can read whatever is currently on the desk and write an answer on a notepad. As soon as they finish, the room is wiped clean. If you forgot to put your database schema on the desk, they cannot read your mind—they must guess what your tables look like.

### The 4 Layers of Engineering Context

1. **Role & Operating Constraints (System Prompt)**: Declares identity, forbidden behaviors, and quality standards (e.g. AGENTS.md rules).
2. **Domain Ground Truth (Static Schemas & Types)**: The exact TypeScript interfaces, database tables, and API contracts.
3. **Environmental Context (Active Code)**: Existing file implementations and helper utilities.
4. **Task Objective (User Intent)**: Explicit requirements, edge cases, and expected errors.

### Context Pollution

Dumping an entire 50,000-line codebase into an AI causes **Context Pollution**. The model''s attention becomes diluted, leading to missed instructions and hallucinations. Provide the *minimum sufficient context* needed for the task.',
  'Master the context window mental model and learn to assemble clean, high-signal engineering context without pollution.',
  14,
  '{"type": "spatial_desk_model", "layers": ["system", "rules", "schemas", "task"]}'::jsonb,
  ARRAY[
    'The context window is the finite working memory of the model during a request.',
    'Without explicit types and schemas in context, the model is forced to guess.',
    'Curate high-signal, minimal sufficient context to avoid context pollution.'
  ]
),
(
  'd0000005-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000005',
  4,
  'security_spec',
  'Hallucinations & AI Failure Modes',
  'hallucinations-and-ai-failure-modes',
  '### The Taxonomy of AI Engineering Defects

When an AI assistant produces flawed code, the failure almost always falls into one of four distinct failure modes:

| Failure Mode | Description | Real-World Impact |
| :--- | :--- | :--- |
| **1. Phantom APIs & Packages** | Inventing non-existent libraries or methods. | Build crashes, typosquatting supply-chain risks. |
| **2. Subtle Logic Inversions** | Writing code with inverted boolean logic or off-by-one loops. | Security bypasses, rate limiter failures, silent data corruption. |
| **3. Sycophancy (False Yes)** | Agreeing with an incorrect developer premise. | Reinforcing architectural bugs and anti-patterns. |
| **4. Assumption Drift** | Forgetting a constraint given earlier in the conversation. | Violating database schema invariants or typing rules. |

### Real-World Example: The Inverted Boundary Bug

```typescript
// Prompt: "Check if request count is within limit"
export function isRateLimited(currentRequests: number, maxAllowed: number): boolean {
  // Bug: Returns true when UNDER the limit!
  if (currentRequests < maxAllowed) {
    return true; // INCORRECT: should return false
  }
  return false;
}
```

An engineer skimming this code might see clean syntax and descriptive names, but the boolean condition is inverted. If deployed without tests, all valid users are blocked while attackers get unlimited access.',
  'Identify the 4 primary AI failure modes (phantom APIs, logic inversions, sycophancy, assumption drift) and detect subtle defects.',
  14,
  '{"type": "matrix", "categories": ["phantom_apis", "logic_inversions", "sycophancy", "assumption_drift"]}'::jsonb,
  ARRAY[
    'Hallucinations take the form of plausible fiction, not obvious gibberish.',
    'Logic inversions look correct at a glance but invert critical behavior.',
    'AI assistants exhibit sycophancy: they may agree with your flawed assumptions.'
  ]
),
(
  'd0000005-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000005',
  5,
  'protocol_spec',
  'Verification & Evidence-Based Engineering',
  'verification-and-evidence-based-engineering',
  '### The Deterministic Verification Harness

Software engineering is an **evidence-based discipline**. An assertion is only true if it can be proven deterministically by a compiler, a test suite, or a formal specification.

Because LLMs are stochastic (probabilistic), you must sandwich every AI generation inside a **Deterministic Verification Loop**:

```
                         THE 3-STEP VERIFICATION LOOP
                         
       ┌──────────────┐
       │ 1. GENERATE  │  AI produces candidate code based on curated context.
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ 2. VALIDATE  │  Run deterministic tools:
       │ (Automated)  │  • TypeScript Compiler (`npx tsc --noEmit`)
       └──────┬───────┘  • ESLint (`npm run lint`)
              │          • Test Runner (`npx vitest run`)
              ▼
       ┌──────────────┐
       │  3. AUDIT    │  Human engineer audits edge cases, security posture,
       │   (Human)    │  and domain logic alignment before merging.
       └──────────────┘
```

### Ground Truth vs Stochastic Speculation

- **Stochastic (AI claim)**: *"I believe this function correctly parses all valid ISO 8601 timestamps."*
- **Deterministic (Engineering Verification)**: `npx vitest run` &rarr; 18 test cases pass across leap years, timezones, and null inputs.

Never accept stochastic claims without deterministic proof.',
  'Implement the 3-step verification loop (Generate → Validate → Audit) and establish automated deterministic harnesses.',
  14,
  '{"type": "verification_loop_diagram", "steps": ["generate", "validate", "audit"]}'::jsonb,
  ARRAY[
    'Software engineering requires deterministic evidence, not probabilistic guesses.',
    'Always run tsc, eslint, and vitest to validate AI-generated code.',
    'The human engineer remains the final auditor of logic, security, and architecture.'
  ]
),
(
  'd0000005-0000-0000-0000-000000000006',
  'c0000000-0000-0000-0000-000000000005',
  6,
  'tooling_guide',
  'Evals & Measuring AI Quality',
  'evals-and-measuring-ai-quality',
  '### What is an Eval?

In traditional software development, you write **Unit Tests** to ensure code behaves as expected. In AI engineering, you write **Evals (Evaluations)** to measure how reliably an AI system, prompt, or model solves a class of tasks.

### Analogy: Unit Testing for AI Outputs

An **Eval** is an automated, repeatable testing harness that runs a prompt or agent against a dataset of representative input scenarios and scores the output against strict objective criteria.

```
Input Benchmark Scenario (100 Test Cases)
     │
     ▼
AI Model Completion
     │
     ▼
Scoring Harness:
├── Deterministic Assertions (JSON schema valid? No runtime errors?)
├── Functional Tests (Did the code pass unit test suite?)
└── Metric Aggregation (Pass Rate: 94%, Latency: 850ms, Cost: $0.02)
```

### Two Types of Evaluators

1. **Deterministic Evaluators (Code-Based)**: Uses exact matching, regex, AST validation, or compiler exits. Fast, cheap, 100% reproducible.
2. **Model-Based Evaluators (LLM-as-a-Judge)**: Uses an independent model to evaluate nuanced qualitative attributes like explanation clarity or tone.',
  'Understand what AI evaluations (evals) are and how deterministic and model-based scoring harnesses measure AI quality.',
  12,
  '{"type": "eval_pipeline", "components": ["dataset", "runner", "grader", "metrics"]}'::jsonb,
  ARRAY[
    'Evals are automated benchmarks that systematically score AI prompt and model quality.',
    'Deterministic evals use code and tests to grade schema compliance and correctness.',
    'Evals prevent silent regressions when updating prompts, models, or context.'
  ]
),
(
  'd0000005-0000-0000-0000-000000000007',
  'c0000000-0000-0000-0000-000000000005',
  7,
  'synthesis',
  'The AI-Native Engineer Workflow',
  'the-ai-native-engineer-workflow',
  '### The 5-Step Operational Discipline

To work as a high-performing AI-native engineer, follow this 5-step lifecycle on every task:

1. **Specify Intent**: Write clear requirements, acceptance criteria, and error behaviors before prompting.
2. **Assemble Context**: Gather relevant interfaces, schemas, and project constraints. Eliminate noise.
3. **Constrain Generation**: Prompt with explicit instructions: *"Return ONLY TypeScript. Follow schema X. Do not introduce dependencies."*
4. **Run Test Harness**: Execute linters, compilers, and test suites to catch hallucinations immediately.
5. **Audit & Commit**: Review the diff with human engineering scrutiny.

### Preparation for EXE-00-05

In the upcoming exercise (**`EXE-00-05: AI Verification & Evaluation Investigation`**), you will act as an **AI Evaluation Engineer**:
- Inspect candidate AI outputs across diagnostic scenarios.
- Identify hallucinations, phantom imports, and subtle logic inversions.
- Grade response quality using deterministic evaluation criteria.
- Detect missing context that caused model failures.
- Certify verified, production-grade solutions.',
  'Synthesize the 5-step AI-native engineering cycle and prepare for practical diagnostic evaluation in EXE-00-05.',
  12,
  '{"type": "workflow_cycle", "phases": ["specify", "assemble", "constrain", "test", "audit"]}'::jsonb,
  ARRAY[
    'AI-native engineering combines precise intent specification with automated verification.',
    'Constrain generation to exact schemas and existing libraries.',
    'You are ready for EXE-00-05: AI Verification & Evaluation Investigation.'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  section_order = EXCLUDED.section_order,
  section_type = EXCLUDED.section_type,
  section_title = EXCLUDED.section_title,
  section_slug = EXCLUDED.section_slug,
  section_content = EXCLUDED.section_content,
  section_learning_goal = EXCLUDED.section_learning_goal,
  estimated_minutes = EXCLUDED.estimated_minutes,
  diagram_reference = EXCLUDED.diagram_reference,
  key_takeaways = EXCLUDED.key_takeaways,
  updated_at = NOW();
