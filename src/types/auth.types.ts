import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

/**
 * The app is family-only (client requirement #1). Authorization is enforced by
 * Supabase RLS: a logged-in user can only read the family row scoped to their
 * own auth.uid(), and only their family's puppies. 'family' is therefore the one
 * nominal role every authenticated user carries — RLS, not this field, decides
 * what data they can actually see. See DECISIONS.md §3 for why we do not gate on
 * a metadata role (the staging user has none) and never trust user_metadata.
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
 * Maps a Supabase User to our AuthUser shape.
 *
 * No metadata role check happens here or at the call site: the staging user has
 * no `app_metadata.role`, and `user_metadata` (which carries a `tier: 'family'`
 * flag) is end-user-writable and must never be trusted for authorization. RLS is
 * the authority — the RLS-scoped family/puppy read is what grants or denies
 * access to data. See DECISIONS.md §3.
 */
export const mapSupabaseUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
  role: 'family',
})
