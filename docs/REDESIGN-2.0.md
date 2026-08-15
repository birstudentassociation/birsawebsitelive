# BIRSA Portal 2.0: redesign plan

A ground-up redesign of the BIRSA Portal, built to one governing requirement:

> **Every officer of BIRSA can run the whole website, including publishing, configuring and
> operating it, without writing code and without needing the IT officer.**

Everything else in this document serves that sentence. The thirty-odd capabilities in
`docs/CAPABILITY-ROADMAP.md` should land as things officers configure, not as things
developers build.

This is a proposal for the committee and for whoever builds it. Nothing here has been built.
It is written to be executed by a fleet of parallel Sonnet subagents, and section 11 is the
part that makes that safe.

Read `docs/CAPABILITY-ROADMAP.md` first. That document asks what BIRSA needs. This one asks
what the site has to become for those needs to be cheap to meet and safe to hand over.

**The short answer on a CMS: yes, one is necessary, and this plan specifies Sanity.** The
reasoning, the boundaries, and the honest costs are section 6. The roadmap's cheaper interim
(its section 4C, the GitHub issue form to pull request flow) is superseded as an end state and
retained only as a bridge. Section 14 explains why.

Three changes in this plan alter what the site is, rather than how it is built, and they are
meant to be read together because the third pays for the first two:

- **Content carries images** (section 4.7). The site is text-only today; a student association
  that runs events and cannot show them is publishing a newspaper with no photographs. Done
  properly this is six pieces of work, not a field, and one of them is a photography policy
  with legal weight.
- **Lost and found** (section 5.5), reportable by any student in either direction, specified in
  full and built first, because it is the right first proof of the service chassis.
- **A deliberate reduction in scope** (section 3.6). BIRSA is the bottom rung of a four-level
  ladder and currently publishes a great deal that belongs to TUSU, TUSC or the faculty.
  Roughly half of `content/student-life/` should become a signpost or a redirect. Removing it
  is what makes the other two affordable for a committee of volunteers who all leave in June.

**Source note.** This plan is informed by the GOV.UK Design System, the Government Design
Principles, the GOV.UK Service Manual, Nielsen's usability heuristics, and cognitive load
theory. Three sets of facts in this document could not be verified from this environment,
because the network egress proxy blocks `design-system.service.gov.uk`, `www.gov.uk` and
`www.sanity.io`:

1. GDS component and pattern names (sections 3 and 4).
2. Sanity plan tiers, seat counts, seat pricing, document history retention, and which tier
   gates granular roles (section 6.11).
3. Whether a Thai localisation bundle exists for the Sanity Studio interface (section 6.4).

All three are cited from knowledge, all three are flagged in place, and all three are Wave 0
verification tasks. Treat them as claims to check, not facts to build on. Item 2 in
particular carries a recurring cost for a student association and must be settled before
anyone commits to this plan.

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
  rather than throwing. The site builds and renders with no environment at all. Section 6.9
  extends this rule to cover the CMS, and it is what stops a hosted dependency becoming a
  single point of failure.
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

### 1.2 The nine defects that justify a 2.0

**D1. Every act of publishing requires a developer.** This is the governing defect and the
one the other eight serve. `docs/EDITING.md` documents it plainly: changing the site means a
git commit. So the Public Relations officer cannot publish news, the Treasurer cannot publish
a budget, and the Spokesperson cannot raise an emergency banner, without one assistant officer
being awake, free, and still enrolled. Nothing in the 1.0 architecture is wrong in a way that
caused this; the architecture simply never had a second way in. Fixing it is section 6.

**D2. The information architecture is an org chart wearing a service costume.**
The primary nav is `What's on`, `Find a service`, `Clubs`, `BIRSA activity`. Three of those
are user-shaped. "BIRSA activity" is named after the organisation, and it is where the
regulations library, the role descriptions and the committee live: three unrelated jobs
filed under one internal label. Government Design Principle 1 is start with user needs, not
government needs. A student looking for the rules on club funding does not think "activity".

Worse for the hardening requirement: the nav is defined in `content/dictionaries/{en,th}.ts`,
which means **adding a page to the site's navigation is a code change**. An editable site
whose navigation is not editable is not an editable site.

**D3. There is no first-class notion of a service.**
`app/[lang]/services/` is a folder. `equipment-loan` and `study-plan` share a parent
directory and nothing else: no shared type, no shared start page, no shared status page, no
shared service standard, no shared metadata. The loan flow's reference-number machinery lives
in `lib/inventory/loans.ts` and is not reachable by anything that is not equipment. The
capability roadmap proposes at least eleven more intake flows (reimbursement claims, funding
applications, welfare cases, event sign-ups, merchandise pre-orders, course review
submissions, academic issue intake, room booking, translation help, trials sign-up, buddy
matching). Built the current way that is eleven more bespoke folders, each needing a
developer. Built once as a chassis whose service definitions are editable documents, it is
eleven things an officer creates in an afternoon. Sections 5 and 6.7.

**D4. The design system is undeclared.**
Tokens exist in `app/globals.css` and they are thoughtful. But there is no component
contract, no reference page, no visual regression test, and no rule for when to reach for
`Card` versus `NavList` versus `Notice` versus `Tag`. `components/` currently holds 96 files
with no internal boundary between site chrome, service UI, console UI and one-off page parts.
`ReportHarassment.tsx` sits at the top level next to `Button.tsx`.

This matters twice as much once officers can edit. A design system that developers can
fracture is a design system that officers will certainly fracture, because they have less
context and more pages to make. Section 4.6 is the answer: officers compose from a fixed
palette, never from free layout.

**D5. The entry points carry too much.**
The home page renders six blocks: hero, top tasks plus a featured rail, news, an interactive
month calendar, and an activity highlight list. The calendar is the heaviest interactive
component on the site and it sits on the page every visitor loads, serving a need most
visitors do not have on most visits. Hick's law says choice time grows with the number of
options; the home page currently offers roughly nineteen destinations above the footer.

**D6. The officer console is inventory-shaped, not portfolio-shaped.**
Everything lives under `app/[lang]/officer/inventory/` and `Role` is
`admin | inventory_manager | loan_officer | read_only`. Roadmap section 4A is exactly right:
the shell needs to lift to `app/[lang]/officer/` and permissions need to name portfolios and
verbs. Doing that during a 2.0 rebuild is cheap. Doing it after five more modules have been
built inside the inventory shell is not.

**D7. Bilingual typography is a patch, not a system.**
`app/globals.css` currently overrides Thai heading line-height and letter-spacing outside
the cascade layers, specifically so those rules can beat the Tailwind `text-*` utilities that
set a line-height Thai cannot use. The comments explaining why are excellent and the fix
works. But it is a system where every new heading size is a new opportunity for Thai to
break, and the fix has to be remembered each time. A 2.0 should define one bilingual type
scale where line-height is a property of the scale step rather than of the utility, so Thai
is correct by construction. Once officers are creating pages, "remembered each time" is not a
mechanism that exists.

**D8. Content has no lifecycle.**
There is no draft state, no scheduled publication, no last-reviewed date, no owner field on
anything except Smart Answers. The roadmap's Phase 3 asks for draft and scheduled states.
More basically: a student association turns over every June, and content with no review date
and no named portfolio owner is content nobody will ever dare to delete.

**D9. There is no phase signal and no feedback loop anyone reads.**
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
trust it. Rewriting it is Wave 0 work, not a nice-to-have. See section 11.3.

---

## 2. Design principles for BIRSA 2.0

The ten Government Design Principles, each with what it specifically obliges here. The
principles are the general case; the second sentence is the local one, and the local one is
what a reviewer should hold a pull request against.

1. **Start with user needs.** Every top-level nav item and every service start page names a
   thing a student is trying to do. If a heading names a committee portfolio, it is wrong.
2. **Do less.** BIRSA is not a university office and it is the bottom rung of a four-level
   ladder. Publish what only BIRSA can publish; signpost the rest to TUSU, TUSC, the faculty
   or the registrar rather than keeping a second copy that will be wrong first. Section 3.6
   turns this into an audit with dispositions, and it is what makes the rest of this plan
   affordable for a volunteer committee.
3. **Design with data.** BIRSA has almost no usage data, and roadmap section 6 forbids
   instrumenting welfare and complaint pages. So design with the data that is ethical to
   collect: search queries with no good result, page feedback, and completion rates on
   services. Never on the pages where being observed is the reason someone does not report.
4. **Do the hard work to make it simple.** The service chassis and the editorial platform are
   the hard work. Both move complexity from thirty future features into one place now.
5. **Iterate. Then iterate again.** Ship the chassis with two services on it, not eleven.
6. **This is for everyone.** WCAG 2.2 AA is the floor, not the target, and it applies to the
   officer-facing surfaces too. Forms work without JavaScript. Both languages, always,
   enforced rather than encouraged.
7. **Understand context.** Students read this on a phone, between classes, sometimes in
   distress, sometimes in their second language, sometimes at Rangsit when the site assumes
   Tha Prachan. Officers edit it on a phone, at night, in week nine, having never been shown
   how.
8. **Build digital services, not websites.** This is D3 and section 5.
9. **Be consistent, not uniform.** One design system, one intake pattern, one status page
   shape. But the welfare intake is allowed to look and behave differently where the stakes
   demand it, for example the exit-this-page control.
10. **Make things open.** The design system gets a public reference page. The service
    standards get published and measured. The transparency page gets filled in or removed.

Five additions specific to a student association, which the GDS principles do not cover
because government departments do not dissolve every June:

11. **No single point of publishing failure.** This is the governing requirement restated as
    a design rule. If exactly one person can do a thing, the design is wrong, whether that
    person is the IT officer or the President. Every capability has at least two people who
    can exercise it, and the system knows who they are (section 7.4).
12. **Design for annual turnover.** Anything that depends on undocumented knowledge held by
    one student dies each June. Prefer a constraint in the schema over a rule in a document,
    and a rule in a document over a convention in someone's head.
13. **Collect nothing by default.** Thai majority is twenty, most first-years are minors, and
    the privacy register deliberately avoids relying on consent. The study plan tool is the
    model: a genuinely useful service that stores nothing. Prefer that shape.
14. **Bilingual parity is a constraint, not a courtesy.** Enforced at the schema level or it
    will not hold past the first busy week. Once officers publish directly, "enforced by
    review" means "not enforced".
15. **Never state a procedure BIRSA does not have.** From `docs/EDITING.md`. A "coming soon"
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

| Nav item         | Route       | What lives here                                                                                          | Replaces                                                     |
| ---------------- | ----------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Do something** | `/do`       | Every service, grouped by need: get help, borrow something, apply for money, sign up, tell us something. | `/services`, parts of `/quick`                               |
| **Get help**     | `/help`     | Smart Answers, guides, the rules that apply to you, reporting, welfare, international student support.   | `/answers`, `/student-life`, `/activity/regulations`         |
| **What's on**    | `/whats-on` | News, events, the calendar, clubs, sport fixtures.                                                       | `/news`, `/clubs`, the home calendar                         |
| **Your studies** | `/studies`  | Study plan, course reviews, curriculum, academic issues, electives.                                      | `/services/study-plan`, `/student-life/course-reviews`       |
| **About BIRSA**  | `/about`    | Committee, what we are doing this year, minutes, decisions, budget, elections, how to reach a portfolio. | `/activity`, `/activity/roles`, the transparency placeholder |

