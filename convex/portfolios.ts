import { ConvexError, v } from "./_generated/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./lib/auth";

// Get user's portfolios
export const getUserPortfolios = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const portfolios = await ctx.db
      .query("portfolios")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    return portfolios.map(portfolio => ({
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      totalValue: portfolio.totalValue,
      totalCost: portfolio.totalCost,
      totalGainLoss: portfolio.totalGainLoss,
      totalGainLossPercent: portfolio.totalGainLossPercent,
      createdAt: portfolio.createdAt,
      lastUpdated: portfolio.lastUpdated,
      isDefault: portfolio.isDefault,
    }));
  },
});

// Get portfolio by ID
export const getPortfolio = query({
  args: {
    portfolioId: v.id("portfolios"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolio = await ctx.db.get(args.portfolioId);
    if (!portfolio) {
      throw new ConvexError("Portfolio not found");
    }

    if (portfolio.userId !== userId) {
      throw new ConvexError("Access denied");
    }

    return {
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      totalValue: portfolio.totalValue,
      totalCost: portfolio.totalCost,
      totalGainLoss: portfolio.totalGainLoss,
      totalGainLossPercent: portfolio.totalGainLossPercent,
      createdAt: portfolio.createdAt,
      lastUpdated: portfolio.lastUpdated,
      isDefault: portfolio.isDefault,
    };
  },
});

// Create new portfolio
export const createPortfolio = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolioId = await ctx.db.insert("portfolios", {
      userId,
      name: args.name,
      description: args.description || "",
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      isDefault: false,
    });

    return { portfolioId, success: true };
  },
});

