/**
 * The section palette (REDESIGN-2.0 §4.6, §11.3 item 7).
 *
 * FROZEN CONTRACT. Wave 0 owns this file, and §11.7 names the palette as
 * something that must never be parallelised.
 *
 * This is the hardening principle for the design system, and it is what
 * separates "officers can edit the site" from "officers can wreck the site":
 *
 *   **Officers compose pages from a fixed palette of section types. They never
 *   write layout, CSS, class names, HTML, or free-form components.**
 *
 * Three properties make that safe, and all three are properties of this file:
 *
 *   1. The palette is FINITE, so the visual language cannot grow without a
 *      developer. Adding an entry here is code (§6.12).
 *   2. Every section renders through a `bds/` component, named in `component`
 *      below, so a design system change reaches every page ever made.
 *   3. There is NO RICH-TEXT ESCAPE HATCH. No raw HTML field, no arbitrary
 *      embed, no custom CSS field. Those three fields are how every
 *      constrained CMS eventually becomes unconstrained, and this one will not
 *      have them. `tests/unit/section-palette.test.ts` asserts it, because the
 *      pressure to add one arrives in week nine when something looks wrong and
 *      the person who knows why it must not exist has graduated.
 *
 * Rich text itself is constrained too. `allowedMarks` and `allowedBlocks`
 * below are the declaration: headings two and three only, bold, italic, links,
 * lists, tables. An officer cannot produce an h1 inside a page body, which
 * protects the heading order the accessibility tests assert (§9).
 */

export const sectionTypeIds = [
  "rich-text",
  "nav-list",
  "card-grid",
  "notice",
  "inset-text",
  "accordion",
  "step-by-step",
  "task-list",
  "contact-panel",
  "related-links",
  "embedded-service",
] as const;

export type SectionTypeId = (typeof sectionTypeIds)[number];

export type SectionType = {
  id: SectionTypeId;
  /** What it does, in the words of §4.6's table. */
  does: string;
  /** The `bds/` component it renders through. Must exist in the manifest. */
  component: string;
  /** Whether an officer may put images in it (§4.7). */
  carriesImages: boolean;
  /**
   * What the schema validates against, beyond the fields themselves. §6.5 step
   * 3: publishing is blocked, inline, in the editor's language, if a link
   * points at nothing.
   */
  validates: string;
};

export const sectionPalette: Record<SectionTypeId, SectionType> = {
  "rich-text": {
    id: "rich-text",
    does: "Prose, headings, lists, links, tables",
    component: "Table",
    carriesImages: false,
    validates:
      "Only the marks and blocks declared below. House style, so an em dash blocks publication inline and fixably (acceptance test row 16).",
  },
  "nav-list": {
    id: "nav-list",
    does: "A run of link rows with descriptions",
    component: "NavList",
    carriesImages: false,
    validates: "Every target is a published document or a route the application serves (§3.3).",
  },
  "card-grid": {
    id: "card-grid",
    does: "Two or three columns of cards with optional images",
    component: "Card",
    carriesImages: true,
    validates:
      "Two or three columns only. Every image carries bilingual alt text or is explicitly decorative (§4.7C).",
  },
  notice: {
    id: "notice",
    does: "Info, success, warning or error callout",
    component: "Notice",
    carriesImages: false,
    validates: "One of the four variants. A page-level result is a NotificationBanner, not this.",
  },
  "inset-text": {
    id: "inset-text",
    does: "A quoted or emphasised aside",
    component: "InsetText",
    carriesImages: false,
    validates: "Plain text with inline marks only.",
  },
  accordion: {
    id: "accordion",
    does: "Question and answer pairs",
    component: "Accordion",
    carriesImages: false,
    validates: "At least two pairs. One pair is a Details.",
  },
  "step-by-step": {
    id: "step-by-step",
    does: "An ordered process",
    component: "SummaryList",
    carriesImages: false,
    validates: "At least two steps, each with a heading.",
  },
  "task-list": {
    id: "task-list",
    does: "Sections with status tags",
    component: "TaskList",
    carriesImages: false,
    validates: "Every task has a status from the Tag vocabulary.",
  },
  "contact-panel": {
    id: "contact-panel",
    does: "A portfolio's contact details, pulled from one place",
    component: "Card",
    carriesImages: false,
    validates:
      "References a portfolio from lib/portfolios.ts. The details are never typed in twice: one place, so a changed address changes everywhere.",
  },
  "related-links": {
    id: "related-links",
    does: "Cross-links, validated against real documents",
    component: "NavList",
    carriesImages: false,
    validates:
      "Internal targets must resolve to a published document. External targets register in the external link register so the daily cron finds them when they die (§3.6).",
  },
  "embedded-service": {
    id: "embedded-service",
    does: "A link into a service, rendered as a start card",
    // Wave 2 correction. This named `StartPage`, which was wrong. `StartPage`
    // is page level and renders the page's own `h1`, so using it as a section
    // put a SECOND `h1` on any host page that already had one and broke the
    // heading order §9 asserts. That is precisely what `allowedBlocks` below
    // forbids an officer from doing through rich text, and a palette that
    // blocks the officer and then does it itself is not a constraint. The
    // description was always the truth: this is a start CARD that links out
    // to the service's real start page, where `StartPage` belongs.
    component: "Card",
    carriesImages: false,
    validates: "References a published service definition from the registry (§5.2).",
  },
};

/**
 * The only marks rich text may carry. Note what is absent: no raw HTML, no
 * embed, no inline style, no class name, no colour.
 */
export const allowedMarks = ["strong", "em", "link", "code"] as const;

/**
 * The only block styles rich text may carry.
 *
 * `h1` is deliberately absent. A page has exactly one h1 and it is the page
 * title, rendered by PageHeader; an officer producing a second one inside a
 * body would break the heading order the accessibility suite asserts. §9: "the
 * schema forbids the ways an editor can break accessibility".
 */
export const allowedBlocks = ["normal", "h2", "h3", "blockquote", "ul", "ol", "table"] as const;

/**
 * Field names a schema may never contain, in any section type, ever.
 *
 * Named explicitly rather than left implicit so that the test can assert
 * their absence and so that the reason survives the committee that understood
 * it. Each of these is a documented way a constrained CMS becomes an
 * unconstrained one.
 */
export const forbiddenSchemaFields = [
  "html",
  "rawHtml",
  "customCss",
  "css",
  "style",
  "styles",
  "className",
  "script",
  "embed",
  "iframe",
] as const;
