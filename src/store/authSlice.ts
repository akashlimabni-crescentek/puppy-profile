import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser, LoginCredentials } from '@app-types/auth.types'

const initialState: AuthState = {
  user: null,
  isInitializing: true,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Dispatched once at app boot — triggers the session-restore saga. */
    initializeAuth() {
      // No state change — this action only triggers the boot saga.
    },
    /** Marks the one-time boot session-restore as finished (success or not). */
    authInitialized(state) {
      state.isInitializing = false
    },
    loginRequest(state, _action: PayloadAction<LoginCredentials>) {
      state.isLoading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ user: AuthUser }>) {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.error = null
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.isAuthenticated = false
      state.error = action.payload
    },
    logoutRequest(state) {
      state.isLoading = true
    },
    logoutSuccess(state) {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.error = null
    },
    /** Restores an existing session into Redux (boot restore + cross-tab sync). */
    setSession(state, action: PayloadAction<{ user: AuthUser }>) {
      state.isAuthenticated = true
      state.user = action.payload.user
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const {
  initializeAuth,
  authInitialized,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  setSession,
  clearError,
} = authSlice.actions

export default authSlice.reducer
