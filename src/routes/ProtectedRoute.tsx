import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

/**
 * ProtectedRoute
 * Guards any route that requires authentication.
 * If not authenticated, redirects to /login with the intended path saved in state.
 * Uses Outlet so it can wrap nested routes in the router config.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Still checking auth state — render nothing to prevent flash
  if (isLoading) return null

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

ProtectedRoute.displayName = 'ProtectedRoute'
