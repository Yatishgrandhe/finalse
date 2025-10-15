'use client'

import { useState } from 'react'
import { useStockQuote } from '@/lib/hooks/useYahooFinance'
import { addHolding } from '@/lib/supabase-functions'
import { useAuth } from '@/lib/auth-context-supabase'

interface PortfolioManagerProps {
  portfolioId: string
  onPositionAdded?: () => void
}

interface PositionForm {
  symbol: string
  shares: number
  averageCost: number
}

export default function PortfolioManager({ portfolioId, onPositionAdded }: PortfolioManagerProps) {
  const { user } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState<PositionForm>({
    symbol: '',
    shares: 0,
    averageCost: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { quote, loading } = useStockQuote(form.symbol)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      await addHolding({
        portfolioId,
        stockSymbol: form.symbol.toUpperCase(),
        shares: form.shares,
        averageCost: form.averageCost
      })
      
      // Reset form
      setForm({ symbol: '', shares: 0, averageCost: 0 })
      setShowAddForm(false)
      
      if (onPositionAdded) {
        onPositionAdded()
      }
    } catch (error) {
      console.error('Error adding position:', error)
      setError(error instanceof Error ? error.message : 'Failed to add position')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const symbol = e.target.value.toUpperCase()
    setForm({ ...form, symbol })
  }

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shares = parseInt(e.target.value) || 0
    setForm({ ...form, shares })
  }

  const handleAverageCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const averageCost = parseFloat(e.target.value) || 0
    setForm({ ...form, averageCost })
  }

  const totalValue = form.shares * (quote?.regularMarketPrice || form.averageCost)
  const totalCost = form.shares * form.averageCost
  const gainLoss = totalValue - totalCost
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Portfolio Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
        >
          {showAddForm ? 'Cancel' : 'Add Position'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Stock Symbol
              </label>
              <input
                type="text"
                value={form.symbol}
                onChange={handleSymbolChange}
                placeholder="AAPL"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {quote && (
                <div className="mt-1 text-xs text-white/60">
                  {quote.shortName} - ${(quote.regularMarketPrice || 0).toFixed(2)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Shares
              </label>
              <input
                type="number"
                value={form.shares || ''}
                onChange={handleSharesChange}
                placeholder="100"
                min="1"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Average Cost
              </label>
              <input
                type="number"
                step="0.01"
                value={form.averageCost || ''}
                onChange={handleAverageCostChange}
                placeholder="150.00"
                min="0"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Position Summary */}
          {form.shares > 0 && form.averageCost > 0 && (
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white/80 mb-2">Position Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Total Cost:</span>
                  <div className="text-white font-medium">
                    ${totalCost.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Current Value:</span>
                  <div className="text-white font-medium">
                    ${totalValue.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Gain/Loss:</span>
                  <div className={`font-medium ${gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${gainLoss.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-white/60">Gain/Loss %:</span>
                  <div className={`font-medium ${gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !form.symbol || form.shares <= 0 || form.averageCost <= 0}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Position
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
          <div className="text-white font-medium mb-1">Import Positions</div>
          <div className="text-white/60 text-sm">Upload CSV file</div>
        </button>
        <button className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
          <div className="text-white font-medium mb-1">Export Portfolio</div>
          <div className="text-white/60 text-sm">Download as CSV</div>
        </button>
        <button className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200">
          <div className="text-white font-medium mb-1">Rebalance</div>
          <div className="text-white/60 text-sm">Optimize allocation</div>
        </button>
      </div>
    </div>
  )
}
