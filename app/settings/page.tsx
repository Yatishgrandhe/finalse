'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '../../components/AuthGuard'
import TopNavbar from '../../components/TopNavbar'
import CollapsibleSidebar from '../../components/CollapsibleSidebar'
import { useAuth } from '../../lib/auth-context-supabase'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    currency: 'USD',
    language: 'en'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setSettings({
        theme: user.preferences?.theme || 'dark',
        notifications: user.preferences?.notifications ?? true,
        currency: (user.preferences as any)?.currency || 'USD',
        language: user.preferences?.language || 'en'
      })
    }
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await updateProfile({
        preferences: settings
      })
      
      if (result.success) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(result.error || 'Failed to save settings')
      }
    } catch (error) {
      setMessage('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-3 animate-pulse delay-500"></div>
        </div>

        <TopNavbar />
        <div className="flex relative z-10">
          <CollapsibleSidebar />
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-white/60 text-lg">Customize your FinAIse experience</p>
            </div>

            {/* Settings Form */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                
                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-red-500/20 border border-red-500/50 text-red-300'}`}>
                    {message}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Theme Setting */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  {/* Currency Setting */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  {/* Language Setting */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>

                  {/* Notifications Setting */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={settings.notifications}
                      onChange={(e) => handleInputChange('notifications', e.target.checked)}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-600/50 rounded bg-slate-700/50"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-white/80">
                      Enable email notifications
                    </label>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>

              {/* Account Actions */}
              <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Account Actions</h2>
                <div className="space-y-4">
                  <button className="w-full bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 py-3 px-6 rounded-lg transition-colors">
                    Export Data
                  </button>
                  <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-3 px-6 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}