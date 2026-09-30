-- ============================================================================
-- Migration: LES-00-05 Seed Script
-- Module: MOD-00 Digital Foundations
-- Target Competency: AIE-00 (AI Engineering Foundations)
-- Target Lesson ID: c0000000-0000-0000-0000-000000000005
-- ============================================================================

-- 1. Ensure Target Competency AIE-00 exists
INSERT INTO public.competencies (
  id,
  category_id,
  slug,
  code,
  title,
  description,
  statement,
  level,
  order_index,
  is_published
) VALUES (
  'a1e00000-0000-0000-0000-000000000000',
  '9f3812c1-f87f-4587-a592-a91d3a5c30d8',
  'aie-00-ai-engineering-foundations',
  'AIE-00',
  'AI Engineering Foundations',
  'Master fundamental AI-assisted engineering practices, context window management, hallucination detection, verification loops, and deterministic evaluation harnesses.',
  'Can effectively collaborate with AI models by providing clean context, identifying hallucinations and logic inversions, and validating code through deterministic verification loops.',
  'foundational',
  5,
  true
)
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- 2. Update Lesson Record for LES-00-05
UPDATE public.lessons
SET
  title = 'AI-Assisted Engineering: Context, Verification & Evals',
  slug = 'les-00-05-ai-assisted-engineering-context-verification-evals',
  summary = 'Master professional AI collaboration: learn what LLMs are, how context windows function, how to identify hallucinations and logic inversions, execute the 3-step verification loop, and design deterministic evals.',
  estimated_minutes = 90,
  order_index = 5,
  is_published = true,
  updated_at = NOW()
WHERE id = 'c0000000-0000-0000-0000-000000000005';

-- 3. Clean and Seed Lesson Sections (7 Interactive Concept Cards)
DELETE FROM public.lesson_sections WHERE lesson_id = 'c0000000-0000-0000-0000-000000000005';

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

An LLM is a probabilistic mathematical model trained on petabytes of text and source code. At its core, it does one thing:

> **Given a sequence of input tokens, predict the probability distribution for the next token.**

```
Input Sequence: "function calculateTax(subtotal: number, rate:"

Top Candidate Predictions:
├── " number): number {"  (Probability: 88.4%)  ◄── Selected
├── " number = 0.05) {"   (Probability: 8.1%)
└── " any) {"             (Probability: 3.5%)
```

### Critical Realities of LLMs

