/**
 * Pre-flight environment validation.
 *
 * Runs BEFORE `vite` (dev server) or `vite build` for a given mode, so a missing
 * or placeholder variable fails fast at the terminal instead of crashing later
 * in the browser. Uses Vite's own `loadEnv`, so it resolves the exact same files
 * Vite will (`.env`, `.env.local`, `.env.[mode]`, `.env.[mode].local`).
 *
 * Usage: node scripts/check-env.mjs <mode>
 *   where <mode> is one of: dev | qa | stage | production
 */
import { loadEnv } from 'vite'

const VALID_MODES = ['dev', 'qa', 'stage', 'production']

// Variables that must be present and non-placeholder in every environment.
const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

// Values copied verbatim from .env.example mean the file was never filled in.
const PLACEHOLDERS = ['your-project-ref', 'your-anon-key-here', 'changeme']

const fail = (message) => {
  console.error(`\n\x1b[31m✖ Environment check failed\x1b[0m\n${message}\n`)
  process.exit(1)
}

const mode = process.argv[2]

if (!mode) {
  fail(`No mode provided.\nUsage: node scripts/check-env.mjs <${VALID_MODES.join(' | ')}>`)
}

if (!VALID_MODES.includes(mode)) {
  fail(`Unknown mode "${mode}".\nValid modes: ${VALID_MODES.join(', ')}`)
}

// Load every VITE_-prefixed variable exactly as Vite would for this mode.
const env = loadEnv(mode, process.cwd(), 'VITE_')

const problems = []

for (const key of REQUIRED) {
  const value = env[key]?.trim()
  if (!value) {
    problems.push(`  - ${key} is missing or empty`)
  } else if (PLACEHOLDERS.some((p) => value.includes(p))) {
    problems.push(`  - ${key} still holds a placeholder value ("${value}")`)
  }
}

// Belt-and-suspenders: the service_role key must NEVER reach the browser bundle.
for (const key of Object.keys(env)) {
  if (key.toLowerCase().includes('service_role') || env[key]?.includes('service_role')) {
    problems.push(`  - ${key} looks like a service_role secret — never expose it via VITE_`)
  }
}

if (problems.length > 0) {
  fail(
    `Mode "${mode}" is missing required configuration:\n\n${problems.join('\n')}\n\n` +
      `Add the missing value(s) to .env.${mode} (or .env.${mode}.local for secrets).\n` +
      `Each environment's file is self-contained — the base .env holds no secrets.\n` +
      `See .env.example for the full list of variables.`
  )
}

console.log(`\x1b[32m✔ Environment OK\x1b[0m  mode=${mode}  (VITE_APP_ENV=${env.VITE_APP_ENV ?? 'unset'})`)
