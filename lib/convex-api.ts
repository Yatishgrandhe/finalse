// Convex API imports
import { api as convexApi } from "../convex/_generated/api";

// Export the real Convex API
export const api = convexApi;

// For backward compatibility, also export as internal
export const internal = convexApi;
