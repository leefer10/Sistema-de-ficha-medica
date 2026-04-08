import React from 'react'

interface BaseCardProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  empty?: boolean
  className?: string
}

export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  icon,
  children,
  action,
  empty,
  className
}) => {
  const getActionButtonClass = (variant: string = 'primary') => {
    const baseClass = 'text-sm font-medium px-3 py-1 rounded transition-colors duration-200'
    switch (variant) {
      case 'primary':
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`
      case 'secondary':
        return `${baseClass} bg-gray-200 text-gray-800 hover:bg-gray-300`
      case 'ghost':
        return `${baseClass} text-gray-600 hover:text-gray-900`
      default:
        return baseClass
    }
  }

  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg p-6 shadow-sm
      hover:shadow-md transition-shadow duration-200
      ${className || ''}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className={getActionButtonClass(action.variant)}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      {empty ? (
        <p className="text-gray-500 text-center py-8">
          No hay datos disponibles
        </p>
      ) : (
        <div className="text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}
