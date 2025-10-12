'use client'

import Image from 'next/image'
import { News } from '../lib/convex'

interface NewsCardProps {
  article: News
  onClick?: () => void
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100'
      case 'negative':
        return 'text-red-600 bg-red-100'
      case 'neutral':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-400"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {article.summary || article.content.substring(0, 200)}...
          </p>
        </div>
        {article.metadata?.image && (
          <Image 
            src={article.metadata.image} 
            alt={article.title}
            width={80}
            height={80}
            className="object-cover rounded-lg ml-4"
          />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <span className="font-medium">{article.source}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        {article.sentiment && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
            {article.sentiment.toUpperCase()}
          </span>
        )}
      </div>

      {article.symbols && article.symbols.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {article.symbols.slice(0, 5).map((symbol) => (
              <span 
                key={symbol}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {symbol}
              </span>
            ))}
            {article.symbols.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{article.symbols.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {article.metadata?.tags && article.metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {article.metadata.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {article.isHighlighted && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
              AI Highlighted
            </span>
          )}
          {article.sentimentScore && (
            <span className="text-xs text-gray-500">
              Sentiment: {(article.sentimentScore * 100).toFixed(0)}%
            </span>
          )}
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Read More →
        </button>
      </div>
    </div>
  )
}
