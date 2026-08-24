# Curriculum and course-review migration

## Disposition: this family migrates

REDESIGN-2.0.md §6.3 and CMS-SCHEMA-CONVENTIONS.md §7 both already decide this, in
those words: curriculum data moves to Sanity, not exempted to stay in git the way
`content/emergency/**` is. §6.3 explicitly considers and rejects the "leave it in git,
it's protected by tests" argument, for the same reason it rejects it for Smart
Answers and the privacy register — leaving it in git keeps the IT officer required for
an edit, which fails the redesign's governing requirement. This migration does not
re-argue that; it implements it.

## The gap this migration could not close: there is no schema yet

`sanity/schemaTypes/index.ts` registers no `curriculumVersion` or `courseReview`
document type. No wave has built one. The document shapes in
`lib/migration/curriculum.ts` (`CurriculumVersionDocument`, `CourseReviewDocument`)
are this migration's best-effort specification of what that schema needs to accept —
built by mirroring `content/curriculum/types.ts` and `content/course-review/types.ts`
field-for-field, not invented — but they are not a reviewed schema, and until one
exists the `sanity dataset import` command below has nothing to import into.

## What this migration does NOT change

Nothing in `content/curriculum/**` is deleted or modified, and `lib/study-plan/**`
keeps reading `CURRICULUM_VERSIONS` from `content/curriculum/index.ts` exactly as it
does today. This is additive, per the shared Wave 6 brief. Repointing the study-plan
service at Sanity instead of the TypeScript module is a separate, later piece of work;
doing it in this wave would mean shipping a runtime dependency on a schema that does
not exist yet.

## Numeric contradictions this migration carries, and does not resolve

Two graduation totals are genuinely both correct, for different cohorts, not a data
bug: `content/curriculum/2564.ts` and `2564-rev2566.ts` encode 127 credits (cohorts
64-67); `content/curriculum/2568.ts` encodes 126 (cohorts 68-69). Both numbers are
internally consistent with their own category-credit sums (checked by
`checkCreditArithmetic` below) and both are carried as-is, per source: 127 is never
printed as a single figure in `bir64`/`bir64rev66` (it is the sum of 30 + 91 + 6, per
`docs/curriculum-sources.md` item 4); 126 is printed directly in `comparison2568` at
page 4. Neither is picked over the other; they govern different cohorts and both ship.

