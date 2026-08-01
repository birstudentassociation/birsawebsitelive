# Study plan service

Date: 2026-08-01
Status: design approved, blocked on curriculum verification (see section 9)

## Why

BIR students plan their degree from a PDF handout, a separate handbook, and
whatever their seniors remember. The handout is two pages of tables, roughly a
third of it placeholders rather than course names ("Minor Required Course 1"),
and it does not state prerequisites at all. The prerequisites live in a
different document. The credit limits live in a third. Nothing joins them up,
and nothing tells a student whether the plan they are holding is even the one
that governs them.

This service joins them up for one student at a time: what you still owe, what
you can take next, and whether the terms you have sketched out are legal under
the regulations.

It is a plan, not a record. It produces something to take to an advisor.

## Research basis

Nine faculty documents were crawled on 2026-08-01. What they establish, and
where they contradict each other, is summarised in section 9 and recorded in
full in `docs/curriculum-sources.md`, written as step 1 of section 10.

The single most important finding is that the curriculum varies far more than
"a few courses moved". Between the 2561 and 2564 curricula the core course
codes change prefix wholesale (`PO211` becomes `PI211`), the economics
requirement halves from two courses to one, the graduation total moves from 130
to 127, and a mandatory general education course disappears. Between 2564 and
its 2023 revision, five Year 1 general education courses are replaced by
courses with entirely new code families (`EL`, `LAS`, `PD`). Between 2564 and
2568 the total moves again, to 126.

A student given the wrong version is not given slightly stale advice. They are
given a different degree.

## 1. Scope

In scope:

- The standard four-year Thammasat route, for each verified curriculum version.
- Cohorts 64 to 69, which covers everyone currently enrolled.
- Planning forward from where the student is now, with structural, credit-load
  and timing checks.
- Both languages, like every other page on the site.

Out of scope, and stated as such on the service's own pages:

- All double degree routes. The 2568 curriculum defines five routes across
  three partner institutions; the Aberystwyth and Bristol routes are counted in
  UK module credits which do not compare to Thai credits without a conversion
  the sources never state, and the Meiji route 3 total is given as 162, 142 and
  144 in three different places. Double degree students get the stop page.
- Whether a course is actually offered in a given term. That needs per-term
  offering data maintained by hand every semester, which BIRSA has not
  committed to.
- Anything decided at the Dean's or an advisor's discretion.
- GPA. The service never asks for it and never stores it, so it cannot say
  anything about honours, warning, probation or dismissal beyond linking to the
  handbook chapter that explains them.

## 2. The version gate

No student reaches the planner without establishing which curriculum governs
them. The gate is two questions.

**"What are the first two digits of your student ID?"** Not "which curriculum
are you on", which no student can answer. The cohort code is printed on the ID
card, and the faculty's own handouts are titled by it (`รหัส 64, 65` on
`BIR_64.pdf`, `รหัส 66` on `BIR_64_rev66.pdf`).

**"Is this your curriculum?"** The service states what it derived and shows
evidence the student can check without leaving the page: the graduation credit
total, three distinctive course codes that differ between adjacent versions,
and a link to the source document. For cohort 66 or 67 it shows `EL105`,
`LAS101`, `PD102`; for 64 or 65 it shows `TU105`, `TU104`, `PI121`. A student
who took `TU105` and was told they are on the 2023 revision will notice.

The answer is a radio, not a tickbox: **Yes, this matches** or **No, or I am
not sure**. A tickbox invites clicking through. The second answer goes to the
stop page.

### The stop page

Reached by an unsupported cohort, an unverified curriculum version, a double
degree student, or anyone who answered "no or not sure". It states which
cohort was entered, what the service does not know and why it will not guess,
the faculty contact, and direct links to the source documents so the student
can do by hand what the service declined to do for them.

It never degrades quietly into a partial answer.

## 3. Curriculum data as code

One typed module per version under `content/curriculum/`, plus an index that
maps cohort codes to versions.

```ts
export type CurriculumVersion = {
  id: "2564" | "2564-rev2566" | "2568";
  label: LocalizedText;
  cohorts: CohortMapping[];
  graduationCredits: number;
  categories: CreditCategory[];
  courses: Course[];
  recommendedPlan: PlannedTerm[];
  rules: AcademicRules;
  distinguishingCourses: string[];  // shown on the confirm screen
  verification: Verification;
};

export type CohortMapping = {
  code: string;                 // "66"
  provenance:
    | { kind: "document"; source: string; page: number }
    | { kind: "attested"; by: string; on: string };
};

export type Verification = {
  status: "verified" | "unverified" | "contradictory";
  verifiedBy: string | null;    // a named person at the faculty
  verifiedOn: string | null;    // ISO date
  sources: SourceDocument[];    // url, retrieved date, page
  contradictions: Contradiction[];
};
```

Two details carry most of the weight.

