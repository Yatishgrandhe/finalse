import { NextRequest, NextResponse } from 'next/server'
import { yahooFinanceService } from '@/lib/yahoo-finance'

// GET /api/news - Get financial news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock news data since Yahoo Finance API doesn't have direct news access
    // In a real implementation, you would use a news API like NewsAPI, Alpha Vantage, or similar
    const mockNews = [
      {
        id: '1',
        title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
        summary: 'The Federal Reserve indicated it may consider cutting interest rates next year as inflation shows signs of cooling.',
        content: 'Federal Reserve officials have signaled that they may consider cutting interest rates in 2024 as inflation shows signs of cooling and the economy begins to slow. This comes after a series of aggressive rate hikes aimed at combating inflation.',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: 'economy',
        symbol: '^GSPC',
        sentiment: 'neutral',
        aiHighlighted: true
      },
      {
        id: '2',
        title: 'Apple Reports Strong Q4 Earnings, Beats Expectations',
        summary: 'Apple Inc. reported better-than-expected quarterly earnings, driven by strong iPhone sales and services growth.',
        content: 'Apple Inc. reported quarterly earnings that beat Wall Street expectations, driven by strong iPhone sales and continued growth in its services division. The company also provided optimistic guidance for the next quarter.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        category: 'earnings',
        symbol: 'AAPL',
        sentiment: 'positive',
        aiHighlighted: true
      },
      {
        id: '3',
        title: 'Tesla Stock Surges on New Model Y Production News',
        summary: 'Tesla shares jumped 8% after the company announced increased production capacity for its Model Y electric vehicle.',
        content: 'Tesla Inc. shares surged 8% in after-hours trading after the company announced it has successfully increased production capacity for its Model Y electric vehicle at its Texas Gigafactory.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        category: 'market',
        symbol: 'TSLA',
        sentiment: 'positive',
        aiHighlighted: false
      },
      {
        id: '4',
        title: 'Oil Prices Fall on Increased Supply Concerns',
        summary: 'Crude oil prices dropped 3% as concerns about oversupply and weakening demand continue to weigh on the market.',
        content: 'Crude oil prices fell 3% today as concerns about oversupply and weakening global demand continue to weigh on the energy market. Analysts expect prices to remain volatile in the coming weeks.',
        source: 'Wall Street Journal',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        category: 'energy',
        symbol: 'CL=F',
        sentiment: 'negative',
        aiHighlighted: false
      },
      {
        id: '5',
        title: 'Microsoft Cloud Revenue Grows 25% in Latest Quarter',
        summary: 'Microsoft reported strong cloud revenue growth, with Azure and Office 365 showing robust performance.',
        content: 'Microsoft Corporation reported strong cloud revenue growth of 25% in its latest quarter, with Azure and Office 365 showing robust performance. The company continues to invest heavily in AI capabilities.',
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        category: 'technology',
        symbol: 'MSFT',
        sentiment: 'positive',
        aiHighlighted: true
      },
      {
        id: '6',
        title: 'Banking Sector Faces New Regulatory Scrutiny',
        summary: 'Major banks are facing increased regulatory scrutiny as new capital requirements are being considered.',
        content: 'Major banks are facing increased regulatory scrutiny as policymakers consider new capital requirements and stress testing procedures. This could impact profitability in the sector.',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        category: 'financial',
        symbol: 'JPM',
        sentiment: 'negative',
        aiHighlighted: false
      },
      {
        id: '7',
        title: 'Cryptocurrency Market Shows Signs of Recovery',
        summary: 'Bitcoin and other major cryptocurrencies are showing signs of recovery after recent market volatility.',
        content: 'Bitcoin and other major cryptocurrencies are showing signs of recovery after recent market volatility. Trading volume has increased and institutional interest appears to be returning.',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
        category: 'crypto',
        symbol: 'BTC-USD',
        sentiment: 'positive',
        aiHighlighted: true
      },
      {
        id: '8',
        title: 'Healthcare Stocks Rally on Drug Approval News',
        summary: 'Several healthcare companies saw their stocks rally after positive drug approval announcements.',
        content: 'Several healthcare companies saw their stocks rally after positive drug approval announcements from the FDA. The sector is showing strong momentum heading into the new year.',
        source: 'MarketWatch',
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
        category: 'healthcare',
        symbol: 'JNJ',
        sentiment: 'positive',
        aiHighlighted: false
      }
    ]

    // Filter news based on parameters
    let filteredNews = mockNews

    if (symbol) {
      filteredNews = filteredNews.filter(article => 
        article.symbol === symbol || article.symbol === '^GSPC' // Include general market news
      )
    }

    if (category && category !== 'all') {
      filteredNews = filteredNews.filter(article => article.category === category)
    }

    // Apply pagination
    const paginatedNews = filteredNews.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedNews,
      total: filteredNews.length,
      limit,
      offset,
      hasMore: offset + limit < filteredNews.length
    })

  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
