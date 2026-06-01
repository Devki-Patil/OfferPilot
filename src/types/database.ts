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
      profiles: {
        Row: {
          id: string
          clerk_user_id: string
          full_name: string
          email: string | null
          headline: string | null
          target_role: string
          salary_expectation: string | null
          location: string | null
          skills: string[]
          experience: Json
          projects: Json
          links: Json
          resume_path: string | null
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          full_name: string
          email?: string | null
          headline?: string | null
          target_role: string
          salary_expectation?: string | null
          location?: string | null
          skills?: string[]
          experience?: Json
          projects?: Json
          links?: Json
          resume_path?: string | null
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
