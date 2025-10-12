'use client'

import { useState } from 'react'
import { YahooSearchResult } from '@/lib/yahoo-finance'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import StockSearch from '../components/StockSearch'
import StockQuote from '../components/StockQuote'
import MarketOverview from '../components/MarketOverview'

export default function MarketPage() {
  const [selectedStock, setSelectedStock] = useState<YahooSearchResult | null>(null)

  const handleSymbolSelect = (symbol: YahooSearchResult) => {
    setSelectedStock(symbol)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Overview</h1>
            <p className="text-gray-600">
              Real-time market data, stock quotes, and market analysis powered by Yahoo Finance
            </p>
          </div>

          {/* Stock Search */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Stocks</h2>
              <StockSearch
                onSymbolSelect={handleSymbolSelect}
                placeholder="Search for any stock symbol..."
                className="max-w-md"
              />
              {selectedStock && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
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

          {/* Selected Stock Details */}
          {selectedStock && (
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Stock Details: {selectedStock.symbol}
                </h2>
                <StockQuote
                  quote={{
                    symbol: selectedStock.symbol,
                    shortName: selectedStock.shortName,
                    longName: selectedStock.longName,
                    exchange: selectedStock.exchange,
                    type: selectedStock.type,
                    regularMarketPrice: 0,
                    regularMarketChange: 0,
                    regularMarketChangePercent: 0,
                    regularMarketVolume: 0,
                    marketCap: 0,
                    currency: 'USD',
                    regularMarketTime: new Date(),
                    regularMarketPreviousClose: 0,
                    regularMarketOpen: 0,
                    regularMarketDayHigh: 0,
                    regularMarketDayLow: 0,
                    fiftyTwoWeekHigh: 0,
                    fiftyTwoWeekLow: 0,
                    averageDailyVolume3Month: 0,
                    averageDailyVolume10Day: 0,
                    priceToBook: 0,
                    priceToEarnings: 0,
                    earningsPerShare: 0,
                    dividendYield: 0,
                    sector: '',
                    industry: ''
                  }}
                  showDetails={true}
                />
              </div>
            </div>
          )}

          {/* API Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Integration</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                This market overview is powered by the Yahoo Finance API through the yahoo-finance2 library. 
                It provides real-time stock quotes, historical data, market summaries, and more.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">API Endpoints</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li><code>/api/stocks</code> - Get stock quotes</li>
                    <li><code>/api/stocks/historical</code> - Historical data</li>
                    <li><code>/api/stocks/search</code> - Search symbols</li>
                    <li><code>/api/stocks/trending</code> - Trending tickers</li>
                    <li><code>/api/stocks/news</code> - Stock news</li>
                    <li><code>/api/market</code> - Market summary</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Example</h3>
                <pre className="text-sm text-gray-700 overflow-x-auto">
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
  )
}
