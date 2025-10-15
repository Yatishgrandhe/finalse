# Vercel Deployment Guide for FinAIse

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Database**: Already deployed and configured

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the `FinAIseWeb` folder as the root directory

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_YAHOO_FINANCE_API_KEY=your_yahoo_finance_api_key
NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_hugging_face_api_key
```

### 3. Build Settings

Vercel will automatically detect Next.js and use these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 2. Environment Variables Verification

Verify that all environment variables are properly set:

```bash
# Check in Vercel dashboard or via CLI
vercel env ls
```

### 3. Database Connection Test

Test the Convex connection by:

1. Visiting your deployed app
2. Navigating to `/dashboard`
3. Verifying that data loads from Convex

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Error**: `Module not found` or `TypeScript errors`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Environment Variables Not Working

**Error**: `NEXT_PUBLIC_SUPABASE_URL is undefined`

**Solution**:
- Verify environment variables in Vercel dashboard
- Ensure variable names start with `NEXT_PUBLIC_`
- Redeploy after adding variables

#### 3. Supabase Connection Issues

**Error**: `Failed to connect to Supabase`

**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check Supabase project status
- Ensure CORS settings allow your domain

#### 4. Image Loading Issues

**Error**: `Image optimization failed`

**Solution**:
- Add domains to `next.config.js` images.domains
- Use `remotePatterns` for dynamic image sources
- Verify image URLs are accessible

### Performance Optimization

#### 1. Enable Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to your app
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### 2. Optimize Images

```typescript
import Image from 'next/image'

// Use Next.js Image component for optimization
<Image
  src="/logo.png"
  alt="FinAIse Logo"
  width={200}
  height={50}
  priority
/>
```

#### 3. Enable Compression

Already configured in `next.config.js`:
```javascript
compress: true,
generateEtags: false,
```

## Monitoring and Maintenance

### 1. Vercel Dashboard

Monitor your deployment:
- **Analytics**: Traffic and performance metrics
- **Functions**: Serverless function logs
- **Deployments**: Build and deployment history

### 2. Error Monitoring

Set up error tracking:

```bash
# Install Sentry for error monitoring
npm install @sentry/nextjs
```

### 3. Performance Monitoring

Monitor Core Web Vitals:
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift

## Security Considerations

### 1. Environment Variables

- Never commit `.env.local` files
- Use Vercel's environment variable system
- Rotate API keys regularly

### 2. Headers Configuration

Already configured in `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- X-XSS-Protection: 1; mode=block

### 3. HTTPS

Vercel automatically provides HTTPS certificates

## Scaling Considerations

### 1. Database Scaling

- Convex automatically scales with usage
- Monitor query performance in Convex dashboard
- Optimize queries for better performance

### 2. CDN and Edge Functions

- Vercel provides global CDN
- Use Edge Functions for better performance
- Consider regional deployment for global users

### 3. Caching Strategy

```typescript
// Implement caching for API calls
export const revalidate = 3600 // 1 hour

// Use SWR for client-side caching
import useSWR from 'swr'
```

## Backup and Recovery

### 1. Database Backups

- Convex provides automatic backups
- Export data regularly for additional safety
- Test recovery procedures

### 2. Code Backups

- Use Git for version control
- Tag releases for easy rollback
- Maintain staging environment

## Cost Optimization

### 1. Vercel Plans

- **Hobby**: Free tier for personal projects
- **Pro**: $20/month for commercial use
- **Enterprise**: Custom pricing for large scale

### 2. Resource Optimization

- Optimize images and assets
- Use efficient data fetching
- Implement proper caching

## Support and Resources

### 1. Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)

### 2. Community

- [Vercel Discord](https://vercel.com/discord)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Convex Community](https://convex.dev/community)

### 3. Support

- Vercel: Support through dashboard
- Convex: Community support and paid plans
- GitHub: Issue tracking and discussions
