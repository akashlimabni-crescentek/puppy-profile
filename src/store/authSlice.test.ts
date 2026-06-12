import { describe, it, expect } from 'vitest'
import authReducer, {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  clearError,
} from './authSlice'
import type { AuthState } from '@app-types/auth.types'

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

describe('authSlice', () => {
  it('sets isLoading on loginRequest', () => {
    const state = authReducer(
      initialState,
      loginRequest({ email: 'test@test.com', password: 'pass' })
    )
    expect(state.isLoading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('sets authenticated state on loginSuccess', () => {
    const mockUser = { id: '1', email: 'test@test.com', role: 'family' as const }
    // access_token is the real Supabase Session field name (external snake_case API shape)
    // eslint-disable-next-line camelcase
    const mockSession = { access_token: 'token' } as never
    const state = authReducer(initialState, loginSuccess({ user: mockUser, session: mockSession }))
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(mockUser)
    expect(state.isLoading).toBe(false)
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
      isAuthenticated: true,
      user: { id: '1', email: 'test@test.com', role: 'family' },
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
