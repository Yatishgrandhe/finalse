'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard', color: 'from-primary-500 to-secondary-500' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', href: '/portfolio', color: 'from-green-500 to-emerald-500' },
    { id: 'market', label: 'Market Overview', icon: '📈', href: '/market', color: 'from-accent-500 to-orange-600' },
    { id: 'news', label: 'News', icon: '📰', href: '/news', color: 'from-secondary-500 to-primary-500' },
    { id: 'ai', label: 'AI Predictions', icon: '🤖', href: '/ai', color: 'from-accent-500 to-yellow-500' },
    { id: 'trade', label: 'Trade', icon: '💹', href: '/trade', color: 'from-primary-500 to-accent-500' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings', color: 'from-gray-500 to-slate-500' },
  ]

  return (
    <aside className="w-64 bg-secondary-900 backdrop-blur-md border-r border-secondary-800 text-white min-h-screen relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-secondary-900/20"></div>
      
      <div className="relative z-10 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-secondary-200 bg-clip-text text-transparent mb-2">
            Navigation
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-secondary-400 to-accent-500 rounded-full"></div>
        </div>
        
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    pathname === item.href
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/25`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`mr-3 text-lg transition-transform duration-300 ${
                    pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {pathname === item.href && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-black/10 backdrop-blur-md">
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Quick Stats
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center group">
              <span className="text-white/60 group-hover:text-white/80 transition-colors">Portfolio Value:</span>
              <span className="text-white font-bold group-hover:text-blue-300 transition-colors">$125,000</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-white/60 group-hover:text-white/80 transition-colors">Today&apos;s P&L:</span>
              <span className="text-green-400 font-bold group-hover:text-green-300 transition-colors flex items-center">
                <span className="mr-1">↗</span>
                +$2,500
              </span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-white/60 group-hover:text-white/80 transition-colors">AI Signals:</span>
              <span className="text-orange-400 font-bold group-hover:text-orange-300 transition-colors flex items-center">
                <span className="mr-1">✨</span>
                12
              </span>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-xs text-white/50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
