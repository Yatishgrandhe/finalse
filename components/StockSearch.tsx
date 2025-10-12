'use client'

import { useState, useRef, useEffect } from 'react'
import { useSymbolSearch } from '@/lib/hooks/useYahooFinance'
import { YahooSearchResult } from '@/lib/yahoo-finance'

interface StockSearchProps {
  onSymbolSelect: (symbol: YahooSearchResult) => void
  placeholder?: string
  className?: string
}

export default function StockSearch({ 
  onSymbolSelect, 
  placeholder = "Search for stocks...",
  className = ""
}: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { searchResults, loading, error } = useSymbolSearch(query)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSymbolSelect(searchResults[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle symbol selection
  const handleSymbolSelect = (symbol: YahooSearchResult) => {
    onSymbolSelect(symbol)
    setQuery(symbol.symbol)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedItem) {
        selectedItem.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex])

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {error ? (
            <div className="px-4 py-3 text-sm text-red-600">
              Error: {error}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            searchResults.map((result, index) => (
              <div
                key={`${result.symbol}-${result.exchange}`}
                onClick={() => handleSymbolSelect(result)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-blue-50 text-blue-900'
                    : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">
                        {result.symbol}
                      </span>
                      {result.exchange && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {result.exchange}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {result.shortName || result.longName || 'N/A'}
                    </div>
                  </div>
                  {result.type && (
                    <div className="text-xs text-gray-400 ml-2">
                      {result.type}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Help Text */}
      {query.length > 0 && query.length < 2 && (
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  )
}
