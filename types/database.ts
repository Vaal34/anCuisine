/**
 * Types générés pour Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string
          name: string
          category: string | null
          default_unit: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          default_unit?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          default_unit?: string
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          title: string
          image_url: string | null
          prep_time: number
          cook_time: number
          servings: number
          ingredients: Json
          steps: Json
          category: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          image_url?: string | null
          prep_time?: number
          cook_time?: number
          servings?: number
          ingredients?: Json
          steps?: Json
          category?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          image_url?: string | null
          prep_time?: number
          cook_time?: number
          servings?: number
          ingredients?: Json
          steps?: Json
          category?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
