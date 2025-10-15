'use client'

import { useState } from 'react'

interface NewsFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  showHighlighted: boolean
  onHighlightedChange: (highlighted: boolean) => void
  articleCount: number
}

export default function NewsFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showHighlighted,
  onHighlightedChange,
  articleCount
}: NewsFilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">News Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors duration-200"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700/50 text-white/70 hover:bg-slate-600/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* AI Highlighted Filter */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="highlighted"
              checked={showHighlighted}
              onChange={(e) => onHighlightedChange(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-slate-700/50 border-slate-600/50 rounded focus:ring-blue-500"
            />
            <label htmlFor="highlighted" className="text-sm font-medium text-white/80">
              AI Highlighted Only
            </label>
            <span className="text-xs text-white/60">Show only articles with AI insights</span>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="text-sm text-white/60">
              {articleCount} articles found
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-slate-700/50 text-white/70 rounded text-sm hover:bg-slate-600/50 transition-colors duration-200">
                Sort by Date
              </button>
              <button className="px-3 py-1 bg-slate-700/50 text-white/70 rounded text-sm hover:bg-slate-600/50 transition-colors duration-200">
                Sort by Relevance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
