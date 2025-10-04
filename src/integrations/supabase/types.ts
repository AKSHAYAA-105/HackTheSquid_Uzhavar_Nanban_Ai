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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crops: {
        Row: {
          created_at: string
          crop_type: string
          description: string | null
          expected_price: number
          farmer_id: string
          harvest_date: string | null
          id: string
          image_url: string | null
          location: string | null
          minimum_price: number | null
          quality_grade: Database["public"]["Enums"]["quality_grade"]
          quantity: number
          status: Database["public"]["Enums"]["crop_status"]
          unit: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          created_at?: string
          crop_type: string
          description?: string | null
          expected_price: number
          farmer_id: string
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          minimum_price?: number | null
          quality_grade?: Database["public"]["Enums"]["quality_grade"]
          quantity: number
          status?: Database["public"]["Enums"]["crop_status"]
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          created_at?: string
          crop_type?: string
          description?: string | null
          expected_price?: number
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          minimum_price?: number | null
          quality_grade?: Database["public"]["Enums"]["quality_grade"]
          quantity?: number
          status?: Database["public"]["Enums"]["crop_status"]
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyback_guarantee: boolean | null
          created_at: string
          crop_id: string
          delivery_preference: string | null
          farmer_id: string
          id: string
          notes: string | null
          offered_price: number
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          buyback_guarantee?: boolean | null
          created_at?: string
          crop_id: string
          delivery_preference?: string | null
          farmer_id: string
          id?: string
          notes?: string | null
          offered_price: number
          quantity: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          buyback_guarantee?: boolean | null
          created_at?: string
          crop_id?: string
          delivery_preference?: string | null
          farmer_id?: string
          id?: string
          notes?: string | null
          offered_price?: number
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          communication_preference:
            | Database["public"]["Enums"]["communication_method"]
            | null
          created_at: string | null
          full_name: string
          id: string
          onboarding_completed: boolean | null
          phone_number: string | null
          preferred_language:
            | Database["public"]["Enums"]["user_language"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          communication_preference?:
            | Database["public"]["Enums"]["communication_method"]
            | null
          created_at?: string | null
          full_name: string
          id?: string
          onboarding_completed?: boolean | null
          phone_number?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["user_language"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          communication_preference?:
            | Database["public"]["Enums"]["communication_method"]
            | null
          created_at?: string | null
          full_name?: string
          id?: string
          onboarding_completed?: boolean | null
          phone_number?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["user_language"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      app_role: "farmer" | "vendor" | "buyer"
      communication_method: "app" | "sms" | "voice" | "whatsapp"
      crop_status: "fresh" | "ready" | "surplus" | "sold"
      order_status:
        | "pending"
        | "negotiating"
        | "confirmed"
        | "in_transit"
        | "delivered"
        | "cancelled"
      quality_grade: "premium" | "grade_a" | "grade_b" | "standard"
      user_language: "english" | "tamil" | "hindi" | "telugu" | "kannada"
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
      app_role: ["farmer", "vendor", "buyer"],
      communication_method: ["app", "sms", "voice", "whatsapp"],
      crop_status: ["fresh", "ready", "surplus", "sold"],
      order_status: [
        "pending",
        "negotiating",
        "confirmed",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      quality_grade: ["premium", "grade_a", "grade_b", "standard"],
      user_language: ["english", "tamil", "hindi", "telugu", "kannada"],
    },
  },
} as const
