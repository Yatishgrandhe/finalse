import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceService } from '@/lib/yahoo-finance';

// GET /api/stocks/news - Get news for a stock symbol
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const count = parseInt(searchParams.get('count') || '10');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 50) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 50' },
        { status: 400 }
      );
    }

    const news = await yahooFinanceService.getNews(symbol.toUpperCase(), count);

    return NextResponse.json({
      success: true,
      data: news,
      symbol: symbol.toUpperCase(),
      count: news.length
    });

  } catch (error) {
    console.error('Error in /api/stocks/news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
