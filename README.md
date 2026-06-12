# Puppy Profile

Authenticated puppy profile card. Built as a client evaluation deliverable.

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
| Styling | Tailwind CSS v3 | Design tokens in one file, easy client token replacement |
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
├── styles/             # index.css (global styles + CSS custom properties)
├── types/              # auth.types.ts, puppy.types.ts, common.types.ts
└── utils/              # supabaseClient, axiosInstance, formatters, mockData, validateEnv
```

---

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd puppy-profile
npm install --legacy-peer-deps
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (`https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `VITE_APP_NAME` | App name (optional, defaults to "Puppy Profile") |
| `VITE_APP_ENV` | Environment (optional, defaults to "development") |

> The app validates these at boot. If any are missing it throws a clear error
> before React mounts — you will never get a silent failure from missing config.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Run Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006)

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint (zero warnings allowed) |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | TypeScript strict check |
| `npm run format` | Format all source files |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run test:coverage` | Generate coverage report |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build static Storybook |

---

## Authentication

Login uses Supabase email/password auth. Access is restricted to **family-tier accounts only**.

Role enforcement happens at two levels:
1. **Database (primary):** Supabase Row Level Security (RLS) policy on the `puppies` table ensures a user can only `SELECT` their own family's record. No application-level bypass is possible.
2. **Application (secondary):** The auth saga checks `user.role` after login and signs out any non-family account before the session is stored in Redux.

---

## RLS query pattern

The puppy fetch in `src/store/sagas/puppySaga.ts` is written to respect RLS:

```typescript
const { data, error } = await supabase
  .from('puppies')
  .select('*')
  .eq('family_id', familyId)
  .single()
```

The `.eq('family_id', familyId)` filter is intentional even though RLS already enforces it.
Belt-and-suspenders: explicit filter + RLS policy = defence in depth.
The `anon` key is used — never the `service_role` key, which would bypass RLS entirely.

---

## Duplicate API call prevention

Three layers prevent duplicate Supabase calls:

1. **`takeLatest` in saga:** If `fetchPuppyRequest` is dispatched multiple times rapidly, only the most recent call executes. Previous in-flight calls are cancelled automatically.
2. **Status guard in `usePuppyProfile`:** The hook checks `status === 'loading' || status === 'succeeded'` before dispatching. If a fetch is already in progress or complete, no new dispatch fires.
3. **`useEffect` dependency array:** The effect only re-runs when `familyId` or `status` changes — never on unrelated re-renders.

---

## Replacing design tokens

All design tokens live in **one file**: `tailwind.config.js` under the `tokens` object.

When the client provides the design spec:
1. Update the `tokens` object in `tailwind.config.js`
2. Update the CSS custom properties in `src/styles/index.css`
3. Replace the Google Fonts import with the client font

The entire UI updates from these two files. No hunting through components.

---

## Replacing the Supabase schema

All DB field mappings live in **one place**: `src/store/sagas/puppySaga.ts` in `mapPuppyRow`.

When the client provides the real table schema:
1. Update the `PuppyRow` interface in `src/types/puppy.types.ts`
2. Update `mapPuppyRow` in `src/store/sagas/puppySaga.ts`
3. Update the table name and column name in the `.from()` and `.eq()` calls
4. Run `npx tsc --noEmit` — TypeScript flags everywhere that needs updating

---

## Deployment (Vercel)

This project includes a `vercel.json` with SPA rewrites configured.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

Set the environment variables in the Vercel dashboard under **Settings → Environment Variables**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Code conventions

- **camelCase** for all variable and function names (enforced by ESLint `camelcase` rule)
- **`React.memo`** on all presentational components — prevents re-renders on unchanged props
- **`useMemo` / `useCallback`** for expensive computations and stable function references
- **No direct Redux imports in components** — always use `useAuth` or `usePuppyProfile` hooks
- **Atomic Design** — atoms never import from molecules or organisms; molecules never from organisms
- **One responsibility per file** — no file mixes types, logic, and UI

---

## Pending (awaiting client)

- [ ] Design spec tokens → replace `tailwind.config.js` token values
- [ ] Client font → replace Inter import in `src/styles/index.css`
- [ ] Supabase staging credentials → add to `.env`
- [ ] Real table schema → update `PuppyRow` type and `mapPuppyRow`
- [ ] Confirm table name (`puppies`) and column name (`family_id`) with client
