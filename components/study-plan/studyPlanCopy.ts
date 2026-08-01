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
  },
  cohort: {
    title: "What are the first two digits of your student ID?",
    hint: "For example, if your ID starts 6612, enter 66. This is what tells us which curriculum you are on.",
    label: "First two digits",
    errorRequired: "Enter the first two digits of your student ID",
    errorFormat: "Enter two digits, for example 66",
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
  },
  cohort: {
    title: "เลขรหัสนักศึกษาสองหลักแรกของท่านคืออะไร",
    hint: "ตัวอย่างเช่น หากรหัสนักศึกษาของท่านขึ้นต้นด้วย 6612 ให้กรอก 66 ตัวเลขนี้บอกว่าท่านใช้หลักสูตรใด",
    label: "เลขสองหลักแรก",
    errorRequired: "กรอกเลขรหัสนักศึกษาสองหลักแรกของท่าน",
    errorFormat: "กรอกตัวเลขสองหลัก เช่น 66",
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
};
