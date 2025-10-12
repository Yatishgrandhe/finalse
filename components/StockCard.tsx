'use client'

interface StockCardProps {
  symbol: string
  name?: string
  price: number
  change: number
  changePercent?: number
  marketCap?: number
  value?: number
  shares?: number
}

export default function StockCard({ symbol, name, price, change, changePercent, marketCap, value, shares }: StockCardProps) {
  const isPositive = change >= 0
  const changePercentage = changePercent || (change / price) * 100

  return (
    <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/30 relative overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{symbol}</h3>
            {name && (
              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{name}</p>
            )}
            <p className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors">
              ${price.toFixed(2)}
            </p>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${
            isPositive 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
              : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25'
          }`}>
            <span className="flex items-center">
              <span className="mr-1">{isPositive ? '↗' : '↘'}</span>
              {isPositive ? '+' : ''}{changePercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        {value && (
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60 group-hover:text-white/80 transition-colors">Value:</span>
              <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                ${value.toLocaleString()}
              </span>
            </div>
            {shares && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60 group-hover:text-white/80 transition-colors">Shares:</span>
                <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                  {shares.toLocaleString()}
                </span>
              </div>
            )}
            {marketCap && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60 group-hover:text-white/80 transition-colors">Market Cap:</span>
                <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                  ${(marketCap / 1e9).toFixed(1)}B
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/20">
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group">
            <span className="relative z-10">View Details</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
