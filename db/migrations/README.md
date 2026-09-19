# Migrations

Deliberately empty in this slice. No Foundation SQL (`objects`, `relations`,
`sources`, `source_assets`, `fields`, ...) has been created here — doing so
would mean fabricating a migration from the briefs instead of from an
audited decision.

See `docs/foundation-decisions.md` for what is already frozen versus still
pending, and `infrastructure/db/kysely.ts` for the (currently empty)
typed `Database` interface this directory will eventually back.

When a real migration is authored, it goes here as
`NNN_description.sql`, and the corresponding tests go in `db/tests/`.
