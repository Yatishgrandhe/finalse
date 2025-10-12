'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import StockCard from '../components/StockCard'
import PredictionChart from '../components/PredictionChart'
import AISuggestionCard from '../components/AISuggestionCard'
import { DashboardData, Prediction, News, Stock } from '../lib/convex'

export default function Dashboard() {
  // Mock user ID - in real app, get from authentication
  const userId = "user_123" as any
  
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Portfolio Value
              </h3>
              <p className="text-3xl font-bold text-blue-900">
                ${portfolioValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Today&apos;s Gain/Loss
              </h3>
              <p className={`text-3xl font-bold ${todayGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {todayGainLoss >= 0 ? '+' : ''}${todayGainLoss.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                AI Recommended Stocks
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {aiSuggestionsCount}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Stock Trends
              </h3>
              <PredictionChart />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Option Strategies
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Options chart coming soon...
              </div>
            </div>
          </div>

          {/* AI Suggestions Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              AI Recommendations
            </h3>
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