Utilities that are never nav items but are always reachable: search (header), language
toggle, theme toggle, emergency banner, `/contact`, `/privacy`, `/standards`, `/officer`.

Two things this fixes directly. "BIRSA activity" disappears as a user-facing label and its
three unrelated contents go where students would look for them: role descriptions and minutes
under About, regulations under Get help. And `/do` gives the roadmap's eleven proposed intake
flows a home that already exists, so adding a service is adding a row, not redesigning a nav.

### 3.3 Navigation is content, not code

This is a hardening requirement and it changes where the nav lives. In 2.0 the primary
navigation, the footer link groups, the `/quick` link groups and the home page top-task list
are all **editable documents in the CMS** (section 6.2), not entries in
`content/dictionaries`. The dictionaries keep only true interface chrome: button labels,
accessibility strings, error text.

The constraint that keeps this safe: a nav item can only point at a published document or at
a route the application actually serves. The schema validates the target, so an officer cannot
publish a menu item that 404s. Section 6.3.

### 3.4 URL policy

**No URL that works today may stop working.** This is a GDS rule and it matters more here
than usual, because BIRSA's links live in Instagram bios and printed orientation packs that
nobody can edit. Wave 0 produces `lib/redirects.ts`: an exhaustive old-to-new map, applied in
`proxy.ts`, with a unit test asserting every route in the 1.0 sitemap resolves to a 200 or a
301 to a 200. That test is the gate on the whole redesign.

Once officers can create pages, they can also change slugs, which breaks links in a way no
test can catch in advance. So the CMS keeps a slug history per document and the application
301s from any previous slug automatically. An officer renaming a page does not have to know
that redirects exist. Section 6.3.

### 3.5 Navigation components

Adopt the GDS **Service navigation** component: a second navigation bar, below the site
header, scoped to the current service. This is the piece the current site is missing. Today
a student inside the six-step loan request wizard sees only the site-wide header, so the
service has no identity and no way to expose its own "check status" or "cancel a request"
links. Service navigation solves exactly that, and it is what makes `/do` viable at eleven
services rather than two.

Keep and rebuild: **Breadcrumbs**, **Back link** (currently missing, and it is the correct
GDS answer for wizard steps rather than browser-back), **Skip link**, **Pagination**,
**Footer**, **Header**.

### 3.6 Scope: what BIRSA should stop publishing

The other two additions to this plan (images, section 4.7, and lost and found, section 5.5)
both make the site bigger. This one makes it smaller, and it is what pays for them. A 2.0 that
only adds is a 2.0 that a twenty-one-person volunteer committee cannot maintain by November.

#### The ladder already exists in BIRSA's own content

`content/activity/{en,th}/student-bodies.mdx` sets out four levels, and it is the sharpest
scoping tool in the repository:

| Level                                     | Bodies                                                    |
| ----------------------------------------- | --------------------------------------------------------- |
| BIR (programme)                           | BIRSA, BIR class councils                                 |
| Singhadang (Faculty of Political Science) | The Political Science Students' Committee, class councils |
| TPC (Tha Prachan Campus)                  | TUSU TPC, TUSC TPC                                        |
| TU (all campuses)                         | TUSU, TUSC, ECTU                                          |

BIRSA is at the bottom rung. The rule that follows is:

> **BIRSA publishes what only BIRSA can publish.** If a fact is equally true for a law student
> at Rangsit, it is TUSU or TUSC's to publish, and BIRSA maintaining a second copy of it means
> maintaining a copy that will be wrong first.

This is Government Design Principle 2 (do less) and it is also `docs/EDITING.md`'s existing
"say who actually decides" rule applied to whole pages rather than to sentences.

#### The audit

`content/student-life/` holds 24 documents per locale, 48 files. They split cleanly:

| Track            | Documents                                                                                                                       | Level              | Disposition                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------- |
| `handbook/`      | about-bir, academic-life, academic-activities, curriculum-and-study-plan, assessment-and-degree, admission-and-fees, internship | BIR                | **Keep all.** This is the programme. Nobody else will ever write it |
| `home/`          | getting-involved, rights-and-welfare, study-support                                                                             | BIR and Singhadang | **Keep**, trimmed to the BIR-specific slice                         |
| `home/`          | shuttle-bus, getting-around, places-nearby, food-and-budgeting                                                                  | TPC                | **Signpost.** TU runs the shuttle. BIRSA does not                   |
| `home/`          | health-and-wellbeing, safety-and-emergencies, money-matters                                                                     | TU                 | **Signpost.** Health service, security, registrar                   |
| `international/` | arrival-and-first-week                                                                                                          | Mixed              | **Absorb.** Keep the BIR week-one part, delegate the rest           |
| `international/` | visa-and-immigration, healthcare-and-insurance, banking-and-money, phones-and-internet, culture-and-language                    | TU and national    | **Signpost, and see the warning below**                             |

Also in scope for the same test: `/services/university-services`, the emergency scenario
content, and any Smart Answers node whose `owner` is not BIRSA or the faculty.

**A specific safety point about `visa-and-immigration.mdx`.** Immigration rules change without
notice and the consequence of a stale sentence is a student out of status. BIRSA has no
authority here and no mechanism to know when the rules move. That page should hold no
procedural detail at all: it should say what the 90-day report is, that BIRSA runs a reminder
service for it (roadmap, Foreign Students Assistance), and where the authoritative source is.
This is principle 15 in its most consequential form.

#### Four dispositions, and what each actually means

- **Keep.** BIRSA is the authoritative source, or nobody else is.
- **Signpost.** The route stays. The page becomes short and deliberately designed: the one
  BIR-specific thing worth saying, the named body that owns the rest, and a link. A signpost is
  a service, not an absence, and a good one is more useful than the copy it replaces. What it
  must never be is a page of bare links with no editorial judgement.
- **Absorb.** Keep the BIR-specific slice, fold it into a neighbouring page, delete the rest.
- **Delete.** No BIR-specific slice, an authority exists. The URL 301s, per 3.4. **Nothing
  404s.** A deleted page is a redirect, always.

#### The gate: do not delegate into a void

Delegation is only better than duplication when the destination holds. Before any document is
signposted or deleted, all four must be true:

1. An authoritative source exists and is publicly reachable.
2. It is maintained. Check when it last changed.
3. It is available in the language the reader needs. A Thai-only source fails an international
   student; an English-only source fails many Thai students. Where only one language exists,
   the signpost carries a short bilingual summary and says plainly that the source is in one
   language.
4. It is stable enough to link to.

**If any of the four fails, keep the content**, and mark it: `maintainedBecause: "no
authoritative source"`, with an owner and a review date (section 10). That label is not an
excuse, it is a trigger: when TUSU does publish it, the review surfaces the page and BIRSA
deletes it then. This turns a one-time cull into a standing policy, which is the only kind
that survives turnover.

#### Link rot is the cost, and it has to be engineered

Trading forty pages for forty external links trades a maintenance burden for a decay problem.
Untended, a delegated site becomes a page of dead links in about two years, which is worse than
what it replaced. So:

- **External links are a registered content type**, with the owning portfolio and the body they
  point at (TUSU, TUSC, registrar, OIA, health service, faculty office).
- **The daily cron checks them** and raises a dead or redirecting link to the owning portfolio
  in the console. This is cheap: it is one more job in `/api/cron/daily`, which already runs
  loan reminders and the PDPA purge.
- **A link that has been dead for a fortnight escalates**, exactly as an unacknowledged case
  does (roadmap section 4E).

#### What this is worth

Roughly half of `student-life/` stops being BIRSA's to maintain. That is not the point. The
point is that a committee whose attention is finite stops spending it on where to buy lunch and
spends it on the things in the capability roadmap that genuinely have no other owner:
BIR course reviews, the study plan, the committee's own commitments, welfare casework, and the
programme handbook. Removing content is how the rest of this plan becomes affordable.

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

**Typography.** This is the real foundation work, and it is D7. Define a single scale, and
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
| Checkboxes / Radios / Select / Text input / Textarea | `Field.tsx`                      | Split into named components with a shared field wrapper. Each becomes a question type in the form palette (6.7)    |
| Cookie banner                                        | none                             | **Decide, do not default.** See 4.5                                                                                |
| Date input                                           | `DatesStepForm.tsx`              | Generalise into a system component and a question type                                                             |
| Details                                              | inline                           | Formalise                                                                                                          |
| Error message / Error summary                        | `ErrorSummary.tsx`               | Keep, move to `bds/`                                                                                               |
| **Exit this page**                                   | none                             | **New, and high priority.** See 4.4                                                                                |
| Fieldset                                             | inline                           | Formalise, with the `legend` spacing rule already in globals                                                       |
| File upload                                          | `PhotoUpload.tsx` (console only) | Generalise: reimbursement receipts need it publicly                                                                |
| Footer / Header                                      | `Footer.tsx`, `Header.tsx`       | Rebuild around the new IA, with link groups editable (3.3)                                                         |
| Inset text                                           | partly `Notice`                  | Split out. Inset text is not a status message                                                                      |
| Notification banner                                  | `Notice.tsx` variants            | Split: `Notice` is inline content, notification banner is a page-level result                                      |
| Pagination                                           | `Pager.tsx`                      | Keep, move to `bds/`                                                                                               |
| Panel                                                | `ResultPanel.tsx`                | Keep. This is the confirmation panel with the reference number                                                     |
| Password input                                       | `OfficerLogin.tsx`               | Keep. Already correct for WCAG 3.3.8: real `type="password"`, `autoComplete="current-password"`, no paste blocking |
| **Phase banner**                                     | none                             | **New.** See 4.5                                                                                                   |
| **Service navigation**                               | none                             | **New.** See 3.5                                                                                                   |
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

**Service navigation.** Section 3.5. Without it, eleven services on one site have no
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
say "beta" for a while. The banner's text and its on/off state are editable (6.6), so removing
it does not need a developer.

### 4.6 Constrained composition: the rule that survives officer editing

This is the hardening principle for the design system, and it is what separates "officers can
edit the site" from "officers can wreck the site".

**Officers compose pages from a fixed palette of section types. They never write layout, CSS,
class names, HTML, or free-form components.**

The palette, each a schema type in the CMS and a component in `bds/`:

| Section type     | What it does                                         |
| ---------------- | ---------------------------------------------------- |
| Rich text        | Prose, headings, lists, links, tables                |
| Nav list         | A run of link rows with descriptions                 |
| Card grid        | 2 or 3 columns of cards with optional images         |
| Notice           | Info, success, warning, error callout                |
| Inset text       | A quoted or emphasised aside                         |
| Accordion        | Question and answer pairs                            |
| Step by step     | An ordered process                                   |
| Task list        | Sections with status tags                            |
| Contact panel    | A portfolio's contact details, pulled from one place |
| Related links    | Cross-links, validated against real documents        |
| Embedded service | A link into a service, rendered as a start card      |

