# Manual assistive technology testing checklist

Internal developer documentation. This is not published to the site; it is
the practical checklist a human with the right hardware and software runs
through to produce the evidence the public accessibility statement
(`app/[lang]/standards/page.tsx`) currently says we do not yet have.

## Why this exists

The GOV.UK Service Manual page "accessibility for developers: an
introduction" states that automated tools alone are not sufficient and that a
service must be manually tested, and that testing must repeat every time a
feature is added once the service is in public beta. The companion page
"testing with assistive technologies" lists the minimum combinations a
service must be tested with before public beta.

Nothing in this repository can run JAWS, NVDA, VoiceOver, TalkBack or
Dragon. Nobody in a CI pipeline can either. This checklist exists so that
when a person with that hardware runs the tests below, the result gets
recorded somewhere real, and the accessibility statement can then cite an
actual date, tester and outcome instead of a vague assurance.

Do not fill in a row in the record table below unless the test in that row
was genuinely run. An empty row is honest; a fabricated one is not.

## What automated coverage already does, and does not, replace

`tests/e2e/a11y.spec.ts` runs axe-core against every page template below, in
both languages and both colour themes. `tests/e2e/keyboard.spec.ts` drives
header navigation, the language and theme toggles, the accordion component,
a confirm dialog, and one full form journey using a keyboard only, and
checks focus visibility, focus trapping and `aria-expanded` state.

Neither suite tells you what a screen reader actually announces, whether the
announced order makes sense, whether a screen magnifier user can still tell
what is selected at 400% zoom, or whether Dragon's "click <label>" voice
commands land on the control you meant. That is what this checklist is for.

## Required combinations

Test with at least all of the following before public beta, and again
whenever a feature significant enough to change page structure, a form, or
an interactive component ships afterwards:

| # | Assistive technology | Browser | Minimum version |
|---|---|---|---|
| 1 | JAWS | Chrome or Edge | JAWS 2019 or later |
| 2 | NVDA | Chrome, Firefox or Edge | latest |
| 3 | VoiceOver (iOS) | Safari | latest iOS, latest Safari |
| 4 | TalkBack | Chrome | latest |
| 5 | Windows Magnifier or Apple Zoom | any browser | at least 4x magnification |
| 6 | Dragon | Chrome | Dragon 15 or later |

## What to check on every combination

Regardless of which row you are running, cover all of the following on each
page template you test:

- **Read every element and heading.** Confirm headings are announced at the
  right level, in a sensible order, and that no content is silently skipped
  (images with meaningful content, icons that are not `aria-hidden`, status
  messages).
- **Tab through every link and control.** Confirm the reading/interaction
  order matches the visual order, nothing is skipped, and nothing traps
  focus.
- **Check every landmark.** Header, main, navigation, footer and any region
  landmarks should all be announced and let you jump directly to them.
- **Confirm form labels, hints and errors are all announced**, not just
  visually shown, and that submitting an invalid form moves you to a
  description of what to fix.
- **Confirm dynamic updates are announced** (loading states, success/error
  messages, the emergency banner if it is active) without you having to go
  looking for them.

Extra checks specific to certain rows:

- **Screen readers (JAWS, NVDA, VoiceOver, TalkBack):** every item above,
  plus: table headers are associated with their cells on the regulations
  long-form pages; the accordion's expanded/collapsed state is announced;
  the confirm-dialog's title is announced when it opens and focus returns to
  the control that opened it when it closes.
- **Screen magnifiers (Magnifier, Zoom), at 4x minimum:** text and controls
  stay legible with no clipped or overlapping content; focus and the
  magnified viewport stay in sync as you tab; the mobile-style menu (if it
  appears at the zoomed effective width) still opens and closes correctly.
- **Dragon:** every visible label works as a "click <label>" voice command;
  every form field can be filled by voice ("Click <field>", dictate, "Click
  <next field>"); no control depends on a mouse-only gesture (drag, hover) to
  operate.

## Page templates to cover

This list is the `pages` array in `tests/e2e/a11y.spec.ts` (the same set the
automated axe sweep already covers), so manual coverage and automated
coverage stay aligned; if that array changes, update this list to match.
Test each in English; re-test the Thai equivalent (swap `/en/` for `/th/`)
at least once per assistive-technology row, since Thai script and the
Sarabun font are a different rendering case from Latin script.

Priority order (test these first; they carry the most user risk):

1. **Forms**: `/en/contact` (and its focused error-summary behaviour),
   `/en/clubs/start`, `/en/services/equipment-loan/status`,
   `/en/answers/you`.
2. **Smart Answers journey**: `/en/answers`, `/en/answers/activity-approval`,
   `/en/answers/activity-approval/q`, `/en/answers/start/q`,
   `/en/answers/settle-in/q?p=international.starting`.
3. **Equipment loan journey**: `/en/services/equipment-loan`,
   `/en/services/equipment-loan/directory`,
   `/en/services/equipment-loan/status`.
4. **Regulations long-form documents**: `/en/activity/regulations`,
   `/en/activity/regulations/university-2563`.
5. **Officer console sign-in**: `/en/officer/inventory`,
   `/en/officer/inventory/custodians` (unauthenticated: this exercises the
   sign-in form only; the authenticated screens behind it are covered at
   component level by `tests/unit/inventory-a11y.test.tsx`, not here).

Remaining templates (test at least once per screen-reader row and once per
magnifier row; lower priority than the above):

```
/                                                        (home)
/quick
/search
/privacy
/news
/news/welcome-bir-batch-18
/activity
/activity/birsa
/activity/roles
/activity/contact
/clubs
/clubs/tu-mun
/clubs/bir-mock-fund
/student-life
/student-life/getting-started
/student-life/getting-started/international
/student-life/getting-started/home
/student-life/home
/student-life/international
/student-life/international/visa-and-immigration
/student-life/home/food-and-budgeting
/student-life/home/places-nearby           (OSM tile map with anchor markers)
/student-life/course-reviews
/student-life/course-reviews/PI121
/services
/emergency
/standards                                 (this statement itself)
this-page-does-not-exist                   (404 page)
```

## Recording the result

Add one row per test session, however small. "Ran NVDA over the contact
form for ten minutes" is a valid, useful row; do not wait for a full pass
before recording anything.

| Date | Tester | AT + version | Browser + OS | Pages/journey covered | Result | Issues found (link) |
|---|---|---|---|---|---|---|
| | | | | | | |

Result is one of: **Pass** (no barrier found), **Fail** (a barrier was
found; link the issue), **Partial** (some pages covered, not all; note
which), or **Blocked** (could not complete, note why).

Once a row in this table has a real date, tester and result, that
combination's coverage can be cited by name in the "how we test" section of
the accessibility statement. Until then, the statement should keep saying
this testing has not yet been done, because that is the truth.
