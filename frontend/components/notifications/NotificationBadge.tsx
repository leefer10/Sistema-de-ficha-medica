'use client'

import React from 'react'
import { Bell } from 'lucide-react'

interface NotificationBadgeProps {
  count: number
  onClick?: () => void
  className?: string
  type?: 'medication' | 'appointment' | 'general'
}

const typeStyles = {
  medication: {
    icon: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    pulse: 'animate-pulse text-blue-600'
  },
  appointment: {
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    pulse: 'animate-pulse text-green-600'
  },
  general: {
    icon: 'text-gray-600',
    badge: 'bg-gray-100 text-gray-700',
    pulse: 'animate-pulse text-gray-600'
  }
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  onClick,
  className = '',
  type = 'general'
}) => {
  const style = typeStyles[type]
  const hasNotifications = count > 0

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      aria-label={`Notificaciones (${count})`}
    >
      <Bell
        className={`w-5 h-5 ${hasNotifications ? style.pulse : style.icon}`}
      />
      
      {hasNotifications && (
        <span
          className={`absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none ${style.badge} rounded-full`}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
