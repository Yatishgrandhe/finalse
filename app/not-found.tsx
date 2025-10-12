'use client'

import Link from 'next/link'
import Image from 'next/image'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center text-white max-w-md mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="FinAIse Logo"
                width={48}
                height={48}
                className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-accent-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-secondary-200 bg-clip-text text-transparent group-hover:from-secondary-200 group-hover:to-accent-300 transition-all duration-300">
              FinAIse
            </h1>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-white/80 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-secondary-600 to-accent-600 hover:from-secondary-700 hover:to-accent-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary-500/25"
          >
            Go Home
          </Link>
          <div className="text-white/60 text-sm">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            {' • '}
            <Link href="/portfolio" className="hover:text-white transition-colors">
              Portfolio
            </Link>
            {' • '}
            <Link href="/market" className="hover:text-white transition-colors">
              Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
