'use client'

import { Database } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  fullHeight?: boolean
}

export function EmptyState({
  title = 'Sin datos',
  message = 'No hay elementos para mostrar.',
  icon,
  action,
  fullHeight = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'h-screen' : 'h-64'
      } w-full`}
    >
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-4">
          {icon || <Database className="w-12 h-12 text-muted-foreground" />}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        {action && (
          <button onClick={action.onClick} className="btn-primary">
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
