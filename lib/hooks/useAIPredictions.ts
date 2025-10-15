import { useState, useEffect, useCallback } from 'react'

export interface AIPrediction {
  id: string
  stockSymbol: string
  predictionType: 'buy' | 'sell' | 'hold'
  confidence: number
  targetPrice: number
  currentPrice: number
  reasoning: string
  timeframe: string
  createdAt: Date
  updatedAt: Date
}

interface UseAIPredictionsOptions {
  symbol?: string
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useAIPredictions(options: UseAIPredictionsOptions = {}) {
  const [predictions, setPredictions] = useState<AIPrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    symbol,
    limit = 10,
    autoRefresh = false,
    refreshInterval = 300000 // 5 minutes
  } = options

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString()
      })

      if (symbol) params.append('symbol', symbol)

      const response = await fetch(`/api/ai/predictions?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch AI predictions')
      }

      const formattedPredictions = data.data.map((prediction: any) => ({
        ...prediction,
        createdAt: new Date(prediction.createdAt),
        updatedAt: new Date(prediction.updatedAt)
      }))

      setPredictions(formattedPredictions)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching AI predictions:', errorMessage)
    } finally {
      setLoading(false)
    }
  }, [symbol, limit])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchPredictions()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchPredictions])

  // Filter predictions by type
  const getPredictionsByType = useCallback((type: 'buy' | 'sell' | 'hold') => {
    return predictions.filter(prediction => prediction.predictionType === type)
  }, [predictions])

  // Get high confidence predictions
  const getHighConfidencePredictions = useCallback((minConfidence: number = 0.7) => {
    return predictions.filter(prediction => prediction.confidence >= minConfidence)
  }, [predictions])

  // Get predictions by symbol
  const getPredictionsBySymbol = useCallback((symbol: string) => {
    return predictions.filter(prediction => prediction.stockSymbol === symbol)
  }, [predictions])

  // Get prediction statistics
  const getPredictionStats = useCallback(() => {
    const total = predictions.length
    const buy = predictions.filter(p => p.predictionType === 'buy').length
    const sell = predictions.filter(p => p.predictionType === 'sell').length
    const hold = predictions.filter(p => p.predictionType === 'hold').length
    const avgConfidence = total > 0 ? predictions.reduce((sum, p) => sum + p.confidence, 0) / total : 0

    return { total, buy, sell, hold, avgConfidence }
  }, [predictions])

  return {
    predictions,
    loading,
    error,
    refetch: fetchPredictions,
    clearError,
    getPredictionsByType,
    getHighConfidencePredictions,
    getPredictionsBySymbol,
    getPredictionStats
  }
}

// Hook for fetching predictions for a specific symbol
export function useStockPredictions(symbol: string, limit: number = 5) {
  return useAIPredictions({ symbol, limit, autoRefresh: true })
}

// Hook for fetching all predictions
export function useAllPredictions(limit: number = 20) {
  return useAIPredictions({ limit, autoRefresh: true })
}
