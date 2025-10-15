'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import StockCard from '../../components/StockCard'
import PortfolioManager from '../../components/PortfolioManager'
import BrokerConnection from '../../components/BrokerConnection'
import PortfolioSync from '../../components/PortfolioSync'
import { useAuth } from '../../lib/auth-context-supabase'
import { getUserPortfolios, getPortfolioHoldings } from '../../lib/supabase-functions'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function Portfolio() {
  const { user } = useAuth()
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [holdings, setHoldings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user portfolios and holdings
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const userPortfolios = await getUserPortfolios(user.id)
          setPortfolios(userPortfolios || [])
          
          if (userPortfolios && userPortfolios.length > 0) {
            const portfolioHoldings = await getPortfolioHoldings(userPortfolios[0].id)
            setHoldings(portfolioHoldings || [])
          }
        } catch (error) {
          console.error('Error loading portfolio data:', error)
          setError('Failed to load portfolio data')
        }
      }
      setLoading(false)
    }

    loadData()
  }, [user])

  // Mock data for demonstration
  const mockHoldings = [
    {
      id: '1',
      stockSymbol: 'AAPL',
      stockName: 'Apple Inc.',
      shares: 10,
      averageCost: 150.00,
      currentValue: 175.50,
      gainLoss: 255.00,
      gainLossPercent: 17.0
    },
    {
      id: '2',
      stockSymbol: 'GOOGL',
      stockName: 'Alphabet Inc.',
      shares: 5,
      averageCost: 2500.00,
      currentValue: 2750.00,
      gainLoss: 1250.00,
      gainLossPercent: 10.0
    },
    {
      id: '3',
      stockSymbol: 'TSLA',
      stockName: 'Tesla Inc.',
      shares: 8,
      averageCost: 200.00,
      currentValue: 180.00,
      gainLoss: -160.00,
      gainLossPercent: -10.0
    }
  ]

  const displayHoldings = holdings.length > 0 ? holdings : mockHoldings
  const totalValue = displayHoldings.reduce((sum, holding) => sum + (holding.current_value || holding.currentValue), 0)
  const totalGainLoss = displayHoldings.reduce((sum, holding) => sum + (holding.gain_loss || holding.gainLoss), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading portfolio...</div>
      </div>
    )
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
              <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
              <p className="text-white/60 text-lg">Manage your investments and track performance</p>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-blue-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total Value</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  ${totalValue.toLocaleString()}
                </p>
                <div className="mt-2 text-sm text-green-400">
                  <span className="flex items-center">
                    <span className="mr-1">↗</span>
                    +{((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(1)}% total
                  </span>
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-green-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total P&L</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500">
                    <span className="text-white text-lg">📈</span>
                  </div>
                </div>
                <p className={`text-2xl font-bold transition-colors ${totalGainLoss >= 0 ? 'text-green-400 group-hover:text-green-300' : 'text-red-400 group-hover:text-red-300'}`}>
                  {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
                </p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">📊</span>
                    {displayHoldings.length} positions
                  </span>
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-orange-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Best Performer</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🏆</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                  {displayHoldings.length > 0 ? displayHoldings.reduce((best, holding) => 
                    (holding.gain_loss_percent || holding.gainLossPercent) > (best.gain_loss_percent || best.gainLossPercent) ? holding : best
                  ).stock_symbol || displayHoldings.reduce((best, holding) => 
                    holding.gainLossPercent > best.gainLossPercent ? holding : best
                  ).stockSymbol : 'N/A'}
                </p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">📈</span>
                    Top gainer
                  </span>
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-purple-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Diversification</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                  {new Set(displayHoldings.map(h => h.stock_symbol || h.stockSymbol)).size}
                </p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">🏢</span>
                    Unique stocks
                  </span>
                </div>
              </div>
            </div>

            {/* Broker Connection */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Broker Connection</h2>
              <BrokerConnection />
            </div>

            {/* Portfolio Holdings */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Holdings</h2>
                <button className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors">
                  Add Position
                </button>
              </div>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayHoldings.map((holding) => (
                  <StockCard
                    key={holding.id}
                    symbol={holding.stock_symbol || holding.stockSymbol}
                    name={holding.stock_name || holding.stockName}
                    price={holding.current_value / (holding.shares || 1) || holding.currentValue / holding.shares}
                    change={holding.gain_loss || holding.gainLoss}
                    changePercent={holding.gain_loss_percent || holding.gainLossPercent}
                    value={holding.current_value || holding.currentValue}
                    shares={holding.shares}
                    showBookmark={true}
                  />
                ))}
              </div>
            </div>

            {/* Portfolio Management */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Portfolio Management</h2>
              <PortfolioManager portfolioId={portfolios[0]?.id || 'default'} />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}