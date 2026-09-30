export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievement_awards: {
        Row: {
          achievement_id: string
          awarded_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          awarded_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          awarded_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_awards_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      achievement_evidence: {
        Row: {
          achievement_id: string
          created_at: string
          evidence_reference: string
          evidence_type: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          evidence_reference: string
          evidence_type: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          evidence_reference?: string
          evidence_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_evidence_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_progress: {
        Row: {
          achievement_id: string
          completed_at: string | null
          created_at: string
          id: string
          progress_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_progress_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_requirements: {
        Row: {
          achievement_id: string
          id: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          achievement_id: string
          id?: string
          requirement_type: string
          requirement_value?: number
        }
        Update: {
          achievement_id?: string
          id?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "achievement_requirements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          category_id: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string
          xp_reward: number
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          xp_reward?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "achievements_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "achievement_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_runs: {
        Row: {
          anti_cheat_score: number
          created_at: string
          execution_duration_ms: number
          exercise_id: string
          final_score: number
          id: string
          memory_usage_bytes: number
          metadata: Json
          raw_score: number
          signature: string
          status: string
          user_id: string
        }
        Insert: {
          anti_cheat_score: number
          created_at?: string
          execution_duration_ms: number
          exercise_id: string
          final_score: number
          id?: string
          memory_usage_bytes: number
          metadata?: Json
          raw_score: number
          signature: string
          status: string
          user_id: string
        }
        Update: {
          anti_cheat_score?: number
          created_at?: string
          execution_duration_ms?: number
          exercise_id?: string
          final_score?: number
          id?: string
          memory_usage_bytes?: number
          metadata?: Json
          raw_score?: number
          signature?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_runs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_competencies: {
        Row: {
          capstone_id: string
          competency_id: string
          id: string
        }
        Insert: {
          capstone_id: string
          competency_id: string
          id?: string
        }
        Update: {
          capstone_id?: string
          competency_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_competencies_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_completion: {
        Row: {
          capstone_id: string
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          capstone_id: string
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          capstone_id?: string
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_completion_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_deliverables: {
        Row: {
          capstone_id: string
          created_at: string
          deliverable_type: string
          description: string
          id: string
          required: boolean
          title: string
        }
        Insert: {
          capstone_id: string
          created_at?: string
          deliverable_type?: string
          description: string
          id?: string
          required?: boolean
          title: string
        }
        Update: {
          capstone_id?: string
          created_at?: string
          deliverable_type?: string
          description?: string
          id?: string
          required?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_deliverables_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_dependencies: {
        Row: {
          child_capstone_id: string
          id: string
          parent_capstone_id: string
        }
        Insert: {
          child_capstone_id: string
          id?: string
          parent_capstone_id: string
        }
        Update: {
          child_capstone_id?: string
          id?: string
          parent_capstone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_dependencies_child_capstone_id_fkey"
            columns: ["child_capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_dependencies_parent_capstone_id_fkey"
            columns: ["parent_capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_evidence: {
        Row: {
          capstone_id: string
          created_at: string
          evidence_reference: string
          evidence_type: string
          id: string
          user_id: string
        }
        Insert: {
          capstone_id: string
          created_at?: string
          evidence_reference: string
          evidence_type: string
          id?: string
          user_id: string
        }
        Update: {
          capstone_id?: string
          created_at?: string
          evidence_reference?: string
          evidence_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_evidence_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_feedback: {
        Row: {
          created_at: string
          feedback_text: string
          id: string
          review_id: string
        }
        Insert: {
          created_at?: string
          feedback_text: string
          id?: string
          review_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string
          id?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_feedback_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "capstone_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_reviews: {
        Row: {
          capstone_id: string
          id: string
          review_result: string
          review_type: string
          reviewed_at: string
          reviewer_id: string | null
          score: number | null
          submission_id: string | null
          user_id: string
        }
        Insert: {
          capstone_id: string
          id?: string
          review_result: string
          review_type: string
          reviewed_at?: string
          reviewer_id?: string | null
          score?: number | null
          submission_id?: string | null
          user_id: string
        }
        Update: {
          capstone_id?: string
          id?: string
          review_result?: string
          review_type?: string
          reviewed_at?: string
          reviewer_id?: string | null
          score?: number | null
          submission_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_reviews_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "capstone_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_submissions: {
        Row: {
          capstone_id: string
          deliverables_payload: Json
          documentation_url: string | null
          id: string
          live_url: string | null
          notes: string | null
          repository_url: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          capstone_id: string
          deliverables_payload?: Json
          documentation_url?: string | null
          id?: string
          live_url?: string | null
          notes?: string | null
          repository_url?: string | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          capstone_id?: string
          deliverables_payload?: Json
          documentation_url?: string | null
          id?: string
          live_url?: string | null
          notes?: string | null
          repository_url?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_submissions_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      capstones: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          estimated_hours: number
          id: string
          slug: string
          status: string
          title: string
          type_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: string
          estimated_hours?: number
          id?: string
          slug: string
          status?: string
          title: string
          type_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          estimated_hours?: number
          id?: string
          slug?: string
          status?: string
          title?: string
          type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstones_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "capstone_types"
            referencedColumns: ["id"]
          },
        ]
      }
      competencies: {
        Row: {
          category_id: string
          code: string
          created_at: string
          description: string
          id: string
          is_published: boolean
          level: Database["public"]["Enums"]["competency_level"]
          order_index: number
          slug: string
          statement: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          code: string
          created_at?: string
          description: string
          id?: string
          is_published?: boolean
          level?: Database["public"]["Enums"]["competency_level"]
          order_index?: number
          slug: string
          statement: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          code?: string
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          level?: Database["public"]["Enums"]["competency_level"]
          order_index?: number
          slug?: string
          statement?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competencies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "competency_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      competency_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      competency_evidence: {
        Row: {
          competency_id: string
          created_at: string
          id: string
          source_id: string
          source_title: string
          source_type: Database["public"]["Enums"]["competency_evidence_source"]
          summary: string
          user_id: string
        }
        Insert: {
          competency_id: string
          created_at?: string
          id?: string
          source_id: string
          source_title: string
          source_type?: Database["public"]["Enums"]["competency_evidence_source"]
          summary: string
          user_id: string
        }
        Update: {
          competency_id?: string
          created_at?: string
          id?: string
          source_id?: string
          source_title?: string
          source_type?: Database["public"]["Enums"]["competency_evidence_source"]
          summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competency_evidence_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      competency_gates: {
        Row: {
          created_at: string
          description: string | null
          gate_level: number
          id: string
          is_active: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gate_level: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gate_level?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      exercise_attempts: {
        Row: {
          attempt_number: number
          completed_at: string | null
          created_at: string
          exercise_id: string
          id: string
          started_at: string
          state: Database["public"]["Enums"]["exercise_state"]
          status: string
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_number: number
          completed_at?: string | null
          created_at?: string
          exercise_id: string
          id?: string
          started_at?: string
          state?: Database["public"]["Enums"]["exercise_state"]
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_number?: number
          completed_at?: string | null
          created_at?: string
          exercise_id?: string
          id?: string
          started_at?: string
          state?: Database["public"]["Enums"]["exercise_state"]
          status?: string
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          order_index: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          order_index?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          order_index?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      exercise_competencies: {
        Row: {
          competency_id: string
          created_at: string
          exercise_id: string
          id: string
          weight: number
        }
        Insert: {
          competency_id: string
          created_at?: string
          exercise_id: string
          id?: string
          weight?: number
        }
        Update: {
          competency_id?: string
          created_at?: string
          exercise_id?: string
          id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercise_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_competencies_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_completion: {
        Row: {
          best_attempt_id: string
          completed_at: string
          created_at: string
          exercise_id: string
          id: string
          score: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_attempt_id: string
          completed_at?: string
          created_at?: string
          exercise_id: string
          id?: string
          score?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          best_attempt_id?: string
          completed_at?: string
          created_at?: string
          exercise_id?: string
          id?: string
          score?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_completion_best_attempt_id_fkey"
            columns: ["best_attempt_id"]
            isOneToOne: false
            referencedRelation: "exercise_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_completion_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_evidence: {
        Row: {
          attempt_id: string
          competency_id: string
          created_at: string
          evidence_payload: Json
          evidence_type: string
          exercise_id: string
          id: string
          summary: string
          user_id: string
        }
        Insert: {
          attempt_id: string
          competency_id: string
          created_at?: string
          evidence_payload?: Json
          evidence_type?: string
          exercise_id: string
          id?: string
          summary: string
          user_id: string
        }
        Update: {
          attempt_id?: string
          competency_id?: string
          created_at?: string
          evidence_payload?: Json
          evidence_type?: string
          exercise_id?: string
          id?: string
          summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_evidence_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exercise_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_evidence_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_evidence_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_submissions: {
        Row: {
          attempt_id: string
          content: string | null
          created_at: string
          exercise_id: string
          id: string
          status: Database["public"]["Enums"]["exercise_submission_status"]
          submitted_at: string | null
          submitted_code: string
          user_id: string
          validation_output: Json
        }
        Insert: {
          attempt_id: string
          content?: string | null
          created_at?: string
          exercise_id: string
          id?: string
          status?: Database["public"]["Enums"]["exercise_submission_status"]
          submitted_at?: string | null
          submitted_code: string
          user_id: string
          validation_output?: Json
        }
        Update: {
          attempt_id?: string
          content?: string | null
          created_at?: string
          exercise_id?: string
          id?: string
          status?: Database["public"]["Enums"]["exercise_submission_status"]
          submitted_at?: string | null
          submitted_code?: string
          user_id?: string
          validation_output?: Json
        }
        Relationships: [
          {
            foreignKeyName: "exercise_submissions_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "exercise_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_submissions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category_id: string
          created_at: string
          description: string
          difficulty: string
          estimated_minutes: number
          expected_outcome: string
          id: string
          instructions: string
          is_published: boolean
          lesson_id: string
          max_attempts: number | null
          objective: string
          order_index: number
          slug: string
          solution_template: string
          starter_code: string
          success_criteria: string
          title: string
          updated_at: string
          validation_rules: Json
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          difficulty?: string
          estimated_minutes?: number
          expected_outcome?: string
          id?: string
          instructions: string
          is_published?: boolean
          lesson_id: string
          max_attempts?: number | null
          objective?: string
          order_index?: number
          slug: string
          solution_template?: string
          starter_code?: string
          success_criteria?: string
          title: string
          updated_at?: string
          validation_rules?: Json
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          difficulty?: string
          estimated_minutes?: number
          expected_outcome?: string
          id?: string
          instructions?: string
          is_published?: boolean
          lesson_id?: string
          max_attempts?: number | null
          objective?: string
          order_index?: number
          slug?: string
          solution_template?: string
          starter_code?: string
          success_criteria?: string
          title?: string
          updated_at?: string
          validation_rules?: Json
        }
        Relationships: [
          {
            foreignKeyName: "exercises_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "exercise_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          gate_id: string
          id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          gate_id: string
          id?: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          gate_id?: string
          id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_attempts_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_competencies: {
        Row: {
          competency_id: string
          created_at: string
          gate_id: string
          id: string
        }
        Insert: {
          competency_id: string
          created_at?: string
          gate_id: string
          id?: string
        }
        Update: {
          competency_id?: string
          created_at?: string
          gate_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_competencies_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_completion: {
        Row: {
          completed_at: string
          gate_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          gate_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          gate_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_completion_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_evidence: {
        Row: {
          attempt_id: string | null
          created_at: string
          evidence_reference: string
          evidence_type: string
          gate_id: string
          id: string
          metadata: Json
          user_id: string
        }
        Insert: {
          attempt_id?: string | null
          created_at?: string
          evidence_reference: string
          evidence_type: string
          gate_id: string
          id?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          attempt_id?: string | null
          created_at?: string
          evidence_reference?: string
          evidence_type?: string
          gate_id?: string
          id?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_evidence_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "gate_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_evidence_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_requirements: {
        Row: {
          created_at: string
          gate_id: string
          id: string
          requirement_type: string
          requirement_value: Json
        }
        Insert: {
          created_at?: string
          gate_id: string
          id?: string
          requirement_type: string
          requirement_value?: Json
        }
        Update: {
          created_at?: string
          gate_id?: string
          id?: string
          requirement_type?: string
          requirement_value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "gate_requirements_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_validation: {
        Row: {
          attempt_id: string | null
          gate_id: string
          id: string
          user_id: string
          validated_at: string
          validation_result: Json
        }
        Insert: {
          attempt_id?: string | null
          gate_id: string
          id?: string
          user_id: string
          validated_at?: string
          validation_result?: Json
        }
        Update: {
          attempt_id?: string | null
          gate_id?: string
          id?: string
          user_id?: string
          validated_at?: string
          validation_result?: Json
        }
        Relationships: [
          {
            foreignKeyName: "gate_validation_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "gate_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_validation_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["learning_path_difficulty"]
          estimated_hours: number
          id: string
          is_published: boolean
          order_index: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: Database["public"]["Enums"]["learning_path_difficulty"]
          estimated_hours?: number
          id?: string
          is_published?: boolean
          order_index?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["learning_path_difficulty"]
          estimated_hours?: number
          id?: string
          is_published?: boolean
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_checkpoints: {
        Row: {
          checkpoint_order: number
          correct_option_index: number
          created_at: string
          explanation: string
          id: string
          lesson_id: string
          options: Json
          question: string
          section_id: string | null
          target_concept: string
          updated_at: string
        }
        Insert: {
          checkpoint_order: number
          correct_option_index: number
          created_at?: string
          explanation: string
          id?: string
          lesson_id: string
          options: Json
          question: string
          section_id?: string | null
          target_concept: string
          updated_at?: string
        }
        Update: {
          checkpoint_order?: number
          correct_option_index?: number
          created_at?: string
          explanation?: string
          id?: string
          lesson_id?: string
          options?: Json
          question?: string
          section_id?: string | null
          target_concept?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_checkpoints_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_checkpoints_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "lesson_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_competencies: {
        Row: {
          competency_id: string
          contribution_points: number
          created_at: string
          id: string
          lesson_id: string
          target_state: Database["public"]["Enums"]["competency_state"]
        }
        Insert: {
          competency_id: string
          contribution_points?: number
          created_at?: string
          id?: string
          lesson_id: string
          target_state?: Database["public"]["Enums"]["competency_state"]
        }
        Update: {
          competency_id?: string
          contribution_points?: number
          created_at?: string
          id?: string
          lesson_id?: string
          target_state?: Database["public"]["Enums"]["competency_state"]
        }
        Relationships: [
          {
            foreignKeyName: "lesson_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_competencies_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_sections: {
        Row: {
          created_at: string
          diagram_reference: Json | null
          estimated_minutes: number
          id: string
          key_takeaways: string[] | null
          lesson_id: string
          section_content: string
          section_learning_goal: string
          section_order: number
          section_slug: string
          section_title: string
          section_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagram_reference?: Json | null
          estimated_minutes?: number
          id?: string
          key_takeaways?: string[] | null
          lesson_id: string
          section_content: string
          section_learning_goal: string
          section_order: number
          section_slug: string
          section_title: string
          section_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagram_reference?: Json | null
          estimated_minutes?: number
          id?: string
          key_takeaways?: string[] | null
          lesson_id?: string
          section_content?: string
          section_learning_goal?: string
          section_order?: number
          section_slug?: string
          section_title?: string
          section_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_sections_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          estimated_minutes: number
          id: string
          is_published: boolean
          module_id: string
          order_index: number
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          module_id: string
          order_index?: number
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          module_id?: string
          order_index?: number
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_competencies: {
        Row: {
          competency_id: string
          created_at: string
          id: string
          module_id: string
          weight: number
        }
        Insert: {
          competency_id: string
          created_at?: string
          id?: string
          module_id: string
          weight?: number
        }
        Update: {
          competency_id?: string
          created_at?: string
          id?: string
          module_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "module_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_competencies_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string
          estimated_minutes: number
          id: string
          is_published: boolean
          learning_path_id: string
          order_index: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          learning_path_id: string
          order_index?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_minutes?: number
          id?: string
          is_published?: boolean
          learning_path_id?: string
          order_index?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_achievements: {
        Row: {
          achievement_id: string
          id: string
          portfolio_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          portfolio_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          portfolio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_achievements_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_artifacts: {
        Row: {
          artifact_type: string
          created_at: string
          description: string | null
          id: string
          portfolio_id: string
          source_domain: string
          source_id: string | null
          title: string
        }
        Insert: {
          artifact_type: string
          created_at?: string
          description?: string | null
          id?: string
          portfolio_id: string
          source_domain: string
          source_id?: string | null
          title: string
        }
        Update: {
          artifact_type?: string
          created_at?: string
          description?: string | null
          id?: string
          portfolio_id?: string
          source_domain?: string
          source_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_artifacts_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_competencies: {
        Row: {
          competency_id: string
          id: string
          portfolio_id: string
        }
        Insert: {
          competency_id: string
          id?: string
          portfolio_id: string
        }
        Update: {
          competency_id?: string
          id?: string
          portfolio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_competencies_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_evidence: {
        Row: {
          competency_id: string | null
          created_at: string
          evidence_reference: string
          evidence_type: string
          id: string
          portfolio_id: string
        }
        Insert: {
          competency_id?: string | null
          created_at?: string
          evidence_reference: string
          evidence_type: string
          id?: string
          portfolio_id: string
        }
        Update: {
          competency_id?: string | null
          created_at?: string
          evidence_reference?: string
          evidence_type?: string
          id?: string
          portfolio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_evidence_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_evidence_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_hiring_signals: {
        Row: {
          generated_at: string
          id: string
          portfolio_id: string
          signal_strength: string
          signal_type: string
        }
        Insert: {
          generated_at?: string
          id?: string
          portfolio_id: string
          signal_strength?: string
          signal_type: string
        }
        Update: {
          generated_at?: string
          id?: string
          portfolio_id?: string
          signal_strength?: string
          signal_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_hiring_signals_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          portfolio_id: string
          project_type: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          portfolio_id: string
          project_type?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          portfolio_id?: string
          project_type?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_sections: {
        Row: {
          display_order: number
          id: string
          portfolio_id: string
          section_type: string
          title: string
        }
        Insert: {
          display_order?: number
          id?: string
          portfolio_id: string
          section_type: string
          title: string
        }
        Update: {
          display_order?: number
          id?: string
          portfolio_id?: string
          section_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_sections_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_capstone_progress: {
        Row: {
          capstone_id: string
          id: string
          last_activity_at: string
          progress_percentage: number
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          capstone_id: string
          id?: string
          last_activity_at?: string
          progress_percentage?: number
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          capstone_id?: string
          id?: string
          last_activity_at?: string
          progress_percentage?: number
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_capstone_progress_capstone_id_fkey"
            columns: ["capstone_id"]
            isOneToOne: false
            referencedRelation: "capstones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_competency_progress: {
        Row: {
          competency_id: string
          created_at: string
          evidence_count: number
          first_demonstrated_at: string | null
          id: string
          last_evaluated_at: string
          score: number
          state: Database["public"]["Enums"]["competency_state"]
          updated_at: string
          user_id: string
        }
        Insert: {
          competency_id: string
          created_at?: string
          evidence_count?: number
          first_demonstrated_at?: string | null
          id?: string
          last_evaluated_at?: string
          score?: number
          state?: Database["public"]["Enums"]["competency_state"]
          updated_at?: string
          user_id: string
        }
        Update: {
          competency_id?: string
          created_at?: string
          evidence_count?: number
          first_demonstrated_at?: string | null
          id?: string
          last_evaluated_at?: string
          score?: number
          state?: Database["public"]["Enums"]["competency_state"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_competency_progress_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gate_progress: {
        Row: {
          gate_id: string
          id: string
          progress_percentage: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          gate_id: string
          id?: string
          progress_percentage?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          gate_id?: string
          id?: string
          progress_percentage?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_gate_progress_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "competency_gates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          learning_path_id: string
          lesson_id: string
          module_id: string
          started_at: string
          status: Database["public"]["Enums"]["learning_progress_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          learning_path_id: string
          lesson_id: string
          module_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["learning_progress_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          learning_path_id?: string
          lesson_id?: string
          module_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["learning_progress_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_learning_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_learning_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_learning_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      xp_balances: {
        Row: {
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          created_at: string
          event_reference: string
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_reference: string
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_reference?: string
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          source_id: string
          source_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          source_id: string
          source_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          source_id?: string
          source_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      competency_evidence_source:
        | "lesson_completion"
        | "learning_activity"
        | "exercise_completion"
        | "gate_validation"
        | "capstone_submission"
        | "oral_defense"
      competency_level: "foundational" | "intermediate" | "advanced" | "expert"
      competency_state:
        | "not_started"
        | "introduced"
        | "practicing"
        | "reinforced"
        | "mastered"
      exercise_state:
        | "available"
        | "in_progress"
        | "submitted"
        | "validated"
        | "completed"
      exercise_submission_status: "pending" | "passed" | "failed"
      learning_path_difficulty: "beginner" | "intermediate" | "advanced"
      learning_progress_status: "not_started" | "in_progress" | "completed"
      user_role: "learner" | "instructor" | "admin" | "auditor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      competency_evidence_source: [
        "lesson_completion",
        "learning_activity",
        "exercise_completion",
        "gate_validation",
        "capstone_submission",
        "oral_defense",
      ],
      competency_level: ["foundational", "intermediate", "advanced", "expert"],
      competency_state: [
        "not_started",
        "introduced",
        "practicing",
        "reinforced",
        "mastered",
      ],
      exercise_state: [
        "available",
        "in_progress",
        "submitted",
        "validated",
        "completed",
      ],
      exercise_submission_status: ["pending", "passed", "failed"],
      learning_path_difficulty: ["beginner", "intermediate", "advanced"],
      learning_progress_status: ["not_started", "in_progress", "completed"],
      user_role: ["learner", "instructor", "admin", "auditor"],
    },
  },
} as const
