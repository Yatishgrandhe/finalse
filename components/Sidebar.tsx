'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', href: '/portfolio' },
    { id: 'market', label: 'Market Overview', icon: '📈', href: '/market' },
    { id: 'news', label: 'News', icon: '📰', href: '/news' },
    { id: 'ai', label: 'AI Predictions', icon: '🤖', href: '/ai' },
    { id: 'trade', label: 'Trade', icon: '💹', href: '/trade' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' },
  ]

  return (
    <aside className="w-64 bg-blue-600 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Navigation</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-blue-500">
        <h3 className="text-sm font-semibold text-blue-200 mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-200">Portfolio Value:</span>
            <span className="text-white font-medium">$125,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Today&apos;s P&L:</span>
            <span className="text-green-400 font-medium">+$2,500</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">AI Signals:</span>
            <span className="text-orange-400 font-medium">12</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
