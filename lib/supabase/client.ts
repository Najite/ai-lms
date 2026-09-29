import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/config/env";
import type { Database } from "@/lib/supabase/types";

let clientSingleton: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or returns a singleton Supabase client for browser execution.
 */
export function createClient() {
  if (typeof window === "undefined") {
    return createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  if (!clientSingleton) {
    clientSingleton = createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  return clientSingleton;
}
