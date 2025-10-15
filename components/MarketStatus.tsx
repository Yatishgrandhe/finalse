'use client'

import { useState, useEffect } from 'react'
import { 
  getMarketStatus, 
  getMarketStatusMessage, 
  getMarketStatusColor, 
  getMarketStatusBgColor,
  formatTimeUntilNextEvent,
  type MarketStatus 
} from '../lib/market-hours'

interface MarketStatusProps {
  className?: string
  showTimeUntil?: boolean
  compact?: boolean
}

export default function MarketStatusComponent({ 
  className = '', 
  showTimeUntil = true, 
  compact = false 
}: MarketStatusProps) {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update market status immediately
    setMarketStatus(getMarketStatus())
    
    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      setMarketStatus(getMarketStatus())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (!marketStatus) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-gray-400 text-sm">Loading market status...</span>
      </div>
    )
  }

  const statusMessage = getMarketStatusMessage(marketStatus)
  const statusColor = getMarketStatusColor(marketStatus)
  const statusBgColor = getMarketStatusBgColor(marketStatus)
  const timeUntilNext = formatTimeUntilNextEvent(marketStatus)

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${
          marketStatus.isOpen ? 'bg-green-400' : 
          marketStatus.isPreMarket || marketStatus.isAfterHours ? 'bg-yellow-400' : 
          'bg-red-400'
        }`}></div>
        <span className={`text-sm font-medium ${statusColor}`}>
          {statusMessage}
        </span>
      </div>
    )
  }

  return (
    <div className={`${statusBgColor} rounded-lg p-3 border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            marketStatus.isOpen ? 'bg-green-400' : 
            marketStatus.isPreMarket || marketStatus.isAfterHours ? 'bg-yellow-400' : 
            'bg-red-400'
          }`}></div>
          <div>
            <div className={`font-semibold ${statusColor}`}>
              {statusMessage}
            </div>
            {showTimeUntil && (
              <div className="text-xs text-white/60 mt-1">
                {timeUntilNext}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">
            {marketStatus.currentTime.toLocaleTimeString('en-US', {
              timeZone: 'America/New_York',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })} ET
          </div>
          <div className="text-xs text-white/40">
            {marketStatus.currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for using market status in other components
export function useMarketStatus() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null)

  useEffect(() => {
    // Update market status immediately
    setMarketStatus(getMarketStatus())
    
    // Update every minute
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return marketStatus
}
