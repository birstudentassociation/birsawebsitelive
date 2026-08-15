# BIRSA Portal 2.0: redesign plan

A ground-up redesign of the BIRSA Portal, planned so that the thirty-odd capabilities in
`docs/CAPABILITY-ROADMAP.md` land as configuration of one system rather than as thirty
bespoke corners of a website.

This is a proposal for the committee and for whoever builds it. Nothing here has been built.
It is written to be executed by a fleet of parallel Sonnet subagents, and section 9 is the
part that makes that safe.

Read `docs/CAPABILITY-ROADMAP.md` first. That document asks what BIRSA needs. This one asks
what the site has to become for those needs to be cheap to meet.

**Source note.** This plan is informed by the GOV.UK Design System (patterns and components),
the Government Design Principles, the GOV.UK Service Manual, Nielsen's usability heuristics,
and cognitive load theory. The three design-system URLs could not be fetched from this
environment: the network egress proxy blocks `design-system.service.gov.uk` and `www.gov.uk`.
Component and pattern names below are cited from knowledge and are accurate as of the last
version I can vouch for, but the first task in Wave 0 is to open the live indexes and
reconcile this document against them. Treat every GDS name here as a claim to verify, not a
fact to build on.

---

## 1. Diagnosis

### 1.1 What 1.0 got right, and must survive the rebuild

A ground-up redesign is not permission to throw away the good parts. These are load-bearing
and a 2.0 that loses any of them is a regression, not a redesign.

- **Bilingual architecture with slug parity.** Identical slugs across locales, locale-prefixed
  routes, `localeHref`, `swapLocalePath`, a language toggle that is a plain link to the same
  page. This is better than most bilingual government sites manage.
- **One-question-per-page wizards with a check-answers step.** `contact/`, `clubs/start/`,
  `privacy/your-data/`, `services/equipment-loan/*/request/`, `services/study-plan/` all
  follow the GDS question-page pattern with a real `steps.ts`, a draft cookie, and a check
  page. That is the correct pattern, already implemented five times.
- **Smart Answers with honest fallbacks.** One reader, one answer, citations to real
  provisions, and `out-not-covered` when there is no rule on file. This is a genuinely hard
  thing done right, and section 6 of the roadmap is correct that a chatbot would undo it.
- **Graceful degradation as a house rule.** Every module reports itself as not configured
  rather than throwing. The site builds and renders with no environment at all.
- **The PDPA register as code.** `content/privacy/register.ts` with three public pages
  rendering from it, and `lib/privacy/retention.ts` as the matching deletion path.
- **A real accessibility test suite.** `tests/e2e/a11y.spec.ts`, `keyboard.spec.ts`,
  `progressive-enhancement.spec.ts`, plus axe via `@axe-core/playwright`, plus a Lighthouse
  budget in `lighthouserc.js`.
- **The officer identity system.** `lib/inventory/auth.ts`: scrypt passcodes, signed 12-hour
  sessions, role and scope checks, an audit log, rate limiting, a nonce CSP for officer
  routes. The roadmap is right that this is the most valuable asset in the repository.
- **The loan service end to end.** Public request, reference number, officer queue, status
  lookup with no account. It is the only complete service on the site and it is the template
  for everything else.

### 1.2 The eight defects that justify a 2.0

**D1. The information architecture is an org chart wearing a service costume.**
The primary nav is `What's on`, `Find a service`, `Clubs`, `BIRSA activity`. Three of those
are user-shaped. "BIRSA activity" is named after the organisation, and it is where the
regulations library, the role descriptions and the committee live: three unrelated jobs
filed under one internal label. Government Design Principle 1 is start with user needs, not
government needs. A student looking for the rules on club funding does not think "activity".

**D2. There is no first-class notion of a service.**
`app/[lang]/services/` is a folder. `equipment-loan` and `study-plan` share a parent
directory and nothing else: no shared type, no shared start page, no shared status page, no
shared service standard, no shared metadata. The loan flow's reference-number machinery lives
in `lib/inventory/loans.ts` and is not reachable by anything that is not equipment. The
capability roadmap proposes at least eleven more intake flows (reimbursement claims, funding
applications, welfare cases, event sign-ups, merchandise pre-orders, course review
submissions, academic issue intake, room booking, translation help, trials sign-up, buddy
matching). Built the current way that is eleven more bespoke folders. Built once as a chassis
it is eleven configuration files. This is the single highest-leverage change in this document
and it is section 5.

**D3. The design system is undeclared.**
Tokens exist in `app/globals.css` and they are thoughtful. But there is no component
contract, no reference page, no visual regression test, and no rule for when to reach for
`Card` versus `NavList` versus `Notice` versus `Tag`. `components/` currently holds 96 files
with no internal boundary between site chrome, service UI, console UI and one-off page parts.
`ReportHarassment.tsx` sits at the top level next to `Button.tsx`. Adding twenty modules to
this will fracture it, and it will fracture invisibly, one reasonable local decision at a
time.

**D4. The entry points carry too much.**
The home page renders six blocks: hero, top tasks plus a featured rail, news, an interactive
month calendar, and an activity highlight list. The calendar is the heaviest interactive
component on the site and it sits on the page every visitor loads, serving a need most
visitors do not have on most visits. Hick's law says choice time grows with the number of
options; the home page currently offers roughly nineteen destinations above the footer.

