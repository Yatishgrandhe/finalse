'use client'

import { useState } from 'react'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import AISuggestionCard from '../../components/AISuggestionCard'
import TradingInterface from '../../components/TradingInterface'
import BrokerConnection from '../../components/BrokerConnection'
import { useAuth } from '../../lib/auth-context-supabase'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function Trade() {
  const { user } = useAuth()
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')

  // Mock AI recommendations
  const mockPredictions = [
    {
      id: '1',
      symbol: 'AAPL',
      recommendation: 'BUY' as const,
      confidence: 85,
      price: 175.50,
      target: 180.00,
      reasoning: 'Strong fundamentals and positive market sentiment'
    },
    {
      id: '2',
      symbol: 'GOOGL',
      recommendation: 'HOLD' as const,
      confidence: 72,
      price: 2750.80,
      target: 2800.00,
      reasoning: 'Stable performance with moderate growth potential'
    },
    {
      id: '3',
      symbol: 'TSLA',
      recommendation: 'SELL' as const,
      confidence: 68,
      price: 245.60,
      target: 220.00,
      reasoning: 'Market volatility and regulatory concerns'
    }
  ]

  const handleTrade = (order: any) => {
    console.log('Trade order:', order)
    // Handle trade execution
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-3 animate-pulse delay-500"></div>
        </div>

        <TopNavbar />
        <div className="flex relative z-10">
          <CollapsibleSidebar />
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Trading</h1>
              <p className="text-white/60 text-lg">Execute trades with AI-powered insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trading Interface */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Trade Execution</h2>
                  <TradingInterface 
                    symbol={selectedSymbol}
                    onTrade={handleTrade}
                  />
                </div>

                {/* Broker Connection */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Broker Connection</h2>
                  <BrokerConnection />
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockPredictions.map((prediction) => (
                      <AISuggestionCard
                        key={prediction.id}
                        symbol={prediction.symbol}
                        recommendation={prediction.recommendation}
                        confidence={prediction.confidence}
                        price={prediction.price}
                        target={prediction.target}
                        reasoning={prediction.reasoning}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 py-2 px-4 rounded-lg transition-colors">
                      Market Buy
                    </button>
                    <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded-lg transition-colors">
                      Market Sell
                    </button>
                    <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-4 rounded-lg transition-colors">
                      Limit Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}