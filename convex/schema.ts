import { defineSchema, defineTable } from "./_generated/server";
import { v } from "./_generated/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    avatar: v.optional(v.string()),
    isEmailVerified: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    preferences: v.optional(v.object({
      theme: v.optional(v.string()),
      notifications: v.optional(v.boolean()),
      language: v.optional(v.string()),
    })),
  })
    .index("by_email", ["email"])
    .index("by_created_at", ["createdAt"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    lastUsedAt: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_token", ["token"])
    .index("by_expires_at", ["expiresAt"]),

  portfolios: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    totalValue: v.number(),
    totalCost: v.number(),
    totalGainLoss: v.number(),
    totalGainLossPercent: v.number(),
    createdAt: v.number(),
    lastUpdated: v.number(),
    isDefault: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_created_at", ["createdAt"]),

  holdings: defineTable({
    portfolioId: v.id("portfolios"),
    symbol: v.string(),
    shares: v.number(),
    averageCost: v.number(),
    currentValue: v.number(),
    totalCost: v.number(),
    gainLoss: v.number(),
    gainLossPercent: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_portfolio_id", ["portfolioId"])
    .index("by_symbol", ["symbol"]),

  predictions: defineTable({
    userId: v.optional(v.id("users")),
    symbol: v.string(),
    predictionType: v.string(),
    confidence: v.number(),
    targetPrice: v.optional(v.number()),
    timeframe: v.string(),
    reasoning: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.number(),
    isActive: v.boolean(),
    metadata: v.optional(v.object({
      model: v.optional(v.string()),
      accuracy: v.optional(v.number()),
      riskLevel: v.optional(v.string()),
    })),
  })
    .index("by_user_id", ["userId"])
    .index("by_symbol", ["symbol"])
    .index("by_created_at", ["createdAt"])
    .index("by_expires_at", ["expiresAt"]),

  watchlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    symbols: v.array(v.string()),
    createdAt: v.number(),
    lastUpdated: v.number(),
    isDefault: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_created_at", ["createdAt"]),

  transactions: defineTable({
    userId: v.id("users"),
    portfolioId: v.id("portfolios"),
    symbol: v.string(),
    type: v.string(), // 'buy', 'sell'
    shares: v.number(),
    price: v.number(),
    totalAmount: v.number(),
    fees: v.number(),
    timestamp: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_user_id", ["userId"])
    .index("by_portfolio_id", ["portfolioId"])
    .index("by_symbol", ["symbol"])
    .index("by_timestamp", ["timestamp"]),

  stocks: defineTable({
    symbol: v.string(),
    name: v.string(),
    currentPrice: v.number(),
    previousClose: v.number(),
    change: v.number(),
    changePercent: v.number(),
    volume: v.number(),
    marketCap: v.optional(v.number()),
    sector: v.optional(v.string()),
    lastUpdated: v.number(),
    metadata: v.optional(v.object({
      description: v.optional(v.string()),
      website: v.optional(v.string()),
      logo: v.optional(v.string()),
    })),
  })
    .index("by_symbol", ["symbol"])
    .index("by_last_updated", ["lastUpdated"]),

  news: defineTable({
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    source: v.string(),
    url: v.string(),
    publishedAt: v.number(),
    symbols: v.optional(v.array(v.string())), // Make optional to handle existing data
    stockSymbols: v.optional(v.array(v.string())), // Support existing field name
    sentiment: v.optional(v.string()),
    sentimentScore: v.optional(v.number()),
    category: v.optional(v.string()), // Make optional to handle existing data
    isHighlighted: v.optional(v.boolean()), // Make optional to handle existing data
    relevanceScore: v.optional(v.number()), // Support existing field
    tags: v.optional(v.array(v.string())), // Support existing field
    metadata: v.optional(v.object({
      author: v.optional(v.string()),
      image: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    })),
  })
    .index("by_published_at", ["publishedAt"])
    .index("by_symbols", ["symbols"])
    .index("by_category", ["category"]),
});
