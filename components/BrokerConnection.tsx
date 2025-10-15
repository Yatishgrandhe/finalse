'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context-supabase'
import { snaptradeUtils } from '@/lib/snaptrade'

interface BrokerConnectionProps {
  onConnectionSuccess?: (authorizationId: string) => void
  onConnectionError?: (error: string) => void
}

interface BrokerAccount {
  id: string
  brokerName: string
  accountId: string
  accountName: string
  accountType: string
  isActive: boolean
  lastSync: Date
}

export default function BrokerConnection({ onConnectionSuccess, onConnectionError }: BrokerConnectionProps) {
  const { user } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<BrokerAccount[]>([])
  const [showAccounts, setShowAccounts] = useState(false)

  const handleConnectBroker = async () => {
    if (!user) {
      onConnectionError?.('User not authenticated')
      return
    }

    setIsConnecting(true)
    
    try {
      const redirectUri = `${window.location.origin}/api/snaptrade/callback`
      
      const response = await fetch('/api/snaptrade/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectUri,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to SnapTrade OAuth flow
        console.log('Redirecting to SnapTrade OAuth URL:', data.redirectUrl)
        window.location.href = data.redirectUrl
      } else {
        throw new Error(data.error || 'Failed to generate connection URL')
      }
    } catch (error) {
      console.error('Error connecting broker:', error)
      onConnectionError?.(error instanceof Error ? error.message : 'Failed to connect broker')
    } finally {
      setIsConnecting(false)
    }
  }

  const loadConnectedAccounts = async () => {
    // This would typically load from user's stored authorization IDs
    // For now, we'll show a placeholder
    setConnectedAccounts([])
  }

  useEffect(() => {
    loadConnectedAccounts()
  }, [user])

  const popularBrokers = [
    { name: 'Robinhood', logo: '/brokers/robinhood.png', color: 'from-green-500 to-emerald-500' },
    { name: 'TD Ameritrade', logo: '/brokers/td-ameritrade.png', color: 'from-blue-500 to-indigo-500' },
    { name: 'Charles Schwab', logo: '/brokers/charles-schwab.png', color: 'from-blue-600 to-blue-700' },
    { name: 'Fidelity', logo: '/brokers/fidelity.png', color: 'from-green-600 to-green-700' },
    { name: 'E*TRADE', logo: '/brokers/etrade.png', color: 'from-purple-500 to-purple-600' },
    { name: 'Interactive Brokers', logo: '/brokers/interactive-brokers.png', color: 'from-orange-500 to-red-500' }
  ]

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Broker Connections</h3>
        <button
          onClick={() => setShowAccounts(!showAccounts)}
          className="px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors duration-200"
        >
          {showAccounts ? 'Hide Accounts' : 'View Accounts'}
        </button>
      </div>

      {/* Connected Accounts */}
      {showAccounts && connectedAccounts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Connected Accounts</h4>
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {account.brokerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{account.accountName}</div>
                    <div className="text-white/60 text-sm">{account.brokerName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${account.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-white/60 text-sm">
                    {account.lastSync.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Connected Accounts */}
      {showAccounts && connectedAccounts.length === 0 && (
        <div className="mb-6 text-center py-8">
          <div className="text-4xl mb-4 opacity-50">🔗</div>
          <p className="text-white/60 mb-4">No broker accounts connected</p>
          <p className="text-white/40 text-sm">Connect your broker account to sync your portfolio</p>
        </div>
      )}

      {/* Connect New Broker */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Connect a Broker</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularBrokers.map((broker) => (
            <button
              key={broker.name}
              onClick={handleConnectBroker}
              disabled={isConnecting}
              className="group p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 border border-slate-600/50 hover:border-blue-500/50"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${broker.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">
                    {broker.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{broker.name}</div>
                  <div className="text-white/60 text-xs">Connect Account</div>
                </div>
              </div>
              <div className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                Sync your {broker.name} portfolio
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Connect Button */}
      <div className="mt-6">
        <button
          onClick={handleConnectBroker}
          disabled={isConnecting || !user}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            'Connect Your Broker Account'
          )}
        </button>
        {!user && (
          <p className="text-white/60 text-sm mt-2 text-center">
            Please sign in to connect your broker account
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-400 text-lg">🔒</div>
          <div>
            <div className="text-blue-300 font-medium text-sm">Secure Connection</div>
            <div className="text-blue-200/80 text-xs mt-1">
              Your broker credentials are never stored. We use bank-level security through Snaptrade&apos;s OAuth flow.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
