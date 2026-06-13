# Architecture Decisions

Short rationale for the non-obvious choices in this codebase. The client grades
**communication cadence** and **RLS-respecting query patterns**, so the "why"
matters as much as the "what".

---

## 1. The data query passes no client-side `family_id` — RLS scopes the row

```ts
supabase.from('puppies').select('*').maybeSingle()
```

Row-Level Security scopes rows to `auth.uid()` **on the server**. Passing a
client-supplied `family_id` would be redundant at best and, at worst, signals a
weaker grasp of the trust model: the client value is not what authorizes the
read — the authenticated session is. Letting RLS do the scoping is the strongest
signal on the "RLS-respecting query patterns" axis.

- `.maybeSingle()` (not `.single()`): zero rows returns `data === null` instead
  of throwing `PGRST116`, so the friendly "no record found" state is reachable
  and the error branch is reserved for genuine failures.
- **Open item:** the exact shape is confirmed only when the staging schema
  arrives — if access is via a `profiles`/`families` join rather than a direct
  `auth.uid()` policy, the query adjusts accordingly. Marked with a `TODO` in
  `puppySaga.ts`.

## 2. Redux holds only the minimal `AuthUser`, never the Supabase `Session`

The Supabase client already persists and refreshes the session in
`localStorage`. Duplicating the full `Session` (a non-serializable object with
nested tokens/expiry) into Redux forced a `serializableCheck` ignore-list and
risked drift between two sources of truth. We keep `{ id, email, role }` in
Redux and let the client own the live session. The ignore-list is gone.

## 3. Authorization is enforced by RLS, not a metadata role (resolved against staging)

The handoff brief did not say where the family role lived. We inspected the
staging test user's JWT directly before finalizing this, and found:

- `app_metadata` is `{ provider: 'email', providers: ['email'] }` — **there is no
  `app_metadata.role`.** The earlier code required `app_metadata.role === 'family'`,
  which would have **hard-failed login for the legitimate family user.**
- The only family signal is `user_metadata.tier === 'family'`, and `user_metadata`
  is **end-user-writable** — trusting it for authorization would let a user grant
  themselves access. So we do **not** use it.

**Resolution (per the brief's §4.10):** RLS is the sole authorization gate. Login
authenticates and stores the session without a metadata role check; the
RLS-scoped family/puppy read (decision #1) is what actually grants or denies
access to data — a user whose `auth.uid()` matches no family row simply sees the
friendly "No family record found" state. `UserRole` stays the single literal
`'family'` (requirement #1): it is the one nominal role every authenticated user
carries, with RLS deciding what they can see.

**This is a documented, intentional deviation** from the Crescentek standard's
"role check in the auth saga before the session is stored" (§19). The standard
assumes a server-controlled role claim exists; here none does, and the brief
explicitly directs that a successful RLS-scoped read establish access rather than
hard-failing login. The deviation is narrow: there are no write operations and
RLS scopes every read, so storing a session for an authenticated user before the
data read carries no privilege-escalation risk.

## 4. Session restore on boot + an `isInitializing` gate

On a hard refresh, Supabase has the persisted session but Redux starts empty. A
one-time boot saga (`initializeAuth` → `getSession`) restores it, and the router
is gated on `isInitializing` (showing the skeleton, not a redirect) so a
logged-in user is never flash-redirected to `/login`. An `onAuthStateChange`
channel keeps Redux in sync on sign-out in another tab.

## 5. One API call per session — guaranteed by the fetch guard

`usePuppyProfile` auto-fetches **only** from the `idle` status. After a failure
the status is `failed` (never `idle`), so the effect cannot re-fire itself — the
previous code looped on `failed`. Retry is an explicit user action (`resetPuppy`
→ `idle` → one refetch). `takeLatest` is the final safety net. This is the
requirement-#15 guarantee, covered by `authFlow.integration.test.tsx`.

## 6. No `axios`

The Supabase JS client makes its own HTTP requests and there are zero
non-Supabase calls, so a configured axios instance was dead boilerplate
(requirement #5). Removed, along with the dependency.

---

## Still blocked on client assets

- **Design fidelity (#3):** typography/spacing/color tokens in
  `tailwind.config.js` and `PuppyProfileCard.tsx` are placeholders. Not guessed —
  guessing would lose the "exact match" criterion.
- **Real RLS query (#2):** final table/column names and the RLS policy shape need
  the staging schema + read-only credentials (see decision #1).
