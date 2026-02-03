/**
 * Tipos gerados a partir do schema Supabase (EditorIA)
 * Tabelas: profiles, user_credits, projects, messages
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          user_id: string
          credits: number
          used: number
          total: number
          updated_at: string
        }
        Insert: {
          user_id: string
          credits?: number
          used?: number
          total?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          credits?: number
          used?: number
          total?: number
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          project_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          images: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          role: 'user' | 'assistant' | 'system'
          content?: string
          images?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          images?: Json
          created_at?: string
        }
      }
    }
  }
}
