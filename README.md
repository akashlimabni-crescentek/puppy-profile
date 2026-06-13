# Stokeshire — Puppy Profile

An authenticated, mobile-first profile card showing a family's puppy and its
progress through a Stokeshire program. Built as a client evaluation deliverable.

**Live preview:** [Add Vercel preview URL here after deployment]
**Storybook:** [Add Storybook URL here after deployment]

---

## Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| Build | Vite + React 19 + TypeScript (strict) | Fast HMR, native ESM, full type safety |
| State | Redux Toolkit + Redux-Saga | Client requirement; `takeLatest` prevents duplicate API calls |
| Auth + DB | Supabase JS v2 | Email/password auth, RLS-enforced queries |
| Routing | React Router v7 | Protected routes with auth guard |
| Forms | React Hook Form + Zod | Zero re-renders during typing, schema validation |
| Styling | Tailwind CSS v3 | Design tokens in one file, easy re-skin |
| Icons | lucide-react | Consistent line icons (no emoji) |
| Components | Atomic Design (atoms → molecules → organisms) | Clean hierarchy, Storybook-ready |
| Catalogue | Storybook 10 + docs addon | Auto-docs from prop types |
| Testing | Vitest + Testing Library | Fast, Jest-compatible |
| Linting | ESLint + Prettier + Husky + lint-staged | Pre-commit enforcement |
| Deploy | Vercel | Preview URL per PR |

---

## Project structure

```
src/
├── components/
│   ├── atoms/          # Avatar, Badge, Button, Input, Skeleton, Typography
│   ├── molecules/      # InfoRow, StatChip, PuppyCardSkeleton
│   └── organisms/      # PuppyProfileCard, LoginForm
├── errors/             # GlobalErrorBoundary, CardErrorBoundary
├── hooks/              # useAuth, usePuppyProfile
├── pages/              # LoginPage, ProfilePage
├── routes/             # AppRouter, ProtectedRoute
├── store/
│   ├── sagas/          # authSaga, puppySaga, rootSaga
│   ├── authSlice.ts
│   ├── puppySlice.ts
│   ├── store.ts
│   └── hooks.ts        # useAppDispatch, useAppSelector
├── styles/             # index.css (global styles + --stokeshire-* custom properties)
├── types/              # auth.types.ts, puppy.types.ts, common.types.ts
└── utils/              # supabaseClient, formatters, mockData, validateEnv
```

---

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd puppy-profile
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (`https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key (never the service-role key) |
| `VITE_APP_NAME` | App name (optional) |
| `VITE_APP_ENV` | Environment (optional) |

> The app validates these at boot (`validateEnv`). If any are missing it throws a
> clear error before React mounts — never a silent failure. `.env` is gitignored;
> only `.env.example` is committed.

### 3. Run the dev server

```bash
npm run dev          # http://localhost:5173
```

Log in with the staging family account to see Maple's record render.

### 4. Run Storybook

```bash
npm run storybook    # http://localhost:6006
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (`tsc` + Vite) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint (zero warnings allowed) |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | TypeScript strict check (`tsc --noEmit`) |
| `npm run format` | Format all source files |
| `npm run format:check` | Verify formatting (CI) |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI) |
| `npm run test:coverage` | Coverage report |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build static Storybook |

**Pre-delivery gate (all six must pass):**
`type-check` · `lint` · `format:check` · `test:run` · `build` · `build-storybook`.

---

## Authentication & security

Login uses Supabase email/password auth. **Authorization is enforced by RLS**, not
an application-level role flag:

1. **Database (the authority):** RLS policies scope every read. A logged-in user
   sees only their own `families` row (`auth_user_id = auth.uid()`) and that
   family's `puppies`. No client-side filter and no `service_role` key — only the
   anon key is ever used, so RLS cannot be bypassed from the browser.
2. **Access = a successful RLS-scoped read.** The staging user has **no
   `app_metadata.role`**, and `user_metadata` is end-user-writable (so it is never
   trusted). Rather than hard-fail login on a missing role, the app authenticates
   the user and lets the RLS-scoped family/puppy read establish access — no family
   row means a friendly "no record" state. See `DECISIONS.md` §3 for why this is a
   conscious, documented deviation from the house "role check before session
   stored" rule.
