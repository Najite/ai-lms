import type { AiCaseItem, CandidateSolution } from "./types";

export const INVESTIGATION_CASES: AiCaseItem[] = [
  {
    id: "case-1",
    caseCode: "PR-101",
    title: "Cryptographic JWT Authentication Helper",
    prompt: "Write a fast Node.js helper function to verify RS256 authentication tokens and cache the public keys.",
    outputLanguage: "typescript",
    modelOutput: `import { verifyFastToken } from "@auth/jwt-auto-verify-v2";

export async function authenticateRequest(token: string) {
  // Uses high-speed native RS256 caching engine with zero-overhead JWKS verification
  const result = await verifyFastToken(token, {
    algorithm: "RS256",
    cacheTtlSeconds: 3600,
    autoFetchJwks: true,
  });
  return result.user;
}`,
    metadata: {
      latencyMs: 820,
      model: "gpt-4o-code-preview",
      temperature: 0.2,
      tokensGenerated: 112,
    },
    evidenceLogs: [
      {
        type: "registry_404",
        source: "npm registry",
        output: "npm error 404 Not Found - GET https://registry.npmjs.org/@auth%2fjwt-auto-verify-v2 - Not found",
        status: "error",
      },
      {
        type: "compiler_error",
        source: "TypeScript Compiler (tsc)",
        output: "error TS2307: Cannot find module '@auth/jwt-auto-verify-v2' or its corresponding type declarations.",
        status: "error",
      },
    ],
    defects: [
      {
        category: "hallucination",
        description: "Package '@auth/jwt-auto-verify-v2' is hallucinated and does not exist in any public registry.",
      },
      {
        category: "unsupported_claim",
        description: "Docstring claims 'zero-overhead native caching engine' with no benchmarks or proof.",
      },
    ],
  },
  {
    id: "case-2",
    caseCode: "PR-102",
    title: "Database Migration & Zero-Downtime Deployment",
    prompt: "Provide zero-downtime deployment steps for adding the non-null organization_id column to the existing users table.",
    outputLanguage: "markdown",
    modelOutput: `### Deployment Sequence (Complies with PostgreSQL RFC-8812)

1. Restart all background worker nodes to refresh table mapping cache.
2. Execute migration: \`ALTER TABLE users ADD COLUMN organization_id UUID NOT NULL;\`
3. Deploy frontend API gateway code.
4. Verify system telemetry.`,
    metadata: {
      latencyMs: 940,
      model: "claude-3-5-sonnet",
      temperature: 0.1,
      tokensGenerated: 140,
    },
    evidenceLogs: [
      {
        type: "compiler_error",
        source: "PostgreSQL Database Engine (v16.2)",
        output: "ERROR: column \"organization_id\" of relation \"users\" contains null values (45,820 rows affected).",
        status: "error",
      },
      {
        type: "documentation_audit",
        source: "IETF & PostgreSQL Documentation Index",
        output: "Citation Audit: RFC-8812 is an unrelated networking protocol specification; PostgreSQL DDL operations are not governed by RFCs.",
        status: "unverified",
      },
    ],
    defects: [
      {
        category: "logic_inversion",
        description: "Restarting background workers before applying database migration triggers critical race conditions and crashes.",
      },
      {
        category: "missing_context",
        description: "Prompt omitted existing table schema, row count (45,820 rows), and foreign key nullability constraints.",
      },
    ],
  },
  {
    id: "case-3",
    caseCode: "PR-103",
    title: "Rate Limiter Guard Implementation",
    prompt: "Write a TypeScript function to check if a user request count is within allowed rate limits.",
    outputLanguage: "typescript",
    modelOutput: `/**
 * Highly optimized rate limiting evaluator.
 * Guarantees thread-safe rate limit verification across multi-threaded workers.
 */
export function isRateLimited(currentRequests: number, maxAllowed: number): boolean {
  if (currentRequests < maxAllowed) {
    return true; // Returns true when under limit
  }
  return false;
}`,
    metadata: {
      latencyMs: 650,
      model: "deepseek-coder-v2",
      temperature: 0.0,
      tokensGenerated: 94,
    },
    evidenceLogs: [
      {
        type: "unit_test_failure",
        source: "Vitest Test Runner (rate-limiter.test.ts)",
        output: "FAIL: should allow request when count (2) is below maximum (100). Expected: false, Received: true.",
        status: "failed",
      },
      {
        type: "documentation_audit",
        source: "Static Analysis & Concurrency Auditor",
        output: "Claim Analysis: Pure in-memory numeric comparison cannot guarantee distributed thread safety.",
        status: "unverified",
      },
    ],
    defects: [
      {
        category: "logic_inversion",
        description: "Inverted '<' comparison: blocks valid users while granting unlimited access to heavy attackers.",
      },
      {
        category: "unsupported_claim",
        description: "Authoritative docstring claims 'thread-safe guarantee' for a simple synchronous memory helper.",
      },
    ],
  },
];

