import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label or content */
  children: ReactNode
  /** Visual style variant */
  variant?: ButtonVariant
  /** Size */
  size?: ButtonSize
  /** Shows loading spinner and disables button */
  isLoading?: boolean
  /** Makes button full width */
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  // Primary CTA — the one place copper signals the main action.
  primary: 'bg-copper text-cream hover:bg-copper-dark focus:ring-copper disabled:bg-copper-light',
  secondary: 'bg-white text-ink border border-hairline hover:bg-tan-light focus:ring-copper',
  // Ghost (e.g. Sign out) — deliberately not copper.
  ghost: 'bg-transparent text-slate hover:bg-tan-light focus:ring-copper',
  danger: 'bg-error text-cream hover:opacity-90 focus:ring-error disabled:opacity-70',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

/**
 * Atom: Button
 * Primary interactive element. Handles all variants, sizes, loading, and disabled states.
 */
export const Button = memo<ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    className = '',
    ...props
  }) => (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-70
      ${variantClasses[variant]} ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''} ${className}
    `}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
)

Button.displayName = 'Button'
