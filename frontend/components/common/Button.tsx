'use client'

import { LoadingSpinner } from './LoadingSpinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  fullWidth?: boolean
  icon?: React.ReactNode
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border border-primary text-primary hover:bg-primary/5',
  success: 'bg-success text-white hover:bg-success-dark',
  warning: 'bg-warning text-white hover:bg-warning-dark',
  error: 'bg-error text-white hover:bg-error-dark',
}

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Cargando...',
  fullWidth = false,
  icon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center gap-2
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
