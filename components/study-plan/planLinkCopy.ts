/**
 * Copy for the places where the study plan and the course catalogue point at
 * each other: resuming a saved plan, the confirmation after adding a course
 * by link, the "Your plan" panel on a course page, the one line of context
 * under a course in the plan screen's picker, the catalogue's minor and
 * "with my plan" filters, and the reminder to review a course that has just
 * ended.
 *
 * Kept in its own module, typed explicitly like `studyPlanCopy.ts` so the Thai
 * must cover every English key, rather than added to the site dictionary,
 * which several other pieces of work are editing at once. Thai here is
 * written as Thai, not translated word for word.
 *
 * Every string describes a fact about the student's plan or the course. None
 * scores or ranks anything.
 */
import type { Locale } from "@/lib/i18n";
import type { AddRefusal } from "@/lib/study-plan/addToPlan";
import {
  buildStudyPlanCopy,
  type CategoryTemplates,
  type StudyPlanCopy,
} from "@/components/study-plan/studyPlanCopy";

export type PlanLinkCopy = {
  /** Year and term names, shared with every screen of the journey. */
  terms: StudyPlanCopy["terms"];
  /** Names a minor bucket for the student's own minor, shared with the plan screen. */
  categoryTemplates: CategoryTemplates;
  resume: {
    heading: string;
    /** Contains "{cohort}". */
    body: string;
    detail: string;
    button: string;
  };
  add: {
    addedTitle: string;
    /** Contains "{code}", "{title}" and "{term}". */
    addedBody: string;
    /** Contains "{requested}" and "{code}". Shown when the link named another curriculum's code. */
    substituted: string;
    /** The undo link's text; the course code follows it as screen reader text. */
    undoLabel: string;
    refusedTitle: string;
    /** Stands in for "{code}" when the link carried no usable code. */
    noCode: string;
    unchanged: string;
    /** Each contains "{code}" and, where it applies, "{term}". */
    reasons: Record<AddRefusal, string>;
  };
  panel: {
    heading: string;
    note: string;
    statusLabel: string;
    passed: string;
    /** Contains "{term}". */
    plannedTemplate: string;
    notInPlan: string;
    countsLabel: string;
    countsNothing: string;
    prerequisitesLabel: string;
    noPrerequisites: string;
    prerequisitesMet: string;
    prerequisitesNotMet: string;
    prerequisitePassed: string;
    /** Contains "{term}". */
    prerequisitePlannedEarlier: string;
    /** Contains "{term}". */
    prerequisitePlannedLater: string;
    prerequisiteNotMet: string;
    /** Contains "{curriculum}". */
    notInYourCurriculum: string;
    /** Contains "{curriculum}". */
    counterpartLabel: string;
    addLink: string;
    /** Contains "{term}". */
    suggestedTermTemplate: string;
    noSuggestedTerm: string;
    openPlan: string;
  };
  picker: {
    courseLink: string;
    /** Contains "{n}". */
    finalExamTemplate: string;
    courseworkOnly: string;
    studentReviews: string;
    /** Contains "{names}". */
    instructorsTemplate: string;
  };
  browser: {
    minorLabel: string;
    allMinors: string;
    planHeading: string;
    planNote: string;
    notPassed: string;
    ready: string;
    short: string;
    passedTag: string;
    plannedTag: string;
  };
  /**
   * The reminder, on the plan screen and in a course page's "Your plan" panel,
   * to review a course from the term that has just ended. Worked out on the
   * device and dismissible per course.
   */
  reviewPrompt: {
    /** Contains "{code}". */
    template: string;
    /** The link's text; the course code follows it as screen reader text. */
    writeLink: string;
    /** The dismiss button's text; the course code follows it as screen reader text. */
    dismiss: string;
    /** Contains "{code}". Announced after a dismissal. */
    dismissedStatus: string;
    /** Said once under the reminder. */
    note: string;
  };
};

export function buildPlanLinkCopy(locale: Locale): PlanLinkCopy {
  const studyPlan = buildStudyPlanCopy(locale);
  const base = locale === "th" ? th : en;
  return {
    ...base,
    terms: studyPlan.terms,
    categoryTemplates: {
      minorRequiredTemplate: studyPlan.plan.minorRequiredTemplate,
      minorElectiveTemplate: studyPlan.plan.minorElectiveTemplate,
      minorElectiveOtherTemplate: studyPlan.plan.minorElectiveOtherTemplate,
    },
  };
}

type OwnCopy = Omit<PlanLinkCopy, "terms" | "categoryTemplates">;

