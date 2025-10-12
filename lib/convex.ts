// Convex client configuration and utilities

import { ConvexReactClient } from "convex/react"
import { api } from "../../convex/_generated/api"

// Initialize Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default convex

// Export the client for use in components
export { convex }

// Helper function to get the current user
export async function getCurrentUser() {
  try {
    // TODO: Implement user authentication with Convex
    return {
      id: 'user_123',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: null,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to format Convex data
export function formatConvexData(data: any) {
  if (!data) return null
  
  // Convert Convex timestamps to JavaScript dates
  if (data._creationTime) {
    data.createdAt = new Date(data._creationTime)
  }
  
  return data
}

// Helper function to handle Convex errors
export function handleConvexError(error: any) {
  console.error('Convex error:', error)
  
  if (error.message?.includes('not authenticated')) {
    return 'Please log in to continue'
  }
  
  if (error.message?.includes('permission denied')) {
    return 'You do not have permission to perform this action'
  }
  
  return 'An error occurred. Please try again.'
}

// Stock data types
export interface Stock {
  _id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector?: string;
  lastUpdated: number;
  metadata?: {
    description?: string;
    website?: string;
    logo?: string;
  };
}

export interface StockHistory {
  _id: string;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Prediction {
  _id: string;
  symbol: string;
  userId?: string;
  predictionType: string;
  confidence: number;
  targetPrice?: number;
  timeframe: string;
  reasoning?: string;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
  metadata?: {
    model?: string;
    accuracy?: number;
    riskLevel?: string;
  };
}

export interface Portfolio {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  createdAt: number;
  lastUpdated: number;
  isDefault: boolean;
}

export interface Holding {
  _id: string;
  portfolioId: string;
  symbol: string;
  shares: number;
  averageCost: number;
  currentValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
  lastUpdated: number;
}

export interface News {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  source: string;
  url: string;
  publishedAt: number;
  symbols: string[];
  sentiment?: string;
  sentimentScore?: number;
  category: string;
  isHighlighted: boolean;
  metadata?: {
    author?: string;
    image?: string;
    tags?: string[];
  };
}

export interface Watchlist {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  symbols: string[];
  createdAt: number;
  lastUpdated: number;
  isDefault: boolean;
}

export interface Transaction {
  _id: string;
  userId: string;
  portfolioId: string;
  symbol: string;
  type: string;
  shares: number;
  price: number;
  totalAmount: number;
  fees: number;
  timestamp: number;
  notes?: string;
}

export interface Options {
  _id: string;
  symbol: string;
  contractType: string;
  strike: number;
  expiration: string;
  bid: number;
  ask: number;
  lastPrice: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  lastUpdated: number;
}

// Dashboard data type
export interface DashboardData {
  portfolio: Portfolio | null;
  holdings: Holding[];
  predictions: Prediction[];
  news: News[];
  watchlists: Watchlist[];
}
