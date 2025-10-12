'use client'

import { useState, useEffect } from 'react'

export default function PredictionChart() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // TODO: Fetch real chart data from Convex
    const mockData = [
      { date: '2024-01-01', price: 150.00, prediction: 155.00 },
      { date: '2024-01-02', price: 152.50, prediction: 157.00 },
      { date: '2024-01-03', price: 148.75, prediction: 153.50 },
      { date: '2024-01-04', price: 151.25, prediction: 156.00 },
      { date: '2024-01-05', price: 153.80, prediction: 158.50 },
      { date: '2024-01-06', price: 155.20, prediction: 160.00 },
      { date: '2024-01-07', price: 157.50, prediction: 162.00 },
    ]
    setChartData(mockData)
  }, [])

  return (
    <div className="h-64">
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-4">📈</div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Stock Prediction Chart
          </h4>
          <p className="text-gray-500 text-sm">
            Interactive chart with AI predictions coming soon
          </p>
          <div className="mt-4 text-xs text-gray-400">
            Will integrate with Recharts/Chart.js
          </div>
        </div>
      </div>
    </div>
  )
}
