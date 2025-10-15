/**
 * Mock SnapTrade service for development and testing
 * This provides a fallback when the real SnapTrade API is not available
 */

export interface MockSnaptradeConfig {
  clientId: string
  consumerKey: string
  baseUrl: string
  isMock: boolean
}

export interface MockBrokerConnection {
  id: string
  brokerName: string
  accountId: string
  accountName: string
  accountType: string
  isActive: boolean
  lastSync: Date
}

export interface MockPortfolioHolding {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  marketValue: number
  gainLoss: number
  gainLossPercent: number
  accountId: string
}

class MockSnaptradeService {
  private static instance: MockSnaptradeService
  private config: MockSnaptradeConfig
  private mockAuthorizations: Map<string, string> = new Map()
  private mockHoldings: MockPortfolioHolding[] = [
    {
      symbol: 'AAPL',
      quantity: 10,
      averagePrice: 150.00,
      currentPrice: 175.50,
      marketValue: 1755.00,
      gainLoss: 255.00,
      gainLossPercent: 17.0,
      accountId: 'mock-account-1'
    },
    {
      symbol: 'GOOGL',
      quantity: 5,
      averagePrice: 2500.00,
      currentPrice: 2750.00,
      marketValue: 13750.00,
      gainLoss: 1250.00,
      gainLossPercent: 10.0,
      accountId: 'mock-account-1'
    },
    {
      symbol: 'TSLA',
      quantity: 8,
      averagePrice: 200.00,
      currentPrice: 245.00,
      marketValue: 1960.00,
      gainLoss: 360.00,
      gainLossPercent: 22.5,
      accountId: 'mock-account-1'
    }
  ]

  private constructor() {
    this.config = {
      clientId: 'MOCK-CLIENT-ID',
      consumerKey: 'MOCK-CONSUMER-KEY',
      baseUrl: 'https://mock-api.snaptrade.com/api/v1',
      isMock: true
    }
  }

  public static getInstance(): MockSnaptradeService {
    if (!MockSnaptradeService.instance) {
      MockSnaptradeService.instance = new MockSnaptradeService()
    }
    return MockSnaptradeService.instance
  }

  /**
   * Generate mock OAuth redirect URL for broker connection
   */
  async generateAuthUrl(redirectUri: string, userId: string): Promise<string> {
    console.log('Mock SnapTrade: Generating auth URL for user:', userId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate a mock authorization ID
    const mockAuthId = `mock-auth-${Date.now()}-${Math.random().toString(36).substring(2)}`
    this.mockAuthorizations.set(userId, mockAuthId)
    
    // Return a mock OAuth URL that will redirect back to our callback
    const mockOAuthUrl = new URL(redirectUri)
    mockOAuthUrl.searchParams.set('code', 'mock-auth-code-12345')
    mockOAuthUrl.searchParams.set('state', 'mock-state-67890')
    mockOAuthUrl.searchParams.set('userId', userId)
    
    console.log('Mock SnapTrade: Generated OAuth URL:', mockOAuthUrl.toString())
    return mockOAuthUrl.toString()
  }

  /**
   * Handle mock OAuth callback and get authorization ID
   */
  async handleCallback(authorizationCode: string, state: string): Promise<string> {
    console.log('Mock SnapTrade: Handling callback with code:', authorizationCode)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return a mock authorization ID
    const mockAuthId = `mock-auth-${Date.now()}-${Math.random().toString(36).substring(2)}`
    console.log('Mock SnapTrade: Generated authorization ID:', mockAuthId)
    return mockAuthId
  }

  /**
   * Get mock connected broker accounts
   */
  async getBrokerAccounts(authorizationId: string): Promise<MockBrokerConnection[]> {
    console.log('Mock SnapTrade: Getting broker accounts for:', authorizationId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        id: 'mock-account-1',
        brokerName: 'Robinhood',
        accountId: 'mock-account-1',
        accountName: 'Mock Robinhood Account',
        accountType: 'INDIVIDUAL',
        isActive: true,
        lastSync: new Date()
      }
    ]
  }