Three properties make this safe. The palette is finite, so the visual language cannot grow
without a developer. Every section renders through a `bds/` component, so a design system
change reaches every page ever made. And there is no rich-text escape hatch: no raw HTML
field, no arbitrary embed, no custom CSS field. Those three fields are how every constrained
CMS eventually becomes unconstrained, and this one will not have them.

Rich text itself is constrained too: the allowed marks and block styles are declared in the
schema (headings two and three only, bold, italic, links, lists, tables). An officer cannot
produce an h1 inside a page body, which protects the heading order that the accessibility
tests assert.

### 4.7 Images: a paradigm shift, built properly

Today the site is text-only by design. The only images anywhere are the logo, committee
portraits read off the filesystem by `lib/committee-portrait.ts`, equipment photographs inside
the console, and OpenStreetMap tiles. A news post cannot carry a picture. The cream-editorial
identity is carried entirely by typography and whitespace.

**In 2.0 content carries images, and this is a genuine paradigm shift rather than a new field.**
A student association that runs events and cannot show them is publishing a newspaper with no
photographs, and it is the reason committee news currently lives and dies on Instagram. Doing
this properly means six things, and skipping any of them is how a text-forward site becomes a
slow, inaccessible, legally exposed photo blog.

#### A. The identity does not change

Images are added to the cream-editorial system, not laid over it.

- **A fixed set of aspect ratios** (16:9, 4:3, 1:1) declared in the schema. No arbitrary
  heights, so cards never jump and cumulative layout shift stays at zero.
- **Images sit on the page, they do not bleed off it.** Generous margins, a hairline
  `--color-line` border or a soft inset so a white-heavy photo does not float against cream,
  and the same treatment inverted in dark mode. The precedent already exists: the OSM tile
  filter in `app/globals.css` darkens bright imagery in dark mode rather than letting it glare.
- **Never text over an image.** The contrast cannot be guaranteed across arbitrary photographs,
  and no amount of scrim makes it reliably AA. Captions sit below in the muted tone.
- **Full-bleed heroes are rare and deliberate**, not the default for every post.
- Display type stays the identity. A photograph supports the story; it does not become the
  page.

#### B. Components

New in `components/bds/`, all on `/design`:

| Component   | Job                                                              |
| ----------- | ---------------------------------------------------------------- |
| `Figure`    | Image with optional caption and credit, the workhorse            |
| `HeroImage` | One per page at most, the LCP candidate, `priority` set          |
| `CardImage` | The image variant of a card, fixed ratio                         |
| `Gallery`   | An ordered set with a lightbox, keyboard operable, escapable     |
| `Portrait`  | Committee portraits, 1:1, with the existing placeholder fallback |

`Gallery` is the one to be careful with: a lightbox is a modal, and a modal needs focus
trapping, an escape route, and a non-JavaScript fallback that is simply the images in a list.
The site already has `ConfirmDialog` and `useConfirmDialog` to model that behaviour on.

#### C. Accessibility, enforced not encouraged

- **Alt text is required in both locales**, publish-blocking, exactly as body copy is
  (principle 14). An English-only alt text is a Thai screen reader user reading English.
- **Decorative is a deliberate choice, not a default.** A boolean in the schema; setting it
  hides the alt field and renders `alt=""`. An officer must actively say an image carries no
  information.
- **Alt text describes the scene, not the people.** This is an accessibility rule and a privacy
  rule at once: "students at the welcome fair" rather than a list of names.
- Validation rejects the usual failures: empty alt on a non-decorative image, alt text that
  begins "image of", alt text identical to the caption.
- Captions and credits are real text, never baked into the image.
- No image is the sole carrier of meaning, per the existing house rule.

#### D. Performance, which is where this usually goes wrong

- **Sanity's asset pipeline does the work**: one upload, served at every size, in AVIF or WebP
  by negotiation, with a low-quality blur placeholder. The officer uploads a phone photograph
  once and never thinks about formats.
- **Hotspot and crop.** The officer marks the subject of the image once, and every aspect ratio
  crops around it automatically. This is the single most important usability feature in the
  whole image story, because the alternative is asking a non-technical editor to produce four
  crops of every photograph, which they will not do, and the site fills with beheaded people.
- **A source file size limit at upload**, with a clear message, so a 12MB original is rejected
  at the door rather than stored forever.
- **`lighthouserc.js` budgets are re-cut per template** with images counted, and a per-page
  image budget (one hero plus a bounded number of body images). Only the hero gets `priority`;
  everything else is lazy.
- The LCP element on a news page becomes an image, so the budget for it is set deliberately
  rather than discovered after launch.

#### E. Photographs of students are personal data, and this is the hard part

This is the requirement most likely to be skipped, and it is the one with legal weight.

`content/privacy/register.ts` deliberately avoids relying on consent, because Thai majority is
twenty and most first-year students are minors whose consent would need a guardian. A
photograph of an identifiable student at a BIRSA event is personal data collected in exactly
that setting. So:

- **A new processing activity in the register** for event photography, with a lawful basis, a
  retention trigger and a deletion path, like every other activity.
- **A photography notice at events**, and a practical opt-out that does not require a student
  to argue with a committee member holding a camera.
- **Prefer wide shots.** Where an individual is the clear subject of a published photograph,
  their agreement is obtained and recorded. Crowd and activity shots are the default.
- **A fast takedown route.** `/privacy/your-data` already runs a rights-request wizard; add
  "remove a photograph of me" as a category with a **service standard shorter than the general
  one**, because a photograph someone wants removed is urgent in a way a data access request is
  not. It should be measured in days.
- **No names in alt text or captions for group photographs**, and no tagging of any kind.
- **Nothing that looks like face matching**, ever, in any form.
- Photographs of minors get the strictest treatment, and where age is unknown, assume it.

#### F. Where images live

- **Content images go to Sanity assets.** They are published content, they benefit from the
  transform pipeline, and they contain no student submissions.
- **Operational uploads stay in Vercel Blob**: equipment photographs, reimbursement receipts,
  and found-item photographs (5.5). These may contain personal data, they are subject to
  retention, and they must be deletable by the existing purge in `lib/privacy/retention.ts`.
  The boundary in 6.3 holds without exception.
- **Committee portraits migrate from the filesystem to Sanity.** Today replacing 21 portraits
  each June means 21 files committed to `public/committee/`, which is the publishing bottleneck
  in miniature. `lib/committee-portrait.ts` has served well and its placeholder fallback
  behaviour should be preserved exactly; only the source changes.

#### G. The house rules officers actually read

Short enough to sit in the Studio field descriptions: photograph the activity, not the faces;
ask before you make someone the subject; no screenshots of chat messages; no photographs of
documents, ID cards or screens; if in doubt, do not publish it, and ask the Rights Advocate.

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
intake flow needs an entry in the privacy register and a matching branch in
`lib/privacy/retention.ts`. Built eleven times by hand, some of them will be forgotten. Built
once, the chassis can refuse to publish a service that has no retention rule. That is
principle 12: a constraint in the schema, not a rule in someone's head. It matters more once
the person creating the service is an officer rather than a developer, because the officer
has no way of knowing the rule exists unless the system tells them.

### 5.2 What the chassis is

```
lib/services/
  defineService.ts     # the service definition type and its validator
  intake.ts            # submit, generate reference, persist, acknowledge
  status.ts            # reference lookup, no account
  queue.ts             # officer queue, decisions, scoping via existing auth
  escalation.ts        # hooks into /api/cron/daily
  registry.ts          # loads definitions, validates, exposes them to routes
  questionTypes.ts     # the fixed palette of question types (see 6.7)

app/[lang]/do/[service]/…  # generic start / step / check / confirm / status routes
```

A service definition names: id, owning portfolio, bilingual copy, the question steps and
their validation, the service standard in hours, the escalation target, the retention
trigger, the privacy register entry, and whether the service is sensitive.

In 1.0 terms that definition would be a TypeScript file. **In 2.0 it is a document in the
CMS**, so an officer creates a service the way they create a page. Section 6.7 sets out how,
and where the boundary is. The registry validates every definition at load and the existing
"not configured" house rule means a half-built service reports itself as unavailable rather
than taking the site down.

### 5.3 What this buys, concretely

Lost and found (5.5), reimbursement claims, club funding applications, event sign-ups with
capacity, merchandise pre-orders, course review submissions, academic issue intake, translation
help requests and Common Room booking each become a definition plus whatever is genuinely
special about them.
Equipment loan keeps its own availability logic and its exclusion constraint from
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

A specific hardening consequence: **the sensitive flag is not officer-editable.** An officer
can create a service; only a developer can mark one sensitive or unmark it, because that flag
changes the retention, audit and access rules. Section 6.12.

**Anything that mirrors a registrar function**, and **online voting**. Roadmap section 6.

### 5.5 Lost and found, in full

A service any student can report to, in either direction. It is specified here in full rather
than listed, because it should be **the first service built on the chassis** and it is the one
that proves the chassis works.

#### Why this one first

It is high frequency and low stakes, which is exactly the right combination for a first
service. Every student loses something. Nobody is harmed if the first version is rough. And it
exercises almost the whole chassis in one go: two intakes, a public listing, photographs
(4.7), physical custody, matching, retention, and a boundary with the university. The welfare
service exercises the same machinery and must be built last (5.4). Building lost and found
first is how the chassis is proven before it carries something that matters.

It also replaces something that currently works badly: a lost wallet is announced in an
Instagram story that is gone in twenty-four hours and searchable by nobody.

#### The three surfaces

| Surface                     | Who                | What                                                                       |
| --------------------------- | ------------------ | -------------------------------------------------------------------------- |
| `/do/lost-and-found/lost`   | Any student        | Report something lost: what, where, roughly when, how to reach you         |
| `/do/lost-and-found/found`  | Any student        | Report something found: what, where, when, a photograph, where you left it |
| `/do/lost-and-found`        | Anyone, no account | Browse and search what has been handed in                                  |
| `/do/lost-and-found/status` | The reporter       | Reference lookup, both directions, no account                              |
| Console queue               | Owning portfolio   | Review, publish, match, mark claimed, age out                              |

Everything except the browse listing is standard chassis behaviour and is therefore free.

#### Custody: this is where CBEMS is reused, not rebuilt

A found item is an item, in a location, held by a custodian. The inventory system already
models all three, and `009_custodians.sql` and `010_backfill_items_custodian.sql` already
separate club custodians from BIRSA's own stock, with `canManageCustodian` scoping so a club
officer sees only their own. A found item handed to a club rather than to the BIRSA room is
that same relationship.

So the physical half of lost and found is an existing table with a new item state, not a new
system. This is the roadmap's own argument about the Common Room ("a room is an item with a
calendar") applied again.

#### Claiming: the problem a naive build gets wrong

If the public listing shows everything about an item, anyone can describe it back and claim it.
So the listing **deliberately withholds one distinguishing detail**: a colour, a mark, what is
inside, the lock screen, the name written in the cover. To claim, the student describes that
detail, and the officer checks it against the record. Getting it wrong is not a rejection; it
is a conversation.

This has to be a schema field (`withheldDetail`, required, never rendered publicly) rather than
a habit, or it will be forgotten by the second committee.

#### What BIRSA must not take custody of

