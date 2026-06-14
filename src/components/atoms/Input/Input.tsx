import { memo, forwardRef, type InputHTMLAttributes } from 'react'
import { Icon } from '@atoms/Icon/Icon'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text */
  label: string
  /** Validation error message */
  errorMessage?: string
  /** Helper text shown below input when no error */
  helperText?: string
}

/**
 * Atom: Input
 * Accessible form input with label, validation error, and helper text.
 * forwardRef is required for React Hook Form to register it properly.
 */
export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ label, errorMessage, helperText, id, className = '', ...props }, ref) => {
      const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`
      const hasError = Boolean(errorMessage)

      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={inputId} className="text-sm font-medium text-ink">
            {label}
            {props.required && (
              <span className="text-error ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>

          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={`
              w-full px-4 py-3 rounded-xl border text-base text-ink
              placeholder:text-slate bg-white transition-colors outline-none
              focus:ring-2 focus:ring-copper focus:border-copper
              ${hasError ? 'border-error focus:ring-error' : 'border-tan-dark hover:border-copper-light'}
              ${className}
            `}
            {...props}
          />

          {hasError && (
            <span
              id={`${inputId}-error`}
              role="alert"
              className="text-xs text-error flex items-center gap-1"
            >
              <Icon name="alertCircle" size={13} strokeWidth={1.75} />
              {errorMessage}
            </span>
          )}

          {helperText && !hasError && (
            <span id={`${inputId}-helper`} className="text-xs text-slate">
              {helperText}
            </span>
          )}
        </div>
      )
    }
  )
)

Input.displayName = 'Input'
