'use client'

import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

// Disable static generation for this page
export const dynamic = 'force-dynamic';
import AISuggestionCard from '../../components/AISuggestionCard'

export default function Trade() {
  const [searchSymbol, setSearchSymbol] = useState('')
  const [selectedStock, setSelectedStock] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])

  useEffect(() => {
    // TODO: Fetch AI recommendations from Convex
    const mockRecommendations = [
      { symbol: 'AAPL', recommendation: 'BUY', confidence: 85, price: 150.25, target: 165.00 },
      { symbol: 'GOOGL', recommendation: 'HOLD', confidence: 72, price: 2750.80, target: 2800.00 },
      { symbol: 'TSLA', recommendation: 'SELL', confidence: 68, price: 245.60, target: 220.00 },
      { symbol: 'MSFT', recommendation: 'BUY', confidence: 78, price: 350.20, target: 375.00 },
      { symbol: 'AMZN', recommendation: 'BUY', confidence: 82, price: 3200.50, target: 3400.00 },
    ]
    setAiRecommendations(mockRecommendations)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement stock search
    console.log('Searching for:', searchSymbol)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Trading & Recommendations
            </h1>
            <p className="text-gray-600">
              AI-powered trading insights and recommendations
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Search Stocks
            </h3>
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Search
              </button>
            </form>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              AI Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.map((rec, index) => (
                <AISuggestionCard
                  key={index}
                  symbol={rec.symbol}
                  recommendation={rec.recommendation}
                  confidence={rec.confidence}
                  price={rec.price}
                  target={rec.target}
                />
              ))}
            </div>
          </div>

          {/* Trading Interface */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Trading Interface
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Symbol
                </label>
                <input
                  type="text"
                  placeholder="AAPL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Market Order</option>
                  <option>Limit Order</option>
                  <option>Stop Order</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (for Limit Orders)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
                Buy
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                Sell
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