const en: OwnCopy = {
  resume: {
    heading: "Continue your plan",
    body: "You have a study plan saved on this device for cohort {cohort}.",
    detail: "It stays on this device. Nothing is sent to BIRSA.",
    button: "Continue your plan",
  },
  add: {
    addedTitle: "Added to your plan",
    addedBody: "{code} {title} is now in {term}.",
    substituted:
      "{requested} is not part of your curriculum. {code} stands in for it there, so that is the course we added.",
    undoLabel: "Undo",
    refusedTitle: "We did not change your plan",
    noCode: "that code",
    unchanged: "Your plan is exactly as it was.",
    reasons: {
      unknownCourse: "We do not recognise {code} as a course.",
      notInVersion:
        "{code} is not in your curriculum, and no course in your curriculum stands in for it.",
      alreadyPassed: "You have already passed {code}.",
      alreadyPlanned: "{code} is already in your plan.",
      badTerm: "The link did not say which term to add {code} to.",
      pastTerm: "{term} has already started or passed, so {code} cannot be added there.",
      unavailableTerm:
        "{term} is not one of the terms your plan offers, so {code} cannot go there.",
      termFull: "{term} already has 15 courses, which is the most a term can hold.",
      tooManyTerms: "Your plan already has the most terms it can hold.",
      internshipTerm:
        "The internship takes up the whole of a summer, so {code} and the other courses in {term} cannot sit together.",
    },
  },
  panel: {
    heading: "Your plan",
    note: "This uses the study plan saved on this device. It is never sent to BIRSA.",
    statusLabel: "In your plan",
    passed: "You have passed this course.",
    plannedTemplate: "Planned for {term}.",
    notInPlan: "Not in your plan yet.",
    countsLabel: "Counts towards",
    countsNothing: "Nothing. This course is not counted in your credit total.",
    prerequisitesLabel: "Prerequisites",
    noPrerequisites: "None.",
    prerequisitesMet: "Your plan covers them.",
    prerequisitesNotMet:
      "Your plan does not cover all of them yet. You can still add the course, and the plan screen will say what is missing.",
    prerequisitePassed: "passed",
    prerequisitePlannedEarlier: "planned for {term}",
    prerequisitePlannedLater: "planned for {term}, which is not before this course",
    prerequisiteNotMet: "not in your plan",
    notInYourCurriculum:
      "This course is not in your curriculum ({curriculum}), and no course there stands in for it.",
    counterpartLabel: "In your curriculum ({curriculum}) this course is",
    addLink: "Add to your plan",
    suggestedTermTemplate: "Suggested term {term}. You can change it on the plan screen.",
    noSuggestedTerm: "We could not find a term to suggest. Open your plan to add it yourself.",
    openPlan: "Open your plan",
  },
  picker: {
    courseLink: "Course page",
    finalExamTemplate: "Final exam {n}%",
    courseworkOnly: "Coursework only",
    studentReviews: "Student reviews",
    instructorsTemplate: "Taught by {names}",
  },
  browser: {
    minorLabel: "Minor",
    allMinors: "All minors",
    planHeading: "With my plan",
    planNote: "These use the study plan saved on this device.",
    notPassed: "Not yet passed",
    ready: "Prerequisites met by next term",
    short: "Counts towards a category I still need",
    passedTag: "Passed",
    plannedTag: "In your plan",
  },
  reviewPrompt: {
    template: "You finished {code} last term. Two minutes to help next year's students?",
    writeLink: "Write a review",
    dismiss: "Not now",
    dismissedStatus: "We will not ask about {code} again on this device.",
    note: "Reviews are anonymous. This reminder is worked out on this device from your plan and the date, and nothing about it is sent to BIRSA.",
  },
};

