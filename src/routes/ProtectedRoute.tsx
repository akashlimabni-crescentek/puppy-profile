import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { PuppyCardSkeleton } from '@molecules/PuppyCardSkeleton'

/**
 * ProtectedRoute
 * Guards any route that requires authentication.
 *
 * While the one-time boot session-restore is running (isInitializing), we show
 * the skeleton rather than redirecting — otherwise a hard refresh at /profile
 * would flash-redirect a logged-in user to /login before the persisted session
 * is read back. Once restore finishes, the auth gate decides cleanly.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
        <PuppyCardSkeleton />
      </main>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

ProtectedRoute.displayName = 'ProtectedRoute'
