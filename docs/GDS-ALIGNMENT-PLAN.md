# Bringing the BIRSA Portal into line with GDS guidance

This plan compares the site with the whole of the UK Government Digital Service (GDS) guidance on
building websites and services, and sets out the work needed to close the gaps.

It was researched on 24 September 2026 from the primary sources, which are all reachable from
this environment now (the earlier egress block noted in `docs/REDESIGN-2.0.md` has gone). Every
rule quoted below was read from the live page, not remembered. Sources are listed in the appendix.

Read it alongside `docs/REDESIGN-2.0.md`. That document plans a larger rebuild (CMS, service
chassis, new information architecture). This one is narrower: it is the list of things the site
does today that GDS guidance says to do differently, and most of it can ship on the current
architecture without waiting for 2.0. Where the two overlap, this plan says so rather than
repeating it.

---

## 1. The guidance, in full

GDS publishes five bodies of guidance. Between them they cover everything from why a page exists
to how its focus ring is drawn.

| Body                                | What it governs                                            | Where it lives now                                  |
| ----------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Government Design Principles        | The values every decision is tested against (11 of them)   | gov.uk/guidance/government-design-principles        |
| Service Standard                    | 14 points a service must meet to pass an assessment        | gov.uk/service-manual/service-standard              |
| Service Manual                      | How to meet the Standard: research, design, tech, data     | gov.uk/service-manual                               |
| GOV.UK Design System                | Styles, 35+ components and 30+ patterns, with research     | design-system.service.gov.uk (GOV.UK Frontend 6.5)  |
| GOV.UK content and publishing guide | Writing guidelines, the A to Z style guide, content upkeep | guidance.publishing.service.gov.uk (since May 2026) |

### 1.1 Government Design Principles

There are now **eleven**, not ten. On 2 April 2025 GDS added a new eleventh principle,
**"Minimise environmental impact"**. `docs/REDESIGN-2.0.md` section 2 lists ten and needs the
eleventh adding.

1. Start with user needs
2. Do less
3. Design with data
4. Do the hard work to make it simple
5. Iterate. Then iterate again
6. This is for everyone
7. Understand context
8. Build digital services, not websites
9. Be consistent, not uniform
10. Make things open: it makes things better
11. Minimise environmental impact

### 1.2 The Service Standard

1. Understand users and their needs
2. Solve a whole problem for users
3. Provide a joined up experience across all channels
4. Make the service simple to use
5. Make sure everyone can use the service
6. Have a multidisciplinary team
7. Use agile ways of working
8. Iterate and improve frequently
9. Create a secure service which protects users' privacy (now names Secure by Design)
10. Define what success looks like and publish performance data
11. Choose the right tools and technology (now names AI and total cost of ownership)
12. Make new source code open
13. Use and contribute to open standards, common components and patterns
14. Operate a reliable service (now includes monitoring outcomes and bias, not just faults)

### 1.3 The Service Manual, the parts that bear on a website

- **Design.** One thing per page. A question protocol for every question. Name services as verbs
  in users' words ("Register to vote", not "Individual Electoral Registration"). No dead ends. Easy
  to reach a human. Do not show internal structures to users. Writing for user interfaces: aim to
  be boring, no "please", no humour in errors, "sorry" only when the service has actually broken.
- **Accessibility.** WCAG 2.2 AA is the floor. Automated and manual testing, then testing with
  specific assistive technology (the six combinations in section 4.9), then an expert audit.
  Publish an accessibility statement and review it.
- **Technology.** Progressive enhancement is mandatory: services must work with HTML alone, CSS
  must not depend on JavaScript. Test in the February 2026 browser list. HTTPS with HSTS. No
  CAPTCHAs unless there is evidence nothing else works. Cookies minimised, `Secure` and
  `HttpOnly`. Performance budget set early and kept. Monitoring, uptime, dependency management,
  vulnerability testing.
- **Measuring success.** Define the service's purpose in a line, derive benefits and hypotheses,
  pick 3 or 4 KPIs. Completion rate needs a unique URL per step and a defined end page. Collect
  satisfaction at the end of every journey. For non-transactional websites, run usability
  benchmarking (the same 5 tasks, repeated over time).
- **Agile and live running.** Iterate in beta, keep a plan for continuous improvement once live,
  and retire things properly when the need goes away.

### 1.4 The Design System, what changed in the last 18 months

- **Brand refresh (June 2025) and the non-GOV.UK rule (9 July 2026).** A site that is not on
  GOV.UK must not identify as GOV.UK, use the crown or GOV.UK logotype, use GDS Transport, suggest
  it is a government website, **or use the GOV.UK brand colours**. The last clause was added in
  July 2026. The patterns and code may still be used freely.
- **Generic header (Frontend 6.3, June 2026)** for services that are not on GOV.UK: own logo, own
  font, no navigation links in the header, navigation goes in Service navigation beneath it.
- **Updated type scale (Frontend 6.0, February 2026).** Body text is 19px on every screen size.
  16px is the smallest step on the scale; the old 14px step was removed. Headings grew on small
  screens.
- **Language navigation (trial, Frontend 6.5, August 2026).** For bilingual services: native
  language names, a `lang` attribute on each option, a translated landmark label, one consistent
  placement, and no loss of entered data when switching language.
