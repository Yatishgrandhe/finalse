import { useState, useEffect, useCallback } from 'react'

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  source: string
  publishedAt: Date
  category: string
  symbol?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  aiHighlighted: boolean
}

interface UseNewsOptions {
  symbol?: string
  category?: string
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useNews(options: UseNewsOptions = {}) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const {
    symbol,
    category = 'all',
    limit = 20,
    autoRefresh = false,
    refreshInterval = 300000 // 5 minutes
  } = options

  const fetchNews = useCallback(async (resetOffset = false) => {
    try {
      setLoading(true)
      setError(null)

      const currentOffset = resetOffset ? 0 : offset
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString()
      })

      if (symbol) params.append('symbol', symbol)
      if (category !== 'all') params.append('category', category)

      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch news')
      }

      const newArticles = data.data.map((article: any) => ({
        ...article,
        publishedAt: new Date(article.publishedAt)
      }))

      if (resetOffset) {
        setArticles(newArticles)
        setOffset(limit)
      } else {
        setArticles(prev => [...prev, ...newArticles])
        setOffset(prev => prev + limit)
      }

      setHasMore(data.hasMore)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching news:', errorMessage)
    } finally {
      setLoading(false)
    }
  }, [symbol, category, limit, offset])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNews(false)
    }
  }, [loading, hasMore, fetchNews])

  const refresh = useCallback(() => {
    setOffset(0)
    setHasMore(true)
    fetchNews(true)
  }, [fetchNews])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchNews(true)
  }, [symbol, category, limit])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh])

  // Filter articles by AI highlighted
  const getHighlightedArticles = useCallback(() => {
    return articles.filter(article => article.aiHighlighted)
  }, [articles])

  // Filter articles by sentiment
  const getArticlesBySentiment = useCallback((sentiment: 'positive' | 'negative' | 'neutral') => {
    return articles.filter(article => article.sentiment === sentiment)
  }, [articles])

  // Get articles by category
  const getArticlesByCategory = useCallback((category: string) => {
    return articles.filter(article => article.category === category)
  }, [articles])

  // Search articles
  const searchArticles = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery)
    )
  }, [articles])

  return {
    articles,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    clearError,
    getHighlightedArticles,
    getArticlesBySentiment,
    getArticlesByCategory,
    searchArticles
  }
}

// Hook for fetching news by symbol
export function useStockNews(symbol: string, limit: number = 10) {
  return useNews({ symbol, limit, autoRefresh: true })
}

// Hook for fetching news by category
export function useCategoryNews(category: string, limit: number = 20) {
  return useNews({ category, limit, autoRefresh: true })
}

// Hook for fetching all news
export function useAllNews(limit: number = 20) {
  return useNews({ limit, autoRefresh: true })
}
