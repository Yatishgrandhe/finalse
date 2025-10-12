import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceService } from '@/lib/yahoo-finance';

// GET /api/stocks - Get stock quotes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');
    const symbol = searchParams.get('symbol');

    if (!symbols && !symbol) {
      return NextResponse.json(
        { error: 'Either symbols or symbol parameter is required' },
        { status: 400 }
      );
    }

    let result;

    if (symbols) {
      // Get multiple quotes
      const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
      result = await yahooFinanceService.getQuotes(symbolList);
    } else if (symbol) {
      // Get single quote
      const quote = await yahooFinanceService.getQuote(symbol.toUpperCase());
      result = quote ? [quote] : [];
    }

    return NextResponse.json({
      success: true,
      data: result,
      count: result?.length || 0
    });

  } catch (error) {
    console.error('Error in /api/stocks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stock data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
