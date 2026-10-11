# Course reviews and study plan: roadmap

Date: 2026-10-10
Status: proposal, nothing here is built

The course review catalogue (`/student-life/course-reviews`) and the study plan service
(`/services/study-plan`) were built separately and still mostly behave as two products. This
document sets out how to turn them into one suite where every course, every review and every
plan knows about the others, and where the suite does work a student cannot easily do by hand.

---

## 1. Where things stand

### What already joins up

- `lib/course-review/facts.ts` derives prerequisites, unlocks, recommended terms and minor
  membership for a course page from the 2568 curriculum module, so those facts cannot drift.
- Course pages link to the study plan start page.
- Both share `normaliseCourseQuery` from `lib/study-plan/courseMatch.ts`.

### What does not

| Gap                                                                                                                                                                                       | Consequence                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| The study plan never links to a course page. `TermEditor` and the suggestion picker show code, title and credits only.                                                                    | A student choosing an elective has to leave the service, search the catalogue, and come back.                                |
| Course pages know nothing about the student's plan, although it sits in `localStorage` under `birsa-study-plan` on the same origin.                                                       | "Can I take this next term?" is a question the site holds every input for and does not answer.                               |
| The catalogue browser filters by track, category and year, but not by minor, prerequisite status or "not yet passed".                                                                     | Filtering is generic rather than about the reader.                                                                           |
| Two course models: `content/course-review/types.ts` (`Course`, with `track` and `category`) and `content/curriculum/types.ts` (`Course`, per version). Titles and credits are held twice. | Drift risk, and only PI-coded 2568 courses have a page. Codes like `TU105`, `EL105`, `LAS101`, `EE214` in a plan go nowhere. |
| One review in the whole catalogue, and it is a sample. Six courses carry `assessmentFacts`. Submissions arrive by email via `/contact` and are hand-copied into TypeScript.               | Any feature that reads review data has almost nothing to read. This is the binding constraint on everything below.           |
| No per-term offering data, by design (spec section 1).                                                                                                                                    | The planner cannot say whether a course runs in the term it is placed in.                                                    |

The order of the phases follows from the last two rows. Linking (phase 1) is cheap and useful
with today's data. Term-level intelligence (phase 2) is useful on curriculum and assessment
facts alone. Review-driven features only become worth building once the collection pipeline
(phase 3) is producing real submissions.

---

## 2. Rules carried over

These are existing decisions in the codebase and the study plan design spec. The roadmap does
not reopen them.

1. **The plan stays on the device.** No server-side plan storage by default. Anything that
   leaves the device is opt-in, anonymous and aggregate (`docs/CAPABILITY-ROADMAP.md` section
   5).
2. **Findings never block.** New checks are `problem`, `warning` or `note` findings with a
   citation, through `checkPlan`.
3. **Subjective qualities are described in words, never scored.** No star ratings, no
   difficulty scores, no instructor rankings.
4. **Syllabi are not republished.** Assessment facts are restated in BIRSA's words.
5. **Works with JavaScript off.** Client islands enhance, they never gate.
6. **Bilingual, Thai authoritative for curriculum text.**
7. **Uncertain data is disclosed, not withheld.** The `Derivation` and `InferenceNotice`
   pattern extends to anything new that is derived rather than published.
8. **Every new browser storage key or database table goes in `content/privacy/register.ts`
   with a deletion route and a retention period.**

---

## 3. Phase 0: one course graph

Small, internal, and the base for everything else.

**Build `lib/courses/graph.ts`**, a single read model over all three curriculum versions plus
the review catalogue:

- One node per course code, carrying curriculum facts (title, credits, category per version)
  and catalogue extras (track, instructors, description, reviews, assessment facts).
