'use client'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const variantClasses = {
  default: 'bg-background border border-border',
  elevated: 'bg-background shadow-md',
  outlined: 'bg-background-secondary border border-border',
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        rounded-lg transition-shadow duration-200
        hover:shadow-md
        ${className}
      `}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={`mb-4 pb-4 border-b border-border ${className}`} {...props} />
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-foreground ${className}`} {...props} />
  )
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={`space-y-4 ${className}`} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={`flex gap-3 pt-4 border-t border-border ${className}`} {...props} />
  )
}
