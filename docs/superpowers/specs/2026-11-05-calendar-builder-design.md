# Calendar builder service

## Goal

Replace the front page's month grid with a lighter "coming up" section and add a service,
**Build your calendar** (`/[lang]/services/calendar`), where a student chooses which BIR dates
they want, optionally adds their own class times, and puts the result in the calendar app they
already use, with instructions for every major device and app.

## Principles applied

- **One task per step, progressive disclosure.** Three numbered steps on one page: choose
  dates, add class times (optional, collapsed until asked for), add to your calendar. Never
  more than one decision visible as the primary focus.
- **Recognition over recall.** Category cards show a count and the next upcoming example.
  The device guide preselects the visitor's likely platform from the user agent after mount,
  and the visitor can change it.
- **Visibility of system status.** A live preview lists exactly what will appear, grouped by
  month, and updates as choices change. A summary line ("23 dates and 4 weekly classes")
  sits beside the main action.
- **Sensible defaults.** BIRSA activities, holidays and closures, and registration dates are
  on by default. Class times are off until the student adds one.
- **Error prevention and recovery.** Class times validate inline (end after start, a day
  chosen, a course chosen) with the site's `ErrorSummary`/`Field` patterns. Removing a class
  is undoable for a few seconds or confirmed.
- **Subscribe first, download second.** A subscription keeps updating as BIRSA adds dates; a
  downloaded file does not. The UI says this in one sentence, not a paragraph.
- **Privacy by construction.** Nothing is stored on the server. Choices live in the browser
  (`localStorage`, wrapped in try/catch) and in the feed link's query string.
- **Accessible.** WCAG 2.2 AA, keyboard reachable, visible focus, no information by colour
  alone, `prefers-reduced-motion` respected, works with JavaScript off (falls back to the
  full public feed links and the written guides).

## Categories

| id             | Label (en)                             | Source                                             |
| -------------- | -------------------------------------- | -------------------------------------------------- |
| `birsa`        | BIRSA activities                       | `kind: "birsa"`                                    |
| `holidays`     | University days, holidays and closures | `kind: "university"` without `academic`            |
| `registration` | Registration and add-drop              | events with `academic`                             |
| `classes`      | My class times                         | the student's own entries, weekly through the term |

Defaults: `birsa`, `holidays`, `registration`.

## Data changes

- `content/calendar/events.ts`: add optional `noClasses?: true` to events whose title says
  there are no classes (holidays and the Songkran closure in semester 2/2569). Used to skip
  class occurrences on those days.
- New `content/calendar/terms.ts`: teaching terms with known dates.

  ```ts
  export type TeachingTerm = { term: AcademicTerm; start: string; end: string; source: SourceId };
  export const teachingTerms: TeachingTerm[] = [
    {
      term: { year: 2569, semester: 2 },
      start: "2027-01-04",
      end: "2027-05-01",
      source: "courseOffering2026S2",
    },
  ];
  export function currentOrNextTeachingTerm(todayKey: string): TeachingTerm | null;
  ```

  Only terms with published dates are listed. No dates are invented. When none is current or
  upcoming, the class times step explains that the term dates are not published yet and hides
  the form.

## Library (`lib/calendar-builder/`)

- `selection.ts`
  - `CategoryId = "birsa" | "holidays" | "registration" | "classes"`, `CATEGORY_IDS`,
    `DEFAULT_CATEGORIES`.
  - `ClassSlot = { code: string; day: 1..7 (Mon=1); start: "HH:MM"; end: "HH:MM"; place?: string }`.
  - `Selection = { categories: CategoryId[]; term: string ("2569-2"); classes: ClassSlot[] }`.
  - `MAX_CLASSES = 20`, `MAX_PLACE_LENGTH = 40`.
  - `validateClassSlot(slot): ClassSlotError[]` (codes: `code-missing`, `code-invalid`,
    `day-missing`, `start-invalid`, `end-invalid`, `end-before-start`, `place-too-long`).
  - `eventsForCategories(events, categories): CalendarEvent[]`.
  - `encodeSelection(selection): URLSearchParams` and `decodeSelection(params): Selection`.
    Query shape: `inc=birsa,holidays` `term=2569-2` and repeated `c=PI271~1~0930~1220~Room 301`.
    Decoding is total: unknown categories, malformed slots and anything past `MAX_CLASSES`
    are dropped, never thrown.
  - `feedPath(locale, selection)` returns `/${locale}/my-calendar.ics?…`.