const th: OwnCopy = {
  resume: {
    heading: "ทำแผนการศึกษาต่อ",
    body: "มีแผนการศึกษาของรุ่น {cohort} บันทึกไว้ในอุปกรณ์เครื่องนี้",
    detail: "แผนนี้เก็บอยู่ในอุปกรณ์เครื่องนี้เท่านั้น BIRSA ไม่ได้รับข้อมูล",
    button: "ทำแผนต่อ",
  },
  add: {
    addedTitle: "เพิ่มวิชาลงในแผนแล้ว",
    addedBody: "เพิ่มวิชา {code} {title} ไว้ใน{term}แล้ว",
    substituted:
      "หลักสูตรของคุณไม่มีวิชา {requested} ระบบจึงเพิ่มวิชา {code} ซึ่งใช้แทนกันได้ตามหลักสูตรแทน",
    undoLabel: "ยกเลิกการเพิ่ม",
    refusedTitle: "ระบบไม่ได้แก้ไขแผน",
    noCode: "รหัสนั้น",
    unchanged: "แผนของคุณยังเหมือนเดิม",
    reasons: {
      unknownCourse: "ไม่พบวิชา {code} ในหลักสูตรใด",
      notInVersion: "หลักสูตรของคุณไม่มีวิชา {code} และไม่มีวิชาที่ใช้แทนกันได้",
      alreadyPassed: "คุณผ่านวิชา {code} แล้ว",
      alreadyPlanned: "วิชา {code} อยู่ในแผนแล้ว",
      badTerm: "ลิงก์นี้ไม่ได้ระบุภาคการศึกษาที่จะเพิ่มวิชา {code}",
      pastTerm: "{term}เริ่มไปแล้วหรือจบไปแล้ว จึงเพิ่มวิชา {code} ในภาคนั้นไม่ได้",
      unavailableTerm:
        "{term}ไม่อยู่ในช่วงที่แผนนี้เพิ่มวิชาได้ จึงเพิ่มวิชา {code} ในภาคนั้นไม่ได้",
      termFull: "{term}มีครบ 15 วิชาแล้ว ซึ่งเป็นจำนวนสูงสุดต่อภาค",
      tooManyTerms: "แผนนี้มีจำนวนภาคการศึกษาครบตามที่กำหนดสูงสุดแล้ว",
      internshipTerm: "การฝึกงานใช้เวลาทั้งภาคฤดูร้อน จึงเรียนวิชา {code} ควบคู่ใน{term}ไม่ได้",
    },
  },
  panel: {
    heading: "แผนการศึกษาของคุณ",
    note: "ข้อมูลนี้มาจากแผนการศึกษาที่บันทึกไว้ในอุปกรณ์เครื่องนี้ BIRSA ไม่ได้รับข้อมูล",
    statusLabel: "สถานะในแผน",
    passed: "ผ่านวิชานี้แล้ว",
    plannedTemplate: "อยู่ในแผนที่{term}",
    notInPlan: "ยังไม่อยู่ในแผน",
    countsLabel: "นับหน่วยกิตเข้าหมวด",
    countsNothing: "ไม่นับเข้าหมวดใดในหลักสูตรของคุณ",
    prerequisitesLabel: "วิชาบังคับก่อน",
    noPrerequisites: "ไม่มี",
    prerequisitesMet: "แผนมีวิชาบังคับก่อนครบแล้ว",
    prerequisitesNotMet:
      "แผนยังมีวิชาบังคับก่อนไม่ครบ แต่ยังเพิ่มวิชานี้ได้ หน้าแผนการศึกษาจะแจ้งว่าขาดวิชาใด",
    prerequisitePassed: "ผ่านแล้ว",
    prerequisitePlannedEarlier: "อยู่ในแผนที่{term}",
    prerequisitePlannedLater: "อยู่ในแผนที่{term} ซึ่งไม่ได้มาก่อนวิชานี้",
    prerequisiteNotMet: "ยังไม่อยู่ในแผน",
    notInYourCurriculum: "หลักสูตรของคุณ ({curriculum}) ไม่มีวิชานี้ และไม่มีวิชาที่ใช้แทนกันได้",
    counterpartLabel: "ในหลักสูตรของคุณ ({curriculum}) วิชานี้ใช้รหัส",
    addLink: "เพิ่มวิชานี้ลงในแผน",
    suggestedTermTemplate: "ภาคที่แนะนำคือ{term} เปลี่ยนได้ในหน้าแผนการศึกษา",
    noSuggestedTerm: "ระบบหาภาคที่เหมาะสมให้ไม่ได้ เปิดแผนแล้วเพิ่มวิชานี้เองได้",
    openPlan: "เปิดแผนการศึกษา",
  },
  picker: {
    courseLink: "หน้ารายวิชา",
    finalExamTemplate: "สอบปลายภาค {n}%",
    courseworkOnly: "เก็บคะแนนจากงานทั้งหมด",
    studentReviews: "มีรีวิวจากนักศึกษา",
    instructorsTemplate: "ผู้สอน {names}",
  },
  browser: {
    minorLabel: "วิชาโท",
    allMinors: "ทุกวิชาโท",
    planHeading: "ตามแผนของฉัน",
    planNote: "ตัวกรองกลุ่มนี้ใช้แผนการศึกษาที่บันทึกไว้ในอุปกรณ์เครื่องนี้",
    notPassed: "ยังไม่ผ่าน",
    ready: "ลงเรียนได้ในภาคหน้า",
    short: "นับเข้าหมวดที่ยังขาดหน่วยกิต",
    passedTag: "ผ่านแล้ว",
    plannedTag: "อยู่ในแผน",
  },
  reviewPrompt: {
    template:
      "คุณเพิ่งเรียนวิชา {code} จบในภาคที่ผ่านมา ช่วยเขียนรีวิวสั้น ๆ ราว 2 นาทีให้รุ่นน้องปีหน้าได้หรือไม่",
    writeLink: "เขียนรีวิว",
    dismiss: "ไว้ก่อน",
    dismissedStatus: "จะไม่ถามเรื่องวิชา {code} อีกในอุปกรณ์เครื่องนี้",
    note: "รีวิวไม่ระบุตัวตน ข้อความนี้คำนวณในอุปกรณ์เครื่องนี้จากแผนและวันที่ปัจจุบัน และไม่มีข้อมูลใดส่งไปยัง BIRSA",
  },
};
