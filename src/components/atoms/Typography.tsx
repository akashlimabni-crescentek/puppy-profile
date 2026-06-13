import { memo, type ElementType, type ReactNode } from 'react'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'caption'

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'success'
  | 'warning'
  | 'error'

export interface TypographyProps {
  /** Text or node content */
  children: ReactNode
  /** Visual style variant */
  variant?: TypographyVariant
  /** Text color */
  color?: TypographyColor
  /** Override the rendered HTML element */
  as?: ElementType
  /** Additional Tailwind classes */
  className?: string
}

const variantClasses: Record<TypographyVariant, string> = {
  // Display headers (incl. the puppy name) — Cormorant Garamond
  h1: 'font-display text-4xl font-bold leading-tight',
  h2: 'font-display text-3xl font-semibold leading-tight',
  h3: 'font-display text-2xl font-semibold leading-snug',
  // UI / body / labels — Jost
  h4: 'font-sans text-lg font-semibold leading-snug',
  body: 'font-sans text-base font-normal leading-relaxed',
  bodySmall: 'font-sans text-sm font-normal leading-relaxed',
  label: 'font-sans text-sm font-medium leading-none',
  caption: 'font-sans text-xs font-normal leading-none',
}

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  bodySmall: 'p',
  label: 'span',
  caption: 'span',
}

const colorClasses: Record<TypographyColor, string> = {
  primary: 'text-ink',
  secondary: 'text-slate',
  muted: 'text-tan-dark',
  inverse: 'text-cream',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

/**
 * Atom: Typography
 * All text in the app uses this component.
 * Ensures consistent font sizing, weight, and color across the UI:
 * Cormorant Garamond for display headers, Jost for body/UI/labels.
 */
export const Typography = memo<TypographyProps>(
  ({ children, variant = 'body', color = 'primary', as, className = '' }) => {
    const Tag = as ?? defaultElements[variant]
    return (
      <Tag className={`${variantClasses[variant]} ${colorClasses[color]} ${className}`}>
        {children}
      </Tag>
    )
  }
)

Typography.displayName = 'Typography'
