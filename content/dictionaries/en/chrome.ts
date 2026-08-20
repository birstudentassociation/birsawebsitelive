/**
 * English UI microcopy: the `chrome` namespace.
 *
 * Wave 5 (utility pages) and Wave 7 (copy). Site chrome: the header, the footer,
 * the language and theme toggles, shared action labels, page metadata labels and the
 * error pages.
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/chrome.ts` is annotated against
 * `typeof chrome`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const chrome = {
  locale: "en",

  langLabel: "English",
  // Shown inside the language toggle as the language you can switch TO.

  switchTo: "ภาษาไทย",

  switchToAria: "เปลี่ยนเป็นภาษาไทย, switch to Thai",

  site: {
    name: "BIRSA",
    fullName: "BIR Student Association",
    tagline: "Your students' association at Thammasat",
    description:
      "The official portal of the BIR Student Association, Faculty of Political Science, Thammasat University.",
  },

  nav: [
    { href: "/news", label: "What's on" },
    { href: "/services", label: "Find a service" },
    { href: "/clubs", label: "Clubs" },
    { href: "/activity", label: "BIRSA activity" },
  ],

  headerCta: { href: "/quick", label: "Quick actions" },

  footer: {
    tagline: "Run by BIR students, for BIR students.",
    explore: "Explore",
    getInvolved: "Get involved",
    followUs: "Follow us",
    contact: "Contact",
    officialLinks: "Official links",
    accessibility: "Accessibility",
    privacy: "Privacy",
    cookies: "Cookies",
    standards: "How this site works",
    emergency: "Emergency guidance",
    openInfo:
      "This is BIRSA's official site, run by students. BIRSA is not a university office. For official programme matters, use the BIR Programme links.",
    rights: "BIR Student Association",
    builtNote: "Built to be usable by everyone.",
  },

  meta: {
    updated: "Last updated",
    published: "Published",
    event: "Event",
    news: "News",
    when: "When",
    where: "Where",
  },

  actions: {
    readMore: "Read more",
    seeAll: "See all",
    viewDetails: "View details",
    learnMore: "Learn more",
    getHelp: "Get help",
    contactUs: "Contact BIRSA",
    back: "Back",
    backToTop: "Back to top",
    search: "Search",
    searchPlaceholder: "Search this site",
    filter: "Filter",
    category: "Category",
    allCategories: "All categories",
    clearFilters: "Clear filters",
    showing: "Showing",
    result: "result",
    results: "results",
    noResults: "Nothing matched your filters. Try clearing them.",
    required: "required",
    optional: "optional",
    confirm: "Confirm",
    cancel: "Cancel",
    // Visible text on a SummaryList change link (components/bds/SummaryList.tsx).
    // The link's accessible name is this word plus the row's own label, added as
    // visually hidden text, so "Change" repeated down a check-answers page still
    // reads uniquely to a screen reader.
    change: "Change",
  },

  notFound: {
    title: "We cannot find that page",
    body: "It may have moved, or the link may be wrong. Use the main sections to find what you need.",
    home: "Go to the home page",
  },

  error: {
    title: "Sorry, there is a problem with this page",
    body: "Try again in a moment. If the problem keeps happening, let us know and we'll look into it.",
    tryAgain: "Try again",
    home: "Go to the home page",
  },

  feedback: {
    prompt: "Is there a problem with this page?",
    report: "Report a problem with this page",
  },
};
