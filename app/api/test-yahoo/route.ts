import { NextRequest, NextResponse } from 'next/server'
import { yahooFinanceService } from '@/lib/yahoo-finance'

// GET /api/test-yahoo - Test Yahoo Finance API integration
export async function GET(request: NextRequest) {
  try {
    console.log('Testing Yahoo Finance API...')
    
    // Test single quote
    const testSymbol = 'AAPL'
    const quote = await yahooFinanceService.getQuote(testSymbol)
    console.log('Single quote result:', quote)
    
    // Test multiple quotes
    const symbols = ['AAPL', 'MSFT', 'GOOGL']
    const quotes = await yahooFinanceService.getQuotes(symbols)
    console.log('Multiple quotes result:', quotes)
    
    // Test market summary
    const marketSummary = await yahooFinanceService.getMarketSummary()
    console.log('Market summary result:', marketSummary)
    
    // Test search
    const searchResults = await yahooFinanceService.searchSymbols('Apple')
    console.log('Search results:', searchResults)

    return NextResponse.json({
      success: true,
      message: 'Yahoo Finance API test completed',
      results: {
        singleQuote: quote,
        multipleQuotes: quotes,
        marketSummary,
        searchResults
      }
    })

  } catch (error) {
    console.error('Error testing Yahoo Finance API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Yahoo Finance API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
