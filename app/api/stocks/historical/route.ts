import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceService } from '@/lib/yahoo-finance';

// GET /api/stocks/historical - Get historical stock data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const period1 = searchParams.get('period1');
    const period2 = searchParams.get('period2');
    const interval = searchParams.get('interval') as '1d' | '5d' | '1wk' | '1mo' | '3mo' || '1d';

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Default to last 30 days if no dates provided
    const endDate = period2 ? new Date(period2) : new Date();
    const startDate = period1 ? new Date(period1) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    const historicalData = await yahooFinanceService.getHistoricalData(
      symbol.toUpperCase(),
      startDate,
      endDate,
      interval
    );

    return NextResponse.json({
      success: true,
      data: historicalData,
      symbol: symbol.toUpperCase(),
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      interval,
      count: historicalData.length
    });

  } catch (error) {
    console.error('Error in /api/stocks/historical:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch historical data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
