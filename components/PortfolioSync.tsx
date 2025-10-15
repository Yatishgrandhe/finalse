'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context-supabase'
import { snaptradeUtils } from '@/lib/snaptrade'

interface PortfolioSyncProps {
  authorizationId?: string
  onSyncComplete?: (holdings: any[]) => void
}

export default function PortfolioSync({ authorizationId, onSyncComplete }: PortfolioSyncProps) {
  const { user } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [holdings, setHoldings] = useState<any[]>([])

  const syncPortfolio = async () => {
    if (!authorizationId) {
      setSyncStatus('error')
      return
    }

    setIsSyncing(true)
    setSyncStatus('syncing')

    try {
      // Fetch connected accounts
      const accountsResponse = await fetch(`/api/snaptrade/accounts?authorizationId=${authorizationId}`)
      const accountsData = await accountsResponse.json()

      if (accountsData.success) {
        setConnectedAccounts(accountsData.accounts)

        // Fetch holdings from all accounts
        const holdingsResponse = await fetch(`/api/snaptrade/holdings?authorizationId=${authorizationId}`)
        const holdingsData = await holdingsResponse.json()

        if (holdingsData.success) {
          setHoldings(holdingsData.holdings)
          setLastSync(new Date())
          setSyncStatus('success')
          
          if (onSyncComplete) {
            onSyncComplete(holdingsData.holdings)
          }
        } else {
          throw new Error(holdingsData.error || 'Failed to fetch holdings')
        }
      } else {
        throw new Error(accountsData.error || 'Failed to fetch accounts')
      }
    } catch (error) {
      console.error('Error syncing portfolio:', error)
      setSyncStatus('error')
    } finally {
      setIsSyncing(false)
    }
  }

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-blue-400'
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
      default: return 'text-white/60'
    }
  }

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing': return 'Syncing...'
      case 'success': return 'Sync Complete'
      case 'error': return 'Sync Failed'
      default: return 'Ready to Sync'
    }
  }

  const portfolioTotals = snaptradeUtils.calculatePortfolioTotals(holdings)

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Portfolio Sync</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            syncStatus === 'success' ? 'bg-green-400' :
            syncStatus === 'error' ? 'bg-red-400' :
            syncStatus === 'syncing' ? 'bg-blue-400 animate-pulse' :
            'bg-gray-400'
          }`}></div>
          <span className={`text-sm ${getSyncStatusColor()}`}>
            {getSyncStatusText()}
          </span>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-white font-medium mb-1">Broker Accounts</h4>
          <p className="text-white/60 text-sm">
            {connectedAccounts.length} connected account{connectedAccounts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={syncPortfolio}
          disabled={isSyncing || !authorizationId}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSyncing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Syncing...</span>
            </div>
          ) : (
            'Sync Now'
          )}
        </button>
      </div>

      {/* Last Sync Info */}
      {lastSync && (
        <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="text-white/80 text-sm mb-2">Last Sync</div>
          <div className="text-white font-medium">
            {lastSync.toLocaleString()}
          </div>
        </div>
      )}

      {/* Portfolio Summary */}
      {holdings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-white font-medium mb-4">Portfolio Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                ${portfolioTotals.totalValue.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Total Value</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${
                portfolioTotals.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioTotals.totalGainLoss >= 0 ? '+' : ''}${portfolioTotals.totalGainLoss.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Gain/Loss</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${
                portfolioTotals.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioTotals.totalGainLossPercent >= 0 ? '+' : ''}{portfolioTotals.totalGainLossPercent.toFixed(2)}%
              </div>
              <div className="text-white/60 text-sm">Return</div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-white font-medium mb-4">Connected Accounts</h4>
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
                    <div className="text-white/60 text-sm">{snaptradeUtils.formatBrokerName(account.brokerName)}</div>
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

      {/* Holdings Preview */}
      {holdings.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-4">Recent Holdings</h4>
          <div className="space-y-2">
            {holdings.slice(0, 5).map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">{holding.symbol}</div>
                  <div className="text-white/60 text-sm">{holding.quantity} shares</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${holding.marketValue.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    holding.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Authorization ID */}
      {!authorizationId && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4 opacity-50">🔗</div>
          <p className="text-white/60 mb-4">No broker account connected</p>
          <p className="text-white/40 text-sm">Connect a broker account to sync your portfolio</p>
        </div>
      )}
    </div>
  )
}
