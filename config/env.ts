import { z } from "zod";

/**
 * Server-Side Environment Variables Schema (Private / Secret)
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
});

/**
 * Client-Side Environment Variables Schema (Public - prefixed with NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL").default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required").default("placeholder_anon_key"),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
});

/**
 * Merged Environment Schema
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema);

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const isServer = typeof window === "undefined";

  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  };

  if (!isServer) {
    // Client-side validation: only validate public variables
    const clientResult = clientEnvSchema.safeParse(rawEnv);
    if (!clientResult.success) {
      console.error("❌ Invalid client environment variables:", clientResult.error.format());
      throw new Error("Invalid client environment configuration.");
    }
    return clientResult.data as Env;
  }

  // Server-side validation: validate all variables
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    console.error("❌ Invalid server environment variables:", result.error.format());
    // In production, throw an error to fail fast
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid server environment configuration.");
    }
  }

  return (result.success ? result.data : rawEnv) as Env;
}

export const env = validateEnv();
