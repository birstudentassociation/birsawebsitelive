# TypeScript content module migration

REDESIGN-2.0.md §11.4 item 6 (one of five Wave 6 content-migration agents). Source
family: `content/activity/regulations/**`, `content/calendar/events.ts`,
`content/committee.ts`, `content/site.ts`, `content/quick.ts`,
`content/reporting.ts`, cross-checked against `lib/portfolios.ts`.

## The headline finding: `regulation.ts`'s schema cannot hold the regulation content

This is the load-bearing result of this wave, not a footnote. `content/activity/
regulations/types.ts` describes a deeply nested, bilingual, legally numbered document
model: `RegulationDoc` → `Section[]` (arbitrarily nested — Title → Chapter → Division
in the University Regulation) → `Provision[]` (each with its own citation-bearing
`num`) → either the simple shape (`lead`/`definitions`/`items`/`tail`) or the ordered
`body: Block[]` shape, where a `ProvisionItem` carries an explicit, verbatim `marker`
("(1)", "A.") plus optional `note` and arbitrary `children` nesting.

`sanity/schemaTypes/documents/regulation.ts` has exactly one content field: `body:
portableText`. Two things about that field make the mismatch unbridgeable, not just
inconvenient:

- **`portableText` is single-locale.** It is one flat array of blocks, not `{ en, th }`
  the way `localizedString`/`localizedText` are — confirmed against
  `tests/unit/sanity-schema-editorial.test.ts`, which never exercises it bilingually,
  and against `sanity/schemaTypes/objects/portableText.ts`'s own definition. A whole
  regulation document gets exactly one such field for its entire, fully bilingual
  legal text.
- **Its structure is deliberately restricted.** Four block styles (normal, h2, h3,
  blockquote — no h1, no h4/h5/h6), two list styles that render with a
  renderer-generated marker rather than the source's literal one, a table, three
  inline marks. There is no field for a provision's `num`, no field distinguishing a
  `Section`'s `kind`/`number` from its `title`, and — this is the one that matters
  most for legal text — only two heading levels available for what can be a
  three-deep group nesting (Title → Chapter → Division) sitting above the provisions
  themselves.

Squeezing the tree in anyway would mean collapsing Title/Chapter/Division into two
heading levels (a Division heading becomes typographically indistinguishable from its
parent Chapter), or dropping one language, or both. The shared Wave 6 brief is
explicit — "do not flatten the structure to make it fit, and do not edit the schema"
— and for legal text specifically warns that losing clause nesting changes what the
rule says. This migration does not attempt it.

