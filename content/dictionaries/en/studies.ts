/**
 * English UI microcopy: the `studies` namespace.
 *
 * Wave 5 (/studies). Study plan, course reviews, curriculum, academic issues and
 * electives (REDESIGN-2.0 §3.2).
 *
 * One namespace per domain, one file per namespace per locale, so parallel
 * agents never share a dictionary file (REDESIGN-2.0 §11.2). The English tree
 * is the shape; `content/dictionaries/th/studies.ts` is annotated against
 * `typeof studies`, so the compiler rejects a Thai file that is missing a key or
 * has invented one. Bilingual parity is a constraint, not a courtesy
 * (principle 14).
 *
 * English voice: plain, direct, neutral. Short sentences. Active verbs.
 * GOV.UK guidance register: state the fact, do not describe or soften it.
 * See docs/EDITING.md "Voice and language" for the full standard.
 */
export const studies = {
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
