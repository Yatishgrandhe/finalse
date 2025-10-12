'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-primary-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FinAIse Logo" 
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-accent-500 rounded-full blur opacity-30"></div>
              </div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-primary-900' : 'text-white'
              }`}>FinAIse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth" 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-primary-600 hover:text-secondary-600 hover:bg-secondary-50' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="bg-gradient-to-r from-secondary-600 to-accent-600 hover:from-secondary-700 hover:to-accent-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="text-center">
          <div className="inline-block">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Powered Financial
              <span className="bg-gradient-to-r from-secondary-400 via-accent-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
                Intelligence
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Make smarter investment decisions with advanced AI analysis, real-time market insights, 
            and personalized portfolio recommendations tailored to your financial goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link 
              href="/auth"
              className="group bg-gradient-to-r from-secondary-600 to-accent-600 hover:from-secondary-700 hover:to-accent-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary-500/25 relative overflow-hidden"
            >
              <span className="relative z-10">Start Trading</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            <Link 
              href="/auth"
              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 relative overflow-hidden"
            >
              <span className="relative z-10">Sign Up Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link href="/ai" className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 border border-white/20 hover:border-white/30 cursor-pointer">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">AI Predictions</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Get intelligent stock recommendations powered by advanced machine learning algorithms 
                and real-time market analysis.
              </p>
            </Link>
            
            <Link href="/portfolio" className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 border border-white/20 hover:border-white/30 cursor-pointer">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">Portfolio Management</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Track your investments, analyze performance, and optimize your portfolio 
                with comprehensive analytics and insights.
              </p>
            </Link>
            
            <Link href="/market" className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10 border border-white/20 hover:border-white/30 cursor-pointer">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-300 transition-colors">Real-time Data</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Access live market data, news sentiment analysis, and instant notifications 
                to stay ahead of market movements.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Image 
                src="/logo.png" 
                alt="FinAIse Logo" 
                width={24}
                height={24}
                className="object-contain"
              />
              <h2 className="text-xl font-bold text-white">FinAIse</h2>
            </div>
            <p className="text-white/60 mb-4">
              © 2024 FinAIse. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors duration-300 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors duration-300 hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
