/**
 * The BIRSA Design System icon sprite (REDESIGN-2.0 §4.2, §11.4 media cluster).
 *
 * Every icon currently on the site is drawn inline, per component, as its own
 * `<svg>`. This file is the consolidation: one flat record of path data, one
 * viewBox, drawn once and reused everywhere through `components/bds/Icon.tsx`.
 *
 * WHY A SINGLE `d` STRING PER ICON, NO FILLS
 * The source icons mix stroked outlines, filled dots (a `<circle r="0.9"
 * fill="currentColor" stroke="none">` used as a period under an exclamation
 * mark or inside a magnifying glass handle) and rounded rectangles. A single
 * `<path>` has one fill and one stroke, so a dot cannot be "filled" inside an
 * otherwise stroked path without a second element. Every icon below is
 * therefore normalised to stroke only, matching what most of the source
 * icons already did: a "dot" becomes a zero-length segment such as
 * `M10 13.6h.01`, which with `strokeLinecap="round"` renders as a filled
 * circle the width of the stroke. Circles are written as two arcs
 * (`M{cx-r} {cy}a{r} {r} 0 1 0 {2r} 0a{r} {r} 0 1 0 -{2r} 0`), which is the
 * standard way to express a circle outline as path data. Rounded rectangles
 * are written the same way, corner by corner.
 *
 * VIEWBOX
 * `0 0 20 20` is the majority viewBox among the source icons by a wide
 * margin (roughly two thirds of the distinct icons found used it already;
 * see the report for the count). `Icon.tsx` hardcodes this ONE viewBox for
 * every render, which is what "all icons on the same viewBox" actually means
 * in practice: there is no per-icon viewBox to get wrong, because the
 * component never reads one from here.
 *
 * ICONS THAT NEEDED RE-SCALING TO FIT
 * `person` is the only one. Its two source usages
 * (`components/about/CommitteeRoster.tsx`, `app/[lang]/activity/roles/page.tsx`)
 * both draw on a `0 0 24 24` viewBox. The path below is that same geometry
 * multiplied by 20/24 (= 0.8333) and rounded to three decimal places, which
 * is a visually inert rounding error on an icon this simple.
 *
 * WHAT WAS DELIBERATELY LEFT OUT
 * `components/quick/QuickIcon.tsx` (18 icons), `components/places/PlacesMap.tsx`
 * and `components/shuttle/ShuttleRoute.tsx` were surveyed and are not in this
 * sprite. See the Wave 1 Agent C report for why.
 */

