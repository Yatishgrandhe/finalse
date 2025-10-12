import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ConvexClientProvider } from '../components/ConvexClientProvider'
import { AuthProvider } from '../lib/auth-context'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinAIse - AI Financial Advisor',
  description: 'Intelligent stock recommendations and portfolio management powered by AI',
  keywords: ['finance', 'AI', 'stocks', 'investing', 'portfolio', 'trading', 'options', 'market analysis'],
  authors: [{ name: 'FinAIse Team' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'FinAIse - AI Financial Advisor',
    description: 'Intelligent stock recommendations and portfolio management powered by AI',
    url: 'https://finalse.vercel.app',
    siteName: 'FinAIse',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'FinAIse Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinAIse - AI Financial Advisor',
    description: 'Intelligent stock recommendations and portfolio management powered by AI',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
