"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "./convex-api";

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

  // Convex mutations
  const signupMutation = useMutation(api.auth.signup);
  const signinMutation = useMutation(api.auth.signin);
  const signoutMutation = useMutation(api.auth.signout);
  const updateProfileMutation = useMutation(api.auth.updateProfile);

  // Convex queries
  const currentUser = useQuery(api.auth.getCurrentUser);
  const sessionData = useQuery(api.auth.verifySession, sessionToken ? { token: sessionToken } : "skip");

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
    if (currentUser !== undefined) {
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
    try {
      const result = await signupMutation({ email, name, password });
      if (result.success) {
        // Automatically sign in after successful signup
        return await signin(email, password);
      }
      return { success: false, error: "Signup failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      const result = await signinMutation({ email, password });
      if (result.success) {
        // Store session token
        localStorage.setItem("sessionToken", result.token);
        setSessionToken(result.token);
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: "Signin failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Signin failed" };
    }
  };

  const signout = async () => {
    try {
      if (sessionToken) {
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
    try {
      const result = await updateProfileMutation(data);
      if (result.success) {
        // Refresh user data
        if (user) {
          setUser({ ...user, ...data });
        }
        return { success: true };
      }
      return { success: false, error: "Profile update failed" };
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
