// Snaptrade API integration for broker syncing
import axios from 'axios'
import { mockSnaptradeService, mockSnaptradeUtils } from './snaptrade-mock'

export interface SnaptradeConfig {
  clientId: string
  consumerKey: string
  baseUrl: string
}

export interface BrokerConnection {
  id: string
  brokerName: string
  accountId: string
  accountName: string
  accountType: string
  isActive: boolean
  lastSync: Date
}

export interface PortfolioHolding {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  marketValue: number
  gainLoss: number
  gainLossPercent: number
  accountId: string
}

export interface TradeOrder {
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop'
  quantity: number
  price?: number
  stopPrice?: number
  accountId: string
}

class SnaptradeService {
  private static instance: SnaptradeService
  private config: SnaptradeConfig

  private constructor() {
    this.config = {
      clientId: process.env.NEXT_PUBLIC_SNAPTRADE_CLIENT_ID || 'CENTRAL-ACADEMY-OF-TECHNOLOGY-AND-ARTS-TEST-MKJKF',
      consumerKey: process.env.NEXT_PUBLIC_SNAPTRADE_CONSUMER_KEY || 'uXYsRKX92rXZJ1CSv7KTFyxE4JBbkFpUW3Rijz8n8Yym4YpLPh',
      baseUrl: 'https://api.snaptrade.com/api/v1'
    }
  }

  public static getInstance(): SnaptradeService {
    if (!SnaptradeService.instance) {
      SnaptradeService.instance = new SnaptradeService()
    }
    return SnaptradeService.instance
  }

