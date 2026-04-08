'use client'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  error: 'bg-error/20 text-error',
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function Badge({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-full font-medium inline-flex items-center gap-1
        ${className}
      `}
      {...props}
    />
  )
}
