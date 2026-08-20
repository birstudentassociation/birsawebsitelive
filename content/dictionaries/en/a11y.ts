/**
 * English UI microcopy: the `a11y` namespace.
 *
 * Wave 2 (navigation cluster) and Wave 7. Accessible names and visually hidden
 * text. Nothing here is ever seen by a sighted reader on a working page.
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/a11y.ts` is annotated against
 * `typeof a11y`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const a11y = {
  a11y: {
    skip: "Skip to main content",
    primaryNav: "Primary",
    openMenu: "Menu",
    closeMenu: "Close menu",
    closeSearch: "Close search",
    breadcrumb: "Breadcrumb",
    youAreHere: "You are here",
    currentPage: "Current page",
    onThisPage: "On this page",
    newTab: "opens in a new tab",
    externalLink: "external link",
    table: "Table",
    languageSelector: "Language",
    logoHome: "BIRSA, go to the home page",
    loading: "Loading",
    theme: "Theme",
    themeDark: "Switch to dark mode",
    themeLight: "Switch to light mode",
    back: "Back",
    /** ServiceNavigation's accessible name. "{service}" is replaced with the service's name. */
    serviceNavigation: "{service} navigation",
    footerNav: "Footer links",
    paginationNav: "Pagination",
    paginationPrevious: "Previous",
    paginationNext: "Next",
    /** One page link's accessible name. "{page}" is replaced with the page number. */
    paginationPage: "Page {page}",
    /** The previous/next links' accessible name, carrying the page they go to rather than a bare "Previous"/"Next". "{page}" is replaced with the page number. */
    paginationPreviousPage: "Previous, page {page}",
    paginationNextPage: "Next, page {page}",
  },
};
