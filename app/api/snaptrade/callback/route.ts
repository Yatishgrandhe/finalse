import { NextRequest, NextResponse } from 'next/server'
import { snaptradeService } from '@/lib/snaptrade'
import { connectSnapTrade } from '@/lib/supabase-functions'

// GET /api/snaptrade/callback - Handle OAuth callback
// Following SnapTrade API documentation: https://snaptrade.com/developers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const userId = searchParams.get('userId')

    console.log('SnapTrade OAuth callback received:', {
      code: code ? 'present' : 'missing',
      state: state ? 'present' : 'missing',
      error,
      errorDescription,
      userId
    })

    // Handle OAuth errors
    if (error) {
      console.error('SnapTrade OAuth error:', { error, errorDescription })
      const redirectUrl = new URL('/dashboard', request.url)
      redirectUrl.searchParams.set('broker_error', 'true')
      redirectUrl.searchParams.set('error', error)
      if (errorDescription) {
        redirectUrl.searchParams.set('error_description', errorDescription)
      }
      return NextResponse.redirect(redirectUrl)
    }

    // Validate required parameters
    if (!code) {
      console.error('Missing authorization code in callback')
      const redirectUrl = new URL('/dashboard', request.url)
      redirectUrl.searchParams.set('broker_error', 'true')
      redirectUrl.searchParams.set('error', 'Missing authorization code')
      return NextResponse.redirect(redirectUrl)
    }

    // Handle callback and get authorization ID
    const authorizationId = await snaptradeService.handleCallback(code, state || '')
    
    console.log('SnapTrade authorization successful:', { authorizationId })

    // Save authorization ID to Supabase if userId is provided
    if (userId) {
      try {
        await connectSnapTrade(userId, authorizationId)
        console.log('SnapTrade connection saved to database for user:', userId)
      } catch (dbError) {
        console.error('Error saving SnapTrade connection to database:', dbError)
        // Continue anyway - the OAuth was successful
      }
    }

    // Redirect to success page
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('broker_connected', 'true')
    redirectUrl.searchParams.set('authorization_id', authorizationId)
    if (userId) {
      redirectUrl.searchParams.set('user_id', userId)
    }

    console.log('Redirecting to dashboard with success params')
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Error handling SnapTrade callback:', error)
    
    // Redirect to error page
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('broker_error', 'true')
    redirectUrl.searchParams.set('error', error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.redirect(redirectUrl)
  }
}
