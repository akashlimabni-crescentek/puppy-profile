/**
 * Validates all required environment variables at application boot.
 * Called once in main.tsx BEFORE the React tree mounts.
 * Throws a descriptive error so developers never deploy with missing config.
 */

interface EnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  appName: string
  appEnv: string
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

  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    appName: (import.meta.env.VITE_APP_NAME as string) ?? 'Puppy Profile',
    appEnv: (import.meta.env.VITE_APP_ENV as string) ?? 'development',
  }
}

export const env = validateEnv()
