# MDX to Portable Text migration

REDESIGN-2.0.md §11.4 item 6 (one of five Wave 6 content-migration agents). Source
family: `content/news/{en,th}/*.mdx`, `content/clubs/{en,th}/*.mdx`,
`content/activity/{en,th}/*.mdx`, `content/student-life/{en,th}/{handbook,home,
international}/*.mdx` — 126 files, 63 bilingual pairs, every one of them prose that
has to survive a format change without losing meaning, links or its Thai/English
pairing.

## The headline finding: `portableText`/`portableTextInline` cannot hold a bilingual document

This is the load-bearing result of this migration, and it converges independently
with Wave 6B's own finding on `regulation.ts` (`docs/migration/modules.md`'s
"headline finding") — two different agents, working on two different content
families, hit the same wall in the same schema file for the same reason.

`sanity/schemaTypes/objects/portableText.ts` defines `portableText` (used by the
`rich-text` section) and `portableTextInline` (used by `inset-text`) as bare Portable
Text arrays: `type: "array"`, no `{ en, th }` wrapper. Every OTHER text field in this
schema — `title`, `summary`, `tagline`, a notice's `body`, an accordion item's
`question`/`answer`, a card's `description` — is `localizedString` or `localizedText`,
both of which are objects carrying both languages and both `Rule.required()`. The two
Portable Text types are the only text-bearing fields in the entire schema that are not
bilingual, and `rich-text` is not a corner case: it is what most of a page actually
is. Every migrated document in this family has at least one `rich-text` section, and
in the overwhelming majority of files it is most of the document.

**What this migration does about it, and why.** Splitting into two Sanity documents
(one per locale) was rejected: nothing else in this schema has a locale field on the
document itself, `slug` is meant to be shared, and it would silently invent a second
IA the rest of 2.0 does not have. Flattening both languages' prose into one field was
rejected as translation-adjacent guessing this migration does not get to do. What each
`rich-text`/`inset-text` section actually carries in the NDJSON below:

- `content`: the **English** Portable Text blocks, in the schema's own declared,
  Studio-editable field.
- `_i18nGapPortableText`: the **Thai** Portable Text blocks for the same section, in a
  sibling property the schema does not declare. Sanity's dataset import does not
  validate against the schema (there is no write token in this checkout to test that
  against directly, but the Studio only renders fields it knows about), so this
  property survives the NDJSON round trip without becoming visible or editable
  anywhere an officer would find it. It exists purely so the Thai prose is not
  discarded, for whoever adds real bilingual support to these two types.

Nothing is silently lost: the original MDX files are untouched (this migration is
additive, per the shared brief), and every section this affects is named, by document
id and section index, in `docs/migration/mdx-report.md`.

