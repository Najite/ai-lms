export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      competencies: {
        Row: {
          category_id: string;
          code: string;
          created_at: string;
          description: string;
          id: string;
          is_published: boolean;
          level: Database["public"]["Enums"]["competency_level"];
          order_index: number;
          slug: string;
          statement: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          code: string;
          created_at?: string;
          description: string;
          id?: string;
          is_published?: boolean;
          level?: Database["public"]["Enums"]["competency_level"];
          order_index?: number;
          slug: string;
          statement: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          code?: string;
          created_at?: string;
          description?: string;
          id?: string;
          is_published?: boolean;
          level?: Database["public"]["Enums"]["competency_level"];
          order_index?: number;
          slug?: string;
          statement?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competencies_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "competency_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      competency_categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
          order_index: number;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          name: string;
          order_index?: number;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          order_index?: number;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      competency_evidence: {
        Row: {
          competency_id: string;
          created_at: string;
          id: string;
          source_id: string;
          source_title: string;
          source_type: Database["public"]["Enums"]["competency_evidence_source"];
          summary: string;
          user_id: string;
        };
        Insert: {
          competency_id: string;
          created_at?: string;
          id?: string;
          source_id: string;
          source_title: string;
          source_type?: Database["public"]["Enums"]["competency_evidence_source"];
          summary: string;
          user_id: string;
        };
        Update: {
          competency_id?: string;
          created_at?: string;
          id?: string;
          source_id?: string;
          source_title?: string;
          source_type?: Database["public"]["Enums"]["competency_evidence_source"];
          summary?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competency_evidence_competency_id_fkey";
            columns: ["competency_id"];
            isOneToOne: false;
            referencedRelation: "competencies";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_attempts: {
        Row: {
          attempt_number: number;
          completed_at: string | null;
          created_at: string;
          exercise_id: string;
          id: string;
          started_at: string;
          state: Database["public"]["Enums"]["exercise_state"];
          submitted_at: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          attempt_number: number;
          completed_at?: string | null;
          created_at?: string;
          exercise_id: string;
          id?: string;
          started_at?: string;
          state?: Database["public"]["Enums"]["exercise_state"];
          submitted_at?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          attempt_number?: number;
          completed_at?: string | null;
          created_at?: string;
          exercise_id?: string;
          id?: string;
          started_at?: string;
          state?: Database["public"]["Enums"]["exercise_state"];
          submitted_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_attempts_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_categories: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
          order_index: number;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          name: string;
          order_index?: number;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          order_index?: number;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercise_competencies: {
        Row: {
          competency_id: string;
          created_at: string;
          exercise_id: string;
          id: string;
          weight: number;
        };
        Insert: {
          competency_id: string;
          created_at?: string;
          exercise_id: string;
          id?: string;
          weight?: number;
        };
        Update: {
          competency_id?: string;
          created_at?: string;
          exercise_id?: string;
          id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_competencies_competency_id_fkey";
            columns: ["competency_id"];
            isOneToOne: false;
            referencedRelation: "competencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_competencies_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_completion: {
        Row: {
          best_attempt_id: string;
          completed_at: string;
          created_at: string;
          exercise_id: string;
          id: string;
          score: number;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          best_attempt_id: string;
          completed_at?: string;
          created_at?: string;
          exercise_id: string;
          id?: string;
          score?: number;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          best_attempt_id?: string;
          completed_at?: string;
          created_at?: string;
          exercise_id?: string;
          id?: string;
          score?: number;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_completion_best_attempt_id_fkey";
            columns: ["best_attempt_id"];
            isOneToOne: false;
            referencedRelation: "exercise_attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_completion_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_evidence: {
        Row: {
          attempt_id: string;
          competency_id: string;
          created_at: string;
          exercise_id: string;
          id: string;
          summary: string;
          user_id: string;
        };
        Insert: {
          attempt_id: string;
          competency_id: string;
          created_at?: string;
          exercise_id: string;
          id?: string;
          summary: string;
          user_id: string;
        };
        Update: {
          attempt_id?: string;
          competency_id?: string;
          created_at?: string;
          exercise_id?: string;
          id?: string;
          summary?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_evidence_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: false;
            referencedRelation: "exercise_attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_evidence_competency_id_fkey";
            columns: ["competency_id"];
            isOneToOne: false;
            referencedRelation: "competencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_evidence_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercise_submissions: {
        Row: {
          attempt_id: string;
          created_at: string;
          exercise_id: string;
          id: string;
          status: Database["public"]["Enums"]["exercise_submission_status"];
          submitted_code: string;
          user_id: string;
          validation_output: Json;
        };
        Insert: {
          attempt_id: string;
          created_at?: string;
          exercise_id: string;
          id?: string;
          status?: Database["public"]["Enums"]["exercise_submission_status"];
          submitted_code: string;
          user_id: string;
          validation_output?: Json;
        };
        Update: {
          attempt_id?: string;
          created_at?: string;
          exercise_id?: string;
          id?: string;
          status?: Database["public"]["Enums"]["exercise_submission_status"];
          submitted_code?: string;
          user_id?: string;
          validation_output?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_submissions_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: false;
            referencedRelation: "exercise_attempts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_submissions_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          category_id: string;
          created_at: string;
          description: string;
          estimated_minutes: number;
          id: string;
          instructions: string;
          is_published: boolean;
          lesson_id: string;
          max_attempts: number | null;
          order_index: number;
          slug: string;
          solution_template: string;
          starter_code: string;
          title: string;
          updated_at: string;
          validation_rules: Json;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          description: string;
          estimated_minutes?: number;
          id?: string;
          instructions: string;
          is_published?: boolean;
          lesson_id: string;
          max_attempts?: number | null;
          order_index?: number;
          slug: string;
          solution_template?: string;
          starter_code?: string;
          title: string;
          updated_at?: string;
          validation_rules?: Json;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          description?: string;
          estimated_minutes?: number;
          id?: string;
          instructions?: string;
          is_published?: boolean;
          lesson_id?: string;
          max_attempts?: number | null;
          order_index?: number;
          slug?: string;
          solution_template?: string;
          starter_code?: string;
          title?: string;
          updated_at?: string;
          validation_rules?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "exercises_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "exercise_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercises_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      learning_paths: {
        Row: {
          created_at: string;
          description: string;
          difficulty: Database["public"]["Enums"]["learning_path_difficulty"];
          estimated_hours: number;
          id: string;
          is_published: boolean;
          order_index: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          difficulty?: Database["public"]["Enums"]["learning_path_difficulty"];
          estimated_hours?: number;
          id?: string;
          is_published?: boolean;
          order_index?: number;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          difficulty?: Database["public"]["Enums"]["learning_path_difficulty"];
          estimated_hours?: number;
          id?: string;
          is_published?: boolean;
          order_index?: number;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_competencies: {
        Row: {
          competency_id: string;
          contribution_points: number;
          created_at: string;
          id: string;
          lesson_id: string;
          target_state: Database["public"]["Enums"]["competency_state"];
        };
        Insert: {
          competency_id: string;
          contribution_points?: number;
          created_at?: string;
          id?: string;
          lesson_id: string;
          target_state?: Database["public"]["Enums"]["competency_state"];
        };
        Update: {
          competency_id?: string;
          contribution_points?: number;
          created_at?: string;
          id?: string;
          lesson_id?: string;
          target_state?: Database["public"]["Enums"]["competency_state"];
        };
        Relationships: [
          {
            foreignKeyName: "lesson_competencies_competency_id_fkey";
            columns: ["competency_id"];
            isOneToOne: false;
            referencedRelation: "competencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_competencies_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          content: string;
          created_at: string;
          estimated_minutes: number;
          id: string;
          is_published: boolean;
          module_id: string;
          order_index: number;
          slug: string;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          estimated_minutes?: number;
          id?: string;
          is_published?: boolean;
          module_id: string;
          order_index?: number;
          slug: string;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          estimated_minutes?: number;
          id?: string;
          is_published?: boolean;
          module_id?: string;
          order_index?: number;
          slug?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      module_competencies: {
        Row: {
          competency_id: string;
          created_at: string;
          id: string;
          module_id: string;
          weight: number;
        };
        Insert: {
          competency_id: string;
          created_at?: string;
          id?: string;
          module_id: string;
          weight?: number;
        };
        Update: {
          competency_id?: string;
          created_at?: string;
          id?: string;
          module_id?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "module_competencies_competency_id_fkey";
            columns: ["competency_id"];
            isOneToOne: false;
            referencedRelation: "competencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "module_competencies_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      modules: {
        Row: {
          created_at: string;
          description: string;
          estimated_minutes: number;
          id: string;
          is_published: boolean;
          learning_path_id: string;
          order_index: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          estimated_minutes?: number;
          id?: string;
          is_published?: boolean;
          learning_path_id: string;
          order_index?: number;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          estimated_minutes?: number;
          id?: string;
          is_published?: boolean;
          learning_path_id?: string;
          order_index?: number;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_learning_path_id_fkey";
            columns: ["learning_path_id"];
            isOneToOne: false;
            referencedRelation: "learning_paths";
            referencedColumns: ["id"];
          },
        ];
      };
      user_competency_progress: {
        Row: {
          competency_id: string;
          created_at: string;
          evidence_count: number;
          first_demonstrated_at: string | null;
          id: string;
          last_evaluated_at: string;
          score: number;
          state: Database["public"]["Enums"]["competency_state"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          competency_id: string;
          created_at?: string;
          evidence_count?: number;
          first_demonstrated_at?: string | null;
          id?: string;
          last_evaluated_at?: string;
          score?: number;
          state?: Database["public"]["Enums"]["competency_state"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          competency_id?: string;
          created_at?: string;
          evidence_count?: number;
          first_demonstrated_at?: string | null;
          id?: string;
          last_evaluated_at?: string;
          score?: number;
          state?: Database["public"]["Enums"]["competency_state"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_competency_progress_competency_id_fkey";
            columns: ["competency_id"];
            isOneToOne: false;
            referencedRelation: "competencies";
            referencedColumns: ["id"];
          },
        ];
      };
      user_learning_progress: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          learning_path_id: string;
          lesson_id: string;
          module_id: string;
          started_at: string;
          status: Database["public"]["Enums"]["learning_progress_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          learning_path_id: string;
          lesson_id: string;
          module_id: string;
          started_at?: string;
          status?: Database["public"]["Enums"]["learning_progress_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          learning_path_id?: string;
          lesson_id?: string;
          module_id?: string;
          started_at?: string;
          status?: Database["public"]["Enums"]["learning_progress_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_learning_progress_learning_path_id_fkey";
            columns: ["learning_path_id"];
            isOneToOne: false;
            referencedRelation: "learning_paths";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_learning_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_learning_progress_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      competency_evidence_source:
        | "lesson_completion"
        | "learning_activity"
        | "exercise_completion";
      competency_level: "foundational" | "intermediate" | "advanced" | "expert";
      competency_state:
        | "not_started"
        | "introduced"
        | "practicing"
        | "reinforced"
        | "mastered";
      exercise_state:
        | "available"
        | "in_progress"
        | "submitted"
        | "validated"
        | "completed";
      exercise_submission_status: "pending" | "passed" | "failed";
      learning_path_difficulty: "beginner" | "intermediate" | "advanced";
      learning_progress_status: "not_started" | "in_progress" | "completed";
      user_role: "learner" | "instructor" | "admin" | "auditor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
