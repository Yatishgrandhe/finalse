'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationSystemProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export default function NotificationSystem({ 
  notifications, 
  onMarkAsRead, 
  onClearAll 
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10'
      case 'error':
        return 'border-red-500/50 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10'
      case 'info':
        return 'border-blue-500/50 bg-blue-500/10'
      default:
        return 'border-slate-500/50 bg-slate-500/10'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 z-50">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex space-x-2">
                <button
                  onClick={onClearAll}
                  className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white/80 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-white/60">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer ${
                    !notification.read ? 'bg-slate-700/20' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                      <p className="text-sm text-white/70 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="text-xs text-white/50 mt-2">
                        {notification.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-slate-700/50">
              <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const clearRead = () => {
    setNotifications(prev => prev.filter(n => !n.read))
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    clearRead
  }
}
