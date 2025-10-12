import { useState, useEffect, useCallback } from 'react';
import { YahooQuote, YahooHistoricalData, YahooSearchResult, YahooNewsItem } from '@/lib/yahoo-finance';

// Custom hook for Yahoo Finance API calls
export function useYahooFinance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Generic API call wrapper
  const apiCall = useCallback(async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API call failed');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('API call failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    apiCall,
  };
}

// Hook for fetching stock quotes
export function useStockQuotes(symbols: string[]) {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [quotes, setQuotes] = useState<YahooQuote[]>([]);

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0) return;

    const symbolsParam = symbols.join(',');
    const data = await apiCall<YahooQuote[]>(`/api/stocks?symbols=${symbolsParam}`);
    
    if (data) {
      setQuotes(data);
    }
  }, [symbols, apiCall]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    error,
    refetch: fetchQuotes,
    clearError,
  };
}

// Hook for fetching a single stock quote
export function useStockQuote(symbol: string) {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [quote, setQuote] = useState<YahooQuote | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!symbol) return;

    const data = await apiCall<YahooQuote[]>(`/api/stocks?symbol=${symbol}`);
    
    if (data && data.length > 0) {
      setQuote(data[0]);
    }
  }, [symbol, apiCall]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
    clearError,
  };
}

// Hook for fetching historical data
export function useHistoricalData(
  symbol: string,
  period1?: Date,
  period2?: Date,
  interval: '1d' | '5d' | '1wk' | '1mo' | '3mo' = '1d'
) {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [historicalData, setHistoricalData] = useState<YahooHistoricalData[]>([]);

  const fetchHistoricalData = useCallback(async () => {
    if (!symbol) return;

    const params = new URLSearchParams({
      symbol,
      interval,
    });

    if (period1) {
      params.append('period1', period1.toISOString().split('T')[0]);
    }
    if (period2) {
      params.append('period2', period2.toISOString().split('T')[0]);
    }

    const data = await apiCall<YahooHistoricalData[]>(`/api/stocks/historical?${params}`);
    
    if (data) {
      setHistoricalData(data);
    }
  }, [symbol, period1, period2, interval, apiCall]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  return {
    historicalData,
    loading,
    error,
    refetch: fetchHistoricalData,
    clearError,
  };
}

// Hook for searching symbols
export function useSymbolSearch(query: string) {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [searchResults, setSearchResults] = useState<YahooSearchResult[]>([]);

  const searchSymbols = useCallback(async () => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    const data = await apiCall<YahooSearchResult[]>(`/api/stocks/search?q=${encodeURIComponent(query)}`);
    
    if (data) {
      setSearchResults(data);
    }
  }, [query, apiCall]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSymbols();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchSymbols]);

  return {
    searchResults,
    loading,
    error,
    refetch: searchSymbols,
    clearError,
  };
}

// Hook for fetching trending tickers
export function useTrendingTickers() {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [trendingTickers, setTrendingTickers] = useState<YahooSearchResult[]>([]);

  const fetchTrendingTickers = useCallback(async () => {
    const data = await apiCall<YahooSearchResult[]>('/api/stocks/trending');
    
    if (data) {
      setTrendingTickers(data);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchTrendingTickers();
  }, [fetchTrendingTickers]);

  return {
    trendingTickers,
    loading,
    error,
    refetch: fetchTrendingTickers,
    clearError,
  };
}

// Hook for fetching stock news
export function useStockNews(symbol: string, count: number = 10) {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [news, setNews] = useState<YahooNewsItem[]>([]);

  const fetchNews = useCallback(async () => {
    if (!symbol) return;

    const data = await apiCall<YahooNewsItem[]>(`/api/stocks/news?symbol=${symbol}&count=${count}`);
    
    if (data) {
      setNews(data);
    }
  }, [symbol, count, apiCall]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
    clearError,
  };
}

// Hook for fetching market summary
export function useMarketSummary() {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [marketSummary, setMarketSummary] = useState<any>(null);

  const fetchMarketSummary = useCallback(async () => {
    const data = await apiCall<any>('/api/market');
    
    if (data) {
      setMarketSummary(data);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchMarketSummary();
  }, [fetchMarketSummary]);

  return {
    marketSummary,
    loading,
    error,
    refetch: fetchMarketSummary,
    clearError,
  };
}

// Hook for popular symbols
export function usePopularSymbols() {
  const symbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'AMD', 'INTC', 'CRM', 'ADBE', 'PYPL', 'UBER', 'SQ', 'ROKU'
  ];

  return useStockQuotes(symbols);
}

// Hook for sector symbols
export function useSectorSymbols(sector: string) {
  const sectorSymbols: { [key: string]: string[] } = {
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

  const symbols = sectorSymbols[sector] || [];
  return useStockQuotes(symbols);
}