**D5. The officer console is inventory-shaped, not portfolio-shaped.**
Everything lives under `app/[lang]/officer/inventory/` and `Role` is
`admin | inventory_manager | loan_officer | read_only`. Roadmap section 4A is exactly right:
the shell needs to lift to `app/[lang]/officer/` and permissions need to name portfolios and
verbs. Doing that during a 2.0 rebuild is cheap. Doing it after five more modules have been
built inside the inventory shell is not.

**D6. Bilingual typography is a patch, not a system.**
`app/globals.css` currently overrides Thai heading line-height and letter-spacing _outside_
the cascade layers, specifically so those rules can beat the Tailwind `text-*` utilities that
set a line-height Thai cannot use. The comments explaining why are excellent and the fix
works. But it is a system where every new heading size is a new opportunity for Thai to
break, and the fix has to be remembered each time. A 2.0 should define one bilingual type
scale where line-height is a property of the scale step rather than of the utility, so Thai
is correct by construction.

**D7. Content has no lifecycle.**
There is no draft state, no scheduled publication, no last-reviewed date, no owner field on
anything except Smart Answers. The roadmap's Phase 3 asks for draft and scheduled states.
More basically: a student association turns over every June, and content with no review date
and no named portfolio owner is content nobody will ever dare to delete.

**D8. There is no phase signal and no feedback loop anyone reads.**
`PageFeedback.tsx` exists. Nothing on the site says which parts are new, which are trusted,
and which are still being worked out. A 2.0 rolled out silently is a 2.0 whose regressions
are discovered by students rather than by BIRSA.

### 1.3 One stale document that matters

`docs/PROJECT-BRIEF.md` is the file every subagent reads first, and it has drifted:

- It says the body font is Inter. It is Lexend (`app/[lang]/layout.tsx` imports
  `Fraunces, Lexend, Sarabun`).
- It documents a Windows path, `C:\BIRSA files\BIRSA portal`, and a Node-not-on-PATH
  workaround that does not apply to this environment.
- It describes the content model and lib contracts as they stood several waves ago.

A brief that is wrong in its first three sections is worse than no brief, because agents
trust it. Rewriting it is Wave 0 work, not a nice-to-have. See section 9.3.

---

## 2. Design principles for BIRSA 2.0

The ten Government Design Principles, each with what it specifically obliges here. The
principles are the general case; the second sentence is the local one, and the local one is
what a reviewer should hold a pull request against.

1. **Start with user needs.** Every top-level nav item and every service start page names a
   thing a student is trying to do. If a heading names a committee portfolio, it is wrong.
2. **Do less.** BIRSA is not a university office. Link to `reg.tu.ac.th` and the programme
   office rather than rebuilding them, and reuse the loan chassis rather than writing a
   second one.
3. **Design with data.** BIRSA has almost no usage data, and roadmap section 6 forbids
   instrumenting welfare and complaint pages. So design with the data that is ethical to
   collect: search queries with no good result, page feedback, and completion rates on
   services. Never on the pages where being observed is the reason someone does not report.
4. **Do the hard work to make it simple.** The service chassis is the hard work. So is the
   bilingual type scale. Both move complexity from thirty future features into one place now.
5. **Iterate. Then iterate again.** Ship the chassis with two services on it, not eleven.
6. **This is for everyone.** WCAG 2.2 AA is the floor, not the target. Forms work without
   JavaScript. Both languages, always, enforced rather than encouraged.
7. **Understand context.** Students read this on a phone, between classes, sometimes in
   distress, sometimes in their second language, sometimes at Rangsit when the site assumes
   Tha Prachan.
8. **Build digital services, not websites.** This is D2 and section 5. It is the thesis of
   this document.
9. **Be consistent, not uniform.** One design system, one intake pattern, one status page
   shape. But the welfare intake is allowed to look and behave differently where the stakes
   demand it, for example the exit-this-page control.
10. **Make things open.** The design system gets a public reference page. The service
    standards get published and measured. The transparency page gets filled in or removed.

Four additions specific to a student association, which the GDS principles do not cover
because government departments do not dissolve every June:

11. **Design for annual turnover.** Anything that depends on undocumented knowledge held by
    one student dies each June. Prefer a constraint in the schema over a rule in a document,
    and a rule in a document over a convention in someone's head.
12. **Collect nothing by default.** Thai majority is twenty, most first-years are minors, and
    the privacy register deliberately avoids relying on consent. The study plan tool is the
    model: a genuinely useful service that stores nothing. Prefer that shape.
13. **Bilingual parity is a constraint, not a courtesy.** Enforced at the schema level or it
    will not hold past the first busy week.
14. **Never state a procedure BIRSA does not have.** From `docs/EDITING.md`. A "coming soon"
    that is two years old is worse than an honest "BIRSA does not publish this".

---

## 3. Information architecture

### 3.1 The problem to solve

Today's top level: `News`, `Services`, `Clubs`, `Activity`, `Student life`, `Answers`,
`Emergency`, `Quick`, `Search`, `Contact`, `Feedback`, `Privacy`, `Standards`, `Officer`.
Fourteen top-level route families, of which four are in the nav, one is a header CTA, and
nine are reachable only by search, footer, or luck.

### 3.2 Proposed 2.0 top level

Five primary destinations, each named for a job, plus persistent utilities.

