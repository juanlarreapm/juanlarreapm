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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          page_path: string | null
          session_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      analytics_snapshots: {
        Row: {
          avg_pages_per_visit: number
          avg_session_duration_seconds: number
          bounce_rate: number
          countries: Json
          created_at: string
          devices: Json
          id: string
          snapshot_date: string
          top_pages: Json
          total_pageviews: number
          total_visitors: number
          traffic_sources: Json
        }
        Insert: {
          avg_pages_per_visit?: number
          avg_session_duration_seconds?: number
          bounce_rate?: number
          countries?: Json
          created_at?: string
          devices?: Json
          id?: string
          snapshot_date?: string
          top_pages?: Json
          total_pageviews?: number
          total_visitors?: number
          traffic_sources?: Json
        }
        Update: {
          avg_pages_per_visit?: number
          avg_session_duration_seconds?: number
          bounce_rate?: number
          countries?: Json
          created_at?: string
          devices?: Json
          id?: string
          snapshot_date?: string
          top_pages?: Json
          total_pageviews?: number
          total_visitors?: number
          traffic_sources?: Json
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          reading_time_minutes: number | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          reading_time_minutes?: number | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          reading_time_minutes?: number | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          company_url: string | null
          created_at: string
          description: string | null
          display_order: number
          highlights: string[]
          id: string
          period: string
          role: string
          updated_at: string
        }
        Insert: {
          company: string
          company_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          highlights?: string[]
          id?: string
          period: string
          role: string
          updated_at?: string
        }
        Update: {
          company?: string
          company_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          highlights?: string[]
          id?: string
          period?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_projects: {
        Row: {
          cover_image: string | null
          created_at: string
          demo_url: string | null
          description: string | null
          display_order: number
          github_url: string | null
          id: string
          is_featured: boolean
          published: boolean
          screenshots: string[]
          slug: string
          status: string
          tagline: string | null
          tech_stack: string[]
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          display_order?: number
          github_url?: string | null
          id?: string
          is_featured?: boolean
          published?: boolean
          screenshots?: string[]
          slug: string
          status?: string
          tagline?: string | null
          tech_stack?: string[]
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          display_order?: number
          github_url?: string | null
          id?: string
          is_featured?: boolean
          published?: boolean
          screenshots?: string[]
          slug?: string
          status?: string
          tagline?: string | null
          tech_stack?: string[]
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          approach: string | null
          company: string
          cover_image: string | null
          created_at: string
          description: string
          display_order: number
          duration: string | null
          execution_collaboration: string | null
          gradient: string | null
          id: string
          impact_results: string | null
          industry: string | null
          is_featured: boolean
          metrics: string[]
          outcome: string | null
          problem: string | null
          published: boolean | null
          reflections: string | null
          role: string | null
          slug: string | null
          solution: string | null
          tags: string[]
          team_composition: string[] | null
          title: string
          tools_used: string[] | null
          updated_at: string
        }
        Insert: {
          approach?: string | null
          company: string
          cover_image?: string | null
          created_at?: string
          description: string
          display_order?: number
          duration?: string | null
          execution_collaboration?: string | null
          gradient?: string | null
          id?: string
          impact_results?: string | null
          industry?: string | null
          is_featured?: boolean
          metrics?: string[]
          outcome?: string | null
          problem?: string | null
          published?: boolean | null
          reflections?: string | null
          role?: string | null
          slug?: string | null
          solution?: string | null
          tags?: string[]
          team_composition?: string[] | null
          title: string
          tools_used?: string[] | null
          updated_at?: string
        }
        Update: {
          approach?: string | null
          company?: string
          cover_image?: string | null
          created_at?: string
          description?: string
          display_order?: number
          duration?: string | null
          execution_collaboration?: string | null
          gradient?: string | null
          id?: string
          impact_results?: string | null
          industry?: string | null
          is_featured?: boolean
          metrics?: string[]
          outcome?: string | null
          problem?: string | null
          published?: boolean | null
          reflections?: string | null
          role?: string | null
          slug?: string | null
          solution?: string | null
          tags?: string[]
          team_composition?: string[] | null
          title?: string
          tools_used?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      toolkit_methodologies: {
        Row: {
          created_at: string
          display_order: number
          icon_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      toolkit_skills: {
        Row: {
          created_at: string
          display_order: number
          icon_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      toolkit_tools: {
        Row: {
          created_at: string
          display_order: number
          icon_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
