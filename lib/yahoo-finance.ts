// Yahoo Finance API integration for FinAIse
import yahooFinance from 'yahoo-finance2';

// Types for Yahoo Finance data
export interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  currency?: string;
  exchange?: string;
  regularMarketTime?: Date;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  priceToBook?: number;
  priceToEarnings?: number;
  earningsPerShare?: number;
  dividendYield?: number;
  sector?: string;
  industry?: string;
}

export interface YahooHistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose?: number;
}

export interface YahooSearchResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  exchange?: string;
  type?: string;
}

export interface YahooNewsItem {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  type: string;
  relatedTickers?: string[];
}

// Yahoo Finance API service class
export class YahooFinanceService {
  private static instance: YahooFinanceService;
  private readonly defaultOptions = {
    timeout: 10000,
    headers: {
      'User-Agent': 'FinAIse/1.0.0'
    }
  };

  private constructor() {}

  public static getInstance(): YahooFinanceService {
    if (!YahooFinanceService.instance) {
      YahooFinanceService.instance = new YahooFinanceService();
    }
    return YahooFinanceService.instance;
  }

  /**
   * Get real-time quote for a single symbol
   */
  async getQuote(symbol: string): Promise<YahooQuote | null> {
    try {
      const result = await yahooFinance.quote(symbol, this.defaultOptions);
      return this.formatQuote(result);
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get real-time quotes for multiple symbols
   */
  async getQuotes(symbols: string[]): Promise<YahooQuote[]> {
    try {
      const results = await Promise.allSettled(
        symbols.map(symbol => this.getQuote(symbol))
      );
      
      return results
        .filter((result): result is PromiseFulfilledResult<YahooQuote> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [];
    }
  }

  /**
   * Get historical data for a symbol
   */
  async getHistoricalData(
    symbol: string,
    period1: Date,
    period2: Date,
    interval: '1d' | '5d' | '1wk' | '1mo' | '3mo' = '1d'
  ): Promise<YahooHistoricalData[]> {
    try {
      const result = await yahooFinance.historical(symbol, {
        period1,
        period2,
        interval,
        ...this.defaultOptions
      });

      return result.map(item => ({
        date: new Date(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        adjustedClose: item.adjClose
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Search for symbols
   */
  async searchSymbols(query: string): Promise<YahooSearchResult[]> {
    try {
      const result = await yahooFinance.search(query, this.defaultOptions);
      
      return result.quotes.map(quote => ({
        symbol: quote.symbol,
        shortName: quote.shortName,
        longName: quote.longName,
        exchange: quote.exchange,
        type: quote.type
      }));
    } catch (error) {
      console.error(`Error searching symbols for "${query}":`, error);
      return [];
    }
  }

  /**
   * Get trending tickers
   */
  async getTrendingTickers(): Promise<YahooSearchResult[]> {
    try {
      const result = await yahooFinance.trendingSymbols('US', this.defaultOptions);
      
      return result.map(item => ({
        symbol: item.symbol,
        shortName: item.shortName,
        longName: item.longName,
        exchange: item.exchange,
        type: item.type
      }));
    } catch (error) {
      console.error('Error fetching trending tickers:', error);
      return [];
    }
  }

  /**
   * Get news for a symbol
   */
  async getNews(symbol: string, count: number = 10): Promise<YahooNewsItem[]> {
    try {
      const result = await yahooFinance.news(symbol, {
        count,
        ...this.defaultOptions
      });

      return result.map(item => ({
        uuid: item.uuid,
        title: item.title,
        publisher: item.publisher,
        link: item.link,
        providerPublishTime: item.providerPublishTime,
        type: item.type,
        relatedTickers: item.relatedTickers
      }));
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get market summary
   */
  async getMarketSummary(): Promise<{
    marketState: string;
    regularMarketTime: Date;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
  } | null> {
    try {
      const result = await yahooFinance.quote('^GSPC', this.defaultOptions); // S&P 500
      
      return {
        marketState: result.marketState || 'REGULAR',
        regularMarketTime: result.regularMarketTime || new Date(),
        regularMarketPrice: result.regularMarketPrice || 0,
        regularMarketChange: result.regularMarketChange || 0,
        regularMarketChangePercent: result.regularMarketChangePercent || 0
      };
    } catch (error) {
      console.error('Error fetching market summary:', error);
      return null;
    }
  }

  /**
   * Get options data for a symbol
   */
  async getOptions(symbol: string, expiration?: Date): Promise<any> {
    try {
      const result = await yahooFinance.options(symbol, {
        date: expiration,
        ...this.defaultOptions
      });
      return result;
    } catch (error) {
      console.error(`Error fetching options for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get earnings calendar
   */
  async getEarningsCalendar(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      const result = await yahooFinance.calendarEvents({
        startDate,
        endDate,
        ...this.defaultOptions
      });
      return result.earnings || [];
    } catch (error) {
      console.error('Error fetching earnings calendar:', error);
      return [];
    }
  }

  /**
   * Get recommendation trends
   */
  async getRecommendationTrends(symbol: string): Promise<any> {
    try {
      const result = await yahooFinance.recommendationsBySymbol(symbol, this.defaultOptions);
      return result;
    } catch (error) {
      console.error(`Error fetching recommendation trends for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Format quote data to our standard format
   */
  private formatQuote(data: any): YahooQuote {
    return {
      symbol: data.symbol,
      shortName: data.shortName,
      longName: data.longName,
      regularMarketPrice: data.regularMarketPrice,
      regularMarketChange: data.regularMarketChange,
      regularMarketChangePercent: data.regularMarketChangePercent,
      regularMarketVolume: data.regularMarketVolume,
      marketCap: data.marketCap,
      currency: data.currency,
      exchange: data.exchange,
      regularMarketTime: data.regularMarketTime,
      regularMarketPreviousClose: data.regularMarketPreviousClose,
      regularMarketOpen: data.regularMarketOpen,
      regularMarketDayHigh: data.regularMarketDayHigh,
      regularMarketDayLow: data.regularMarketDayLow,
      fiftyTwoWeekHigh: data.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: data.fiftyTwoWeekLow,
      averageDailyVolume3Month: data.averageDailyVolume3Month,
      averageDailyVolume10Day: data.averageDailyVolume10Day,
      priceToBook: data.priceToBook,
      priceToEarnings: data.priceToEarnings,
      earningsPerShare: data.earningsPerShare,
      dividendYield: data.dividendYield,
      sector: data.sector,
      industry: data.industry
    };
  }

  /**
   * Get popular symbols for quick access
   */
  getPopularSymbols(): string[] {
    return [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
      'AMD', 'INTC', 'CRM', 'ADBE', 'PYPL', 'UBER', 'SQ', 'ROKU',
      'SPOT', 'ZM', 'DOCU', 'SNOW', 'PLTR', 'ARKK', 'SPY', 'QQQ',
      'IWM', 'VTI', 'VOO', 'VEA', 'VWO', 'BND', 'GLD', 'SLV'
    ];
  }

  /**
   * Get sector symbols
   */
  getSectorSymbols(): { [key: string]: string[] } {
    return {
      'Technology': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'],
      'Healthcare': ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'TMO', 'ABT', 'DHR', 'BMY'],
      'Financial': ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'AXP', 'V', 'MA'],
      'Consumer Discretionary': ['TSLA', 'HD', 'MCD', 'NKE', 'SBUX', 'LOW', 'TJX', 'BKNG'],
      'Consumer Staples': ['PG', 'KO', 'PEP', 'WMT', 'COST', 'CL', 'KMB', 'GIS'],
      'Energy': ['XOM', 'CVX', 'COP', 'EOG', 'SLB', 'KMI', 'WMB', 'OKE'],
      'Industrials': ['BA', 'CAT', 'GE', 'HON', 'UPS', 'FDX', 'LMT', 'RTX'],
      'Materials': ['LIN', 'APD', 'SHW', 'ECL', 'DD', 'DOW', 'FCX', 'NEM'],
      'Real Estate': ['AMT', 'PLD', 'CCI', 'EQIX', 'PSA', 'O', 'SPG', 'WELL'],
      'Utilities': ['NEE', 'DUK', 'SO', 'AEP', 'EXC', 'XEL', 'PEG', 'WEC']
    };
  }
}

// Export singleton instance
export const yahooFinanceService = YahooFinanceService.getInstance();

// Utility functions for common operations
export const financeUtils = {
  /**
   * Format price with currency
   */
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  },

  /**
   * Format percentage change
   */
  formatPercentageChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  },

  /**
   * Format volume
   */
  formatVolume(volume: number): string {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toString();
  },

  /**
   * Calculate price change color
   */
  getChangeColor(change: number): string {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  },

  /**
   * Get market status
   */
  getMarketStatus(marketState: string): { status: string; color: string } {
    switch (marketState) {
      case 'REGULAR':
        return { status: 'Open', color: 'text-green-600' };
      case 'CLOSED':
        return { status: 'Closed', color: 'text-red-600' };
      case 'PRE':
        return { status: 'Pre-Market', color: 'text-yellow-600' };
      case 'POST':
        return { status: 'After Hours', color: 'text-blue-600' };
      default:
        return { status: 'Unknown', color: 'text-gray-600' };
    }
  }
};

// Export types for use in other files
export type {
  YahooQuote,
  YahooHistoricalData,
  YahooSearchResult,
  YahooNewsItem
};
