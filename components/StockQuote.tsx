'use client'

import { YahooQuote } from '@/lib/yahoo-finance'
import { financeUtils } from '@/lib/yahoo-finance'

interface StockQuoteProps {
  quote: YahooQuote
  showDetails?: boolean
  className?: string
}

export default function StockQuote({ 
  quote, 
  showDetails = false,
  className = ""
}: StockQuoteProps) {
  const {
    symbol,
    shortName,
    longName,
    regularMarketPrice,
    regularMarketChange,
    regularMarketChangePercent,
    regularMarketVolume,
    marketCap,
    exchange,
    regularMarketTime,
    regularMarketPreviousClose,
    regularMarketOpen,
    regularMarketDayHigh,
    regularMarketDayLow,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    priceToEarnings,
    dividendYield,
    sector,
    industry
  } = quote

  const changeColor = financeUtils.getChangeColor(regularMarketChangePercent || 0)
  const formattedPrice = regularMarketPrice ? financeUtils.formatPrice(regularMarketPrice) : 'N/A'
  const formattedChange = regularMarketChangePercent ? financeUtils.formatPercentageChange(regularMarketChangePercent) : 'N/A'
  const formattedVolume = regularMarketVolume ? financeUtils.formatVolume(regularMarketVolume) : 'N/A'
  const formattedMarketCap = marketCap ? financeUtils.formatVolume(marketCap) : 'N/A'

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {symbol}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {shortName || longName || 'N/A'}
          </p>
          {exchange && (
            <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {exchange}
            </span>
          )}
        </div>
        
        {/* Price and Change */}
        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-gray-900">
            {formattedPrice}
          </div>
          <div className={`text-sm font-medium ${changeColor}`}>
            {formattedChange}
          </div>
          {regularMarketChange !== undefined && (
            <div className={`text-xs ${changeColor}`}>
              {regularMarketChange >= 0 ? '+' : ''}{financeUtils.formatPrice(regularMarketChange)}
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-gray-500">Volume</span>
          <div className="text-sm font-medium text-gray-900">
            {formattedVolume}
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500">Market Cap</span>
          <div className="text-sm font-medium text-gray-900">
            ${formattedMarketCap}
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-4">
          {/* Price Range */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Day High:</span>
                <div className="font-medium">
                  {regularMarketDayHigh ? financeUtils.formatPrice(regularMarketDayHigh) : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Day Low:</span>
                <div className="font-medium">
                  {regularMarketDayLow ? financeUtils.formatPrice(regularMarketDayLow) : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">52W High:</span>
                <div className="font-medium">
                  {fiftyTwoWeekHigh ? financeUtils.formatPrice(fiftyTwoWeekHigh) : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">52W Low:</span>
                <div className="font-medium">
                  {fiftyTwoWeekLow ? financeUtils.formatPrice(fiftyTwoWeekLow) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Financial Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">P/E Ratio:</span>
                <div className="font-medium">
                  {priceToEarnings ? priceToEarnings.toFixed(2) : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Dividend Yield:</span>
                <div className="font-medium">
                  {dividendYield ? `${(dividendYield * 100).toFixed(2)}%` : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Previous Close:</span>
                <div className="font-medium">
                  {regularMarketPreviousClose ? financeUtils.formatPrice(regularMarketPreviousClose) : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Open:</span>
                <div className="font-medium">
                  {regularMarketOpen ? financeUtils.formatPrice(regularMarketOpen) : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          {(sector || industry) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Company Information</h4>
              <div className="space-y-2 text-sm">
                {sector && (
                  <div>
                    <span className="text-gray-500">Sector:</span>
                    <span className="ml-2 font-medium">{sector}</span>
                  </div>
                )}
                {industry && (
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <span className="ml-2 font-medium">{industry}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Last Updated */}
          {regularMarketTime && (
            <div className="text-xs text-gray-500 border-t pt-2">
              Last updated: {new Date(regularMarketTime).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
