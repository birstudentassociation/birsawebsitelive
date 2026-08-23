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

  studiesIndex: {
    title: "Your studies",
    lede: "Everything about the BIR programme itself. Your study plan, the course catalogue, curriculum and electives, and what to do if something goes wrong.",
    entries: {
      studyPlan: {
        title: "Study plan",
        description:
          "Work out your own route through the degree, based on your cohort and what you've already taken.",
      },
      courseReviews: {
        title: "Course reviews",
        description: "Workload, assessment style and what to expect, for every course on offer.",
      },
      curriculum: {
        title: "Curriculum and electives",
        description:
          "The full course structure for the BIR degree, the three minors, and how to choose your electives.",
        topicsLabel: "Includes",
        topics: [
          "Credit requirements by category",
          "The three minors",
          "Area studies and approaches electives",
          "Free electives",
        ],
      },
      academicIssues: {
        title: "Academic issues",
        description:
          "What to do if you need to drop a course, miss an exam, take leave, or you're worried about a warning or a grade.",
        topicsLabel: "Covers",
        topics: [
          "Dropping or withdrawing from a course",
          "Missing an exam",
          "Leave of absence",
          "Academic warning and probation",
          "Plagiarism",
        ],
      },
      handbook: {
        title: "Student handbook",
        description:
          "The full BIR handbook. Registration, fees, academic activities and the internship.",
      },
    },
  },

  studyPlan: {
    title: "Study plan",
    lede: "Work out what you still need to take for your BIR degree, based on your own cohort and curriculum.",
    aboutHeading: "What you'll need",
    aboutBody:
      "The first two digits of your student ID, your chosen minor, and your transcript if you've taken anything outside the standard plan. It takes about 10 minutes.",
    privacyHeading: "About your plan",
    privacyBody:
      "Your plan is stored in your own browser only. It is not an academic record, and nobody at BIRSA can see it.",
    startLabel: "Start your study plan",
    curriculumCta: "See the course structure and how electives work",
    courseReviewsCta: "Read what past students say about specific courses",
  },

  curriculum: {
    title: "Curriculum and electives",
    lede: "The course structure for the current BIR curriculum, the three minors, and how the elective courses work.",
    versionNoteTitle: "About this curriculum",
    versionNoteBody:
      "This shows the curriculum for cohorts 68 and 69, students who started in the 2025 or 2026 academic year. If you started earlier, your own curriculum may set different totals. Use the study plan tool to check the version that applies to you.",
    categoriesHeading: "Credit requirements by category",
    categoriesIntro: "To graduate you need to complete every category below.",
    totalLabel: "Total credits to graduate",
    catalogueHeading: "Course catalogue",
    catalogueIntro:
      "Every course in the current curriculum, with its credit value and requirement category.",
    catalogueCaption: "BIR course catalogue",
    columnCode: "Code",
    columnTitle: "Course",
    columnCredits: "Credits",
    columnCategory: "Category",
    minorCategoryLabel: "Minor course",
    electivesHeading: "Choosing your electives",
    electivesIntro:
      "Electives are the courses you choose yourself, rather than the ones every BIR student takes.",
    areaStudiesHeading: "Area studies electives",
    areaStudiesBody: "Choose 3 courses from the area studies group, worth 9 credits.",
    approachesHeading: "Approaches and issues electives",
    approachesBody: "Choose 3 courses from the approaches and issues group, worth 9 credits.",
    minorsHeading: "Your minor",
    minorsBody:
      "You choose one of three minors. Each has its own required courses, worth 9 credits, and its own electives, where you choose 2 courses worth 6 credits. The remaining 6 credits come from electives in the other two minors.",
    freeElectiveHeading: "Free electives",
    freeElectiveBody: "At least 6 credits from any course offered by Thammasat University.",
    courseReviewsCta: "Read course reviews before you choose",
    studyPlanCta: "Plan your own electives",
    sourceLabel: "Read the source document",
  },

  academicIssues: {
    title: "Academic issues",
    lede: "What the BIR programme's own rules say about dropping a course, missing an exam, taking leave, and academic warnings.",
    intro:
      "These are summarised from the BIR student handbook. For the complete Thammasat University regulations, see the Registrar's Office website, reg.tu.ac.th.",
    topicsLabel: "Common academic issues",
    topics: {
      dropping: {
        summary: "Dropping or withdrawing from a course",
        paragraphs: [
          "You can add a course, with your advisor's or instructor's approval, up to the end of the add and drop period. That is the first 14 days of a regular semester, or the first 7 days of the summer session. Adding a course after that needs the Dean's approval.",
          "You can drop a course as long as your registration does not fall below 9 credits, unless the Dean approves otherwise. Drop within the add and drop period and it will not appear on your academic record.",
          "After the add and drop period, you can still withdraw from a course within the withdrawal period, the first 10 weeks of a regular semester or the first 4 weeks of the summer session. The course is recorded with a W for withdrawn. Withdrawing later than that needs the Dean's approval.",
        ],
      },
      examAbsence: {
        summary: "Missing an exam",
        paragraphs: [
          "If unavoidable circumstances stop you attending an exam, you, or someone acting for you, can petition the course instructor.",
          "If the petition is approved, you either withdraw from the course with a W, or are assessed however the instructor decides. If it is not approved, you are assessed on your coursework so far.",
        ],
      },
      leave: {
        summary: "Taking leave or being suspended",
        paragraphs: [
          "You can apply for a leave of absence, with an appropriate reason, approved by the Dean. First year students cannot take leave in their first two semesters unless the Rector gives special permission, and nobody can take leave for more than two consecutive semesters, not counting the summer session, without it.",
          "Apply within the first 14 days of a semester and that semester is marked LEAVE on your record. You still have to pay a fee to maintain your student status.",
          "A leave of absence or a disciplinary suspension does not extend the 7 year limit to complete your degree.",
        ],
      },
      warningProbation: {
        summary: "Academic warning and probation",
        paragraphs: [
          "You need to keep a cumulative GPA of at least 2.00. If it drops below that in any semester, you get a WARNING. Two consecutive semesters of WARNING puts you on PROBATION the semester after. If your GPA is still below 2.00 after one semester on PROBATION, you are dismissed from the University.",
          "First year students have stricter rules. A GPA of 2.00 in your first semester already counts as a WARNING. A WARNING followed by a GPA below 1.50 in your second semester means dismissal, and so does failing to reach 1.50 within your first two semesters.",
        ],
      },
      plagiarism: {
        summary: "Plagiarism",
        paragraphs: [
          "The BIR programme takes plagiarism seriously. It means using someone else's published or unpublished work without acknowledging them. That includes copying a classmate's work, using data or tables without citing the source, and submitting the same piece of work to two different courses.",
          "Plagiarism, intentional or not, is punished at the course lecturer's discretion, and can mean failing the course. Reference every piece of assessed work properly, using any consistent referencing system.",
        ],
      },
      grades: {
        summary: "A problem with a grade",
        paragraphs: [
          "Grading can vary from one course to another, so check the course syllabus or ask your instructor at the start of each term. The handbook does not set out a process for disputing a grade. If you think a grade is wrong, raise it with your instructor first.",
        ],
      },
    },
    warningLabel: "Warning",
    warningBody: "Two consecutive warnings can lead to dismissal. Talk to your advisor as soon as you receive one.",
    contactHeading: "Who decides",
    contactBody:
      "These rules are set by Thammasat University and applied by your instructors, your advisor and the Dean of the Faculty of Political Science, not by BIRSA. BIRSA cannot change a grade, a warning or a dismissal decision.",
    contactCta: "Contact the BIR programme office",
    handbookCta: "Read the full rules in the student handbook",
  },

  handbookIndex: {
    title: "Student handbook",
    lede: "The full BIR programme handbook. Registration, fees, academic rules, activities and the internship.",
    updatedLabel: "Last updated",
  },

  handbookDoc: {
    onThisPage: "On this page",
    prevNextNav: "Previous and next chapters",
    previous: "Previous",
    next: "Next",
    updatedLabel: "Last updated",
    backToHandbook: "Back to the student handbook",
  },
};
