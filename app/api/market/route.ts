import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceService } from '@/lib/yahoo-finance';

// GET /api/market - Get market summary and status
export async function GET(request: NextRequest) {
  try {
    const marketSummary = await yahooFinanceService.getMarketSummary();

    if (!marketSummary) {
      return NextResponse.json(
        { error: 'Failed to fetch market summary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: marketSummary
    });

  } catch (error) {
    console.error('Error in /api/market:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch market data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