| Nav item         | Route       | What lives here                                                                                                             | Replaces                                                     |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Do something** | `/do`       | Every service, grouped by need: get help, borrow something, apply for money, sign up, tell us something. The service index. | `/services`, parts of `/quick`                               |
| **Get help**     | `/help`     | Smart Answers, guides, the rules that apply to you, reporting, welfare, international student support.                      | `/answers`, `/student-life`, `/activity/regulations`         |
| **What's on**    | `/whats-on` | News, events, the calendar, clubs, sport fixtures.                                                                          | `/news`, `/clubs`, the home calendar                         |
| **Your studies** | `/studies`  | Study plan, course reviews, curriculum, academic issues, electives.                                                         | `/services/study-plan`, `/student-life/course-reviews`       |
| **About BIRSA**  | `/about`    | Committee, what we are doing this year, minutes, decisions, budget, elections, how to reach a portfolio.                    | `/activity`, `/activity/roles`, the transparency placeholder |

Utilities that are never nav items but are always reachable: search (header), language
toggle, theme toggle, emergency banner, `/contact`, `/privacy`, `/standards`, `/officer`.

Two things this fixes directly. "BIRSA activity" disappears as a user-facing label and its
three unrelated contents go where students would look for them: role descriptions and minutes
under About, regulations under Get help. And `/do` gives the roadmap's eleven proposed intake
flows a home that already exists, so adding a service is adding a row, not redesigning a nav.

### 3.3 URL policy

**No URL that works today may stop working.** This is a GDS rule and it matters more here
than usual, because BIRSA's links live in Instagram bios and printed orientation packs that
nobody can edit. Wave 0 produces `lib/redirects.ts`: an exhaustive old-to-new map, applied in
`proxy.ts`, with a unit test asserting every route in the 1.0 sitemap resolves to a 200 or a
301 to a 200. That test is the gate on the whole redesign.

### 3.4 Navigation components

Adopt the GDS **Service navigation** component: a second navigation bar, below the site
header, scoped to the current service. This is the piece the current site is missing. Today
a student inside the six-step loan request wizard sees only the site-wide header, so the
service has no identity and no way to expose its own "check status" or "cancel a request"
links. Service navigation solves exactly that, and it is what makes `/do` viable at eleven
services rather than two.

Keep and rebuild: **Breadcrumbs**, **Back link** (currently missing, and it is the correct
GDS answer for wizard steps rather than browser-back), **Skip link**, **Pagination**,
**Footer**, **Header**.

---

## 4. The BIRSA Design System

### 4.1 Governance before components

The failure mode is not building the components. It is the twelfth module quietly inventing a
thirteenth kind of box. So the system ships with:

- `components/bds/` as the boundary. Anything in it is a system component with a documented
  API, a test, and an entry on the reference page. Anything outside it is a page part and may
  not be imported across route families.
- **A public reference page at `/design`**, rendering every component in both locales, both
  themes, at 320px and at 400% zoom. Built from the same source as the components so it
  cannot drift. This is Principle 10, and it is also how the next IT officer learns the system
  in an afternoon instead of a term.
- **Visual regression tests** via Playwright screenshots of the reference page. Not of the
  site: of the reference page. That keeps the snapshot set small, stable, and meaningful.
- **A per-component axe assertion** in the reference page's a11y test, so a component is
  accessible before it is used rather than after it ships on nine pages.