**Cohort mapping provenance.** Cohorts 64, 65 and 66 are printed on the face of
a faculty handout. Cohorts 67 and 69 are not documented anywhere in the nine
sources; BIRSA attests that 67 follows the 2023 revision and 69 follows the
2568 curriculum. An attested mapping is a legitimate basis to ship, but a
maintainer reading this code in 2028 must be able to see that it never came
from a PDF, and the faculty sign-off must cover it explicitly.

**Verification status is enforced, not documented.** A version whose status is
not `verified` cannot be selected by any student; the cohort resolves to the
stop page instead. A unit test asserts that every version reachable from the
cohort map carries a `verified` record with a named verifier and a date. The
service therefore cannot ship advice derived from unverified curriculum data,
regardless of what anyone intended.

Every version ships `unverified`. Launch means someone at the faculty signed
off, cohort by cohort. This is the thing that must be sorted out before the
service can be used, and it is a build gate rather than a paragraph in a README.

## 4. The journey

Nine screens, each a server-rendered form posting to a server action, following
the pattern already established by `app/[lang]/clubs/start`.

| Path | Screen | Question |
| --- | --- | --- |
| `/services/study-plan` | Start | What this does, what you need, how long |
| `.../cohort` | Cohort | First two digits of your student ID |
| `.../curriculum` | Confirm | Is this your curriculum? |
| `.../cannot-help` | Stop | Why not, who to ask, the sources |
| `.../where` | Position | Which year and semester are you in now? |
| `.../assumed` | Check assumptions | The courses we think you have passed |
| `.../assumed/fill` | Fill placeholders | Which course did you take for each slot? |
| `.../plan` | The plan | What you still owe, your terms, findings |
| `.../plan/print` | Print | Everything on one page, dated and version-stamped |

### Why "start from the plan" rather than ticking forty boxes

A student says which year and semester they are in. The service assumes they
followed the recommended plan up to that point, shows exactly what it assumed,
and asks them to correct it. Most students correct two or three things.

The catch, and it is worth stating plainly because it is the main cost of this
route: roughly a third of the recommended plan is placeholders rather than
courses. "Minor Required Course 1", "Elective Course in Concentration (Area
Studies Group) 2", "Free Elective Course 1". The service cannot assume which
real course filled a placeholder, so it must ask. A Year 3 student confirms
about 23 named courses in one pass, then answers 6 to 8 placeholder questions.
Still far cheaper than ticking forty boxes, and honest about what it knows.

Corrections on `.../assumed` are a checkbox list in the GOV.UK task list style:
did not take, failed, or took something else.

## 5. Storage and progressive enhancement

Two stores with two different lifetimes, which is a boundary rather than drift.

**The setup journey uses the existing draft cookie** (`components/forms/draftCookie.ts`),
like every other multi-step form on the site. Those answers are transient, the
cookie expires in thirty minutes, and it is what makes the journey work with
JavaScript switched off.

**The finished plan uses `localStorage` under `birsa-study-plan`.** The plan is
a durable artifact edited over months, not a thirty-minute draft. It is also
the thing we least want travelling to the server on every request: keeping it
in `localStorage` means the plan never leaves the device, and BIRSA processes
nothing.

The plan is small, roughly 45 course codes with a term each, under a kilobyte
serialised. So the no-JavaScript path carries it in a hidden field on every
post from the plan screen, and the whole service completes with JavaScript off.
A single client component then mirrors it to `localStorage`, following
`components/onboarding/StepTasksClient.tsx`: `mounted` gate for hydration
safety, every storage access wrapped in `try`/`catch` so private browsing
degrades to the no-JavaScript behaviour rather than breaking the page.

A **Delete your plan** control on the plan screen clears the key and confirms
what it cleared. `content/privacy/register.ts` already documents `birsa-theme`
and `birsa-onboarding-*` and `/privacy/cookies` renders them, so this key is
added to the register with the rest; a documented store with no deletion route
would be a defect on that page. No server-side deletion route is needed,
because there is nothing on the server to delete.

## 6. What the service checks

Findings, never blocks. Every finding names the rule and cites the provision.

```ts
type Finding = {
  severity: "problem" | "warning" | "note";
  message: LocalizedText;
  source: { document: string; provision: string };
};
```

**Structural.** A prerequisite not satisfied by an earlier term. A credit
category short of its requirement. A plan that does not reach the graduation
total. All of it derivable from the curriculum documents and citable to a line.

Prerequisites for the 2564 family come from the Handbook, which lists them
inline with the course descriptions: `PI280` requires `PI271`; `PI300`,
`PI320` and `PI321` require `PI211`; `PI390` requires `PI271`; every area
studies elective requires `PI280`; `PI574` requires third year standing or a
lecturer's authority.

**Credit load.** A regular semester outside 9 to 21 credits, or a summer
session over 6. Source: the Handbook, quoting Thammasat University's Bachelor
Degrees Regulations, 3rd Edition (2012), item 10.4.