The service says who actually decides, and for some categories the answer is not BIRSA. **A
passport, a Thai national ID card, a student ID card, a bank card, or anything of real value
does not go in a BIRSA drawer.** Those categories are routed at the point of reporting: the
form tells the finder to hand the item to the faculty office or campus security, gives the
location and the hours, and records only that it was routed there. No custody, no photograph,
no listing.

This is a legal and a practical boundary and it is also principle 15: BIRSA is not the
university lost property office, and a service that implies otherwise sends a student to the
wrong desk at the worst moment. The start page says where the university's own lost property is
for anything lost outside the faculty.

#### Photographs, which is where this meets 4.7

Found-item photographs are the most likely place on the whole site for personal data to leak
into public view: a name inside a book, an ID card in a wallet, a lock screen, a timetable with
a student number.

- Photographs go to **Vercel Blob, never to Sanity** (4.7F, 6.3).
- **Nothing is published automatically.** An officer reviews every photograph before it appears
  on the public listing. This is not a moderation nicety; it is the control that makes the
  listing safe.
- The report form warns, in both languages, not to photograph documents, screens or anything
  with a name on it.
- Categories that imply identity documents **never get a public photograph at all**, and are
  routed away per the section above.
- The photograph is deleted with the record on the retention trigger, not left in Blob.

#### Retention, which is a real design decision

- A found item is held for a **stated number of days**, published on the start page, and the
  number is configuration rather than code (6.6) so the owning portfolio can change it.
- The daily cron ages items, warns the custodian before the deadline, and prompts the handover
  of unclaimed items to the university lost property.
- Records and photographs purge on a trigger implemented in `lib/privacy/retention.ts`, with a
  matching privacy register entry, before the service can publish (5.1 item 10, 6.7).
- A lost report expires too. A student who found their keys in their bag does not come back to
  close the record, so the cron closes it and says so.

#### Ownership

The **General Coordinator** owns it: their brief is internal affairs, Rangsit and the day-to-day
running of BIRSA, and physical custody of things in the BIRSA room is exactly that. **Student
Welfare is the second holder**, per principle 11, because nothing is held by one person.

Rangsit matters here more than anywhere else on the site. An item lost at Rangsit and held at
Tha Prachan is useless to the person who lost it, so location and campus are first-class fields
and the listing filters on them. This is the roadmap's "campus as a reader fact" earning its
keep.

---

## 6. The editorial platform

### 6.1 Is a CMS necessary? Yes.

The roadmap offered a cheaper interim in its section 4C: a GitHub issue form that an Action
turns into a pull request, preview deployments, and merge rights for two or three officers.
That option is well judged for the problem the roadmap was solving, which was to remove the
_developer_ from the publishing path. It cannot meet the requirement at the top of this
document, which is to remove the _code path_ itself. Four reasons, in ascending order of
decisiveness:

1. **It only handles documents.** A news post can be generated from an issue form. The
   committee roster (21 people, portraits, bilingual role descriptions, annual replacement),
   the activity calendar, the club directory, the navigation, a Smart Answers decision tree
   and a service definition cannot, or can only by making the issue form so elaborate that it
   is worse than the file it produces.
2. **The officer is still reasoning about a pull request.** A preview URL helps. It does not
   change the fact that the mental model is branches, merges and builds, which is precisely
   the knowledge that leaves every June.
3. **It moves the bottleneck rather than removing it.** "Merge rights for two or three
   officers" means two or three officers are now the constraint. Better than one. Not the
   requirement.
4. **It cannot do configuration, new pages, or new services at all.** Those are half of what
   "run the website" means, and no issue form reaches them.

So: a CMS is necessary. This plan specifies **Sanity**, as directed.

### 6.2 Why Sanity fits this project specifically

Not a general endorsement; these are the properties that matter here.

- **The Studio is a React application that lives in this repository and deploys with the
  site.** Mounted at a route (`/studio`) via `next-sanity`, it ships on the existing Vercel
  project. This directly answers the roadmap's honest objection to a git-backed CMS, which was
  that Decap or similar "swaps one piece of infrastructure knowledge for another" in the form
  of an OAuth proxy somebody has to keep running. There is no proxy here and no second
  deployment.
- **Schemas are TypeScript in the repository.** This is the property that makes the whole plan
  work: the _constraints_ stay code, enforced and reviewed and tested, while the _content_
  becomes officer-editable. Bilingual parity, house style, retention rules, the section
  palette and the question palette are all schema, so none of them can be edited away by
  someone who does not know they exist.
- **Validation runs in the editor, in the editor's language.** Sanity's validation API takes a
  custom function returning a message. Roadmap section 4B asks for exactly this: "House style
  becomes a validation message, not a build failure ... an inline error next to the field, in
  the editor's own language, that they can fix themselves in five seconds." That is a direct
  implementation, not an approximation.
- **Draft and published are built in, and scheduled publishing exists.** Roadmap Phase 3 asks
  for draft and scheduled states. This is a feature, not a build.
- **The Studio's navigation is programmable.** Structure Builder lets the Studio be organised
  by portfolio rather than by document type, which is the same portfolio-shaped idea as
  roadmap section 4A applied to the editing surface. Section 6.4.
- **Webhooks to `revalidateTag` give instant publish with no redeploy.** The existing
  `/api/emergency/revalidate` route already establishes this pattern in the codebase.
- **Document history and revert are built in**, so an officer's mistake is a click to undo
  rather than a call to the IT officer. Retention of that history varies by plan; see 6.11.

The honest costs, stated once and not softened: a new data processor to register, a second
identity system to run (6.8), a recurring seat cost that is unverified (6.11), and a migration
away from MDX to Portable Text (6.10). None of these is a reason not to do it. All of them are
reasons to decide it deliberately.

### 6.3 What goes in Sanity, and what must never

The boundary is not negotiable and it is the most important paragraph in this section.

> **Sanity holds published content and site configuration. It never holds personal data.**

Everything a student submits (loan requests, welfare cases, reimbursement claims, sign-ups,
feedback, rights requests) stays in Postgres, behind the officer console, under the existing
audit log and the existing retention paths. The Content Lake is a publishing system, and
treating it as an operational database would take BIRSA's most sensitive records and put them
in a third-party store that was not chosen for that purpose, with a permission model that was
not designed for it.

**Moves to Sanity:**

| Content                                                | Owning portfolio                  | Why                                                 |
| ------------------------------------------------------ | --------------------------------- | --------------------------------------------------- |
| News and events                                        | Public Relations                  | Changes weekly. The headline case                   |
| Activity calendar                                      | Student Activities                | Changes weekly                                      |
| Committee roster and role descriptions                 | Secretariat                       | Churns completely every year                        |
| Club directory                                         | Student Activities                | Changes each term                                   |
| Quick links, navigation, footer groups, home top tasks | Public Relations                  | 3.3: an uneditable nav makes an editable site a lie |
| Generic pages                                          | Any                               | So a new page never needs a developer               |
| Student-life guides                                    | Welfare, Foreign Students         | Long-form, changes yearly                           |
| Regulations library                                    | Rights, Secretariat               | Must be publishable by the Secretaries              |
| Smart Answers decision trees                           | Academic Affairs, Welfare         | See the caution below                               |
| Minutes, decisions, announcements, budget, commitments | Secretaries, Treasurer, President | The transparency placeholder's actual contents      |
| Service definitions                                    | Any                               | 6.7                                                 |
| Site configuration singletons                          | President, Spokesperson           | 6.6                                                 |
| Content images and committee portraits                 | Public Relations, Secretariat     | 4.7. Replaces the filesystem portrait drop          |
| External link register                                 | Every portfolio                   | 3.6. Delegation is only safe if link rot is watched |
| Curriculum data                                        | Academic Affairs                  | See the caution below                               |
| Privacy register descriptive text                      | Secretariat                       | See the caution below                               |

**Three of those need stronger controls rather than an exemption.** The roadmap proposed
leaving Smart Answers, curriculum and the privacy register in git because they change slowly,
carry real consequences when wrong, and are protected by a test suite. That reasoning is
sound, but leaving them in git means the IT officer is still required for them, which fails
the governing requirement. The hardened answer is to move them and replace the test net with
controls the officer meets in the editor:

- **Smart Answers.** Node and edge documents with schema-enforced referential integrity: every
  outcome must be reachable, every question must have at least two answers, every answer must
  point at an existing node, and the `out-not-covered` honest fallback is mandatory and cannot
  be deleted. Publishing runs a tree validation and blocks on failure. The existing
  `tests/unit/smart-answers.test.ts` assertions become schema validations plus a nightly
  integrity check.
- **Curriculum.** The heaviest existing test suite (`curriculum-2564.test.ts`,
  `curriculum-2568.test.ts`, `curriculum-minors.test.ts`, `curriculum-registry.test.ts`,
  `curriculum-sources.test.ts`) becomes credit-total, prerequisite-cycle and source-citation
  validation in the schema, plus a mandatory second approver on publish (6.5). Curriculum data
  changes about once every few years and an error sends a student to the wrong graduation, so
  it gets the strictest workflow on the site. But it does not get a developer.
- **The privacy register.** Officers may edit the descriptive text: what an activity is, what
  it collects, in what words. They may **not** create an activity, change a lawful basis, or
  change a retention period, because those are legal claims that `lib/privacy/retention.ts`
  has to honour in code. A nightly integrity check asserts that every published register entry
  has a matching implemented retention path and every implemented path has an entry; a
  divergence raises a blocking alert in the console and emails the President. This is the
  general shape for anything where the content is a promise the code must keep.

### 6.4 The Studio, shaped by portfolio

Officers should never see a list of document types. They should see their job.

Structure Builder gives each portfolio its own top-level entry, containing exactly what that
portfolio owns, in the order they use it, with the things they do most at the top. The
Treasurer opens the Studio and sees Budget, Reimbursement claims, Funding applications,
Merchandise ledger. The Spokesperson sees Statements, Emergency, Press routing. Nobody scrolls
past nineteen document types to find theirs.

Beyond structure, four things make the Studio usable by a committee that has never seen one:

- **Every field has a description, authored in both languages**, saying what it is for and
  what good looks like. These are written by us, in the schema, so they are reviewed like code.
- **The Studio interface language.** Whether Sanity ships a Thai localisation bundle for its
  own interface is one of the three unverified facts flagged at the top of this document.
  Wave 0 checks. If it does not exist, field titles and descriptions carry the whole burden of
  making the Studio legible to a Thai-first editor, which raises their priority rather than
  lowering it.
- **An in-Studio guide.** A set of guide documents, visible in the Studio, covering the ten
  things officers actually do. Written by the outgoing committee, edited by the incoming one.
- **A first-run checklist per portfolio**, so a new officer in June has a defined path from
  "I have been given a login" to "I have published something".

### 6.5 Publishing: preview, approve, publish, revert

The workflow is deliberately short, because a long one gets bypassed.

1. **Edit.** Draft saves automatically. Nothing is public.
2. **Preview.** The Presentation tool shows the draft rendered on the real site, in both
   locales, on a phone-sized frame. The officer sees the actual page, not a form.
