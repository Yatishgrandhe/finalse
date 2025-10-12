"use client";

import { ReactNode } from "react";

// Conditionally import Convex components to prevent build errors
let ConvexProvider: any = null;
let ConvexReactClient: any = null;

try {
  const convexReact = require("convex/react");
  ConvexProvider = convexReact.ConvexProvider;
  ConvexReactClient = convexReact.ConvexReactClient;
} catch (error) {
  // Convex not available during build
  console.log("Convex not available during build");
}

// Initialize Convex client conditionally for build compatibility
let convex: any = null;

if (typeof window !== 'undefined' && ConvexReactClient) {
  // Use a default URL for development if not provided
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://your-convex-deployment.convex.cloud";
  if (convexUrl !== "https://your-convex-deployment.convex.cloud") {
    convex = new ConvexReactClient(convexUrl);
  }
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If Convex components are not available (during build), render children without provider
  if (!convex || !ConvexProvider) {
    return <>{children}</>;
  }
  
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