- **Feedback component (trial, Frontend 6.5).** A feedback prompt just above the footer on every
  page, separated from the phase banner, saying why feedback is wanted and what happens to it.
- **Interruption panel and pattern (Frontend 6.4, July 2026).** A way to pause a journey for one
  important message, used sparingly.
- Components and patterns this site's journeys touch most: Back link, Breadcrumbs, Button, Error
  summary, Error message, Summary list, Notification banner, Inset text, Warning text, Details,
  Accordion, Tag, Task list, Pagination, Panel, Exit this page; Question pages, Check answers,
  Confirmation pages, Validation, Start using a service, Page not found, There is a problem with
  the service, Service unavailable, Contact a department, Cookies page, Exit a page quickly,
  Names, Email addresses, Phone numbers, Dates.

### 1.5 Content and publishing guidance

Moved to its own site in May 2026. The rules most relevant here:

- Every page meets a recorded user need ("As a…, I need to…, so that…").
- Titles 65 characters or fewer, unique, no content type in the title, not questions.
- Summaries 160 characters or fewer, active, ending in a full stop.
- Headings descriptive, front-loaded, not questions (content pages; question pages in a service
  are the exception).
- Links in context, never "click here", never a "Further reading" dump, say when a link leaves the
  site or goes to another language.
- Plain English is mandatory. No negative contractions (can't, don't). No "eg", "etc", "ie". No
  FAQs. No semicolons. Sentences over 25 words get checked. Bold only for interface elements. No
  italics. "to" in ranges, not dashes.
- Translations go on their own page, never mixed into the English page.
- Content is kept current or deliberately retired (withdrawn with an explanation, or unpublished
  with a redirect). Significant changes get a specific, public change note.

### 1.6 What applies to BIRSA, and what does not

BIRSA is a student association, not a public body, and the site is not on a gov.uk domain. So:

- **Must not** look like GOV.UK. This was already the house rule in `docs/PROJECT-BRIEF.md`; it is
  now also GDS's own rule, and it is stricter than before (brand colours included).
- **Should** follow the principles, the Service Standard in spirit, the Design System's patterns
  and behaviour, and the content guidance. That is what this plan is about.
- **Does not need** service assessments, publishing KPIs to data.gov.uk, the Open Government
  Licence, or the Public Sector Bodies Accessibility Regulations. Each has a proportionate
  substitute in section 5.

---

## 2. What the site already does well

Credit where it is due, so nobody undoes it by accident. Against the guidance above, the site
already has:

- one-question-per-page journeys with check-answers steps, back links and a draft cookie that
  works with JavaScript off (`components/forms/`, `docs/REDESIGN-2.0.md` 1.1)
- server-side validation with `noValidate`, an error summary headed "There is a problem" that
  takes focus and links to each field, and inline errors tied by `aria-describedby`
- Smart Answers with honest "not covered" outcomes (the Check a service is suitable pattern)
- progressive enhancement enforced by `tests/e2e/progressive-enhancement.spec.ts`
- axe and keyboard suites across Chromium, Firefox and WebKit, in both languages and themes
- a Lighthouse performance budget (`lighthouserc.js`) wired into CI
- HSTS with preload, a static CSP, a nonce CSP on officer routes, `nosniff`, `DENY` framing
- honeypots and rate limits instead of CAPTCHAs
- cookieless analytics and a cookies page that lists every cookie and storage key
- change links with hidden context ("Change full name"), native `<details>` accordions
- a report-a-problem link above the footer on every page, consistent help placement
- titles and descriptions fitted to 60 and 160 characters (`lib/seo.ts`)
- a voluntary accessibility statement that is candid about the lack of assistive technology testing

The gaps below are real, but they are gaps in a site that is already closer to GDS practice than
most.

---

## 3. Gap analysis

Each gap cites the rule, the evidence in this repository, and the fix. Priorities are **P1**
(accessibility or trust defect, do first), **P2** (clear divergence from a pattern), **P3**
(polish or process).

### 3.1 Identity

| #   | Gap                                                                                                                                                                                                                                | Evidence                                                                                                   | Fix                                                                                                                                                                 | P   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| I1  | The GOV.UK focus colours (`#fd0` yellow, `#0b0c0c` bar) are used on some links. Since July 2026 non-GOV.UK sites must not use GOV.UK brand colours, and the site now has two different focus styles, which is itself inconsistent. | `app/globals.css` `.focus-highlight`; used in `NavList.tsx`, `FeaturedRail.tsx`, `OpenHouseExperience.tsx` | Design one BIRSA focus style that meets WCAG 1.4.11 and 2.4.7 on every surface (the ink ring already does on most), apply it everywhere, delete `.focus-highlight`. | P2  |
| I2  | Copy says the accessibility statement is "modelled on the one the UK Government Digital Service asks its services to publish". Fine as attribution, but nothing on the site should read as an endorsement.                         | `app/[lang]/standards/page.tsx`                                                                            | Keep the attribution, phrase it as "follows the structure of", and never use GOV.UK names, crowns or wording in chrome.                                             | P3  |

### 3.2 Layout and typography