- **A usage rule per component**, written into the TSDoc, saying what to use instead. The
  existing `NavList` doc comment ("Use this wherever the job is 'pick where to go next'.
  `Card` stays for listings that carry dates, tags or images.") is exactly the right form and
  should be the template.

### 4.2 Foundations

**Colour.** Keep the cream-editorial identity on BIR red. It is distinctive, it is already
contrast-verified in both themes, and roadmap-adjacent work should not spend its budget on a
rebrand. Two changes: promote the token set out of `app/globals.css` into
`components/bds/tokens.css` with a generated TypeScript mirror so components can reference
tokens by name in tests; and add a `npm run check:contrast` script that asserts every
documented pair in both themes, so the contrast comments in the CSS become an assertion.

**Typography.** This is the real foundation work, and it is D6. Define a single scale, and
make line-height and tracking properties of the scale step, per script:

```
--type-display-1 … --type-body-sm     (7 steps, fluid via clamp)
```

Each step sets `font-size`, `line-height` and `letter-spacing` for Latin, and is overridden
per step under `html[lang="th"]` for Thai leading and the 0.06em tracking JenjrusVris needs.
Components use `text-display-2`, never `text-4xl`. That single change removes the whole class
of bug where a new heading size ships correct in English and touching in Thai, because there
is no longer a Tailwind default line-height to fight. The existing comments in
`app/globals.css` about Thai loop height, tone marks and sidebearings are the best
documentation in the repository and should be carried over verbatim.

**Spacing and grid.** Keep `GridRow`/`GridMain`/`GridAside` and the 30px gutter, which is
already the GOV.UK grid. Add a documented spacing scale so vertical rhythm between sections
stops being `py-12 sm:py-16` copy-pasted per page.

**Focus and motion.** Both are already correct: the 3px ink ring with offset, the
`.focus-halo` variant for brand surfaces, the unlayered `.focus-highlight` yellow block for
link runs, and a global `prefers-reduced-motion` block. Carry all four over unchanged and
document them on `/design`.

**Icons.** Currently inline SVG per component. Consolidate into one sprite with a documented
set, all `aria-hidden`, none carrying meaning alone.

### 4.3 Component inventory, mapped against GDS

Verify these names against the live component index in Wave 0. Status is what 2.0 does with
each.

| GDS component                                        | BIRSA 1.0                        | 2.0 status                                                                                                         |
| ---------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Accordion                                            | `Accordion.tsx`                  | Rebuild on `<details>`                                                                                             |
| Back link                                            | none                             | **New.** Required for wizard steps                                                                                 |
| Breadcrumbs                                          | `Breadcrumbs.tsx`                | Keep, move to `bds/`                                                                                               |
| Button                                               | `Button.tsx`                     | Keep. Add `start` variant for service start pages                                                                  |
| Character count                                      | none                             | **New.** Needed for free-text intake                                                                               |
| Checkboxes / Radios / Select / Text input / Textarea | `Field.tsx`                      | Split into named components with a shared field wrapper                                                            |
| Cookie banner                                        | none                             | **Decide, do not default.** See 4.5                                                                                |
| Date input                                           | `DatesStepForm.tsx`              | Generalise into a system component                                                                                 |
| Details                                              | inline                           | Formalise                                                                                                          |
| Error message / Error summary                        | `ErrorSummary.tsx`               | Keep, move to `bds/`                                                                                               |
| **Exit this page**                                   | none                             | **New, and high priority.** See 4.4                                                                                |
| Fieldset                                             | inline                           | Formalise, with the `legend` spacing rule already in globals                                                       |
| File upload                                          | `PhotoUpload.tsx` (console only) | Generalise: reimbursement receipts need it publicly                                                                |
| Footer / Header                                      | `Footer.tsx`, `Header.tsx`       | Rebuild around the new IA                                                                                          |
| Inset text                                           | partly `Notice`                  | Split out. Inset text is not a status message                                                                      |
| Notification banner                                  | `Notice.tsx` variants            | Split: `Notice` is inline content, notification banner is a page-level result                                      |
| Pagination                                           | `Pager.tsx`                      | Keep, move to `bds/`                                                                                               |
| Panel                                                | `ResultPanel.tsx`                | Keep. This is the confirmation panel with the reference number                                                     |
| Password input                                       | `OfficerLogin.tsx`               | Keep. Already correct for WCAG 3.3.8: real `type="password"`, `autoComplete="current-password"`, no paste blocking |
| **Phase banner**                                     | none                             | **New.** See 4.5                                                                                                   |
| **Service navigation**                               | none                             | **New.** See 3.4                                                                                                   |
| Skip link                                            | `SkipLink.tsx`                   | Keep                                                                                                               |
| Summary list                                         | `SummaryRow.tsx`                 | Generalise. Also gives GDS summary cards, which the console needs                                                  |
| Table                                                | inline in `.prose`               | Formalise, with responsive behaviour at 320px                                                                      |
| Tabs                                                 | none                             | Probably do not build. Tabs hide content and hurt on mobile                                                        |
| Tag                                                  | `Tag.tsx`, `StatusPill.tsx`      | Merge into one                                                                                                     |
| **Task list**                                        | none                             | **New.** See 4.4                                                                                                   |
| Warning text                                         | `Notice variant="warning"`       | Split out                                                                                                          |

BIRSA-specific components with no GDS equivalent, all keep-and-move: `EmergencyBanner`,
`EmergencyHero`, `LanguageToggle`, `ThemeToggle`, `PageFeedback`, `ExternalLink`, `Email`,
`ShuttleTimer`, `PlacesMap`, `EventCalendar`, `CommitteeRoster`, `RegulationView`.

### 4.4 Three new components that change what BIRSA can offer

**Exit this page.** GDS built this for domestic abuse services: a persistent control that
immediately navigates away and pollutes browser history, plus a keyboard shortcut (Shift
pressed three times). BIRSA has a Rights Advocate and Student Welfare portfolio, a
`ReportHarassment` callout, and `content/reporting.ts` promising processing "with the utmost
secrecy and care". A student reporting harassment may be doing it on a shared laptop or with
someone nearby. This component is the difference between that promise being a sentence and
being a property of the page. It belongs on every welfare, reporting and rights page, and it
costs about a day.

**Task list page.** The GDS pattern for a service with several sections completed in any
order, each with a status tag. Three immediate uses: the international student arrival
checklist (roadmap, Foreign Students Assistance), the per-portfolio handover checklist
(roadmap section 4F, the highest-value item in that document), and the "start a club"
process, which today is a linear wizard for something that is genuinely a set of parallel
tasks.

**Service navigation.** Section 3.4. Without it, eleven services on one site have no
identity; with it, each service carries its own start, status and help links.

### 4.5 Two decisions that are not the designer's to make

**Cookie banner.** The site currently has a cookies page and no banner, and uses Vercel
Analytics. Whether a banner is required depends on what Vercel Analytics actually stores in
this configuration and on how `content/privacy/register.ts` characterises it. This is a PDPA
question with a factual answer, and the answer determines a piece of site chrome that every
single visitor sees. Wave 0 establishes the fact. Do not add a banner defensively: an
unnecessary consent dialog is a cognitive load tax on every visit, forever.

**Phase banner.** A 2.0 should ship each rebuilt area behind a beta phase banner with a
feedback link, then remove the banner when the area is trusted. This is standard GDS practice
and it is how you find out that the new IA confuses people from ten students rather than from
a term of silence. It requires the committee to accept that parts of the site will visibly
say "beta" for a while.

---

## 5. The service chassis

This is the architectural centre of 2.0. Everything in roadmap section 3 marked "(reuses loan
pattern)" is a customer of it, and several things not so marked should be.

### 5.1 The shape every intake already wants

The loan service does all of this. Nothing else can:

1. A **start page** that says what the service does, who it is for, what you need before you
   begin, how long it takes, and what happens next. (GDS service start page pattern.)