**Timing.** Which term the plan graduates in; a warning if it runs past seven
years from intake, or falls short of the minimum seven semesters enrolled.

The plan screen states the three things the service does not check, so the
student can see the edge of the map: whether a course runs in the term they
placed it in, anything at the Dean's or an advisor's discretion, and anything
depending on GPA.

## 7. Information architecture

The service sits under `/services`, added to the existing service list on
`app/[lang]/services/page.tsx` alongside the equipment loan service. It links
to `/student-life/handbook/curriculum-and-study-plan`, which stays as the
narrative explanation of the curriculum; the two must agree, so the handbook
chapter's credit table is checked against the curriculum modules by test.

The curriculum modules become the single source of truth. If the handbook MDX
and `content/curriculum/` disagree, the build fails.

## 8. Testing

- **Verification gate.** Every version reachable from the cohort map has
  `status: "verified"` with a named verifier and a date. This test failing is
  the intended state until the faculty signs off.
- **Data integrity, per version.** Category credits sum to the graduation
  total. Every course referenced by the recommended plan exists. Every
  prerequisite code exists. No course appears in two categories.
- **Cohort resolution.** Each of 64 to 69 resolves to exactly one version or to
  the stop page, never to two, never to undefined.
- **Journey smoke tests.** Each entry point renders, following the existing
  pattern from the form journey smoke tests added in commit `e60ea29`.
- **No-JavaScript completion.** A Playwright run with JavaScript disabled
  completes cohort to printed plan.
- **Findings.** A plan with a known prerequisite violation produces exactly the
  expected finding, with its citation.
- **Handbook agreement.** The credit table in the handbook MDX matches the
  active curriculum module.

## 9. Blockers and contradictions

The service cannot launch for a cohort until its version is verified. This is
the register of what verification must resolve.

### Blocking

| # | Issue | Affects | Needed |
| --- | --- | --- | --- |
| 1 | The 2568 sample study plan was never located in the 358-page comparison document. Without it there is no recommended plan to start from, which is the whole basis of the journey. | Cohorts 68, 69 (Years 1 and 2) | The 2568 study plan handout |
| 2 | `PI574` is either 1 or 3 credits in 2568, and may move category. This is why the 2568 total reads 126 against 2564's 127. | Cohorts 68, 69 | Faculty confirmation |
| 3 | The 2564 graduation total of 127 is never printed as a total in any source. It is arrived at by adding 30, 91 and 6. | Cohorts 64 to 67 | Faculty confirmation of the figure |
| 4 | Cohort 67 to 2023 revision, and cohort 69 to 2568, are attested by BIRSA and documented nowhere. | Cohorts 67, 69 | Explicit faculty sign-off on the mapping |

### Non-blocking, to record and resolve

| # | Issue | Resolution |
| --- | --- | --- |
| 5 | The 2561 document states major requirements as 94 in its structure table and 91 in its course listing. | Out of scope: no enrolled cohort uses 2561. Record only. |
| 6 | `EE214` is titled "Introductory Microeconomics" in the outline and sample plan, "Introductory Macroeconomics" in the course descriptions. | Course descriptions take precedence. 2561 only. |
| 7 | `TU100` is "Civic Engagement" in two documents and "Civic Education" in a third. | Pick one, footnote the other. |
| 8 | `PI574`'s title differs across all three 2561 documents. | Pick the มคอ.2 wording. |
| 9 | `PI292` extracted as 1 credit from `BIR_64`, against 3 credits everywhere else. | Almost certainly a column artifact in text extraction. Verify visually. |
| 10 | The 2564 handout's sample plan shows no Year 4 Semester 2. The 2561 มคอ.2 does show one, at 9 credits. | Treat the handout as incomplete rather than the year as empty. Ask the faculty. |
| 11 | Whether the 21-credit minor sits inside the 91-credit major total or on top of it is never stated; the arithmetic implies inside. | Confirm. |
| 12 | The 2561 free elective rule is grammatically broken in the source. | 2561 only. Record. |

Items 1 to 4 are what "sorted out before the service can be used" means in
practice. The build gate in section 3 enforces it.

## 10. Sequencing

1. `docs/curriculum-sources.md`, recording every source document with its
   retrieval date and every contradiction found. Then the curriculum data
   modules and the verification gate, all versions `unverified`, with the data
   integrity tests. Nothing is user-facing yet.
2. The version gate journey: cohort, confirm, stop page. Shipped early, because
   the stop page is useful on its own and creates pressure to resolve section 9.
3. Position, assumptions and placeholder filling.
4. The plan screen, findings engine, print page.
5. Storage mirror, delete control, privacy register entry.
6. Faculty verification, cohort by cohort, flipping versions to `verified`.

Step 6 is not a development task and does not depend on steps 2 to 5. It should
start now.