| #   | Gap                                                                                                                                                                                                 | Evidence                                                            | Fix                                                                                                                                                                                                                      | P   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| T1  | Body text is 17px. GOV.UK moved to 19px on every screen in Frontend 6 because research showed it improved legibility on small screens. This is a legibility rule, not a brand one, so it applies.   | `app/globals.css` `.prose` and body `font-size: 1.0625rem`          | Move body copy to 19px (1.1875rem) with a 25px-equivalent line height for English. Thai needs its own line height (Sarabun's tall stacks); fold this into the one bilingual type scale proposed in `REDESIGN-2.0.md` D7. | P2  |
| T2  | Form labels, hints, error messages, summary-list values and the back link are 14px (`text-sm`). GOV.UK labels are 19px; nothing on its scale is below 16px.                                         | `components/Field.tsx`, `forms/SummaryRow.tsx`, `forms/StepNav.tsx` | Labels and legends at body size or larger; hints and errors at body size; nothing interactive below 16px.                                                                                                                | P1  |
| T3  | 50 uses of `text-xs` (12px), including the footer copyright and tags.                                                                                                                               | `grep -r text-xs components app`                                    | Raise the floor to 16px. Where space is tight, cut words rather than shrink type.                                                                                                                                        | P2  |
| T4  | Uppercase, letter-spaced footer headings. GOV.UK style avoids block capitals, which are harder to read and are read letter by letter by some screen readers.                                        | `components/Footer.tsx`                                             | Sentence case, normal tracking.                                                                                                                                                                                          | P3  |
| T5  | Sticky header 64px tall. At 400% zoom a sticky bar can cover the focused element (WCAG 2.4.11), and GOV.UK deliberately avoids sticky chrome. `scroll-padding-top` only helps anchors, not tabbing. | `components/Header.tsx` `sticky top-0`                              | Make the header static below a height breakpoint or at high zoom (a `max-height` media query), or static everywhere. Add a keyboard test at 400% that asserts the focused element is never under the header.             | P1  |
| T6  | Answers on check-answers pages are shown in muted grey, the questions in bold ink. GOV.UK shows both in the text colour; the answer is the thing being checked.                                     | `components/forms/SummaryRow.tsx`                                   | Answers in `text-ink`.                                                                                                                                                                                                   | P3  |

### 3.3 Header, navigation and language

| #   | Gap                                                                                                                                                                                                                                                             | Evidence                                                                           | Fix                                                                                                                                                                                                                                                                                          | P   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| N1  | Other-language text carries no `lang` attribute anywhere except `<html>`. The Thai "ภาษาไทย" on English pages, Thai terms inside English Smart Answers ("คกร.", "กกต.ร."), and English names on Thai pages are all mispronounced by screen readers. WCAG 3.1.2. | Only `lang=` in the codebase is on `<html>`                                        | A `<Lang code="th">` inline component, exposed to MDX. Use it in the language toggle and wherever a term from the other language appears. Add a unit test that fails on Thai script inside an `en` string without a wrapper.                                                                 | P1  |
| N2  | The language toggle shows only the other language, with a globe icon. The Language navigation component shows both, marks the current one, uses native names, and labels the landmark in the page's language.                                                   | `components/LanguageToggle.tsx`                                                    | Render a small `<nav aria-label="Language">` (Thai: "ภาษา") with "English" and "ไทย", current marked `aria-current="true"`, each with its own `lang`, and hidden text "Change the language to English" written in the target language. Keep the existing cookie and query-string carry-over. | P2  |
| N3  | The header carries logo, 4 nav links, search, theme toggle, a "Quick actions" button, the language toggle and a menu button. The Generic header pattern keeps the header to identity and moves navigation and tools into a service navigation row beneath.      | `components/Header.tsx`                                                            | Split into a brand row (logo, name, language) and a navigation row (sections, search). Decide whether "Quick actions" needs to be a header button at all; the home page already carries top tasks.                                                                                           | P2  |
| N4  | Back links render after the page `<h1>`. GOV.UK puts the back link at the very top of the content area, before the heading, so it is the first thing reached.                                                                                                   | `app/[lang]/contact/email/page.tsx`, `components/forms/StepNav.tsx` (all journeys) | Give `PageHeader` a `before` slot and move the back link into it. Style it as a link with a left chevron, not an arrow character in text.                                                                                                                                                    | P2  |
| N5  | Section names. "BIRSA activity" is named after the organisation, not a task.                                                                                                                                                                                    | `content/dictionaries/en.ts` `nav`                                                 | Already covered by `REDESIGN-2.0.md` section 3. Do not duplicate; adopt its outcome.                                                                                                                                                                                                         | P2  |

### 3.4 Question pages and journeys

