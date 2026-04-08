import React from 'react'

interface NotificationBadgeProps {
  count: number
  type?: 'medication' | 'appointment' | 'default'
  maxCount?: number
  className?: string
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  type = 'default',
  maxCount = 99,
  className
}) => {
  const getColors = (badgeType: string) => {
    switch (badgeType) {
      case 'medication':
        return 'bg-blue-500 text-white'
      case 'appointment':
        return 'bg-green-500 text-white'
      case 'default':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count

  if (count === 0) return null

  return (
    <span className={`
      inline-flex items-center justify-center
      w-6 h-6 text-xs font-bold rounded-full
      ${getColors(type)}
      ${className || ''}
    `}>
      {displayCount}
    </span>
  )
}
