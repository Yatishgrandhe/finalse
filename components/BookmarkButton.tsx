'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth-context-supabase'
import { getUserBookmarkedStocks, addBookmarkedStock, removeBookmarkedStock } from '../lib/supabase-functions'

interface BookmarkButtonProps {
  stockSymbol: string
  stockName: string
  className?: string
}

export default function BookmarkButton({ stockSymbol, stockName, className = '' }: BookmarkButtonProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkedStocks, setBookmarkedStocks] = useState<any[]>([])

  // Load bookmarked stocks
  useEffect(() => {
    const loadBookmarks = async () => {
      if (user) {
        try {
          const bookmarks = await getUserBookmarkedStocks(user.id)
          setBookmarkedStocks(bookmarks || [])
          setIsBookmarked(bookmarks?.some(bookmark => bookmark.stock_symbol === stockSymbol) || false)
        } catch (error) {
          console.error('Error loading bookmarks:', error)
        }
      }
    }

    loadBookmarks()
  }, [user, stockSymbol])

  const handleToggleBookmark = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      if (isBookmarked) {
        await removeBookmarkedStock(user.id, stockSymbol)
        setIsBookmarked(false)
        setBookmarkedStocks(prev => prev.filter(bookmark => bookmark.stock_symbol !== stockSymbol))
      } else {
        await addBookmarkedStock({ 
          userId: user.id, 
          stockSymbol, 
          stockName 
        })
        setIsBookmarked(true)
        setBookmarkedStocks(prev => [...prev, {
          id: Date.now().toString(),
          stock_symbol: stockSymbol,
          stock_name: stockName,
          added_at: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading || !user}
      className={`p-1 rounded-full ${isBookmarked ? 'text-yellow-400' : 'text-white/50 hover:text-white/80'} ${className}`}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L9.19 8.63L2 9.24L7.46 13.8L5.82 21L12 17.27L18.18 21L16.54 13.8L22 9.24L14.81 8.63L12 2Z" />
        </svg>
      )}
    </button>
  )
}