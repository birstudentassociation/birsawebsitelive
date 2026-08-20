# CMS schema conventions

`REDESIGN-2.0.md` §11.3 item 7. **Frozen.** §11.7 names these among the things that must never
be parallelised: one agent, Wave 0.

Wave 3 has not started, and cannot: it is gated on the Sanity plan application
(`docs/DECISIONS-2.0.md` gate 1). The plan is explicit that "no schema work starts until the
plan is known, because the answer determines whether section 7's permission model is
enforceable or merely documented." **No `sanity/` directory exists yet, and creating one before
that gate clears would be building against a permission model that may not be purchasable.**

The conventions below are written now anyway, because they are what Wave 3 is held against and
because most of them are already enforced in TypeScript, where they hold whether or not the CMS
ever arrives.

---

## 1. One file per domain, composed by a frozen index

```
sanity/schemaTypes/<domain>.ts
sanity/schemaTypes/index.ts     # FROZEN, composes the domains
```

Same reason as the dictionary split (§11.2): schema agents never share a file, so conflicts go
to zero. Wave 3's five agents map to domains, not to a shared `schemas.ts`.

## 2. The lifecycle field set is on every document type

Implemented in `lib/content/lifecycle.ts` and mirrored in the schema. `status`, `publishAt`,
`owner`, `lastReviewed`, `reviewBy`, `slugHistory`, `maintainedBecause`.

`owner` is required on everything and is a `PortfolioId` from `lib/portfolios.ts`. This is what
makes the review queue and the handover pack generatable, both being "show me what this
portfolio owns".

## 3. Localisation: document-level, shared slug

Match the site's existing architecture rather than inventing a second one. **Slugs are
identical across locales**, English kebab-case acting as the shared key; only titles and
content differ. That is how 1.0 works, it is better than most bilingual government sites
manage, and it is load-bearing for `swapLocalePath`, the language toggle, and the hreflang
alternates.

**Bilingual parity is a publish-blocking validation, not a review convention.** A document
without both locales cannot leave draft. This is principle 14 and it is one validation rule.
Once officers publish directly, "enforced by review" means "not enforced".

## 4. Validation helper signatures

Three validators exist and each has exactly one implementation, shared by the Studio, the build
check and the tests, so the three cannot disagree:

| Concern             | Implementation                    |
| ------------------- | --------------------------------- |
| House style         | `lib/content/houseStyle.ts`       |
| Lifecycle           | `lib/content/lifecycle.ts`        |
| Images and alt text | `components/bds/imageContract.ts` |
| Service definitions | `lib/services/defineService.ts`   |

Every one returns **findings with a field path and a bilingual message**, never a boolean. §6.5
step 3 puts the message next to the field in the editor's own language, and acceptance test row
34 is "the message says what to fix, not what failed". A boolean cannot do either.

Rules that cannot distinguish a mistake from a legitimate choice **warn rather than block**.
`blockingRules` in `houseStyle.ts` is the list that blocks. The sentence-case check is
deliberately not on it: the first officer to write "Welcome week at Thammasat" must not be
stuck with no way forward and no developer to ask.

## 5. The section palette is the only way to build a page

`components/bds/sectionPalette.ts`. Eleven types, each rendering through a `bds/` component.

**There is no rich-text escape hatch, and there will not be one.** No raw HTML field, no
arbitrary embed, no custom CSS field. `forbiddenSchemaFields` names them and
`tests/unit/bds-contracts.test.ts` asserts their absence. Those three fields are how every
constrained CMS eventually becomes unconstrained.

Rich text is constrained too: `allowedMarks` and `allowedBlocks`. `h1` is absent, so an officer
cannot produce a second `h1` inside a body and break the heading order the accessibility suite
asserts.

## 6. The CMS never holds personal data

> **Sanity holds published content and site configuration. It never holds personal data.**

Everything a student submits stays in Postgres, behind the officer console, under the existing
audit log and retention paths. The Content Lake is a publishing system, and treating it as an
operational database would put BIRSA's most sensitive records in a third-party store chosen for
a different purpose with a permission model designed for a different problem.

**One qualification, and it is real (§6.10).** A published photograph of an identifiable student
is that student's personal data, whoever uploaded it. So the processor entry says so plainly
rather than claiming "no personal data", and event photography gets its own processing activity
with a lawful basis, a retention trigger and a deletion path. The operational boundary is
unchanged: submissions, receipts and found-item photographs never enter the CMS.

The schema enforces this by **having nowhere to put it**. That is stronger than a rule, and it
is why "add a field for the student's reply" is a schema change with a reviewer rather than a
five-minute edit.

## 7. Three content types get stronger controls rather than an exemption

The roadmap proposed leaving these in git because they change slowly and carry real
consequences. That reasoning is sound, but leaving them in git means the IT officer is still
required for them, which fails the governing requirement. So they move, and the test net is
replaced with controls the officer meets in the editor:

- **Smart Answers.** Schema-enforced referential integrity: every outcome reachable, every
  question with at least two answers, every answer pointing at an existing node, and the
  `out-not-covered` honest fallback **mandatory and undeletable**. Publishing runs a tree
  validation and blocks on failure. Acceptance test row 13.
- **Curriculum.** Credit totals, prerequisite cycles and source citations become schema
  validation, plus a mandatory second approver. It changes about once every few years and an
  error sends a student to the wrong graduation, so it gets the strictest workflow on the site.
  It does not get a developer.
- **The privacy register.** Officers may edit the descriptive text. They may **not** create an
  activity, change a lawful basis, or change a retention period, because those are legal claims
  `lib/privacy/retention.ts` has to honour in code. A nightly integrity check asserts that every
  published register entry has a matching implemented retention path and every implemented path
  has an entry; a divergence raises a blocking console alert and emails the President.

That last one is the general shape for **anything where the content is a promise the code must
keep**.

## 8. What an officer cannot do, by design

Each of these routes to a developer, and §6.12 says so plainly, which is what makes the rest of
the "no code" claim honest:

- Mark a service sensitive, or unmark one.
- Create a question that collects a category of personal data with no retention rule.
- Change what happens after submission beyond the queue, the standard and the escalation target.
- Add a section type, a question type, a field, or a document type.
- Change the design system, and therefore how anything looks.

## 9. When Sanity is unavailable

Adding a hosted dependency to a site that had none is the real risk in this plan, and the
existing house rule already says what to do: every module reports itself as **not configured**
rather than crashing.

- Content is cached, not fetched per request. An outage means content stops updating, not that
  pages stop serving.
- **Stale is better than absent.** A failed revalidation serves the last good render and logs
  it. The reader sees nothing wrong, because nothing is wrong.
- A **build-time content snapshot** is committed on every deploy, so the site still builds if
  the Content Lake is unreachable. This is a backup and a hedge against the platform in one
  file.
- **Emergency mode is deliberately not in the CMS**, so the one thing that must work during an
  incident does not depend on the thing most likely to be part of one.

## 10. The Studio speaks Thai

`@sanity/locale-th-th` exists and is maintained. Install it and make Thai the Studio's
**default**, not an option a Thai-first officer has to find.

This is not a nicety. An editing surface in English only would have quietly excluded part of the
committee from holding a grant at all, which is §7.2's two-person rule failing for a reason
nobody would have written down.

Field titles and descriptions are still authored bilingually **by us, in the schema**, because
the locale bundle translates Sanity's interface and not BIRSA's schema. Every field gets a
description saying what it is for and what good looks like, in both languages, reviewed like
code.
