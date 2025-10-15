'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth-context-supabase'
import { cookieUtils } from '../../lib/cookie-utils'

export default function TestAuthPage() {
  const { user, isLoading } = useAuth()
  const [cookieToken, setCookieToken] = useState<string | null>(null)
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null)

  useEffect(() => {
    // Check tokens
    const cookie = cookieUtils.get('sessionToken')
    const local = localStorage.getItem('sessionToken')
    
    setCookieToken(cookie)
    setLocalStorageToken(local)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context Status */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Auth Context Status</h2>
            <div className="space-y-2">
              <div>
                <span className="text-slate-400">Loading:</span> 
                <span className={`ml-2 ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {isLoading ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">User:</span> 
                <span className={`ml-2 ${user ? 'text-green-400' : 'text-red-400'}`}>
                  {user ? `${user.name} (${user.email})` : 'Not logged in'}
                </span>
              </div>
            </div>
          </div>

          {/* Token Status */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Token Status</h2>
            <div className="space-y-2">
              <div>
                <span className="text-slate-400">Cookie Token:</span> 
                <span className={`ml-2 ${cookieToken ? 'text-green-400' : 'text-red-400'}`}>
                  {cookieToken ? 'Exists' : 'Missing'}
                </span>
                {cookieToken && (
                  <div className="text-xs text-slate-500 mt-1 break-all">
                    {cookieToken.substring(0, 20)}...
                  </div>
                )}
              </div>
              <div>
                <span className="text-slate-400">LocalStorage Token:</span> 
                <span className={`ml-2 ${localStorageToken ? 'text-green-400' : 'text-red-400'}`}>
                  {localStorageToken ? 'Exists' : 'Missing'}
                </span>
                {localStorageToken && (
                  <div className="text-xs text-slate-500 mt-1 break-all">
                    {localStorageToken.substring(0, 20)}...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
                  cookieUtils.set('sessionToken', token)
                  localStorage.setItem('sessionToken', token)
                  setCookieToken(token)
                  setLocalStorageToken(token)
                  console.log('Test token set:', token)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Set Test Token
              </button>
              <button
                onClick={() => {
                  cookieUtils.delete('sessionToken')
                  localStorage.removeItem('sessionToken')
                  setCookieToken(null)
                  setLocalStorageToken(null)
                  console.log('Test token cleared')
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Clear Test Token
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <div className="text-sm space-y-1">
              <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</div>
              <div>Cookies Enabled: {typeof navigator !== 'undefined' ? navigator.cookieEnabled ? 'Yes' : 'No' : 'N/A'}</div>
              <div>LocalStorage Available: {typeof localStorage !== 'undefined' ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <a href="/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            Go to Dashboard
          </a>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
