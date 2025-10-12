'use client'

interface StockCardProps {
  symbol: string
  price: number
  change: number
  value?: number
  shares?: number
}

export default function StockCard({ symbol, price, change, value, shares }: StockCardProps) {
  const isPositive = change >= 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{symbol}</h3>
          <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>

      {value && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Value:</span>
            <span className="font-medium">${value.toLocaleString()}</span>
          </div>
          {shares && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shares:</span>
              <span className="font-medium">{shares}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}
