'use client'

import { useState } from 'react'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import NewsFilter from '../../components/NewsFilter'
import { useAuth } from '../../lib/auth-context-supabase'
import { useAllNews, useCategoryNews } from '../../lib/hooks/useNews'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function NewsPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showHighlighted, setShowHighlighted] = useState(false)

  // Fetch news data
  const { 
    articles: allNews, 
    loading: allNewsLoading, 
    error: allNewsError,
    hasMore,
    loadMore,
    refresh
  } = useAllNews(20)
  
  const { 
    articles: categoryNews, 
    loading: categoryNewsLoading 
  } = useCategoryNews(selectedCategory, 20)

  const news = selectedCategory === 'all' ? allNews : categoryNews
  const loading = selectedCategory === 'all' ? allNewsLoading : categoryNewsLoading

  const categories = [
    'all',
    'market',
    'earnings',
    'economy',
    'technology',
    'healthcare',
    'energy',
    'financial',
    'crypto'
  ]

  // Filter news based on AI highlighted preference
  const filteredNews = showHighlighted 
    ? news.filter(article => article.aiHighlighted)
    : news

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-3 animate-pulse delay-500"></div>
        </div>
        
        <TopNavbar />
        <div className="flex relative z-10">
          <CollapsibleSidebar />
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Financial News</h1>
              <p className="text-white/60 text-lg">Stay updated with the latest market news and AI-highlighted insights</p>
            </div>

            {/* Filters */}
            <NewsFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showHighlighted={showHighlighted}
              onHighlightedChange={setShowHighlighted}
              articleCount={filteredNews.length}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="ml-3 text-white/80">Loading news...</span>
              </div>
            )}

            {/* Error State */}
            {allNewsError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <div className="text-red-300 font-medium">Error loading news</div>
                <div className="text-red-200 text-sm mt-1">{allNewsError}</div>
                <button 
                  onClick={refresh}
                  className="mt-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* News Grid */}
            {!loading && filteredNews && filteredNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article) => (
                  <div key={article.id} className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
                    {article.aiHighlighted && (
                      <div className="flex items-center mb-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        <span className="text-xs text-yellow-400 font-medium">AI Highlighted</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                    <p className="text-white/70 text-sm mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                      <span>{article.source}</span>
                      <span>{article.publishedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        article.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        article.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {article.sentiment}
                      </span>
                      {article.symbol && (
                        <span className="text-xs text-blue-400 font-medium">{article.symbol}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && (
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-12 text-center border border-slate-700/50">
                <div className="text-white/40 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No news articles found</h3>
                <p className="text-white/60">Try adjusting your filters or check back later for new articles.</p>
              </div>
            )}

            {/* Load More Button */}
            {!loading && hasMore && filteredNews.length > 0 && (
              <div className="mt-8 text-center">
                <button 
                  onClick={loadMore}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:scale-105"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
