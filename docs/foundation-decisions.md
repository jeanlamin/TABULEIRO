# Foundation decisions (carried over from the briefs, not yet schema)

This file exists so the decisions already made in
`docs/canonical/COMPLEXITY_V1_70_IMPLEMENTATION_BRIEF.md` and
`docs/canonical/COMPLEXITY_V1_70_CANONICAL_UI_BASELINE_BRIEF.md` are
preserved without being turned into a fabricated migration. Those two files
are the canonical source — this document is only a derived summary, not a
replacement. No SQL in `db/migrations/` yet implements any of this — see
`db/migrations/README.md`.

## Frozen (not open for reinterpretation without a new audit round)

- `objects.kind` vocabulary: exactly `evidence`, `question`, `proposition`,
  `record`.
- `relation_type` vocabulary: exactly `derived_into`, `supports`,
  `contradicts`, `associated_with`.
- Command Layer names (Implementation Brief, section 1): `createSource`,
  `addSourceAsset`, `captureEvidence`, `correctEvidence`,
  `createIntellectualObject`, `editIntellectualObject`, `deriveObject`,
  `createRelation`, `removeRelation`, `createField`, `placeOnField`,
  `moveOnField`, `removeFromField`, `archiveObject`, `unarchiveObject`,
  `trashObject`, `restoreFromTrash`, `permanentlyDeleteObject`.
- The database (triggers, composite FKs, partial indexes) is the source of
  truth for structural invariants. The Command Layer must not reimplement
  that validation — only contextual/UX rules on top of it.

## Explicitly pending (do not resolve silently in code)

- **Composition** (the "Synthesis/Artifact" node in the mockup) is not the
  existing `record` kind and is not a fifth `objects.kind`. It likely needs
  its own entity (`compositions` + a junction table referencing Objects),
  and its own POC before any schema exists. Out of scope until then.
- **Edge/relation presentation labels** ("Builds on", "Relates to",
  "Influences", "Extends", "informs", "leads to", "synthesizes") are not
  `relation_type` values. Default treatment: a pure presentational mapping
  function `getRelationLabel(fromKind, toKind, relationType)`, isolated and
  clearly marked provisional — never persisted as `relation_type`.
- **Tags** have no schema. Leave the UI space empty/hidden rather than
  faking persistence.
- `Concept` and `Method` as possible future `objects.kind` values (or as a
  computed Projection instead of a persisted type) — undecided.
- `Note` as a possible lightweight mechanism (perhaps `kind='record'` with a
  presentation marker) — a hypothesis, not a decision.

## What this slice does with the above

Nothing yet. `infrastructure/db/kysely.ts` declares an empty `Database`
interface on purpose — extending it is how a future slice turns any of the
above into real, typed tables once it is actually decided.
