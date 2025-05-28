export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: never
          name?: string
        }
        Relationships: []
      }
      playground_sessions: {
        Row: {
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: number
          input_text: string
          model_name: string
          model_parameters: Json
          output_text: string | null
          prompt_id: number | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: never
          input_text: string
          model_name: string
          model_parameters?: Json
          output_text?: string | null
          prompt_id?: number | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: never
          input_text?: string
          model_name?: string
          model_parameters?: Json
          output_text?: string | null
          prompt_id?: number | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playground_sessions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt: {
        Row: {
          category_id: number | null
          content: string
          created_at: string
          description: string
          featured: boolean
          id: number
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          uses: number
          votes: number
        }
        Insert: {
          category_id?: number | null
          content: string
          created_at?: string
          description: string
          featured?: boolean
          id?: never
          tags?: string[]
          title: string
          updated_at?: string
          user_id?: string
          uses?: number
          votes?: number
        }
        Update: {
          category_id?: number | null
          content?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: never
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          uses?: number
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          parent_comment_id: number | null
          prompt_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: never
          parent_comment_id?: number | null
          prompt_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: never
          parent_comment_id?: number | null
          prompt_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "prompt_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_comments_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_forks: {
        Row: {
          created_at: string
          forked_prompt_id: number
          id: number
          original_prompt_id: number
        }
        Insert: {
          created_at?: string
          forked_prompt_id: number
          id?: never
          original_prompt_id: number
        }
        Update: {
          created_at?: string
          forked_prompt_id?: number
          id?: never
          original_prompt_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_forks_forked_prompt_id_fkey"
            columns: ["forked_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_forks_original_prompt_id_fkey"
            columns: ["original_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_improvements: {
        Row: {
          created_at: string
          created_by: string
          id: number
          prompt_id: number
          rationale: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          suggestion: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: never
          prompt_id: number
          rationale?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggestion: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: never
          prompt_id?: number
          rationale?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggestion?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_improvements_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_tags: {
        Row: {
          created_at: string
          prompt_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          prompt_id: number
          tag_id: number
        }
        Update: {
          created_at?: string
          prompt_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_tags_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_versions: {
        Row: {
          change_summary: string | null
          content: string
          created_at: string
          created_by: string
          description: string
          id: number
          prompt_id: number
          title: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          content: string
          created_at?: string
          created_by: string
          description: string
          id?: never
          prompt_id: number
          title: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          content?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: never
          prompt_id?: number
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_votes: {
        Row: {
          created_at: string
          id: number
          prompt_id: number
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: never
          prompt_id: number
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: never
          prompt_id?: number
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_votes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: number
          prompt_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          prompt_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          prompt_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string
          id: number
          interaction_type: string
          prompt_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          interaction_type: string
          prompt_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          interaction_type?: string
          prompt_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
