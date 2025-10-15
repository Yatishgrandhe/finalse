'use client'

import { useState } from 'react'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import AISuggestionCard from '../../components/AISuggestionCard'
import { useAuth } from '../../lib/auth-context-supabase'
import { useAllPredictions, useStockPredictions } from '../../lib/hooks/useAIPredictions'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AIPredictionsPage() {
  const { user } = useAuth()
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all')
  const [selectedSymbol, setSelectedSymbol] = useState<string>('')

  // Fetch predictions data
  const { 
    predictions: allPredictions, 
    loading: allPredictionsLoading, 
    error: allPredictionsError,
    getPredictionStats,
    refetch: refetchAllPredictions
  } = useAllPredictions(20)
  
  const { 
    predictions: symbolPredictions, 
    loading: symbolPredictionsLoading 
  } = useStockPredictions(selectedSymbol, 10)

  const predictions = selectedSymbol ? symbolPredictions : allPredictions
  const loading = selectedSymbol ? symbolPredictionsLoading : allPredictionsLoading

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

  const stats = getPredictionStats()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-3 animate-pulse delay-500"></div>
        </div>
        
        <TopNavbar />
        <div className="flex relative z-10">
          <CollapsibleSidebar />
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">AI Predictions</h1>
              <p className="text-white/60 text-lg">AI-powered stock predictions and recommendations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-blue-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total Predictions</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">{stats.total}</p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">✨</span>
                    AI Generated
                  </span>
                </div>
              </div>
              
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-green-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Buy Signals</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📈</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">{stats.buy}</p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">↗</span>
                    Bullish
                  </span>
                </div>
              </div>
              
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-red-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Sell Signals</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📉</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors">{stats.sell}</p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">↘</span>
                    Bearish
                  </span>
                </div>
              </div>
              
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-yellow-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Hold Signals</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">⏸️</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">{stats.hold}</p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">⚖️</span>
                    Neutral
                  </span>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="ml-3 text-white/80">Loading AI predictions...</span>
              </div>
            )}

            {/* Error State */}
            {allPredictionsError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <div className="text-red-300 font-medium">Error loading predictions</div>
                <div className="text-red-200 text-sm mt-1">{allPredictionsError}</div>
                <button 
                  onClick={refetchAllPredictions}
                  className="mt-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Filters */}
            {!loading && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-slate-700/50">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-white/80">Timeframe:</label>
                    <select 
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timeframes.map((timeframe) => (
                        <option key={timeframe} value={timeframe} className="bg-slate-800">
                          {getTimeframeLabel(timeframe)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-white/80">Symbol:</label>
                    <input
                      type="text"
                      value={selectedSymbol}
                      onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., AAPL"
                      className="bg-slate-700/50 border border-slate-600/50 rounded-md px-3 py-1 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="ml-auto text-sm text-white/60">
                    {filteredPredictions?.length || 0} predictions found
                  </div>
                </div>
              </div>
            )}

            {/* Predictions Grid */}
            {!loading && filteredPredictions && filteredPredictions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPredictions.map((prediction) => (
                  <AISuggestionCard 
                    key={prediction.id}
                    symbol={prediction.stockSymbol}
                    recommendation={prediction.predictionType.toUpperCase() as 'BUY' | 'SELL' | 'HOLD'}
                    confidence={prediction.confidence * 100}
                    price={prediction.targetPrice}
                    reasoning={prediction.reasoning}
                    timeframe={prediction.timeframe}
                  />
                ))}
              </div>
            ) : !loading && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-12 text-center border border-slate-700/50">
                <div className="text-white/40 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No predictions found</h3>
                <p className="text-white/60">Try adjusting your filters or check back later for new predictions.</p>
              </div>
            )}

            {/* AI Model Info */}
            <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">AI Model Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-2">Model Architecture</h4>
                  <p className="text-sm text-white/70">
                    Our AI predictions are powered by transformer-based time-series models fine-tuned on financial data, 
                    incorporating technical indicators, market sentiment, and historical patterns.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">Confidence Scoring</h4>
                  <p className="text-sm text-white/70">
                    Confidence scores range from 0-100% and are based on model accuracy, market volatility, 
                    and historical performance for similar market conditions.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
