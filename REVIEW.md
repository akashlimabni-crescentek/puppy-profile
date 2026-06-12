# Code Review — Puppy Profile Card

**Reviewer:** Senior architecture review
**Date:** 2026-06-12
**Scope:** Full `src/` tree, build/tooling config, and alignment with the client's deliverable + evaluation criteria.
**Status:** Findings only — no code changes applied. Apply in priority order below.

---

## 0. How to read this

Each finding lists: **severity**, **location**, **why it matters to *this* client**, and the **recommended fix**.
The client's stated evaluation axes are: **design fidelity, code organization, RLS-respecting query patterns, communication cadence**, plus the hard requirements *no wasted re-renders* (#13) and *no duplicate/unwanted API calls* (#15).

Severity legend:

| Level | Meaning |
|-------|---------|
| 🔴 P0 | Real bug a reviewer will hit. Fix before sharing the preview URL. |
| 🟠 P1 | Correctness/security gap on a graded axis. Fix before handoff. |
| 🟡 P2 | "Clean repo / enterprise polish." Expected at this quality bar. |
| 🟢 Note | Minor / cosmetic / verify. |

---

## 1. 🔴 P0 — Bugs that will be noticed

### P0-1 — Infinite API-call loop on a failed puppy fetch
**Violates requirement #15 ("no unwanted multiple API calls") directly.**

- **Location:** `src/hooks/usePuppyProfile.ts` (the effect guard).
- **What happens:** The guard only stops re-dispatch when `status` is `loading` or `succeeded`. When a fetch **fails**, `status` becomes `failed`; the effect re-runs (it depends on `status`), the guard does *not* return, so it dispatches `fetchPuppyRequest` again → `loading` → saga fails → `failed` → effect re-runs → dispatch again. One transient network error puts the app into a tight loop hammering Supabase.
- **Fix:** Only auto-fetch from `idle`. Make retry an **explicit user action** (a "Try again" button that dispatches `resetPuppy()` then re-requests). Example guard intent:
  ```
  if (!familyId) return
  if (status !== 'idle') return   // never auto-fire from loading | succeeded | failed
  dispatch(fetchPuppyRequest(familyId))
  ```

### P0-2 — Session is never restored on refresh (silent logout)
- **Location:** `src/utils/supabaseClient.ts` (sets `persistSession: true`) + `src/store/authSlice.ts` (the `setSession` reducer is defined but **never dispatched anywhere** — confirmed by grep).
- **What happens:** Supabase persists the session in `localStorage`, but nothing reads it back into Redux on boot. After any page refresh on the Vercel URL, `isAuthenticated` resets to `false` and the user is treated as logged out. There is also no `onAuthStateChange` subscription, so token refresh / sign-out-in-another-tab never syncs to Redux.
- **Why it matters:** Reviewers *will* refresh the deployed link. This reads as broken authentication.
- **Fix:** Add an **auth-bootstrap step** that runs once at startup:
  1. Add `isInitializing: true` to `AuthState`.
  2. On boot (a startup saga or an effect in `App`), call `supabase.auth.getSession()`; if a session exists, map the user and dispatch `setSession`; then set `isInitializing = false`.
  3. Subscribe to `supabase.auth.onAuthStateChange` to keep Redux in sync (token refresh, `SIGNED_OUT`).
  4. Gate the router on `isInitializing` (see P0-3).

### P0-3 — `ProtectedRoute` flash-redirects a logged-in user
- **Location:** `src/routes/ProtectedRoute.tsx`.
- **What happens:** It guards on `isLoading`, but initial `isLoading` is `false` and there is no bootstrap phase. On a hard refresh at `/profile`, `isAuthenticated` is momentarily `false`, so it immediately `Navigate`s to `/login`. This is the visible symptom of P0-2.
- **Fix:** Guard on the new `isInitializing` flag instead of `isLoading`. While initializing, render the skeleton (not `null`, and not a redirect). Both P0-2 and P0-3 resolve together.

---

## 2. 🟠 P1 — RLS & security (explicitly graded axis)

