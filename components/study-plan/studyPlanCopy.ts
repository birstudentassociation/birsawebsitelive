/**
 * Copy for the study plan service: the start page, the cohort question, the
 * curriculum confirm screen (the version gate), the "we cannot help" stop
 * page, and the inference notice shared with later steps in this journey.
 *
 * English and Thai are written in lock-step against an explicit type rather
 * than `as const` + `typeof en`: several fields here are string arrays
 * (`start.needs`), and an `as const` object literal narrows those to fixed
 * tuples of the *English* literal strings, which would make it a type error
 * to write different Thai text into the same positions. An explicit
 * `StudyPlanCopy` type gets the same "Thai must cover every English key"
 * guarantee without that trap.
 */
import type { Locale } from "@/lib/i18n";
import type { CategoryId, TermKind, TermRef } from "@/content/curriculum";

export type StudyPlanCopy = {
  meta: { title: string; description: string };
  /** Shared across every step's error summary box, like `wizardChromeCopy`'s labels. */
  errorSummaryTitle: string;
  start: {
    title: string;
    lede: string;
    beforeYouStart: string;
    needs: string[];
    timeEstimate: string;
    notARecord: string;
    startButton: string;
    /** Shown after `?deleted=1`, the redirect target of `deleteStudyPlan`. Confirms what the delete button on the plan screen actually cleared. */
    deletedTitle: string;
    deletedBody: string;
  };
  cohort: {
    title: string;
    hint: string;
    label: string;
    errorRequired: string;
    errorFormat: string;
  };
  curriculum: {
    title: string;
    lede: string;
    totalLabel: string;
    coursesLabel: string;
    sourceLabel: string;
    attestedWarning: string;
    legend: string;
    yes: string;
    no: string;
    errorRequired: string;
  };
  cannotHelp: {
    title: string;
    /** Contains the literal placeholder "{cohort}"; use `formatUnsupportedCohort`. */
    unsupportedCohort: string;
    notSure: string;
    doubleDegree: string;
    whatToDo: string;
    whatToDoBody: string;
    contactHeading: string;
    sourcesHeading: string;
    backToServices: string;
  };
  inference: {
    heading: string;
    checkSources: string;
  };
  /** Shared year/term labels, reused by the `where` select options and the `assumed` step's term-group headings, so both say the same thing. */
  terms: {
    /** Contains the literal placeholder "{n}"; the caller fills it in per year. */
    yearTemplate: string;
    /** A year and a term together; contains "{n}" for the year and "{term}" for the term name. */
    termTemplate: string;
    semester1: string;
    semester2: string;
    summer: string;
  };
  where: {
    title: string;
    hint: string;
    /** Contains "{year}" and "{term}"; the position worked out from the cohort code and today's date. Use `formatDerivedPosition`. */
    derivedExplanation: string;
    /** Tells the student to correct the preselected answer if it is wrong, naming the reasons this can happen. */
    correctIfWrong: string;
    /** Shown instead of `derivedExplanation` when the worked-out year is past 8 and was clamped: this does not claim year 8 as fact. */
    clampedExplanation: string;
    yearLabel: string;
    termLabel: string;
    errorRequired: string;
  };
  minor: {
    title: string;
    hint: string;
    legend: string;
    requiredCoursesLabel: string;
    errorRequired: string;
  };
  assumed: {
    title: string;
    hint: string;
    freeElectiveLabel: string;
    freeElectiveHint: string;
    freeElectiveError: string;
    passedError: string;
  };
  /**
   * Labels shared by every control where a student types a course code or a
   * course name and the field fills itself in: the fill step's placeholder
   * slots and the plan screen's add-a-course picker. They live here, once,
   * rather than under `fill` and `plan` separately, because the two controls
   * are the same widget and a student who learns it on one screen must not
   * be told something different about it on the other.
   */
  courseSearch: {
    /** The empty prompt of the no-JavaScript select, and the placeholder of the text input that replaces it. */
    prompt: string;
    /** Hint under the label, saying that typing is a way to find a course. */
    typeaheadHint: string;
    /** Shown in place of the list when the typed text matches no course. */
    noMatches: string;
    /** Contains "{n}"; announced to screen readers as the list narrows. */
    resultsTemplate: string;
    /** Accessible name of the button that empties the field. */
    clearLabel: string;
  };
  fill: {
    title: string;
    hint: string;
    notTakenLabel: string;
  };
  plan: {
    title: string;
    hint: string;
    cohortLabel: string;
    creditsPlannedLabel: string;
    projectedGraduationLabel: string;
    noProjectedGraduation: string;
    findingsHeading: string;
    findingsEmpty: string;
    owedHeading: string;
    owedCategoryHeader: string;
    owedEarnedHeader: string;
    owedRemainingHeader: string;
    /** Contains "{minor}"; the minor's own name is filled in, never a generic "Minor". */
    minorRequiredTemplate: string;
    minorElectiveTemplate: string;
    minorElectiveOtherTemplate: string;
    termsHeading: string;
    /** Explains that terms are collapsed and that opening one is how you plan it. */
    termsHint: string;
    /** Explains that the button fills courses the recommended plan names and the required courses for the student's minor, leaves choices like electives for the student, and never changes a term the student has already filled in. */
    populateHint: string;
    populateButton: string;
    /** Contains "{n}"; a term's running credit total. */
    termCreditsTemplate: string;
    addCourseLabel: string;
    /** The plan screen's own wording for `courseSearch.prompt`: the empty option of the no-JavaScript select, and the placeholder of the typeahead that replaces it. */
    addCoursePrompt: string;
    addCourseButton: string;
    noCoursesAvailable: string;
    /** Heading for the panel above a term's add-course control that says what the term still needs. */
    pickHeading: string;
    /** Optgroup label for courses the recommended plan puts in this exact term. */
    pickRecommendedGroup: string;
    /** Optgroup label for courses that count toward nothing still owed: already-satisfied buckets, and courses outside the degree total. */
    pickOtherGroup: string;
    /** Contains "{n}"; credits still needed in one requirement bucket, shown after the bucket name in an optgroup label. */
    pickRemainingTemplate: string;
    /** Shown for an open choice the catalogue has no courses for, i.e. a free elective, which may be any Thammasat course. */
    pickSlotAnyCourse: string;
    /** Shown in a collapsed term that holds nothing at all. */
    termEmpty: string;
    /** Label of the disclosure holding the full course list and the free elective box, everything the recommended plan does not answer. */
    moreOptionsLabel: string;
    /** Contains "{n}"; how many further courses fit an open choice beyond the ones offered as buttons. */
    moreCandidatesTemplate: string;
    /** Shown in place of the panel when the plan already covers every requirement and this term has no open choices left. */
    pickNothingOwed: string;
    /** Contains "{n}"; shown when a term has reached the published plan's credit load. */
    recommendedTermCompleteTemplate: string;
    /** Contains "{codes}"; appended to a course in the select when a prerequisite is not passed and not placed in an earlier term. The course is still offered: the service tells the student, it does not block them. */
    pickPrerequisiteTemplate: string;
    /** Shown in place of both the "what this term still needs" panel and the add-course form for a summer term given over to the internship (PI574): nothing may be added there, and this line says why. */
    internshipOnlyTerm: string;
    removeCourseButton: string;
    freeElectiveLabel: string;
    updateFreeElectiveButton: string;
    /** Shown when a term's free elective credit count is out of range. */
    freeElectiveError: string;
    termFullError: string;
    creditsUnit: string;
    /** Label for the control that appends the next term after the last one shown. */
    addTermButton: string;
    printLinkLabel: string;
    doesNotCheckHeading: string;
    doesNotCheck: string[];
  };
  /**
   * The delete section at the bottom of the plan screen. Deliberately spells
   * out that there is no server-side copy of the plan: a student who has used
   * the equipment loan service, which does hold their data, should not have to
   * guess whether this one is the same. It also says what is true for a student
   * who shared their electives anonymously, which is the one thing BIRSA holds:
   * rows that cannot be linked back to them, deleted on the retention schedule.
   */
  delete: {
    heading: string;
    body: string;
    buttonLabel: string;
  };
  print: {
    title: string;
    generatedOnLabel: string;
    cohortLabel: string;
    curriculumLabel: string;
    minorLabel: string;
    /** Heading for the flat list of every course in `passed`, not grouped by term. */
    passedHeading: string;
    /** Explains why passed courses are listed flat rather than grouped by term. */
    passedHint: string;
    /** Contains "{n}"; free elective credits already passed, shown as one line under the passed list. */
    passedFreeElectiveTemplate: string;
    termsHeading: string;
    noCoursesInTerm: string;
    /** Contains "{n}"; the free elective credits recorded for one term. */
    freeElectiveCreditsTemplate: string;
    findingsHeading: string;
    findingsEmpty: string;
    owedHeading: string;
    owedCategoryHeader: string;
    owedEarnedHeader: string;
    owedRemainingHeader: string;
  };
};

