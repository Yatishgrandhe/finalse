// Generated Convex API - placeholder for build compatibility
// This file will be replaced when Convex is properly deployed

// Mock function references for build compatibility
const mockMutation = () => Promise.resolve({ success: false, error: "Convex not configured" });
const mockQuery = () => Promise.resolve(null);

export const api = {
  auth: {
    signup: mockMutation as any,
    signin: mockMutation as any,
    signout: mockMutation as any,
    getCurrentUser: mockQuery as any,
    verifySession: mockQuery as any,
    updateProfile: mockMutation as any,
    changePassword: mockMutation as any,
  },
  portfolios: {
    getUserPortfolios: mockQuery as any,
    getPortfolio: mockQuery as any,
    createPortfolio: mockMutation as any,
    updatePortfolio: mockMutation as any,
    deletePortfolio: mockMutation as any,
    getPortfolioHoldings: mockQuery as any,
    addHolding: mockMutation as any,
    removeHolding: mockMutation as any,
  },
} as const;

export const internal = api;
