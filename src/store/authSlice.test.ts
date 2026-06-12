import { describe, it, expect } from 'vitest'
import authReducer, {
  authInitialized,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  setSession,
  clearError,
} from './authSlice'
import type { AuthState, AuthUser } from '@app-types/auth.types'

const initialState: AuthState = {
  user: null,
  isInitializing: true,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

const mockUser: AuthUser = { id: '1', email: 'test@test.com', role: 'family' }

describe('authSlice', () => {
  it('starts in the initializing state', () => {
    expect(initialState.isInitializing).toBe(true)
  })

  it('clears the initializing flag on authInitialized', () => {
    const state = authReducer(initialState, authInitialized())
    expect(state.isInitializing).toBe(false)
  })

  it('sets isLoading on loginRequest', () => {
    const state = authReducer(
      initialState,
      loginRequest({ email: 'test@test.com', password: 'pass' })
    )
    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('sets authenticated state on loginSuccess (no session stored in Redux)', () => {
    const state = authReducer(initialState, loginSuccess({ user: mockUser }))
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockUser)
    expect(state.isLoading).toBe(false)
    // Redux holds only the minimal AuthUser — never the Supabase Session object.
    expect(state).not.toHaveProperty('session')
  })

  it('restores a session into state on setSession', () => {
    const state = authReducer(initialState, setSession({ user: mockUser }))
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockUser)
  })

  it('sets error on loginFailure', () => {
    const state = authReducer(initialState, loginFailure('Invalid credentials'))
    expect(state.error).toBe('Invalid credentials')
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
  })

  it('clears all auth state on logoutSuccess', () => {
    const loggedInState: AuthState = {
      ...initialState,
      isInitializing: false,
      isAuthenticated: true,
      user: mockUser,
    }
    const state = authReducer(loggedInState, logoutSuccess())
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('clears error on clearError', () => {
    const errorState = { ...initialState, error: 'Some error' }
    const state = authReducer(errorState, clearError())
    expect(state.error).toBeNull()
  })
})
