'use client'

import { useState, useEffect, useCallback } from 'react'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import StockCard from '../../components/StockCard'
import PredictionChart from '../../components/PredictionChart'
import AISuggestionCard from '../../components/AISuggestionCard'
import MarketStatusComponent from '../../components/MarketStatus'
import BrokerConnection from '../../components/BrokerConnection'
import { useAuth } from '../../lib/auth-context-supabase'
import { getUserBookmarkedStocks, disconnectRobinhood, removeBookmarkedStock, getSnapTradeAuth, disconnectSnapTrade, updateSnapTradeSyncTime } from '../../lib/supabase-functions'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [bookmarkedStocks, setBookmarkedStocks] = useState<any[]>([])
  const [snaptradeHoldings, setSnaptradeHoldings] = useState<any[]>([])
  const [snaptradeConnected, setSnaptradeConnected] = useState(false)
  const [isLoadingSnapTrade, setIsLoadingSnapTrade] = useState(false)
  const [snaptradeError, setSnaptradeError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load SnapTrade data
  const loadSnapTradeData = useCallback(async () => {
    if (!user) return
    
    setIsLoadingSnapTrade(true)
    setSnaptradeError(null)
    
    try {
      const snaptradeAuth = await getSnapTradeAuth(user.id)
      
      if (snaptradeAuth?.snaptrade_auth_id && snaptradeAuth.snaptrade_connected) {
        setSnaptradeConnected(true)
        
        // Fetch holdings from SnapTrade API
        const response = await fetch(`/api/snaptrade/holdings?authorizationId=${snaptradeAuth.snaptrade_auth_id}`)
        const data = await response.json()
        
        if (data.success) {
          setSnaptradeHoldings(data.holdings || [])
          // Update sync time
          await updateSnapTradeSyncTime(user.id)
        } else {
          setSnaptradeError('Failed to load portfolio data from broker')
        }
      } else {
        setSnaptradeConnected(false)
        setSnaptradeHoldings([])
      }
    } catch (error) {
      console.error('Error loading SnapTrade data:', error)
      setSnaptradeError('Unable to load portfolio data from broker')
      setSnaptradeConnected(false)
    } finally {
      setIsLoadingSnapTrade(false)
    }
  }, [user])

  // Load user data and bookmarked stocks
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setUserData(user)
          const bookmarks = await getUserBookmarkedStocks(user.id)
          setBookmarkedStocks(bookmarks || [])
          
          // Load SnapTrade data
          await loadSnapTradeData()
        } catch (error) {
          console.error('Error loading data:', error)
          setError('Failed to load user data')
        }
      }
      setLoading(false)
    }

    loadData()
  }, [user, loadSnapTradeData])

  // Handle OAuth callback parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const brokerConnected = urlParams.get('broker_connected')
    const brokerError = urlParams.get('broker_error')
    const authorizationId = urlParams.get('authorization_id')
    const error = urlParams.get('error')

    if (brokerConnected === 'true' && authorizationId) {
      console.log('SnapTrade OAuth successful:', authorizationId)
      // Reload SnapTrade data to show new connection
      loadSnapTradeData()
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (brokerError === 'true') {
      console.error('SnapTrade OAuth failed:', error)
      setSnaptradeError(error || 'Failed to connect broker')
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [loadSnapTradeData])

  // Mock data for now (replace with real API calls)
  const mockNews = [
    {
      id: '1',
      title: 'Market Analysis: Tech Stocks Surge',
      summary: 'Technology stocks show strong performance this quarter',
      publishedAt: new Date().toISOString(),
      sentiment: 'positive'
    }
  ]

  const mockPredictions = [
    {
      id: '1',
      stockSymbol: 'AAPL',
      prediction: 'BUY',
      confidence: 85,
      targetPrice: 150.25,
      reasoning: 'Strong fundamentals and positive market sentiment'
    },
    {
      id: '2',
      stockSymbol: 'GOOGL',
      prediction: 'HOLD',
      confidence: 72,
      targetPrice: 2750.80,
      reasoning: 'Stable performance with moderate growth potential'
    },
    {
      id: '3',
      stockSymbol: 'TSLA',
      prediction: 'SELL',
      confidence: 68,
      targetPrice: 245.60,
      reasoning: 'Market volatility and regulatory concerns'
    }
  ]

  // Calculate portfolio metrics
  const snaptradeTotalValue = snaptradeHoldings.reduce((sum, holding) => sum + (holding.marketValue || 0), 0)
  const snaptradeTotalGainLoss = snaptradeHoldings.reduce((sum, holding) => sum + (holding.gainLoss || 0), 0)
  
  // Show "not connected" when no broker is connected
  const portfolioValue = snaptradeConnected && snaptradeHoldings.length > 0 
    ? snaptradeTotalValue 
    : null // Will show "Not Connected" instead of mock data
  const todayGainLoss = snaptradeConnected && snaptradeHoldings.length > 0 
    ? snaptradeTotalGainLoss 
    : null // Will show "Not Connected" instead of mock data
  const aiSuggestionsCount = mockPredictions?.length || 12

  const handleDisconnectRobinhood = async () => {
    if (userData) {
      try {
        await disconnectRobinhood(userData.id)
        setUserData({ ...userData, robinhoodConnected: false })
      } catch (error) {
        console.error('Error disconnecting Robinhood:', error)
      }
    }
  }

  const handleRemoveBookmark = async (stockSymbol: string) => {
    if (userData) {
      try {
        await removeBookmarkedStock(userData.id, stockSymbol)
        setBookmarkedStocks(prev => prev.filter(bookmark => bookmark.stock_symbol !== stockSymbol))
      } catch (error) {
        console.error('Error removing bookmark:', error)
      }
    }
  }

  const handleDisconnectSnapTrade = async () => {
    if (userData) {
      try {
        await disconnectSnapTrade(userData.id)
        setSnaptradeConnected(false)
        setSnaptradeHoldings([])
        setSnaptradeError(null)
      } catch (error) {
        console.error('Error disconnecting SnapTrade:', error)
      }
    }
  }

  const handleRefreshSnapTrade = async () => {
    await loadSnapTradeData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
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
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.name || 'User'}!
                  </h1>
                  <p className="text-white/60 text-lg">
                    Here&apos;s your financial overview and AI-powered insights.
                  </p>
                </div>
                <MarketStatusComponent className="w-80" />
              </div>
            </div>

            {/* Portfolio Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-blue-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Portfolio Value</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {portfolioValue !== null ? `$${portfolioValue.toLocaleString()}` : 'Not Connected'}
                </p>
                <div className="mt-2 text-sm text-green-400">
                  <span className="flex items-center">
                    <span className="mr-1">↗</span>
                    {snaptradeConnected ? 'Live data' : 'Connect broker to view'}
                  </span>
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-green-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Today&apos;s P&L</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500">
                    <span className="text-white text-lg">📈</span>
                  </div>
                </div>
                <p className="text-2xl font-bold transition-colors text-green-400 group-hover:text-green-300">
                  {todayGainLoss !== null ? `+$${todayGainLoss.toLocaleString()}` : 'Not Connected'}
                </p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">⏰</span>
                    {snaptradeConnected ? 'Live updates' : 'Connect broker to view'}
                  </span>
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-orange-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">AI Signals</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                  {aiSuggestionsCount}
                </p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">✨</span>
                    Fresh insights
                  </span>
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-700/50 hover:border-purple-500/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Active Positions</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📊</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                  8
                </p>
                <div className="mt-2 text-sm text-white/60">
                  <span className="flex items-center">
                    <span className="mr-1">📈</span>
                    Diversified
                  </span>
                </div>
              </div>
            </div>

            {/* SnapTrade Connection Status */}
            {userData && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Broker Connection</h3>
                {snaptradeConnected ? (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-green-300 font-semibold">Connected to Broker</h4>
                        <p className="text-green-200/80 text-sm">
                          Portfolio synced via SnapTrade
                        </p>
                        <p className="text-green-200/60 text-xs">
                          Holdings: {snaptradeHoldings.length} positions
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleRefreshSnapTrade}
                          disabled={isLoadingSnapTrade}
                          className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm disabled:opacity-50"
                        >
                          {isLoadingSnapTrade ? 'Syncing...' : 'Sync Now'}
                        </button>
                      <button 
                          onClick={handleDisconnectSnapTrade}
                        className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
                        Disconnect
                      </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-orange-300 font-semibold">No Broker Connected</h4>
                        <p className="text-orange-200/80 text-sm">
                          Connect your broker account to sync live portfolio data
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          // This will be handled by the BrokerConnection component
                          const brokerSection = document.getElementById('broker-connection-section')
                          if (brokerSection) {
                            brokerSection.scrollIntoView({ behavior: 'smooth' })
                          }
                        }}
                        className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors text-sm"
                      >
                        Connect Broker
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Holdings - Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* SnapTrade Portfolio Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Live Portfolio</h3>
                  <div className="flex items-center space-x-2">
                    {snaptradeConnected && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                        Live Data
                      </span>
                    )}
                    <span className="text-white/60 text-sm">
                      {snaptradeConnected ? `${snaptradeHoldings.length} positions` : 'No broker connected'}
                    </span>
                  </div>
                </div>

                {snaptradeError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                    <p className="text-red-300 text-sm">{snaptradeError}</p>
                  </div>
                )}

                {isLoadingSnapTrade ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="ml-3 text-white/80">Loading portfolio data...</span>
                  </div>
                ) : snaptradeConnected && snaptradeHoldings.length > 0 ? (
                  <div className="space-y-4">
                    {snaptradeHoldings.slice(0, 6).map((holding: any) => (
                      <div key={holding.symbol} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{holding.symbol}</h4>
                          <div className={`text-sm font-medium ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Shares:</span>
                            <div className="text-white font-medium">{holding.quantity || 0}</div>
                          </div>
                          <div>
                            <span className="text-white/60">Value:</span>
                            <div className="text-white font-medium">${(holding.marketValue || 0).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4 opacity-50">📊</div>
                    <p className="text-white/60 mb-2">No stock profile data</p>
                    <p className="text-white/40 text-sm">Connect your broker to see live portfolio</p>
                  </div>
                )}
              </div>

              {/* Bookmarked Stocks Section */}
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Bookmarked Stocks</h3>
                  <span className="text-white/60 text-sm">{bookmarkedStocks.length} stocks</span>
                </div>

                {bookmarkedStocks && bookmarkedStocks.length > 0 ? (
                  <div className="space-y-4">
                    {bookmarkedStocks.slice(0, 6).map((bookmark: any) => (
                      <div key={bookmark.id} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{bookmark.stock_symbol}</h4>
                          <button 
                            onClick={() => handleRemoveBookmark(bookmark.stock_symbol)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                          </button>
                        </div>
                        <p className="text-white/70 text-sm mb-2">{bookmark.stock_name}</p>
                        {bookmark.notes && (
                          <p className="text-white/60 text-xs mb-2">{bookmark.notes}</p>
                        )}
                        {bookmark.target_price && (
                          <p className="text-green-400 text-xs">Target: ${bookmark.target_price}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4 opacity-50">⭐</div>
                    <p className="text-white/60 mb-2">No bookmarked stocks</p>
                    <p className="text-white/40 text-sm">Add stocks to your watchlist</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legacy Bookmarked Stocks Section - Remove this */}
            {false && bookmarkedStocks && bookmarkedStocks.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Bookmarked Stocks</h3>
                  <span className="text-white/60 text-sm">{bookmarkedStocks.length} stocks</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedStocks.slice(0, 6).map((bookmark: any) => (
                    <div key={bookmark.id} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{bookmark.stock_symbol}</h4>
                        <button 
                          onClick={() => handleRemoveBookmark(bookmark.stock_symbol)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                          </svg>
                        </button>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{bookmark.stock_name}</p>
                      {bookmark.notes && (
                        <p className="text-white/60 text-xs mb-2">{bookmark.notes}</p>
                      )}
                      {bookmark.target_price && (
                        <p className="text-green-400 text-xs">Target: ${bookmark.target_price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Performance and Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Portfolio Performance</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📊</span>
                  </div>
                </div>
                <div className="h-64">
                  <PredictionChart />
                </div>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 hover:border-green-500/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Market Overview</h3>
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">📈</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">S&P</span>
                      </div>
                      <span className="text-white font-medium">S&P 500</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">4,567.89</div>
                      <div className="text-green-400 text-sm">+1.2%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">DOW</span>
                      </div>
                      <span className="text-white font-medium">Dow Jones</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">34,567.89</div>
                      <div className="text-red-400 text-sm">-0.8%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">NAS</span>
                      </div>
                      <span className="text-white font-medium">NASDAQ</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">14,567.89</div>
                      <div className="text-green-400 text-sm">+2.1%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Broker Connection Section */}
            {!snaptradeConnected && (
              <div id="broker-connection-section" className="mb-8">
                <BrokerConnection 
                  onConnectionSuccess={(authorizationId) => {
                    console.log('Broker connected successfully:', authorizationId)
                    // Reload SnapTrade data
                    loadSnapTradeData()
                  }}
                  onConnectionError={(error) => {
                    console.error('Broker connection error:', error)
                    setSnaptradeError(error)
                  }}
                />
              </div>
            )}

            {/* AI Recommendations */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <span className="text-white/60 text-sm">Powered by AI</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPredictions.map((prediction) => (
                  <AISuggestionCard
                    key={prediction.id}
                    symbol={prediction.stockSymbol}
                    recommendation={prediction.prediction as 'BUY' | 'SELL' | 'HOLD'}
                    confidence={prediction.confidence}
                    price={prediction.targetPrice || 0}
                    target={prediction.targetPrice}
                    reasoning={prediction.reasoning}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}