# §3.6 disposition ledger and Wave 6 roll-up

Generated and maintained by Wave 6E (REDESIGN-2.0 §3.6, §10, §11.4). This is
two things in one document, per the wave brief:

1. The **disposition ledger** for Wave 6E's own family: every content item
   `docs/SCOPE-AUDIT-2.0.md` covers (the three student-life tracks,
   `/services/university-services`, the emergency scenario content, and the
   Smart Answers `owner` nodes), its **approved** disposition (the audit,
   approved by the operator 2026-08-23, "audit approved as recommended" —
   Wave 6E did not choose any of these, only verified them), and its
   **verified current state** as of this wave.
2. The **wave-level roll-up**: every other Wave 6 family's own diff report,
   read from `docs/migration/*.md` and cross-checked, per the gate in
   REDESIGN-2.0 §11.4: "every 1.0 content item is migrated, signposted or
   redirected, none 404s, and the diff report accounts for every file."

`scripts/verify-dispositions.mjs` asserts the machine-checkable parts of
this offline. Read this document's final section, "Gaps, unapplied rulings
and stale facts", for what it cannot check, because a script cannot read a
sentence in Thai and English side by side and notice one still restates a
policy the other body owns.

## 1. Handbook track — KEEP (7 documents, `content/student-life/{en,th}/handbook/`)

