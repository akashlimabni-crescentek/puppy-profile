import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { loginRequest, logoutRequest, clearError } from '@store/authSlice'
import type { LoginCredentials } from '@app-types/auth.types'

/**
 * Clean interface over the auth slice.
 * All components use this hook — none import from the store directly.
 * useCallback ensures stable function references — no re-renders from new function refs.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, isInitializing, isLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  )

  const login = useCallback(
    (credentials: LoginCredentials) => {
      dispatch(loginRequest(credentials))
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutRequest())
  }, [dispatch])

  const dismissError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return { user, isInitializing, isLoading, isAuthenticated, error, login, logout, dismissError }
}