### P1-1 — Query trusts a client-supplied `family_id` (anti-pattern for RLS) — **DECISION: switch to RLS-scoped query**
- **Location:** `src/store/sagas/puppySaga.ts` → `.eq('family_id', familyId)` where `familyId` comes from Redux.
- **Why it matters:** RLS already scopes rows to `auth.uid()` server-side. Passing a client value is redundant and signals a weaker grasp of the model the reviewer is specifically grading.
- **Agreed fix (chosen):** Let RLS do the scoping — do **not** pass a client id:
  ```
  supabase.from('puppies').select('*').maybeSingle()
  ```
  The authenticated session + RLS policy returns the single row the user is allowed to see. This is the strongest signal on the "RLS-respecting query patterns" axis.
- **Caveat:** Final shape depends on the real schema (does `family_id` map to `auth.uid()`, or is there a `profiles`/`families` join?). Confirm when the client sends the schema; the no-filter `.maybeSingle()` pattern holds as long as the RLS policy is `auth.uid()`-based.

### P1-2 — `.single()` makes the friendly "no record" path dead code
- **Location:** `src/store/sagas/puppySaga.ts`.
- **What happens:** `.single()` returns a PostgREST error (`PGRST116`) when zero rows match, so the `if (!data)` branch never executes; the user sees a raw error string instead of "No puppy record found for this family."
- **Fix:** Use `.maybeSingle()` and branch on `data === null` for the empty case; reserve the `error` branch for genuine failures.

### P1-3 — Role check contradicts "family-tier only" (requirement #1)
- **Location:** `src/store/sagas/authSaga.ts` (`role === 'family' || role === 'admin'`) and `src/types/auth.types.ts` (`mapSupabaseUser` **defaults a missing role to `'family'`**).
- **What happens:** Any authenticated user with no role set silently becomes `family` and is admitted. The client said *family-tier only*.
- **Also:** Role is read from `user_metadata`, which is user-writable in many Supabase configurations. Trusted authorization data belongs in `app_metadata` or a `profiles` table behind RLS.
- **Fix:** Admit only an explicit `family` role; do **not** default-grant. Treat a missing/unknown role as access-denied (sign out + clear message). Source role from `app_metadata`/`profiles`, not `user_metadata`.

---

## 3. 🟡 P2 — Clean repo / enterprise polish (graded: "code organization")

### P2-1 — `axiosInstance.ts` is dead code ("no boilerplate dumps", requirement #5)
- **Location:** `src/utils/axiosInstance.ts`.
- The Supabase JS client makes its own HTTP requests; there are **zero** non-Supabase calls in the app. This file and the `axios` dependency are exactly the "boilerplate dump" the client warned against.
- **Fix:** Delete the file and remove `axios` from `package.json`.

### P2-2 — Mock-auth is wired into production code paths
- **Location:** `src/utils/mockAuth.ts`, `src/utils/mockData.ts`, and the `isMockAuthEnabled()` branches inside both sagas.
- Acceptable as a stopgap *until staging credentials arrive*, but it must be removed (or stripped from prod builds) for handoff — shipping test scaffolding inside production code paths reads poorly to a reviewer.
- **Fix:** Once real creds land, delete the mock branches and files; or isolate behind a build-time flag that tree-shakes out of the production bundle.

### P2-3 — Full Supabase `Session` stored in Redux
- **Location:** `src/store/authSlice.ts` + the `serializableCheck` ignore-list in `src/store/store.ts`.
- Storing a non-serializable object in Redux forces the ignore-list and risks subtle bugs. Cleaner: let the Supabase client own the session; keep only the minimal `AuthUser` in Redux. Removes the need for the ignore-list entirely.

### P2-4 — Router gaps
- **Location:** `src/routes/AppRouter.tsx`.
- The `index` route renders `LoginPage` *inside* `ProtectedRoute`, which is conceptually confusing (a login page behind an auth guard). There is also **no catch-all `*` route**, so unknown paths render blank.
- **Fix:** Simplify to: public `/login`, protected `/profile`, index redirect to `/profile`, and a `*` → redirect (to `/profile` or a 404). Once P0-2/P0-3 land, the auth gate decides login-vs-profile cleanly.

---

## 4. 🟢 Notes — minor / verify