| #   | Gap                                                                                                                                                                                                                      | Evidence                                                                          | Fix                                                                                                                                                                                                                                   | P   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| Q1  | Every step of a journey has the same `<title>` ("Contact BIRSA") and the description repeats the title. Page titles must be unique and should name the question. On a validation error the title should start "Error: ". | `generateMetadata` in each step page, e.g. `app/[lang]/contact/email/page.tsx`    | Title each step with its question plus the journey name ("What is your email address? · Contact BIRSA"). Prefix "Error: " / "ข้อผิดพลาด: " when the step re-renders with an error. A test that every step route has a distinct title. | P1  |
| Q2  | Required fields are marked "(required)". The Design System says never mark mandatory fields; mark only optional ones with "(optional)".                                                                                  | `components/Field.tsx`, `requiredLabel` passed by every step                      | Drop `requiredLabel`. Keep `optionalLabel`.                                                                                                                                                                                           | P2  |
| Q3  | The field is `autoFocus`ed. GOV.UK does not autofocus inputs; it moves focus only to the error summary after a failed submit. Autofocus skips the heading and hint for screen reader users.                              | `components/forms/QuestionStepForm.tsx`                                           | Remove `autoFocus`.                                                                                                                                                                                                                   | P1  |
| Q4  | The `<h1>` and the field label are separate, with the label visually hidden. The pattern makes the label (or legend) the page heading, so the question is said once.                                                     | `QuestionStepForm.tsx` `className="sr-only-label"`, `PageHeader`                  | Support "label is heading": render `<h1><label for=…>` inside the form and skip `PageHeader` on question pages. Visually identical; announced once.                                                                                   | P2  |
| Q5  | Inline error messages lack the visually hidden "Error:" prefix that tells screen reader users the text is an error.                                                                                                      | `components/Field.tsx`                                                            | Add `<span class="sr-only">Error:</span>` (Thai "ข้อผิดพลาด:") before each message.                                                                                                                                                   | P1  |
| Q6  | The submit button is disabled while pending. The Button guidance says avoid disabled buttons; prevent double submission instead.                                                                                         | `QuestionStepForm.tsx` `disabled={isPending}`                                     | Keep the button enabled, ignore repeat submissions while pending (`aria-disabled` plus a guard), keep the "Continuing" text as a status.                                                                                              | P2  |
| Q7  | Confirmation pages. The pattern requires a reference number, what happens next and when, contact details, likely next links, a feedback link, and a way to keep a record.                                                | `contact`, `clubs/start`, `privacy/your-data/sent`, equipment loan confirmations  | Audit each end page against that list. The loan flow is closest; bring the others up to it. Add a "Tell us what you thought of this service" link on every end page (feeds 3.9).                                                      | P2  |
| Q8  | Name and email fields lack `spellcheck="false"` (autocomplete is already set).                                                                                                                                           | Step pages for name and email across journeys                                     | Add per the Names and Email addresses patterns.                                                                                                                                                                                       | P3  |
| Q9  | Service start pages. Each service should open with what it does, who it is for, what you need, roughly how long it takes, other ways to do it, and a start button (a link styled as a button).                           | `services/equipment-loan/page.tsx`, `services/study-plan/page.tsx`, `clubs/start` | Write start pages to that checklist. This is also the shape the service chassis in `REDESIGN-2.0.md` section 5 should enforce.                                                                                                        | P2  |
| Q10 | Service names are nouns ("Equipment loan", "Study plan"). The Service Manual says name services as verbs in users' words.                                                                                                | Nav and page titles                                                               | "Borrow equipment", "Plan your studies", "Start a club", "Get your personal data". Keep URLs stable with redirects if slugs change.                                                                                                   | P3  |

### 3.5 Links

| #   | Gap                                                                                                                                                                                                                                                       | Evidence                                                                                                                              | Fix                                                                                                                                                                                                        | P   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| L1  | Every external link opens a new tab. GOV.UK says avoid new tabs, and when one is needed, the words "opens in new tab" belong in the visible link text. Here the warning is only hidden text plus an arrow icon, so sighted users get no warning in words. | `components/ExternalLink.tsx`; also `study-plan/cannot-help`, `study-plan/curriculum`, `course-reviews/[code]`, `OpenHouseExperience` | Open external links in the same tab by default. Keep new tabs only where leaving would lose entered data (mid-journey), and then show "(opens in new tab)" visibly. Update the rule in `PROJECT-BRIEF.md`. | P2  |
| L2  | Links to other-language pages do not say so.                                                                                                                                                                                                              | External links from English pages to Thai-only university sites (not yet counted)                                                     | Append "(in Thai)" / "(ภาษาอังกฤษ)" when the destination is in the other language.                                                                                                                         | P3  |

### 3.6 Error, status and interruption pages

| #   | Gap                                                                                                                                                                                                                 | Evidence                                                         | Fix                                                                                                                                                                                                                                                                                                                       | P   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| E1  | The 404 heading is "We cannot find that page" and the page shows five buttons. The pattern is heading "Page not found", a short "check the address" paragraph, a contact route, no breadcrumbs, no wall of buttons. | `app/[lang]/not-found.tsx`, `app/not-found.tsx`, `dict.notFound` | Rewrite to the pattern. One link to the home page and one to search, as links not buttons.                                                                                                                                                                                                                                | P2  |
| E2  | The 500 heading says "with this page"; the pattern is "Sorry, there is a problem with the service", "Try again later", and what happened to any answers the user was entering.                                      | `app/[lang]/error.tsx`, `app/global-error.tsx`                   | Rewrite to the pattern, including the draft-cookie fact ("We have saved your answers for 30 minutes").                                                                                                                                                                                                                    | P3  |
| E3  | There is no "Service unavailable" page. When the loan service is closed (holidays, stocktake) or a form is switched off, users hit a generic page or a dead end.                                                    | No shutter route                                                 | A per-service "Sorry, the service is unavailable" page that says when it reopens and what to do meanwhile, switched on from Edge Config like the emergency banner.                                                                                                                                                        | P2  |
| E4  | The emergency banner and the site announcement can show at once. Notification banner guidance: one banner per page, the highest priority wins.                                                                      | `app/[lang]/layout.tsx` renders both                             | Suppress `SiteAnnouncement` while an emergency is active.                                                                                                                                                                                                                                                                 | P2  |
| E5  | Pages about harassment, abuse and welfare reporting have no quick exit. Exit this page is the pattern for exactly these topics.                                                                                     | `components/ReportHarassment.tsx` and the pages that embed it    | Build an Exit this page button (own styling, same behaviour: button plus secondary skip link, Shift three times, loading overlay, destination a neutral site) and the short interruption and safety pages the pattern requires. Research with welfare officers first: the guidance warns the button can deter some users. | P2  |

