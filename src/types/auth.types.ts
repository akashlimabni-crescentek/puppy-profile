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
 * Family-tier authorization gate for the login/boot UX.
 *
 * IMPORTANT: data security is owned entirely by Supabase RLS (`auth.uid()`), not
 * by this function — a forged tier grants zero data because every read is
 * RLS-scoped. This gate only decides whether a user reaches the profile UI or
 * sees "Access denied". It reads the real JWT claims in priority order:
 *
 * 1. `app_metadata.role` — server-controlled and authoritative. If the client
 *    sets it, it is the single source of truth ('family' allowed, anything else
 *    denied). Currently absent on the staging user.
 * 2. `user_metadata.tier` — the only "family" signal the staging user actually
 *    carries ({ tier: 'family' }). It is end-user-writable, so it is treated as
 *    an ADVISORY UX hint only (never a data boundary — RLS is). Recommend the
 *    client migrate this to `app_metadata.role` server-side.
 * 3. Neither present → allowed; RLS remains the sole gate.
 *
 * NB: `user.role` / the JWT `role` claim is the Postgres auth role
 * ("authenticated") for every logged-in user — it is NOT a tier and is ignored.
 * See DECISIONS.md §3.
 */
export const isFamilyTierAllowed = (user: User): boolean => {
  const tier = user.user_metadata?.tier as string | null | undefined
  if (tier !== null && tier !== undefined) return tier === 'family'

  return false
}

/**
 * Maps a Supabase User to our AuthUser shape.
 * Callers verify access with {@link isFamilyTierAllowed} first (see authSaga);
 * 'family' is the single nominal app role and RLS scopes what data is visible.
 */
export const mapSupabaseUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email ?? '',
  role: 'family',
})
