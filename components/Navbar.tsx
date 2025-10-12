'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="FinAIse Logo" 
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-2xl font-bold">FinAIse</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/portfolio" className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Portfolio
              </Link>
              <Link href="/market" className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Market
              </Link>
              <Link href="/trade" className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Trade
              </Link>
              <Link href="/news" className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                News
              </Link>
              <Link href="/ai" className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                AI Predictions
              </Link>
            </div>
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-gray-300 hover:text-white p-2"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">YG</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link href="/auth" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
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
