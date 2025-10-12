import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ConvexClientProvider } from '../components/ConvexClientProvider'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinAIse - AI Financial Advisor',
  description: 'Intelligent stock recommendations and portfolio management powered by AI',
  keywords: ['finance', 'AI', 'stocks', 'investing', 'portfolio', 'trading'],
  authors: [{ name: 'FinAIse Team' }],
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
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
