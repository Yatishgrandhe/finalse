import { NextRequest, NextResponse } from 'next/server'
import { snaptradeService } from '@/lib/snaptrade'

// GET /api/snaptrade/accounts - Get connected broker accounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const authorizationId = searchParams.get('authorizationId')

    if (!authorizationId) {
      return NextResponse.json(
        { error: 'authorizationId is required' },
        { status: 400 }
      )
    }

    const accounts = await snaptradeService.getBrokerAccounts(authorizationId)

    return NextResponse.json({
      success: true,
      accounts,
      count: accounts.length
    })

  } catch (error) {
    console.error('Error fetching broker accounts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch broker accounts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