  /**
   * Get mock portfolio holdings
   */
  async getPortfolioHoldings(authorizationId: string, accountId?: string): Promise<MockPortfolioHolding[]> {
    console.log('Mock SnapTrade: Getting portfolio holdings for:', authorizationId, accountId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return this.mockHoldings
  }

  /**
   * Get mock account balances
   */
  async getAccountBalances(authorizationId: string, accountId?: string): Promise<any> {
    console.log('Mock SnapTrade: Getting account balances for:', authorizationId, accountId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalValue: 17465.00,
      cash: 1000.00,
      buyingPower: 5000.00,
      dayTradingBuyingPower: 2500.00
    }
  }

  /**
   * Get mock available brokers
   */
  async getAvailableBrokers(): Promise<any[]> {
    console.log('Mock SnapTrade: Getting available brokers')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return [
      { id: 'robinhood', name: 'Robinhood', logo: '/brokers/robinhood.png' },
      { id: 'td_ameritrade', name: 'TD Ameritrade', logo: '/brokers/td-ameritrade.png' },
      { id: 'charles_schwab', name: 'Charles Schwab', logo: '/brokers/charles-schwab.png' },
      { id: 'fidelity', name: 'Fidelity', logo: '/brokers/fidelity.png' },
      { id: 'etrade', name: 'E*TRADE', logo: '/brokers/etrade.png' },
      { id: 'interactive_brokers', name: 'Interactive Brokers', logo: '/brokers/interactive-brokers.png' }
    ]
  }

  /**
   * Disconnect mock account
   */
  async disconnectAccount(authorizationId: string, accountId: string): Promise<boolean> {
    console.log('Mock SnapTrade: Disconnecting account:', accountId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
  }

  /**
   * Get mock transaction history
   */
  async getTransactionHistory(authorizationId: string, accountId?: string, limit: number = 50): Promise<any[]> {
    console.log('Mock SnapTrade: Getting transaction history for:', authorizationId, accountId)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return [
      {
        id: 'mock-tx-1',
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 10,
        price: 150.00,
        totalAmount: 1500.00,
        fees: 0.00,
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'mock-tx-2',
        symbol: 'GOOGL',
        type: 'BUY',
        quantity: 5,
        price: 2500.00,
        totalAmount: 12500.00,
        fees: 0.00,
        timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ]
  }
}

// Export singleton instance
export const mockSnaptradeService = MockSnaptradeService.getInstance()

// Utility functions for mock service
export const mockSnaptradeUtils = {
  /**
   * Check if we should use mock service
   */
  shouldUseMock(): boolean {
    return process.env.NODE_ENV === 'development' || 
           !process.env.NEXT_PUBLIC_SNAPTRADE_CLIENT_ID ||
           process.env.NEXT_PUBLIC_USE_MOCK_SNAPTRADE === 'true'
  },

  /**
   * Format broker name for display
   */
  formatBrokerName(brokerName: string): string {
    return brokerName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  },

  /**
   * Get broker logo URL
   */
  getBrokerLogo(brokerName: string): string {
    const logos: { [key: string]: string } = {
      'robinhood': '/brokers/robinhood.png',
      'td_ameritrade': '/brokers/td-ameritrade.png',
      'charles_schwab': '/brokers/charles-schwab.png',
      'fidelity': '/brokers/fidelity.png',
      'etrade': '/brokers/etrade.png',
      'interactive_brokers': '/brokers/interactive-brokers.png'
    }
    return logos[brokerName.toLowerCase()] || '/brokers/default.png'
  },

  /**
   * Calculate portfolio totals
   */
  calculatePortfolioTotals(holdings: MockPortfolioHolding[]) {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
    const totalCost = holdings.reduce((sum, holding) => sum + (holding.quantity * holding.averagePrice), 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent
    }
  }
}