1. **No Live Execution Engine**: The LLM does not execute code when it generates it. It does not run a hidden TypeScript compiler, execute SQL queries, or launch a browser to test UI layout. It predicts what valid code looks like based on patterns.
2. **No Ground Truth Memory**: The model does not query a live relational database of truth. It outputs tokens that fit the statistical distribution of its weights and your prompt.
3. **Fluency != Correctness**: Human psychology naturally equates articulate, fluent communication with intelligence and truthfulness. LLMs exploit this cognitive bias because they are flawlessly articulate 100% of the time, even when their underlying logic is completely wrong.',
  'Explain the fundamental mechanics of LLM token prediction and recognize that linguistic fluency is independent of logical correctness.',
  12,
  '{"type": "prediction_diagram", "architecture": "token_completion_tree"}'::jsonb,
  ARRAY[
    'LLMs are next-token probabilistic predictors, not reasoning engines with execution environments.',
    'LLMs do not run compilers or test suites during code generation.',
    'Linguistic fluency must never be confused with algorithmic correctness.'
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

> **The Desk Analogy**:
> Imagine an expert software consultant sitting in an isolated room with no internet connection. Every time you open the door, you hand them a desk full of papers (the Context Window). They can read whatever is currently on the desk and write an answer on a notepad. As soon as they finish, the room is wiped clean. If you forgot to put your database schema on the desk, they cannot read your mind—they must guess what your tables look like.

### The 4 Layers of Engineering Context

When assembling context for an AI assistant, high-performing engineers provide four distinct layers:

1. **Role & Operating Constraints (System Prompt)**: Declares the agent''s identity, forbidden behaviors, and quality standards (e.g. *Antigravity Constitution / AGENTS.md*).
2. **Domain Ground Truth (Static Schemas & Types)**: The exact TypeScript interfaces, database tables, and API contracts the code must satisfy.
3. **Environmental Context (Active Code & Dependencies)**: The existing file implementations, imported package versions, and helper utilities.
4. **Task Objective (User Intent & Acceptance Criteria)**: Explicit input/output requirements, edge cases to handle, and expected error responses.

### Context Pollution & "Lost in the Middle"

More context is not always better. Dumping an entire 50,000-line codebase into an AI''s context window creates **Context Pollution**. The model''s attention becomes diluted, leading to missed instructions, slower response times, and higher hallucination rates. High-leverage engineering involves curating the *minimum sufficient context* needed to solve the task.',
  'Master context window mechanics, understand how attention degradation works, and structure multi-layered engineering context.',
  14,
  '{"type": "architecture_diagram", "model": "4_layer_context_stack"}'::jsonb,
  ARRAY[
    'Context windows represent the finite working memory of an LLM during inference.',
    'High-quality context consists of System Constraints, Domain Schemas, Active Code, and Explicit Intent.',
    'Context pollution degrades model performance; curate minimum sufficient context.'
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

1. **Phantom APIs & Packages**: Inventing non-existent npm modules, functions, or CLI options that sound plausible.
2. **Subtle Logic Inversions**: Writing code that looks elegant but has inverted boolean conditions, `<` vs `>`, or off-by-one errors.
3. **Sycophancy (False Validation)**: Confirming a flawed design idea from the user rather than warning about security risks.
4. **Assumption Drift**: Silently ignoring explicit architectural rules given earlier in the conversation.

### Real-World Example: The Inverted Boundary Bug

Consider this AI-generated rate limiter:

```typescript
// AI Prompt: "Write a function that checks if user request count is within limit"
export function isRateLimited(currentRequests: number, maxAllowed: number): boolean {
  // Bug: Returns true when UNDER the limit!
  if (currentRequests < maxAllowed) {
    return true; // INCORRECT: should return false (not rate limited)
  }
  return false;
}
```

An engineer skimming this code might see descriptive names, clean syntax, and a sensible `if` condition. But the boolean return value is completely inverted. If deployed without unit tests, all valid users would be blocked and attackers would be granted unlimited access.',
  'Identify the 4 primary AI failure modes (phantom APIs, logic inversions, sycophancy, assumption drift) in generated code.',
  14,
  '{"type": "defect_taxonomy", "failure_modes": 4}'::jsonb,
  ARRAY[
    'Hallucinations include phantom packages, fake methods, and inverted logic.',
    'Logic inversions in AI code frequently pass casual human visual inspection.',
    'Sycophancy causes models to agree with buggy developer assumptions.'
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

- **Stochastic (AI output)**: *"I believe this function correctly parses all valid ISO 8601 timestamps."*
- **Deterministic (Engineering Verification)**: `npx vitest run tests/unit/date-parser.test.ts` -> 18 test cases pass across leap years, leap seconds, negative offsets, and null inputs.

Never accept stochastic claims without deterministic proof.',
  'Implement the 3-step verification loop (Generate -> Deterministic Validate -> Human Audit) across development workflows.',
  14,
  '{"type": "verification_loop", "steps": ["generate", "validate", "audit"]}'::jsonb,
  ARRAY[
    'Software engineering is evidence-based: assertions require deterministic verification.',
    'Always validate AI output with compilers (tsc), linters (eslint), and tests (vitest).',
    'Human engineering judgment remains the final line of architectural defense.'
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

> **The Definition of an Eval**:
> An **Eval** is an automated, repeatable testing harness that runs a prompt or agent against a dataset of representative input scenarios and scores the output against strict objective criteria (e.g. schema compliance, functional correctness, safety, and latency).

### Two Types of Evaluators

1. **Deterministic Evaluators (Code-Based)**: Uses exact matching, regex patterns, AST parsing, or compiler exits. Fast, cheap, 100% reproducible. (e.g. *Did the AI return a valid JSON payload with all required fields?*)
2. **Model-Based Evaluators (LLM-as-a-Judge)**: Uses a stronger, highly-prompted model to grade nuanced qualities like explanation clarity, code maintainability, or tone.',
  'Define AI evaluations (evals), distinguish between deterministic and model-based evaluators, and construct basic scoring criteria.',
  12,
  '{"type": "eval_architecture", "evaluator_types": ["deterministic", "llm_as_judge"]}'::jsonb,
  ARRAY[
    'Evals are unit tests for AI workflows and model prompts.',
    'Deterministic evals test syntax, JSON schema validity, and test suite passage.',
    'Model-based evals use LLM-as-a-Judge for semantic quality and readability scoring.'
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

1. **SPECIFY INTENT**: Write clear requirements, acceptance criteria, and expected error behavior before prompting.
2. **ASSEMBLE CONTEXT**: Gather relevant interfaces, type definitions, and project constraints. Eliminate irrelevant noise.
3. **CONSTRAIN GENERATION**: Prompt with explicit instructions: *"Return ONLY TypeScript. Follow schema X. Do not add packages."*
4. **RUN TEST HARNESS**: Execute linters, compilers, and test suites to catch hallucinations and inverted logic immediately.
5. **AUDIT & COMMIT**: Review the diff with human engineering scrutiny. Verify no subtle vulnerabilities exist.

### Preparation for `EXE-00-05`

In the upcoming exercise (**`EXE-00-05: AI Verification & Evaluation Investigation`**), you will step into the shoes of an **AI Evaluation Engineer**. You will not write blind prompts. Instead, you will:

1. Inspect candidate AI outputs across multiple diagnostic scenarios.
2. Identify hallucinations, phantom imports, and subtle logic inversions.
3. Grade AI response quality using deterministic evaluation criteria.
4. Detect missing context that caused the model to fail.
5. Verify evidence to certify safe, production-grade solutions.',
  'Synthesize the 5-step AI-native engineering lifecycle and prepare for practical diagnostic evals in EXE-00-05.',
  12,
  '{"type": "workflow_cycle", "steps": 5, "successor_target": "EXE-00-05"}'::jsonb,
  ARRAY[
    'AI-native engineering follows: Specify -> Assemble Context -> Constrain -> Test Harness -> Audit.',
    'Engineering mastery is demonstrated through rigorous verification, not blind trust.',
    'Prepares the learner for practical hallucination detection and evals in EXE-00-05.'
  ]
);

-- 4. Clean and Seed Lesson Checkpoints (5 Formative Assessments)
DELETE FROM public.lesson_checkpoints WHERE lesson_id = 'c0000000-0000-0000-0000-000000000005';

INSERT INTO public.lesson_checkpoints (
  id,
  lesson_id,
  checkpoint_order,
  question,
  question_slug,
  options,
  correct_option_index,
  explanation,
  bloom_level
) VALUES
(
  'e0000005-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000005',
  1,
  'Which statement most accurately describes how a Large Language Model (LLM) generates code solutions?',
  'llm-generation-mechanism',
  '[
    {"id": 0, "text": "It executes the code in a background compiler sandbox to verify runtime behavior before displaying the answer."},
    {"id": 1, "text": "It predicts the next most statistically probable sequence of tokens based on its training distribution and the provided context window."},
    {"id": 2, "text": "It queries an internal live SQL database containing verified solutions for every programming problem."},
    {"id": 3, "text": "It is a conscious logical agent that guarantees 100% mathematical correctness on every response."}
  ]'::jsonb,
  1,
  'LLMs are statistical token prediction engines. They do not have live compilers or execution environments built into their inference loop, which is why generated code must always be tested.',
  'understand'
),
(
  'e0000005-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000005',
  2,
  'In AI-assisted software engineering, what is the role and nature of the "Context Window"?',
  'context-window-definition',
  '[
    {"id": 0, "text": "It is the terminal window where command-line flags and shell parameters are typed."},
    {"id": 1, "text": "It is the finite working memory buffer (including system rules, schemas, active code, and prompt text) that the model reads during inference."},
    {"id": 2, "text": "It is a cloud cache where all past conversations across all developers are permanently archived."},
    {"id": 3, "text": "It is the browser viewport where the frontend application renders HTML elements."}
  ]'::jsonb,
  1,
  'The context window is the model''s active working memory desk. If key types or requirements are missing from the context window, the AI is forced to guess and hallucinate.',
  'understand'
),
(
  'e0000005-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000003',
  3,
  'What constitutes an "AI Hallucination" in the context of software engineering?',
  'ai-hallucination-definition',
  '[
    {"id": 0, "text": "A compilation error caused by a syntax typo in the developer''s prompt text."},
    {"id": 1, "text": "When the model generates confident, syntactically clean output that references non-existent packages, fabricated API methods, or invalid logic."},
    {"id": 2, "text": "When the AI API takes more than 10 seconds to generate an answer due to network traffic."},
    {"id": 3, "text": "When an API key expires due to billing limits."}
  ]'::jsonb,
  1,
  'Hallucinations occur when the model produces plausible fiction—authoritative-sounding code that invents APIs or packages that do not exist in reality.',
  'analyze'
),
(
  'e0000005-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000005',
  4,
  'Why is automated and human verification strictly mandatory when working with AI coding assistants?',
  'verification-mandate',
  '[
    {"id": 0, "text": "Because AI fluency and high linguistic confidence do not guarantee logical correctness, type safety, or security."},
    {"id": 1, "text": "Because AI models intentionally write broken code to test developers."},
    {"id": 2, "text": "Because code editors refuse to save files generated by AI models without human signatures."},
    {"id": 3, "text": "Because AI tools are only licensed for educational use, not production deployment."}
  ]'::jsonb,
  0,
  'LLMs sound equally confident whether they are 100% right or 100% wrong. Deterministic tools (compilers, linters, tests) and human inspection are the only objective arbiters of correctness.',
  'evaluate'
),
(
  'e0000005-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000005',
  5,
  'What is an "Eval" (Evaluation) in the discipline of AI engineering?',
  'eval-definition-engineering',
  '[
    {"id": 0, "text": "The JavaScript eval() statement used to execute dynamic string code at runtime."},
    {"id": 1, "text": "A repeatable, automated test harness that benchmarks model outputs against predefined ground truth, schema rules, and quality metrics."},
    {"id": 2, "text": "The annual salary performance review conducted for software engineering staff."},
    {"id": 3, "text": "A single prompt asking the AI model if it is confident in its own answer."}
  ]'::jsonb,
  1,
  'Evals are the unit tests of AI engineering, allowing developers to objectively measure model accuracy, regression resistance, and prompt effectiveness across standardized benchmarks.',
  'apply'
);
