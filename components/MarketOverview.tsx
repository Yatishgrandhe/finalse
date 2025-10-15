'use client'

import { usePopularSymbols, useMarketSummary } from '@/lib/hooks/useYahooFinance'
import StockQuote from './StockQuote'
import { financeUtils } from '@/lib/yahoo-finance'

interface MarketOverviewProps {
  className?: string
}

export default function MarketOverview({ className = "" }: MarketOverviewProps) {
  const { quotes: popularStocks, loading: stocksLoading, error: stocksError } = usePopularSymbols()
  const { marketSummary, loading: marketLoading, error: marketError } = useMarketSummary()

  // Debug logging
  console.log('MarketOverview - popularStocks:', popularStocks)
  console.log('MarketOverview - stocksLoading:', stocksLoading)
  console.log('MarketOverview - stocksError:', stocksError)
  console.log('MarketOverview - marketSummary:', marketSummary)
  console.log('MarketOverview - marketLoading:', marketLoading)
  console.log('MarketOverview - marketError:', marketError)

  const topGainers = popularStocks
    .filter(stock => (stock.regularMarketChangePercent || 0) > 0)
    .sort((a, b) => (b.regularMarketChangePercent || 0) - (a.regularMarketChangePercent || 0))
    .slice(0, 5)

  const topLosers = popularStocks
    .filter(stock => (stock.regularMarketChangePercent || 0) < 0)
    .sort((a, b) => (a.regularMarketChangePercent || 0) - (b.regularMarketChangePercent || 0))
    .slice(0, 5)

  const mostActive = popularStocks
    .sort((a, b) => (b.regularMarketVolume || 0) - (a.regularMarketVolume || 0))
    .slice(0, 5)

  if (stocksLoading || marketLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700/50 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-700/50 rounded"></div>
            <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700/50 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Display */}
      {(stocksError || marketError) && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <div className="text-red-300 font-medium">Error loading market data</div>
          <div className="text-red-200 text-sm mt-1">
            {stocksError || marketError}
          </div>
          <div className="mt-2">
            <a 
              href="/api/test-yahoo" 
              target="_blank" 
              className="text-blue-300 hover:text-blue-200 text-sm underline"
            >
              Test Yahoo Finance API
            </a>
          </div>
        </div>
      )}

      {/* Market Summary */}
      {marketSummary && (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                S&P 500
              </div>
              <div className="text-lg font-semibold text-white">
                {marketSummary.regularMarketPrice ? 
                  financeUtils.formatPrice(marketSummary.regularMarketPrice) : 'N/A'
                }
              </div>
              <div className={`text-sm font-medium ${
                financeUtils.getChangeColor(marketSummary.regularMarketChangePercent || 0)
              }`}>
                {marketSummary.regularMarketChangePercent ? 
                  financeUtils.formatPercentageChange(marketSummary.regularMarketChangePercent) : 'N/A'
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60">Market Status</div>
              <div className={`text-lg font-semibold ${
                marketSummary.marketState === 'REGULAR' ? 'text-green-400' : 'text-red-400'
              }`}>
                {marketSummary.marketState === 'REGULAR' ? 'Open' : 'Closed'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60">Last Updated</div>
              <div className="text-sm font-medium text-white">
                {new Date(marketSummary.regularMarketTime).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Gainers */}
      {topGainers.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Top Gainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-sm text-white/60 truncate">
                      {stock.shortName || stock.longName || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {stock.regularMarketPrice ? 
                        financeUtils.formatPrice(stock.regularMarketPrice) : 'N/A'
                      }
                    </div>
                    <div className="text-sm font-medium text-green-400">
                      {stock.regularMarketChangePercent ? 
                        financeUtils.formatPercentageChange(stock.regularMarketChangePercent) : 'N/A'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/50">
                  Vol: {stock.regularMarketVolume ? financeUtils.formatVolume(stock.regularMarketVolume) : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Losers */}
      {topLosers.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Top Losers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-sm text-white/60 truncate">
                      {stock.shortName || stock.longName || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {stock.regularMarketPrice ? 
                        financeUtils.formatPrice(stock.regularMarketPrice) : 'N/A'
                      }
                    </div>
                    <div className="text-sm font-medium text-red-400">
                      {stock.regularMarketChangePercent ? 
                        financeUtils.formatPercentageChange(stock.regularMarketChangePercent) : 'N/A'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/50">
                  Vol: {stock.regularMarketVolume ? financeUtils.formatVolume(stock.regularMarketVolume) : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Active */}
      {mostActive.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Most Active</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostActive.map((stock) => (
              <div key={stock.symbol} className="border border-slate-600/50 rounded-lg p-4 bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-sm text-white/60 truncate">
                      {stock.shortName || stock.longName || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      {stock.regularMarketPrice ? 
                        financeUtils.formatPrice(stock.regularMarketPrice) : 'N/A'
                      }
                    </div>
                    <div className={`text-sm font-medium ${
                      financeUtils.getChangeColor(stock.regularMarketChangePercent || 0)
                    }`}>
                      {stock.regularMarketChangePercent ? 
                        financeUtils.formatPercentageChange(stock.regularMarketChangePercent) : 'N/A'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-xs text-white/50">
                  Vol: {stock.regularMarketVolume ? financeUtils.formatVolume(stock.regularMarketVolume) : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!stocksLoading && !marketLoading && !stocksError && !marketError && popularStocks.length === 0 && !marketSummary && (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-12 text-center border border-slate-700/50">
          <div className="text-white/40 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No market data available</h3>
          <p className="text-white/60 mb-4">Unable to load market data at this time.</p>
          <div className="space-y-2">
            <a 
              href="/api/test-yahoo" 
              target="_blank" 
              className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 text-sm"
            >
              Test Yahoo Finance API
            </a>
            <div className="text-white/40 text-xs">
              Check browser console for detailed error information
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