All seven stay published at their existing `/student-life/handbook/*` URL.
No redirect rule applies or is needed (§3.4's existing subtree rule covers
the whole handbook). Verified state: all seven files exist in both locales,
still render through `app/[lang]/student-life/[audience]/[slug]/page.tsx`
(the generic 1.0 MDX route, unchanged by this wave, per the "migration is
additive" rule), and the two concrete factual conflicts the audit named
under `about-bir.mdx` have been **resolved** since the audit was written:

| Document                                 | Verified state                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handbook/about-bir.mdx`                 | BIR office phone/email now matches `internship.mdx` (`02-221-6111 ext. 3409`, `bir@tu.ac.th`), fixed in commit `1cc8ccc` ("Fix two facts the scope audit found wrong on the live site", 2026-08-21), which also confirms the operator's ruling that `internship.mdx` was correct. See §3 below.                                             |
| `handbook/academic-activities.mdx`       | Unchanged. Still names a personal `gmail.com` address for an officer contact (staleness signal, not a §3.6 disposition problem — flagged in §10 below for the committee, not a migration gap).                                                                                                                                              |
| `handbook/academic-life.mdx`             | Unchanged. Cites "Bachelor Degree Regulations, 3rd Edition (2012)" by name; not re-verified against a newer edition by this wave (outside a disposition audit's scope).                                                                                                                                                                     |
| `handbook/admission-and-fees.mdx`        | Unchanged. "Established since 2008" vs. BUILD-BRIEF-2.0's "Founded 2009" still unresolved (§10).                                                                                                                                                                                                                                            |
| `handbook/assessment-and-degree.mdx`     | Unchanged. 127-credit figure vs. BUILD-BRIEF-2.0's "about 126 credits" — **not actually a contradiction**, see §10 item 6: both figures are correct, for different curriculum cohorts, per Wave 6D's own migration report.                                                                                                                  |
| `handbook/curriculum-and-study-plan.mdx` | Unchanged. Owned by Wave 6D (curriculum family); its report, `docs/migration/curriculum.md`, has landed — see §9.                                                                                                                                                                                                                           |
| `handbook/internship.mdx`                | Unchanged and confirmed as the source of truth for the BIR office contact (see `about-bir.mdx`, above). Still cohort-specific (ID 66, AY2025) and still links two Google Forms and CDN-hosted evaluation PDFs — registered in the external link register (§8) as flagged-unstable, not fixed here (content is Wave 7's, not a disposition). |

## 2. Home track — three dispositions (10 documents, `content/student-life/{en,th}/home/`)

### 2a. KEEP (3): `money-matters.mdx`, `places-nearby.mdx`, `food-and-budgeting.mdx`

Unchanged, at their existing URL. Verified present in both locales. The
printing-quota fact in `money-matters.mdx` is covered under §3 below (it was
one of the three conflicts named in the wave brief, and it is resolved).

### 2b. ABSORB (5 of the 6 total ABSORB items — the sixth is in the international track, §4)

The orchestrator has already added all six ABSORB rules to `lib/redirects.ts`
(a frozen file this wave only reads); Wave 5 built the six destination
pages. Verified per the wave brief's specific instruction: does the
BIR-specific slice the audit named actually appear at the destination?

| Source                            | Redirect rule                                                       | Destination                                    | BIR-specific slice named by the audit                                                                                                                 | Verified present?                                                                                                                                                                                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home/getting-around.mdx`         | ✅ `/student-life/home/getting-around` → `/help/getting-started`    | `app/[lang]/help/getting-started/page.tsx`     | The Rangsit routing table (5 routes, fares, journey times)                                                                                            | ✅ **Yes**, present in full, both locales, matching figures                                                                                                                                                                                                                                                |
| `home/getting-involved.mdx`       | ✅ `/student-life/home/getting-involved` → `/whats-on/clubs`        | `app/[lang]/whats-on/clubs/page.tsx`           | The BIR club directory (12 clubs)                                                                                                                     | ✅ **Yes** — `content/clubs/{en,th}/*.mdx` (12 files) power `ClubsExplorer`, matching the 12 clubs named in the source page, plus the audit's requested signpost to TUSU/TUSC rather than restating their tables                                                                                           |
| `home/rights-and-welfare.mdx`     | ✅ `/student-life/home/rights-and-welfare` → `/help/regulations`    | `app/[lang]/help/regulations/page.tsx`         | The three-elections voting content, dress/title rights, free menstrual products and condoms                                                           | ✅ **Yes**, all present. Facility hours and the common-questions accordion were deliberately dropped as campus-directory information, not a rule — matches the ABSORB definition                                                                                                                           |
| `home/safety-and-emergencies.mdx` | ✅ `/student-life/home/safety-and-emergencies` → `/help/reporting`  | `app/[lang]/help/reporting/page.tsx`           | The harassment reporting mechanism, **plus** river safety and common scams (named explicitly by the audit as "genuine local knowledge worth keeping") | ⚠️ **Partial.** The harassment reporting mechanism (`ReportingChannels`, `InterruptionPage`, `ExitThisPage`) is present and correctly implemented. **River safety and common scams content is not present anywhere in 2.0** — not on `/help/reporting`, not elsewhere. This is a **content gap**, see §10. |
| `home/study-support.mdx`          | ✅ `/student-life/home/study-support` → `/help/university-services` | `app/[lang]/help/university-services/page.tsx` | Library entitlements, room booking, printing quota, TU-GET table                                                                                      | ✅ **Yes**, all present, including the resolved printing figure (§3)                                                                                                                                                                                                                                       |

### 2c. SIGNPOST (2 of the 6 total SIGNPOST items in the home track)

`home/shuttle-bus.mdx` and `home/health-and-wellbeing.mdx` stay at their URL
(no redirect). The wave brief's test: does the page read as a genuine
signpost (a disclaimer naming who owns the information, plus curated links
out) rather than still restating that body's own content?

| Document                        | Verified state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `home/shuttle-bus.mdx`          | ⚠️ **Not signposted.** The page is unchanged from 1.0: full route descriptions, the live `ShuttleTimer`/`ShuttleRoute`/`ShuttleTimetable` widgets, and the complete weekday timetable, with no disclaimer that TU (not BIRSA) runs and can change this service. The audit itself flags this page as different in kind ("a live data widget, not republished text") and does not fully resolve whether the general SIGNPOST test even applies cleanly to a live widget — worth the committee's attention rather than a simple pass/fail. See §10.                               |
| `home/health-and-wellbeing.mdx` | ⚠️ **Not signposted.** Still a full page: the complete TU healthcare entitlement table (general treatment, dental, lab tests), the "gold card" transfer explanation, the full list of TU Well Being / Viva City / TCAPS / Relationflip counselling routes with hours and phone numbers, and a full emergency-numbers table. One genuine improvement has landed: the accident-insurance duplication is fixed (§3). But duplication of one fact is not the same as the page being trimmed to a signpost; the rest of the TU-owned content is still fully restated here. See §10. |

## 3. The wave brief's three named conflicts: current status

| Conflict                       | Audit's finding                                                                                                                                                            | Verified current status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Printing quota**             | `study-support.mdx` and `money-matters.mdx` said 100 baht; `/services/university-services` said 200 baht, split into two 100-baht funds                                    | ✅ **Resolved.** All three now say 200 baht, split into two 100-baht funds — `study-support.mdx` ("200 baht per semester, split across two funds"), `money-matters.mdx` ("200 baht per semester"), and both `/services/university-services` and `/help/university-services` ("200 baht in total... Faculty fund 100 baht... University fund 100 baht"). Fixed in commit `1cc8ccc`, before the operator's 2026-08-23 approval. The Thai bookshop discount threshold in `money-matters.mdx`, also "100 baht" but a different fact entirely (a discount trigger, not the printing quota), was deliberately left alone per that commit's own message — verified it is indeed a distinct fact (spend threshold for a 10% discount, not a printing allowance) and was correctly _not_ touched. |
| **BIR office phone/email**     | `internship.mdx` said `02-221-6111 ext. 3409` / `bir@tu.ac.th`; `about-bir.mdx` said `02-613-2304` / `bir@staff.tu.ac.th`. Operator ruled `internship.mdx` correct         | ✅ **Resolved and the ruling was applied.** `about-bir.mdx` now matches `internship.mdx` exactly. Also checked (per the commit message's own claim, spot-verified): `content/site.ts`, the email footer, all four emergency scenarios that carry a BIR contact, and the Smart Answers graph were **already** consistent with `internship.mdx` before this fix — only `about-bir.mdx` needed the correction, and it got it. The fax number that came from the same wrong block was dropped rather than carried forward, since nothing else in the repository corroborates a BIR fax number.                                                                                                                                                                                               |
| **Accident insurance figures** | `home/health-and-wellbeing.mdx` and `/services/university-services` independently stated the same 15,000/150,000/15,000 baht cover figures, with no shared source of truth | ✅ **Resolved, and resolved well.** `home/health-and-wellbeing.mdx` no longer states the figures at all; it now reads "The cover amounts... are on [University services], which is kept as the single source for them. Restating the figures here is how the two drifted apart before." `/help/university-services` (and `/services/university-services`) remain the sole source of the actual numbers. This is exactly the pattern §3.6 asks for and is worth naming as a model for the other SIGNPOST pages that have not yet been trimmed (§2c, §4).                                                                                                                                                                                                                                  |

All three of the wave brief's named conflicts were fixed by commit `1cc8ccc`
("Fix two facts the scope audit found wrong on the live site", 2026-08-21),
**before** the operator's approval on 2026-08-23. Nothing needed doing here
beyond verifying the fix actually landed and actually matches everywhere it
should — which it does.

## 4. International track — three dispositions (6 documents, `content/student-life/{en,th}/international/`)

### KEEP (2): `culture-and-language.mdx`, `phones-and-internet.mdx`

Unchanged, at their existing URL. `phones-and-internet.mdx`'s "connecting to
TU wifi" paragraph was additionally folded into `/help/university-services`
(the Dome/ICT section), per that page's own file header comment — verified
present there. The source paragraph itself was not removed from
`phones-and-internet.mdx` (correct: this wave may not edit `content/**`,
and the audit's own instruction was "fold... into", not "delete from").

### ABSORB (1): `international/arrival-and-first-week.mdx`

| Source                                     | Redirect rule                                                                     | Destination                                | BIR-specific slice named by the audit                    | Verified present?                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `international/arrival-and-first-week.mdx` | ✅ `/student-life/international/arrival-and-first-week` → `/help/getting-started` | `app/[lang]/help/getting-started/page.tsx` | BIRSA welcome content and the first-week setup checklist | ✅ **Yes.** The "what to set up first" order (6 steps) and "first week checklist" (6 items) both appear near-verbatim, plus the "settling in socially" BIRSA welcome-events paragraph and a link out to `/help/reporting` for anything that goes wrong — matching the audit's description that the source page was "already written close to how §3.6 wants a delegated page to read." |

### SIGNPOST (3): `visa-and-immigration.mdx`, `banking-and-money.mdx`, `healthcare-and-insurance.mdx`

| Document                                     | Verified state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `international/visa-and-immigration.mdx`     | 🔴 **Not signposted — and this is the highest-consequence finding in this report.** The page still carries full procedural detail: 90-day reporting options, re-entry permit mechanics, and visa extension processing — **including the exact piece of procedural detail REDESIGN-2.0 §3.6 explicitly names as something this page must not carry**, "for Bangkok-based students, this often means Chaeng Watthana Government Complex." The audit called this page "the highest-risk page on the site" before it even started reading it, and named this exact sentence as a violation of the plan's own rule for this page. It is still there. See §10. |
| `international/banking-and-money.mdx`        | ⚠️ **Not signposted.** Full page: bank account requirements, PromptPay, everyday spending habits, sending money from home, account-issue troubleshooting. No disclaimer that this is bank- and TU-Registrar-owned information; still marked `placeholder`, not yet verified, per the page's own `<Notice>`.                                                                                                                                                                                                                                                                                                                                              |
| `international/healthcare-and-insurance.mdx` | ⚠️ **Not signposted**, and the audit's separate finding #3 is also still open: the insurance requirement is still stated as "many universities, including Thammasat, expect or require," which the audit already flagged as not useful to a student trying to find out whether insurance is actually mandatory. Also still duplicates `home/health-and-wellbeing.mdx`'s hospital-near-campus and emergency-number content on a second page.                                                                                                                                                                                                              |

## 5. `/services/university-services` — SIGNPOST (1 document, not MDX)

| Document                                                                                                                                                                                                                                                        | Verified state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/[lang]/services/university-services/page.tsx` (and its 2.0 destination, `app/[lang]/help/university-services/page.tsx`, which the frozen `/services/university-services` → `/help/university-services` subtree rule in `lib/redirects.ts` already targets) | ✅ **Already a genuine signpost**, matching the audit's own assessment: a `disclaimerTitle`/`disclaimerBody` block ("These are University-run services") sits above the content, each section is attributed to the office that runs it, and figures are cited rather than invented. **Unresolved staleness the audit flagged still applies as expected** (not a disposition defect, a content-freshness one, tracked via the external link register, §6): the military-service dates ("Round 1, 10 August to 9 October 2026") are cohort-specific and will need updating annually; the approved-list Google Drive file, Google Sheet, and Facebook permalink are all registered in §6 as flagged-unstable. |

## 6. Emergency scenario content — KEEP (10 files, `content/emergency/scenarios/`)

Not locale-split (each `.ts` file carries both languages internally, unlike
the MDX tracks). All ten verified present: `generic.ts`,
`active-shooting.ts`, `campus-closure.ts`, `coup.ts`, `earthquake.ts`,
`faculty-closure.ts`, `fire.ts`, `flooding.ts`, `health-advisory.ts`,
`protests.ts`. No redirect needed (not independently addressable URLs; an
Edge Config switch selects one). No disposition change: this wave did not
touch these files, matching the audit's own recommendation. One item
carried over from the audit for the committee's attention, not something
this wave can fix: `coup.ts`'s own header comment still says its Thai copy
is an AI draft needing native-speaker review, and that the Thai Lawyers for
Human Rights and iLaw contact details need confirming before the scenario
is activated for real.

## 7. Smart Answers `owner` nodes — no disposition, verified as designed

43 outcome nodes across `content/smart-answers/topics/{living,wellbeing,study}.ts`
(activities.ts, contact.ts, triage.ts carry no non-BIRSA-owner nodes) name a
non-BIRSA `owner`, per the audit's §3.6. These are graph nodes inside
`/help/answers`, not independent pages, so they carry no disposition and no
redirect question of their own (confirmed: the route itself is unchanged).
Not re-read node by node in this wave — the audit already read all 43 and
found the mechanism working as intended, and this wave's job was to verify
the six _page-level_ dispositions and seed the register, not re-audit
content the audit already cleared. Flagged again here only because §4 of
the audit asked the committee to review them alongside the pages that still
need fixing (§2c, §4 above).

## 8. External link register

See `lib/cms/externalLinkRegister.ts` (`SEEDED_EXTERNAL_LINKS`, 74 entries,
up from the 4-entry placeholder) and
`docs/migration/external-link-seed-report.md` for the full seeding report,
including the label-gap list and which entries are the audit's specifically
flagged unstable links. Not duplicated here to avoid two documents drifting
apart; that report is generated by `scripts/seed-external-links.mjs` and
regenerating it is the way to keep it current.

## 9. Wave 6 roll-up: other families' diff reports

Per the wave brief, this ledger is meant to roll up all five Wave 6 agents'
per-family diff reports. As of this ledger's last edit (re-check with
`node scripts/verify-dispositions.mjs`, which reads the live directory
rather than trusting this prose), `docs/migration/` contained:

- `trees.md` — **Wave 6C, Smart Answers trees.** Present and readable. 14
  topics / 122 nodes / 3 audience questions / 2 onboarding tracks, all
  reported migrated, 0 unaccounted for, per that report's own totals.
- `modules-report.md` (plus `modules.ndjson`) — **Wave 6B, TypeScript
  content modules to Sanity documents.** Present and readable. Its own
  "Unaccounted for" section states "None" and names every source file
  (`content/activity/regulations/**`, `content/calendar/events.ts`,
  `content/committee.ts`, `content/site.ts`, `content/quick.ts`,
  `content/reporting.ts`, `lib/portfolios.ts`) with an outcome. Worth the
  committee's attention on its own terms: this report is explicit that "most
  of the fields named below are gaps, not migrations" — several regulation
  documents' entire provision trees, and `siteSettings`'s official links and
  socials, did not migrate because the target Sanity schema has no field to
  hold them yet. Not a Wave 6E finding to adjudicate, only to note here.
- `curriculum.md` — **the curriculum family (Wave 6D).** Present and
  readable. States "Unaccounted-for files: 0". Also independently corrected
  one of this ledger's own §10 findings, folded into item 6 there: the
  127-versus-126-credit figure is not actually a contradiction.
- `external-link-seed-report.md` — this wave's own (§8 above).

**Still not present:** the MDX-to-Portable-Text family's report (Wave 6A per
REDESIGN-2.0 §11.4's family list). `scripts/verify-dispositions.mjs` fails
loudly on exactly this, by name, rather than silently treating an absent
report as "nothing to roll up" — re-run it once that report lands. **This
wave cannot yet certify the whole-site gate** ("every 1.0 content item is
migrated, signposted or redirected... the diff report accounts for every
file") until that fourth report exists and its own "unaccounted for" count
is zero; it can and does certify its own family's slice, above, and the
three other families that have landed all report zero unaccounted for.

## 10. Gaps, unapplied rulings and stale facts — the plain list

A script can check that a redirect rule exists and that a destination file
is on disk. It cannot read a paragraph and know whether it still restates
someone else's policy. This section is that reading, in one place, blunt
and by file path, exactly as the wave brief asks for.

1. **River safety and common scams content did not migrate.**
   `content/student-life/en/home/safety-and-emergencies.mdx`'s "River
   safety" and "Common scams to know" sections (both explicitly named by
   the audit as "genuine local knowledge worth keeping" and part of the
   BIR-specific slice that should ABSORB into `/help/reporting`) are not
   present at `app/[lang]/help/reporting/page.tsx`, and not present
   anywhere else in `app/[lang]/**` either. Only the harassment-reporting
   mechanism migrated. **This is a content gap for Wave 7 to fill, not
   something this wave can write** (the wave brief forbids hand-written
   content). Exact source: lines 29–39 of
   `content/student-life/en/home/safety-and-emergencies.mdx` (and the
   parallel Thai section in the `th/` twin).

2. **`visa-and-immigration.mdx` still contains the exact procedural detail
   REDESIGN-2.0 §3.6 named as forbidden for this page.** The phrase "for
   Bangkok-based students, this often means Chaeng Watthana Government
   Complex" is still in
   `content/student-life/en/international/visa-and-immigration.mdx`
   (and the Thai twin). This is the single highest-consequence item in this
   report: §3.6 is explicit that this page "should hold no procedural
   detail at all" because "the consequence of a stale sentence is a student
   out of status." The audit flagged this exact sentence by name in
   2026-08-20 and it has not moved. This is a content edit, not a
   disposition or redirect problem, so it is out of this wave's remit to
   fix, but it is the one finding in this whole report that should not wait
   for a routine content pass.

3. **None of the five SIGNPOST home/international pages has actually been
   trimmed to a signpost.** `home/shuttle-bus.mdx`,
   `home/health-and-wellbeing.mdx`, `international/visa-and-immigration.mdx`,
   `international/banking-and-money.mdx`, and
   `international/healthcare-and-insurance.mdx` are all, today, full pages
   restating TU-owned or third-party-owned content in detail — the opposite
   of §3.6's "the page becomes short and deliberately designed" definition
   of SIGNPOST. `/services/university-services` (and its `/help/`
   destination) is the one SIGNPOST item that already reads correctly and
   can serve as the template: a short disclaimer block naming who owns the
   content, then curated links, not a restatement. **None of the SIGNPOST
   trims are content this wave can perform** (again, no hand-written
   content per the wave brief) — this is a named list of exactly which five
   pages Wave 7 (or a dedicated content pass) needs to shorten, and what
   "done" looks like, using `/help/university-services`'s disclaimer
   pattern as the model.

4. **`healthcare-and-insurance.mdx`'s insurance requirement is still stated
   vaguely.** "Many universities, including Thammasat, expect or require"
   (line 15 of
   `content/student-life/en/international/healthcare-and-insurance.mdx`)
   is exactly the wording the audit already flagged in finding 3 of §4 as
   not useful to a student trying to find out whether insurance is actually
   mandatory. Unchanged since the audit.

5. **`home/shuttle-bus.mdx` carries no ownership disclaimer at all.** Unlike
   the other five SIGNPOST items, this one is a live data widget rather than
   republished prose, which the audit itself notes is a different kind of
   problem ("Whether that alone is reason enough..." is not asked about this
   page specifically, but the general SIGNPOST test — a disclaimer naming
   who owns the underlying service — is not met either way). Worth the
   committee deciding whether a widget needs the same disclaimer treatment
   as a prose page, which the audit did not fully settle.

6. **Ordinary staleness signals the audit found and this wave did not
   re-verify, because they are outside a disposition audit's job:**
   `academic-activities.mdx`'s personal `gmail.com` officer contact, and
   `admission-and-fees.mdx`'s "established since 2008" vs.
   BUILD-BRIEF-2.0's "Founded 2009". Neither is a migration gap; both are
   the committee's to decide on, same as the audit originally said.
   **Correction to the audit's own finding, found while cross-checking
   Wave 6D's curriculum migration report:** the 127-credit figure in
   `handbook/assessment-and-degree.mdx` and
   `handbook/curriculum-and-study-plan.mdx` versus BUILD-BRIEF-2.0's "about
   126 credits" is **not actually a contradiction**. Wave 6D's report
   (`docs/migration/curriculum.md`) traces both numbers to real,
   independently-correct source data: 127 credits governs cohorts 64
   through 67 (`content/curriculum/2564.ts`,
   `2564-rev2566.ts`), 126 governs the newer 2568 curriculum (cohorts 68 to
   69). The handbook pages are tied explicitly to "Curriculum 2021, 2023
   revision", i.e. the 127-credit family, so they are currently correct,
   not stale — they will only become wrong once the last 127-credit cohort
   graduates and 2568 is the only live curriculum, which Wave 6D's report
   already flags as a future problem, not a present one. This wave's own
   §3 list above (drafted before reading Wave 6D's report) should be read
   with this correction: that specific figure is not one of the still-open
   contradictions.

7. **The Wave 6 roll-up is incomplete**, not because anything is wrong, but
   because Wave 6A's (MDX to Portable Text) diff report was not yet in
   `docs/migration/` as of this ledger's last edit (§9, above). Waves 6B, 6C
   and 6D have all landed and each reports zero unaccounted-for files.
   Re-run `scripts/verify-dispositions.mjs` once Wave 6A's report lands; it
   will stop naming this as missing the moment it does.

8. **Label gaps in the external link register** are tracked in
   `docs/migration/external-link-seed-report.md`, not repeated here to
   avoid the two documents disagreeing with each other as they're
   regenerated independently.
