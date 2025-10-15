"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createUser, getUser, verifyUserCredentials, updateUserPreferences } from './supabase-functions';
import { cookieUtils } from './cookie-utils';

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
  robinhoodConnected?: boolean;
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

function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Initialize session token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("sessionToken");
      if (token) {
        setSessionToken(token);
        // Set session token as cookie for middleware
        cookieUtils.set('sessionToken', token);
        // Try to get user data from token
        const userData = localStorage.getItem("userData");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("userData");
            localStorage.removeItem("sessionToken");
            // Clear cookie as well
            cookieUtils.delete('sessionToken');
          }
        }
      }
      setIsLoading(false);
    }
  }, []);

  const signup = async (email: string, name: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Client-side validation
      if (!email || !email.includes('@')) {
        return { success: false, error: "Please enter a valid email address" };
      }
      
      if (!name || name.trim().length < 2) {
        return { success: false, error: "Please enter a valid name (at least 2 characters)" };
      }
      
      if (!password || password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters long" };
      }

      // Create user in Supabase
      const result = await createUser({
        authId: `user_${Date.now()}`,
        authProvider: 'email',
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password
      });

      if (result) {
        // Create session token
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("sessionToken", token);
        setSessionToken(token);
        
        // Set session token as cookie for middleware
        cookieUtils.set('sessionToken', token);
        
        // Get the created user data
        const userData = await getUser(result._id);
        if (userData) {
          const userObj: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: userData.profile_image || null,
            isEmailVerified: true,
            createdAt: new Date(userData.created_at).getTime(),
            lastLoginAt: new Date(userData.last_login_at).getTime(),
            preferences: userData.preferences,
            robinhoodConnected: userData.robinhood_connected || false
          };
          
          setUser(userObj);
          localStorage.setItem("userData", JSON.stringify(userObj));
        }
        
        return { success: true };
      }
      
      return { success: false, error: "Signup failed" };
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Client-side validation
      if (!email || !email.includes('@')) {
        return { success: false, error: "Please enter a valid email address" };
      }
      
      if (!password) {
        return { success: false, error: "Please enter your password" };
      }

      // Verify user credentials with Supabase
      const userData = await verifyUserCredentials(email, password);
      
      if (userData) {
        // Create session token
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("sessionToken", token);
        setSessionToken(token);
        
        // Set session token as cookie for middleware
        cookieUtils.set('sessionToken', token);
        console.log('Session token set in cookie:', token);
        
        // Set user data
        const userObj: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.profile_image || null,
          isEmailVerified: true,
          createdAt: new Date(userData.created_at).getTime(),
          lastLoginAt: new Date(userData.last_login_at).getTime(),
          preferences: userData.preferences,
          robinhoodConnected: userData.robinhood_connected || false
        };
        
        setUser(userObj);
        localStorage.setItem("userData", JSON.stringify(userObj));
        
        return { success: true };
      }
      
      return { success: false, error: "Invalid email or password" };
    } catch (error: any) {
      return { success: false, error: error.message || "Signin failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async () => {
    try {
      // Clear local state
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("userData");
      setSessionToken(null);
      setUser(null);
      // Clear cookie as well
      cookieUtils.delete('sessionToken');
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  const updateProfile = async (data: { name?: string; avatar?: string; preferences?: any }) => {
    try {
      if (user) {
        // Update user preferences in Supabase
        if (data.preferences) {
          await updateUserPreferences(user.id, data.preferences);
        }
        
        // Update local user data
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        
        return { success: true };
      }
      return { success: false, error: "No user logged in" };
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

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderInner>{children}</AuthProviderInner>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
