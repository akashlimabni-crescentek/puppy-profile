import { createClient } from '@supabase/supabase-js'
import { env } from '@utils/validateEnv'

/**
 * Supabase client singleton.
 * Initialized once — imported everywhere, never re-created.
 *
 * RLS policy on the puppies table ensures a family user can ONLY read
 * their own family's record. This is enforced at the Postgres level,
 * not just application level.
 *
 * TODO: When client provides staging credentials, add them to .env
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Email/password only — no magic-link/OAuth redirect to parse from the URL.
    detectSessionInUrl: false,
  },
})
