import { call, put, take, fork, takeLatest } from 'redux-saga/effects'
import { eventChannel, type EventChannel } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@utils/supabaseClient'
import { mapSupabaseUser, getUserRole, type LoginCredentials } from '@app-types/auth.types'
import {
  initializeAuth,
  authInitialized,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  setSession,
} from '@store/authSlice'
import { resetPuppy } from '@store/puppySlice'

/**
 * Single source of truth for the "is this user allowed in?" decision.
 * Family-tier only (requirement #1): an explicit 'family' role is required.
 * A missing or unknown role is access-denied — we never default-grant.
 */
const isFamilyUser = (user: Session['user']): boolean => getUserRole(user) === 'family'

/**
 * Handles login side effects.
 * takeLatest: if login is triggered multiple times, only the last call runs.
 * Enforces the family-tier role at the application level after Supabase auth.
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

    // Application-level role enforcement (RLS is the primary DB-level enforcement).
    if (!isFamilyUser(data.user)) {
      yield call([supabase.auth, supabase.auth.signOut])
      yield put(loginFailure('Access denied. This app is for family accounts only.'))
      return
    }

    yield put(loginSuccess({ user: mapSupabaseUser(data.user) }))
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

/**
 * One-time session restore on boot.
 * Reads the session Supabase persisted in localStorage back into Redux so a
 * hard refresh on the deployed URL keeps the user logged in. Always finishes
 * by flipping isInitializing off, so the router can stop showing the skeleton.
 */
function* handleInitializeAuth() {
  try {
    const {
      data: { session },
    } = yield call([supabase.auth, supabase.auth.getSession])

    if (session?.user) {
      if (isFamilyUser(session.user)) {
        yield put(setSession({ user: mapSupabaseUser(session.user) }))
      } else {
        // A persisted session that no longer satisfies the family rule → sign out.
        yield call([supabase.auth, supabase.auth.signOut])
      }
    }
  } catch {
    // Treat any restore failure as "logged out"; never block app boot.
  } finally {
    yield put(authInitialized())
  }
}

/** Bridges Supabase's auth-state callback into a saga-consumable channel. */
function createAuthChannel(): EventChannel<{ event: AuthChangeEvent; session: Session | null }> {
  return eventChannel((emit) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      emit({ event, session })
    })
    return () => subscription.unsubscribe()
  })
}

/**
 * Keeps Redux in sync with Supabase auth events that originate outside the
 * login form — token refresh, and sign-out in another tab. We only react to
 * SIGNED_OUT here: the initial session is restored by handleInitializeAuth, and
 * reacting to SIGNED_IN/TOKEN_REFRESHED would risk redundant dispatches.
 */
function* watchAuthStateChanges() {
  const channel = createAuthChannel()
  while (true) {
    const { event } = (yield take(channel)) as { event: AuthChangeEvent }
    if (event === 'SIGNED_OUT') {
      yield put(logoutSuccess())
      yield put(resetPuppy())
    }
  }
}

export function* watchAuth() {
  yield fork(watchAuthStateChanges)
  yield takeLatest(initializeAuth.type, handleInitializeAuth)
  yield takeLatest(loginRequest.type, handleLogin)
  yield takeLatest(logoutRequest.type, handleLogout)
}
