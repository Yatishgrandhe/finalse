"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Mock hooks for build compatibility
const mockMutation = () => () => Promise.resolve({ success: false, error: "Convex not available" });
const mockQuery = () => null;

// Check if we're in a build environment
const isBuildTime = typeof window === 'undefined' || process.env.NODE_ENV === 'production';

// Conditionally import Convex hooks to prevent build errors
let useMutation: any = mockMutation;
let useQuery: any = mockQuery;
let api: any = null;

if (!isBuildTime) {
  try {
    const convexReact = require("convex/react");
    useMutation = convexReact.useMutation;
    useQuery = convexReact.useQuery;
    api = require("./convex-api").api;
  } catch (error) {
    // Convex not available - use mocks
    console.log("Convex not available");
  }
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: number;
  lastLoginAt?: number;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signout: () => Promise<void>;
  updateProfile: (data: { name?: string; avatar?: string; preferences?: any }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Convex mutations - always call hooks, but handle when Convex is not available
  const signupMutation = useMutation(api?.auth?.signup || mockMutation);
  const signinMutation = useMutation(api?.auth?.signin || mockMutation);
  const signoutMutation = useMutation(api?.auth?.signout || mockMutation);
  const updateProfileMutation = useMutation(api?.auth?.updateProfile || mockMutation);

  // Convex queries - always call hooks, but handle when Convex is not available
  const currentUser = useQuery(api?.auth?.getCurrentUser || mockQuery);
  const sessionData = useQuery(api?.auth?.verifySession || mockQuery, sessionToken ? { token: sessionToken } : "skip");

  // Initialize session token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      setSessionToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Update user state when currentUser query changes
  useEffect(() => {
    if (currentUser !== undefined && currentUser !== null) {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [currentUser]);

  // Update user state when session verification changes
  useEffect(() => {
    if (sessionData) {
      setUser(sessionData.user);
      setIsLoading(false);
    } else if (sessionData === null && sessionToken) {
      // Session is invalid, clear it
      localStorage.removeItem("sessionToken");
      setSessionToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, [sessionData, sessionToken]);

  const signup = async (email: string, name: string, password: string) => {
    if (!api?.auth?.signup) {
      return { success: false, error: "Convex not available" };
    }
    try {
      const result = await signupMutation({ email, name, password });
      if (result.success) {
        // Automatically sign in after successful signup
        return await signin(email, password);
      }
      return { success: false, error: result.error || "Signup failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  const signin = async (email: string, password: string) => {
    if (!api?.auth?.signin) {
      return { success: false, error: "Convex not available" };
    }
    try {
      const result = await signinMutation({ email, password });
      if (result.success) {
        // Store session token
        localStorage.setItem("sessionToken", result.token);
        setSessionToken(result.token);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error || "Signin failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Signin failed" };
    }
  };

  const signout = async () => {
    try {
      if (sessionToken && api?.auth?.signout) {
        await signoutMutation({ token: sessionToken });
      }
    } catch (error) {
      console.error("Signout error:", error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem("sessionToken");
      setSessionToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: { name?: string; avatar?: string; preferences?: any }) => {
    if (!api?.auth?.updateProfile) {
      return { success: false, error: "Convex not available" };
    }
    try {
      const result = await updateProfileMutation(data);
      if (result.success) {
        // Refresh user data
        if (user) {
          setUser({ ...user, ...data });
        }
        return { success: true };
      }
      return { success: false, error: result.error || "Profile update failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Profile update failed" };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signup,
    signin,
    signout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
