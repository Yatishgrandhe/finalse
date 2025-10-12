# Convex Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Convex CLI installed globally: `npm install -g convex`

## Setup Steps

1. **Login to Convex** (if not already logged in):
   ```bash
   npx convex login
   ```

2. **Initialize Convex project**:
   ```bash
   npx convex dev --configure
   ```
   This will prompt you to:
   - Choose a project name (e.g., "finalse")
   - Select a team (or create a new one)
   - Choose a region

3. **Deploy the schema and functions**:
   ```bash
   npx convex dev --once
   ```

4. **Get the deployment URL**:
   After successful deployment, Convex will provide a deployment URL like:
   `https://your-project-name.convex.cloud`

5. **Set the environment variable**:
   Create a `.env.local` file in the project root:
   ```bash
   echo "NEXT_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud" > .env.local
   ```

6. **Restart the development server**:
   ```bash
   npm run dev
   ```

## Current Status
- ✅ Convex schema defined (`convex/schema.ts`)
- ✅ Authentication functions implemented (`convex/auth.ts`)
- ✅ Portfolio functions implemented (`convex/portfolios.ts`)
- ✅ Build compatibility implemented
- ⏳ **PENDING**: Actual Convex deployment and URL configuration

## Notes
- The application is currently configured to work without Convex during build time
- User authentication will work once Convex is deployed and configured
- All database operations are mocked until Convex is properly set up
