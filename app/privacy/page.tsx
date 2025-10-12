'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Privacy Policy</h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-white/80 mb-6">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-white/80 mb-6">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p className="text-white/80 mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-white/80 mb-6">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-white/80 mb-6">
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@finalse.com
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