- Edges: `prerequisite`, `unlocks`, `countsTowards` (category or minor, per version),
  `recommendedIn` (term, per version), and `equivalentTo` across versions (`PO211` to
  `PI211`, the 2023 revision's general education swaps). Equivalence is hand-maintained data
  with a `Derivation`, because it is a judgement the sources do not state.
- `lib/course-review/facts.ts` becomes a thin wrapper over the graph, so course pages stop
  being hard-wired to 2568.

**Make the curriculum the source for title and credits.** `content/course-review/courses.ts`
keeps only what the curriculum does not hold (track, description, instructors, reviews,
assessment facts). A test fails if a catalogue entry has no curriculum counterpart.

**Give every planned code a page.** Non-PI courses get a facts-only page generated from the
curriculum (title, credits, which category it counts towards, prerequisites, which versions
require it), with the review section in its usual "no review yet" state. Every code the
planner can show becomes a link.

Tests: graph integrity per version, equivalence edges point at real codes, no code in any
recommended plan without a page.

---

## 4. Phase 1: two-way linking

Cheap, uses today's data, and changes how the suite feels more than anything else here.

### 4.1 Course page reads the plan

A client island on each course page reads `birsa-study-plan` with `readStoredPlan()` and, if a
plan exists, shows a "Your plan" panel above the facts:

- Status: passed, planned for a named term, or not in your plan.
- What it counts towards **for this student**, resolved through their `minorId` with
  `resolveMinorCategory` ("Counts as a minor elective for Global Political Economy" rather
  than the generic list of three minors).
- Prerequisite status against the plan: met by a passed course, met by a course planned
  earlier, or not met.
- What deferring it costs: if the course sits on a prerequisite chain, the projected
  graduation term with and without it (see 5.2).
- **Add to plan**, with the term suggested from `recommendedTerms` and the next open term.

No plan stored, or JavaScript off: the panel is absent and the page is exactly what it is
today. Server-rendered HTML is unchanged, so static generation stays intact.

Writing back to the plan from outside the plan screen needs one change to the plan screen:
accept an `?add=PI380&term=3-semester1` query and apply it to the restored plan before
rendering, with a confirmation banner and an undo. The course page's button is a link to that
URL, so the no-JavaScript path works for anyone who reaches the plan screen with a plan in its
hidden field.

### 4.2 Plan screen links out

- Every course code in `TermEditor`, the suggestion picker, the passed list, findings and the
  print page links to its course page.
- The suggestion picker gains one line of context per course where data exists: assessment
  shape from `assessmentFacts` ("Final exam 50%"), whether real reviews exist, and the
  instructors on record. Words and facts only, consistent with rule 3.
- Findings that name a course (an unmet prerequisite, say) link to the prerequisite's page.

### 4.3 Catalogue browser knows the reader

New filters in `lib/course-review/filter.ts`, serialised to the URL like the existing ones:

- **Minor**: courses in a given minor, required or elective (`minorsFor`). Works without a
  plan.
- **With my plan** (client only, shown when a plan exists): not yet passed, prerequisites met
  by next term, counts towards a category I am still short in (`remainingRequirements`).

Cards gain a small status tag (passed, planned) when a plan exists.

### 4.4 Search

`lib/search/intent.ts` already routes "course review" queries. Add an exact course-code match
("PI380", "pi 380") that goes straight to the course page, and a "what can I take next" intent
that routes to the catalogue with the plan filter on.

---

## 5. Phase 2: term-level intelligence

Uses curriculum and assessment facts, so it is useful before reviews exist.

### 5.1 Term assessment profile

For each planned term, aggregate the `assessmentFacts` of its courses: how many have a final
exam, total final exam weight, how many are coursework only, attendance rules. Show it as a
short line under the term ("3 of 5 courses have a final exam worth 40% or more"), and raise a
`note` finding when a term stacks several exam-heavy courses. Courses without recorded facts
are counted and named as unknown, never assumed.

This is factual and citable to the recorded term, which is why it can ship before any review.

### 5.2 Prerequisite chains and what-if

- Compute each remaining course's longest prerequisite chain to graduation from the graph.
  Courses on the critical path are marked on the plan screen.
- **What-if**: `projectedGraduation` already exists. Run it on a counterfactual plan (course
  moved one term later, term left empty) and show the difference. "Moving PI280 to Year 3
  semester 2 pushes 4 area studies electives back and graduation from 2570/2 to 2571/1."
- A `warning` finding when a deferral on the critical path moves graduation.

### 5.3 Scenarios

Several named plans side by side under one storage key: "Main", "With exchange in Year 3",
"If I switch minor". Each is a full `StudyPlan`; the stored value becomes a versioned
envelope `{ v: 2, active, plans[] }`, with `deserialisePlan` migrating a v1 bare plan
transparently.

The two scenarios worth building first:

- **Minor switch**: re-resolve passed and planned courses under another minor and show which
  credits carry over, which move to "another minor", and which no longer count.
- **Away term**: an exchange or leave term with no BIR courses, and the effect on prerequisite
  chains and graduation.

Comparison view: credits per category, graduation term and findings, for two scenarios at a
time.

### 5.4 Prerequisite map

An SVG map of the catalogue's prerequisite graph, coloured by the reader's status (passed,
planned, available next term, locked) when a plan exists, and by track when not. The
no-JavaScript and screen-reader version is the same information as nested lists ("PI271
unlocks PI280, PI390; PI280 unlocks 14 area studies electives"). Lives on the catalogue page
and links into each course.

### 5.5 Offering history, derived

The spec rules out per-term offering data maintained by hand. Reviews and assessment facts
each carry a term, so the graph can state **history**, not a promise: "Recorded as taught in
semester 1 of 2566 and 2567." Shown on course pages and in the suggestion picker, with a
`note` finding when a course is planned in a term kind it has never been recorded in. Carried
as an `inferred` derivation with its own disclosure, per rule 7.

---

## 6. Phase 3: review collection

The binding constraint. Without it, phase 4 has nothing to work with.

### 6.1 Submission form

A structured form at `/student-life/course-reviews/[code]/review`, server-rendered, posting to
a server action, following the existing form journey pattern:

- Term taken and instructor (pick list from the course's `instructors`, plus "someone else").
- Workload in words, plus an optional band ("under 3 hours a week", "3 to 6", "over 6"). A
  band is a reported estimate, not a rating, but whether it breaches rule 3 is a committee
  decision (section 9).
- Assessment as experienced, tips, an optional quote.
- No name, no student ID, no email. A bot check and a rate limit, not identity.

Stored in a new `course_review_submissions` table (migration `013`), with status `pending`,
`approved`, `rejected`, and a retention period in `content/privacy/register.ts`.

### 6.2 Moderation and publication

- An Academic Affairs queue in the officer console, reusing officer auth and `audit_log`
  from `lib/inventory`.
- **Publication threshold.** A course, term and instructor combination is published only once
  it has at least 5 approved submissions. Small electives can have a dozen students, and a
  single detailed review is identifiable to the lecturer. Below the threshold, submissions
  wait or merge into a "course, any term" summary.
- **Drafted summaries.** An approved batch is summarised into the existing `StudentReview`
  shape (workload, assessment style, tips, quotes) by a Claude API call that drafts English
  and writes Thai as Thai, not as a translation. The officer edits and approves; nothing
  publishes unreviewed. Submissions are anonymous, so no personal data leaves the database.
- Published summaries move from TypeScript to the database, read at build time or with ISR,
  so a new review does not need a commit. This also takes Academic Affairs out of the
  `docs/CAPABILITY-ROADMAP.md` single point of failure.

### 6.3 Asking at the right moment

The plan knows which courses a student passed and `academicTermAt` knows what term it is.
When a stored plan has a course in a term that has just ended, the plan screen shows
"You finished PI280 last term. Two minutes to help next year's students?" with a link to the
form. Derived on the device, nothing tracked, dismissible per course and remembered in the
plan envelope.

**As built.** The reminder is derived on the device (`lib/study-plan/reviewPrompt.ts`,
`components/study-plan/ReviewPrompt.tsx`) and shown on the plan screen and in the "Your plan"
panel of that course's page, only when the review form is live (the same database
configuration the form checks). "Just ended" is the most recent completed term from
`academicTermAt`, with one exception. Most students take no summer session, so when the term
just gone is a summer and the plan has nothing in it, semester 2 is the term that just ended.
Only that one term is offered, at most three courses at a time. Dismissals are kept per course
in the stored envelope as `dismissedReviewPrompts`, which the schema defaults to an empty list,
so version 1 plans and version 2 envelopes written before the field parse unchanged. Deleting
the plan deletes them.

### 6.4 Review freshness

Reviews already carry term and instructor. Sort by recency (done), mark reviews older than
three academic years as dated, and when a course's current `instructors` differ from the
reviewed instructor, say so.

---

## 7. Phase 4: review data in the planner

Only once a meaningful share of courses have real reviews. Before that it is empty boxes.

- **Term workload profile.** Extend 5.1 with the review workload bands: "Two courses in this
  term are reported as over 6 hours a week." A `note`, never a block, always with the review
  term and count it rests on.
- **Elective shortlist.** For an open elective slot, rank candidates the student can actually
  take (prerequisites met, counts towards the slot, recorded in this term kind), and show the
  review summary inline. Ranked by fit to the plan, not by any quality score.
- **Compare two courses.** Side-by-side facts, assessment shape and review summaries for two
  candidates for the same slot.

### As built

**Term workload profile** (`lib/study-plan/workloadProfile.ts`, `lib/course-review/reviewSummary.ts`).
Reads the workload bands on repository reviews and on reviews published from the database,
through one lookup, so a review moved into the database is never counted twice. Sample reviews
never count. The rules, each a named constant or a documented comparison.

- A course's answers are those of its most recent term with at least 3 band answers
  (`MIN_BAND_ANSWERS`). Summaries of one term, such as one per instructor, are summed. Terms are
  never mixed, and there is no age cut-off, because the line always says which term it rests on.
- A course counts as "mostly over 6 hours a week" when more than half of those answers chose
  that band. Exactly half does not.
- The line under a term says how many courses are mostly in the top band, names them, and
  states the number of student reports and the term they are for. Courses with no usable
  estimate are named, never assumed. A term where no course has an estimate gets no line.
- The `workloadLoad` note is raised when 2 or more courses in a term are mostly in the top band
  (`WORKLOAD_TOP_BAND_TERM_COUNT`). Its source cites the term and the rule. It is a note and
  never blocks. Bands are only ever counted: nothing averages them or turns a course into a
  number.

**Elective shortlist** (`lib/study-plan/shortlist.ts`). For every open choice in a term, the
candidates are kept if they count towards the choice for the student's version and minor,
their prerequisites are passed or planned in a strictly earlier term, and, where offering
history exists for the course, it has been recorded in this kind of term. A course with no
history is kept. What was left out is named, with the reason, and stays in the full picker.
The order uses the plan alone. Courses the recommended plan puts in this term come first, then
the course that unlocks more courses the student has not passed, then the course code. Reviews
are shown on each candidate and play no part in the order, which a test enforces.

**Compare two courses** (`/student-life/course-reviews/compare?a=PI380&b=PI381`,
`lib/courses/compare.ts`). Facts, assessment shape, offering history, prerequisites, unlocks,
what each counts towards and review summaries, side by side and not ranked. A visitor with a
plan on the device also gets rows for their own plan, added in the browser. Every pair is
`noindex`, because there are far too many pairs and each is thin. It is linked from the
shortlist and from a GET form on each course page that works without JavaScript.

---

## 8. Phase 5: the loop back to the faculty

Each item is opt-in and aggregate. See `docs/CAPABILITY-ROADMAP.md` section 5.

- **Share with an advisor.** A read-only link with the serialised plan in the URL fragment
  (`/services/study-plan/view#p=...`). The fragment never reaches the server, so BIRSA still
  processes nothing. The print page remains the no-JavaScript route.
- **Elective demand signal.** One checkbox: "Share my planned electives anonymously with
  Academic Affairs." Sends codes and terms only, no cohort finer than the curriculum version.
  Published back on course pages as "Planned by 20 or more students for 2569/1" only above a
  threshold.
- **Ask Academic Affairs about this plan.** A contact route that attaches the plan summary,
  so the officer is not reconstructing it from a chat message.
- **Calendar export.** Registration and add-drop dates for each planned term via the existing
  `lib/ics.ts`, once those dates are held in `content/calendar/events.ts`.

---

## 9. Decisions needed

1. **Workload bands.** Are reported hours-per-week bands compatible with "described in words,
   never scored"? They make 5.1 and 7 far more useful. Recommendation: yes, as a reported
   estimate shown alongside the words, never averaged into a single number.
2. **Publication threshold.** 5 per course, term and instructor is the proposal. Lower
   publishes sooner and risks identifying students.
3. **AI-drafted summaries.** Acceptable if every summary is officer-approved before
   publication? The alternative is Academic Affairs writing every summary by hand, which is
   the current bottleneck.
4. **Review storage moves to the database.** Needed for 6.2 and removes the commit step.
5. **Cross-version equivalences.** Someone at the faculty or Academic Affairs signs off the
   `equivalentTo` table, as with cohort mappings.

---

## 10. Sequencing

| Phase | Work                                  | Depends on                       | Rough size | Useful with today's data |
| ----- | ------------------------------------- | -------------------------------- | ---------- | ------------------------ |
| 0     | Course graph, pages for every code    | Nothing                          | Small      | Yes                      |
| 1     | Two-way linking, filters, search      | 0                                | Small      | Yes                      |
| 2     | Term profile, what-if, scenarios, map | 0, more assessment facts for 5.1 | Medium     | Yes, partly              |
| 3     | Submission, moderation, publication   | Decisions 1 to 4                 | Medium     | Creates the data         |
| 4     | Reviews in the planner                | 3 producing reviews              | Small      | No                       |
| 5     | Advisor link, demand signal, calendar | 1; demand needs a DB             | Small each | Yes                      |

Phases 0 and 1 together are the highest return: they make the two products one without
needing any new data, any new storage, or any committee decision. Phase 3 should start in
parallel, because its decisions take longest and every later review-driven feature waits on it.

Recording more `assessmentFacts` (currently 6 courses) is the cheapest content task that
improves phase 2, and needs no code.

---

## 11. Not doing

- Star ratings, difficulty scores or instructor rankings.
- Storing plans on a BIRSA server by default.
- Scraping or republishing syllabi.
- GPA, honours or probation modelling.
- Claiming a course will run in a given term. Offering history is history.
