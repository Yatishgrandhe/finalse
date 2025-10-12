import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceService } from '@/lib/yahoo-finance';

// GET /api/stocks/search - Search for stock symbols
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query parameter is required and must be at least 2 characters' },
        { status: 400 }
      );
    }

    const searchResults = await yahooFinanceService.searchSymbols(query.trim());

    return NextResponse.json({
      success: true,
      data: searchResults,
      query: query.trim(),
      count: searchResults.length
    });

  } catch (error) {
    console.error('Error in /api/stocks/search:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search symbols',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