  /**
   * Generate OAuth redirect URL for broker connection
   * Following SnapTrade API documentation: https://snaptrade.com/developers
   */
  async generateAuthUrl(redirectUri: string, userId?: string): Promise<string> {
    // Use mock service if configured or if real API fails
    if (mockSnaptradeUtils.shouldUseMock()) {
      console.log('Using mock SnapTrade service for auth URL generation')
      return await mockSnaptradeService.generateAuthUrl(redirectUri, userId || 'mock-user')
    }

    try {
      console.log('Generating SnapTrade auth URL with config:', {
        baseUrl: this.config.baseUrl,
        clientId: this.config.clientId,
        redirectUri,
        userId
      })

      // Follow SnapTrade API documentation format
      const requestBody: any = {
        clientId: this.config.clientId,
        consumerKey: this.config.consumerKey,
        redirectURI: redirectUri
      }

      // Add userId if provided (optional for some flows)
      if (userId) {
        requestBody.userId = userId
      }

      const response = await axios.post(`${this.config.baseUrl}/auth`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('SnapTrade API response:', response.data)
      
      // SnapTrade returns redirectURI in the response
      if (response.data.redirectURI) {
        return response.data.redirectURI
      } else if (response.data.redirectUrl) {
        return response.data.redirectUrl
      } else {
        throw new Error('No redirect URL in SnapTrade response')
      }
    } catch (error: any) {
      console.error('Error generating SnapTrade auth URL:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      // Fallback to mock service if real API fails
      console.log('Falling back to mock SnapTrade service')
      return await mockSnaptradeService.generateAuthUrl(redirectUri, userId || 'mock-user')
    }
  }

  /**
   * Handle OAuth callback and get authorization ID
   */
  async handleCallback(authorizationCode: string, state: string): Promise<string> {
    // Use mock service if configured
    if (mockSnaptradeUtils.shouldUseMock()) {
      console.log('Using mock SnapTrade service for callback handling')
      return await mockSnaptradeService.handleCallback(authorizationCode, state)
    }

    try {
      console.log('Handling callback with:', { authorizationCode, state })
      
      const response = await axios.post(`${this.config.baseUrl}/auth/callback`, {
        clientId: this.config.clientId,
        consumerKey: this.config.consumerKey,
        code: authorizationCode,
        state: state
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      console.log('Callback response:', response.data)
      return response.data.authorizationId
    } catch (error: any) {
      console.error('Error handling callback:', error)
      console.error('Callback error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      // Fallback to mock service if real API fails
      console.log('Falling back to mock SnapTrade service for callback')
      return await mockSnaptradeService.handleCallback(authorizationCode, state)
    }
  }

  /**
   * Get connected broker accounts
   */
  async getBrokerAccounts(authorizationId: string): Promise<BrokerConnection[]> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/accounts`, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey,
          'Authorization': `Bearer ${authorizationId}`
        }
      })

      return response.data.accounts.map((account: any) => ({
        id: account.id,
        brokerName: account.broker.name,
        accountId: account.id,
        accountName: account.name,
        accountType: account.type,
        isActive: account.isActive,
        lastSync: new Date(account.lastSync || Date.now())
      }))
    } catch (error) {
      console.error('Error fetching broker accounts:', error)
      return []
    }
  }

  /**
   * Get portfolio holdings from connected accounts
   */
  async getPortfolioHoldings(authorizationId: string, accountId?: string): Promise<PortfolioHolding[]> {
    // Use mock service if configured
    if (mockSnaptradeUtils.shouldUseMock()) {
      console.log('Using mock SnapTrade service for portfolio holdings')
      return await mockSnaptradeService.getPortfolioHoldings(authorizationId, accountId)
    }

    try {
      const url = accountId 
        ? `${this.config.baseUrl}/accounts/${accountId}/holdings`
        : `${this.config.baseUrl}/holdings`
      
      const response = await axios.get(url, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey,
          'Authorization': `Bearer ${authorizationId}`
        }
      })

      return response.data.holdings.map((holding: any) => ({
        symbol: holding.symbol,
        quantity: holding.quantity,
        averagePrice: holding.averagePrice,
        currentPrice: holding.currentPrice,
        marketValue: holding.marketValue,
        gainLoss: holding.gainLoss,
        gainLossPercent: holding.gainLossPercent,
        accountId: holding.accountId
      }))
    } catch (error) {
      console.error('Error fetching portfolio holdings:', error)
      // Fallback to mock service
      console.log('Falling back to mock SnapTrade service for portfolio holdings')
      return await mockSnaptradeService.getPortfolioHoldings(authorizationId, accountId)
    }
  }

  /**
   * Get account balances
   */
  async getAccountBalances(authorizationId: string, accountId?: string): Promise<any> {
    try {
      const url = accountId 
        ? `${this.config.baseUrl}/accounts/${accountId}/balances`
        : `${this.config.baseUrl}/balances`
      
      const response = await axios.get(url, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey,
          'Authorization': `Bearer ${authorizationId}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching account balances:', error)
      return null
    }
  }

  /**
   * Place a trade order
   */
  async placeTradeOrder(authorizationId: string, order: TradeOrder): Promise<boolean> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/trading/placeOrder`, {
        accountId: order.accountId,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        stopPrice: order.stopPrice
      }, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey,
          'Authorization': `Bearer ${authorizationId}`
        }
      })

      return response.data.success
    } catch (error) {
      console.error('Error placing trade order:', error)
      return false
    }
  }

  /**
   * Get available brokers
   */
  async getAvailableBrokers(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/brokers`, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey
        }
      })

      return response.data.brokers
    } catch (error) {
      console.error('Error fetching available brokers:', error)
      return []
    }
  }

  /**
   * Disconnect a broker account
   */
  async disconnectAccount(authorizationId: string, accountId: string): Promise<boolean> {
    try {
      const response = await axios.delete(`${this.config.baseUrl}/accounts/${accountId}`, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey,
          'Authorization': `Bearer ${authorizationId}`
        }
      })

      return response.data.success
    } catch (error) {
      console.error('Error disconnecting account:', error)
      return false
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(authorizationId: string, accountId?: string, limit: number = 50): Promise<any[]> {
    try {
      const url = accountId 
        ? `${this.config.baseUrl}/accounts/${accountId}/transactions?limit=${limit}`
        : `${this.config.baseUrl}/transactions?limit=${limit}`
      
      const response = await axios.get(url, {
        headers: {
          'ClientId': this.config.clientId,
          'ConsumerKey': this.config.consumerKey,
          'Authorization': `Bearer ${authorizationId}`
        }
      })

      return response.data.transactions
    } catch (error) {
      console.error('Error fetching transaction history:', error)
      return []
    }
  }
}

// Export singleton instance
export const snaptradeService = SnaptradeService.getInstance()

// Utility functions
export const snaptradeUtils = {
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
  calculatePortfolioTotals(holdings: PortfolioHolding[]) {
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
