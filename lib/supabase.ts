import { createClient } from "@supabase/supabase-js";

/**
 * Public Supabase credentials ONLY.
 *
 * SECURITY CONTRACT: this module is imported by client components, so anything
 * read here is serialized into the browser bundle. Never fall back to
 * `SUPABASE_SERVICE_ROLE_KEY` (or any server-only secret) — doing so would hand
 * every visitor RLS-bypassing database access.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when both public Supabase env vars are present at build/runtime. */
export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && process.env.NODE_ENV !== "test") {
  console.error(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. " +
      "Database-backed features will fall back to local cache only."
  );
}

// Fall back to inert placeholders rather than throwing at module evaluation time:
// every call site already degrades gracefully when the request fails, but a thrown
// import error would blank the whole route.
export const supabase = createClient(
  supabaseUrl || "http://localhost:54321",
  supabaseAnonKey || "anon-key-not-configured"
);