export function buildStudyPlanCopy(locale: Locale): StudyPlanCopy {
  return locale === "th" ? th : en;
}

/** Fills the "{cohort}" placeholder in `cannotHelp.unsupportedCohort` with the code the student entered. */
export function formatUnsupportedCohort(copy: StudyPlanCopy, code: string): string {
  return copy.cannotHelp.unsupportedCohort.replace("{cohort}", code);
}

/**
 * Fills the "{year}" and "{term}" placeholders in `where.derivedExplanation`
 * with the same year/term names every other step uses (`copy.terms`), so the
 * worked-out position is described identically to how the select options
 * name it.
 */
export function formatDerivedPosition(copy: StudyPlanCopy, year: number, kind: TermKind): string {
  return copy.where.derivedExplanation
    .replace("{year}", copy.terms.yearTemplate.replace("{n}", String(year)))
    .replace("{term}", copy.terms[kind]);
}

/** e.g. "Year 3, Semester 1", built from the same `copy.terms` labels every step in this journey uses. */
export function formatTermRef(terms: StudyPlanCopy["terms"], term: TermRef): string {
  return terms.termTemplate.replace("{n}", String(term.year)).replace("{term}", terms[term.kind]);
}

/** The three templates that name a minor bucket for the student's own minor. */
export type CategoryTemplates = Pick<
  StudyPlanCopy["plan"],
  "minorRequiredTemplate" | "minorElectiveTemplate" | "minorElectiveOtherTemplate"
