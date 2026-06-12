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
  h1: 'text-3xl font-semibold leading-tight',
  h2: 'text-2xl font-semibold leading-tight',
  h3: 'text-xl font-medium leading-snug',
  h4: 'text-lg font-medium leading-snug',
  body: 'text-base font-normal leading-relaxed',
  bodySmall: 'text-sm font-normal leading-relaxed',
  label: 'text-sm font-medium leading-none',
  caption: 'text-xs font-normal leading-none',
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
  primary: 'text-neutral-900',
  secondary: 'text-neutral-600',
  muted: 'text-neutral-400',
  inverse: 'text-white',
  success: 'text-green-700',
  warning: 'text-yellow-700',
  error: 'text-red-700',
}

/**
 * Atom: Typography
 * All text in the app uses this component.
 * Ensures consistent font sizing, weight, and color across the UI.
 * TODO: Update variant classes when client provides typography tokens.
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