`docs/SCOPE-AUDIT-2.0.md` (row for `handbook/curriculum-and-study-plan.mdx`) and
`handbook/assessment-and-degree.mdx` both state 127 credits, while
`docs/BUILD-BRIEF-2.0.md` §3 says "about 126 credits". Read against this migration's
data, that is not a fresh contradiction: 127 matches the 2564 / 2564-rev2566 family
(the curriculum those handbook pages are explicitly tied to, per their own "Curriculum
2021, 2023 revision" framing), and "about 126" matches 2568, the newer curriculum the
build brief is describing prospectively. Both figures are right for the version they
describe; the handbook pages will read as wrong once cohort 66/67 graduates and 2568
is the only live curriculum, which is Wave 6A's problem to flag, not this migration's
to fix.

The 91-versus-94 major-requirement contradiction `docs/SCOPE-AUDIT-2.0.md` and
`docs/curriculum-sources.md` both mention (item 7) is in the 2561 curriculum, which
has no enrolled cohort and is out of scope for `content/curriculum/**` entirely — it
appears nowhere in the data this migration reads.

## A finding outside this migration's own data: docs/curriculum-sources.md is stale

That document (crawled 2026-08-01) records contradiction item 1 as live: "the 2568
curriculum has no published study plan handout... the semester sequence is inferred
from `bir64rev66`." `content/curriculum/2568.ts`'s own file header says this was
superseded the next day: a fuller read of `comparison2568` found the actual published
plan at section 4.3.2.3, pages 53-55, and the `no-2568-study-plan` contradiction and
its inferred-derivation notice were deleted from the code on 2026-08-02, not
suppressed. The data this migration carries is current (`recommendedPlan.derivation.kind`
is `"published"`, not `"inferred"`, for 2568); `docs/curriculum-sources.md` was not
updated to match. Worth a one-line fix by whoever owns that document; this migration
does not modify it (outside this family's owned paths).

## Cross-reference: clean

Every course code a course-review entry names exists in at least one curriculum
version's catalogue (84 of 84). Every prerequisite in every curriculum version's course
list resolves to a real course code in that version's own catalogue. No prerequisite
cycles. No cohort code is claimed by two versions. Category credits sum to the stated
graduation total in all three versions. These are asserted by
`runAllChecks` in `lib/migration/curriculum.ts` and re-run, offline, against the emitted
artifact by `scripts/verify-curriculum.mjs`.

## Document index: curriculum versions (3)

| Document id | Label | Cohorts | Graduation credits | Courses in catalogue |
| --- | --- | --- | --- | --- |
| curriculum-version-2564 | Curriculum 2021 (B.E. 2564) | 64, 65 | 127 | 95 |
| curriculum-version-2564-rev2566 | Curriculum 2021 (B.E. 2564), 2023 revision | 66, 67 | 127 | 94 |
| curriculum-version-2568 | Curriculum 2025 (B.E. 2568) | 68, 69 | 126 | 94 |

## Document index: course reviews (84)

| Document id | Code | Title |
| --- | --- | --- |
| course-review-pi121 | PI121 | Introduction to Social Sciences |
| course-review-pi122 | PI122 | Introduction to Humanities |
| course-review-pi210 | PI210 | Introduction to Political Philosophy |
| course-review-pi211 | PI211 | Introduction to Political Science |
| course-review-pi241 | PI241 | Introduction to Public Administration and Public Policy |
| course-review-pi270 | PI270 | Diplomatic History |
| course-review-pi271 | PI271 | Introduction to International Relations |
| course-review-pi272 | PI272 | Foreign Policy Analysis |
| course-review-pi280 | PI280 | International Relations Theories and Current Affairs |
| course-review-pi282 | PI282 | Reading and Analysis in International Relations |
| course-review-pi291 | PI291 | International Law |
| course-review-pi292 | PI292 | International Organisations and Regimes |
| course-review-pi293 | PI293 | Introduction to Political Economy |
| course-review-pi300 | PI300 | Social Science Methodology |
| course-review-pi313 | PI313 | Media and Global Politics |
| course-review-pi320 | PI320 | Comparative Politics |
| course-review-pi321 | PI321 | Thai Politics and Government |
| course-review-pi340 | PI340 | Public Policy and Management in the Global Context |
| course-review-pi341 | PI341 | Policy Analysis and Evaluation: Concepts and Techniques |
| course-review-pi342 | PI342 | Organisation and Human Resources Management: Theories and Practices |
| course-review-pi343 | PI343 | Strategic Planning and Management |
| course-review-pi344 | PI344 | Environmental Management and Policy |
| course-review-pi345 | PI345 | Disaster and Emergency Management |
| course-review-pi346 | PI346 | Urban Planning and Development Policy |
| course-review-pi347 | PI347 | Fiscal and Budgeting |
| course-review-pi348 | PI348 | Comparative Public Administration |
| course-review-pi349 | PI349 | Information Technology Management in the Public Sector |
| course-review-pi364 | PI364 | Middle East in Global Politics |
| course-review-pi365 | PI365 | Russia in Global Politics |
| course-review-pi366 | PI366 | The United States of America in Global Politics |
| course-review-pi367 | PI367 | Europe in Global Politics |
| course-review-pi368 | PI368 | South Asia in Global Politics |
| course-review-pi369 | PI369 | Africa in Global Politics |
| course-review-pi370 | PI370 | Thai Foreign Affairs |
| course-review-pi373 | PI373 | Transnational Crime and Global Governance |
| course-review-pi374 | PI374 | China in Global Politics |
| course-review-pi375 | PI375 | Latin America in Global Politics |
| course-review-pi376 | PI376 | Alternative Approaches in International Relations |
| course-review-pi377 | PI377 | Security Studies |
| course-review-pi378 | PI378 | Japan in Global Politics |
| course-review-pi379 | PI379 | Religion and Global Politics |
| course-review-pi380 | PI380 | Nation-State and Transnationalism |
| course-review-pi381 | PI381 | Globalisation and Global Governance |
| course-review-pi382 | PI382 | Politics of International Development |
| course-review-pi383 | PI383 | Ethics and International Relations |
| course-review-pi384 | PI384 | Selected Topics in Global Governance |
| course-review-pi385 | PI385 | Peace Studies |
| course-review-pi386 | PI386 | Gender Studies |
| course-review-pi387 | PI387 | Environment and Global Politics |
| course-review-pi388 | PI388 | Human Security in Global Politics |
| course-review-pi389 | PI389 | Global Civil Society |
| course-review-pi390 | PI390 | Global Political Economy |
| course-review-pi392 | PI392 | Comparative Political Economy |
| course-review-pi395 | PI395 | International Political Economy in Asia |
| course-review-pi396 | PI396 | Game Theory for Political Scientists |
| course-review-pi397 | PI397 | Public Choice in Global Affairs |
| course-review-pi398 | PI398 | Politics of International Trade |
| course-review-pi399 | PI399 | Politics of International Finance |
| course-review-pi413 | PI413 | Seminar: Globalisation, Regional Grouping and the State |
| course-review-pi414 | PI414 | Seminar: International Conflict and Resolutions |
| course-review-pi443 | PI443 | Selected Topics in Public Policy |
| course-review-pi444 | PI444 | Selected Topics in Public Administration |
| course-review-pi470 | PI470 | Seminar: International Relations Theories |
| course-review-pi474 | PI474 | East Asia in Global Politics |
| course-review-pi475 | PI475 | Southeast Asia in Global Politics |
| course-review-pi476 | PI476 | ASEAN in Global Politics |
| course-review-pi477 | PI477 | Global Geopolitics |
| course-review-pi478 | PI478 | Political Psychology and International Relations |
| course-review-pi479 | PI479 | Global Politics through Film |
| course-review-pi480 | PI480 | Seminar: Issues in Global Political Economy |
| course-review-pi483 | PI483 | Seminar: Non-Western International Relations Theories |
| course-review-pi484 | PI484 | Seminar: International Regimes, Institutions and Governance |
| course-review-pi485 | PI485 | Selected Topics in Political Science |
| course-review-pi486 | PI486 | Comparative Regionalism |
| course-review-pi487 | PI487 | The International Relations of Rising Powers |
| course-review-pi488 | PI488 | Classical Theories in International Relations |
| course-review-pi489 | PI489 | Epistemology and Global Politics |
| course-review-pi490 | PI490 | Political Economy of Development |
| course-review-pi494 | PI494 | Selected Topics in International Political Economy |
| course-review-pi495 | PI495 | Contemporary Debates in Global Political Economy |
| course-review-pi496 | PI496 | Economic Diplomacy and Negotiation |
| course-review-pi497 | PI497 | Politics of International Trade in Services |
| course-review-pi498 | PI498 | Global Politics of Digital Economy |
| course-review-pi574 | PI574 | Internship in Politics and International Relations |

## Summary

- Migrated: 4
- Not migrated: 4
- Gap: 0
- Unaccounted for: 0

Every source file in this family's corpus has an outcome below. Nothing is unaccounted for.

## Outcomes

| Source | Status | Document id / reason | Notes |
| --- | --- | --- | --- |
| `content/course-review/courses.ts` | migrated | 84 documents (course-review-<code>, one per course) | course-review-pi121 — PI121<br>course-review-pi122 — PI122<br>course-review-pi210 — PI210<br>course-review-pi211 — PI211<br>course-review-pi241 — PI241<br>course-review-pi270 — PI270<br>course-review-pi271 — PI271<br>course-review-pi272 — PI272<br>course-review-pi280 — PI280<br>course-review-pi282 — PI282<br>course-review-pi291 — PI291<br>course-review-pi292 — PI292<br>course-review-pi293 — PI293<br>course-review-pi300 — PI300<br>course-review-pi313 — PI313<br>course-review-pi320 — PI320<br>course-review-pi321 — PI321<br>course-review-pi340 — PI340<br>course-review-pi341 — PI341<br>course-review-pi342 — PI342<br>course-review-pi343 — PI343<br>course-review-pi344 — PI344<br>course-review-pi345 — PI345<br>course-review-pi346 — PI346<br>course-review-pi347 — PI347<br>course-review-pi348 — PI348<br>course-review-pi349 — PI349<br>course-review-pi364 — PI364<br>course-review-pi365 — PI365<br>course-review-pi366 — PI366<br>course-review-pi367 — PI367<br>course-review-pi368 — PI368<br>course-review-pi369 — PI369<br>course-review-pi370 — PI370<br>course-review-pi373 — PI373<br>course-review-pi374 — PI374<br>course-review-pi375 — PI375<br>course-review-pi376 — PI376<br>course-review-pi377 — PI377<br>course-review-pi378 — PI378<br>course-review-pi379 — PI379<br>course-review-pi380 — PI380<br>course-review-pi381 — PI381<br>course-review-pi382 — PI382<br>course-review-pi383 — PI383<br>course-review-pi384 — PI384<br>course-review-pi385 — PI385<br>course-review-pi386 — PI386<br>course-review-pi387 — PI387<br>course-review-pi388 — PI388<br>course-review-pi389 — PI389<br>course-review-pi390 — PI390<br>course-review-pi392 — PI392<br>course-review-pi395 — PI395<br>course-review-pi396 — PI396<br>course-review-pi397 — PI397<br>course-review-pi398 — PI398<br>course-review-pi399 — PI399<br>course-review-pi413 — PI413<br>course-review-pi414 — PI414<br>course-review-pi443 — PI443<br>course-review-pi444 — PI444<br>course-review-pi470 — PI470<br>course-review-pi474 — PI474<br>course-review-pi475 — PI475<br>course-review-pi476 — PI476<br>course-review-pi477 — PI477<br>course-review-pi478 — PI478<br>course-review-pi479 — PI479<br>course-review-pi480 — PI480<br>course-review-pi483 — PI483<br>course-review-pi484 — PI484<br>course-review-pi485 — PI485<br>course-review-pi486 — PI486<br>course-review-pi487 — PI487<br>course-review-pi488 — PI488<br>course-review-pi489 — PI489<br>course-review-pi490 — PI490<br>course-review-pi494 — PI494<br>course-review-pi495 — PI495<br>course-review-pi496 — PI496<br>course-review-pi497 — PI497<br>course-review-pi498 — PI498<br>course-review-pi574 — PI574 |
| `content/course-review/types.ts` | not-migrated | Type definitions only, no content. |  |
| `content/curriculum/2564-rev2566.ts` | migrated | curriculum-version-2564-rev2566 |  |
| `content/curriculum/2564.ts` | migrated | curriculum-version-2564 |  |
| `content/curriculum/2568.ts` | migrated | curriculum-version-2568 |  |
| `content/curriculum/index.ts` | not-migrated | The CURRICULUM_VERSIONS registry and resolveCohort / inferredParts / disclosures / resolveMinorCategory: logic, not content. lib/study-plan/** continues to import this module directly after this migration; repointing it at Sanity is separate, later work. |  |
| `content/curriculum/sources.ts` | not-migrated | The SOURCES registry (id -> citation), not content on its own. Each SourceDocument it defines is embedded, by value, into every curriculumVersion document that cites it (verification.sources[]). |  |
| `content/curriculum/types.ts` | not-migrated | Type definitions only, not content. The document shapes in lib/migration/curriculum.ts mirror these types field-for-field. |  |
