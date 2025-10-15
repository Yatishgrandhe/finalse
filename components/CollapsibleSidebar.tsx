'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CollapsibleSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard', color: 'from-blue-500 to-purple-500' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', href: '/portfolio', color: 'from-green-500 to-emerald-500' },
    { id: 'market', label: 'Market', icon: '📈', href: '/market', color: 'from-orange-500 to-red-500' },
    { id: 'news', label: 'News', icon: '📰', href: '/news', color: 'from-purple-500 to-pink-500' },
    { id: 'ai', label: 'AI Predictions', icon: '🤖', href: '/ai', color: 'from-yellow-500 to-orange-500' },
    { id: 'trade', label: 'Trade', icon: '💹', href: '/trade', color: 'from-indigo-500 to-blue-500' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings', color: 'from-gray-500 to-slate-500' },
  ]

  return (
    <aside className={`bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 text-white min-h-screen relative transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-slate-900/20"></div>
      
      <div className="relative z-10 p-4">
        {/* Toggle Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Logo */}
        {!isCollapsed && (
          <div className="mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              FinAIse
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
        )}
        
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    pathname === item.href
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={`text-lg transition-transform duration-300 ${
                    pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
                  } ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {pathname === item.href && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/10 backdrop-blur-md">
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-white/80 mb-3 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center group">
                  <span className="text-white/60 group-hover:text-white/80 transition-colors">Portfolio:</span>
                  <span className="text-white font-bold group-hover:text-blue-300 transition-colors">$125K</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-white/60 group-hover:text-white/80 transition-colors">Today:</span>
                  <span className="text-green-400 font-bold group-hover:text-green-300 transition-colors flex items-center">
                    <span className="mr-1">↗</span>
                    +$2.5K
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
              <div className="mt-3 flex items-center justify-center">
                <div className="flex items-center space-x-2 text-xs text-white/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

