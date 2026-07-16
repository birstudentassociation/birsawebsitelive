/**
 * English UI microcopy (site chrome, forms, shared labels).
 * Page and article prose lives in the MDX / content modules, authored
 * natively per language — this file is only the reusable interface strings.
 *
 * English voice: plain, direct, friendly. Short sentences. Active verbs.
 */
export const en = {
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
      "News, activities, clubs and a student-life guide from the BIR Student Association (Politics and International Relations, Thammasat University).",
  },

  nav: [
    { href: "/news", label: "What's on" },
    { href: "/information-services", label: "Information and services" },
    { href: "/clubs", label: "Clubs" },
    { href: "/activity", label: "BIRSA activity" },
  ],
  headerCta: { href: "/quick", label: "Quick actions" },

  betaBanner: "This website is in beta. Some information may be incomplete or inaccurate.",

  a11y: {
    skip: "Skip to main content",
    primaryNav: "Primary",
    openMenu: "Menu",
    closeMenu: "Close menu",
    breadcrumb: "Breadcrumb",
    youAreHere: "You are here",
    currentPage: "Current page",
    onThisPage: "On this page",
    newTab: "opens in a new tab",
    externalLink: "external link",
    languageSelector: "Language",
    logoHome: "BIRSA, go to the home page",
    loading: "Loading",
    theme: "Theme",
    themeDark: "Switch to dark mode",
    themeLight: "Switch to light mode",
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
  },

  form: {
    send: "Send message",
    sending: "Sending…",
    sent: "Message sent",
    yourName: "Your name",
    email: "Email address",
    emailHint: "We'll only use this to reply to you.",
    subject: "Subject",
    message: "Message",
    category: "What is this about?",
    privacyNote:
      "We use what you send only to answer you. We don't share it. See our privacy notice.",
    errorSummaryTitle: "There is a problem",
    genericError: "Something went wrong. Please try again, or email us directly.",
    successTitle: "Thank you. Your message is on its way",
    successBody: "A member of the BIRSA committee will get back to you by email.",
    fallbackTitle: "Email isn't set up yet",
    fallbackBody: "Please send your message directly to:",
    errors: {
      nameRequired: "Enter your name",
      emailRequired: "Enter your email address",
      emailInvalid: "Enter an email address in the correct format, like name@example.com",
      subjectRequired: "Enter a subject",
      messageRequired: "Enter your message",
      messageShort: "Your message is a little short. Please add more detail",
      categoryRequired: "Choose what this is about",
    },
  },

  footer: {
    tagline: "Run by BIR students, for BIR students.",
    explore: "Explore",
    getInvolved: "Get involved",
    followUs: "Follow us",
    contact: "Contact",
    officialLinks: "Official links",
    accessibility: "Accessibility",
    privacy: "Privacy",
    standards: "How this site works",
    openInfo:
      "This is an unofficial student-run site. For official programme matters, use the BIR Program links.",
    rights: "BIR Student Association",
    builtNote: "Built to be usable by everyone.",
  },

  notFound: {
    title: "We can't find that page",
    body: "It may have moved, or the link may be wrong. Try the main sections below.",
    home: "Go to the home page",
  },

  error: {
    title: "Sorry, there is a problem with this page",
    body: "Please try again in a moment. If the problem keeps happening, let us know and we'll look into it.",
    tryAgain: "Try again",
    home: "Go to the home page",
  },

  feedback: {
    prompt: "Is there a problem with this page?",
    report: "Report a problem with this page",
  },

  meta: {
    updated: "Last updated",
    published: "Published",
    event: "Event",
    news: "News",
    when: "When",
    where: "Where",
  },

  courseReview: {
    title: "Course reviews",
    lede: "Search the full BIR course catalog — codes, credit breakdowns, prerequisites, and descriptions for every course in the curriculum.",
    browseHeading: "Browse the catalog",
    searchPlaceholder: "Search by code, title, or keyword…",
    statsHeading: "At a glance",
    statsTotalCourses: "Courses in the catalog",
    statsTotalCredits: "Credit hours, if you took them all",
    statsTracks: "Minor tracks",
    statsByTrack: "Courses by track",
    trackLabel: "Track",
    allTracks: "All tracks",
    tracks: {
      foundational: "Foundational",
      "international-relations": "International Relations",
      "governance-transnational": "Governance & Transnational Studies",
      "public-admin-policy": "Public Administration & Policy",
      "global-political-economy": "Global Political Economy",
    },
    categories: {
      "general-education": "General education",
      core: "Core",
      required: "Required",
      "elective-area": "Elective — area studies",
      "elective-approach": "Elective — approaches & issues",
      "minor-required": "Minor — required",
      "minor-elective": "Minor — elective",
      "free-elective": "Free elective",
    },
    credits: "credits",
    yearLabel: "Year",
    prerequisite: "Prerequisite",
    instructorsHeading: "Instructor",
    instructorsNote:
      "From the Faculty of Political Science staff directory. Teaching assignments can vary by term.",
    previous: "Previous",
    next: "Next",
    pageOf: "Page {current} of {total}",
    backToGuides: "Back to the student life & culture guides",
    openCourse: "View course & reviews",
    reviewedBadge: "Reviewed",
    descriptionHeading: "Course description",
    reviewHeading: "Student review",
    reviewBasedOn: "Based on {count} student reviews",
    ratingOverall: "Overall rating",
    ratingWorkload: "Workload",
    ratingDifficulty: "Difficulty",
    ratingOutOf: "/ 5",
    workloadHeading: "What the workload is like",
    assessmentHeading: "How it's assessed",
    tipsHeading: "Tips from past students",
    quotesHeading: "In their words",
    noReviewTitle: "No student review yet",
    noReviewBody:
      "BIRSA hasn't collected a student review for this course yet. If you've taken it and are willing to write a short, honest one, get in touch.",
    backToCatalog: "Back to the course catalog",
  },
};
