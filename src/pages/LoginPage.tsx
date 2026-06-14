import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@organisms/LoginForm'
import { Icon } from '@atoms/Icon'
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
    <main className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-card border border-hairline shadow-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Icon name="paw" tone="brand" framed label="Stokeshire" className="mx-auto mb-4" />
            <Typography variant="h2" color="primary">
              Welcome back
            </Typography>
            <Typography variant="body" color="secondary" className="mt-1">
              Sign in to view profile
            </Typography>
          </div>

          {/* Form */}
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} errorMessage={error} />
        </div>
      </div>
    </main>
  )
}

export default LoginPage
