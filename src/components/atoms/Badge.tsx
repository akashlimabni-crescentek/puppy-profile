import { memo, type ReactNode } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  /** Text displayed inside the badge */
  label: string
  /** Color and semantic variant */
  variant?: BadgeVariant
  /** Size of the badge */
  size?: BadgeSize
  /** Optional leading icon node (e.g. a Lucide icon) */
  icon?: ReactNode
  /** Additional Tailwind classes */
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  info: 'bg-blue/25 text-ink',
  neutral: 'bg-tan-light text-ink',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
}

/**
 * Atom: Badge
 * Pill-shaped label for statuses, tags, and attributes.
 * Variants map to semantic meanings: success=healthy, warning=attention, error=urgent.
 */
export const Badge = memo<BadgeProps>(
  ({ label, variant = 'neutral', size = 'sm', icon, className = '' }) => (
    <span
      className={`
      inline-flex items-center gap-1 font-medium rounded-full
      ${variantClasses[variant]} ${sizeClasses[size]} ${className}
    `}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </span>
  )
)

Badge.displayName = 'Badge'
