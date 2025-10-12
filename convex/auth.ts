import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./lib/auth";

// Simple password hashing (in production, use bcrypt or similar)
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use bcrypt or similar
  return btoa(password + "salt");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Sign up a new user
export const signup = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("User with this email already exists");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new ConvexError("Invalid email format");
    }

    // Validate password strength
    if (args.password.length < 6) {
      throw new ConvexError("Password must be at least 6 characters long");
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      passwordHash: hashPassword(args.password),
      isEmailVerified: false,
      createdAt: Date.now(),
      preferences: {
        theme: "light",
        notifications: true,
        language: "en",
      },
    });

    // Create default portfolio
    await ctx.db.insert("portfolios", {
      userId,
      name: "My Portfolio",
      description: "Default portfolio",
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      isDefault: true,
    });

    // Create default watchlist
    await ctx.db.insert("watchlists", {
      userId,
      name: "My Watchlist",
      description: "Default watchlist",
      symbols: [],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      isDefault: true,
    });

    return { userId, success: true };
  },
});

// Sign in a user
export const signin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new ConvexError("Invalid email or password");
    }

    // Verify password
    if (!verifyPassword(args.password, user.passwordHash)) {
      throw new ConvexError("Invalid email or password");
    }

    // Update last login time
    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
    });

    // Create session token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
    });

    return {
      userId: user._id,
      token,
      expiresAt,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      preferences: user.preferences,
    };
  },
});

// Verify session token
export const verifySession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Delete expired session
      await ctx.db.delete(session._id);
      return null;
    }

    // Update last used time
    await ctx.db.patch(session._id, {
      lastUsedAt: Date.now(),
    });

    // Get user data
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    return {
      userId: user._id,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  },
});

// Sign out user
export const signout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    preferences: v.optional(v.object({
      theme: v.optional(v.string()),
      notifications: v.optional(v.boolean()),
      language: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const updateData: any = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.avatar !== undefined) updateData.avatar = args.avatar;
    if (args.preferences !== undefined) updateData.preferences = args.preferences;

    await ctx.db.patch(userId, updateData);

    return { success: true };
  },
});

// Change password
export const changePassword = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    // Verify current password
    if (!verifyPassword(args.currentPassword, user.passwordHash)) {
      throw new ConvexError("Current password is incorrect");
    }

    // Validate new password
    if (args.newPassword.length < 6) {
      throw new ConvexError("New password must be at least 6 characters long");
    }

    // Update password
    await ctx.db.patch(userId, {
      passwordHash: hashPassword(args.newPassword),
    });

    return { success: true };
  },
});
