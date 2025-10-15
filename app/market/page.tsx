'use client'

import { useState } from 'react'
import { YahooSearchResult } from '@/lib/yahoo-finance'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import StockSearch from '../../components/StockSearch'
import StockQuote from '../../components/StockQuote'
import MarketOverview from '../../components/MarketOverview'
import { useStockQuote } from '../../lib/hooks/useYahooFinance'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function MarketPage() {
  const [selectedStock, setSelectedStock] = useState<YahooSearchResult | null>(null)

  // Fetch real stock data for the selected symbol
  const { quote, loading: quoteLoading, error: quoteError } = useStockQuote(selectedStock?.symbol || '')

  const handleSymbolSelect = (symbol: YahooSearchResult) => {
    setSelectedStock(symbol)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-3 animate-pulse delay-500"></div>
        </div>
        
        <TopNavbar />
        <div className="flex relative z-10">
          <CollapsibleSidebar />
          <main className="flex-1 p-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Market Overview</h1>
              <p className="text-white/60 text-lg">
                Real-time market data, stock quotes, and market analysis powered by Yahoo Finance
              </p>
            </div>

            {/* Stock Search */}
            <div className="mb-8">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Search Stocks</h2>
                <StockSearch
                  onSymbolSelect={handleSymbolSelect}
                  placeholder="Search for any stock symbol..."
                  className="max-w-md"
                />
                {selectedStock && (
                  <div className="mt-4 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-sm text-blue-300">
                      Selected: <span className="font-semibold">{selectedStock.symbol}</span> - {selectedStock.shortName || selectedStock.longName}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Market Overview */}
            <div className="mb-8">
              <MarketOverview />
            </div>

            {/* Quick Market Stats */}
            <div className="mb-8">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Market Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">S&P 500</div>
                    <div className="text-white/60 text-sm">Market Index</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">NASDAQ</div>
                    <div className="text-white/60 text-sm">Tech Index</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">DOW</div>
                    <div className="text-white/60 text-sm">Industrial Index</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">VIX</div>
                    <div className="text-white/60 text-sm">Volatility Index</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Stock Details */}
            {selectedStock && (
              <div className="mb-8">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Stock Details: {selectedStock.symbol}
                  </h2>
                  
                  {/* Loading State */}
                  {quoteLoading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="ml-3 text-white/80">Loading stock data...</span>
                    </div>
                  )}

                  {/* Error State */}
                  {quoteError && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                      <div className="text-red-300 font-medium">Error loading stock data</div>
                      <div className="text-red-200 text-sm mt-1">{quoteError}</div>
                    </div>
                  )}

                  {/* Stock Quote */}
                  {quote && !quoteLoading && (
                    <StockQuote
                      quote={quote}
                      showDetails={true}
                    />
                  )}

                  {/* No Data State */}
                  {!quote && !quoteLoading && !quoteError && (
                    <div className="text-center py-8 text-white/60">
                      <div className="text-4xl mb-4 opacity-50">📊</div>
                      <p className="text-lg font-medium mb-2">No stock data available</p>
                      <p className="text-sm">Try searching for a different stock symbol</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* API Information */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-semibold text-white mb-4">About This Integration</h2>
              <div className="prose max-w-none">
                <p className="text-white/70 mb-4">
                  This market overview is powered by the Yahoo Finance API through the yahoo-finance2 library. 
                  It provides real-time stock quotes, historical data, market summaries, and more.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Features</h3>
                    <ul className="list-disc list-inside text-white/70 space-y-1">
                      <li>Real-time stock quotes</li>
                      <li>Historical price data</li>
                      <li>Market summaries</li>
                      <li>Stock search functionality</li>
                      <li>Trending tickers</li>
                      <li>Financial news</li>
                      <li>Options data</li>
                      <li>Earnings calendar</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">API Endpoints</h3>
                    <ul className="list-disc list-inside text-white/70 space-y-1">
                      <li><code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300">/api/stocks</code> - Get stock quotes</li>
                      <li><code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300">/api/stocks/historical</code> - Historical data</li>
                      <li><code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300">/api/stocks/search</code> - Search symbols</li>
                      <li><code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300">/api/stocks/trending</code> - Trending tickers</li>
                      <li><code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300">/api/stocks/news</code> - Stock news</li>
                      <li><code className="bg-slate-700/50 px-2 py-1 rounded text-blue-300">/api/market</code> - Market summary</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <h3 className="text-lg font-semibold text-white mb-2">Usage Example</h3>
                  <pre className="text-sm text-white/70 overflow-x-auto">
{`// Get stock quote
const response = await fetch('/api/stocks?symbol=AAPL');
const data = await response.json();

// Search for stocks
const searchResponse = await fetch('/api/stocks/search?q=Apple');
const searchData = await searchResponse.json();

// Get historical data
const historicalResponse = await fetch(
  '/api/stocks/historical?symbol=AAPL&period1=2024-01-01&period2=2024-12-31'
);
const historicalData = await historicalResponse.json();`}
                  </pre>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
