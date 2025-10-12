'use client'

import { usePopularSymbols, useMarketSummary } from '@/lib/hooks/useYahooFinance'
import StockQuote from './StockQuote'
import { financeUtils } from '@/lib/yahoo-finance'

export default function MarketOverview() {
  const { quotes: popularStocks, loading: stocksLoading, error: stocksError } = usePopularSymbols()
  const { marketSummary, loading: marketLoading, error: marketError } = useMarketSummary()

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      {marketSummary && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                S&P 500
              </div>
              <div className="text-lg font-semibold">
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
              <div className="text-sm text-gray-500">Market Status</div>
              <div className={`text-lg font-semibold ${
                marketSummary.marketState === 'REGULAR' ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketSummary.marketState === 'REGULAR' ? 'Open' : 'Closed'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date(marketSummary.regularMarketTime).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Gainers */}
      {topGainers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Gainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topGainers.map((stock) => (
              <div key={stock.symbol} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {stock.shortName || stock.longName || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {stock.regularMarketPrice ? 
                        financeUtils.formatPrice(stock.regularMarketPrice) : 'N/A'
                      }
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {stock.regularMarketChangePercent ? 
                        financeUtils.formatPercentageChange(stock.regularMarketChangePercent) : 'N/A'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Vol: {stock.regularMarketVolume ? financeUtils.formatVolume(stock.regularMarketVolume) : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Losers */}
      {topLosers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Losers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLosers.map((stock) => (
              <div key={stock.symbol} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {stock.shortName || stock.longName || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {stock.regularMarketPrice ? 
                        financeUtils.formatPrice(stock.regularMarketPrice) : 'N/A'
                      }
                    </div>
                    <div className="text-sm font-medium text-red-600">
                      {stock.regularMarketChangePercent ? 
                        financeUtils.formatPercentageChange(stock.regularMarketChangePercent) : 'N/A'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Vol: {stock.regularMarketVolume ? financeUtils.formatVolume(stock.regularMarketVolume) : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Active */}
      {mostActive.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Active</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mostActive.map((stock) => (
              <div key={stock.symbol} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{stock.symbol}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {stock.shortName || stock.longName || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
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
                <div className="text-xs text-gray-500">
                  Vol: {stock.regularMarketVolume ? financeUtils.formatVolume(stock.regularMarketVolume) : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error States */}
      {(stocksError || marketError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Error loading market data</div>
          <div className="text-red-600 text-sm mt-1">
            {stocksError || marketError}
          </div>
        </div>
      )}
    </div>
  )
}