### 3.7 Components, used the way the research says

| #   | Gap                                                                                                                                                            | Evidence                                                                              | Fix                                                                                                                                                                                         | P   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| C1  | `Notice` does the jobs of four GOV.UK components (inset text, warning text, notification banner, success panel) with no written rule for which variant to use. | `components/Notice.tsx`, `REDESIGN-2.0.md` D4                                         | Split or document variants to match: inset (aside), warning (consequence of an action), notification (not about this page, one per page, before the `<h1>`), panel (end of a journey only). | P2  |
| C2  | Accordions are used on content pages. The guidance: only with evidence, never for content everyone needs, test the page without one first.                     | 6 files use `<Accordion>` or `<details>`                                              | Review each use. Keep Details for "only some readers need this"; turn the rest into headings.                                                                                               | P3  |
| C3  | Icon-led quick actions. The guidance says avoid icons in most cases; always pair with a text label; never use one icon for two things.                         | `components/quick/QuickIcon.tsx`, `FeaturedRail.tsx`                                  | Keep labels primary. Audit for any icon doing double duty.                                                                                                                                  | P3  |
| C4  | Two ways back on some pages (breadcrumbs and a back link). The guidance says never both.                                                                       | `contact/page.tsx`, `clubs/start/page.tsx`, `equipment-loan/status/page.tsx` use both | Breadcrumbs on content pages, back links in journeys, never both. Add a lint or test.                                                                                                       | P3  |
| C5  | Placeholder text in search boxes. Acceptable only as a supplement; never the only label and never carrying instructions.                                       | `SearchBox.tsx`, `HeaderSearch.tsx`, `ClubsExplorer.tsx`, `CourseCombobox.tsx`        | Confirm each has a visible or programmatic label and that no hint lives only in the placeholder.                                                                                            | P3  |

### 3.8 Content

| #   | Gap                                                                                                                                                                                                                       | Evidence                                                                                  | Fix                                                                                                                                                                                                                            | P   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| W1  | `docs/NEWS-STYLE.md` applies GOV.UK standards to news only. The rest of the English content has no binding style guide.                                                                                                   | `docs/EDITING.md` "Voice and language" is guidance, not the A to Z                        | Adopt the GOV.UK A to Z for all English content, with a short list of recorded BIRSA exceptions (the no-colon rule, Thai terms). Move the shared rules out of `NEWS-STYLE.md` into one `docs/STYLE.md`.                        | P2  |
| W2  | About 20 negative contractions in English content (can't, don't, doesn't, isn't).                                                                                                                                         | `content/student-life/en/handbook/academic-life.mdx`, `content/smart-answers/topics/*.ts` | Replace with "cannot", "do not" and so on. Add a unit test over English strings, like the existing content tests.                                                                                                              | P2  |
| W3  | No automated style checks outside news.                                                                                                                                                                                   | `tests/unit/content.test.ts`                                                              | One content-lint test for English: negative contractions, "eg", "etc", "ie", "click here", semicolons, "please", exclamation marks, dashes in ranges, sentences over 25 words (warning only).                                  | P2  |
| W4  | Titles and descriptions are cut with an ellipsis when too long. GOV.UK asks for titles written to 65 characters and summaries to 160, ending in a full stop, not truncated.                                               | `lib/seo.ts` `fitTitle`, `cutAtWord`                                                      | Keep the fitter as a safety net, but make the build warn (test fails in CI) when any page needs truncating, so the copy gets rewritten.                                                                                        | P3  |
| W5  | Thai register is inconsistent. The brief says write to the reader as "คุณ"; the cookies and privacy pages use formal "ท่าน" and legal phrasing. GOV.UK's rule, applied to Thai: plain, direct, the same voice everywhere. | `app/[lang]/privacy/cookies/page.tsx` Thai copy                                           | A Thai plain-language pass over privacy, cookies and standards pages, using the voice in `PROJECT-BRIEF.md`. Record Thai equivalents of the A to Z rules (dates, times, numbers) in `docs/STYLE.md`.                           | P2  |
| W6  | No record of the user need behind each page, and no owner or review date (`REDESIGN-2.0.md` D8).                                                                                                                          | Frontmatter schemas in `lib/content.ts`                                                   | Add `userNeed`, `owner` (portfolio, not person) and `reviewBy` to frontmatter. A monthly cron lists pages past review. This is the GOV.UK content lifecycle scaled to a committee that turns over each June.                   | P2  |
| W7  | No change notes. When a fact that affects what students do changes (a fee, a deadline, a procedure), there is no public note of what changed.                                                                             | News and guides                                                                           | Optional `changes` list in frontmatter, rendered as "Last updated 24 September 2026: the deadline moved to 3 October". Specific, never "Page updated".                                                                         | P3  |
| W8  | Retiring content. Old news and past events stay live with nothing to say they are out of date.                                                                                                                            | `content/news/`                                                                           | Adopt withdraw and unpublish: a `withdrawn` flag that keeps the page, adds a banner explaining why and drops it from search and listings; unpublish only with a redirect. Pairs with the scope audit in `REDESIGN-2.0.md` 3.6. | P3  |