>;

/**
 * Name for one credit category. The three minor buckets are named for the
 * student's actual chosen minor, not generically, so a student never has to
 * remember which minor they picked to read their own plan; the
 * `minorElectiveOther` bucket (a student's electives from a minor other than
 * their own) is likewise anchored to the chosen minor, since that is what
 * makes those credits "other" in the first place. Shared by the plan screen,
 * the print page and the course pages' "Your plan" panel.
 */
export function categoryLabel(
  templates: CategoryTemplates,
  categoryId: CategoryId,
  categoryName: string,
  minorName: string
): string {
  switch (categoryId) {
    case "minorRequired":
      return templates.minorRequiredTemplate.replace("{minor}", minorName);
    case "minorElective":
      return templates.minorElectiveTemplate.replace("{minor}", minorName);
    case "minorElectiveOther":
      return templates.minorElectiveOtherTemplate.replace("{minor}", minorName);
    default:
      return categoryName;
  }
}

const en: StudyPlanCopy = {
  meta: {
    title: "Plan your BIR degree",
    description:
      "Work out what you still need to take, put it into semesters, and check it against the rules.",
  },
  errorSummaryTitle: "There is a problem",
  start: {
    title: "Plan your BIR degree",
    lede: "Work out what you still need to take, put it into semesters, and check it against the rules.",
    beforeYouStart: "Before you start",
    needs: [
      "the first two digits of your student ID",
      "your transcript, if you have taken anything outside the standard plan",
    ],
    timeEstimate: "This takes about 10 minutes.",
    notARecord:
      "This is a plan, not your academic record. It is stored in this browser only, and nobody at BIRSA can see it.",
    startButton: "Start now",
    deletedTitle: "Your plan has been deleted",
    deletedBody:
      "It has been cleared from this browser. BIRSA never held a copy of the plan itself. If you had shared your planned electives anonymously, those rows cannot be linked back to you and are deleted on the retention schedule.",
  },
  cohort: {
    title: "What are the first two digits of your student ID?",
    hint: "For example, if your ID starts 6703, enter 67.",
    label: "First two digits",
    errorRequired: "Enter the first two digits of your student ID",
    errorFormat: "Enter two digits, for example 67",
  },
  curriculum: {
    title: "Is this your curriculum?",
    lede: "Check this against your own transcript before you go on.",
    totalLabel: "Credits to graduate",
    coursesLabel: "Courses you should recognise from your first year",
    sourceLabel: "Read the source document",
    attestedWarning:
      "No published document says which curriculum your cohort follows. BIRSA has told us it is this one.",
    legend: "Is this your curriculum?",
    yes: "Yes, this matches",
    no: "No, or I am not sure",
    errorRequired: "Select whether this is your curriculum",
  },
  cannotHelp: {
    title: "We cannot plan your degree",
    unsupportedCohort:
      "We do not have curriculum data for student IDs starting {cohort}. We only cover cohorts 64 to 69, which is everyone currently enrolled.",
    notSure:
      "You told us the curriculum we found does not match, or that you are not sure. We will not guess which curriculum is yours.",
    doubleDegree:
      "Double degree routes are not covered. The credit totals differ between the source documents, and the UK routes are counted in credits that do not compare to Thai credits.",
    whatToDo: "What to do instead",
    whatToDoBody:
      "Take your transcript to the BIR office. They can confirm your curriculum and plan the rest of your degree with you.",
    contactHeading: "Ask the BIR office",
    sourcesHeading: "Read the source documents",
    backToServices: "Back to services",
  },
  inference: {
    heading: "Part of this plan is borrowed from an older curriculum",
    checkSources: "Check this against the source documents before you rely on it.",
  },
  terms: {
    yearTemplate: "Year {n}",
    termTemplate: "Year {n}, {term}",
    semester1: "Semester 1",
    semester2: "Semester 2",
    summer: "Summer",
  },
  where: {
    title: "Which year and semester are you in now?",
    hint: "Everything after this assumes you have followed the standard plan up to this point. You can correct that on the next page.",
    derivedExplanation: "Based on your student ID, we think you are in {year}, {term}.",
    correctIfWrong:
      "Change this if it is wrong, for example if you took a leave of absence, are repeating a year, or are taking longer than the standard plan.",
    clampedExplanation: "Your student ID suggests you are past year 8. Select where you are.",
    yearLabel: "Year",
    termLabel: "Semester",
    errorRequired: "Select your year and semester",
  },
  minor: {
    title: "Which minor are you taking?",
    hint: "Your minor decides how 21 of your credits are counted. If you have not chosen yet, pick the one you are leaning toward. You can come back and change it.",
    legend: "Which minor are you taking?",
    requiredCoursesLabel: "Required courses",
    errorRequired: "Select which minor you are taking",
  },
  assumed: {
    title: "Check what we have assumed",
    hint: "We have assumed you passed these. Uncheck anything you did not take, failed, or replaced with something else.",
    freeElectiveLabel: "How many free elective credits have you passed?",
    freeElectiveHint:
      "Free electives can be any Thammasat University course, so we cannot list them. Tell us the credits and we will count them.",
    freeElectiveError: "Enter a number of credits between 0 and 60",
    passedError: "Choose no more than 120 courses, each with a valid course code",
  },
  courseSearch: {
    prompt: "Choose a course",
    typeaheadHint: "Start typing a course code or a course name and pick from the list.",
    noMatches: "No course matches what you typed.",
    resultsTemplate: "{n} courses available",
    clearLabel: "Clear this course",
  },
  fill: {
    title: "Fill in what these courses were",
    hint: "Your plan holds a slot rather than a named course here. Choose what you took, or leave it if you have not taken it yet.",
    notTakenLabel: "I have not taken this yet",
  },
  plan: {
    title: "Your plan",
    hint: "Check this against the rules and fill in the terms ahead of you.",
    cohortLabel: "Cohort",
    creditsPlannedLabel: "Credits planned",
    projectedGraduationLabel: "Projected graduation term",
    noProjectedGraduation: "Plan at least one term to see a projected graduation term.",
    findingsHeading: "What we found",
    findingsEmpty: "We have not found anything to flag in this plan.",
    owedHeading: "What you still owe",
    owedCategoryHeader: "Category",
    owedEarnedHeader: "Earned",
    owedRemainingHeader: "Remaining",
    minorRequiredTemplate: "{minor}, required courses",
    minorElectiveTemplate: "{minor}, elective courses",
    minorElectiveOtherTemplate: "Electives outside {minor}",
    termsHeading: "Terms ahead of you",
    termsHint:
      "Terms are closed until you open them. Open the one you want to plan, and it will suggest what belongs in it.",
    populateHint:
      "This fills in the courses the recommended plan names for each term ahead of you, and the required courses for your minor. It leaves choices, like minor electives and free electives, for you to make. It will not change or remove anything you have already put in a term.",
    populateButton: "Fill in named courses",
    termCreditsTemplate: "{n} credits so far",
    addCourseLabel: "Add a course",
    addCoursePrompt: "Choose a course",
    addCourseButton: "Add",
    noCoursesAvailable: "Every course in the catalogue is already passed or placed in a term.",
    pickHeading: "What this term still needs",
    pickRecommendedGroup: "Recommended for this term",
    pickOtherGroup: "Everything else",
    pickRemainingTemplate: "{n} credits still needed",
    pickSlotAnyCourse:
      "Any Thammasat course counts here. Record it in Free elective credits this term rather than as a course.",
    termEmpty: "Nothing planned yet",
    moreOptionsLabel: "Add something else to this term",
    moreCandidatesTemplate:
      "{n} more courses fit this choice. They are in the full list under Add a course.",
    pickNothingOwed:
      "This plan already covers every requirement. Anything you add here is on top of what you need.",
    recommendedTermCompleteTemplate:
      "This term already has the {n} credits the recommended plan schedules.",
    pickPrerequisiteTemplate: "needs {codes} first",
    internshipOnlyTerm:
      "This summer is given over to the internship. You do not take other courses alongside it, so nothing can be added to this term.",
    removeCourseButton: "Remove",
    freeElectiveLabel: "Free elective credits this term",
    updateFreeElectiveButton: "Update",
    freeElectiveError: "Enter a number of credits between 0 and 21",
    termFullError:
      "That term already has 15 courses, which is the most it can hold. Remove one before adding another.",
    creditsUnit: "credits",
    addTermButton: "Add another term",
    printLinkLabel: "Print this plan",
    doesNotCheckHeading: "What this does not check",
    doesNotCheck: [
      "Whether a course runs in the term you have placed it in.",
      "Anything at the Dean's or your advisor's discretion.",
      "Anything depending on your GPA.",
    ],
  },
  delete: {
    heading: "Delete your plan",
    body: "The plan itself lives only in your browser. It was never sent to a BIRSA server, unlike the equipment loan service, which does hold your data. Deleting it here clears the copy kept on this device, including any other scenarios you saved with it. If you chose to share your planned electives anonymously with Academic Affairs, that is the one thing BIRSA holds. It is a list of courses and a term with nothing in it that could be linked back to you, so we cannot find or delete it for you in particular. Those anonymous rows are deleted on the retention schedule BIRSA publishes in its privacy record.",
    buttonLabel: "Delete this plan",
  },
  print: {
    title: "Study plan",
    generatedOnLabel: "Generated on",
    cohortLabel: "Cohort",
    curriculumLabel: "Curriculum",
    minorLabel: "Minor",
    passedHeading: "Courses you have passed",
    passedHint:
      "We do not record which term you took each course in, so they are listed together here, not grouped by term.",
    passedFreeElectiveTemplate: "{n} free elective credits already passed",
    termsHeading: "Terms you have planned",
    noCoursesInTerm: "No courses recorded.",
    freeElectiveCreditsTemplate: "{n} free elective credits",
    findingsHeading: "What we found",
    findingsEmpty: "We have not found anything to flag in this plan.",
    owedHeading: "What you still owe",
    owedCategoryHeader: "Category",
    owedEarnedHeader: "Earned",
    owedRemainingHeader: "Remaining",
  },
};

