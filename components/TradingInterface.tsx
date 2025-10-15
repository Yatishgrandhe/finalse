'use client'

import { useState } from 'react'
import { useStockQuote } from '@/lib/hooks/useYahooFinance'
import { financeUtils } from '@/lib/yahoo-finance'

interface TradingInterfaceProps {
  symbol?: string
  onTrade?: (order: TradeOrder) => void
}

interface TradeOrder {
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop'
  quantity: number
  price?: number
  stopPrice?: number
}

export default function TradingInterface({ symbol = '', onTrade }: TradingInterfaceProps) {
  const [order, setOrder] = useState<TradeOrder>({
    symbol: symbol,
    side: 'buy',
    type: 'market',
    quantity: 100,
    price: 0,
    stopPrice: 0
  })

  const { quote, loading, error } = useStockQuote(order.symbol)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onTrade) {
      onTrade(order)
    }
    // Reset form
    setOrder({
      symbol: '',
      side: 'buy',
      type: 'market',
      quantity: 100,
      price: 0,
      stopPrice: 0
    })
  }

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrder({ ...order, symbol: e.target.value.toUpperCase() })
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 0
    setOrder({ ...order, quantity })
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0
    setOrder({ ...order, price })
  }

  const handleStopPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stopPrice = parseFloat(e.target.value) || 0
    setOrder({ ...order, stopPrice })
  }

  const estimatedCost = order.quantity * (order.price || quote?.regularMarketPrice || 0)

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      <h3 className="text-xl font-bold text-white mb-6">Trading Interface</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Symbol Input */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Stock Symbol
          </label>
          <input
            type="text"
            value={order.symbol}
            onChange={handleSymbolChange}
            placeholder="Enter symbol (e.g., AAPL)"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {quote && (
            <div className="mt-2 text-sm text-white/60">
              {quote.shortName || quote.longName} - {financeUtils.formatPrice(quote.regularMarketPrice || 0)}
              <span className={`ml-2 ${financeUtils.getChangeColor(quote.regularMarketChangePercent || 0)}`}>
                {financeUtils.formatPercentageChange(quote.regularMarketChangePercent || 0)}
              </span>
            </div>
          )}
        </div>

        {/* Order Type and Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Order Type
            </label>
            <select
              value={order.type}
              onChange={(e) => setOrder({ ...order, type: e.target.value as 'market' | 'limit' | 'stop' })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="market">Market Order</option>
              <option value="limit">Limit Order</option>
              <option value="stop">Stop Order</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Side
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setOrder({ ...order, side: 'buy' })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  order.side === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setOrder({ ...order, side: 'sell' })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  order.side === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50'
                }`}
              >
                Sell
              </button>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={order.quantity}
            onChange={handleQuantityChange}
            placeholder="100"
            min="1"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price (for Limit and Stop Orders) */}
        {(order.type === 'limit' || order.type === 'stop') && (
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {order.type === 'limit' ? 'Limit Price' : 'Stop Price'}
            </label>
            <input
              type="number"
              step="0.01"
              value={order.price || ''}
              onChange={order.type === 'limit' ? handlePriceChange : handleStopPriceChange}
              placeholder={order.type === 'limit' ? '150.00' : '145.00'}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {/* Estimated Cost */}
        {estimatedCost > 0 && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Estimated {order.side === 'buy' ? 'Cost' : 'Proceeds'}:</span>
              <span className="text-white font-bold">
                {financeUtils.formatPrice(estimatedCost)}
              </span>
            </div>
            <div className="text-sm text-white/60 mt-1">
              {order.quantity} shares × {financeUtils.formatPrice(order.price || quote?.regularMarketPrice || 0)}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !order.symbol || order.quantity <= 0}
          className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
            order.side === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-500'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
        >
          {loading ? 'Loading...' : `${order.side.toUpperCase()} ${order.quantity} ${order.symbol}`}
        </button>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <div className="text-red-300 text-sm">{error}</div>
          </div>
        )}
      </form>
    </div>
  )
}