3. **Validate.** Publishing is blocked, with inline messages in the editor's language, if:
   both locales are not complete; house style is violated; a link points at nothing; a
   required field is empty; a service has no retention rule; a decision tree is broken.
4. **Approve.** Most content publishes on one person's say-so. A small, named set requires a
   second approver: curriculum, the privacy register, regulations, anything on the
   transparency pages, and any change to navigation. The second approver is a role, not a
   person, and any two of the three site administrators satisfy it.
5. **Publish**, or **schedule** for a date and time.
6. **Revert.** Document history, one click, no developer. The retention window on that history
   is plan-dependent and is one of the verification items in 6.11.

Two safety properties worth stating explicitly. Nothing an officer publishes can take the site
down (6.9). And every publish is attributed and timestamped, which means the transparency page
can honestly say who changed what and when.

### 6.6 Configuration without a dashboard

Roadmap section 4D splits configuration correctly and this plan keeps that split, with one
addition.

- **Emergency mode stays in Vercel Edge Config.** It is the one thing that must work when the
  application and the database are broken, and it is deliberately independent of both. But the
  _switch_ moves onto a console page for the Spokesperson and the President, exactly as the
  roadmap says, so nobody needs Vercel dashboard access to raise a banner. Officers never see
  Edge Config; they see a page on their own site with a confirm dialog.
- **Everything else becomes Sanity singleton documents**: feature flags per module, contact
  routing per category, homepage section order, sign-ups open or closed, service standards,
  the phase banner text and state, opening hours, term dates, the sitewide contact details.
  A webhook revalidates the affected cache tag, so a change is live in seconds.

The reason to prefer Sanity over Postgres for configuration, having built the console anyway:
one editing surface, one permission model, one audit trail, one preview mechanism, one revert.
A second configuration UI in the console would be a second thing to learn and a second thing
to hand over.

### 6.7 Forms and services without code

This is the most ambitious part of the hardening and the boundary matters.

**An officer can create a complete intake service in the Studio.** They give it a name in both
languages, a start page, an owning portfolio, a service standard in hours, an escalation
target, and an ordered list of questions. The site immediately serves it at `/do/<slug>` with
question pages, a back link, a check-answers page, a reference number, a confirmation, a
status lookup, an officer queue, an acknowledgement email and a cron escalation. All of that
is chassis behaviour and none of it is configured.

**They compose questions from a fixed palette**, not from arbitrary field definitions:

| Question type  | Validation the chassis applies                       |
| -------------- | ---------------------------------------------------- |
| Short text     | Length, required                                     |
| Long text      | Length with a character count component              |
| Email address  | Format, and it becomes the acknowledgement recipient |
| Phone number   | Thai and international formats                       |
| Student ID     | The existing format check                            |
| Date           | Range, not in the past                               |
| Date range     | The existing loan date logic                         |
| Choose one     | From options the officer writes                      |
| Choose several | From options the officer writes                      |
| File upload    | Type and size, into Blob, never into Sanity          |
| Yes or no      | Required                                             |

This is how government form builders work and the reason is sound: the officer decides what to
ask, the developer decides what a question can be. New question types are code, and that is
correct, because a new question type is a new validation rule, a new accessibility surface and
a new PDPA consideration.

**Three things the officer cannot do, by design**, each of which routes to a developer:

- Mark a service sensitive (5.4).
- Create a question that collects a category of personal data with no retention rule. The
  schema requires every service to reference a privacy register activity, and requires that
  activity to have an implemented retention path, before it can publish.
- Change what happens after submission beyond the queue, the standard and the escalation
  target. Bespoke logic, such as the loan's availability constraint, is code.

### 6.8 Two identity systems, one access register

An honest problem with an honest answer.

The Studio authenticates against Sanity project membership. The console authenticates against
the `officers` table and `lib/inventory/auth.ts`. Unifying them properly would mean custom
authentication into Sanity, which is an enterprise feature and disproportionate here. So BIRSA
will have two logins, and pretending otherwise would be the wrong kind of tidiness.

What makes that safe is refusing to have two access _registers_:

- `/officer` is the single door. It is where officers go, and it links to the Studio.
- **`/officer/access` is one page listing every person and everything they hold**, in both
  systems, with their portfolio, their grants, and their term end date. It reads the Sanity
  project members through the Management API and joins them to the `officers` table.
- **A term end date on every access grant in both systems.** The existing `officers` table has
  `is_active`; add a term end so accounts expire by default rather than by memory. Sanity
  membership has no such field, so the access register holds it and the daily cron raises
  anyone past their date.
- **The daily cron reports drift**: someone in Sanity who is not an officer, an officer past
  their term end, any capability held by fewer than two people (principle 11).
- **Handover generates from this page.** Roadmap section 4F asks for a handover pack per
  portfolio. The access half of it is this page, printed.

### 6.9 What happens when Sanity is unavailable

Adding a hosted dependency to a site that had none is the real risk in this plan, and the
existing house rule already tells us what to do about it: every module reports itself as not
configured rather than crashing.

- **Content is cached, not fetched per request.** Pages render from the cache and are
  revalidated by webhook. A Sanity outage means content stops updating, not that pages stop
  serving.
- **Stale is better than absent.** If a revalidation fetch fails, the last good render is
  served and the failure is logged. The reader sees nothing wrong, because nothing is wrong.
- **A build-time content snapshot** is committed to the repository on every deploy. If the
  Content Lake were unreachable at build time, the site still builds from the snapshot. This
  also means the repository always holds a complete, restorable copy of every published
  document, which is a backup and a hedge against the platform in one file.
- **The Studio being down affects editing only.** The public site does not depend on it.
- **Emergency mode is deliberately not in Sanity** (6.6), so the one thing that must work
  during an incident does not depend on the thing most likely to be part of one.
- A **content integrity check on the daily cron**: document counts, required singletons
  present, no published document failing validation. Failures raise a console alert.

### 6.10 PDPA, processors, and the MDX migration

**A new processor entry is required** in `content/privacy/register.ts`, in the shape the file
already uses. Sanity receives the site's editorial content plus the names and email addresses
of the committee members who edit it. Those editor accounts are personal data of the committee,
and the existing `officer-account` activity is the entry that needs extending.
`docs/pdpa/processor-agreements.md` needs a corresponding record, and dataset region should be
chosen deliberately and recorded in the `country` field, since the register's section 28
analysis turns on it.

**One qualification to the 6.3 boundary, introduced by images.** The boundary says the CMS
holds no student personal data, and it holds for everything a student submits. Published
photographs are the one place where content itself contains personal data: a photograph of an
identifiable student at a BIRSA event is that student's personal data, whoever uploaded it. So
the Sanity processor entry says so plainly rather than claiming "no personal data", and event
photography gets its own processing activity with a lawful basis, a retention trigger and a
deletion path (4.7E). The operational boundary is unchanged: submissions, receipts and
found-item photographs never enter the CMS.

**A new processing activity for lost and found**, covering the reporter's contact details, the
item description and the photograph, with the holding period from 5.5 as its retention trigger
and a deletion path that removes the Blob object as well as the row. The service cannot publish
until both exist, which is the chassis rule from 5.1 item 10 doing its job on its first
customer.

Two register consequences that go the other way, and both are real privacy improvements worth
naming. The `google-forms` processor entry should become removable once event sign-ups move
onto the chassis (roadmap section 3, Student Activities), which retires a processor that
currently receives student data BIRSA cannot see or delete. And section 3.6's delegation
removes pages, which removes nothing from the register but does reduce the surface where a
future feature could quietly start collecting something.

`vercel-blob` grows two new uses: service file uploads, and found-item photographs. Its
register entry currently reads "Photographs of equipment ... No personal data", and that
sentence stops being true the moment lost and found ships. It must be updated in the same
change, not afterwards.

**MDX to Portable Text.** The site's long-form content is MDX with custom components
(`<Notice>`, `<ReportHarassment>`, and the component map in `lib/mdx.tsx`). Portable Text is
Sanity's equivalent and supports custom block types, so those components survive as schema
types with React renderers. The migration is scripted, not hand-done, and it is genuinely a
cost: the rendering path, the table of contents (`lib/toc.ts`), the search text extraction
(`lib/search/mdx-text.ts`) and the anchor-link behaviour all need reworking against the new
format. Budget for it honestly. The upside is that Portable Text is structured data rather
than a string, which makes the search index and the table of contents more reliable than
parsing markdown ever was.

### 6.11 Cost, seats and plan limits: verify before committing

**This is the most important unresolved item in the plan and it is a decision for the
committee, not for the builder.** `www.sanity.io` is blocked from this environment, so none of
the following could be checked and none of it should be relied on:

- The number of user seats included in each plan tier, and the cost of additional seats.
- Whether BIRSA's committee needs 21 seats or fewer. Realistically, perhaps eight to ten
  people publish, and the rest need nothing or a viewer role. That estimate should be turned
  into a real number by asking each portfolio.
- Document history retention per tier, which determines how far back an officer can revert.
  This directly affects 6.5.
- Which tier gates granular or custom roles. Standard roles may not express "Public Relations
  can publish news but not budgets". If granular roles are out of reach, the fallback is that
  Studio structure and validation express the intent while enforcement stays coarse, and the
  access register (6.8) plus the audit trail carry the accountability. That is a weaker
  guarantee and the committee should know they are choosing it.
- API request and bandwidth limits against the site's traffic.

Wave 0 produces a one-page costing with real figures and a recommended tier. If the recurring
cost is not acceptable to BIRSA, that is a legitimate answer, and the fallback is the
roadmap's section 4C flow as a permanent arrangement rather than a bridge, with the governing
requirement of this document knowingly unmet. Better to decide that openly in June than to
discover it in November.

### 6.12 What deliberately stays in code

"No code" is a claim about running the website, not about building it. These remain
developer work, and saying so plainly is what makes the rest of the claim honest:

- The design system: tokens, typography, components, and therefore how anything looks.
- The section palette (4.6) and the question palette (6.7). Officers compose from them;
  extending them is code.
- Schema changes, including new content types and new fields.
- The `sensitive` flag and anything that changes retention, audit or access rules.
- `lib/privacy/retention.ts`: the implemented deletion paths behind every register entry.
- Authentication, permissions, and `lib/inventory/auth.ts`.
- Bespoke service logic such as the loan availability constraint.
- Platform upgrades, dependency and security updates, backups and restore drills.

This is roadmap section 4G's "what IT actually does afterwards", and it is a real job and a
better one. It is not "publish this for me by Friday".

---

## 7. The editorial operating model

The platform is half of the hardening. This is the other half, and most of it is not code.

### 7.1 Who can publish what

Grants name a portfolio and a verb, matching the console's permission model from roadmap
section 4A: `news:publish`, `calendar:edit`, `roster:edit`, `finance:publish`, `cases:read`,
`emergency:toggle`, `service:create`, `nav:edit`. The President assigns them. The IT officer
does not appear in the assignment path at all, which is the point.

### 7.2 The two-person rule

Principle 11, made operational. **Every grant is held by at least two people at all times**,
and at least two people hold site administration, one of whom is the President or a Secretary
rather than IT. The daily cron checks this and raises anything held by one person. Nobody is
the only holder of anything, including the IT officer.