**What the schema needs, going forward (not this wave's job to fix):** give
`portableText`/`portableTextInline` the same `{ en, th }` wrapper every other text
field already has. Nothing else about the type needs to change — the block/mark/list
vocabulary is fine, as this migration's own coverage below demonstrates.

## The second finding: `category` is the one field the schema's own comments already expect

`sanity/schemaTypes/documents/newsArticle.ts` and `event.ts` both carry the same
header comment, verbatim: "See the wave report for the one field 1.0 has that this
schema does not carry unlocalised." That field is `category`: 1.0 stores it once per
locale file (`lib/content.ts`'s `newsFrontmatterSchema.category: z.string()`), 2.0's
`category` field is a bare `string`, not a `localizedString`. In this corpus the two
locale files always already agree — `announcements`/`community`/`events`, identical in
both languages, verified for every migrated item — so no content is lost today, but a
future officer writing different English and Thai category labels has nowhere to put
both.

## A deviation from this brief's own source-family table, named plainly

The brief's table says `content/news/{en,th}/*.mdx -> newsArticle`, full stop. This
migration does not follow that literally: `content/news` items with frontmatter
`type: "event"` become `event` documents, not `newsArticle`. The evidence for this is
`sanity/schemaTypes/documents/event.ts`'s own header, which says outright that it
"Models what `content/news/{en,th}/*.mdx` already carries for a `type: "event"` entry
... split into its own document type because ... 1.0's single `type` flag on one
schema is exactly the ambiguity this wave is meant to remove." Following the brief's
one-line summary over the schema it summarises would have put every event's
`location`/`start`/`end` into a document type with no fields for them at all. Where a
brief and the schema it is summarising disagree, this migration followed the schema,
and is saying so here rather than quietly.

One consequence of this split is itself a finding: three `type: "event"` posts —
`august-2026-activity-calendar`, `july-2026-activity-calendar` and
`june-2026-activity-calendar` — are monthly round-ups of several dates in a table, not
a single happening with one place and one start time. `event.location` and
`event.start` are both `Rule.required()`; these three have neither. 1.0's binary
`type` flag cannot distinguish "a single event" from "a dated round-up post", and this
migration does not get to decide which of `newsArticle`/`event` a round-up "should
really" be — that is exactly the kind of judgement call the shared brief reserves for
a human. They are reported as `not-migrated`, by name, with the reason spelled out.

## Every other 1.0 field this migration found with no 2.0 destination

- **`page` has no `order` field.** 1.0's `content/activity/*.mdx` frontmatter carries
  a required `order` used to sequence the activity/about listing;
  `sanity/schemaTypes/documents/page.ts` has no such field (unlike `guide`, which
  keeps it). Noted on every migrated `page` document. Either `page` needs the field
  back, or listing order needs to move to the `navigation` document type Wave 3D
  built.
- **`newsArticle`/`event`'s frontmatter `links` array has no destination.** A handful
  of posts (mostly `type: "event"`) carry `links: [{ label, href }]` — e.g. "Follow
  @tusu.tpc on Instagram." Neither 2.0 document type has a field for it. Dropped, with
  the original label/href pair recorded in the per-document note so nothing has to be
  re-derived from the MDX by hand.
- **`lifecycle.owner` and `lifecycle.reviewBy` are omitted on every single migrated
  document.** Both are `Rule.required()` (`sanity/schemaTypes/objects/lifecycle.ts`).
  Both are 2.0 concepts with no 1.0 analogue: 1.0 content carries no per-document
  owning portfolio and no review-by date, and assigning an owner is an editorial
  decision for the owning portfolio to make, not something a migration script invents
  ("no agent hand-writes content" — an owner is content, not formatting). Every
  document in `docs/migration/mdx.ndjson` will show as unpublishable in the Studio
  until an officer sets both by hand. This is expected on every row of the report, not
  a bug, and it is the single most consequential piece of manual follow-up work this
  migration leaves behind: 50 documents, each needing an owner assigned once.
- **A raw HTML `<table>`'s `<caption>` has no destination.** Three files
  (`health-and-wellbeing.mdx` en/th, `culture-and-language.mdx` en, hitting only the
  raw-HTML-table branch, not the placeholder-variant one below) author an accessible
  table with a `scope="row"`/`scope="col"` header structure and a screen-reader-only
  caption; `sanity/schemaTypes/objects/portableText.ts`'s `table` object is `rows` of
  plain-string `cells`, with no field for a caption and no way to mark a cell as a row
  or column header. The caption text is dropped (noted, by its exact text, in the diff
  report); the header/data distinction that made the original table accessible does
  not survive into Portable Text at all, silently, because there is nowhere in the
  target shape to even note that it happened per cell. This is worth the schema
  owners' attention specifically because it is an accessibility regression, not just a
  content-fidelity one.

## What this migration handles, construct by construct

Enumerated from the real corpus with a script (not eyeballed), each mapped to exactly
one thing, each with a `tests/unit/migration-portable-text.test.ts` case:

| MDX/Markdown construct                                                                                                                        | Portable Text mapping                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `## h2`, `### h3`                                                                                                                             | `block.style: "h2"/"h3"`                                                                                            |
| `#`, `####`, `#####`, `######`                                                                                                                | **Refused.** `h1` is the page's own title; `h4`-`h6` have no style option in `allowedBlocks`.                       |
| paragraph                                                                                                                                     | `block.style: "normal"`                                                                                             |
| `**bold**`, `*italic*`, `` `code` ``                                                                                                          | `strong`/`em`/`code` marks                                                                                          |
| `[text](href)`, internal                                                                                                                      | a `link` markDef, `href` rewritten through `resolveRedirect`/`resolveRedirectChain`                                 |
| `[text](href)`, external / `mailto:`                                                                                                          | a `link` markDef, `href` unchanged                                                                                  |
| an internal link matching no redirect rule and no 2.0 route family                                                                            | **Reported, not silently rewritten**: kept as authored, named in the diff report's notes.                           |
| `- x`, `1. x`, arbitrarily nested                                                                                                             | flattened to `listItem: "bullet"/"number"`, `level: N` per Portable Text's own flat-list model                      |
| GFM pipe table                                                                                                                                | the `table` object: `rows[].cells[]`, plain text (schema's own documented decision)                                 |
| raw HTML `<table><thead>/<tbody>...`                                                                                                          | the same `table` object; `<th>`/`<td>` both flatten to a plain cell, `<caption>` dropped (above)                    |
| `> quote`                                                                                                                                     | `block.style: "blockquote"`                                                                                         |
| `---` thematic break                                                                                                                          | **Refused.** No divider block in `allowedBlocks`.                                                                   |
| `<Notice variant="info\|success\|warning\|error" title?>`                                                                                     | the `notice` section: `variant`, optional `title`, `body` (paragraphs joined, marks flattened)                      |
| `<Notice variant="placeholder">`                                                                                                              | **Refused.** 1.0's fifth variant has no 2.0 equivalent (`sectionTypes.ts`'s `notice.variant`).                      |
| consecutive `<Accordion summary>...</Accordion>`                                                                                              | grouped into one `accordion` section, one `accordionItem` per element                                               |
| `<Email address subject? label?>`                                                                                                             | a `link` markDef with a `mailto:` href, inline                                                                      |
| raw `<a href>` (used outside any table too)                                                                                                   | a `link` markDef, same as a markdown link                                                                           |
| `<RelatedClubs slugs="a,b" />`                                                                                                                | a `related-links` section, each slug resolved to the target club's own title/tagline/`_id`                          |
| `{" "}` (MDX expression, literal string only)                                                                                                 | the literal space it represents                                                                                     |
| `<GoogleForm>`, `<Shuttle{Timer,Route,Timetable,ServiceNotice}>`, `<NearbyFood>`/`<NearbyHousing>`, `<ReportHarassment>`, `<CommitteeRoster>` | **Refused.** App runtime behaviour with no MDX-authored content to migrate; no section represents any of them.      |
| any other JSX component, any other markdown/MDX node type                                                                                     | **Refused, by name**, so a future component added to `lib/mdx.tsx` fails migration loudly rather than disappearing. |

`CommitteeRoster` never actually appears in the corpus (checked); it is listed because
it is in `lib/mdx.tsx`'s registry and would refuse the same way if it were used.

## Running it

Entirely offline. No `SANITY_API_READ_TOKEN`, no network, at every step — the shared
brief is explicit that no write token exists in this checkout at all.

```bash
# 1. Migrate: reads content/**, writes the NDJSON artifact and diff report.
node scripts/migrate-mdx.mjs
#   -> docs/migration/mdx.ndjson        (gitignored: generated, deterministic, see below)
#   -> docs/migration/mdx-report.md     (committed: the audit record)
#   -> docs/migration/mdx-report.json   (committed: the same data, machine-readable)

# 2. Verify: asserts the gate against the two files above, offline.
node scripts/verify-mdx.mjs
#   Exits non-zero and names every failure if anything is wrong.

# 3. Import (an operator step, once a real Sanity write token exists — this
#    checkout has none; SANITY_PROJECT_ID "vbo54y9j", dataset "production",
#    per sanity/projectConfig.ts):
sanity dataset import docs/migration/mdx.ndjson production --replace

# 4. Rollback: derives the exact undo from the artifact's own ids, not from
#    a second id computation that could drift from what was actually imported.
node scripts/rollback-mdx.mjs
#   -> docs/migration/mdx-rollback-ids.txt (gitignored, one id per line)
#   -> prints: xargs sanity documents delete < docs/migration/mdx-rollback-ids.txt
```

`docs/migration/mdx.ndjson` and `mdx-rollback-ids.txt` are gitignored (see the
repo-wide rule in `.gitignore`, "Wave 6 content-migration artifacts"): they are
generated and deterministic — `node scripts/migrate-mdx.mjs` rebuilds
`mdx.ndjson` byte-for-byte from `content/**` on an unchanged tree
(`tests/unit/migration-mdx.test.ts` asserts this directly) — so committing them would
put a second, format-nobody-reads copy of the whole content corpus in git history that
goes stale the moment a content file changes. The **report** is what is committed: it
is the audit record the wave gate is written against, and it is what
`scripts/verify-dispositions.mjs`'s wave roll-up check (Wave 6E) looks for.

## Result of the last run against this corpus

126 source files (63 bilingual pairs) → **50 documents**: 16 `guide`, 12 `club`, 11
`newsArticle`, 6 `page`, 5 `event`. 100 files migrated, 26 not-migrated (13 pairs), 0
bilingual-pairing gaps, 0 unaccounted for. The full, authoritative, per-file list —
regenerated on every run, never hand-edited — is `docs/migration/mdx-report.md`. The
13 not-migrated pairs, by root cause:

1. `Notice variant="placeholder"` (5 items: `activity/transparency`,
   `student-life/home/food-and-budgeting`,
   `student-life/international/{culture-and-language,banking-and-money,
visa-and-immigration}`). Four of these five are additionally authored as a single
   line with no blank line around the tag (`<Notice variant="placeholder">text
</Notice>`), which MDX itself parses as inline text rather than a block element —
   so the diff report's proximate reason for those four reads "unrecognised inline
   JSX/HTML element" rather than naming the variant directly. The root cause is the
   same either way (verified by hand against each file: every single-line `<Notice>`
   in the entire corpus is a `variant="placeholder"` one, so none of the four would
   have migrated even with inline-Notice support added); recorded here so the
   discrepancy in the report's wording is not mistaken for a second, unrelated bug.
2. `<GoogleForm>` (1 item: `news/polsci-orientation-2026`).
3. A thematic break (1 item: `news/tpc-crazy-week-2026`).
4. `<ShuttleServiceNotice>` (and its siblings on the same page) (1 item:
   `student-life/home/shuttle-bus`).
5. `<NearbyFood>`/`<NearbyHousing>` (1 item: `student-life/home/places-nearby`).
6. `<ReportHarassment>` (1 item: `student-life/home/safety-and-emergencies`).
7. `event.location`/`event.start` required but absent (3 items: the June/July/August
   2026 activity-calendar round-ups — see "A deviation..." above).

## Cross-check requested by Wave 6B

`content/calendar/events.ts` references 11 distinct `content/news` slugs by `slug`
and relies on the matching `newsArticle`/`event` document (not a document of its own —
Wave 6B deliberately emits none, to avoid colliding with this family's ids) to carry
the date the calendar marker needs. As of this run: **6 of the 11 referenced slugs are
not currently migrated** — `tpc-crazy-week-2026` and `polsci-orientation-2026` (root
causes 2 and 3 above) and `august-2026-activity-calendar`,
`july-2026-activity-calendar`, `june-2026-activity-calendar` (root cause 7 above,
three of the eleven, not all activity-calendar posts — only the ones lacking a single
location). Until those root causes are fixed, `content/calendar/events.ts`'s markers
for those six slugs point at a Sanity document that does not exist. The other five
referenced slugs (`academic-calendar-2569`, `birsa-committee-recruitment`,
`faculty-77th-anniversary`, `freshers-orientation-2026`,
`singhadang-samphan-2026`, `bir18-pre-session`) resolved correctly and carry a date.
This same check runs automatically inside `scripts/migrate-mdx.mjs` (see its
`intro` in `mdx-report.md`, "Cross-family check, requested by Wave 6B") so it stays
current as either family's content changes, rather than going stale as a one-time note
in this file.

## What this migration did NOT do

- **No hand-written content**, anywhere. Every string in `docs/migration/mdx.ndjson`
  traces to a real MDX file or frontmatter field; where a field needed text the
  source did not have (an owner, a review date, a caption's destination), it is a
  reported gap, not a guess.
- **No disposition decisions.** The six §3.6 ABSORB documents under
  `content/student-life/**` are migrated into `guide` documents exactly like every
  other student-life file in this family; whether their 1.0 URL survives, redirects,
  or is absorbed elsewhere is `lib/redirects.ts`/Wave 6E's decision, not this
  migration's, and this migration does not special-case them.
- **No machine translation.** A source file with no locale twin is a `gap` entry
  naming the missing path; nothing was written to close it. This run found none (0
  gaps) — every one of the 126 files already has its twin.
- **Nothing deleted or edited under `content/**`.** This migration is additive; the
  1.0 routes keep rendering straight from the MDX files exactly as before, whether or
  not `mdx.ndjson` is ever imported.
- **`lib/redirects.ts` was not touched.** Every internal link this migration resolves
  goes through its existing `resolveRedirect`/`resolveRedirectChain`/
  `routeFamilies2_0` exports; no new rule was needed for anything this family's links
  actually reference.

## Everywhere this migration had to guess, named plainly

- **Table cells with a link** (`sanity/schemaTypes/objects/portableText.ts`'s own
  comment: "a plain text table, no formatting inside a cell") render as `"link text
(resolved-href)"` rather than dropping the href. Same treatment for a link inside a
  `notice`/`accordion` body (both `localizedText`, plain strings, no mark structure at
  all). This is a representation decision, not new content — the same information the
  source authored, in a format the target field can actually hold — but it is a
  decision, and it is applied uniformly (see `lib/migration/portableText.ts`'s
  `inlineToPlainText`).
- **A club's `socialLinks`** pairs the EN and TH `links` arrays positionally by index.
  Where the two arrays differ in length, `socialLinks` is dropped for that club and
  noted (this run: never happened). Where they agree in length but a given position's
  `href` differs between locales, the EN href is kept and the disagreement is noted
  (this run: never happened either — every club's link hrefs already match across
  locales).
- **`lifecycle.status`** is set to `"published"` on every migrated document, since 1.0
  content is live production content today; nothing was set to `"draft"`, which would
  misrepresent already-published material as not yet released.
- **`lifecycle.lastReviewed`** is populated from whichever 1.0 field is the closest
  real analogue per document type: `updated` for `club`/`page`/`guide`,
  `date` (the published date) for `newsArticle`/`event`, which do not carry an
  `updated` field at all. This is the best available real data, not an invented date.
