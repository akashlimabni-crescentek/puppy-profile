import { memo } from 'react'

export interface SkeletonProps {
  /** Tailwind width class e.g. "w-full", "w-32" */
  width?: string
  /** Tailwind height class e.g. "h-4", "h-16" */
  height?: string
  /** Renders as a circle (for avatar placeholders) */
  circle?: boolean
  /** Additional Tailwind classes */
  className?: string
}

/**
 * Atom: Skeleton
 * Animated loading placeholder.
 * Used to build skeleton screens that mirror the actual card layout.
 * Always prefer skeleton over spinner for content-loading states.
 */
export const Skeleton = memo<SkeletonProps>(
  ({ width = 'w-full', height = 'h-4', circle = false, className = '' }) => (
    <div
      aria-hidden="true"
      className={`
      animate-pulse bg-neutral-200
      ${circle ? 'rounded-full' : 'rounded-md'}
      ${width} ${height} ${className}
    `}
    />
  )
)

Skeleton.displayName = 'Skeleton'
