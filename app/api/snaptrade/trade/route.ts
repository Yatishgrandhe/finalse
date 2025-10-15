import { NextRequest, NextResponse } from 'next/server'
import { snaptradeService } from '@/lib/snaptrade'

// POST /api/snaptrade/trade - Place a trade order
export async function POST(request: NextRequest) {
  try {
    const { authorizationId, order } = await request.json()

    if (!authorizationId || !order) {
      return NextResponse.json(
        { error: 'authorizationId and order are required' },
        { status: 400 }
      )
    }

    const success = await snaptradeService.placeTradeOrder(authorizationId, order)

    return NextResponse.json({
      success,
      message: success ? 'Trade order placed successfully' : 'Failed to place trade order'
    })

  } catch (error) {
    console.error('Error placing trade order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to place trade order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
