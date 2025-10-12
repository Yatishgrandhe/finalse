// Utility functions for FinAIse

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculateGainLoss(currentPrice: number, purchasePrice: number, shares: number): {
  gainLoss: number
  gainLossPercent: number
} {
  const gainLoss = (currentPrice - purchasePrice) * shares
  const gainLossPercent = ((currentPrice - purchasePrice) / purchasePrice) * 100
  
  return { gainLoss, gainLossPercent }
}

export function calculatePortfolioValue(holdings: Array<{
  shares: number
  currentPrice: number
}>): number {
  return holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.currentPrice)
  }, 0)
}

export function calculatePortfolioGainLoss(holdings: Array<{
  shares: number
  currentPrice: number
  averagePrice: number
}>): {
  totalGainLoss: number
  totalGainLossPercent: number
} {
  const totalCost = holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.averagePrice)
  }, 0)
  
  const totalValue = holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.currentPrice)
  }, 0)
  
  const totalGainLoss = totalValue - totalCost
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
  
  return { totalGainLoss, totalGainLossPercent }
}

export function getRiskLevel(volatility: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (volatility < 15) return 'LOW'
  if (volatility < 30) return 'MEDIUM'
  return 'HIGH'
}

export function getRecommendationColor(recommendation: 'BUY' | 'SELL' | 'HOLD'): string {
  switch (recommendation) {
    case 'BUY':
      return 'text-green-600 bg-green-100'
    case 'SELL':
      return 'text-red-600 bg-red-100'
    case 'HOLD':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}
