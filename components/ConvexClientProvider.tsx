"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Initialize Convex client conditionally for build compatibility
let convex: ConvexReactClient | null = null;

if (typeof window !== 'undefined') {
  // Use a default URL for development if not provided
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://your-convex-deployment.convex.cloud";
  convex = new ConvexReactClient(convexUrl);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If Convex client is not available (during build), render children without provider
  if (!convex) {
    return <>{children}</>;
  }
  
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