- `feed.ts`
  - `buildCustomIcs(selection, locale, { siteUrl, todayKey? })` composes all-day events from
    the chosen categories with weekly timed events for classes.
  - Class events: `DTSTART;TZID=Asia/Bangkok` on the first matching weekday on or after the
    term start; `RRULE:FREQ=WEEKLY;UNTIL=<term end 23:59:59 Bangkok in UTC, Z form>`;
    `EXDATE;TZID=Asia/Bangkok` for each `noClasses` day that falls on that weekday inside the
    term; `SUMMARY` is `PI271 Course title` from the curriculum when known, else the code;
    `LOCATION` is `place`; `UID` is `class-<term>-<code>-<day>-<start>@host` so a re-subscribed
    feed updates the same events rather than duplicating them.
  - Includes one `VTIMEZONE` for `Asia/Bangkok` (fixed +0700) when any timed event exists.
  - Reuses `escapeIcsText`, `foldIcsLine` and the all-day logic in `lib/ics.ts`, refactored
    as needed but keeping `buildIcs` behaviour and its tests unchanged.
- `links.ts` builds the per-app action links from the https feed URL:
  - `webcal://…` for Apple Calendar (iOS, iPadOS, macOS) and classic Outlook.
  - Google Calendar: `https://calendar.google.com/calendar/render?cid=<encoded webcal url>`.
  - Outlook on the web and new Outlook:
    `https://outlook.live.com/calendar/0/addfromweb?url=<encoded https url>&name=<encoded name>`,
    and the same on `outlook.office.com` for work and school accounts.
  - Download: the same URL with `download=1`, which the route serves as an attachment.

## Feed route

`app/[lang]/my-calendar.ics/route.ts`. Dynamic (reads the query). Validates `lang`, decodes
the selection, returns `text/calendar`. `Cache-Control: public, max-age=3600,
s-maxage=3600, stale-while-revalidate=86400`. `download=1` switches `Content-Disposition` to
`attachment; filename="bir-calendar-<locale>.ics"`. An empty selection still returns a valid,
empty calendar (so a subscription never breaks). The existing `/[lang]/calendar.ics` stays
unchanged for current subscribers.

## Page `/[lang]/services/calendar`

Server page with `PageHeader`, breadcrumbs (Home, Information and services, Build your
calendar), metadata via `buildMetadata`, copy in `content/calendar-builder/{en,th}.ts`.
A client component `components/calendar-builder/CalendarBuilder.tsx` owns state.

1. **Choose what to include.** Checkbox cards, one per category, each with a plain-language
   description, the number of upcoming dates, and the next one ("Next, 14 Dec, Round 2 of
   recruitment"). `classes` card shows "Add your class times in step 2".
2. **Add your class times (optional).** A list of added classes and an "Add a class" form:
   course (`CourseCombobox` fed from the active curriculum codes, free text allowed for codes
   not listed), day, start, end, place (optional). Inline validation. Shows the term range
   it repeats over and that no-class days are skipped automatically. Editing and removing
   each class.
3. **Add it to your calendar.** "Where do you keep your calendar?" radio group, preselected
   from the user agent after mount:
   - iPhone or iPad
   - Mac
   - Android (Google Calendar)
   - Samsung Calendar
   - Google Calendar on a computer
   - Outlook (Windows, Mac or web), including Microsoft 365 work or school accounts
   - Something else (generic: copy link, or download the file)

   Each guide has one primary button (deep link), a copy link button with confirmation, and
   three to six short numbered steps with the exact menu names in that app, plus "If it does
   not appear" and "How to remove it" disclosures. Notes that matter: Google can take up to a
   day to refresh, the Android app cannot add a calendar by link so it is done once on a
   computer and then switched on under the app's settings, Samsung Calendar shows Google
   calendars once the Google account is synced, changing your choices gives a new link so
   remove the old calendar first.

**Preview** beside the steps on wide screens, below on narrow ones: an agenda grouped by
month, each date with its category (icon plus text, not colour alone), weekly classes shown
as "Every Monday, 09:30 to 12:20". Past dates collapsed behind "Show past dates".

Without JavaScript, the page shows the full public feed's subscribe links and all guides
expanded.

## Front page

The month grid section is replaced with **Coming up**: the next five dates from the public
calendar (Bangkok today), each with date, title, category tag and a link to its news post,
and a panel beside it, **Put BIR dates in your own calendar**, with one sentence, three
ticks (choose what you want, add your class times, works with iPhone, Android, Google and
Outlook) and a primary button to the service. When nothing is upcoming the list says so and
the panel remains. `components/home/EventCalendar.tsx` and its test go; its e2e check in
`tests/e2e/a11y.spec.ts` is replaced with one for the new section and service page.

## Discovery

Services index card, search registry entry (`lib/search/pages.ts`) with synonyms
(calendar, ics, google calendar, ปฏิทิน), quick links where calendar was mentioned, and
`llms.txt` if it lists services.

## Tests

Unit tests for selection encode/decode round trip and rejection, validation, category
filtering, ICS output for classes (DTSTART on first matching weekday, UNTIL, EXDATE on
`noClasses` days only, VTIMEZONE present, stable UIDs, folding), the route (lang check,
download header, empty selection), the links, the home section, and the builder's key
interactions with Testing Library. The content tests already enforce en/th parity.
