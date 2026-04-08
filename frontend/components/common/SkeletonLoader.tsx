'use client'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-background-tertiary animate-pulse rounded-md ${className}`}
      aria-busy="true"
      aria-label="Cargando..."
    />
  )
}

interface SkeletonListProps {
  count?: number
  itemHeight?: string
}

export function SkeletonList({ count = 3, itemHeight = 'h-16' }: SkeletonListProps) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`w-full ${itemHeight}`} />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  count?: number
  cols?: 1 | 2 | 3
}

export function SkeletonCard({ count = 3, cols = 3 }: SkeletonCardProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className={`grid ${colsClass[cols]} gap-4 w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      ))}
    </div>
  )
}

interface SkeletonTextProps {
  lines?: number
}

export function SkeletonText({ lines = 3 }: SkeletonTextProps) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`w-full h-4 ${i === lines - 1 ? 'w-2/3' : ''}`} />
      ))}
    </div>
  )
}
