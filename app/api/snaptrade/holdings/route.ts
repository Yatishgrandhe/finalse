import { NextRequest, NextResponse } from 'next/server'
import { snaptradeService } from '@/lib/snaptrade'

// GET /api/snaptrade/holdings - Get portfolio holdings
// Following SnapTrade API documentation: https://snaptrade.com/developers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const authorizationId = searchParams.get('authorizationId')
    const accountId = searchParams.get('accountId')

    if (!authorizationId) {
      return NextResponse.json(
        { error: 'authorizationId is required' },
        { status: 400 }
      )
    }

    console.log('Fetching SnapTrade holdings:', { authorizationId, accountId })

    // Get portfolio holdings using SnapTrade service
    const holdings = await snaptradeService.getPortfolioHoldings(authorizationId, accountId || undefined)

    console.log('SnapTrade holdings fetched:', { count: holdings.length })

    return NextResponse.json({
      success: true,
      holdings,
      count: holdings.length
    })

  } catch (error) {
    console.error('Error fetching SnapTrade holdings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch portfolio holdings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
