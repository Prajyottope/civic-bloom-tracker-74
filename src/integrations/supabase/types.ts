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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      issues: {
        Row: {
          assigned_team_id: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          exact_location: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          state: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          user_latitude: number | null
          user_longitude: number | null
        }
        Insert: {
          assigned_team_id?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          exact_location?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          state?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          user_latitude?: number | null
          user_longitude?: number | null
        }
        Update: {
          assigned_team_id?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          exact_location?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          state?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          user_latitude?: number | null
          user_longitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_assigned_team_id_fkey"
            columns: ["assigned_team_id"]
            isOneToOne: false
            referencedRelation: "municipal_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city_name: string
          created_at: string
          id: string
          is_tier1: boolean | null
          latitude: number | null
          longitude: number | null
          state_name: string
        }
        Insert: {
          city_name: string
          created_at?: string
          id?: string
          is_tier1?: boolean | null
          latitude?: number | null
          longitude?: number | null
          state_name: string
        }
        Update: {
          city_name?: string
          created_at?: string
          id?: string
          is_tier1?: boolean | null
          latitude?: number | null
          longitude?: number | null
          state_name?: string
        }
        Relationships: []
      }
      municipal_teams: {
        Row: {
          city_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          password_hash: string
          state_name: string
          team_name: string
          updated_at: string
        }
        Insert: {
          city_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          state_name: string
          team_name: string
          updated_at?: string
        }
        Update: {
          city_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          password_hash?: string
          state_name?: string
          team_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          issue_id: string | null
          message: string
          sent_at: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id?: string | null
          message: string
          sent_at?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string | null
          message?: string
          sent_at?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          city_name: string | null
          created_at: string
          created_by: string
          generated_at: string
          id: string
          in_progress_count: number | null
          issue_count: number | null
          pending_count: number | null
          resolved_count: number | null
          state_name: string | null
        }
        Insert: {
          city_name?: string | null
          created_at?: string
          created_by: string
          generated_at?: string
          id?: string
          in_progress_count?: number | null
          issue_count?: number | null
          pending_count?: number | null
          resolved_count?: number | null
          state_name?: string | null
        }
        Update: {
          city_name?: string | null
          created_at?: string
          created_by?: string
          generated_at?: string
          id?: string
          in_progress_count?: number | null
          issue_count?: number | null
          pending_count?: number | null
          resolved_count?: number | null
          state_name?: string | null
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
      user_role: "citizen" | "admin" | "municipal_staff"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      user_role: ["citizen", "admin", "municipal_staff"],
    },
  },
} as const
