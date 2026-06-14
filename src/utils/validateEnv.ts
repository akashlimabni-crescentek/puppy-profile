/**
 * Validates all required environment variables at application boot.
 * Called once in main.tsx BEFORE the React tree mounts.
 * Throws a descriptive error so developers never deploy with missing config.
 *
 * This is the runtime (browser) guard. A matching build-time guard runs in
 * `scripts/check-env.mjs` before `vite` / `vite build` so problems surface at
 * the terminal too.
 */

/** The four deployment environments, selected via Vite's --mode flag. */
export type AppEnv = 'dev' | 'qa' | 'stage' | 'production'

const APP_ENVS: readonly AppEnv[] = ['dev', 'qa', 'stage', 'production']

interface EnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  appName: string
  appEnv: AppEnv
}

const validateEnv = (): EnvConfig => {
  const required: Record<string, string | undefined> = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing
        .map((k) => `  - ${k}`)
        .join('\n')}\n\nCopy .env.example to .env and fill in the values.`
    )
  }

  const rawAppEnv = import.meta.env.VITE_APP_ENV as string | undefined
  const appEnv: AppEnv = APP_ENVS.includes(rawAppEnv as AppEnv) ? (rawAppEnv as AppEnv) : 'dev'

  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    appName: (import.meta.env.VITE_APP_NAME as string) ?? 'Puppy Profile',
    appEnv,
  }
}

export const env = validateEnv()
