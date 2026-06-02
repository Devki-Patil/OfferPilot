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
      applications: {
        Row: {
          id: string
          profile_id: string
          offer_id: string | null
          company: string
          role: string
          status: string
          stage: string
          owner: string
          due_label: string
          score: number
          applied_at: string | null
          source_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          offer_id?: string | null
          company: string
          role: string
          status?: string
          stage?: string
          owner?: string
          due_label?: string
          score?: number
          applied_at?: string | null
          source_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "applications_offer_id_fkey"
            columns: ["offer_id"]
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          id: string
          profile_id: string
          slug: string
          company: string
          role: string
          location: string
          compensation: string
          status: string
          owner: string
          applied_at: string | null
          next_step: string
          score: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          slug: string
          company: string
          role: string
          location?: string
          compensation?: string
          status?: string
          owner?: string
          applied_at?: string | null
          next_step?: string
          score?: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["offers"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "offers_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      resume_scores: {
        Row: {
          id: string
          profile_id: string
          resume_path: string | null
          target_role: string | null
          resume_score: number
          skills_match: number
          ats_score: number
          strengths: string[]
          weaknesses: string[]
          recommendations: string[]
          model: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          resume_path?: string | null
          target_role?: string | null
          resume_score?: number
          skills_match?: number
          ats_score?: number
          strengths?: string[]
          weaknesses?: string[]
          recommendations?: string[]
          model?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["resume_scores"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "resume_scores_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          id: string
          profile_id: string
          external_id: string | null
          source: string
          source_url: string
          title: string
          company: string
          location: string
          description: string
          salary_min: number | null
          salary_max: number | null
          currency: string | null
          recruiter_name: string | null
          recruiter_email: string | null
          employment_type: string
          seniority: string | null
          skills: string[]
          posted_at: string
          expires_at: string | null
          applicant_count: number | null
          is_remote: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          external_id?: string | null
          source?: string
          source_url: string
          title: string
          company: string
          location?: string
          description?: string
          salary_min?: number | null
          salary_max?: number | null
          currency?: string | null
          recruiter_name?: string | null
          recruiter_email?: string | null
          employment_type?: string
          seniority?: string | null
          skills?: string[]
          posted_at?: string
          expires_at?: string | null
          applicant_count?: number | null
          is_remote?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["saved_jobs"]["Insert"]>
        Relationships: [
          {
            foreignKeyName: "saved_jobs_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
