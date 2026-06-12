import { memo, forwardRef, type InputHTMLAttributes } from 'react'

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
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
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
              w-full px-4 py-3 rounded-xl border text-base text-neutral-900
              placeholder:text-neutral-400 bg-white transition-colors outline-none
              focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              ${
                hasError
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-neutral-300 hover:border-neutral-400'
              }
              ${className}
            `}
            {...props}
          />

          {hasError && (
            <span
              id={`${inputId}-error`}
              role="alert"
              className="text-xs text-red-600 flex items-center gap-1"
            >
              <span aria-hidden="true">⚠</span> {errorMessage}
            </span>
          )}

          {helperText && !hasError && (
            <span id={`${inputId}-helper`} className="text-xs text-neutral-400">
              {helperText}
            </span>
          )}
        </div>
      )
    }
  )
)

Input.displayName = 'Input'
