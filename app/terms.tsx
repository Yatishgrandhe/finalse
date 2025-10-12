'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 text-white shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-3 group">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FinAIse Logo" 
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                FinAIse
              </h1>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Terms of Service</h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <p className="text-white/80 mb-6">
                By accessing and using FinAIse, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Use License</h2>
              <p className="text-white/80 mb-6">
                Permission is granted to temporarily download one copy of FinAIse for personal, 
                non-commercial transitory viewing only.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
              <p className="text-white/80 mb-6">
                The materials on FinAIse are provided on an 'as is' basis. FinAIse makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Limitations</h2>
              <p className="text-white/80 mb-6">
                In no event shall FinAIse or its suppliers be liable for any damages arising out of 
                the use or inability to use the materials on FinAIse.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Investment Disclaimer</h2>
              <p className="text-white/80 mb-6">
                FinAIse provides financial information and AI-powered analysis for educational purposes only. 
                This is not financial advice. Always consult with a qualified financial advisor before making investment decisions.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-white/80 mb-6">
                If you have any questions about these Terms of Service, please contact us at 
                legal@finalse.com
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