2. **Question pages**, one thing per page, with a back link and a saved draft.
3. A **check answers** page.
4. A **confirmation panel** with a reference number.
5. A **status lookup** that needs no account: reference plus one corroborating detail.
6. An **officer queue** with a decision, scoped to the portfolio that owns the service.
7. An **acknowledgement email** stating the actual service standard.
8. An **escalation** on the daily cron when that standard is about to be missed.
9. An **audit trail**, and for sensitive services, an audit trail that logs reads as well as
   writes.
10. A **privacy register entry**, a lawful basis, a retention trigger, and a deletion path.

Item 10 is the one that makes the chassis non-negotiable rather than merely tidy. Every new
intake flow needs an entry in `content/privacy/register.ts` and a matching branch in
`lib/privacy/retention.ts`. Built eleven times by hand, some of them will be forgotten. Built
once, the chassis can refuse to register a service that has no retention rule. That is
principle 11: a constraint in the schema, not a rule in someone's head.

### 5.2 What the chassis is

```
lib/services/
  defineService.ts     # the service definition type and its validator
  intake.ts            # submit, generate reference, persist, acknowledge
  status.ts            # reference lookup, no account
  queue.ts             # officer queue, decisions, scoping via existing auth
  escalation.ts        # hooks into /api/cron/daily
  registry.ts          # all services, validated at module load

content/services/<id>.ts   # one file per service: the definition
app/[lang]/do/[service]/…  # generic start / step / check / confirm / status routes
```

A service definition names: id, owning portfolio, bilingual copy keys, the question steps and
their zod schemas, the service standard in hours, the escalation target, the retention
trigger, the privacy register entry id, and whether the service is sensitive.

`registry.ts` validates at module load that every service has a privacy register entry and a
retention path, and the existing "not configured" house rule means a half-built service
reports itself as unavailable rather than taking the site down.

### 5.3 What this buys, concretely

Reimbursement claims, club funding applications, event sign-ups with capacity, merchandise
pre-orders, course review submissions, academic issue intake, translation help requests and
Common Room booking each become a definition file plus whatever is genuinely special about
them. Equipment loan keeps its own availability logic and its exclusion constraint from
`007_btree_gist_exclude.sql`, which room booking then reuses unchanged, because a room is an
item with a calendar.

### 5.4 Where the chassis must not be used

**Welfare cases.** Roadmap section 5 is explicit: store a reference, a category, timestamps
and a status, keep the narrative out of the database, restrict reads to one role, audit reads
as well as writes, retain for less than the general two years, and make anonymous mean
anonymous including in the audit trail. The chassis should support a `sensitive: true` mode
that enforces those, and the welfare service should be built last, reviewed by a human who is
not the person who wrote it, and shipped only if all of those hold. If they cannot be met,
build the status page and the escalation timer only and leave the narrative in email. That is
the roadmap's own instruction and this plan does not override it.

**Anything that mirrors a registrar function**, and **online voting**. Roadmap section 6.

---

## 6. Cognitive load and heuristics audit

Nielsen's ten heuristics against the current site, with what 2.0 does. Only the findings that
survived looking at the actual code are listed.

| Heuristic                                  | Finding in 1.0                                                                                                                           | 2.0 response                                                                                                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Visibility of system status             | Forms email out with no reference, no state, no record that anyone replied (roadmap §2). The reader is told nothing after submitting.    | Chassis items 4, 5, 7, 8. This is the single largest usability defect on the site.                                                                                                                  |
| 2. Match between system and the real world | "BIRSA activity" is internal vocabulary in the primary nav.                                                                              | New IA, §3.2.                                                                                                                                                                                       |
| 3. User control and freedom                | No back link in wizards; browser-back against a draft cookie is the only escape. No cancel path out of most flows.                       | Back link component; explicit cancel on every service.                                                                                                                                              |
| 4. Consistency and standards               | Four kinds of box (`Card`, `NavList`, `Notice`, `ResultPanel`) with overlapping jobs and no rule. Two status tags (`Tag`, `StatusPill`). | §4.1 governance, §4.3 inventory.                                                                                                                                                                    |
| 5. Error prevention                        | Strong already: zod both sides, honeypot, rate limiting, check-answers pages.                                                            | Keep. Add character count so free-text limits are visible before submit, not after.                                                                                                                 |
| 6. Recognition rather than recall          | Status lookup asks for a reference number the student must have kept from an email.                                                      | Unavoidable without accounts, and accounts are correctly refused (roadmap §6). Mitigate: the confirmation panel says explicitly to save the reference, and the acknowledgement email leads with it. |
| 7. Flexibility and efficiency              | `/quick` is a good power-user surface but is a header CTA rather than part of the IA.                                                    | Fold into `/do` as its top section.                                                                                                                                                                 |
| 8. Aesthetic and minimalist design         | D4: home page carries six blocks and ~19 destinations.                                                                                   | §6.2.                                                                                                                                                                                               |
| 9. Help users recover from errors          | Error summary with focus management is already implemented correctly.                                                                    | Keep. Extend to the console, which is currently weaker.                                                                                                                                             |
| 10. Help and documentation                 | `helpSlot` on `PageHeader` implements WCAG 3.2.6 consistent help. Good, and underused: most pages pass nothing.                          | Make it mandatory in the page template rather than optional.                                                                                                                                        |

### 6.2 Cognitive load, specifically

- **Intrinsic load** is the actual difficulty of the task: what a 90-day immigration report
  requires, what counts as harassment. Reduce it with Smart Answers and checklists, never by
  omitting the hard part.
- **Extraneous load** is what the design adds: nineteen home page choices, four kinds of box,
  a calendar loading for a reader who wants a shuttle time. This is the load 2.0 is
  responsible for, and cutting it is what §3.2 and §4.1 are for.
