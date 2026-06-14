# Stokeshire — Puppy Profile

An authenticated, mobile-first profile card showing a family's puppy and its
progress through a Stokeshire program. Built as a client evaluation deliverable.

**Live preview:** [Add Vercel preview URL here after deployment]

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
cd Stokeshire-test
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