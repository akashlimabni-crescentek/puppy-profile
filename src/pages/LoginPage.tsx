import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@organisms/LoginForm'
import { Typography } from '@atoms/Typography'
import { useAuth } from '@hooks/useAuth'
import type { LoginFormValues } from '@app-types/auth.types'

/**
 * Page: LoginPage
 * Renders the login form. Redirects to /profile if already authenticated.
 * Connects to Redux auth state via useAuth hook — no direct store imports.
 */
const LoginPage = () => {
  const { login, isLoading, isAuthenticated, error, dismissError } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in — prevents logged-in users seeing login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (values: LoginFormValues) => {
    dismissError()
    login(values)
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50
                     flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4" role="img" aria-label="Puppy paw">
              🐾
            </div>
            <Typography variant="h2" color="primary">
              Welcome back
            </Typography>
            <Typography variant="body" color="secondary" className="mt-1">
              Sign in to view your puppy&apos;s profile
            </Typography>
          </div>

          {/* Form */}
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={error} />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          Family accounts only. Contact your administrator for access.
        </p>
      </div>
    </main>
  )
}

export default LoginPage