- **Germane load** is what the reader retains: after one visit a student should know that
  every BIRSA service works the same way, gives a reference, and can be checked. Consistency
  is not aesthetics here, it is the mechanism by which the second visit is cheaper than the
  first.

Concrete home page decisions for 2.0: at most four blocks. A short hero that says what BIRSA
is and offers one primary action. Top tasks, chosen from search-query and page-feedback data
rather than from committee preference. What is on, as three items and a link. An emergency and
service-status region that is usually empty. The month calendar moves to `/whats-on`, where
the people who want a calendar are, and the home page links to it.

Jakob's law cuts against inventing here: students spend their time on other sites, and a
site that behaves like every other service site is a site they do not have to learn.

---

## 7. Accessibility and performance

WCAG 2.2 AA remains the floor. The criteria that specifically bite in this rebuild:

- **2.4.11 Focus not obscured (minimum).** The header is sticky. Currently handled with
  `scroll-padding-top: 5.5rem`. Adding service navigation makes the sticky region taller, so
  that value becomes a token derived from the actual chrome height and gets a test.
- **2.5.8 Target size (minimum).** AA requires 24px; the site already targets 44px. Keep the
  higher bar and assert it in the reference page test rather than trusting `h-11`.
- **3.2.6 Consistent help.** `PageHeader`'s `helpSlot` in the same place on every page.
  Make it required.
- **3.3.7 Redundant entry.** The draft cookie already avoids re-asking within a wizard. The
  chassis must preserve that, and must not re-ask on the check-answers-to-confirm step.
- **3.3.8 Accessible authentication.** Officer login is already compliant: real password
  field, `autoComplete="current-password"`, no paste blocking. Do not regress it, and do not
  add a puzzle-based CAPTCHA.
- **1.4.11 Non-text contrast.** `--color-input-border` exists specifically for this. The new
  `check:contrast` script should assert it.

Non-negotiable process points: forms work without JavaScript (there is already a
`progressive-enhancement.spec.ts` proving it, and it must keep passing through the rebuild);
console pages are not exempt, because officers use phones and some will use a screen reader;
content readable at 320px and 400% zoom.

Performance: keep `lighthouserc.js` byte budgets and tighten them as the rebuild removes
weight. Removing the calendar from the home page should show up as a measurable drop in the
home page budget, and if it does not, that is a finding.

---

## 8. Content model 2.0

Follow the roadmap's split exactly (§4B). It is already the right answer and this plan does
not relitigate it.

**Add a lifecycle to every content type, in git or in the database:**

- `status`: draft, scheduled, published, archived
- `publishAt`: for scheduled publication
- `owner`: the portfolio that owns this content, from the committee structure
- `lastReviewed` and `reviewBy`: a date after which the page shows as stale in the console

**Enforce bilingual parity in the schema**, not in review. A content item without both
locales cannot reach `published`. This is principle 13 and it is one zod refinement.

**Turn house style into validation.** Roadmap §4B is right that an em dash currently fails
the build, and that in a console it should be an inline field error in the editor's own
language. The rule set (no em dashes, sentence case, plain language) should live in one
`lib/content/houseStyle.ts` used by both the build check and the console validator, so
they cannot disagree.

---

## 9. Delivery: parallel Sonnet subagent execution

This section is the operational half of the plan. The redesign is roughly 100 components and
120 routes across two locales. Run sequentially it is very long. Run naively in parallel it
produces merge conflicts in exactly the files that matter most, and a design system that
fractured during its own construction.

### 9.1 The two rules that make parallelism safe

**Rule 1: contracts are frozen before any parallel work starts.**
Wave 0 is sequential, done by an Opus-class orchestrator, and produces the things every
later agent depends on: tokens, component API signatures as typed stubs, the route map, the
redirect table, the dictionary key skeleton, the service definition type. After Wave 0 these
files are read-only to subagents. An agent that believes a contract is wrong stops and
reports; it does not edit. A contract change is an orchestrator decision, applied once,
before the next wave starts.

**Rule 2: every agent owns a disjoint set of file paths, exhaustively listed in its brief.**
Not "work on the news pages". A literal list of paths the agent may create or modify, and a
separate list it may read. Two agents never hold the same path in the same wave. If a wave
cannot be partitioned this way, the wave is wrong and needs splitting.

### 9.2 The contention problem, and the one refactor that fixes it

Three files are wanted by nearly every agent, and they are the reason naive parallelism
fails here:

- `app/globals.css`. Fixed by Rule 1: tokens are frozen in Wave 0, component styling lives in
  the component as Tailwind utilities, and no subagent has write access to globals.
- `lib/i18n.ts`. Frozen in Wave 0. It is small and it changes rarely.
- `content/dictionaries/{en,th}.ts`. This is the real problem: two ~243-line monoliths that
  every page agent must add keys to. Twelve agents editing two files is twelve conflicts.

**The fix, and it must happen in Wave 0:** split the dictionaries into a namespace per
domain.

```
content/dictionaries/en/{chrome,a11y,forms,services,whatson,help,studies,about,console}.ts
content/dictionaries/th/…  (identical key structure)
content/dictionaries/{en,th}/index.ts   # composes, and is itself frozen
```

with a type-level assertion that the Thai tree has exactly the English tree's keys. Now each
agent owns one namespace file per locale, conflicts go to zero, and the parity constraint is
enforced by the compiler rather than by review. This refactor is small, it is mechanical, and
without it the parallel plan does not work.