### 3.9 Accessibility assurance

| #   | Gap                                                                                                                                                                                           | Evidence                                                         | Fix                                                                                                                                                                                                                                                         | P   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| A1  | No assistive technology testing has been done. The statement says so honestly. The six combinations are already written down in `docs/ACCESSIBILITY-TESTING.md` and match the Service Manual. | `app/[lang]/standards/page.tsx`, `docs/ACCESSIBILITY-TESTING.md` | Run the matrix. NVDA, VoiceOver and TalkBack are free; Windows Magnifier and Apple Zoom are built in. JAWS has a 40-minute demo mode. Dragon is the hard one: borrow it from the university disability service or record it as untested.                    | P1  |
| A2  | The accessibility statement is an anchor inside `/standards`. GOV.UK practice is a dedicated page linked from every footer, with a fixed structure.                                           | `components/Footer.tsx` links to `/standards#accessibility`      | Move it to `/accessibility`. Sections: who runs the site, how accessible it is, what to do if you cannot use part of it (with a response time), reporting problems, compliance status, non-accessible content, how we tested, preparation and review dates. | P2  |
| A3  | No expert audit. The Service Manual requires one before public beta for government services.                                                                                                  | None                                                             | Ask Thammasat's disability support unit or a volunteer practitioner for a sample-based review: home page, one content page, one question page, check answers, search, the officer console login. Record the result in the statement.                        | P3  |
| A4  | Research has not included disabled students.                                                                                                                                                  | None recorded                                                    | Recruit through the university disability service for each usability round (section 3.11). Pay expenses.                                                                                                                                                    | P2  |
| A5  | A 400% zoom and sticky-header check is missing from the keyboard suite.                                                                                                                       | `tests/e2e/keyboard.spec.ts`                                     | Add it with T5.                                                                                                                                                                                                                                             | P1  |

### 3.10 Technology, security and sustainability

| #   | Gap                                                                                                                                                                                                                                                                                                                                 | Evidence                                      | Fix                                                                                                                                                                                            | P   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| X1  | The Playwright projects cover desktop Chrome, Firefox, Safari and a Pixel. The February 2026 list adds iOS Safari (most students' phones), Edge and Samsung Internet.                                                                                                                                                               | `playwright.config.ts`                        | Add a `Mobile Safari` (iPhone) project. Edge is Chromium and Samsung Internet cannot be automated, so cover both with a manual check per release, recorded in `docs/ACCESSIBILITY-TESTING.md`. | P2  |
| X2  | No `/.well-known/security.txt`. Secure by Design and NCSC both expect a published route for reporting vulnerabilities.                                                                                                                                                                                                              | `public/`                                     | Add `security.txt` with a contact address, expiry and preferred languages (en, th). Review each June at handover.                                                                              | P2  |
| X3  | Server errors are only `console.error`ed; there is no uptime monitoring or alert, and no status page. Point 14 asks for monitoring with a proportionate response plan.                                                                                                                                                              | `app/[lang]/error.tsx`, no monitor configured | Vercel log drains or runtime error alerts to the IT officer and one deputy; a free external uptime check on `/`, `/en/services/equipment-loan` and `/api/search`; a one-page runbook.          | P2  |
| X4  | No licence. Point 12 asks for open source code under a clear licence, and the site's footer already says it is built in the open.                                                                                                                                                                                                   | No `LICENSE` file                             | Committee decision: MIT for code, and a separate note that content and photographs are not openly licensed (they are personal data in part).                                                   | P3  |
| X5  | Script weight is 194KB against a 200KB budget, and the budget was raised twice. The eleventh principle and the frontend performance guidance both say cut, not raise.                                                                                                                                                               | `lighthouserc.js` comment                     | Find what the shared chunks contain, move client components to server where possible, and lower the budget back towards 150KB.                                                                 | P3  |
| X6  | Four web font families (Fraunces, Lexend in 4 weights, Sarabun in 4 weights, JenjrusVris). Each is bytes and energy on every first visit.                                                                                                                                                                                           | `app/[lang]/layout.tsx`                       | Drop to the weights actually rendered. Check whether Lexend 500 and Sarabun 500 are used; subset JenjrusVris.                                                                                  | P3  |
| X7  | Cookie categorisation. The language and theme preferences are described as strictly necessary. GOV.UK's cookies page pattern calls "remembering settings" functional. Because they are set only when the user chooses, the ICO position arguably allows them without consent, but the page should say which reasoning it relies on. | `app/[lang]/privacy/cookies/page.tsx`         | Re-check every entry against the Design System categories and name the reasoning for the two preference items. Confirm the bus tracker's localStorage key is listed.                           | P3  |

### 3.11 Measuring success and research

