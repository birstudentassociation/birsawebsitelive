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
    askAdvisor: string;
  };
  /** Shared year/term labels, reused by the `where` select options and the `assumed` step's term-group headings, so both say the same thing. */
  terms: {
    /** Contains the literal placeholder "{n}"; the caller fills it in per year. */
    yearTemplate: string;
    semester1: string;
    semester2: string;
    summer: string;
  };
  where: {
    title: string;
    hint: string;
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
    /** Heading for the block holding the button that fills in named courses from the recommended plan. */
    populateHeading: string;
    /** Explains that the button only fills courses the recommended plan names, leaves elective slots for the student, and never changes a term the student has already filled in. */
    populateHint: string;
    populateButton: string;
    /** Contains "{n}"; a term's running credit total. */
    termCreditsTemplate: string;
    addCourseLabel: string;
    addCourseButton: string;
    noCoursesAvailable: string;
    removeCourseButton: string;
    freeElectiveLabel: string;
    updateFreeElectiveButton: string;
    /** Shown when a term's free elective credit count is out of range. */
    freeElectiveError: string;
    creditsUnit: string;
    /** Label for the control that appends the next term after the last one shown. */
    addTermButton: string;
    printLinkLabel: string;
    doesNotCheckHeading: string;
    doesNotCheck: string[];
  };
  /**
   * The delete section at the bottom of the plan screen. Deliberately spells
   * out that there is no server-side copy: a student who has used the
   * equipment loan service, which does hold their data, should not have to
   * guess whether this one is the same.
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

const en: StudyPlanCopy = {
  meta: {
    title: "Plan your BIR degree",
    description:
      "Work out what you still need to take, put it into semesters, and check it against the rules before you see your advisor.",
  },
  errorSummaryTitle: "There is a problem",
  start: {
    title: "Plan your BIR degree",
    lede: "Work out what you still need to take, put it into semesters, and check it against the rules before you see your advisor.",
    beforeYouStart: "Before you start",
    needs: [
      "the first two digits of your student ID",
      "which year and semester you are in now",
      "your transcript, if you have taken anything outside the standard plan",
    ],
    timeEstimate: "This takes about 10 minutes.",
    notARecord:
      "This is a plan, not your academic record. It is stored in this browser only, and nobody at BIRSA can see it.",
    startButton: "Start now",
    deletedTitle: "Your plan has been deleted",
    deletedBody:
      "It has been cleared from this browser. BIRSA never held a copy of it, so there is nothing left anywhere to delete.",
  },
  cohort: {
    title: "What are the first two digits of your student ID?",
    hint: "For example, if your ID starts 6703, enter 67. This is what tells us which curriculum you are on.",
    label: "First two digits",
    errorRequired: "Enter the first two digits of your student ID",
    errorFormat: "Enter two digits, for example 67",
  },
  curriculum: {
    title: "Is this your curriculum?",
    lede: "Check this against your own transcript before you go on. If it is wrong, everything after it will be wrong too.",
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
      "You told us the curriculum we found does not match, or that you are not sure. We will not guess: a plan built on the wrong curriculum is worse than no plan.",
    doubleDegree:
      "Double degree routes are not covered. The credit totals differ between the source documents, and the UK routes are counted in credits that do not compare to Thai credits.",
    whatToDo: "What to do instead",
    whatToDoBody:
      "Take your transcript to your academic advisor or the BIR programme office. They can confirm your curriculum and plan the rest of your degree with you.",
    contactHeading: "Ask the faculty",
    sourcesHeading: "Read the source documents",
    backToServices: "Back to services",
  },
  inference: {
    heading: "Part of this plan is borrowed from an older curriculum",
    askAdvisor: "Confirm this with your advisor before you rely on it.",
  },
  terms: {
    yearTemplate: "Year {n}",
    semester1: "Semester 1",
    semester2: "Semester 2",
    summer: "Summer",
  },
  where: {
    title: "Which year and semester are you in now?",
    hint: "Tell us where you are now. We will assume you have followed the standard plan up to this point, and you can correct that on the next page.",
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
  },
  fill: {
    title: "Fill in what these courses were",
    hint: "Your plan holds a slot rather than a named course here. Choose what you actually took, or leave it if you have not taken it yet.",
    notTakenLabel: "I have not taken this yet",
  },
  plan: {
    title: "Your plan",
    hint: "Check this against the rules, fill in the terms ahead of you, and take it to your advisor.",
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
    populateHeading: "Fill in the recommended plan",
    populateHint:
      "This fills in the courses the recommended plan names for each term ahead of you. It leaves electives, like minor electives and free electives, for you to choose. It will not change or remove anything you have already put in a term.",
    populateButton: "Fill in named courses",
    termCreditsTemplate: "{n} credits so far",
    addCourseLabel: "Add a course",
    addCourseButton: "Add",
    noCoursesAvailable: "Every course in the catalogue is already passed or placed in a term.",
    removeCourseButton: "Remove",
    freeElectiveLabel: "Free elective credits this term",
    updateFreeElectiveButton: "Update",
    freeElectiveError: "Enter a number of credits between 0 and 21",
    creditsUnit: "credits",
    addTermButton: "Add another term",
    printLinkLabel: "Print this plan for your advisor",
    doesNotCheckHeading: "What this does not check",
    doesNotCheck: [
      "Whether a course actually runs in the term you have placed it in.",
      "Anything at the Dean's or your advisor's discretion.",
      "Anything depending on your GPA.",
    ],
  },
  delete: {
    heading: "Delete your plan",
    body: "This plan lives only in your browser. It was never sent to a BIRSA server, so there is nothing for us to delete on our side, unlike the equipment loan service, which does hold your data. Deleting it here clears the copy kept on this device.",
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
    description:
      "ดูว่าท่านยังต้องลงทะเบียนวิชาใดบ้าง จัดเรียงเป็นรายภาคการศึกษา และตรวจสอบกับกฎเกณฑ์ ก่อนเข้าพบอาจารย์ที่ปรึกษา",
  },
  errorSummaryTitle: "มีข้อมูลที่ต้องแก้ไข",
  start: {
    title: "วางแผนการศึกษาปริญญา BIR",
    lede: "ดูว่าท่านยังต้องลงทะเบียนวิชาใดบ้าง จัดเรียงเป็นรายภาคการศึกษา และตรวจสอบกับกฎเกณฑ์ ก่อนเข้าพบอาจารย์ที่ปรึกษา",
    beforeYouStart: "ก่อนเริ่มต้น เตรียมข้อมูลต่อไปนี้",
    needs: [
      "เลขรหัสนักศึกษาสองหลักแรก",
      "ชั้นปีและภาคการศึกษาปัจจุบันของท่าน",
      "ใบแสดงผลการศึกษา หากท่านเคยลงทะเบียนวิชานอกแผนการศึกษามาตรฐาน",
    ],
    timeEstimate: "ขั้นตอนนี้ใช้เวลาประมาณ 10 นาที",
    notARecord:
      "นี่คือแผนการศึกษา ไม่ใช่ระเบียนผลการศึกษาของท่าน ข้อมูลถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น และไม่มีผู้ใดที่ BIRSA เห็นข้อมูลนี้",
    startButton: "เริ่มต้น",
    deletedTitle: "ลบแผนการศึกษาของท่านเรียบร้อยแล้ว",
    deletedBody:
      "ข้อมูลถูกลบออกจากเบราว์เซอร์นี้แล้ว เนื่องจาก BIRSA ไม่เคยเก็บสำเนาข้อมูลนี้ไว้ จึงไม่มีข้อมูลใดหลงเหลืออยู่ที่ต้องลบอีก",
  },
  cohort: {
    title: "เลขรหัสนักศึกษาสองหลักแรกของท่านคืออะไร",
    hint: "ตัวอย่างเช่น หากรหัสนักศึกษาของท่านขึ้นต้นด้วย 6703 ให้กรอก 67 ตัวเลขนี้บอกว่าท่านใช้หลักสูตรใด",
    label: "เลขสองหลักแรก",
    errorRequired: "กรอกเลขรหัสนักศึกษาสองหลักแรกของท่าน",
    errorFormat: "กรอกตัวเลขสองหลัก เช่น 67",
  },
  curriculum: {
    title: "นี่คือหลักสูตรของท่านใช่หรือไม่",
    lede: "โปรดตรวจสอบกับใบแสดงผลการศึกษาของท่านก่อนดำเนินการต่อ หากข้อมูลนี้ไม่ถูกต้อง ขั้นตอนถัดไปทั้งหมดจะไม่ถูกต้องตามไปด้วย",
    totalLabel: "หน่วยกิตที่ต้องใช้เพื่อสำเร็จการศึกษา",
    coursesLabel: "รายวิชาที่ท่านควรคุ้นเคยจากปีการศึกษาแรก",
    sourceLabel: "อ่านเอกสารต้นทาง",
    attestedWarning:
      "ไม่มีเอกสารเผยแพร่ระบุว่ารุ่นของท่านใช้หลักสูตรใด BIRSA แจ้งว่าเป็นหลักสูตรนี้",
    legend: "นี่คือหลักสูตรของท่านใช่หรือไม่",
    yes: "ใช่ ตรงกับหลักสูตรของฉัน",
    no: "ไม่ใช่ หรือไม่แน่ใจ",
    errorRequired: "เลือกว่านี่คือหลักสูตรของท่านหรือไม่",
  },
  cannotHelp: {
    title: "เราไม่สามารถวางแผนการศึกษาให้ท่านได้",
    unsupportedCohort:
      "เราไม่มีข้อมูลหลักสูตรสำหรับรหัสนักศึกษาที่ขึ้นต้นด้วย {cohort} เรารองรับเฉพาะรุ่น 64 ถึง 69 ซึ่งครอบคลุมนักศึกษาที่กำลังศึกษาอยู่ทุกคน",
    notSure:
      "ท่านแจ้งว่าหลักสูตรที่เราพบไม่ตรงกับของท่าน หรือไม่แน่ใจ เราจะไม่คาดเดา เพราะแผนการศึกษาที่สร้างจากหลักสูตรผิดย่อมแย่กว่าการไม่มีแผนเลย",
    doubleDegree:
      "บริการนี้ไม่ครอบคลุมหลักสูตรควบสองปริญญา เนื่องจากยอดหน่วยกิตในเอกสารต้นทางแต่ละฉบับไม่ตรงกัน และหน่วยกิตของหลักสูตรฝั่งสหราชอาณาจักรไม่สามารถเทียบกับหน่วยกิตไทยได้โดยตรง",
    whatToDo: "สิ่งที่ควรทำแทน",
    whatToDoBody:
      "นำใบแสดงผลการศึกษาของท่านไปพบอาจารย์ที่ปรึกษาหรือสำนักงานหลักสูตร BIR เพื่อยืนยันหลักสูตรและวางแผนการศึกษาที่เหลือร่วมกับท่าน",
    contactHeading: "ติดต่อคณะ",
    sourcesHeading: "อ่านเอกสารต้นทาง",
    backToServices: "กลับไปหน้าบริการ",
  },
  inference: {
    heading: "ส่วนหนึ่งของแผนนี้นำมาจากหลักสูตรฉบับเก่ากว่า",
    askAdvisor: "โปรดตรวจสอบกับอาจารย์ที่ปรึกษาก่อนนำไปใช้อ้างอิง",
  },
  terms: {
    yearTemplate: "ชั้นปีที่ {n}",
    semester1: "ภาคการศึกษาที่ 1",
    semester2: "ภาคการศึกษาที่ 2",
    summer: "ภาคฤดูร้อน",
  },
  where: {
    title: "ขณะนี้ท่านอยู่ชั้นปีและภาคการศึกษาใด",
    hint: "โปรดแจ้งตำแหน่งปัจจุบันของท่าน ระบบจะสันนิษฐานว่าท่านศึกษาตามแผนมาตรฐานจนถึงจุดนี้ และท่านสามารถแก้ไขข้อมูลนี้ได้ในหน้าถัดไป",
    yearLabel: "ชั้นปี",
    termLabel: "ภาคการศึกษา",
    errorRequired: "เลือกชั้นปีและภาคการศึกษาของท่าน",
  },
  minor: {
    title: "ท่านเลือกศึกษาวิชาโทใด",
    hint: "วิชาโทของท่านเป็นตัวกำหนดวิธีนับหน่วยกิต 21 หน่วยกิต หากท่านยังไม่ได้ตัดสินใจ โปรดเลือกวิชาที่ท่านมีแนวโน้มจะเลือก และสามารถกลับมาเปลี่ยนแปลงได้ภายหลัง",
    legend: "ท่านเลือกศึกษาวิชาโทใด",
    requiredCoursesLabel: "วิชาบังคับ",
    errorRequired: "เลือกวิชาโทที่ท่านกำลังศึกษา",
  },
  assumed: {
    title: "ตรวจสอบรายวิชาที่ระบบสันนิษฐาน",
    hint: "ระบบสันนิษฐานว่าท่านผ่านรายวิชาเหล่านี้แล้ว โปรดยกเลิกการทำเครื่องหมายในวิชาที่ท่านยังไม่ได้ลงทะเบียน สอบไม่ผ่าน หรือเปลี่ยนไปลงทะเบียนวิชาอื่นแทน",
    freeElectiveLabel: "ท่านผ่านหน่วยกิตวิชาเลือกเสรีไปแล้วกี่หน่วยกิต",
    freeElectiveHint:
      "วิชาเลือกเสรีอาจเป็นวิชาใดก็ได้ของมหาวิทยาลัยธรรมศาสตร์ เราจึงไม่สามารถแสดงรายชื่อวิชาได้ โปรดแจ้งจำนวนหน่วยกิต และระบบจะนับให้ท่าน",
    freeElectiveError: "กรอกจำนวนหน่วยกิตระหว่าง 0 ถึง 60",
  },
  fill: {
    title: "ระบุว่ารายวิชาเหล่านี้คือวิชาใด",
    hint: "แผนของท่านในจุดนี้เป็นช่องว่างสำหรับเลือกวิชา ไม่ใช่วิชาที่ระบุไว้แน่นอน โปรดเลือกวิชาที่ท่านลงทะเบียนจริง หรือเว้นว่างไว้หากยังไม่ได้ลงทะเบียน",
    notTakenLabel: "ยังไม่ได้ลงทะเบียนวิชานี้",
  },
  plan: {
    title: "แผนการศึกษาของท่าน",
    hint: "โปรดตรวจสอบแผนนี้กับกฎเกณฑ์ กรอกรายวิชาในภาคการศึกษาที่เหลือ แล้วนำไปให้อาจารย์ที่ปรึกษาตรวจสอบ",
    cohortLabel: "รุ่น",
    creditsPlannedLabel: "หน่วยกิตที่วางแผนไว้",
    projectedGraduationLabel: "ภาคการศึกษาที่คาดว่าจะสำเร็จการศึกษา",
    noProjectedGraduation:
      "โปรดวางแผนอย่างน้อยหนึ่งภาคการศึกษา เพื่อให้ระบบคำนวณภาคการศึกษาที่คาดว่าจะสำเร็จการศึกษา",
    findingsHeading: "สิ่งที่ตรวจพบ",
    findingsEmpty: "ระบบไม่พบข้อควรระวังในแผนนี้",
    owedHeading: "สิ่งที่ท่านยังขาดอยู่",
    owedCategoryHeader: "หมวดวิชา",
    owedEarnedHeader: "ผ่านแล้ว",
    owedRemainingHeader: "ยังขาดอยู่",
    minorRequiredTemplate: "วิชาโท{minor} วิชาบังคับ",
    minorElectiveTemplate: "วิชาโท{minor} วิชาเลือก",
    minorElectiveOtherTemplate: "วิชาเลือกในวิชาโทอื่นนอกจาก{minor}",
    termsHeading: "ภาคการศึกษาที่เหลืออยู่",
    populateHeading: "กรอกแผนที่แนะนำให้อัตโนมัติ",
    populateHint:
      "ปุ่มนี้จะกรอกเฉพาะรายวิชาที่แผนที่แนะนำระบุชื่อไว้ในแต่ละภาคการศึกษาที่เหลืออยู่ ส่วนวิชาที่ต้องเลือกเอง เช่น วิชาเลือกในวิชาโทและวิชาเลือกเสรี ยังคงเว้นไว้ให้ท่านเลือกเอง และจะไม่แก้ไขหรือลบรายวิชาที่ท่านกรอกไว้ในภาคการศึกษาใดอยู่แล้ว",
    populateButton: "กรอกรายวิชาที่ระบุชื่อไว้",
    termCreditsTemplate: "{n} หน่วยกิตในภาคนี้",
    addCourseLabel: "เพิ่มรายวิชา",
    addCourseButton: "เพิ่ม",
    noCoursesAvailable: "รายวิชาทั้งหมดในหลักสูตรผ่านแล้วหรือถูกจัดไว้ในภาคการศึกษาหนึ่งแล้ว",
    removeCourseButton: "ลบออก",
    freeElectiveLabel: "หน่วยกิตวิชาเลือกเสรีในภาคนี้",
    updateFreeElectiveButton: "บันทึก",
    freeElectiveError: "กรอกจำนวนหน่วยกิตระหว่าง 0 ถึง 21",
    creditsUnit: "หน่วยกิต",
    addTermButton: "เพิ่มภาคการศึกษาอีกหนึ่งภาค",
    printLinkLabel: "พิมพ์แผนนี้เพื่อนำไปให้อาจารย์ที่ปรึกษา",
    doesNotCheckHeading: "สิ่งที่บริการนี้ไม่ได้ตรวจสอบ",
    doesNotCheck: [
      "วิชาที่ท่านจัดไว้จะเปิดสอนในภาคการศึกษานั้นจริงหรือไม่",
      "เรื่องใดก็ตามที่อยู่ในดุลยพินิจของคณบดีหรืออาจารย์ที่ปรึกษา",
      "เรื่องใดก็ตามที่ขึ้นอยู่กับเกรดเฉลี่ยของท่าน",
    ],
  },
  delete: {
    heading: "ลบแผนการศึกษาของท่าน",
    body: "แผนการศึกษานี้จัดเก็บไว้ในเบราว์เซอร์ของท่านเท่านั้น มิได้มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ของ BIRSA แต่อย่างใด จึงไม่มีข้อมูลฝั่ง BIRSA ที่ต้องลบ ซึ่งแตกต่างจากบริการยืมอุปกรณ์ที่มีการเก็บข้อมูลของท่านไว้ การลบในหน้านี้เป็นการลบสำเนาที่จัดเก็บไว้บนอุปกรณ์นี้เท่านั้น",
    buttonLabel: "ลบแผนการศึกษานี้",
  },
  print: {
    title: "แผนการศึกษา",
    generatedOnLabel: "จัดทำเมื่อ",
    cohortLabel: "รุ่น",
    curriculumLabel: "หลักสูตร",
    minorLabel: "วิชาโท",
    passedHeading: "รายวิชาที่ท่านผ่านแล้ว",
    passedHint:
      "ระบบไม่ได้บันทึกว่าท่านลงทะเบียนแต่ละวิชาในภาคการศึกษาใด จึงแสดงรายชื่อรวมกันไว้ในที่นี้ ไม่ได้แยกตามภาคการศึกษา",
    passedFreeElectiveTemplate: "หน่วยกิตวิชาเลือกเสรีที่ผ่านแล้ว {n} หน่วยกิต",
    termsHeading: "ภาคการศึกษาที่วางแผนไว้",
    noCoursesInTerm: "ไม่มีรายวิชาบันทึกไว้",
    freeElectiveCreditsTemplate: "วิชาเลือกเสรี {n} หน่วยกิต",
    findingsHeading: "สิ่งที่ตรวจพบ",
    findingsEmpty: "ระบบไม่พบข้อควรระวังในแผนนี้",
    owedHeading: "สิ่งที่ท่านยังขาดอยู่",
    owedCategoryHeader: "หมวดวิชา",
    owedEarnedHeader: "ผ่านแล้ว",
    owedRemainingHeader: "ยังขาดอยู่",
  },
};
