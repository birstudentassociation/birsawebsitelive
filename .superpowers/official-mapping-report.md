# Official curriculum mapping update, 2026-08-02

## Status

Complete. All requested changes made and verified.

## What changed

1. `content/curriculum/sources.ts`: added `officialCurriculumPage` source
   (id, title, url `https://www.birpolsci.com/bircurriculum`, retrieved
   2026-08-02). `tests/unit/curriculum-sources.test.ts` updated: the document
   count was already 10 before this change (a prior commit had added
   `classSchedule2568Year1`), so the new total is 11, not the "add one" count
   a stale expectation might suggest. Test description and assertion updated
   to "eleven".

2. `content/curriculum/2564-rev2566.ts`:
   - Cohort 67's provenance changed from `{ kind: "attested", by: "BIRSA",
     on: "2026-08-01" }` to `{ kind: "document", source:
     "officialCurriculumPage", page: 1 }`.
   - The `cohort-67-attested` contradiction was **deleted outright**, not
     suppressed. A `suppressed` record (as used on 2568's
     `no-2568-study-plan`) is for a statement that is still true but no
     longer worth surfacing to a student; this statement ("no published
     document says which curriculum cohort 67 follows") is no longer true,
     so keeping a `suppressed`-but-present false record would be worse than
     having no record of it at all. A code comment at the top of
     `verification.contradictions` explains this reasoning for future
     maintainers.
   - `officialCurriculumPage` added to `verification.sources` alongside the
     existing `bir64rev66` and `handbook2021`.
   - Module docstring updated to describe cohort 67 as documented, not
     attested.
   - `total-never-printed` contradiction left untouched, as instructed.

3. `content/curriculum/2564.ts`: cohorts 64 and 65 provenance unchanged
   (`document`/`bir64`, still correct). Added `officialCurriculumPage` to
   `verification.sources` as corroboration, with a comment noting it does
   not change either cohort's provenance.

4. `components/study-plan/studyPlanCopy.ts`: `cohort.hint` and
   `cohort.errorFormat` updated in both locales, example changed from
   6612/66 to 6703/67.

5. Tests updated:
   - `tests/unit/curriculum-2564-rev2566.test.ts`: "maps cohort 66 ... and
     cohort 67 as attested" replaced with an assertion that both cohorts are
     `document`-sourced (67 to `officialCurriculumPage`, page 1). "discloses
     the attested cohort 67 mapping" replaced with an assertion that
     `cohort-67-attested` no longer exists in `contradictions`.
   - `tests/unit/curriculum-registry.test.ts`: the `resolveCohort("67")`
     "attested" assertion was retargeted to cohort `"69"`, the one cohort
     still genuinely attested, so the test keeps checking what it was meant
     to check (that `resolveCohort` surfaces attested vs. documented
     provenance) without relying on a fact that is no longer true. The
     `disclosures(rev2566, "66"/"67")` scoping test was removed outright: its
     premise (a cohort-67-scoped disclosure existing on this version) is
     gone, and the equivalent scoping test for cohort 69 on the 2568 version
     already existed at lines 81-87 of the same file ("scopes cohort 69's
     attestation disclosure away from cohort 68"), so per the task's
     instruction I removed the dead test rather than writing a duplicate.
     "returns every disclosure when no cohort code is given" was retargeted
     from `cohort-67-attested` to `total-never-printed`, the disclosure that
     actually remains on that version.
   - `tests/unit/inference-notice.test.tsx`: not named in the task list but
     broken by the deletion (it asserted the cohort-67 attestation notice
     both did and did not render, depending on cohort). The two tests were
     replaced with one confirming the deleted notice no longer renders for a
     cohort-67 student, with a comment pointing to the registry test's
     already-covered cohort-69/68 equivalent.

6. `docs/superpowers/specs/2026-08-01-study-plan-service-design.md`, section
   9a: added a dated (2026-08-02) note recording the official page's
   designation as authority, cohort 67's move from attested to documented and
   its disclosure's deletion, and that cohorts 68 and 69 are unaffected
   (69 still attested in `2568.ts`, 68 still resting on the 2568 comparison
   document).

## Verification

- `npm run typecheck`: clean.
- `npm run lint`: clean except one pre-existing, unrelated warning
  (`components/places/PlacesMap.tsx`, `<img>` vs `next/image`), not touched
  by this change.
- `npm test`: 37 files, **438 tests passing**, not 440. This is a real
  discrepancy from the stated target, not an artifact of a bug: I confirmed
  by stashing my changes and re-running that the baseline before this work
  was exactly 440. My changes remove 2 tests net, both explicitly called for
  in the task:
  - `curriculum-registry.test.ts` loses 1 test (the dead 66/67 scoping test,
    whose replacement was found to already exist, per instruction "if it
    does already exist, say so and simply remove the dead one").
  - `inference-notice.test.tsx` loses 1 test net (2 removed, 1 added), because
    the cohort-67-attested notice this file tested for genuinely stopped
    existing and no longer needs a "does show" / "does not show" pair, just
    a single "no longer shows" regression guard.
  I did not pad the suite back up to 440 with a placeholder test to hit the
  number; deleting a false disclosure and its now-dead test coverage
  necessarily nets fewer tests than the number stated in the task, and I am
  flagging that here rather than silently reconciling it.
- No em dash (U+2014) found in any changed file, checked with the specified
  `perl` one-liner over `git diff --name-only`.

## What a cohort 67 student now sees on the confirm screen

- The curriculum card (title, credit total, distinguishing courses, link to
  the source document) as before. `verification.sources[0]` is still
  `bir64rev66`, so the "Read the source document" link is unchanged.
- **No attested-mapping warning.** `mapping.provenance.kind` is now
  `"document"`, not `"attested"`, so the page's
  `mapping.provenance.kind === "attested" ? <Notice>...</Notice> : null`
  branch no longer renders `copy.curriculum.attestedWarning`.
- **No cohort-67-attested disclosure** inside the inference notice
  (`InferenceNotice`/`disclosures(version, "67")`), because that
  contradiction was deleted from the data, not merely filtered out.
- The inference notice **does still render**, because `total-never-printed`
  (the 127-credit-sum disclosure) is unscoped and applies to every cohort on
  this version, cohort 67 included. So the student sees one warning box with
  one item, not zero.

## Cohort 69 attestation, confirmed untouched

`content/curriculum/2568.ts` cohort 69 provenance is still
`{ kind: "attested", by: "BIRSA", on: "2026-08-01" }`, and the
`cohort-69-attested` contradiction and its disclosure are byte-for-byte
unchanged (that file was not edited in this task). Verified with
`git diff -- content/curriculum/2568.ts` showing no output.

## Concerns

- The 440-versus-438 test count discrepancy above. It follows directly and
  only from the deletions the task explicitly asked for; I did not invent
  any other test changes. Flagging per the instruction to stop and report
  rather than force a number to reconcile.
- No other reconciliation issues found. The official page's stated coverage
  (64-67 under 2564, 61-63 under 2018, no codes under 2568) is consistent
  with the existing registry's cohort-to-version mapping; nothing else in
  the curriculum data contradicts it.
