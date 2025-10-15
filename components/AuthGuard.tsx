'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../lib/auth-context-supabase'

interface AuthGuardProps {
  children: React.ReactNode
}

function AuthGuardInner({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectUrl = searchParams.get('redirect')
      const loginUrl = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'
      router.push(loginUrl)
    }
  }, [user, isLoading, router, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}

export default function AuthGuard({ children }: AuthGuardProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <AuthGuardInner>{children}</AuthGuardInner>
    </Suspense>
  )
}