### 7.3 The review requirement

Most content publishes on one signature. The list in 6.5 step 4 requires two. That list is
deliberately short: curriculum, privacy register, regulations, transparency pages, navigation.
Everything else is trusted to the portfolio that owns it, because a review process that covers
everything is a review process that gets clicked through.

### 7.4 Turnover, every June

- Term end dates on every grant in both systems (6.8), so access expires by default.
- The handover pack per portfolio, generated from live data: open cases, assets held,
  recurring dates, external contacts, account custody, and the access register.
- A first-run checklist per portfolio in the Studio (6.4).
- **Account custody verified before anything else is built**: the GitHub repository, the
  Vercel project, the domain and DNS, Resend, Postgres, Blob, Edge Config, **and now the
  Sanity project**, all owned by `birsa@tu.ac.th` rather than by any student. Roadmap section
  4F makes this the first task in the whole programme and adding Sanity does not change that
  ordering, it lengthens the list.

### 7.5 Training that survives the trainer

Three artifacts, all of which live in the Studio and are therefore editable by the people who
use them: the in-Studio guide, the per-portfolio first-run checklist, and the runbook for the
ten things that break. Written by the outgoing committee as part of handover, which means they
are rewritten annually by people who have just learned the system, which is when the gaps are
most visible.

---

## 8. Cognitive load and heuristics

Nielsen's ten heuristics against the current site, with what 2.0 does. Only the findings that
survived looking at the actual code are listed.

| Heuristic                                  | Finding in 1.0                                                                                                                        | 2.0 response                                                                                                                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Visibility of system status             | Forms email out with no reference, no state, no record that anyone replied (roadmap §2). The reader is told nothing after submitting. | Chassis items 4, 5, 7, 8. This is the single largest usability defect on the site.                                                                                                                  |
| 2. Match between system and the real world | "BIRSA activity" is internal vocabulary in the primary nav.                                                                           | New IA, §3.2.                                                                                                                                                                                       |
| 3. User control and freedom                | No back link in wizards; browser-back against a draft cookie is the only escape. No cancel path out of most flows.                    | Back link component; explicit cancel on every service. For officers: document history and revert (§6.5).                                                                                            |
| 4. Consistency and standards               | Four kinds of box (`Card`, `NavList`, `Notice`, `ResultPanel`) with overlapping jobs and no rule. Two status tags.                    | §4.1 governance, §4.3 inventory, and §4.6 so officer-made pages inherit the consistency rather than diluting it.                                                                                    |
| 5. Error prevention                        | Strong already: zod both sides, honeypot, rate limiting, check-answers pages.                                                         | Keep. Add character count. For officers: publish-time validation (§6.5) is error prevention for the editorial surface.                                                                              |
| 6. Recognition rather than recall          | Status lookup asks for a reference number the student must have kept from an email.                                                   | Unavoidable without accounts, and accounts are correctly refused (roadmap §6). Mitigate: the confirmation panel says explicitly to save the reference, and the acknowledgement email leads with it. |
| 7. Flexibility and efficiency              | `/quick` is a good power-user surface but is a header CTA rather than part of the IA.                                                 | Fold into `/do` as its top section.                                                                                                                                                                 |
| 8. Aesthetic and minimalist design         | D5: home page carries six blocks and ~19 destinations.                                                                                | §8.2.                                                                                                                                                                                               |
| 9. Help users recover from errors          | Error summary with focus management is already implemented correctly.                                                                 | Keep. Extend to the console and to the Studio's validation messages.                                                                                                                                |
| 10. Help and documentation                 | `helpSlot` on `PageHeader` implements WCAG 3.2.6 consistent help. Good, and underused: most pages pass nothing.                       | Make it mandatory in the page template. For officers: §6.4 and §7.5.                                                                                                                                |

### 8.2 Cognitive load, for readers and for officers

- **Intrinsic load** is the actual difficulty of the task: what a 90-day immigration report
  requires, what counts as harassment. Reduce it with Smart Answers and checklists, never by
  omitting the hard part.
- **Extraneous load** is what the design adds: nineteen home page choices, four kinds of box,
  a calendar loading for a reader who wants a shuttle time. This is the load 2.0 is
  responsible for, and cutting it is what §3.2 and §4.1 are for.
- **Germane load** is what the reader retains: after one visit a student should know that
  every BIRSA service works the same way, gives a reference, and can be checked.

The same three apply to officers, and this is the part usually forgotten. An officer's
intrinsic load is deciding what to publish. Their extraneous load is everything else: finding
the right document type, understanding drafts, remembering that Thai is required, knowing
which of two logins they need. §6.4's portfolio structure, §6.5's inline validation and §6.8's
single door all exist to cut that second number, because **an editing surface nobody can face
using is functionally the same as no editing surface**, and the site goes back to being
published by whoever is comfortable with git.

Concrete home page decisions for 2.0: at most four blocks. A short hero that says what BIRSA
is and offers one primary action. Top tasks, chosen from search-query and page-feedback data
rather than from committee preference, and editable without a developer. What is on, as three
items and a link. An emergency and service-status region that is usually empty. The month
calendar moves to `/whats-on`.

Jakob's law cuts against inventing here: students spend their time on other sites, and a
site that behaves like every other service site is a site they do not have to learn.

---

## 9. Accessibility and performance

WCAG 2.2 AA remains the floor, **and it applies to the Studio-facing work too**. Officers use
phones, some will use a screen reader, and an editing surface that fails them removes them from
the two-person rule as effectively as taking away their password.

The criteria that specifically bite in this rebuild:

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

Two additions specific to officer-generated pages. Every section type in the palette (4.6) is
axe-clean in isolation, asserted on `/design`, so a page assembled from them is accessible by
construction. And the schema forbids the ways an editor can break accessibility: no h1 in a
body, alt text required on any informative image, link text validated against "click here".

Sanity Studio's own accessibility is a property of the product rather than something this
project controls. Wave 0 should test it with a keyboard and a screen reader on the document
types officers use most, and record what it finds in `docs/ACCESSIBILITY-TESTING.md`. If
something is unusable, that is a finding for the committee about who can hold which grant, and
it is better known in advance.

Performance: `lighthouserc.js` budgets are **re-cut per template rather than tightened
globally**, because 2.0 pulls in two directions at once. Section 3.6 removes pages and section
8.2 removes the calendar from the home page, both of which take weight out. Section 4.7 adds
images, which puts weight in, and moves the LCP element on a news page from text to a
photograph. A single site-wide budget hides both movements. Per-template budgets with an
explicit image allowance make each one visible, and if removing the home page calendar does
not show up as a measurable drop, that is a finding.

The Studio route must be excluded from the public budgets and code-split so that not
one byte of it reaches a student's phone.

---

## 10. Content model and lifecycle

**Every document type carries the same lifecycle fields**, enforced in the schema:

- `status`: draft, scheduled, published, archived. Draft and published are native; scheduled
  is the scheduling feature; archived is ours, and it keeps a document out of the site without
  deleting the record.
- `publishAt`: for scheduled publication.
- `owner`: the portfolio that owns this document, from the committee structure. Required.
- `lastReviewed` and `reviewBy`: a date after which the document shows as stale in the
  Studio and appears on the owning portfolio's dashboard. Content that nobody will admit to
  owning is content nobody will dare to delete, and this is the field that prevents it.
- `slugHistory`: previous slugs, so renames redirect automatically (3.4).
- `maintainedBecause`: set only where section 3.6's delegation gate failed and BIRSA is keeping
  content that properly belongs to TUSU, TUSC or the faculty. It names the reason, and the
  review date is the trigger to delete the page once an authoritative source appears. Content
  carrying this field appears in a standing list, so the cull is a policy rather than an event.

**Bilingual parity is a publish-blocking validation**, not a review convention. A document
without both locales cannot leave draft. This is principle 14 and it is one validation rule.

**House style is validation too.** The rule set (no em dashes, sentence case, plain language,
no "click here") lives in one `lib/content/houseStyle.ts`, used by the Sanity validation, the
build check and any remaining git-authored content, so the three cannot disagree. The message
appears next to the field, in the editor's language.

**Alt text is parity-checked like body copy** (4.7C). An image without alt text in both locales
blocks publication, unless it is explicitly marked decorative, which is a choice the officer
has to make rather than a default they fall into.

**Content that a student's data depends on is validated against the code**, per the pattern in
6.3: the privacy register's nightly integrity check, the service registry's retention
requirement, the Smart Answers tree validation.

---

## 11. Delivery: parallel Sonnet subagent execution

This section is the operational half of the plan. The redesign is roughly 100 components, 120
routes, a CMS schema and a content migration, across two locales. Run sequentially it is very
long. Run naively in parallel it produces merge conflicts in exactly the files that matter
most, and a design system that fractured during its own construction.

### 11.1 The two rules that make parallelism safe

**Rule 1: contracts are frozen before any parallel work starts.**
Wave 0 is sequential, done by an Opus-class orchestrator, and produces the things every
later agent depends on: tokens, component API signatures as typed stubs, the route map, the
redirect table, the dictionary key skeleton, the service definition type, and the CMS schema
conventions. After Wave 0 these files are read-only to subagents. An agent that believes a
contract is wrong stops and reports; it does not edit. A contract change is an orchestrator
decision, applied once, before the next wave starts.

**Rule 2: every agent owns a disjoint set of file paths, exhaustively listed in its brief.**
Not "work on the news pages". A literal list of paths the agent may create or modify, and a
separate list it may read. Two agents never hold the same path in the same wave. If a wave
cannot be partitioned this way, the wave is wrong and needs splitting.

### 11.2 The contention problem, and the one refactor that fixes it

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

The CMS schema needs the same treatment for the same reason: `sanity/schemaTypes/<domain>.ts`,
one file per content domain, composed by a frozen index, so schema agents never share a file.

### 11.3 Wave 0: contracts (sequential, Opus, no subagents)

Nothing else starts until every item here is committed.

1. **Verify the three blocked fact sets** flagged at the top of this document: the GDS
   component and pattern indexes, Sanity's plan limits and pricing (6.11), and whether a Thai
   Studio interface bundle exists (6.4). Correct this document against what is found. The
   Sanity costing goes to the committee as a decision before any Sanity work starts.
2. Rewrite `docs/PROJECT-BRIEF.md` as `docs/BUILD-BRIEF-2.0.md`: correct fonts (Lexend, not
   Inter), correct environment, correct lib contracts, and a new "how to work as a subagent
   on this project" section. Every agent brief points at it. A wrong brief is a systematic
   bug, not a local one.
3. `components/bds/tokens.css` plus the generated TypeScript mirror, including the bilingual
   type scale from §4.2.
4. Component API stubs: every component in §4.3 as a typed, documented, non-implemented file.
   Props and TSDoc only. This is what lets a page agent in Wave 4 import a component a
   component agent in Wave 2 is still writing.
5. The dictionary split from §11.2.
6. `lib/services/defineService.ts` and `questionTypes.ts`: the service definition type and the
   question palette, unimplemented.
