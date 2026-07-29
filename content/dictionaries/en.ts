/**
 * English UI microcopy (site chrome, forms, shared labels).
 * Page and article prose lives in the MDX / content modules, authored
 * natively per language; this file is only the reusable interface strings.
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
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
      "The official portal of the BIR Student Association, Faculty of Political Science, Thammasat University.",
  },

  nav: [
    { href: "/news", label: "What's on" },
    { href: "/information-services", label: "Information and services" },
    { href: "/clubs", label: "Clubs" },
    { href: "/activity", label: "BIRSA activity" },
  ],
  headerCta: { href: "/quick", label: "Quick actions" },

  emergencyBanner: {
    cta: "Click for more information",
  },

  emergencyPage: {
    breadcrumb: "Emergency",
    atAGlance: "At a glance",
    alertLevel: "Alert level",
    doThisFirst: "Do this first",
    keyNumbers: "Key numbers",
    severity: {
      critical: "Critical",
      warning: "Warning",
      info: "Advisory",
    },
    whatToDo: "What to do now",
    usefulContacts: "Useful contacts",
    birsaContacts: "Contact BIRSA",
    phone: "Phone",
    address: "Address",
    disclaimer:
      "This is general guidance from a student-run site. In an emergency, always follow the instructions of the emergency services and Thammasat University.",
    noActiveTitle: "No active emergency",
    noActiveLede: "There is no emergency affecting the faculty right now.",
    noActiveBody:
      "If you have an urgent safety concern, contact the emergency services directly: police 191, medical 1669, fire 199.",
    backHome: "Go to the home page",
  },

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
    table: "Table",
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
    confirm: "Confirm",
    cancel: "Cancel",
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
      "We use what you send only to answer you. We do not share it. See our privacy notice.",
    errorSummaryTitle: "There is a problem",
    genericError: "Something went wrong. Try again, or email us directly.",
    successTitle: "Thank you. Your message is on its way",
    successBody: "A member of the BIRSA committee will get back to you by email.",
    fallbackTitle: "Email is not set up yet",
    fallbackBody: "Send your message directly to:",
    errors: {
      nameRequired: "Enter your name",
      emailRequired: "Enter your email address",
      emailInvalid: "Enter an email address in the correct format, like name@example.com",
      subjectRequired: "Enter a subject",
      messageRequired: "Enter your message",
      messageShort: "Your message is a little short. Add more detail",
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
    emergency: "Emergency guidance",
    openInfo:
      "This is BIRSA's official site, run by students. BIRSA is not a university office. For official programme matters, use the BIR Programme links.",
    rights: "BIR Student Association",
    builtNote: "Built to be usable by everyone.",
  },

  notFound: {
    title: "We cannot find that page",
    body: "It may have moved, or the link may be wrong. Try the main sections below.",
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
    lede: "Notes on all BIR courses and electives. Workload, assessment style, and what to expect before you register.",
    browseHeading: "Browse the catalogue",
    searchPlaceholder: "Search by code, title, or keyword…",
    statsHeading: "At a glance",
    statsTotalCourses: "Courses in the catalogue",
    statsTotalCredits: "Credit hours, if you took them all",
    statsTracks: "Minor tracks",
    statsByTrack: "Courses by track",
    trackLabel: "Track",
    allTracks: "All tracks",
    tracks: {
      foundational: "Foundational",
      "international-relations": "International Relations",
      "governance-transnational": "Governance and Transnational Studies",
      "public-admin-policy": "Public Administration and Policy",
      "global-political-economy": "Global Political Economy",
    },
    categories: {
      "general-education": "General education",
      core: "Core",
      required: "Required",
      "elective-area": "Elective: area studies",
      "elective-approach": "Elective: approaches and issues",
      "minor-required": "Minor: required",
      "minor-elective": "Minor: elective",
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
    sampleBadge: "Example review",
    sampleReviewTitle: "Example content, not a real review",
    sampleReviewBody:
      "Everything in this section is made up to show how a finished course review will look. The ratings, workload notes, tips and quotes below are not real student feedback, so do not use them to decide whether to take this course. BIRSA will replace them once it has collected actual reviews.",
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
      "BIRSA has not collected a student review for this course yet. If you've taken it and are willing to write a short, honest one, get in touch.",
    backToCatalog: "Back to the course catalogue",
  },
};
