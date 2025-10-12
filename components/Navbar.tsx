'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <nav className="bg-primary-900 backdrop-blur-md border-b border-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-3 group">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FinAIse Logo" 
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-secondary-300 bg-clip-text text-transparent group-hover:from-secondary-200 group-hover:to-accent-300 transition-all duration-300">
                FinAIse
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link href="/dashboard" className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
                Dashboard
              </Link>
              <Link href="/portfolio" className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
                Portfolio
              </Link>
              <Link href="/market" className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
                Market
              </Link>
              <Link href="/trade" className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
                Trade
              </Link>
              <Link href="/news" className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
                News
              </Link>
              <Link href="/ai" className="text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105">
                AI Predictions
              </Link>
            </div>
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 relative group">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-medium text-white">YG</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl py-2 z-50 border border-white/20">
                  <Link href="/profile" className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors duration-300 rounded-lg mx-2">
                    <span className="flex items-center">
                      <span className="mr-2">👤</span>
                      Profile
                    </span>
                  </Link>
                  <Link href="/settings" className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors duration-300 rounded-lg mx-2">
                    <span className="flex items-center">
                      <span className="mr-2">⚙️</span>
                      Settings
                    </span>
                  </Link>
                  <div className="border-t border-white/20 my-2"></div>
                  <Link href="/auth" className="block px-4 py-3 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors duration-300 rounded-lg mx-2">
                    <span className="flex items-center">
                      <span className="mr-2">🚪</span>
                      Sign out
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