7. **CMS schema conventions**: the lifecycle field set (§10), the localisation strategy
   (document-level, shared slug, matching the site's existing slug-parity architecture), the
   validation helper signatures, and the section palette type (§4.6). Frozen.
8. **The image contract** (§4.7): the fixed aspect ratio set, the alt text and decorative
   schema shape, the source file size limit, and the per-template image budgets. Frozen,
   because every schema agent and every component agent depends on it.
9. **The scope audit** (§3.6), run to a decision: every document in `content/student-life/`,
   `/services/university-services` and the emergency scenarios assigned a level and a
   disposition, with the four-part delegation gate applied and the failures marked
   `maintainedBecause`. This is a committee judgement, not agent work, and it must land before
   Wave 5 rebuilds pages and Wave 6 migrates content, or both will do work on pages that are
   about to be deleted.
10. `lib/redirects.ts` and its test: the exhaustive 1.0-to-2.0 URL map from §3.4, including
    every redirect the scope audit creates.
11. The route map, as a checked-in document, listing every 2.0 route and which agent owns it.
12. Decide the two questions in §4.5 (cookie banner, phase banner) and confirm the Sanity
    project is created under `birsa@tu.ac.th` (§7.4), not under a student account.

### 11.4 Waves, agents and ownership

Model guidance: **Sonnet** implements inside a frozen contract, which is most of the work.
**Opus** does Wave 0, every wave boundary, and review of anything touching
`lib/inventory/auth.ts`, `content/privacy/register.ts`, `lib/privacy/retention.ts`, the
sensitive-service mode, or the welfare service. A subagent never makes an IA decision, a
privacy decision, or a contract change.

Practical concurrency cap: **four to six agents per wave**. The limit is not the machine, it
is how much diff one reviewer can hold in their head at a wave boundary.

Every agent runs with `isolation: "worktree"` so it has its own checkout, and merges to a
per-wave integration branch off `claude/website-2-redesign-plan-pifrc5`.

| Wave                      | Agents        | Each owns                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Gate to pass                                                                                                                                                  |
| ------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Foundations**        | 4             | A: type scale and colour utilities. B: layout primitives. C: icon sprite. D: test harness, `/design` skeleton, visual regression, `check:contrast`.                                                                                                                                                                                                                                                                                                                                                                                                         | `/design` renders, both locales, both themes, snapshots baseline.                                                                                             |
| **2. Component library**  | 6             | One agent per cluster, each owning its `components/bds/` files and its dictionary namespace: **forms**; **navigation**; **status**; **content**; **service UI** (task list, start page, check answers, confirmation, status lookup, exit this page); **media and section palette** (§4.7 image components plus §4.6's eleven officer-composable sections, which share the ratio contract and belong together).                                                                                                                                              | Every component on `/design`, axe clean, keyboard clean, 320px and 400% zoom clean, both locales. Gallery is keyboard operable and works with JavaScript off. |
| **3. Editorial platform** | 5             | A: Studio mount, `next-sanity` wiring, preview and draft mode. B: schema for editorial content (news, events, pages, guides, clubs). C: schema for organisational content (roster, minutes, decisions, budget, regulations). D: schema for configuration singletons, navigation, and the section palette types. E: validation library (bilingual parity, house style, link integrity) and the integrity crons.                                                                                                                                              | An officer can create, preview, validate, schedule and revert a page in both locales, with no developer.                                                      |
| **4. Service chassis**    | 4             | A: `lib/services/*` and the generic `/do/[service]` routes. B: equipment loan migrated onto the chassis, which is the proof it works. C: console lift from `officer/inventory/` to `officer/`, portfolio permissions, and the access register (§6.8). D: **lost and found** (§5.5) as the first service built on the chassis rather than migrated onto it, including the public listing, the CBEMS custody reuse, the withheld-detail claim check and the retention path. **Opus review required on C (auth) and on D's retention and photo-review paths.** | Loan service passes its existing e2e suite unchanged. Lost and found runs end to end, and cannot publish without its register entry and retention path.       |
| **5. Page rebuild**       | 6             | One agent per route family, each owning its `app/[lang]/…` subtree and its dictionary namespace: home and `/do` index; `/whats-on`; `/help`; `/studies`; `/about`; utility pages (privacy, standards, error pages, search, `/design` polish). The `/help` agent also builds the §3.6 signpost pages, which are a page type rather than a leftover.                                                                                                                                                                                                          | Redirect test green. a11y and progressive-enhancement suites green. No route family imports another's parts.                                                  |
| **6. Content migration**  | 5             | Scripted migration, one agent per content family: MDX to Portable Text; TypeScript content modules to documents; Smart Answers trees; curriculum; and **the §3.6 dispositions** (delete, signpost, absorb) with their redirects and the external link register seeded. Each writes a migration script, a verification script, and a rollback. **No agent hand-writes content, and no agent decides a disposition.**                                                                                                                                         | Every 1.0 content item is migrated, signposted or redirected, none 404s, and the diff report accounts for every file.                                         |
| **7. Copy and guidance**  | 2             | EN agent and TH agent, each owning its locale's dictionary namespaces, field descriptions, and the in-Studio guide. Never the same file. **Copy is authored natively per language, never machine translated**, per `docs/EDITING.md`.                                                                                                                                                                                                                                                                                                                       | Parity assertion compiles. House style passes. A human who reads Thai reviews the Thai.                                                                       |
| **8. Integration**        | 0, sequential | Orchestrator: full e2e, Lighthouse budgets, phase banners, redirect audit, `/design` completeness, and **the hardening acceptance test in §12, run by an actual officer rather than by an agent**.                                                                                                                                                                                                                                                                                                                                                          | Everything green, and §12 passes with a real person driving.                                                                                                  |

**Waves 3 and 4 can overlap**, since the schema work and the chassis work touch disjoint
paths, and **Wave 5 can start against Wave 2's frozen component APIs** before either lands, as
long as no page agent owns a `/do/` route. That overlap is where most of the wall-clock saving
comes from. Do not overlap Waves 1 and 2: a component built against an unfrozen type scale is
a component built twice. Do not start Wave 6 before Wave 3, for the obvious reason.

### 11.5 The agent brief template

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
   content/dictionaries/*/index.ts, sanity/schemaTypes/index.ts>

CONTRACTS YOU MUST NOT CHANGE
  Component prop signatures from the Wave 0 stubs.
  Token names. Route paths. Dictionary key structure.
  CMS schema conventions: lifecycle fields, localisation strategy,
  the section palette, the question palette.
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
  Putting personal data into a CMS schema (section 6.3), including any
  field that would hold a student submission or an operational upload.
  Adding a raw HTML, arbitrary embed, or custom CSS field to any
  schema (section 4.6).
  Adding an image field without required bilingual alt text and an
  explicit decorative flag (section 4.7C).
  Deleting or signposting any content. Dispositions come from the
  section 3.6 audit; execute the one you were given, and if a file is
  not on the list, STOP and report it.
  Touching lib/inventory/auth.ts, content/privacy/register.ts,
  or lib/privacy/retention.ts.

REPORT
  Files created or changed. Decisions taken. Contracts you wanted to change
  and did not. Anything you could not finish.
```

### 11.6 Integration protocol

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
6. From Wave 3 onward, every wave boundary also runs the relevant rows of §12.

### 11.7 What must never be parallelised

- Design tokens and the type scale. One agent, Wave 0, or the system fractures during
  construction.
- The IA and the route map. Decisions, not work.
- **The section 3.6 dispositions.** Which pages BIRSA stops publishing is a committee judgement
  about who serves students, and a subagent deciding it would be deleting BIRSA's content on
  its own authority. Agents execute dispositions; they never choose them.
- **The photography policy and the image contract.** Both are decisions with legal weight
  (4.7E) and both are depended on by every schema.
- The CMS schema conventions and the localisation strategy. One agent, Wave 0.
- `lib/inventory/auth.ts` and the permission model. Security-critical, Opus, reviewed.
- The privacy register, the retention paths, and the sensitive-service mode. One agent,
  reviewed by a human.
- The welfare service. Built last, alone, reviewed by someone other than its author.
- Thai copy. One agent, one voice, and a human who reads Thai signs it off. Two agents writing
  Thai produces two registers in one site, which readers notice even when reviewers do not.

---

## 12. The hardening acceptance test

This is the definition of done for the governing requirement, and it is the section to argue
with if you think the plan overclaims. **Every row is performed by an actual BIRSA officer, on
a phone, without a developer present and without opening a terminal.** An agent cannot pass
this test on BIRSA's behalf.

| #   | Task                                                  | Surface          | Passes when                                                |
| --- | ----------------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| 1   | Publish a news post in both languages                 | Studio           | Live within a minute, no deploy                            |
| 2   | Schedule a post for Friday                            | Studio           | Appears Friday, unattended                                 |
| 3   | Correct a typo on a live page and revert it           | Studio           | Both directions, no developer                              |
| 4   | Add an event to the activity calendar                 | Studio           | Appears on site and in the `.ics` feed                     |
| 5   | Replace the whole committee roster for a new year     | Studio           | 21 people, both languages, portraits                       |
| 6   | Add a brand-new page and put it in the navigation     | Studio           | Reachable, in nav, in search, in the sitemap               |
| 7   | Rename a page's slug                                  | Studio           | Old URL 301s automatically                                 |
| 8   | Reorder the home page top tasks                       | Studio           | No developer, no deploy                                    |
| 9   | Reorder the `/quick` links                            | Studio           | No developer                                               |
| 10  | Add a club to the directory                           | Studio           | Card, page, category, both languages                       |
| 11  | Publish a set of minutes and a decision               | Studio           | Appears on the transparency pages                          |
| 12  | Publish the budget against actual spend               | Studio           | The transparency placeholder is no longer a placeholder    |
| 13  | Edit a Smart Answers decision tree                    | Studio           | Validation blocks a broken tree before publish             |
| 14  | Publish a regulation document                         | Studio           | Second approver required and enforced                      |
| 15  | Try to publish English only                           | Studio           | **Blocked**, with a message in the editor's language       |
| 16  | Try to publish with an em dash                        | Studio           | **Blocked**, inline, fixable in five seconds               |
| 17  | Try to publish a link to nothing                      | Studio           | **Blocked**                                                |
| 18  | Create a new intake service with six questions        | Studio           | Live at `/do/<slug>` with reference, status and queue      |
| 19  | Try to create a service with no retention rule        | Studio           | **Blocked**                                                |
| 20  | Change a service's standard from 48 to 72 hours       | Studio           | Acknowledgement email and escalation both follow           |
| 21  | Open and close event sign-ups                         | Studio           | No developer                                               |
| 22  | Change contact routing for one category               | Studio           | Mail reaches the new portfolio                             |
| 23  | Turn a feature module off                             | Studio           | Site degrades cleanly, no error page                       |
| 24  | Turn on emergency mode                                | Console          | Live in seconds, no Vercel dashboard                       |
| 25  | Turn off emergency mode under pressure                | Console          | Two people can do it; both have done it once in practice   |
| 26  | Decide an equipment loan                              | Console          | Unchanged from 1.0                                         |
| 27  | Acknowledge and close a welfare case                  | Console          | Reference, timestamps, audit, no narrative in the store    |
| 28  | Approve a reimbursement claim with a receipt          | Console          | Photo in Blob, never in the CMS                            |
| 29  | Export feedback as CSV                                | Console          | Unchanged from 1.0                                         |
| 30  | Create a new officer account and grant a portfolio    | Console          | By the President, not by IT                                |
| 31  | See everything one person can access, in both systems | Console          | The access register, one page                              |
| 32  | Remove a graduating officer from everything           | Console + Studio | Both systems, from one checklist                           |
| 33  | Generate a portfolio handover pack                    | Console          | Printable, from live data                                  |
| 34  | Find out why a page will not publish                  | Studio           | The message says what to fix, not what failed              |
| 35  | Publish a news post with four event photographs       | Studio           | One upload each, no manual cropping, correct at every size |
| 36  | Try to publish a photograph with no Thai alt text     | Studio           | **Blocked**, with the reason                               |
| 37  | Mark a photograph decorative                          | Studio           | Alt field hides, renders `alt=""`, a deliberate choice     |
| 38  | Replace all 21 committee portraits for a new year     | Studio           | No commit, no file paths, subject stays centred            |
| 39  | Take down a photograph a student objects to           | Studio + Console | Gone from the live site in minutes, request recorded       |
| 40  | Report a lost item as an ordinary student             | Public           | Reference, acknowledgement, status page, no account        |
| 41  | Report a found item with a photograph                 | Public           | Not public until an officer reviews the photograph         |
| 42  | Try to hand in a found student ID card                | Public           | **Routed away**, no custody taken, told where to go        |
| 43  | Match a found item to a lost report and close both    | Console          | Withheld detail checked, both references resolved          |
| 44  | Change how long found items are held                  | Studio           | Configuration, and the cron follows the new number         |
| 45  | Let an unclaimed item age out                         | Console          | Custodian warned, record and photograph purged on time     |
| 46  | Retire a delegated page once TUSU publishes it        | Studio           | Deleted, old URL 301s, no 404                              |
| 47  | Find out that a link to TUSC has died                 | Console          | The cron found it before a student did                     |
| 48  | Do all of the above with the IT officer unreachable   | Both             | **The whole test**                                         |

Rows that remain code, deliberately and by §6.12: change the site's colours or typography, add
a new page section type, add a new question type, change a retention rule, mark a service
sensitive, change permissions logic. Anyone claiming this plan delivers "no code" should be
shown that list too.

---

## 13. Risks

| Risk                                                  | Why it is real here                                                                                                                                                                                                            | Mitigation                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sanity's recurring cost is not affordable             | 21 committee members, a student association budget, and pricing that could not be verified from this environment.                                                                                                              | §6.11 is a Wave 0 gate with a real number, before any Sanity work. An open "no" in June beats a discovery in November.                                                                                                                                                                                    |
| Granular per-portfolio roles need a higher tier       | Standard roles may not express "PR publishes news but not budgets".                                                                                                                                                            | §6.11's fallback: structure and validation express intent, the access register and audit log carry accountability. Stated openly.                                                                                                                                                                         |
| A hosted dependency where there was none              | The site currently builds and runs with no environment at all. That property is genuinely rare and worth protecting.                                                                                                           | §6.9 in full: cached reads, stale-over-absent, a committed content snapshot that is also a backup, and emergency mode kept out.                                                                                                                                                                           |
| Officers are given the keys and do not use them       | The commonest outcome. A CMS nobody opens leaves publishing with whoever is comfortable with git, which is the defect this plan exists to fix.                                                                                 | §6.4 portfolio structure, §7.5 training, §12 run by real officers, and the two-person rule so it is never one person's habit.                                                                                                                                                                             |
| Officers use them and the design fractures            | More pages, less context, no design training.                                                                                                                                                                                  | §4.6 constrained composition, with no raw HTML, embed or CSS escape hatch. The palette is finite by construction.                                                                                                                                                                                         |
| The MDX to Portable Text migration loses content      | Long-form guides, custom components, the table of contents, and the search index all read MDX today.                                                                                                                           | Wave 6 is scripted with a verification script and a rollback per family, and a diff report at the wave boundary.                                                                                                                                                                                          |
| The rebuild loses a working thing                     | 1.0 has five correct wizards, a working loan service and a passing a11y suite. Ground-up redesigns routinely regress exactly this kind of unglamorous correctness.                                                             | The existing e2e suites are the acceptance criteria and must pass unchanged. Loan-on-chassis is the proof.                                                                                                                                                                                                |
| The redesign never finishes                           | The commonest outcome for volunteer-run redesigns.                                                                                                                                                                             | Phase banners and route-family-sized waves. Every wave leaves a shippable site.                                                                                                                                                                                                                           |
| Contracts drift during parallel execution             | Twelve agents, one system.                                                                                                                                                                                                     | §11.1, and `/design` as the single place drift becomes visible.                                                                                                                                                                                                                                           |
| Thai quality degrades                                 | Thai is the default locale and the harder half, and the half most likely to be quietly machine-translated under time pressure. Now also the language the Studio must work in.                                                  | §11.7. Native authoring is a hard rule; the parity assertion catches absence but not badness, so human review is the control.                                                                                                                                                                             |
| Personal data leaks into the CMS                      | Someone will eventually think a welfare case is "content".                                                                                                                                                                     | §6.3 as a stated boundary, in the agent brief's forbidden list, and enforced by the schema having nowhere to put it.                                                                                                                                                                                      |
| A published photograph exposes a student              | Photographs of identifiable students are personal data, most first-years are minors, and the register deliberately avoids relying on consent. A found-item photograph can show an ID card, a name in a book, or a lock screen. | §4.7E in full: an event photography activity in the register, a photography notice, wide shots by default, no names in alt text, and a takedown route measured in days. §5.5: no found-item photograph is public before an officer reviews it, and identity-document categories get no photograph at all. |
| Images make the site slow, and it is noticed late     | A text-only site adding images is the classic way a performance budget quietly dies, and the LCP element on a news page moves from text to a photograph.                                                                       | Per-template budgets with an explicit image allowance (§9), a source file size limit at upload, `priority` on the hero only, and the transform pipeline doing format and size negotiation rather than the officer.                                                                                        |
| Images turn a text-forward identity into a photo blog | Images are the fun part, and the cream-editorial identity is carried by typography and whitespace.                                                                                                                             | §4.7A as design rules rather than taste: fixed ratios, no text over images, full-bleed rare and deliberate, captions in the muted tone.                                                                                                                                                                   |
| Delegation strands students in a void                 | §3.6 removes pages on the assumption that TUSU, TUSC or the faculty publishes the same thing. If they do not, or do so only in one language, the student is worse off than before.                                             | The four-part gate, and `maintainedBecause` on every failure so the content stays and is labelled. Delegation is refused by default, not granted by default.                                                                                                                                              |
| The delegated site decays into dead links             | Trading forty pages for forty external links trades a maintenance burden for a decay problem, and untended that is worse in two years than what it replaced.                                                                   | The external link register as a content type, checked on the daily cron, with a fortnight's dead link escalating to the owning portfolio.                                                                                                                                                                 |
| BIRSA is treated as the lost property office          | A well-built service looks official, and a student will eventually hand over a passport.                                                                                                                                       | §5.5: categories routed away at the point of reporting, no custody taken, and the start page names where the university's own lost property is.                                                                                                                                                           |

---

## 14. How this interlocks with the capability roadmap

The roadmap's phases and this plan's waves are not competing; one is what BIRSA does and the
other is what the site becomes.

**One explicit supersession.** Roadmap section 4C recommends "C now, B for the five
fast-moving content types once C proves what people actually edit, A alongside B", where C is
the GitHub issue form flow. Under the hardening requirement at the top of this document, C is
no longer a destination. It remains valuable as a **bridge**: it can start this month, it costs
almost nothing, and it removes the developer from news publishing while Waves 0 to 3 run. It
is explicitly retired the day the Studio ships, and the retirement is a task with a date, not
an intention. The roadmap's warning about a git-backed CMS ("swaps one piece of infrastructure
knowledge for another") is what Sanity's in-repo Studio avoids, and it is the reason this plan
does not propose Decap.

The rest of the interlock:

- **Roadmap Phase 0** (account custody, second and third admin, the runbook) has no dependency
  on any of this and should happen now, by people rather than by agents. It is the cheapest
  and most important thing in either document. Add the Sanity project to its custody checklist
  before the project is created, not after.
- **Roadmap Phase 1** (publishing without git) is now delivered in two steps: the bridge flow
  immediately, then Wave 3. Emergency mode moving to a console page happens in Wave 4 and does
  not wait for the CMS.
- **Roadmap Phase 2** (intake that remembers) should wait for Wave 4, because that is what the
  chassis is for. Building it first means building it twice.
- **Roadmap Phases 3, 4 and 5** are largely absorbed. Phase 3's draft and scheduled states are
  Sanity features rather than a build. Phase 4's transparency pages become content their
  owners publish. Phase 5's portfolio depth becomes service definitions and documents.

Recommended reading: do roadmap Phase 0 and the bridge flow immediately and by hand, settle
the §6.11 costing, then run Waves 0 to 8. After that, most of the roadmap is something BIRSA
does rather than something anyone builds.

---

## 15. Decisions needed before Wave 0

1. **Is the Sanity cost acceptable?** §6.11. This is the first question and the plan does not
   proceed past Wave 0 without a real number and a committee answer. If the answer is no, say
   so and adopt the bridge flow permanently, with the governing requirement knowingly unmet.
2. **Is the IA in §3.2 right?** It is the decision every later wave depends on, and it is a
   decision about students, not about code. Test it with ten students and a card sort before
   Wave 0 ends. This is the highest-value hour in the whole plan.
3. **Is the identity kept?** This plan assumes cream-editorial on BIR red survives, and spends
   the budget on structure instead. A visual rebrand is a different and larger Wave 1.
4. **Cookie banner: required or not?** §4.5. A factual PDPA question with a permanent
   consequence for every visitor.
5. **Will BIRSA ship visible beta banners?** §4.5.
6. **Does BIRSA hold welfare case records at all, or only timestamps and a status?** Roadmap
   question 3, unchanged. Both are defensible; deciding by accident is not.
7. **Who holds which grant, and who is the second holder of each?** §7.1 and §7.2. The
   President's decision, and it must be made before the Studio exists rather than after.
8. **Who reviews Thai copy, and who is the second Studio administrator?** Named people, not
   "the committee". Without these two names, §11.7's control and §7.2's rule do not exist.
9. **Which pages does BIRSA stop publishing?** §3.6, run to a decision before Wave 5. This is
   the committee deciding what it is for, and it is the item most likely to be deferred because
   deleting your predecessors' work feels like a judgement on them. It is not. It is the
   difference between a site a volunteer committee can maintain and one it cannot.
10. **Will BIRSA adopt a photography policy?** §4.7E. Publishing photographs of students is a
    standing commitment to a notice at events, a takedown route with a real service standard,
    and a default of wide shots. If the committee will not run that, the honest answer is to
    keep images for things rather than people, which is a smaller but still worthwhile change.
11. **How long are found items held, and where do they go afterwards?** §5.5. A number and a
    destination, agreed with the faculty office, before the service launches rather than the
    first time something valuable goes unclaimed.
