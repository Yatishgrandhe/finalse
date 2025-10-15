import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { YahooQuote, YahooHistoricalData, YahooSearchResult, YahooNewsItem } from '@/lib/yahoo-finance';
import { yahooFinanceCache } from '@/lib/yahoo-finance-cache';

// Custom hook for Yahoo Finance API calls
export function useYahooFinance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Generic API call wrapper - using useRef to make it stable and cache
  const apiCallRef = useRef(async <T>(
    url: string,
    options: RequestInit = {},
    ttl: number = 5 * 60 * 1000 // 5 minutes default TTL
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      // Use cache for GET requests
      if (!options.method || options.method === 'GET') {
        const cachedData = await yahooFinanceCache.get<T>(url, ttl);
        if (cachedData !== null) {
          setLoading(false);
          return cachedData;
        }
      }

      // If not cached or not a GET request, make the actual API call
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
  });

  return {
    loading,
    error,
    clearError,
    apiCall: apiCallRef.current,
  };
}

// Hook for fetching stock quotes
export function useStockQuotes(symbols: string[]) {
  const { loading, error, clearError, apiCall } = useYahooFinance();
  const [quotes, setQuotes] = useState<YahooQuote[]>([]);
  const [lastSymbols, setLastSymbols] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0 || isFetching) return;

    setIsFetching(true);
    try {
      const symbolsParam = symbols.join(',');
      // Use 2 minute TTL for stock quotes
      const data = await apiCall<YahooQuote[]>(`/api/stocks?symbols=${symbolsParam}`, {}, 2 * 60 * 1000);
      
      if (data) {
        setQuotes(data);
      }
    } finally {
      setIsFetching(false);
    }
  }, [symbols.join(','), apiCall, isFetching]);

  useEffect(() => {
    const symbolsParam = symbols.join(',');
    if (symbolsParam !== lastSymbols && !isFetching) {
      setLastSymbols(symbolsParam);
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        fetchQuotes();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [symbols, fetchQuotes, lastSymbols, isFetching]);

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
  const [lastSymbol, setLastSymbol] = useState<string>('');
  const [isFetching, setIsFetching] = useState(false);

  const fetchQuote = useCallback(async () => {
    if (!symbol || isFetching) return;

    setIsFetching(true);
    try {
      // Use 2 minute TTL for single stock quotes
      const data = await apiCall<YahooQuote[]>(`/api/stocks?symbol=${symbol}`, {}, 2 * 60 * 1000);
      
      if (data && data.length > 0) {
        setQuote(data[0]);
      }
    } finally {
      setIsFetching(false);
    }
  }, [symbol, apiCall, isFetching]);

  useEffect(() => {
    if (symbol !== lastSymbol && !isFetching) {
      setLastSymbol(symbol);
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        fetchQuote();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [symbol, fetchQuote, lastSymbol, isFetching]);

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
  const symbols = useMemo(() => [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'AMD', 'INTC', 'CRM', 'ADBE', 'PYPL', 'UBER', 'SQ', 'ROKU'
  ], []);

  return useStockQuotes(symbols);
}

// Hook for sector symbols
export function useSectorSymbols(sector: string) {
  const sectorSymbols = useMemo(() => ({
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
  }), []);

  const symbols = useMemo(() => (sectorSymbols as any)[sector] || [], [sector, sectorSymbols]);
  return useStockQuotes(symbols);
}
