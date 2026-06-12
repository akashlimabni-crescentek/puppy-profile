import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Session } from '@supabase/supabase-js'
import type { AuthState, AuthUser, LoginCredentials } from '@app-types/auth.types'

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state, _action: PayloadAction<LoginCredentials>) {
      state.isLoading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ user: AuthUser; session: Session }>) {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.session = action.payload.session
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
      state.session = null
      state.error = null
    },
    setSession(state, action: PayloadAction<{ user: AuthUser; session: Session }>) {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.session = action.payload.session
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  setSession,
  clearError,
} = authSlice.actions

export default authSlice.reducer
