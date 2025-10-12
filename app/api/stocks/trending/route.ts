import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceService } from '@/lib/yahoo-finance';

// GET /api/stocks/trending - Get trending tickers
export async function GET(request: NextRequest) {
  try {
    const trendingTickers = await yahooFinanceService.getTrendingTickers();

    return NextResponse.json({
      success: true,
      data: trendingTickers,
      count: trendingTickers.length
    });

  } catch (error) {
    console.error('Error in /api/stocks/trending:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch trending tickers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
