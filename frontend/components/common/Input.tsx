'use client'

import { AlertCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export function Input({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  className,
  ...props
}: InputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={`
            input-base
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-error focus:ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-sm text-error flex items-center gap-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  )
}