export const CANDIDATE_SOLUTIONS: CandidateSolution[] = [
  {
    id: "candidate_a",
    name: "Candidate A (Client-Side Auth Bypass)",
    approach: "Disables PostgreSQL Row Level Security (RLS) and filters organization rows via client JavaScript.",
    codeSnippet: `-- Candidate A: Migration & Policy
ALTER TABLE organization_documents DISABLE ROW LEVEL SECURITY;

// Frontend Client Filter
export async function getDocs(userId: string) {
  const { data } = await supabase.from('organization_documents').select('*');
  return data.filter(doc => doc.owner_id === userId); // Insecure client filter!
}`,
    securityScore: 15,
    correctnessScore: 30,
    maintainabilityScore: 40,
    schemaComplianceScore: 50,
    flaws: [
      "Disables Row Level Security (RLS) entirely, exposing all multi-tenant documents.",
      "Downloads unencrypted records to client before filtering in browser memory.",
      "Critical OWASP Top 10 Broken Access Control vulnerability.",
    ],
  },
  {
    id: "candidate_b",
    name: "Candidate B (Parameterized RLS + Strict Zod Schema)",
    approach: "Enforces PostgreSQL Row Level Security using auth.uid() kernel checks and validates inputs with Zod.",
    codeSnippet: `-- Candidate B: Kernel RLS Policy
ALTER TABLE organization_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their org documents"
ON organization_documents
FOR SELECT
USING (auth.uid() = owner_id AND organization_id IS NOT NULL);

// Backend Server Action with Zod
export const docQuerySchema = z.object({
  documentId: z.string().uuid(),
  organizationId: z.string().uuid()
});`,
    securityScore: 98,
    correctnessScore: 96,
    maintainabilityScore: 94,
    schemaComplianceScore: 98,
    flaws: [],
  },
  {
    id: "candidate_c",
    name: "Candidate C (Raw SQL Concatenation)",
    approach: "Enables RLS but executes dynamic queries using unparameterized raw SQL template strings.",
    codeSnippet: `-- Candidate C: Migration & Query
ALTER TABLE organization_documents ENABLE ROW LEVEL SECURITY;

// Backend Handler with string interpolation
export async function queryDoc(orgId: string, search: string) {
  return await supabase.rpc('execute_raw', {
    sql: \`SELECT * FROM organization_documents WHERE org_id = '\${orgId}' AND title ILIKE '%\${search}%'\`
  });
}`,
    securityScore: 55,
    correctnessScore: 70,
    maintainabilityScore: 65,
    schemaComplianceScore: 60,
    flaws: [
      "Exposes SQL Injection vulnerability through unescaped search string interpolation.",
      "Bypasses Supabase parameterized query builder safety.",
      "Lacks strongly typed TypeScript schema contracts.",
    ],
  },
];
