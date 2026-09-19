# Complexity

Ideas become understanding.

This is the technical foundation slice (V1.71-A): a Next.js scaffold, the
architectural boundaries, and a handful of shared primitives. It does not
yet implement Source/Evidence, Commands, auth, or any Foundation schema —
see `docs/foundation-decisions.md` for what is deliberately deferred.

## Requirements

- Node.js 22+
- A Postgres database (Supabase recommended) for later slices — not
  required to run this one, since nothing calls the database yet.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in when Supabase/DB access is needed
```

## Commands

```bash
npm run dev               # start the dev server
npm run build              # production build
npm run start               # run the production build
npm run lint                 # eslint
npm run typecheck             # tsc --noEmit
npm run test                   # vitest
npm run check:boundaries        # enforce the architecture rules below
npm run verify                   # lint + typecheck + boundaries + test + build
```

## Architecture

```
UI (app/, components/) → adapter → Command / Query (application/) → infrastructure/
```

- `domain/` and `application/` must not depend on Next.js or React.
- `components/` must never talk to the database directly.

Both rules are enforced by `npm run check:boundaries`
(`scripts/check-boundaries.mjs`), not just documented.

## Structure

- `app/` — the single real route; opens directly into the workspace shell.
- `components/` — `shell/`, `field/`, `reader/`, `inspector/`, `lineage/`.
- `domain/` — pure, framework-free types (`AppResult`, `AppErrorCode`).
- `application/` — framework-free application-layer types (`CommandContext`).
- `infrastructure/` — `db/` (Kysely), `auth/` (Supabase session), `storage/`.
- `db/migrations/` — intentionally empty; see its README.
- `docs/` — decisions carried over from the briefs that are not schema yet.
