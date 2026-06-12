import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

/**
 * Only family-tier users are allowed access (client requirement #1).
 * The RLS policy on the puppies table is the primary, DB-level enforcement.
 * The saga enforces the same rule at the application level as a second check.
 */
export type UserRole = 'family'

export interface AuthState {
  user: AuthUser | null
  /**
   * True until the one-time session-restore on boot completes.
   * Gates the router so a logged-in user is never flash-redirected to /login
   * on a hard refresh while the persisted session is being read back.
   */
  isInitializing: boolean
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginFormValues {
  email: string
  password: string
}

/**
 * Reads the authorization role from `app_metadata`, which is server-controlled
 * and NOT writable by the end user (unlike `user_metadata`). Trusting
 * `user_metadata` for authorization would let any user grant themselves access.
 *
 * TODO: Confirm with the client where the family role lives once the staging
 * schema arrives — it may instead be a row in a `profiles` table behind RLS.
 */
export const getUserRole = (user: User): string | undefined =>
  user.app_metadata?.role as string | undefined

/**
 * Maps a Supabase User to our AuthUser shape.
 * Callers MUST verify the role is 'family' via getUserRole BEFORE calling this
 * (see authSaga); a missing or unknown role is treated as access-denied.
 */
export const mapSupabaseUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
  role: 'family',
})