export const iconPaths = {
  // --- navigation: chevrons ------------------------------------------------
  /**
   * Points right. Breadcrumbs.tsx (separator between crumbs) and
   * app/[lang]/quick/page.tsx (ChevronIcon, link-row disclosure) drew this
   * identically. components/home/EventCalendar.tsx's "next month" button drew
   * a near-duplicate 0.5 units off centre (`M7.5 4.5 13 10l-5.5 5.5` instead of
   * `12.5`); unified here to the symmetric version. components/NavList.tsx
   * drew the same shape on a 16x16 viewBox (`M5 2l6 6-6 6`); it is the same
   * icon at a different scale, not a separate glyph, and should migrate to
   * this entry rather than keep its own coordinates.
   */
  "chevron-right": "M7.5 4.5l5 5.5l-5 5.5",

  /**
   * Points left. components/home/EventCalendar.tsx, "previous month" button.
   * The horizontal mirror of chevron-right about the viewBox centre.
   */
  "chevron-left": "M12.5 4.5l-5 5.5l5 5.5",

  /**
   * Points down. components/Accordion.tsx and components/onboarding/StepByStep.tsx
   * drew the identical path for their <details> disclosure marker.
   */
  "chevron-down": "M5 7.5l5 5l5-5",

  // --- actions --------------------------------------------------------------
  /**
   * Two crossed diagonals. components/search/HeaderSearch.tsx (search button,
   * open state) and components/HeaderNavClient.tsx (nav toggle, open state)
   * drew the identical path.
   */
  close: "M5 5l10 10M15 5l-10 10",

  /** Three horizontal bars. components/HeaderNavClient.tsx, nav toggle, closed state. */
  menu: "M3 5.5h14M3 10h14M3 14.5h14",

  /**
   * Magnifying glass. components/search/HeaderSearch.tsx, search button,
   * closed state. Circle plus handle; the source circle (cx 9, cy 9, r 6.25)
   * is written here as two arcs per the file header note.
   */
  search: "M2.75 9a6.25 6.25 0 1 0 12.5 0a6.25 6.25 0 1 0-12.5 0M17 17l-3.7-3.7",

  /**
   * A single checkmark tick. components/Notice.tsx ("success" variant),
   * components/onboarding/StepTasksClient.tsx (completed task),
   * app/[lang]/services/equipment-loan/page.tsx and
   * app/[lang]/services/equipment-loan/directory/page.tsx (both AvailableIcon)
   * all drew this identical path.
   */
  check: "M4 10.5l4 3.5l8-8",

  // --- status -----------------------------------------------------------
  /**
   * Circle, exclamation stroke, dot. The single most duplicated icon on the
   * site: components/Field.tsx, components/feedback/FeedbackForm.tsx,
   * components/study-plan/TermFreeElectiveForm.tsx,
   * components/forms/RightsWhatForm.tsx, components/forms/AssumedStepForm.tsx,
   * components/forms/CurriculumConfirmForm.tsx, components/forms/MinorStepForm.tsx
   * (all seven: the inline field-error message) and components/Notice.tsx
   * ("error" variant) all drew this identical circle-plus-mark. The dot at
   * (10, 13.6) was a filled circle in every source; see the file header note
   * on why it is a zero-length stroked segment here.
   */
  "circle-alert": "M2 10a8 8 0 1 0 16 0a8 8 0 1 0-16 0M10 6.5v4.2M10 13.6h.01",

  /**
   * Triangle, exclamation stroke, dot. components/Notice.tsx, "warning"
   * variant.
   */
  "warning-triangle": "M10 2 1 17h18L10 2ZM10 8v4M10 14.5h.01",

  /** Circle, vertical stroke, dot near the top. components/Notice.tsx, "info" variant (default case). */
  "info-circle": "M2 10a8 8 0 1 0 16 0a8 8 0 1 0-16 0M10 9v5M10 6.4h.01",

  /**
   * Circle with a crossed-out mark. app/[lang]/services/equipment-loan/page.tsx
   * and app/[lang]/services/equipment-loan/directory/page.tsx, both
   * UnavailableIcon, drew this identically.
   */
  "circle-x": "M2 10a8 8 0 1 0 16 0a8 8 0 1 0-16 0M7 7l6 6M13 7l-6 6",

  /**
   * A pencil. components/Notice.tsx, "placeholder" variant. Renamed from the
   * source's variant name ("placeholder") to what the glyph actually is,
   * since the sprite is shared and a caller reaching for "an editing icon"
   * should not have to know it began life as a Notice variant.
   */
  pencil: "M13.5 2.5l4 4L6 18H2v-4L13.5 2.5Z",

  // --- utility ------------------------------------------------------------
  /**
   * Globe: circle plus equator plus one meridian. components/LanguageToggle.tsx.
   */
  globe:
    "M2 10a8 8 0 1 0 16 0a8 8 0 1 0-16 0M2 10h16M10 2c2.2 2.2 3.4 5 3.4 8s-1.2 5.8-3.4 8c-2.2-2.2-3.4-5-3.4-8S7.8 4.2 10 2Z",

  /** Sun: circle plus eight rays. components/ThemeToggle.tsx, light-mode state. */
  sun: "M5.75 10a4.25 4.25 0 1 0 8.5 0a4.25 4.25 0 1 0-8.5 0M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.66 4.34l-1.42 1.42M5.76 14.24l-1.42 1.42M15.66 15.66l-1.42-1.42M5.76 5.76l-1.42-1.42",

  /** Crescent moon. components/ThemeToggle.tsx, dark-mode state. */
  moon: "M17.3 12.5A7.4 7.4 0 0 1 7.5 2.7a7.4 7.4 0 1 0 9.8 9.8Z",

  // --- content --------------------------------------------------------------
  /**
   * A rounded-rectangle calendar with two hanger ticks and a header rule.
   * components/news/NewsCard.tsx, CalendarIcon (the event-date row on a news
   * card). The source rounded rect (rx 1.5) is written corner-by-corner per
   * the file header note.
   */
  calendar:
    "M4.5 4.5h11a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5ZM3 8h14M6.5 3v3M13.5 3v3",

  /**
   * A map pin with a hollow centre. components/news/NewsCard.tsx, PinIcon
   * (the location row on a news card).
   */
  pin: "M10 18s6-5.2 6-9.5A6 6 0 0 0 4 8.5C4 12.8 10 18 10 18ZM8 8.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0",

  /** Five-point star. components/home/EventCalendar.tsx, StarIcon (BIRSA's own events). */
  star: "M10 2.2 12.35 7.7 18.3 8.3 13.8 12.3 15.1 18.1 10 15 4.9 18.1 6.2 12.3 1.7 8.3 7.65 7.7Z",

  /**
   * A columned building. components/home/EventCalendar.tsx, BuildingIcon
   * (university-level events).
   */
  building: "M2.5 7.2 10 2.5l7.5 4.7M3.3 7.6h13.4V16H3.3ZM5.8 7.6V16M9.9 7.6V16M14 7.6V16M2.5 16h15",

  /** An arrow leaving a small box, up and to the right. components/ExternalLink.tsx. */
  "external-link": "M7 13l6-6M8 7h5v5",

  /**
   * A generic person: head and shoulders. components/about/CommitteeRoster.tsx
   * and app/[lang]/activity/roles/page.tsx both draw this as the placeholder
   * for a committee member with no portrait on file. Re-scaled from their
   * shared 0 0 24 24 source; see the file header note.
   */
  person:
    "M7.083 6.667a2.917 2.917 0 1 0 5.833 0a2.917 2.917 0 1 0-5.833 0M3.75 16.667c1.167-3.167 3.917-5 6.25-5s5.083 1.833 6.25 5",

  /** An upward arrow. components/ScrollToTop.tsx, the back-to-top button. */
  "arrow-up": "M10 15V5M5 9.5 10 5l5 4.5",
} as const;

/** The name of every icon in the sprite. Add to `iconPaths` above to add one. */
export type IconName = keyof typeof iconPaths;

/**
 * The one viewBox every icon in this file is drawn on. `Icon.tsx` renders
 * every icon with this fixed viewBox rather than reading one per icon, which
 * is what keeps every entry in `iconPaths` interchangeable by construction.
 */
export const ICON_VIEW_BOX = "0 0 20 20";
