// API utility functions for FinAIse

export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  high: number
  low: number
  open: number
  previousClose: number
}

export interface AIPrediction {
  symbol: string
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  targetPrice: number
  reasoning: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface PortfolioItem {
  symbol: string
  shares: number
  averagePrice: number
  currentPrice: number
  value: number
  gainLoss: number
  gainLossPercent: number
}

// Yahoo Finance API integration
export class YahooFinanceAPI {
  private baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart'

  async getStockData(symbol: string): Promise<StockData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${symbol}`)
      const data = await response.json()
      
      if (!data.chart?.result?.[0]) {
        throw new Error('Invalid stock symbol')
      }

      const result = data.chart.result[0]
      const meta = result.meta
      const quote = result.indicators.quote[0]

      return {
        symbol: symbol.toUpperCase(),
        price: meta.regularMarketPrice,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        volume: meta.regularMarketVolume,
        marketCap: meta.marketCap,
        high: meta.regularMarketDayHigh,
        low: meta.regularMarketDayLow,
        open: meta.regularMarketOpen,
        previousClose: meta.previousClose,
      }
    } catch (error) {
      console.error('Error fetching stock data:', error)
      return null
    }
  }

  async getHistoricalData(symbol: string, period: string = '1mo'): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${symbol}?range=${period}`)
      const data = await response.json()
      
      if (!data.chart?.result?.[0]) {
        throw new Error('Invalid stock symbol')
      }

      const result = data.chart.result[0]
      const timestamps = result.timestamp
      const quotes = result.indicators.quote[0]

      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: quotes.open[index],
        high: quotes.high[index],
        low: quotes.low[index],
        close: quotes.close[index],
        volume: quotes.volume[index],
      }))
    } catch (error) {
      console.error('Error fetching historical data:', error)
      return []
    }
  }
}

// AI Prediction API integration
export class AIPredictionAPI {
  private baseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.huggingface.co'

  async getStockPrediction(symbol: string): Promise<AIPrediction | null> {
    try {
      // TODO: Implement actual AI prediction API call
      // This is a mock implementation
      const mockPrediction: AIPrediction = {
        symbol: symbol.toUpperCase(),
        recommendation: Math.random() > 0.5 ? 'BUY' : 'SELL',
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        targetPrice: Math.random() * 100 + 50,
        reasoning: 'AI analysis based on technical indicators and market sentiment',
        riskLevel: Math.random() > 0.5 ? 'MEDIUM' : 'HIGH',
      }

      return mockPrediction
    } catch (error) {
      console.error('Error fetching AI prediction:', error)
      return null
    }
  }

  async getPortfolioAnalysis(portfolio: PortfolioItem[]): Promise<any> {
    try {
      // TODO: Implement portfolio analysis API call
      return {
        totalValue: portfolio.reduce((sum, item) => sum + item.value, 0),
        totalGainLoss: portfolio.reduce((sum, item) => sum + item.gainLoss, 0),
        riskScore: Math.floor(Math.random() * 100),
        diversificationScore: Math.floor(Math.random() * 100),
        recommendations: [],
      }
    } catch (error) {
      console.error('Error analyzing portfolio:', error)
      return null
    }
  }
}

// Export singleton instances
export const yahooFinanceAPI = new YahooFinanceAPI()
export const aiPredictionAPI = new AIPredictionAPI()
