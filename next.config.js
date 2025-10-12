/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation globally to prevent Convex client errors during build
  trailingSlash: false,
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com',
      'logo.clearbit.com',
      'financialmodelingprep.com',
      's3.polygon.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/yahoo-finance/:path*',
        destination: 'https://query1.finance.yahoo.com/v8/finance/chart/:path*',
      },
    ]
  },
  // Optimize for Vercel
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  // Force dynamic rendering for all pages to prevent Convex client errors
  experimental: {
    serverComponentsExternalPackages: ['convex'],
  },
}

module.exports = nextConfig