| #   | Gap                                                                                                                                                    | Evidence                        | Fix                                                                                                                                                                                                                                                                         | P   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| M1  | No stated purpose, benefits or KPIs for any service. `/standards` promises statistics "once the site has launched".                                    | `app/[lang]/standards/page.tsx` | For each service, one line of purpose and 3 or 4 KPIs. Completion rate (unique URL per step already exists, so starts and end pages can be counted in Vercel Analytics without personal data), satisfaction from the end-page feedback link, and time to outcome for loans. | P2  |
| M2  | Satisfaction is not collected at the end of journeys.                                                                                                  | End pages                       | The end-page link from Q7 goes to the existing `/feedback` form with the service pre-selected.                                                                                                                                                                              | P2  |
| M3  | No usability benchmarking for the content site.                                                                                                        | None                            | Five fixed tasks (find the next event, borrow a projector, check a graduation rule, contact the welfare officer, find a club), run with 10 or more students each semester, same tasks each time, results published on `/standards`.                                         | P3  |
| M4  | No phase signal. The accessibility statement mentions "before we leave beta", but the site shows no phase anywhere (`REDESIGN-2.0.md` D9).             | Header                          | Decide: either a BIRSA-styled "New service" label on services that are still changing, with the feedback prompt beside it, or drop beta language entirely. Do not use the GOV.UK phase banner look.                                                                         | P3  |
| M5  | Instrumentation must stop at welfare and complaints pages (roadmap section 6). This is consistent with GOV.UK's "do not collect what you do not need". | Analytics is site-wide          | Exclude those routes from Vercel Analytics with `beforeSend`.                                                                                                                                                                                                               | P2  |

---

## 4. Delivery

Four phases. Each item names its gap numbers so progress can be checked against section 3. The
phases are sized for volunteer time; nothing here needs new infrastructure.

### Phase 0. Decisions (taken 24 September 2026)

| Question                     | Decision                                                                                                                                     | Gaps   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| GOV.UK A to Z for English    | Binding for all English content, with recorded BIRSA exceptions, enforced by a content lint test                                             | W1, W3 |
| External links               | Same tab. New tab only mid-journey where leaving would lose answers, with "(opens in new tab)" visible                                       | L1     |
| Header                       | Two rows: brand row (logo, name, language) and navigation row (sections, search). Quick actions and theme toggle stay, in the navigation row | N3     |
| Phase signal                 | No label. Remove the "beta" wording from the accessibility statement                                                                         | M4     |
| Licence                      | MIT for code only. Content and photographs are not openly licensed                                                                           | X4     |
| Exit this page               | Build it now, in Phase 2. Brief the welfare officers on how it works before it goes live                                                     | E5     |
| Thai register on legal pages | Keep ท่าน on privacy and cookies pages as a recorded exception. คุณ everywhere else                                                          | W5     |

### Phase 1. Accessibility and trust fixes (P1 items)

1. **Done.** Thai runs on English pages are tagged `lang="th"` automatically: a rehype plugin for
   MDX and `langRuns()` for Smart Answers and regulations (`lib/lang-runs.tsx`). The language
   toggle's accessible name is written in, and tagged with, the target language (N1).
2. **Done.** Every step of the contact, start a club, your data and loan request journeys has its
   own title via `stepTitle()` in `lib/seo.ts`. The error summary prefixes the title with
   "Error: " (with JavaScript only; a no-JavaScript submit keeps the plain title) (Q1).
3. **Done.** `autoFocus` removed from question steps; `components/ErrorMessage.tsx` adds the
   hidden "Error:" prefix in the message's language (Q3, Q5).
4. **Done.** Form labels, hints, errors, summary-list rows and back links now use body size.
   Answers on check-answers pages are in the text colour (T2, T6).
5. **Done.** The header is sticky only on screens at least 32rem tall, with a 400% zoom test
   (T5, A5).
6. **Outstanding.** Run the assistive technology matrix and publish results in the statement
   (A1). This needs people and devices, not code.

Done when: `npm run test` and the e2e suites pass with the new tests, and the statement's
"How we tested" section names every combination that was run.

### Phase 2. Patterns (P2 items)

All twelve items are built. What remains is marked **Outstanding**.

1. **Done.** `.focus-highlight` deleted; every link uses the ink focus ring (I1).
2. **Done.** Body text 19px, nothing below 16px, via the Tailwind scale in `@theme`. Thai
   heading leading still sits outside the scale; folding it in is `REDESIGN-2.0.md` D7 (T1, T3).
3. **Done.** Two-row header (brand and language, then sections and tools) and
   `components/LanguageNav.tsx` (N2, N3).
4. **Done.** Back link and "Step n of m" caption in `PageHeader`, before the heading; the heading
   labels the field; no required markers; buttons ignore repeat presses instead of disabling.
   **Outstanding:** the contact and start a club entry pages still combine the start page with the
   first question under breadcrumbs (N4, Q2, Q4, Q6, C4).
5. **Done.** `/contact/sent`, `/clubs/start/sent` and `request/sent?ref=` confirmation pages
   with next steps, contact details and a feedback form. Loan and study plan start pages already
   met the start page checklist (Q7, Q9, M2).
6. **Done.** `ExternalLink` opens in the same tab and says "external site" (L1).
7. **Done.** Page not found and problem-with-the-service pages rewritten; one banner at a
   time; services can be closed from Edge Config (`closures`) (E1, E2, E3, E4).
8. **Done.** `Notice` documents which GOV.UK component each variant stands for (C1).
9. **Done.** `/accessibility`, in the order of the GOV.UK sample statement (A2).
10. **Done in code:** `security.txt`, an iPhone Safari Playwright project,
    `docs/OPERATIONS.md`. **Outstanding:** set up the uptime check and the 5xx alert in
    association-owned accounts (X1, X2, X3).
