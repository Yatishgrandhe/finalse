import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/portfolio',
  '/trade',
  '/market',
  '/news',
  '/ai',
  '/profile',
  '/settings'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/auth',
  '/privacy',
  '/terms'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    // Check for session token in cookies or headers
    const sessionToken = request.cookies.get('sessionToken')?.value || 
                        request.headers.get('authorization')?.replace('Bearer ', '')
    
    console.log('Middleware check:', { pathname, sessionToken: sessionToken ? 'exists' : 'missing' })
    
    // If no session token, redirect to login with return URL
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log('Redirecting to login:', loginUrl.toString())
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