// Update portfolio
export const updatePortfolio = mutation({
  args: {
    portfolioId: v.id("portfolios"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolio = await ctx.db.get(args.portfolioId);
    if (!portfolio) {
      throw new ConvexError("Portfolio not found");
    }

    if (portfolio.userId !== userId) {
      throw new ConvexError("Access denied");
    }

    const updateData: any = {
      lastUpdated: Date.now(),
    };
    if (args.name !== undefined) updateData.name = args.name;
    if (args.description !== undefined) updateData.description = args.description;

    await ctx.db.patch(args.portfolioId, updateData);

    return { success: true };
  },
});

// Delete portfolio
export const deletePortfolio = mutation({
  args: {
    portfolioId: v.id("portfolios"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolio = await ctx.db.get(args.portfolioId);
    if (!portfolio) {
      throw new ConvexError("Portfolio not found");
    }

    if (portfolio.userId !== userId) {
      throw new ConvexError("Access denied");
    }

    if (portfolio.isDefault) {
      throw new ConvexError("Cannot delete default portfolio");
    }

    // Delete all holdings in this portfolio
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .collect();

    for (const holding of holdings) {
      await ctx.db.delete(holding._id);
    }

    // Delete all transactions for this portfolio
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .collect();

    for (const transaction of transactions) {
      await ctx.db.delete(transaction._id);
    }

    // Delete the portfolio
    await ctx.db.delete(args.portfolioId);

    return { success: true };
  },
});

// Get portfolio holdings
export const getPortfolioHoldings = query({
  args: {
    portfolioId: v.id("portfolios"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolio = await ctx.db.get(args.portfolioId);
    if (!portfolio) {
      throw new ConvexError("Portfolio not found");
    }

    if (portfolio.userId !== userId) {
      throw new ConvexError("Access denied");
    }

    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .collect();

    return holdings.map(holding => ({
      id: holding._id,
      symbol: holding.symbol,
      shares: holding.shares,
      averageCost: holding.averageCost,
      currentValue: holding.currentValue,
      totalCost: holding.totalCost,
      gainLoss: holding.gainLoss,
      gainLossPercent: holding.gainLossPercent,
      lastUpdated: holding.lastUpdated,
    }));
  },
});

// Add holding to portfolio
export const addHolding = mutation({
  args: {
    portfolioId: v.id("portfolios"),
    symbol: v.string(),
    shares: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolio = await ctx.db.get(args.portfolioId);
    if (!portfolio) {
      throw new ConvexError("Portfolio not found");
    }

    if (portfolio.userId !== userId) {
      throw new ConvexError("Access denied");
    }

    const totalCost = args.shares * args.price;

    // Check if holding already exists
    const existingHolding = await ctx.db
      .query("holdings")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .filter((q) => q.eq(q.field("symbol"), args.symbol))
      .first();

    if (existingHolding) {
      // Update existing holding
      const newShares = existingHolding.shares + args.shares;
      const newTotalCost = existingHolding.totalCost + totalCost;
      const newAverageCost = newTotalCost / newShares;

      await ctx.db.patch(existingHolding._id, {
        shares: newShares,
        averageCost: newAverageCost,
        totalCost: newTotalCost,
        currentValue: newShares * args.price, // This would be updated with real-time data
        gainLoss: (newShares * args.price) - newTotalCost,
        gainLossPercent: ((newShares * args.price) - newTotalCost) / newTotalCost * 100,
        lastUpdated: Date.now(),
      });
    } else {
      // Create new holding
      await ctx.db.insert("holdings", {
        portfolioId: args.portfolioId,
        symbol: args.symbol,
        shares: args.shares,
        averageCost: args.price,
        currentValue: args.shares * args.price,
        totalCost,
        gainLoss: 0,
        gainLossPercent: 0,
        lastUpdated: Date.now(),
      });
    }

    // Update portfolio totals
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .collect();

    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const portfolioTotalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalGainLoss = totalValue - portfolioTotalCost;
    const totalGainLossPercent = portfolioTotalCost > 0 ? (totalGainLoss / portfolioTotalCost) * 100 : 0;

    await ctx.db.patch(args.portfolioId, {
      totalValue,
      totalCost: portfolioTotalCost,
      totalGainLoss,
      totalGainLossPercent,
      lastUpdated: Date.now(),
    });

    // Record transaction
    await ctx.db.insert("transactions", {
      userId,
      portfolioId: args.portfolioId,
      symbol: args.symbol,
      type: "buy",
      shares: args.shares,
      price: args.price,
      totalAmount: totalCost,
      fees: 0,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Remove holding from portfolio
export const removeHolding = mutation({
  args: {
    portfolioId: v.id("portfolios"),
    symbol: v.string(),
    shares: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const portfolio = await ctx.db.get(args.portfolioId);
    if (!portfolio) {
      throw new ConvexError("Portfolio not found");
    }

    if (portfolio.userId !== userId) {
      throw new ConvexError("Access denied");
    }

    const holding = await ctx.db
      .query("holdings")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .filter((q) => q.eq(q.field("symbol"), args.symbol))
      .first();

    if (!holding) {
      throw new ConvexError("Holding not found");
    }

    if (holding.shares < args.shares) {
      throw new ConvexError("Insufficient shares");
    }

    const totalAmount = args.shares * args.price;

    if (holding.shares === args.shares) {
      // Remove entire holding
      await ctx.db.delete(holding._id);
    } else {
      // Update holding
      const newShares = holding.shares - args.shares;
      const newTotalCost = holding.totalCost - (args.shares * holding.averageCost);

      await ctx.db.patch(holding._id, {
        shares: newShares,
        totalCost: newTotalCost,
        currentValue: newShares * args.price,
        gainLoss: (newShares * args.price) - newTotalCost,
        gainLossPercent: newTotalCost > 0 ? ((newShares * args.price) - newTotalCost) / newTotalCost * 100 : 0,
        lastUpdated: Date.now(),
      });
    }

    // Update portfolio totals
    const holdings = await ctx.db
      .query("holdings")
      .withIndex("by_portfolio_id", (q) => q.eq("portfolioId", args.portfolioId))
      .collect();

    const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const portfolioTotalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
    const totalGainLoss = totalValue - portfolioTotalCost;
    const totalGainLossPercent = portfolioTotalCost > 0 ? (totalGainLoss / portfolioTotalCost) * 100 : 0;

    await ctx.db.patch(args.portfolioId, {
      totalValue,
      totalCost: portfolioTotalCost,
      totalGainLoss,
      totalGainLossPercent,
      lastUpdated: Date.now(),
    });

    // Record transaction
    await ctx.db.insert("transactions", {
      userId,
      portfolioId: args.portfolioId,
      symbol: args.symbol,
      type: "sell",
      shares: args.shares,
      price: args.price,
      totalAmount,
      fees: 0,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});