### 9.3 Wave 0: contracts (sequential, Opus, no subagents)

Nothing else starts until every item here is committed.

1. Fetch and reconcile the three GDS URLs. Correct §4.3 and §4.4 of this document against the
   live indexes.
2. Rewrite `docs/PROJECT-BRIEF.md` as `docs/BUILD-BRIEF-2.0.md`: correct fonts (Lexend, not
   Inter), correct environment, correct lib contracts, and a new "how to work as a subagent
   on this project" section. Every agent brief points at it. A wrong brief is a systematic
   bug, not a local one.
3. `components/bds/tokens.css` plus the generated TypeScript mirror, including the bilingual
   type scale from §4.2.
4. Component API stubs: every component in §4.3 as a typed, documented, non-implemented file.
   Props and TSDoc only. This is what lets a page agent in Wave 3 import a component a
   component agent in Wave 2 is still writing.
5. The dictionary split from §9.2.
6. `lib/services/defineService.ts`: the service definition type, unimplemented.
7. `lib/redirects.ts` and its test: the exhaustive 1.0-to-2.0 URL map from §3.3.
8. The route map, as a checked-in document, listing every 2.0 route and which agent owns it.
9. Decide the two questions in §4.5 (cookie banner, phase banner).

### 9.4 Waves, agents and ownership

Model guidance: **Sonnet** implements inside a frozen contract, which is most of the work.
**Opus** does Wave 0, every wave boundary, and review of anything touching `lib/inventory/auth.ts`,
`content/privacy/register.ts`, `lib/privacy/retention.ts`, or the welfare service. A subagent
never makes an IA decision, a privacy decision, or a contract change.

Practical concurrency cap: **four to six agents per wave**. The limit is not the machine, it
is how much diff one reviewer can hold in their head at a wave boundary. More agents than
that and integration becomes the bottleneck you were trying to avoid.

Every agent runs with `isolation: "worktree"` so it has its own checkout, and merges to a
per-wave integration branch off `claude/website-2-redesign-plan-pifrc5`.

| Wave                     | Agents        | Each owns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Gate to pass                                                                                                      |
| ------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **1. Foundations**       | 4             | A: type scale and colour utilities. B: layout primitives (grid, page template, spacing). C: icon sprite. D: test harness, `/design` page skeleton, visual regression setup, `check:contrast` script.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `/design` renders, both locales, both themes, snapshots baseline.                                                 |
| **2. Component library** | 6             | One agent per cluster, each owning its files in `components/bds/` and its dictionary namespace: **forms** (input, textarea, radios, checkboxes, select, date, file, character count, fieldset, error message, error summary); **navigation** (header, footer, service navigation, breadcrumbs, back link, pagination, skip link); **status** (tag, notification banner, panel, inset text, warning text, notice, phase banner); **content** (summary list, table, accordion, details, card, nav list); **service UI** (task list, start page template, check-answers template, confirmation, status lookup, exit this page); **console UI** (console shell, queue table, decision form, summary cards). | Every component on `/design`, axe clean, keyboard clean, 320px and 400% zoom clean, both locales.                 |
| **3. Service chassis**   | 3             | A: `lib/services/*` and the generic `/do/[service]` routes. B: migration of equipment loan onto the chassis, which is the proof the chassis works. C: the officer console lift from `officer/inventory/` to `officer/` plus portfolio permissions (Opus review required: touches auth).                                                                                                                                                                                                                                                                                                                                                                                                                 | Loan service passes its existing e2e suite unchanged through the chassis.                                         |
| **4. Page rebuild**      | 6             | One agent per route family, each owning its `app/[lang]/…` subtree and its dictionary namespace: home and `/do` index; `/whats-on` (news, events, clubs, calendar); `/help` (answers, guides, regulations, reporting); `/studies` (study plan, course reviews, curriculum); `/about` (committee, this year, transparency); utility pages (privacy, standards, error pages, search, `/design` polish).                                                                                                                                                                                                                                                                                                   | Redirect test green. a11y and progressive-enhancement suites green. No route family imports another's page parts. |
| **5. Content and copy**  | 2             | EN agent and TH agent, each owning its locale's dictionary namespaces and MDX tree. Never the same file. **Copy is authored natively per language, never machine translated**, per `docs/EDITING.md`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Parity assertion compiles. House style check passes. A human who reads Thai reviews the Thai.                     |
| **6. Integration**       | 0, sequential | Orchestrator: full e2e, Lighthouse budgets, phase banners, redirect audit, `/design` completeness check against §4.3.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Everything green. Then, and only then, roadmap Phase 2 work starts on top.                                        |

**Waves 3 and 4 partially overlap.** Wave 4's page agents can start against Wave 2's frozen
component APIs before Wave 3's chassis lands, as long as no page agent owns a `/do/` route.
That overlap is where most of the wall-clock saving comes from. Do not overlap Waves 1 and 2:
a component built against an unfrozen type scale is a component built twice.

### 9.5 The agent brief template

Every subagent gets exactly this shape. Vagueness here is what produces conflicts.

