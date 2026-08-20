# BIRSA Portal 2.0: route map

`REDESIGN-2.0.md` §11.3 item 11: "the route map, as a checked-in document, listing every 2.0
route and which agent owns it."

This is a **contract and an ownership partition**, not a plan. §11.7 lists "the IA and the
route map" among the things that must never be parallelised: they are decisions, not work. No
subagent adds, moves or renames a route. An agent that needs a route that is not here STOPS
and reports.

The partition is the whole reason parallel execution is safe (Rule 2, §11.2): **two agents
never hold the same path in the same wave.** Every path below belongs to exactly one owner.

---

## The five primary destinations (§3.2)

Each named for a job a student is trying to do. If a heading names a committee portfolio, it
is wrong (§2 principle 1).

| Nav item         | Route       | What lives here                                                                  |
| ---------------- | ----------- | -------------------------------------------------------------------------------- |
| **Do something** | `/do`       | Every service, grouped by need                                                   |
| **Get help**     | `/help`     | Smart Answers, guides, the rules, reporting, welfare, international support      |
| **What's on**    | `/whats-on` | News, events, the calendar, clubs, sport fixtures                                |
| **Your studies** | `/studies`  | Study plan, course reviews, curriculum, academic issues, electives               |
| **About BIRSA**  | `/about`    | Committee, commitments, minutes, decisions, budget, elections, portfolio contact |

Utilities, never nav items and always reachable: search (header), the language toggle, the
theme toggle, the emergency banner, `/contact`, `/privacy`, `/standards`, `/officer`, and
`/design`.

---

## Ownership

Every route is prefixed `/[lang]`. Owners are wave and agent, from §11.4.

### Wave 5A: home and `/do` index

| Route | Notes                                                                                                                                                                                                                                                                                                                                                              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`   | **At most four blocks** (§8.2): a short hero with one primary action; top tasks; what's on as three items and a link; an emergency and service status region that is usually empty. The month calendar moves to `/whats-on`. Top tasks are chosen from search-query and page-feedback data rather than committee preference, and are editable without a developer. |
| `/do` | Services grouped by need: get help, borrow something, apply for money, sign up, tell us something. `/quick` folds in as its top section.                                                                                                                                                                                                                           |

### Wave 4A: the service chassis routes

Generic, driven by a service definition. **No Wave 5 page agent owns a `/do/` route** (§11.4).

| Route                   | Notes                                 |
| ----------------------- | ------------------------------------- |
| `/do/[service]`         | Start page (§5.1 item 1)              |
| `/do/[service]/[step]`  | Question pages, one thing per page    |
| `/do/[service]/check`   | Check answers                         |
| `/do/[service]/confirm` | Confirmation panel with the reference |
| `/do/[service]/status`  | Reference lookup, no account          |

### Wave 4B: equipment loan, migrated onto the chassis

`/do/equipment-loan/**`. The proof the chassis works. **Its existing e2e suite must pass
unchanged** (§11.4 gate): keeps its own availability logic and the exclusion constraint from
`007_btree_gist_exclude.sql`, which room booking later reuses because a room is an item with a
calendar.

### Wave 4D: lost and found (§5.5)

The first service built **on** the chassis rather than migrated onto it, and the one that
proves it. Gated on decision 11 in `docs/DECISIONS-2.0.md`.

| Route                       | Notes                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/do/lost-and-found`        | Browse and search what has been handed in. Anyone, no account. **Filters on campus**: an item lost at Rangsit and held at Tha Prachan is useless to whoever lost it |
| `/do/lost-and-found/lost`   | Report something lost                                                                                                                                               |
| `/do/lost-and-found/found`  | Report something found. Routes identity documents and anything of real value AWAY, taking no custody                                                                |
| `/do/lost-and-found/status` | Reference lookup, both directions                                                                                                                                   |

### Wave 4C: the officer console

The shell lifts from `app/[lang]/officer/inventory/` to `app/[lang]/officer/`, and permissions
name portfolios and verbs rather than `admin | inventory_manager | loan_officer | read_only`
(D6). **Opus review required: this touches `lib/inventory/auth.ts`.**

`/officer`, `/officer/access` (the single access register, §6.8), `/officer/inventory/**`,
`/officer/emergency` (the Edge Config switch, moved onto a console page so nobody needs Vercel
dashboard access to raise a banner).

### Wave 5B: `/whats-on`

`/whats-on`, `/whats-on/news`, `/whats-on/news/[slug]`, `/whats-on/events`, `/whats-on/calendar`
(the month calendar, moved off the home page), `/whats-on/clubs`, `/whats-on/clubs/[slug]`,
`/whats-on/sport`.

### Wave 5C: `/help`

`/help`, `/help/answers`, `/help/answers/[topic]`, `/help/answers/[topic]/q`, `/help/answers/you`,
`/help/regulations`, `/help/regulations/[doc]`, `/help/guides/**`, `/help/international/**`,
`/help/getting-started/**`, `/help/university-services`, `/help/reporting`, `/help/welfare`.

This agent also builds the **§3.6 signpost pages**, which are a page type rather than a
leftover: the one BIR-specific thing worth saying, the named body that owns the rest, and a
link. A signpost is a service, and a good one is more useful than the copy it replaces. What
it must never be is a page of bare links with no editorial judgement.

`/help/reporting` and `/help/welfare` carry **ExitThisPage** and an **InterruptionPage**, and
carry **no PageFeedback**: §2 principle 3 forbids instrumenting the pages where being observed
is the reason someone does not report.

### Wave 5D: `/studies`

`/studies`, `/studies/study-plan/**`, `/studies/course-reviews`, `/studies/course-reviews/[code]`,
`/studies/handbook/**`, `/studies/curriculum`, `/studies/academic-issues`.

### Wave 5E: `/about`

`/about`, `/about/roles`, `/about/committee`, `/about/minutes`, `/about/decisions`,
`/about/budget`, `/about/commitments`, `/about/elections`.

§4.3b's `contact-a-department-or-service-team` is the pattern behind routing by category to
the right portfolio rather than one shared inbox.

### Wave 5F: utilities

`/contact/**`, `/privacy/**`, `/standards`, `/search`, `/emergency/**`, `/feedback/**`,
`not-found`, `error`, and `/design` polish.

### Wave 1D and Wave 2: `/design`

The public reference page (§4.1). Renders every component in `components/bds/manifest.ts` in
both locales, both themes, at 320px and at 400% zoom, from the same source as the components
so it cannot drift. Wave 1D builds the skeleton and the visual regression harness; each Wave 2
cluster agent adds its own components' entries and no others.

`/design` is also **excluded from the public Lighthouse budgets and code-split**, along with
the Studio route, so that not one byte of either reaches a student's phone (§9).

---

## Routes that do not move

`/contact`, `/emergency`, `/feedback`, `/privacy`, `/standards`, `/search`, `/officer`. §3.2
keeps them as utilities. Their URLs are in the footer of every page and in the privacy notice,
so moving one is a broken link in a legal document.

---

## Every 1.0 route reaches a 2.0 one

`lib/redirects.ts` is the map and `tests/unit/redirects.test.ts` is the gate: it walks the 1.0
sitemap, generated from the same content loaders the pages use, and asserts every path either
stays put or resolves into a route family above.

**No URL that works today may stop working.** BIRSA's links live in Instagram bios and printed
orientation packs that nobody can edit. A deleted page is a redirect, always.
