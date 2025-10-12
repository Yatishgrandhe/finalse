"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Initialize Convex client conditionally for build compatibility
let convex: ConvexReactClient | null = null;

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CONVEX_URL) {
  convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If Convex client is not available (during build), render children without provider
  if (!convex) {
    return <>{children}</>;
  }
  
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
