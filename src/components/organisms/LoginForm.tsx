import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@atoms/Input'
import { Button } from '@atoms/Button'
import { Typography } from '@atoms/Typography'
import type { LoginFormValues } from '@app-types/auth.types'

export interface LoginFormProps {
  /** Called on valid form submission with credentials */
  onSubmit: (values: LoginFormValues) => void
  /** Whether the login request is in flight */
  isLoading?: boolean
  /** Error message from the auth slice */
  errorMessage?: string | null
}

/**
 * Zod schema for login form validation.
 * Defined outside the component — not recreated on every render.
 */
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

/**
 * Organism: LoginForm
 * Email/password form using React Hook Form + Zod.
 * Zero re-renders during typing — React Hook Form handles this natively.
 * Validation runs on submit, then on change after first submission attempt.
 */
export const LoginForm = memo<LoginFormProps>(({ onSubmit, isLoading = false, errorMessage }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const handleFormSubmit = useCallback(
    (values: LoginFormValues) => {
      onSubmit(values)
    },
    [onSubmit]
  )

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-5">
      {/* Auth-level error (wrong credentials, etc.) */}
      {errorMessage && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Typography variant="bodySmall" color="error">
            {errorMessage}
          </Typography>
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
        errorMessage={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        errorMessage={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
})

LoginForm.displayName = 'LoginForm'
