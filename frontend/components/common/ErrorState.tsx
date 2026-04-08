'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  fullHeight?: boolean
}

export function ErrorState({
  title = 'Error al cargar',
  message = 'Ocurrió un error. Por favor, intenta de nuevo.',
  onRetry,
  fullHeight = false,
}: ErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'h-screen' : 'h-64'
      } w-full`}
    >
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 btn-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  )
}