11. **Done.** Analytics skips welfare, safety, complaint and data-request pages;
    `docs/SERVICE-MEASURES.md` gives each service a purpose and measures (M1, M5).
12. **Done.** `components/ExitThisPage.tsx` on pages flagged `exitThisPage: true` (the safety
    guide and the covert photography notice) and on `/staying-safe-online`. Shift three times
    exits. It is one Tab after the skip link rather than having GOV.UK's secondary skip link.
    **Outstanding:** walk the welfare officers through it before it matters (E5).

### Phase 3. Content (runs alongside Phase 2)

1. `docs/STYLE.md` with the A to Z rules, Thai equivalents and the ท่าน exception for legal pages (W1, W5).
2. English content lint test, then fix what it finds, starting with contractions (W2, W3).
3. Thai plain-language pass on privacy, cookies and standards, keeping ท่าน on the legal pages (W5).
4. `userNeed`, `owner`, `reviewBy` in frontmatter, and the review cron (W6).
5. Title and summary rewrites where the fitter truncates (W4).
6. Change notes and withdrawal (W7, W8).

### Phase 4. Assurance and continuous improvement (P3 items and ongoing)

1. Expert review, recorded in the statement (A3).
2. Usability benchmark each semester, including disabled students (M3, A4).
3. Accordion, icon and breadcrumb audits (C2, C3, C4, C5).
4. Script and font diet, lower the budget (X5, X6).
5. Service names as verbs, with redirects (Q10).
6. Remaining polish (I2, T4, T6, Q8, L2, E2, X7, M4).

### Keeping it aligned

- Add a GDS checklist to the pull request template: user need stated; one thing per page; unique
  title; no required markers; errors per the pattern; links in the same tab; `lang` on
  other-language text; English passes the content lint; tested with keyboard and one screen reader.
- Check the Design System "What's new" page and the content guidance "What's new" page each
  semester. Both change monthly; this plan was written against GOV.UK Frontend 6.5.0.
- Review the accessibility statement each June at handover, as it already promises.

---

## 5. Deliberate divergences

These are choices, recorded so nobody later "fixes" them into GOV.UK copies.

- **No GOV.UK Frontend package.** Its CSS carries GOV.UK's identity, which a non-government site
  must not use, and the site's Tailwind tokens and Thai typography would fight it. Port behaviour
  (character count, exit this page, error summary focus) into BIRSA components; do not import
  styles.
- **BIRSA's own colours, type and logo** (cream, BIR red, Fraunces, Lexend, Sarabun,
  JenjrusVris). Required by GDS's own non-GOV.UK rule.
- **No colons in news titles** (`docs/NEWS-STYLE.md`), where the A to Z allows a colon to break a
  long title. A stricter house rule, not a conflict.
- **Service assessments** are replaced by the pull request checklist and the semester benchmark.
- **Publishing KPIs to data.gov.uk** is replaced by publishing them on `/standards`.
- **Open Government Licence** does not apply; see X4.
- **Welsh-language scheme** has a natural equivalent: every page exists in Thai and English with
  identical slugs, enforced by tests. Keep it.

---

## 6. Documents this plan changes

- `docs/REDESIGN-2.0.md` section 2: add the eleventh principle, "Minimise environmental impact",
  with its local obligation (the script and font budgets in X5 and X6).
- `docs/PROJECT-BRIEF.md`: the external-link rule (new tab plus hidden text) conflicts with L1;
  the font list still names Inter (already flagged in `REDESIGN-2.0.md` 1.3).
- `docs/EDITING.md` and `docs/NEWS-STYLE.md`: point to the new `docs/STYLE.md` once it exists.
- `docs/ACCESSIBILITY-TESTING.md`: add the February 2026 browser list and the 400% sticky check.

---

## Appendix. Sources read

Government Design Principles, updated 2 April 2025.
https://www.gov.uk/guidance/government-design-principles

Service Standard, all 14 points. https://www.gov.uk/service-manual/service-standard

Service Manual guides read in full, among them:

- Making your service look like GOV.UK (updated 9 July 2026)
- Making your service accessible, Understanding WCAG 2.2, Testing for accessibility, Testing with
  assistive technologies, Getting an accessibility audit
- Using progressive enhancement, Designing for different browsers and devices (February 2026
  list), How to test frontend performance, Using HTTPS, Working with cookies, Using CAPTCHAs,
  Vulnerability and penetration testing
- Writing for user interfaces, Designing good questions, Form structure, Naming your service,
  Scoping your service, Making your service more inclusive, Environmentally sustainable services,
  Collecting personal information, Sending emails and text messages
- Measuring success (all guides), How the beta and live phases work, Retiring your service,
  Running your service in a sustainable way

GOV.UK Design System, every style, component and pattern page, plus Get started (focus states,
labels as headings, new type scale, extending components), the accessibility strategy, the
roadmap and What's new to August 2026 (GOV.UK Frontend 6.5.0).
https://design-system.service.gov.uk

GOV.UK content and publishing guidance: all writing guidelines, all planning and managing pages,
the A to Z and technical A to Z style guides, text formatting, images, videos, news articles,
detailed guides, withdrawing and unpublishing, and What's new to August 2026.
https://guidance.publishing.service.gov.uk
