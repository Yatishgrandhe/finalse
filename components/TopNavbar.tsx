'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../lib/auth-context-supabase'
import NotificationSystem, { useNotifications } from './NotificationSystem'
import { useMarketStatus } from './MarketStatus'

export default function TopNavbar() {
  const { user, signout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, addNotification, markAsRead, clearAll } = useNotifications()
  const marketStatus = useMarketStatus()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center space-x-3 group">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FinAIse Logo" 
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-300 transition-all duration-300">
                FinAIse
              </h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search stocks, news..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-600/50 rounded-lg bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationSystem 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onClearAll={clearAll}
            />

            {/* Market Status */}
            <div className="hidden lg:flex items-center space-x-2 text-sm">
              {marketStatus && (
                <>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      marketStatus.isOpen ? 'bg-green-400' : 
                      marketStatus.isPreMarket || marketStatus.isAfterHours ? 'bg-yellow-400' : 
                      'bg-red-400'
                    }`}></div>
                    <span className="text-white/80">
                      {marketStatus.isOpen ? 'Market Open' : 
                       marketStatus.isPreMarket ? 'Pre-Market' :
                       marketStatus.isAfterHours ? 'After Hours' : 'Market Closed'}
                    </span>
                  </div>
                  <div className="text-white/60">|</div>
                  <div className="text-white/80">
                    S&P 500: <span className="text-green-400 font-semibold">+1.2%</span>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-medium text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-[9999] border border-slate-700/50">
                    <div className="px-4 py-3 text-sm text-white/80 border-b border-slate-700/50">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-white/60">{user.email}</div>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">👤</span>
                        Profile Settings
                      </span>
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors duration-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">⚙️</span>
                        Preferences
                      </span>
                    </Link>
                    <div className="border-t border-slate-700/50 my-2"></div>
                    <button 
                      onClick={() => {
                        signout()
                        setIsProfileOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors duration-300"
                    >
                      <span className="flex items-center">
                        <span className="mr-3">🚪</span>
                        Sign out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 text-white/80 hover:text-white hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50 bg-slate-800/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search stocks, news..."
                  className="block w-full px-3 py-2 border border-slate-600/50 rounded-lg bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="px-3 py-2 text-sm text-white/60">
                Market Status: <span className={
                  marketStatus?.isOpen ? 'text-green-400' : 
                  marketStatus?.isPreMarket || marketStatus?.isAfterHours ? 'text-yellow-400' : 
                  'text-red-400'
                }>
                  {marketStatus?.isOpen ? 'Open' : 
                   marketStatus?.isPreMarket ? 'Pre-Market' :
                   marketStatus?.isAfterHours ? 'After Hours' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

