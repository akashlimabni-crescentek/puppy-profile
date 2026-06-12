import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

/**
 * Only family-tier users are allowed access.
 * The RLS policy on the puppies table enforces this at the DB level.
 * The saga enforces it at the application level as a second check.
 */
export type UserRole = 'family' | 'admin'

export interface AuthState {
  user: AuthUser | null
  session: Session | null
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

/** Maps a Supabase User to our AuthUser shape */
export const mapSupabaseUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
  role: (user.user_metadata?.role as UserRole) ?? 'family',
})
