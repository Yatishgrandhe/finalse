'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import AISuggestionCard from '../../components/AISuggestionCard'
import { Prediction } from '../../lib/convex'

export default function AIPredictionsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all')
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')

  // Mock predictions data for build compatibility
  const predictions: Prediction[] = [
    {
      _id: '1',
      symbol: 'AAPL',
      predictionType: 'BUY',
      confidence: 0.85,
      targetPrice: 200,
      reasoning: 'Strong quarterly earnings and positive market sentiment',
      timeframe: '3 months',
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isActive: true
    }
  ]

  const timeframes = ['all', '1d', '1w', '1m', '3m', '1y']
  
  const filteredPredictions = predictions?.filter(prediction => 
    selectedTimeframe === 'all' || prediction.timeframe === selectedTimeframe
  ) || []

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case '1d': return '1 Day'
      case '1w': return '1 Week'
      case '1m': return '1 Month'
      case '3m': return '3 Months'
      case '1y': return '1 Year'
      default: return timeframe
    }
  }

  const getPredictionStats = () => {
    if (!predictions) return { total: 0, buy: 0, sell: 0, hold: 0 }
    
    const total = predictions.length
    const buy = predictions.filter(p => p.predictionType === 'buy').length
    const sell = predictions.filter(p => p.predictionType === 'sell').length
    const hold = predictions.filter(p => p.predictionType === 'hold').length
    
    return { total, buy, sell, hold }
  }

  const stats = getPredictionStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Predictions</h1>
            <p className="text-gray-600">AI-powered stock predictions and recommendations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Predictions</h3>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Buy Signals</h3>
              <p className="text-3xl font-bold text-green-600">{stats.buy}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Sell Signals</h3>
              <p className="text-3xl font-bold text-red-600">{stats.sell}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Hold Signals</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.hold}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Timeframe:</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe} value={timeframe}>
                      {getTimeframeLabel(timeframe)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Symbol:</label>
                <input
                  type="text"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL"
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="ml-auto text-sm text-gray-500">
                {filteredPredictions.length} predictions found
              </div>
            </div>
          </div>

          {/* Predictions Grid */}
          {filteredPredictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPredictions.map((prediction) => (
                <AISuggestionCard 
                  key={prediction._id}
                  symbol={prediction.symbol}
                  recommendation={prediction.predictionType.toUpperCase() as 'BUY' | 'SELL' | 'HOLD'}
                  confidence={prediction.confidence}
                  price={prediction.targetPrice || 0}
                  reasoning={prediction.reasoning}
                  timeframe={prediction.timeframe}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later for new predictions.</p>
            </div>
          )}

          {/* AI Model Info */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">AI Model Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Model Architecture</h4>
                <p className="text-sm text-gray-600">
                  Our AI predictions are powered by transformer-based time-series models fine-tuned on financial data, 
                  incorporating technical indicators, market sentiment, and historical patterns.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Confidence Scoring</h4>
                <p className="text-sm text-gray-600">
                  Confidence scores range from 0-100% and are based on model accuracy, market volatility, 
                  and historical performance for similar market conditions.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