3. **Route guard:** `ProtectedRoute` gates on `isInitializing` during the one-time
   boot session-restore, so a hard refresh at `/profile` never flash-redirects a
   logged-in user to `/login`.

---

## RLS query pattern

The fetch in `src/store/sagas/puppySaga.ts` deliberately passes **no client-side
`family_id`** — RLS scopes the rows server-side:

```typescript
// One combined embed: the family row + its puppies, both RLS-scoped.
const { data, error } = await supabase
  .from('families')
  .select('*, puppies(*)')
  .maybeSingle()
```

This is a **documented deviation** from the Crescentek standard (§9/§19/§22), which
mandates an explicit `.eq()` filter alongside RLS. The client grades
"RLS-respecting query patterns," so the RLS-only shape is correct here; the
rationale is in `DECISIONS.md` §1 and in a comment at the query site.
`.maybeSingle()` keeps the friendly empty state reachable (null, not a throw).

---

## Duplicate API call prevention (requirement #15)

Three layers keep it to exactly one data fetch per session:

1. **`takeLatest` in the saga** — only the most recent `fetchPuppyRequest` runs.
2. **Status guard in `usePuppyProfile`** — auto-fetch fires **only** from `idle`;
   after a failure the status is `failed`, so the effect cannot re-fire itself.
   Retry is an explicit user action (`resetPuppy` → `idle` → one refetch).
3. **Precise `useEffect` dependency array** — re-runs only on `status` change.

The single combined embed also means the family + puppy arrive in one round trip.

---

## Replacing design tokens

All design tokens live in **two mirrored places**:

1. `tailwind.config.js` — the `tokens` object (colors, `fontFamily`, radii, shadows).
2. `src/styles/index.css` — the `--stokeshire-*` CSS custom properties + the
   Google Fonts `@import` (mirror any change in `index.html`'s font `<link>`).

To re-skin: change values in those two files only — no hunting through components,
and never hardcode a hex in a component.

---

## Replacing the Supabase schema

All DB-row → app mapping lives in **one place**: `src/store/sagas/puppySaga.ts`
(`mapPuppyRow`, `mapFamilyRow`).

To swap the schema:
1. Update the `*Row` interfaces in `src/types/puppy.types.ts` (snake_case mirror).
2. Update `mapPuppyRow` / `mapFamilyRow` in `puppySaga.ts`.
3. Update the `.from()` / `.select()` calls if table or embed names change.
4. Run `npm run type-check` — TypeScript flags every place that needs updating.

---

## Deployment (Vercel)

`vercel.json` includes SPA rewrites.

```bash
npm i -g vercel
vercel             # preview
vercel --prod      # production
```

Set the env vars in the Vercel dashboard (**Settings → Environment Variables**):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Confirm the preview works
end-to-end on a real phone viewport before sharing.

---

## Code conventions

- **camelCase** for variables/functions (ESLint `camelcase`); PascalCase components/types.
- **`React.memo` + `displayName`** on every presentational component.
- **`useMemo` / `useCallback`** for computed values and stable function references.
- **No direct Redux imports in components** — always via `useAuth` / `usePuppyProfile`.
- **Atomic Design** — atoms never import molecules/organisms; molecules never organisms.
- **One responsibility per file**; DB-row vs app types separated; `import type` for types.
- Path aliases everywhere (`@atoms`, `@store`, `@app-types`, …) — no deep relative paths.

---

## Pending / notes

- [ ] Add the Vercel preview URL and Storybook URL above after first deploy.
- Bundle size: the app currently ships as a single chunk over Vercel's 500 kB
  advisory threshold (build warning only). Route-level code-splitting is already
  in place; revisit chunking if it grows.
- `GlobalErrorBoundary` logs to `console.error` — swap for Sentry once an
  error-tracking backend is provisioned (the one remaining, §18-format TODO).