**What was migrated instead:** for each of the three regulation documents
(`university-2563`, `political-science-2565`, `discipline-2568`), a stub carrying only
`title` (from `RegulationMeta.shortTitle`), `slug`, and `effectiveDate` — derived, not
invented, by parsing the Buddhist-calendar date already present verbatim in the
source's `made.th` prose line (`parseThaiAnnouncementDate` in `lib/migration/
modules.ts`; BE year − 543 = CE year, the fixed calendar offset). Everything else —
`citation`, `authority`, `preamble`, `signatory`, the entire section/provision tree,
and `lifecycle.owner` (no source data names an owning portfolio for a regulation) — is
a reported gap. The 1.0 route keeps rendering the real content straight from the
TypeScript module; nothing was deleted.

**What this means for the schema, going forward (not this wave's job to fix):**
`regulation.ts` needs either a structured object type mirroring `Section`/`Provision`/
`ProvisionItem`/`Definition` with bilingual leaves throughout, or an accepted decision
that regulations stay in git as a fourth §7's-list-of-three exemption (the reasoning
`docs/CMS-SCHEMA-CONVENTIONS.md` §7 already gives for Smart Answers, curriculum and
the privacy register — "the content is a promise the code must keep" — applies at
least as strongly to a body of law a student can be disciplined under). Deciding
between those is a schema and governance question, not a migration-script one; this
wave surfaces it rather than picking.

## Every other source, and why

| Source                                       | Target                                                | Outcome                                                                                                                 |
| -------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `content/activity/regulations/**`            | `regulation`                                          | Title/slug/effectiveDate stubs only, per above.                                                                         |
| `content/calendar/events.ts`                 | `event` (assigned)                                    | **Not migrated.** See below.                                                                                            |
| `content/committee.ts`                       | `committeeMember`                                     | Migrated (21 of 21), with a gap on `portrait`/`roleEmail` (see below) and a per-member gap where no portfolio resolves. |
| `lib/portfolios.ts` × `content/committee.ts` | `portfolio`                                           | Migrated where ≥ 2 current holders resolve (5 of 13); not migrated otherwise, with the exact reason (see below).        |
| `content/site.ts`                            | `siteSettings`                                        | `contact` migrated; `socials`/`officialLinks` not (no field).                                                           |
| `content/quick.ts`                           | `navigation` or `siteSettings` (brief asks to decide) | **Neither. Not migrated.** See below.                                                                                   |
| `content/reporting.ts`                       | (brief: read and report)                              | **Not migrated — no document type fits.** See below.                                                                    |

### `content/calendar/events.ts` — not migrated

A `CalendarEvent` is a date marker for the front-page calendar widget that points at
a news/event post by `slug`; it carries no summary, category, location or body of its
own (compare `CalendarEvent` in `content/calendar/events.ts` against the `event`
schema's required fields — summary, category, location, a datetime `start`, and a
non-empty `body`). Inventing those would be exactly the hand-written content the
shared brief forbids.

It also cannot be reduced to one `event` document per entry even with the missing
fields supplied by magic: several markers share one target slug with different own
dates (four different August dates all click through to the single
`august-2026-activity-calendar` post), which the `event` schema's one `start`/`end`
per document has no way to represent. Every one of the thirteen entries currently
resolves to a real `content/news/**` post (verified by directory listing, not string
search inside the files — the slug is the filename), which is Wave 6A's family to
migrate as `newsArticle`/`event`, not this one's. Creating a second, competing `event`
document at the same slug-derived `_id` would be an id collision this migration's own
`verify-modules.mjs` would have to fail on. `lib/migration/modules.ts`'s
`assessCalendarEvents` only classifies each entry for the diff report; it never
returns a document.

### `content/quick.ts` — neither candidate fits

The brief asks which of `navigation` or `siteSettings` this belongs to, having read
both schema files first. Neither does, and both rejections are field-level:

- **`navigation`.** `navLink = { href, label }`. `QuickItem` carries an `icon`
  (18-value enum) and an optional `hint`, neither of which `navLink` has a field for.
  Worse, `navLink.href` is validated to _require_ an internal path starting with `/`
  (`sanity/schemaTypes/documents/navigation.ts`) — roughly a third of `QuickItem`s
  have an external `href` (Instagram, Facebook, the BIR Programme site), so those
  entries could not even be attempted, not merely trimmed of extra fields. `navigation`
  is also the sitewide primary menu and footer, a different information-architecture
  role than this "link in bio" page.
- **`siteSettings`.** No field of this shape exists at all; the nearest candidates
  (`contactRouting`, `featureFlags`) are a different shape for a different purpose.
- **`page` + the section palette's `related-links` section, considered and rejected
  too.** Its `relatedLinkItem` has `title` + optional `description` (which `label`/
  `hint` would map onto) and its link target _does_ allow an external `href`. It still
  fails on the majority of items: most `QuickItem`s point at an internal _path_
  (`/services/equipment-loan`, `/student-life/getting-started`), and `related-links`'s
  internal case is a Sanity document _reference_, not a path string. Resolving a path
  to a document id needs a route registry — `navigation.ts`'s own header already names
  this as a known, unbuilt gap ("checking a target against the real set of published
  documents and served routes needs a live query against both the dataset and the
  route table, neither of which this schema can reach offline"). This migration cannot
  resolve what that schema comment says no wave has built yet.

Not migrated. See `assessQuickLinks` in `lib/migration/modules.ts` and the per-item
gaps in the diff report.

### `content/reporting.ts` — no document type fits

`reportingChannels` is two named contact channels (organisation, person, phone, phone
href, optional extension, email) plus surrounding copy. It is not a
`serviceDefinition` (no start page or question flow — these are two static contact
cards, not a form). It is not `siteSettings.contactRoute` either: a `contactRoute`
routes a _category_ to one of BIRSA's own _portfolios_, and one of the two channels
here — the BIR Programme office — is an external body, not a BIRSA portfolio at all;
neither channel's actual shape has a home in `contactRoute`'s two fields. Not service
configuration, not existing content-with-a-type: genuine safety-relevant content with
nowhere to go in the current schema. `assessReporting` returns exactly one gap for the
whole module.

### `content/committee.ts` and `lib/portfolios.ts`

`committeeMember` migrates cleanly field-for-field (`firstName`/`lastName`/
`nickname`/`role`/`group`/`slug`), status set to `draft` (never a guessed published
state). `portfolio` is resolved per member by an _exact_ match of the member's English
role title against `lib/portfolios.ts`'s `heldBy` list — the file's own comment says
this list is "taken from the role titles in `content/committee.ts`, not invented",
so matching against it is using the frozen authority as intended, never inventing a
portfolio.

`portfolio` documents are built the same way, in reverse: for each of the thirteen
portfolios, every committee member whose title appears in that portfolio's `heldBy`
list becomes a holder, in `committee.ts`'s own array order (BIRSA's supplied
ordering — deterministic without inventing a tie-break rule). §7.2's two-person rule
means the schema's `secondHolder` is required, and **eight of the thirteen portfolios
have only one current holder in the real 2026 roster**: `president`, `treasury`,
`spokesperson`, `general-coordination`, `student-activities`, `foreign-students`,
`merchandise`, `it-infrastructure`. This is not a migration bug — it is an accurate
read of `content/committee.ts` as it stands today, surfaced rather than papered over
with an invented second holder. The other five (`secretariat`, `public-relations`,
`academic-affairs`, `sport`, `rights-and-welfare`) migrate in full, including
`additionalHolders` where a portfolio has more than two (`public-relations` has four:
one Vice President title plus three assistant officers all titled "Assistant Officer,
Public Relations").

**Referential integrity within the artifact is enforced at transform time, not just
checked afterward.** `transformPortfolios` runs before `transformCommitteeMember` in
`scripts/migrate-modules.mjs` specifically so the committee transform can be told
which portfolios actually got a document; a member whose role resolves to a portfolio
that itself did not migrate (one of the eight above) gets no `portfolio` reference at
all, rather than a reference to an id the artifact does not contain. `lifecycle.owner`
is still set to the resolved portfolio id in that case — it is a closed-vocabulary
string, not a document reference, so it does not need the portfolio _document_ to
exist.

`portrait` and `roleEmail` are never populated. `roleEmail` has no source at all
(`content/committee.ts` carries no email field, by its own guard in
`tests/unit/content.test.ts`, and none is invented here). `portrait` needs an
uploaded image asset — `imageField`'s `image` field is `type: "image"`, required,
and this migration has neither a write token nor any business touching binary
assets. `content/committee.ts`'s header names the expected file at
`public/committee/<key>.*`, so a follow-up asset-upload pass (a separate piece of
work, needing a write token this checkout does not have) has what it needs to find
each portrait.

## Determinism

Every collection is sorted by `_id` before it is written. The only fact this
migration reads beyond `content/**` and `lib/portfolios.ts` is the directory listing
of `content/news/en` (used only to classify, never migrate, calendar entries), and
that listing is sorted before use. Running `node scripts/migrate-modules.mjs` twice on
an unchanged tree produces byte-identical `docs/migration/modules.ndjson`.

## How ids are derived

`scripts/migrate-modules.mjs` prefers `lib/migration/ids.ts`'s `documentId(docType,
key)` (Wave 6A's shared contract, read only, never forked). That function validates
both arguments against `/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/` — lowercase only, no
uppercase — so this family's `docType` tokens are **kebab-case, not the schema's exact
camelCase `_type` name**: `"regulation"`, `"committee-member"`, `"portfolio"`. The
`_type` field in the emitted JSON is still the real schema name (`"committeeMember"`,
etc.); only the id-derivation input differs, deliberately, since `documentId` rejects
`"committeeMember"` outright.

If `lib/migration/ids.ts` does not exist in the checkout when the script runs (it may
not have landed yet — Wave 6A writes it concurrently), the script falls back to a
local, clearly-labelled slugify-based id function and says so, both on stdout and in
the diff report's opening line, so an operator never runs `sanity dataset import`
against ids nobody can account for without knowing which deriver produced them.

## Operator commands

Prerequisites: `npm ci` (for `esbuild`, already a transitive dependency of `vite`/
`vitest`, used here to read TypeScript content modules from a plain `.mjs` script —
see `scripts/migrate-modules.mjs`'s header for why). No `SANITY_API_READ_TOKEN` or any
other network access is needed for any of the three commands below; all three run
entirely offline.

```bash
# 1. Migrate: reads content/**, writes the NDJSON artifact and diff report.
node scripts/migrate-modules.mjs
#   -> docs/migration/modules.ndjson
#   -> docs/migration/modules-report.md

# 2. Verify: asserts the gate against the two files above, offline.
node scripts/verify-modules.mjs
#   Exits non-zero and names every failure if anything is wrong.

# 3. Import (an operator step, once a real Sanity project and a write token
#    exist — this checkout has neither):
sanity dataset import docs/migration/modules.ndjson production --replace

# 4. Rollback: derives the exact undo from the artifact's own ids.
node scripts/rollback-modules.mjs
#   -> docs/migration/modules-rollback-ids.txt (one id per line)
#   -> prints: sanity documents delete <id> <id> ...
```

`docs/migration/modules.ndjson` is committed as a small fixture (30 documents as of
this wave) rather than left generated-only, matching the shared brief's allowance for
an artifact that is "small and useful as a fixture" — `scripts/migrate-modules.mjs` is
still what regenerates it deterministically, and is the actual deliverable.

## Gaps this migration found and did not fill (summary; the full, per-scope list is in

## `docs/migration/modules-report.md`, regenerated by the migrate script)

1. The entire regulation section/provision tree (three documents, ~226 provisions
   total) — no schema field. The wave's headline finding, above.
2. `RegulationMeta.citation`/`authority`/`preamble`/`signatory` — no schema field.
3. `regulation.lifecycle.owner` — required, no source data names an owning portfolio.
4. `content/calendar/events.ts`, all 13 entries — points at content Wave 6A migrates,
   not standalone content itself; no `event` document created.
5. `content/committee.ts`'s `portrait`/`roleEmail` — needs a write token this
   migration does not have (portrait) or has no source at all (roleEmail).
6. Eight of thirteen portfolios — the real 2026 roster does not have a second holder
   for them yet; an operational fact, not invented around.
7. `content/site.ts`'s `socials` and `officialLinks` — no schema field; `officialLinks`
   additionally could not go in `navigation.navLink` even as a fallback, since that
   field is validated to reject any non-internal `href`.
8. `content/quick.ts`, all 20 items across 5 groups — no schema type fits; see the
   three-way rejection above.
9. `content/reporting.ts`, the whole module — no schema type fits; see above.
10. `siteSettings.lifecycle.owner` — required, `content/site.ts` predates the
    portfolio/ownership model and names no owner.

## What this migration did NOT change

Nothing under `content/activity/regulations/**`, `content/calendar/events.ts`,
`content/committee.ts`, `content/site.ts`, `content/quick.ts`, `content/reporting.ts`
or `lib/portfolios.ts` was edited or deleted. This is additive: the 1.0 routes keep
rendering from the TypeScript modules exactly as before, whether or not the NDJSON
artifact above is ever imported.
