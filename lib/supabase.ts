import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string
          auth_provider: string
          email: string
          name: string
          password_hash: string | null
          profile_image: string | null
          created_at: string
          last_login_at: string
          preferences: {
            currency: string
            theme: string
            notifications: boolean
          }
          robinhood_connected: boolean | null
          robinhood_access_token: string | null
          robinhood_refresh_token: string | null
          robinhood_token_expires_at: number | null
          robinhood_account_id: string | null
          robinhood_profile: any | null
          robinhood_connected_at: number | null
          robinhood_last_sync_at: number | null
        }
        Insert: {
          id?: string
          auth_id: string
          auth_provider: string
          email: string
          name: string
          password_hash?: string | null
          profile_image?: string | null
          created_at?: string
          last_login_at?: string
          preferences?: {
            currency: string
            theme: string
            notifications: boolean
          }
          robinhood_connected?: boolean | null
          robinhood_access_token?: string | null
          robinhood_refresh_token?: string | null
          robinhood_token_expires_at?: number | null
          robinhood_account_id?: string | null
          robinhood_profile?: any | null
          robinhood_connected_at?: number | null
          robinhood_last_sync_at?: number | null
        }
        Update: {
          id?: string
          auth_id?: string
          auth_provider?: string
          email?: string
          name?: string
          password_hash?: string | null
          profile_image?: string | null
          created_at?: string
          last_login_at?: string
          preferences?: {
            currency: string
            theme: string
            notifications: boolean
          }
          robinhood_connected?: boolean | null
          robinhood_access_token?: string | null
          robinhood_refresh_token?: string | null
          robinhood_token_expires_at?: number | null
          robinhood_account_id?: string | null
          robinhood_profile?: any | null
          robinhood_connected_at?: number | null
          robinhood_last_sync_at?: number | null
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          name: string
          total_value: number
          total_cost: number
          total_gain_loss: number
          total_gain_loss_percent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          total_value?: number
          total_cost?: number
          total_gain_loss?: number
          total_gain_loss_percent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          total_value?: number
          total_cost?: number
          total_gain_loss?: number
          total_gain_loss_percent?: number
          created_at?: string
          updated_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          portfolio_id: string
          stock_symbol: string
          shares: number
          average_cost: number
          current_value: number
          total_cost: number | null
          gain_loss: number
          gain_loss_percent: number
          last_updated: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          stock_symbol: string
          shares: number
          average_cost: number
          current_value?: number
          total_cost?: number | null
          gain_loss?: number
          gain_loss_percent?: number
          last_updated?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          stock_symbol?: string
          shares?: number
          average_cost?: number
          current_value?: number
          total_cost?: number | null
          gain_loss?: number
          gain_loss_percent?: number
          last_updated?: string
        }
      }
      bookmarked_stocks: {
        Row: {
          id: string
          user_id: string
          stock_symbol: string
          stock_name: string
          added_at: string
          notes: string | null
          target_price: number | null
          alert_price: number | null
          is_alert_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          stock_symbol: string
          stock_name: string
          added_at?: string
          notes?: string | null
          target_price?: number | null
          alert_price?: number | null
          is_alert_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          stock_symbol?: string
          stock_name?: string
          added_at?: string
          notes?: string | null
          target_price?: number | null
          alert_price?: number | null
          is_alert_active?: boolean
        }
      }
      stocks: {
        Row: {
          id: string
          symbol: string
          name: string
          current_price: number
          previous_close: number
          change: number
          change_percent: number
          volume: number
          market_cap: number | null
          sector: string | null
          industry: string | null
          last_updated: string
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          current_price: number
          previous_close: number
          change: number
          change_percent: number
          volume: number
          market_cap?: number | null
          sector?: string | null
          industry?: string | null
          last_updated?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          current_price?: number
          previous_close?: number
          change?: number
          change_percent?: number
          volume?: number
          market_cap?: number | null
          sector?: string | null
          industry?: string | null
          last_updated?: string
        }
      }
      predictions: {
        Row: {
          id: string
          stock_symbol: string
          prediction_type: string
          confidence: number
          prediction: string
          target_price: number | null
          timeframe: string
          reasoning: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          stock_symbol: string
          prediction_type: string
          confidence: number
          prediction: string
          target_price?: number | null
          timeframe: string
          reasoning: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          stock_symbol?: string
          prediction_type?: string
          confidence?: number
          prediction?: string
          target_price?: number | null
          timeframe?: string
          reasoning?: string
          created_at?: string
          expires_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          summary: string
          url: string
          source: string
          published_at: string
          stock_symbols: string[]
          sentiment: string
          relevance_score: number
          tags: string[]
        }
        Insert: {
          id?: string
          title: string
          content: string
          summary: string
          url: string
          source: string
          published_at: string
          stock_symbols: string[]
          sentiment: string
          relevance_score: number
          tags: string[]
        }
        Update: {
          id?: string
          title?: string
          content?: string
          summary?: string
          url?: string
          source?: string
          published_at?: string
          stock_symbols?: string[]
          sentiment?: string
          relevance_score?: number
          tags?: string[]
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          portfolio_id: string
          stock_symbol: string
          type: string
          shares: number
          price: number
          total_amount: number
          fees: number
          timestamp: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          portfolio_id: string
          stock_symbol: string
          type: string
          shares: number
          price: number
          total_amount: number
          fees: number
          timestamp?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          portfolio_id?: string
          stock_symbol?: string
          type?: string
          shares?: number
          price?: number
          total_amount?: number
          fees?: number
          timestamp?: string
          notes?: string | null
        }
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          name: string
          stock_symbols: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          stock_symbols: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          stock_symbols?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
