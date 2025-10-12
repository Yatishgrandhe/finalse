'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import StockCard from '../components/StockCard'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [totalGainLoss, setTotalGainLoss] = useState(0)

  useEffect(() => {
    // TODO: Fetch portfolio data from Convex
    const mockPortfolio = [
      { symbol: 'AAPL', shares: 100, price: 150.25, value: 15025, gainLoss: 2500 },
      { symbol: 'GOOGL', shares: 50, price: 2750.80, value: 137540, gainLoss: 15000 },
      { symbol: 'TSLA', shares: 200, price: 245.60, value: 49120, gainLoss: -5000 },
      { symbol: 'MSFT', shares: 75, price: 350.20, value: 26265, gainLoss: 3200 },
    ]
    setPortfolio(mockPortfolio)
    setTotalValue(228950)
    setTotalGainLoss(15700)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portfolio Overview
            </h1>
            <p className="text-gray-600">
              Track your investments and performance
            </p>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Value
              </h3>
              <p className="text-3xl font-bold text-blue-900">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Gain/Loss
              </h3>
              <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Return
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {((totalGainLoss / (totalValue - totalGainLoss)) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Portfolio Holdings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Holdings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map((stock, index) => (
                <StockCard
                  key={index}
                  symbol={stock.symbol}
                  price={stock.price}
                  change={stock.gainLoss / stock.value * 100}
                  value={stock.value}
                  shares={stock.shares}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
