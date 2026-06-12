import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { supabase } from '@utils/supabaseClient'
import { mapSupabaseUser, type LoginCredentials } from '@app-types/auth.types'
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
} from '@store/authSlice'
import { resetPuppy } from '@store/puppySlice'

/**
 * Handles login side effects.
 * takeLatest: if login is triggered multiple times, only the last call runs.
 * Enforces family-tier role at the application level after Supabase auth.
 */
function* handleLogin(action: PayloadAction<LoginCredentials>) {
  try {
    const { data, error } = yield call([supabase.auth, supabase.auth.signInWithPassword], {
      email: action.payload.email,
      password: action.payload.password,
    })

    if (error) {
      yield put(loginFailure(error.message))
      return
    }

    if (!data.user || !data.session) {
      yield put(loginFailure('Login failed. Please try again.'))
      return
    }

    const user = mapSupabaseUser(data.user)

    // Application-level role enforcement (RLS is the primary DB-level enforcement)
    if (user.role !== 'family' && user.role !== 'admin') {
      yield put(loginFailure('Access denied. Family account required.'))
      yield call([supabase.auth, supabase.auth.signOut])
      return
    }

    yield put(loginSuccess({ user, session: data.session }))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    yield put(loginFailure(message))
  }
}

function* handleLogout() {
  try {
    yield call([supabase.auth, supabase.auth.signOut])
  } catch {
    // Swallow remote signOut errors — always clear local state
  } finally {
    yield put(logoutSuccess())
    yield put(resetPuppy())
  }
}

export function* watchAuth() {
  yield takeLatest(loginRequest.type, handleLogin)
  yield takeLatest(logoutRequest.type, handleLogout)
}
