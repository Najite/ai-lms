import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lfsyndffrfwvdfzjsagl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmc3luZGZmcmZ3dmRmempzYWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3Mzg1NzAsImV4cCI6MjEwNTMxNDU3MH0.8647rmDs_5wUXCKdfQSDpGDFaQLgQpuMhmoBaNNfMvQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CurriculumPhase {
  id: string;
  title: string;
  order_index: number;
  description: string;
}

export interface CurriculumNode {
  id: string;
  slug: string;
  phase_id: string;
  title: string;
  subtitle: string;
  cs_foundation: string;
  ai_convergence: string;
  xp_reward: number;
  level_required: number;
  position_x: number;
  position_y: number;
  handbook_markdown: string;
  notebooklm_audio_url?: string | null;
  starter_code: Record<string, string>;
  test_suite: {
    tests: Array<{
      name: string;
      [key: string]: any;
    }>;
  };
  defense_prompts: string[];
}

export interface CurriculumEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  dependency_type: string;
}

export interface UserProgress {
  node_id: string;
  status: "locked" | "available" | "in_progress" | "tests_passed" | "defense_passed" | "mastered";
  attempts: number;
  best_execution_time_ms?: number;
  code_snapshot?: Record<string, string>;
}