```
ROLE
  One sentence. What this agent is responsible for.

READ FIRST
  docs/BUILD-BRIEF-2.0.md
  docs/REDESIGN-2.0.md sections <the relevant ones>
  components/bds/tokens.css and the component stubs you implement

YOU OWN (create or modify only these paths)
  <exhaustive literal list>

YOU MAY READ (never write)
  <literal list, always including app/globals.css, lib/i18n.ts,
   content/dictionaries/*/index.ts>

CONTRACTS YOU MUST NOT CHANGE
  Component prop signatures from the Wave 0 stubs.
  Token names. Route paths. Dictionary key structure.
  If a contract is wrong: STOP, report it, do not edit it.

DELIVERABLE
  <what exists at the end, including its entry on /design and its test>

VERIFY BEFORE REPORTING
  npx tsc --noEmit
  npm run lint
  npm run test
  Do NOT run next build or next dev. Do NOT run git.

FORBIDDEN
  New dependencies. Editing another agent's owned paths.
  Inventing institutional facts (see the brief's Facts section).
  Machine-translating copy between locales.
  Touching lib/inventory/auth.ts, content/privacy/register.ts,
  or lib/privacy/retention.ts.

REPORT
  Files created or changed. Decisions taken. Contracts you wanted to change
  and did not. Anything you could not finish.
```

### 9.6 Integration protocol

1. Agent works in its worktree, verifies, reports.
2. Orchestrator reviews the diff against the brief. The first question is always: did it touch
   anything outside its owned paths? If yes, that is a process failure and gets fixed before
   the code is judged.
3. Merge to the wave integration branch. Conflicts at this step mean Rule 2 was violated;
   record which paths collided, because that is a bug in the wave partition, not in the agent.
4. At the wave boundary the orchestrator runs the full suite, updates the visual regression
   baseline deliberately rather than automatically, and only then unfreezes the next wave.
5. `/design` completeness is checked at every wave boundary. A component that shipped without
   an entry there has not shipped.

### 9.7 What must never be parallelised

- Design tokens and the type scale. One agent, Wave 0, or the system fractures during
  construction.
- The IA and the route map. Decisions, not work.
- `lib/inventory/auth.ts` and the permission model. Security-critical, Opus, reviewed.
- The privacy register and retention paths. One agent, reviewed by a human.
- The welfare service. Built last, alone, reviewed by someone other than its author.
- Thai copy. One agent, one voice, and a human who reads Thai signs it off. Two agents writing
  Thai produces two registers in one site, which readers notice even when reviewers do not.

---

## 10. Risks

| Risk                                                          | Why it is real here                                                                                                                                                | Mitigation                                                                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| The rebuild loses a working thing                             | 1.0 has five correct wizards, a working loan service and a passing a11y suite. Ground-up redesigns routinely regress exactly this kind of unglamorous correctness. | The existing e2e suites are the acceptance criteria for 2.0 and must pass unchanged. The loan service migrating onto the chassis is the proof. |
| The redesign never finishes and the site is half two versions | The most common outcome for volunteer-run redesigns.                                                                                                               | Phase banners and route-family-sized waves. Every wave leaves a shippable site.                                                                |
| Contracts drift during parallel execution                     | Twelve agents, one system.                                                                                                                                         | §9.1, and `/design` as the single place drift becomes visible.                                                                                 |
| Thai quality degrades                                         | Thai is the default locale and the harder half. It is also the half most likely to be quietly machine-translated under time pressure.                              | §9.7. Native authoring is a hard rule, and the parity assertion catches absence but not badness, so the human review is the control.           |
| The 2.0 becomes a rebrand instead of a redesign               | Colour and type are the fun part. The chassis is not.                                                                                                              | The identity is explicitly kept (§4.2). Budget goes to §5.                                                                                     |
| Scope collides with the capability roadmap                    | Both documents want the next six months.                                                                                                                           | §11.                                                                                                                                           |

---

## 11. How this interlocks with the capability roadmap

The roadmap's phases and this plan's waves are not competing; one is what BIRSA does and the
other is what the site becomes. The dependency runs one way.

- **Roadmap Phase 0** (account custody, second and third admin, the runbook) has no dependency
  on any of this and should happen now, in parallel, by people rather than by agents. It is
  also the cheapest and most important thing in either document.
- **Roadmap Phase 1** (publishing without git, via the issue-form-to-pull-request flow) is
  independent of the redesign and should also run now. It is content workflow, not design.
- **Roadmap Phase 2** (intake that remembers: welfare references, escalation, event sign-ups)
  is the first thing that should wait, because it is exactly what the chassis is for. Building
  it before Wave 3 means building it twice.
- **Roadmap Phases 3, 4 and 5** all become substantially cheaper after Wave 3 and Wave 2
  respectively, because portfolio permissions, the console shell and the component library are
  the bulk of each.

Recommended reading: do roadmap Phases 0 and 1 immediately and by hand. Run Waves 0 through 4
of this plan. Then do roadmap Phase 2 onward on top of the chassis, where each new service is
a definition file.

---

## 12. Decisions needed before Wave 0

1. **Is the identity kept?** This plan assumes cream-editorial on BIR red survives, and spends
   the budget on structure instead. If the committee wants a visual rebrand, that is a
   different and larger Wave 1.
2. **Is the IA in §3.2 right?** It is the one decision every later wave depends on, and it is
   a decision about students, not about code. Test it with ten students and a card sort before
   Wave 0 ends. This is cheap and it is the highest-value hour in the whole plan.
3. **Cookie banner: required or not?** §4.5. A factual PDPA question with a permanent
   consequence for every visitor.
4. **Will BIRSA ship visible beta banners?** §4.5.
5. **Does BIRSA hold welfare case records at all, or only timestamps and a status?** This is
   roadmap question 3 and it is unchanged: both are defensible, deciding by accident is not.
   The chassis needs the answer before the sensitive mode is designed.
6. **Who reviews Thai copy?** Named person, not "the committee". Without this, §9.7's control
   does not exist.
