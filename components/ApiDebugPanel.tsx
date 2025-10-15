'use client'

import { useState, useEffect } from 'react'
import { yahooFinanceCache } from '@/lib/yahoo-finance-cache'

export default function ApiDebugPanel() {
  const [cacheStats, setCacheStats] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(yahooFinanceCache.getStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm z-50"
      >
        Debug API
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-sm z-50 max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">API Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>Cache Size:</strong> {cacheStats?.size || 0}
        </div>
        
        <div>
          <strong>Total Requests:</strong> {cacheStats?.requestCount || 0}
        </div>
        
        <div>
          <strong>Requests Last Minute:</strong> {cacheStats?.requestsLastMinute || 0}
        </div>
        
        <div>
          <strong>Cache Entries:</strong>
          <div className="max-h-32 overflow-y-auto">
            {cacheStats?.entries?.map((entry: any, index: number) => (
              <div key={index} className="text-xs border-b border-gray-600 py-1">
                <div className="truncate">{entry.key}</div>
                <div className="text-gray-400">
                  Age: {Math.round(entry.age / 1000)}s | 
                  Expires: {Math.round(entry.expiresIn / 1000)}s
                </div>
              </div>
            )) || 'No entries'}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => yahooFinanceCache.clear()}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
          >
            Clear Cache
          </button>
          <button
            onClick={() => yahooFinanceCache.cleanup()}
            className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
          >
            Cleanup
          </button>
        </div>
      </div>
    </div>
  )
}
