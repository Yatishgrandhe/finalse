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
  const getRecommendationGradient = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return 'from-green-500 to-emerald-500'
      case 'SELL':
        return 'from-red-500 to-pink-500'
      case 'HOLD':
        return 'from-yellow-500 to-orange-500'
      default:
        return 'from-gray-500 to-slate-500'
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'BUY':
        return '📈'
      case 'SELL':
        return '📉'
      case 'HOLD':
        return '⏸️'
      default:
        return '❓'
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-400'
    if (conf >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceBarColor = (conf: number) => {
    if (conf >= 80) return 'from-green-500 to-emerald-500'
    if (conf >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/30 relative overflow-hidden">
      {/* AI Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">{symbol}</h3>
            </div>
            <p className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
              ${price.toFixed(2)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getRecommendationGradient(recommendation)} text-white shadow-lg relative overflow-hidden`}>
            <span className="relative z-10 flex items-center">
              <span className="mr-1">{getRecommendationIcon(recommendation)}</span>
              {recommendation}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>
        </div>

        {/* AI Confidence Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">AI Confidence:</span>
            <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
              {confidence}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getConfidenceBarColor(confidence)} transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-4">
          {change !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Change:</span>
              <span className={`text-sm font-bold flex items-center ${
                change >= 0 ? 'text-green-400 group-hover:text-green-300' : 'text-red-400 group-hover:text-red-300'
              } transition-colors`}>
                <span className="mr-1">{change >= 0 ? '↗' : '↘'}</span>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          )}

          {target && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Target Price:</span>
              <span className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                ${target.toFixed(2)}
              </span>
            </div>
          )}

          {timeframe && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Timeframe:</span>
              <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                {timeframe}
              </span>
            </div>
          )}
        </div>

        {/* AI Reasoning */}
        {reasoning && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-xl p-3">
              <p className="text-sm text-white/80 italic leading-relaxed">
                &ldquo;{reasoning}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 relative overflow-hidden group">
              <span className="relative z-10">View Analysis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group">
              <span className="relative z-10">Trade</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
