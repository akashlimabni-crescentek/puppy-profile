import { memo } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  /** Text displayed inside the badge */
  label: string
  /** Color and semantic variant */
  variant?: BadgeVariant
  /** Size of the badge */
  size?: BadgeSize
  /** Optional leading icon (emoji or character) */
  icon?: string
  /** Additional Tailwind classes */
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-neutral-100 text-neutral-700',
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
