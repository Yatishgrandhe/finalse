'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import NewsCard from '../components/NewsCard'
import { News } from '../lib/convex'

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showHighlighted, setShowHighlighted] = useState(false)

  // Mock news data for build compatibility
  const news: News[] = [
    {
      _id: '1',
      title: 'Market Update: Tech Stocks Rally',
      summary: 'Technology stocks show strong performance in today\'s trading session',
      content: 'Full article content about tech stock rally...',
      source: 'Financial Times',
      publishedAt: Date.now(),
      url: '#',
      symbols: ['AAPL', 'MSFT'],
      category: 'market',
      isHighlighted: true,
      metadata: { image: '/logo.png' }
    },
    {
      _id: '2',
      title: 'Federal Reserve Interest Rate Decision',
      summary: 'Fed maintains current interest rates amid economic uncertainty',
      content: 'Full article content about Fed decision...',
      source: 'Wall Street Journal',
      publishedAt: Date.now(),
      url: '#',
      symbols: ['SPY'],
      category: 'policy',
      isHighlighted: false,
      metadata: { image: '/logo.png' }
    }
  ]

  const categories = [
    'all',
    'market',
    'earnings',
    'mergers',
    'ipo',
    'crypto',
    'economy',
    'technology',
    'healthcare',
    'energy'
  ]

  const filteredNews = news || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial News</h1>
            <p className="text-gray-600">Stay updated with the latest market news and AI-highlighted insights</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="highlighted"
                  checked={showHighlighted}
                  onChange={(e) => setShowHighlighted(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="highlighted" className="text-sm font-medium text-gray-700">
                  AI Highlighted Only
                </label>
              </div>

              <div className="ml-auto text-sm text-gray-500">
                {filteredNews.length} articles found
              </div>
            </div>
          </div>

          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <NewsCard 
                  key={article._id}
                  article={article}
                  onClick={() => {
                    // Open article in new tab
                    window.open(article.url, '_blank')
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later for new articles.</p>
            </div>
          )}

          {/* Load More Button */}
          {filteredNews.length > 0 && (
            <div className="mt-8 text-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Load More Articles
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
