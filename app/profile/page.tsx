'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../lib/auth-context-supabase'

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    theme: 'dark',
    notifications: true,
    currency: 'USD'
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        theme: user.preferences?.theme || 'dark',
        notifications: user.preferences?.notifications ?? true,
        currency: (user.preferences as any)?.currency || 'USD'
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile({
        name: formData.name,
        preferences: {
          theme: formData.theme,
          notifications: formData.notifications,
          currency: formData.currency
        }
      })

      if (result.success) {
        alert('Profile updated successfully!')
      } else {
        alert(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
              <p className="text-white/60">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white/60 cursor-not-allowed"
                      />
                      <p className="text-sm text-white/40 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-white/80 mb-2">
                        Preferred Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-white/80 mb-2">
                        Theme Preference
                      </label>
                      <select
                        id="theme"
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-600/50 rounded bg-slate-700/50"
                      />
                      <label htmlFor="notifications" className="ml-2 block text-sm text-white/80">
                        Enable email notifications
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Account Summary */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Account Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Member since:</span>
                      <span className="text-white">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Last login:</span>
                      <span className="text-white">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Email verified:</span>
                      <span className="text-green-400">
                        {user.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded-lg transition-colors">
                      Change Password
                    </button>
                    <button className="w-full bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 py-2 px-4 rounded-lg transition-colors">
                      Export Data
                    </button>
                    <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}