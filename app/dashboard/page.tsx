'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import StockCard from '../../components/StockCard'
import PredictionChart from '../../components/PredictionChart'
import AISuggestionCard from '../../components/AISuggestionCard'
import { DashboardData, Prediction, News, Stock } from '../../lib/convex'
import { useAuth } from '../../lib/auth-context'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }
  
  // Mock dashboard data for build compatibility
  const dashboardData: DashboardData = {
    portfolio: {
      _id: '1',
      userId: 'user_123',
      name: 'Main Portfolio',
      totalValue: 125000,
      totalCost: 100000,
      totalGainLoss: 2500,
      totalGainLossPercent: 2.5,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      isDefault: true
    },
    holdings: [],
    predictions: [],
    news: [],
    watchlists: []
  }
  
  // Mock predictions data
  const predictions: Prediction[] = [
    {
      _id: '1',
      symbol: 'AAPL',
      predictionType: 'BUY',
      confidence: 0.85,
      targetPrice: 200,
      reasoning: 'Strong quarterly earnings',
      timeframe: '3 months',
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isActive: true
    }
  ]
  
  // Mock news data
  const news: News[] = [
    {
      _id: '1',
      title: 'Market Update',
      summary: 'Stock market shows positive trends',
      content: 'Full article content...',
      source: 'Financial News',
      publishedAt: Date.now(),
      url: '#',
      symbols: ['AAPL'],
      category: 'market',
      isHighlighted: true,
      metadata: { image: '/logo.png' }
    }
  ]
  
  // Mock stocks data
  const stocks: Stock[] = [
    {
      _id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 175.50,
      previousClose: 173.00,
      change: 2.50,
      changePercent: 1.45,
      volume: 50000000,
      marketCap: 2800000000000,
      lastUpdated: Date.now()
    }
  ]

  const portfolioValue = dashboardData?.portfolio?.totalValue || 0
  const todayGainLoss = dashboardData?.portfolio?.totalGainLoss || 0
  const aiSuggestionsCount = predictions?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>
      
      <Navbar />
      <div className="flex relative z-10">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-white/60 text-lg">Welcome back! Here&apos;s your financial overview.</p>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/80">
                  Total Portfolio Value
                </h3>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
                ${portfolioValue.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-green-400">
                <span className="flex items-center">
                  <span className="mr-1">↗</span>
                  +2.5% this month
                </span>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/80">
                  Today&apos;s Gain/Loss
                </h3>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  todayGainLoss >= 0 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}>
                  <span className="text-white text-xl">{todayGainLoss >= 0 ? '📈' : '📉'}</span>
                </div>
              </div>
              <p className={`text-3xl font-bold transition-colors ${
                todayGainLoss >= 0 
                  ? 'text-green-400 group-hover:text-green-300' 
                  : 'text-red-400 group-hover:text-red-300'
              }`}>
                {todayGainLoss >= 0 ? '+' : ''}${todayGainLoss.toLocaleString()}
              </p>
              <div className="mt-2 text-sm text-white/60">
                <span className="flex items-center">
                  <span className="mr-1">⏰</span>
                  Live updates
                </span>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white/80">
                  AI Recommended Stocks
                </h3>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🤖</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                {aiSuggestionsCount}
              </p>
              <div className="mt-2 text-sm text-white/60">
                <span className="flex items-center">
                  <span className="mr-1">✨</span>
                  Fresh insights
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Stock Trends
                </h3>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
              </div>
              <PredictionChart />
            </div>
            
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Option Strategies
                </h3>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">⚡</span>
                </div>
              </div>
              <div className="h-64 flex flex-col items-center justify-center text-white/60">
                <div className="text-6xl mb-4 opacity-50">📈</div>
                <p className="text-lg font-medium">Advanced Options Analysis</p>
                <p className="text-sm">Coming soon with AI-powered strategies</p>
              </div>
            </div>
          </div>

          {/* AI Suggestions Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                AI Recommendations
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <span className="text-white/60 text-sm">Powered by AI</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions && predictions.length > 0 ? (
                predictions.slice(0, 6).map((prediction) => (
                  <AISuggestionCard 
                    key={prediction._id}
                    symbol={prediction.symbol}
                    recommendation={prediction.predictionType.toUpperCase() as 'BUY' | 'SELL' | 'HOLD'}
                    confidence={prediction.confidence}
                    price={prediction.targetPrice || 0}
                    change={0} // TODO: Calculate change from current price
                    reasoning={prediction.reasoning}
                    timeframe={prediction.timeframe}
                  />
                ))
              ) : (
                // Fallback mock data
                <>
                  <AISuggestionCard 
                    symbol="AAPL"
                    recommendation="BUY"
                    confidence={85}
                    price={150.25}
                    change={2.5}
                  />
                  <AISuggestionCard 
                    symbol="GOOGL"
                    recommendation="HOLD"
                    confidence={72}
                    price={2750.80}
                    change={-1.2}
                  />
                  <AISuggestionCard 
                    symbol="TSLA"
                    recommendation="SELL"
                    confidence={68}
                    price={245.60}
                    change={-5.8}
                  />
                </>
              )}
            </div>
          </div>

          {/* Recent News */}
          {news && news.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Latest Financial News
              </h3>
              <div className="space-y-4">
                {news.slice(0, 3).map((article) => (
                  <div key={article._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{article.summary || article.content.substring(0, 150)}...</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
