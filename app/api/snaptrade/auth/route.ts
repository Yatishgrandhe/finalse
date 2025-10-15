import { NextRequest, NextResponse } from 'next/server'
import { snaptradeService } from '@/lib/snaptrade'

// POST /api/snaptrade/auth - Generate OAuth URL for broker connection
// Following SnapTrade API documentation: https://snaptrade.com/developers
export async function POST(request: NextRequest) {
  try {
    const { redirectUri, userId } = await request.json()

    // redirectUri is required, userId is optional
    if (!redirectUri) {
      return NextResponse.json(
        { error: 'redirectUri is required' },
        { status: 400 }
      )
    }

    console.log('SnapTrade OAuth request:', { redirectUri, userId })

    // Generate OAuth URL using SnapTrade service
    const authUrl = await snaptradeService.generateAuthUrl(redirectUri, userId)

    console.log('Generated SnapTrade OAuth URL:', authUrl)

    return NextResponse.json({
      success: true,
      redirectUrl: authUrl, // Use redirectUrl to match SnapTrade documentation
      redirectUri,
      userId
    })

  } catch (error) {
    console.error('Error generating SnapTrade auth URL:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate broker connection URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