const th: StudyPlanCopy = {
  meta: {
    title: "วางแผนการศึกษาปริญญา BIR",
    description: "ดูว่ายังต้องเรียนวิชาใดบ้าง จัดลงแต่ละภาคการศึกษา และตรวจกับข้อกำหนดของหลักสูตร",
  },
  errorSummaryTitle: "มีข้อมูลที่ต้องแก้ไข",
  start: {
    title: "วางแผนการศึกษาปริญญา BIR",
    lede: "ดูว่ายังต้องเรียนวิชาใดบ้าง จัดลงแต่ละภาคการศึกษา และตรวจกับข้อกำหนดของหลักสูตร",
    beforeYouStart: "ก่อนเริ่ม ให้เตรียม",
    needs: ["เลขรหัสนักศึกษา 2 หลักแรก", "ใบแสดงผลการศึกษา หากเคยลงทะเบียนวิชานอกแผนการเรียนปกติ"],
    timeEstimate: "ใช้เวลาประมาณ 10 นาที",
    notARecord:
      "นี่เป็นแผนการศึกษา ไม่ใช่ผลการศึกษาอย่างเป็นทางการ ข้อมูลเก็บอยู่ในเบราว์เซอร์นี้เท่านั้น และ BIRSA ไม่เห็นข้อมูลนี้",
    startButton: "เริ่มต้น",
    deletedTitle: "ลบแผนการศึกษาแล้ว",
    deletedBody:
      "ลบข้อมูลออกจากเบราว์เซอร์นี้แล้ว BIRSA ไม่เคยเก็บสำเนาแผนไว้ หากเคยส่งวิชาเลือกที่วางแผนไว้แบบไม่ระบุตัวตน ข้อมูลนั้นโยงกลับมาถึงตัวคุณไม่ได้ และจะลบไปเองตามระยะเวลาการเก็บรักษาข้อมูล",
  },
  cohort: {
    title: "รหัสนักศึกษาของคุณขึ้นต้นด้วยเลขอะไร",
    hint: "เช่น รหัสขึ้นต้นด้วย 6703 ให้กรอก 67 ตัวเลขนี้บอกว่าคุณใช้หลักสูตรใด",
    label: "เลข 2 หลักแรก",
    errorRequired: "กรอกเลขรหัสนักศึกษา 2 หลักแรก",
    errorFormat: "กรอกตัวเลข 2 หลัก เช่น 67",
  },
  curriculum: {
    title: "หลักสูตรนี้ตรงกับของคุณหรือไม่",
    lede: "ตรวจกับใบแสดงผลการศึกษาก่อนไปต่อ หากหลักสูตรไม่ถูกต้อง ผลในขั้นตอนต่อไปจะผิดตามไปด้วย",
    totalLabel: "หน่วยกิตที่ต้องมีเพื่อสำเร็จการศึกษา",
    coursesLabel: "รายวิชาที่น่าจะคุ้นจากปีแรก",
    sourceLabel: "อ่านเอกสารต้นทาง",
    attestedWarning:
      "ไม่มีเอกสารที่เผยแพร่ระบุว่ารุ่นของคุณใช้หลักสูตรใด หลักสูตรนี้มาจากข้อมูลที่ BIRSA ได้รับแจ้ง",
    legend: "หลักสูตรนี้ตรงกับของคุณหรือไม่",
    yes: "ใช่ ตรงกับหลักสูตรของฉัน",
    no: "ไม่ใช่ หรือไม่แน่ใจ",
    errorRequired: "เลือกว่าหลักสูตรนี้ตรงกับของคุณหรือไม่",
  },
  cannotHelp: {
    title: "บริการนี้วางแผนให้คุณไม่ได้",
    unsupportedCohort:
      "ยังไม่มีข้อมูลหลักสูตรของรหัสที่ขึ้นต้นด้วย {cohort} บริการนี้รองรับรุ่น 64 ถึง 69 ซึ่งครอบคลุมนักศึกษาปัจจุบันทุกคน",
    notSure: "คุณแจ้งว่าหลักสูตรที่แสดงไม่ตรงหรือไม่แน่ใจ ระบบจะไม่เดาว่าหลักสูตรใดเป็นของคุณ",
    doubleDegree:
      "บริการนี้ไม่รองรับหลักสูตรสองปริญญา เพราะยอดหน่วยกิตในเอกสารต้นทางแต่ละฉบับไม่ตรงกัน และหน่วยกิตฝั่งสหราชอาณาจักรเทียบกับหน่วยกิตไทยโดยตรงไม่ได้",
    whatToDo: "สิ่งที่ทำได้แทน",
    whatToDoBody:
      "นำใบแสดงผลการศึกษาไปที่สำนักงานโครงการ BIR เพื่อยืนยันหลักสูตรและวางแผนการเรียนที่เหลือร่วมกัน",
    contactHeading: "สอบถามสำนักงานโครงการ BIR",
    sourcesHeading: "อ่านเอกสารต้นทาง",
    backToServices: "กลับไปหน้าบริการ",
  },
  inference: {
    heading: "แผนนี้ใช้ข้อมูลบางส่วนจากหลักสูตรฉบับก่อนหน้า",
    checkSources: "ตรวจกับเอกสารต้นทางก่อนนำไปใช้อ้างอิง",
  },
  terms: {
    yearTemplate: "ชั้นปีที่ {n}",
    termTemplate: "ชั้นปีที่ {n} {term}",
    semester1: "ภาคการศึกษาที่ 1",
    semester2: "ภาคการศึกษาที่ 2",
    summer: "ภาคฤดูร้อน",
  },
  where: {
    title: "ตอนนี้คุณอยู่ชั้นปีและภาคการศึกษาใด",
    hint: "ระบบจะถือว่าคุณเรียนตามแผนการเรียนปกติมาตลอด แล้วให้แก้รายวิชาได้ในหน้าถัดไป",
    derivedExplanation: "จากรหัสนักศึกษา ระบบคาดว่าคุณอยู่{year} {term}",
    correctIfWrong:
      "แก้ไขได้หากไม่ตรง เช่น เคยลาพักการศึกษา เรียนซ้ำชั้น หรือเรียนนานกว่าแผนการเรียนปกติ",
    clampedExplanation:
      "จากรหัสนักศึกษา คุณน่าจะเรียนเกินชั้นปีที่ 8 แล้ว เลือกชั้นปีและภาคการศึกษาที่อยู่จริง",
    yearLabel: "ชั้นปี",
    termLabel: "ภาคการศึกษา",
    errorRequired: "เลือกชั้นปีและภาคการศึกษา",
  },
  minor: {
    title: "คุณเรียนวิชาโทใด",
    hint: "วิชาโทกำหนดว่า 21 หน่วยกิตจะนับเข้าหมวดใด หากยังไม่ได้ตัดสินใจ ให้เลือกวิชาโทที่มีแนวโน้มจะเรียนไปก่อน แล้วกลับมาเปลี่ยนภายหลังได้",
    legend: "คุณเรียนวิชาโทใด",
    requiredCoursesLabel: "วิชาบังคับ",
    errorRequired: "เลือกวิชาโท",
  },
  assumed: {
    title: "ตรวจรายวิชาที่ระบบคาดว่าผ่านแล้ว",
    hint: "ระบบคาดว่าคุณผ่านรายวิชาเหล่านี้แล้ว ให้เอาเครื่องหมายออกจากวิชาที่ยังไม่ได้เรียน สอบไม่ผ่าน หรือเรียนวิชาอื่นแทน",
    freeElectiveLabel: "ผ่านวิชาเลือกเสรีมาแล้วกี่หน่วยกิต",
    freeElectiveHint:
      "วิชาเลือกเสรีเป็นวิชาใดของมหาวิทยาลัยธรรมศาสตร์ก็ได้ ระบบจึงแสดงรายชื่อวิชาให้เลือกไม่ได้ กรอกจำนวนหน่วยกิตแล้วระบบจะนับให้",
    freeElectiveError: "กรอกจำนวนหน่วยกิตระหว่าง 0 ถึง 60",
    passedError: "เลือกได้ไม่เกิน 120 รายวิชา และทุกวิชาต้องมีรหัสวิชาที่ถูกต้อง",
  },
  courseSearch: {
    prompt: "เลือกรายวิชา",
    typeaheadHint: "พิมพ์รหัสหรือชื่อวิชา แล้วเลือกจากรายการที่ขึ้นมา",
    noMatches: "ไม่พบรายวิชาที่ตรงกัน",
    resultsTemplate: "พบ {n} รายวิชา",
    clearLabel: "ล้างรายวิชาในช่องนี้",
  },
  fill: {
    title: "ระบุวิชาที่เรียนจริง",
    hint: "ช่องเหล่านี้ในแผนเป็นวิชาที่ต้องเลือกเอง ไม่ได้กำหนดชื่อวิชาไว้ ให้เลือกวิชาที่ลงทะเบียนจริง หรือเว้นไว้หากยังไม่ได้ลงทะเบียน",
    notTakenLabel: "ยังไม่ได้เรียน",
  },
  plan: {
    title: "แผนการศึกษาของคุณ",
    hint: "ตรวจแผนกับข้อกำหนด แล้วใส่รายวิชาในภาคการศึกษาที่เหลือ",
    cohortLabel: "รุ่น",
    creditsPlannedLabel: "หน่วยกิตที่วางแผนไว้",
    projectedGraduationLabel: "คาดว่าจะสำเร็จการศึกษา",
    noProjectedGraduation:
      "วางแผนอย่างน้อย 1 ภาคการศึกษา ระบบจึงจะคำนวณภาคที่คาดว่าจะสำเร็จการศึกษาได้",
    findingsHeading: "ผลการตรวจแผน",
    findingsEmpty: "ไม่พบสิ่งที่ต้องระวังในแผนนี้",
    owedHeading: "สิ่งที่ยังขาดอยู่",
    owedCategoryHeader: "หมวดวิชา",
    owedEarnedHeader: "ผ่านแล้ว",
    owedRemainingHeader: "ยังขาด",
    minorRequiredTemplate: "วิชาบังคับวิชาโท{minor}",
    minorElectiveTemplate: "วิชาเลือกวิชาโท{minor}",
    minorElectiveOtherTemplate: "วิชาเลือกจากวิชาโทอื่นนอกจาก{minor}",
    termsHeading: "ภาคการศึกษาที่เหลือ",
    termsHint: "แต่ละภาคย่อไว้ เปิดภาคที่ต้องการวางแผน แล้วระบบจะแนะนำรายวิชาสำหรับภาคนั้น",
    populateHint:
      "ปุ่มนี้จะใส่รายวิชาที่แผนการเรียนแนะนำกำหนดชื่อไว้ในภาคการศึกษาที่เหลือ รวมถึงวิชาบังคับของวิชาโทที่เลือก วิชาที่ต้องเลือกเอง เช่น วิชาเลือกของวิชาโทและวิชาเลือกเสรี จะเว้นไว้ให้เลือกเอง ปุ่มนี้ไม่แก้หรือลบรายวิชาที่ใส่ไว้แล้ว",
    populateButton: "ใส่รายวิชาตามแผนที่แนะนำ",
    termCreditsTemplate: "{n} หน่วยกิตในภาคนี้",
    addCourseLabel: "เพิ่มรายวิชา",
    addCoursePrompt: "เลือกรายวิชา",
    addCourseButton: "เพิ่ม",
    noCoursesAvailable: "ทุกรายวิชาในหลักสูตรผ่านแล้วหรือจัดลงภาคใดภาคหนึ่งแล้ว",
    pickHeading: "รายวิชาที่ภาคนี้ยังขาด",
    pickRecommendedGroup: "แนะนำสำหรับภาคนี้",
    pickOtherGroup: "รายวิชาอื่น ๆ",
    pickRemainingTemplate: "ยังขาด {n} หน่วยกิต",
    pickSlotAnyCourse:
      'ช่องนี้นับวิชาใดของมหาวิทยาลัยธรรมศาสตร์ก็ได้ ให้กรอกใน "หน่วยกิตวิชาเลือกเสรีในภาคนี้" แทนการเลือกรายวิชา',
    termEmpty: "ยังไม่มีรายวิชาในภาคนี้",
    moreOptionsLabel: "เพิ่มรายวิชาอื่นในภาคนี้",
    moreCandidatesTemplate: 'ยังมีอีก {n} วิชาที่เลือกได้ ดูได้ในรายการทั้งหมดที่ "เพิ่มรายวิชา"',
    pickNothingOwed:
      "แผนนี้ครบทุกข้อกำหนดแล้ว รายวิชาที่เพิ่มต่อจากนี้จะเป็นหน่วยกิตเกินจากที่ต้องใช้",
    recommendedTermCompleteTemplate: "ภาคนี้ครบ {n} หน่วยกิตตามแผนการเรียนแนะนำแล้ว",
    pickPrerequisiteTemplate: "ต้องผ่าน {codes} ก่อน",
    internshipOnlyTerm:
      "ภาคฤดูร้อนนี้เป็นภาคฝึกงาน เรียนวิชาอื่นควบคู่ไม่ได้ จึงเพิ่มรายวิชาในภาคนี้ไม่ได้",
    removeCourseButton: "ลบออก",
    freeElectiveLabel: "หน่วยกิตวิชาเลือกเสรีในภาคนี้",
    updateFreeElectiveButton: "บันทึก",
    freeElectiveError: "กรอกจำนวนหน่วยกิตระหว่าง 0 ถึง 21",
    termFullError:
      "ภาคนี้มีครบ 15 รายวิชาแล้ว ซึ่งเป็นจำนวนสูงสุด ลบรายวิชาออกก่อนจึงจะเพิ่มวิชาใหม่ได้",
    creditsUnit: "หน่วยกิต",
    addTermButton: "เพิ่มอีก 1 ภาคการศึกษา",
    printLinkLabel: "พิมพ์แผนนี้",
    doesNotCheckHeading: "สิ่งที่บริการนี้ไม่ได้ตรวจ",
    doesNotCheck: [
      "วิชาจะเปิดสอนจริงในภาคที่จัดไว้หรือไม่",
      "เรื่องที่อยู่ในดุลยพินิจของคณบดีหรืออาจารย์ที่ปรึกษา",
      "เรื่องที่ขึ้นกับเกรดเฉลี่ย",
    ],
  },
  delete: {
    heading: "ลบแผนการศึกษา",
    body: "แผนการศึกษาเก็บอยู่ในเบราว์เซอร์นี้เท่านั้น ไม่ได้ส่งไปยังเซิร์ฟเวอร์ของ BIRSA ต่างจากบริการยืมอุปกรณ์ที่ BIRSA เก็บข้อมูลไว้ การลบที่นี่จะลบสำเนาบนอุปกรณ์นี้ รวมถึงแผนทางเลือกที่บันทึกไว้ หากเคยส่งวิชาเลือกที่วางแผนไว้ให้ฝ่ายวิชาการแบบไม่ระบุตัวตน BIRSA เก็บไว้เพียงรายชื่อวิชากับภาคการศึกษา ซึ่งโยงกลับมาถึงตัวคุณไม่ได้ จึงค้นหาหรือลบเฉพาะข้อมูลของคุณไม่ได้ ข้อมูลส่วนนี้จะลบไปเองตามระยะเวลาการเก็บรักษาข้อมูลที่ BIRSA เผยแพร่ไว้ในบันทึกรายการกิจกรรมการประมวลผลข้อมูลส่วนบุคคล",
    buttonLabel: "ลบแผนการศึกษานี้",
  },
  print: {
    title: "แผนการศึกษา",
    generatedOnLabel: "จัดทำเมื่อ",
    cohortLabel: "รุ่น",
    curriculumLabel: "หลักสูตร",
    minorLabel: "วิชาโท",
    passedHeading: "รายวิชาที่ผ่านแล้ว",
    passedHint: "ระบบไม่ได้บันทึกว่าแต่ละวิชาเรียนในภาคใด จึงแสดงรวมไว้ที่นี่ ไม่ได้แยกตามภาค",
    passedFreeElectiveTemplate: "ผ่านวิชาเลือกเสรีแล้ว {n} หน่วยกิต",
    termsHeading: "ภาคการศึกษาที่วางแผนไว้",
    noCoursesInTerm: "ไม่มีรายวิชา",
    freeElectiveCreditsTemplate: "วิชาเลือกเสรี {n} หน่วยกิต",
    findingsHeading: "ผลการตรวจแผน",
    findingsEmpty: "ไม่พบสิ่งที่ต้องระวังในแผนนี้",
    owedHeading: "สิ่งที่ยังขาดอยู่",
    owedCategoryHeader: "หมวดวิชา",
    owedEarnedHeader: "ผ่านแล้ว",
    owedRemainingHeader: "ยังขาด",
  },
};
