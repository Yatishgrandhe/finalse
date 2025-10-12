'use client'

interface AISuggestionCardProps {
  symbol: string
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  price: number
  change?: number
  target?: number
  reasoning?: string
  timeframe?: string
}

export default function AISuggestionCard({ 
  symbol, 
  recommendation, 
  confidence, 
  price, 
  change, 
  target,
  reasoning,
  timeframe
}: AISuggestionCardProps) {
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SELL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600'
    if (conf >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{symbol}</h3>
          <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRecommendationColor(recommendation)}`}>
          {recommendation}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">AI Confidence:</span>
          <span className={`text-sm font-semibold ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </span>
        </div>

        {change !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Change:</span>
            <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        )}

        {target && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Target Price:</span>
            <span className="text-sm font-semibold text-blue-600">
              ${target.toFixed(2)}
            </span>
          </div>
        )}

        {timeframe && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Timeframe:</span>
            <span className="text-sm font-semibold text-gray-900">
              {timeframe}
            </span>
          </div>
        )}
      </div>

      {reasoning && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic">
            "{reasoning}"
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            View Analysis
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Trade
          </button>
        </div>
      </div>
    </div>
  )
}