- **N-1 — `formatBirthday` locale mismatch.** `src/utils/formatters.ts` uses `'en-GB'` (→ "15 March 2023") but its doc comment claims US output ("March 15, 2023"). Also `new Date('YYYY-MM-DD')` is parsed as UTC then rendered in local time, which can show the previous day in negative-offset timezones. Pick a locale deliberately (ideally from the design spec) and parse date-only values without timezone drift.
- **N-2 — Dependency tension vs requirement #9 ("latest *and stable*").** The README install step requires `npm install --legacy-peer-deps`, which is concrete evidence of peer-dependency conflicts among the very new majors (Vite 8, Vitest 4, Storybook 10, ESLint 8 config alongside `@eslint/js`/`eslint-plugin-react-hooks` built for ESLint 9 flat config). **Verify `npm run lint`, `npm run build`, and `npm run storybook` all pass cleanly** before claiming the stack is stable; pin to versions that install without `--legacy-peer-deps` if any break.
- **N-3 — ESLint config is legacy `.eslintrc.cjs`** while several installed plugins target the ESLint 9 flat-config era. Confirm lint actually runs; consider migrating to `eslint.config.js` flat config for longevity.
- **N-4 — `GlobalErrorBoundary` uses `window.location.href = '/'`** for reset (full reload). Fine, but a soft reset via router would be smoother UX; the existing `// TODO: Sentry` note is the right call for production error reporting.
- **N-5 — `detectSessionInUrl: true`** is unnecessary for an email/password-only flow (no magic-link/OAuth). Harmless; can be set `false`.

---

## 5. ✅ What is already done well (keep)

- Atomic Design split (`atoms / molecules / organisms`) with co-located `.stories.tsx` and `.test.tsx`.
- `takeLatest` on both saga watchers; snake_case→camelCase mapping isolated in exactly one place (`mapPuppyRow`).
- Render discipline: `memo` + `useMemo` + `useCallback` used deliberately; React Hook Form for zero-re-render typing.
- `validateEnv` runs **before** React mounts → fail-fast on misconfig.
- Two-tier error boundaries (global + card), lazy-loaded routes with skeleton fallbacks.
- Centralized Tailwind design tokens (single source of truth, ready for the client's spec).
- Husky + lint-staged + Prettier + a `camelcase` ESLint rule enforcing requirement #11.
- Strong typed-hooks pattern (`useAppDispatch` / `useAppSelector`); components never import the store directly.

---

## 6. ⛔ Blocked on client assets (cannot be completed correctly yet)

The two highest-weighted evaluation axes depend on assets not yet provided:

1. **Design fidelity (requirement #3).** Every visual value in `tailwind.config.js`, `PuppyProfileCard.tsx`, etc. is a placeholder marked `TODO`. Needs the **design spec** (typography scale, spacing, color tokens, fonts). *Correctly* not guessed — guessing here would lose the "exact match" criterion.
2. **Real RLS query (requirement #2).** Needs the **table schema + staging read-only credentials** to finalize the `puppies` table/column names and confirm the RLS policy is `auth.uid()`-based (see P1-1).

---

## 7. Recommended order of work

1. **P0-1, P0-2, P0-3** — the three real bugs (loop, session restore, route guard). Add tests for each.
2. **P1-1, P1-2, P1-3** — RLS-scoped query (`.maybeSingle()`, no client id), family-only role.
3. **P2-1 → P2-4** — remove axios + mock scaffolding, slim Redux session, fix router.
4. **On asset delivery** — apply design tokens for exact fidelity; finalize schema mapping; deploy Vercel preview + Storybook; fill the README preview URLs.
5. **N-2** — verify lint/build/storybook all pass without `--legacy-peer-deps`.

---

## 8. Suggested additions to win client trust (optional, high-signal)

- **CI** (GitHub Actions): `type-check` + `lint` + `test:run` + `build` on every PR — demonstrates the "communication cadence / production readiness" axis.
- **A short `DECISIONS.md`** (or PR descriptions) explaining *why* RLS scoping needs no client filter, why Redux holds only `AuthUser`, etc. The client explicitly grades communication.
- **Accessibility pass**: `addon-a11y` is installed — run it and note results; reviewers notice a11y on a card UI.
- **A single happy-path integration test** (login → fetch → render card) using a mocked Supabase client, proving the *one* API call per session claim from requirement #15.
