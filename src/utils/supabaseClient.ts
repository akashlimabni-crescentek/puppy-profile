import { createClient } from '@supabase/supabase-js'
import { env } from '@utils/validateEnv'

/**
 * Supabase client singleton.
 * Initialized once — imported everywhere, never re-created.
 *
 * RLS policies on the families and puppies tables ensure a logged-in user can
 * ONLY read their own family row (auth_user_id = auth.uid()) and that family's
 * puppies. This is enforced at the Postgres level, not just the app level.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Email/password only — no magic-link/OAuth redirect to parse from the URL.
    detectSessionInUrl: false,
  },
})
