/**
 * Copy for the term-level tools: the assessment and workload lines under a
 * term, the critical path mark and "If I move this later", scenarios (the
 * switcher, the minor switch, a term away and the comparison), the prerequisite
 * map on the catalogue page, offering history, the elective shortlist and the
 * compare-two-courses page.
 *
 * Kept in its own module and typed explicitly like `studyPlanCopy.ts` and
 * `planLinkCopy.ts`, so the Thai must cover every English key, rather than
 * added to the site dictionary. The sentence templates for the assessment line,
 * the workload line, the what-if sentences and the history line sit with the
 * code that fills them (`PROFILE_COPY`, `WORKLOAD_COPY`, `HISTORY_COPY`)
 * because findings use them too; they are gathered here so a screen has one
 * object to take its words from. The wording of the workload bands themselves
 * stays in the site dictionary, where the course page has it, and the pages
 * that need it pass it in.
 *
 * Everything states a fact about a plan or a course. Nothing scores or ranks.
 * Thai is written as Thai, not translated word for word.
 */
import type { Locale } from "@/lib/i18n";
import { HISTORY_COPY, type HistoryCopy } from "@/lib/courses/offeringHistory";
import type { ReviewLineCopy } from "@/lib/course-review/reviewSummary";
import { PROFILE_COPY, type ProfileCopy } from "@/lib/study-plan/assessmentProfile";
import type { WhatIfCopy } from "@/lib/study-plan/whatIfText";
import { WORKLOAD_COPY, type WorkloadCopy } from "@/lib/study-plan/workloadProfile";

export type TermInsightCopy = {
  profile: ProfileCopy;
  workload: WorkloadCopy;
  history: HistoryCopy;
  /** The label of the offering history fact on a course page. */
  historyLabel: string;
  historyNoticeTitle: string;
  /** The review line a candidate carries in a list. The band wording is passed in from the site dictionary. */
  reviewLine: Omit<ReviewLineCopy, "band">;
  shortlist: {
    heading: string;
    /** Said once under the heading: how the order is decided, and that reviews play no part in it. */
    orderNote: string;
    /** Contains "{n}". */
    unlocksTemplate: string;
    unlocksOne: string;
    recommendedHere: string;
    /** Contains "{code}"; the course it is compared with. */
    compareLink: string;
    /** Contains "{codes}". Said of courses that count towards the choice but need a prerequisite not met by this term. */
    leftOutPrerequisites: string;
    /** Contains "{codes}" and "{kind}" (semester 1, semester 2 or summer). */
    leftOutHistory: string;
    leftOutNote: string;
    /** Said when every course that counts towards the choice was left out. */
    noneEligible: string;
  };
  courseCompare: {
    title: string;
    lede: string;
    /** The heading of the form that picks two courses. */
    pickHeading: string;
    firstLabel: string;
    secondLabel: string;
    pickButton: string;
    /** The small form on a course page. Contains "{code}". */
    pageFormLabel: string;
    pageFormButton: string;
    missing: string;
    /** Contains "{codes}". */
    unknown: string;
    /** Contains "{code}". */
    same: string;
    notRanked: string;
    /** Said in a cell with nothing to list, such as a course nothing depends on. */
    none: string;
    /** Said in the history row for a course with no recorded history. */
    noHistory: string;
    /** The link from a review cell to the course's own page. */
    coursePage: string;
    courseRow: string;
    assessmentRow: string;
    reviewsRow: string;
    /** Contains "{n}". */
    finalExamTemplate: string;
    courseworkOnly: string;
    otherExam: string;
    assessmentUnknown: string;
    /** Contains "{term}". */
    assessmentRecordedFor: string;
    /** The heading of the part that reads the plan saved on this device. */
    forYourPlan: string;
    /** Said once, under the plan rows. */
    forYourPlanNote: string;
  };
  critical: {
    label: string;
    hint: string;
  };
  whatIf: WhatIfCopy & {
    /** The summary of the disclosure under each planned course. */
    summary: string;
    /** The label of the row on a course page's "Your plan" panel. */
    panelLabel: string;
  };
  scenarios: {
    heading: string;
    intro: string;
    /** Said once, so a reader without JavaScript knows what is missing and what is not. */
    needsScript: string;
    defaultName: string;
    savedHeading: string;
    currentTag: string;
    open: string;
    rename: string;
    renameLabel: string;
    save: string;
    cancel: string;
    delete: string;
    confirmDelete: string;
    compareWithCurrent: string;
    newHeading: string;
    newLabel: string;
    newButton: string;
    /** Contains "{n}". */
    limitTemplate: string;
    /** Announced after a change. */
    changedStatus: string;
    couldNotSave: string;
    /** Contains "{name}", for the accessible name of a row's buttons. */
    forScenario: string;
  };
  minorSwitch: {
    heading: string;
    intro: string;
    selectLabel: string;
    button: string;
    /** Contains "{minor}". */
    resultHeading: string;
    sameMinor: string;
    /** Each contains "{n}" and "{codes}". */
    carried: string;
    otherMinor: string;
    reclassified: string;
    /** Contains "{n}". */
    noLongerCounting: string;
    nothingMoves: string;
    /** Contains "{before}" and "{after}". */
    remaining: string;
    /** Contains "{minor}". */
    defaultName: string;
    saveButton: string;
    /** The label of the column naming where each course counts. */
    countsAs: string;
  };
  awayTerm: {
    heading: string;
    intro: string;
    termLabel: string;
    kindLabel: string;
    exchange: string;
    leave: string;
    button: string;
    noTerms: string;
    /** Contains "{term}". */
    resultHeading: string;
    /** Contains "{code}" and "{list}". */
    chainTemplate: string;
    noChains: string;
    leaveNote: string;
    exchangeNote: string;
    beyondLimit: string;
    /** Contains "{term}". */
    defaultName: string;
    saveButton: string;
  };
  compare: {
    heading: string;
    intro: string;
    /** Contains "{name}". */
    closeLink: string;
    categoryHeader: string;
    graduationRow: string;
    creditsRow: string;
    findingsHeading: string;
    problems: string;
    warnings: string;
    notes: string;
    differs: string;
    noGraduation: string;
    notInCurriculum: string;
    /** Contains "{counted}" and "{required}". */
    creditsTemplate: string;
  };
  map: {
    summary: string;
    intro: string;
    /** The accessible name of the drawing. */
    drawingLabel: string;
    legendTrack: string;
    legendStatus: string;
    otherTrack: string;
    status: {
      passed: string;
      planned: string;
      available: string;
      locked: string;
      notInCurriculum: string;
    };
    statusNote: string;
    listsHeading: string;
    /** Contains "{title}". */
    unlocksTemplate: string;
    scrollHint: string;
  };
};

export function buildTermInsightCopy(locale: Locale): TermInsightCopy {
  const base = locale === "th" ? th : en;
  return {
    ...base,
    profile: PROFILE_COPY[locale],
    workload: WORKLOAD_COPY[locale],
    history: HISTORY_COPY[locale],
  };
}

type OwnCopy = Omit<TermInsightCopy, "profile" | "workload" | "history">;

const en: OwnCopy = {
  historyLabel: "Recorded history",
  historyNoticeTitle: "About this history",
  reviewLine: {
    none: "No student reviews yet.",
    existsTemplate: "Student reviews on record, latest for {term}.",
    noBands: "No workload estimates in hours yet.",
    bandsTemplate: "Hours a week students reported for {term}. {sentences}",
  },
  shortlist: {
    heading: "Courses you can take for this choice",
    orderNote:
      "These count towards this choice for your curriculum and minor, have their prerequisites met by this term, and, where BIRSA has a recorded history for a course, have been recorded in this kind of term. They are ordered by how they fit your plan, with courses the recommended plan puts in this term first, then courses that open up more later courses, then by course code. Reviews play no part in the order.",
    unlocksTemplate: "Opens {n} later courses",
    unlocksOne: "Opens one later course",
    recommendedHere: "In the recommended plan for this term",
    compareLink: "Compare with {code}",
    leftOutPrerequisites:
      "Left out because their prerequisites are not met by this term ({codes}).",
    leftOutHistory:
      "Left out because they have never been recorded in a {kind} term ({codes}). That is history, not a promise.",
    leftOutNote: "They are still in the full course list. Nothing here blocks you.",
    noneEligible:
      "No course that counts towards this choice has its prerequisites met by this term and a recorded history in it.",
  },
  courseCompare: {
    title: "Compare two courses",
    lede: "Facts, assessment, offering history, what each course unlocks and what students have reported, side by side.",
    pickHeading: "Choose two courses",
    firstLabel: "First course",
    secondLabel: "Second course",
    pickButton: "Compare",
    pageFormLabel: "Compare {code} with another course",
    pageFormButton: "Compare",
    missing: "Choose two courses to compare.",
    unknown: "We could not find a course for {codes}. Course codes look like PI380.",
    same: "{code} is the same course twice. Choose two different courses.",
    notRanked:
      "The two courses are set side by side and are not ranked. Nothing on this page says one is better than the other.",
    none: "None",
    noHistory: "Nothing recorded yet.",
    coursePage: "Course page",
    courseRow: "Course",
    assessmentRow: "How it is assessed",
    reviewsRow: "Student reviews",
    finalExamTemplate: "Final exam worth {n}% of the grade.",
    courseworkOnly: "Coursework only.",
    otherExam: "An exam, but not a final exam.",
    assessmentUnknown: "No assessment facts are recorded yet.",
    assessmentRecordedFor: "Recorded for {term}.",
    forYourPlan: "For your plan",
    forYourPlanNote:
      "This uses the study plan saved on this device. It is never sent to BIRSA, and it is shown only when a plan is saved.",
  },
  critical: {
    label: "On the critical path",
    hint: "Other courses in your plan depend on this one, and that chain runs to your last term. Moving it later moves graduation.",
  },
  whatIf: {
    summary: "If I move this later",
    panelLabel: "If you move it later",
    moveTemplate: "Moves {code} from {from} to {to}.",
    emptyTemplate: "Leaves {term} empty and moves its courses one term later.",
    graduationMovesTemplate: "Graduation moves from {from} to {to}.",
    graduationStaysTemplate: "Graduation stays in {term}.",
    pushedTemplate:
      "{n} other courses are pushed back so their prerequisites still come first ({list}).",
    pushedOneTemplate:
      "One other course is pushed back so its prerequisite still comes first ({list}).",
    noDependentsText: "No other course in your plan needs it.",
    listItemTemplate: "{code} to {term}",
    overloadTemplate: "{term} would then have {credits} credits, over the limit of {limit}.",
    notPlannedTemplate: "{code} is not in your plan, so there is nothing to move.",
    emptyTermNothingText: "That term has nothing in it, so leaving it empty changes nothing.",
  },
  scenarios: {
    heading: "Scenarios",
    intro:
      "Keep more than one plan on this device, such as one with a term abroad, and compare them. Each is a full plan. The plan on this page is always the current one.",
    needsScript:
      "Saving, switching and renaming scenarios needs JavaScript, because they are kept on this device and never sent to BIRSA. The plan on this page, the previews and the print page all work without it.",
    defaultName: "Main",
    savedHeading: "Your saved plans",
    currentTag: "Current",
    open: "Open",
    rename: "Rename",
    renameLabel: "New name",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirmDelete: "Yes, delete",
    compareWithCurrent: "Compare with current",
    newHeading: "Start another scenario",
    newLabel: "Name for the new scenario",
    newButton: "Save a copy of this plan as a new scenario",
    limitTemplate: "You can keep up to {n} scenarios. Delete one to make room.",
    changedStatus: "Scenarios updated.",
    couldNotSave: "We could not save to this device. Your browser may be blocking storage.",
    forScenario: "for {name}",
  },
  minorSwitch: {
    heading: "If I switch minor",
    intro:
      "A minor course counts differently under each minor. This keeps every course you have passed or planned and shows how its credits would count under another minor.",
    selectLabel: "Minor to try",
    button: "Show what changes",
    resultHeading: "Under {minor}",
    sameMinor: "That is the minor this plan already uses, so nothing changes.",
    carried: "{n} credits count the same way ({codes}).",
    otherMinor: "{n} credits move to electives outside the minor ({codes}).",
    reclassified: "{n} credits count in a different part of the minor ({codes}).",
    noLongerCounting:
      "{n} credits would count towards nothing, because that part of the minor is already full.",
    nothingMoves: "None of your minor courses count differently.",
    remaining: "Credits still short of the graduation total go from {before} to {after}.",
    defaultName: "If I switch to {minor}",
    saveButton: "Keep this as a scenario",
    countsAs: "Counts as",
  },
  awayTerm: {
    heading: "If I spend a term away",
    intro:
      "An exchange or a leave means a term with no BIR courses. This moves that term's courses one term later and shows what that does to the courses that follow them and to graduation.",
    termLabel: "Term away",
    kindLabel: "Kind",
    exchange: "Exchange",
    leave: "Leave",
    button: "Show what changes",
    noTerms: "Put a course in a term first, and you can try leaving it empty.",
    resultHeading: "Away in {term}",
    chainTemplate: "{code} is needed by {list}.",
    noChains: "No course in your plan depends on the courses that move.",
    leaveNote:
      "A leave does not extend the years you have to finish the degree, so the limit still counts from when you started.",
    exchangeNote:
      "What an exchange brings back, such as credits that stand in for BIR courses, is agreed with the faculty and is not counted here.",
    beyondLimit: "This plan then runs past the years the rules allow.",
    defaultName: "Away in {term}",
    saveButton: "Keep this as a scenario",
  },
  compare: {
    heading: "Comparing two scenarios",
    intro: "The same figures for each plan, side by side.",
    closeLink: "Stop comparing",
    categoryHeader: "Credits earned in",
    graduationRow: "Projected graduation",
    creditsRow: "Credits counted",
    findingsHeading: "What we found",
    problems: "Problems",
    warnings: "Warnings",
    notes: "Notes",
    differs: "Different",
    noGraduation: "Nothing planned",
    notInCurriculum: "Not in this curriculum",
    creditsTemplate: "{counted} of {required}",
  },
  map: {
    summary: "Prerequisite map",
    intro: "Which courses need which. A line runs from a course to the courses it unlocks.",
    drawingLabel: "Prerequisite map. The lists below hold the same information.",
    legendTrack: "Colours show the track",
    legendStatus: "Colours show where each course stands in your plan",
    otherTrack: "Not in the catalogue",
    status: {
      passed: "Passed",
      planned: "In your plan",
      available: "Can be taken next term",
      locked: "Locked until its prerequisites are covered",
      notInCurriculum: "Not in your curriculum",
    },
    statusNote: "This uses the study plan saved on this device. It is never sent to BIRSA.",
    listsHeading: "What unlocks what",
    unlocksTemplate: "{title} unlocks these courses",
    scrollHint: "Scroll sideways to see the whole map.",
  },
};

const th: OwnCopy = {
  historyLabel: "ประวัติที่บันทึกไว้",
  historyNoticeTitle: "เกี่ยวกับข้อมูลประวัติ",
  reviewLine: {
    none: "ยังไม่มีรีวิวจากนักศึกษา",
    existsTemplate: "มีรีวิวจากนักศึกษา ล่าสุดของ{term}",
    noBands: "ยังไม่มีข้อมูลชั่วโมงเรียนต่อสัปดาห์",
    bandsTemplate: "ชั่วโมงต่อสัปดาห์ที่นักศึกษารายงานไว้ของ{term} {sentences}",
  },
  shortlist: {
    heading: "วิชาที่เลือกได้สำหรับช่องนี้",
    orderNote:
      "ทุกวิชาในรายการนับเข้าช่องนี้ได้ตามหลักสูตรและวิชาโท และผ่านวิชาบังคับก่อนครบภายในภาคนี้ หาก BIRSA มีประวัติการเปิดสอน วิชาเหล่านี้ก็เคยเปิดในภาคประเภทเดียวกันมาก่อน รายการเรียงตามความเหมาะสมกับแผน โดยวิชาที่แผนการเรียนแนะนำให้เรียนในภาคนี้มาก่อน ตามด้วยวิชาที่เป็นพื้นฐานของวิชาอื่นมากกว่า แล้วจึงเรียงตามรหัสวิชา รีวิวไม่มีผลต่อลำดับ",
    unlocksTemplate: "เป็นวิชาบังคับก่อนของอีก {n} วิชา",
    unlocksOne: "เป็นวิชาบังคับก่อนของอีก 1 วิชา",
    recommendedHere: "แผนการเรียนแนะนำให้เรียนในภาคนี้",
    compareLink: "เปรียบเทียบกับ {code}",
    leftOutPrerequisites: "ไม่แสดงเพราะยังผ่านวิชาบังคับก่อนไม่ครบภายในภาคนี้ ({codes})",
    leftOutHistory:
      "ไม่แสดงเพราะไม่เคยมีบันทึกว่าเปิดใน{kind} ({codes}) ข้อมูลนี้เป็นเพียงประวัติ ไม่ใช่คำยืนยัน",
    leftOutNote: "วิชาเหล่านี้ยังอยู่ในรายการวิชาทั้งหมด และเลือกได้ตามปกติ",
    noneEligible:
      "ไม่มีวิชาที่นับเข้าช่องนี้ ผ่านวิชาบังคับก่อนครบภายในภาคนี้ และเคยมีบันทึกว่าเปิดในภาคประเภทนี้",
  },
  courseCompare: {
    title: "เปรียบเทียบสองรายวิชา",
    lede: "ดูข้อมูลรายวิชา การวัดผล ประวัติการเปิดสอน วิชาที่เรียนต่อได้ และสิ่งที่นักศึกษารายงานไว้ของสองวิชาเทียบกัน",
    pickHeading: "เลือกสองรายวิชา",
    firstLabel: "วิชาแรก",
    secondLabel: "วิชาที่สอง",
    pickButton: "เปรียบเทียบ",
    pageFormLabel: "เปรียบเทียบวิชา {code} กับอีกวิชาหนึ่ง",
    pageFormButton: "เปรียบเทียบ",
    missing: "เลือกสองรายวิชาที่ต้องการเปรียบเทียบ",
    unknown: "ไม่พบรายวิชา {codes} รหัสวิชามีรูปแบบเช่น PI380",
    same: "เลือกวิชา {code} ซ้ำกันสองช่อง เลือกสองรายวิชาที่ต่างกัน",
    notRanked: "หน้านี้แสดงสองวิชาเทียบกันเท่านั้น ไม่ได้จัดอันดับหรือบอกว่าวิชาใดดีกว่า",
    none: "ไม่มี",
    noHistory: "ยังไม่มีบันทึก",
    coursePage: "หน้ารายวิชา",
    courseRow: "รายวิชา",
    assessmentRow: "การวัดผล",
    reviewsRow: "รีวิวจากนักศึกษา",
    finalExamTemplate: "สอบปลายภาค {n}% ของคะแนนรวม",
    courseworkOnly: "เก็บคะแนนจากงานทั้งหมด",
    otherExam: "มีสอบ แต่ไม่ใช่สอบปลายภาค",
    assessmentUnknown: "ยังไม่มีข้อมูลการวัดผล",
    assessmentRecordedFor: "ข้อมูลของ{term}",
    forYourPlan: "ตามแผนของคุณ",
    forYourPlanNote:
      "ส่วนนี้ใช้แผนการศึกษาที่บันทึกไว้ในอุปกรณ์เครื่องนี้ BIRSA ไม่ได้รับข้อมูล และจะแสดงเฉพาะเมื่อมีแผนบันทึกไว้",
  },
  critical: {
    label: "เลื่อนแล้วจะจบช้าลง",
    hint: "มีวิชาอื่นในแผนที่ต้องเรียนต่อจากวิชานี้เป็นทอด ๆ ไปจนถึงภาคสุดท้าย หากเลื่อนวิชานี้ออกไป จะสำเร็จการศึกษาช้าลง",
  },
  whatIf: {
    summary: "ถ้าเลื่อนวิชานี้ไปอีก 1 ภาค",
    panelLabel: "ถ้าเลื่อนวิชานี้ไปอีก 1 ภาค",
    moveTemplate: "วิชา {code} ย้ายจาก{from} ไป{to}",
    emptyTemplate: "เว้น{term}ว่างไว้ และเลื่อนรายวิชาของภาคนั้นออกไป 1 ภาค",
    graduationMovesTemplate: "จบช้าลงจาก{from} เป็น{to}",
    graduationStaysTemplate: "ยังจบใน{term}เหมือนเดิม",
    pushedTemplate:
      "ต้องเลื่อนวิชาอื่นตามไปด้วย {n} วิชา เพื่อให้วิชาบังคับก่อนยังมาก่อนเสมอ ({list})",
    pushedOneTemplate:
      "ต้องเลื่อนวิชาอื่นตามไปด้วย 1 วิชา เพื่อให้วิชาบังคับก่อนยังมาก่อนเสมอ ({list})",
    noDependentsText: "ไม่มีวิชาอื่นในแผนที่ต้องเรียนต่อจากวิชานี้",
    listItemTemplate: "{code} ไป{term}",
    overloadTemplate: "{term}จะมี {credits} หน่วยกิต เกินเกณฑ์ {limit} หน่วยกิต",
    notPlannedTemplate: "วิชา {code} ไม่อยู่ในแผน จึงไม่มีอะไรให้เลื่อน",
    emptyTermNothingText: "ภาคนี้ยังไม่มีรายวิชา การเว้นภาคนี้จึงไม่มีผลใด",
  },
  scenarios: {
    heading: "แผนทางเลือก",
    intro:
      "บันทึกแผนไว้ได้หลายแผนในอุปกรณ์เครื่องนี้ เช่น แผนที่ไปเรียนต่างประเทศ 1 ภาค แล้วนำมาเทียบกัน แต่ละแผนเป็นแผนที่สมบูรณ์ในตัว และแผนในหน้านี้คือแผนปัจจุบันเสมอ",
    needsScript:
      "การบันทึก สลับ และเปลี่ยนชื่อแผนทางเลือกต้องใช้ JavaScript เพราะแผนเหล่านี้เก็บอยู่ในอุปกรณ์เครื่องนี้และไม่ได้ส่งไปยัง BIRSA ส่วนแผนในหน้านี้ ตัวอย่าง และหน้าพิมพ์ ใช้ได้โดยไม่ต้องใช้ JavaScript",
    defaultName: "แผนหลัก",
    savedHeading: "แผนที่บันทึกไว้",
    currentTag: "แผนปัจจุบัน",
    open: "เปิดแผนนี้",
    rename: "เปลี่ยนชื่อ",
    renameLabel: "ชื่อใหม่",
    save: "บันทึก",
    cancel: "ยกเลิก",
    delete: "ลบ",
    confirmDelete: "ยืนยันการลบ",
    compareWithCurrent: "เทียบกับแผนปัจจุบัน",
    newHeading: "เพิ่มแผนทางเลือก",
    newLabel: "ชื่อแผนทางเลือก",
    newButton: "คัดลอกแผนนี้เป็นแผนทางเลือกใหม่",
    limitTemplate: "บันทึกแผนทางเลือกได้สูงสุด {n} แผน หากต้องการเพิ่ม ให้ลบแผนเดิมออกก่อน",
    changedStatus: "อัปเดตแผนทางเลือกแล้ว",
    couldNotSave: "บันทึกลงอุปกรณ์เครื่องนี้ไม่ได้ เบราว์เซอร์อาจปิดกั้นการเก็บข้อมูล",
    forScenario: "ของ{name}",
  },
  minorSwitch: {
    heading: "ถ้าเปลี่ยนวิชาโท",
    intro:
      "แต่ละวิชาโทนับหน่วยกิตต่างกัน ส่วนนี้ใช้รายวิชาที่ผ่านแล้วและที่วางแผนไว้ทั้งหมดเหมือนเดิม แล้วแสดงว่าหน่วยกิตจะนับอย่างไรหากเปลี่ยนไปเรียนวิชาโทอื่น",
    selectLabel: "วิชาโทที่ต้องการลอง",
    button: "ดูผลที่เปลี่ยนไป",
    resultHeading: "หากเปลี่ยนเป็น{minor}",
    sameMinor: "แผนนี้ใช้วิชาโทนี้อยู่แล้ว จึงไม่มีอะไรเปลี่ยน",
    carried: "{n} หน่วยกิตนับเหมือนเดิม ({codes})",
    otherMinor: "{n} หน่วยกิตเปลี่ยนเป็นวิชาเลือกนอกวิชาโท ({codes})",
    reclassified: "{n} หน่วยกิตย้ายไปนับในหมวดย่อยอื่นของวิชาโท ({codes})",
    noLongerCounting: "{n} หน่วยกิตจะไม่นับเข้าหมวดใด เพราะหมวดนั้นของวิชาโทครบแล้ว",
    nothingMoves: "วิชาในวิชาโทของคุณนับเหมือนเดิมทั้งหมด",
    remaining: "หน่วยกิตที่ยังขาดก่อนสำเร็จการศึกษาเปลี่ยนจาก {before} เป็น {after}",
    defaultName: "ถ้าเปลี่ยนเป็น{minor}",
    saveButton: "บันทึกเป็นแผนทางเลือก",
    countsAs: "นับเป็น",
  },
  awayTerm: {
    heading: "ถ้าไม่ได้เรียนที่ BIR บางภาค",
    intro:
      "การไปแลกเปลี่ยนหรือลาพักการศึกษาทำให้มีภาคที่ไม่ได้เรียนวิชาของ BIR ส่วนนี้เลื่อนรายวิชาของภาคนั้นออกไป 1 ภาค แล้วแสดงผลต่อวิชาที่ต้องเรียนต่อและการสำเร็จการศึกษา",
    termLabel: "ภาคที่ไม่ได้เรียน",
    kindLabel: "ประเภท",
    exchange: "แลกเปลี่ยน",
    leave: "ลาพักการศึกษา",
    button: "ดูผลที่เปลี่ยนไป",
    noTerms: "ใส่รายวิชาในภาคใดภาคหนึ่งก่อน จึงจะลองเว้นภาคนั้นได้",
    resultHeading: "หากไม่ได้เรียนใน{term}",
    chainTemplate: "วิชา {code} เป็นวิชาบังคับก่อนของ {list}",
    noChains: "ไม่มีวิชาใดในแผนที่ต้องเรียนต่อจากวิชาที่เลื่อนออกไป",
    leaveNote: "การลาพักการศึกษาไม่ได้ขยายระยะเวลาเรียนสูงสุด ระยะเวลายังนับจากปีที่เข้าศึกษา",
    exchangeNote:
      "หน่วยกิตจากการแลกเปลี่ยนที่จะเทียบแทนวิชาของ BIR ต้องตกลงกับคณะ ส่วนนี้ไม่ได้นับให้",
    beyondLimit: "แผนนี้จะยาวเกินจำนวนปีที่ข้อกำหนดอนุญาต",
    defaultName: "ไม่ได้เรียนใน{term}",
    saveButton: "บันทึกเป็นแผนทางเลือก",
  },
  compare: {
    heading: "เปรียบเทียบแผนทางเลือกสองแผน",
    intro: "ตัวเลขชุดเดียวกันของทั้งสองแผนเทียบกัน",
    closeLink: "ปิดการเปรียบเทียบ",
    categoryHeader: "หน่วยกิตที่ได้ในหมวด",
    graduationRow: "คาดว่าจะสำเร็จการศึกษา",
    creditsRow: "หน่วยกิตที่นับได้",
    findingsHeading: "ผลการตรวจแผน",
    problems: "ปัญหา",
    warnings: "คำเตือน",
    notes: "ข้อสังเกต",
    differs: "ต่างกัน",
    noGraduation: "ยังไม่ได้วางแผน",
    notInCurriculum: "ไม่มีในหลักสูตรนี้",
    creditsTemplate: "{counted} จาก {required}",
  },
  map: {
    summary: "แผนผังวิชาบังคับก่อน",
    intro: "วิชาใดต้องเรียนก่อนวิชาใด เส้นลากจากวิชาบังคับก่อนไปยังวิชาที่เรียนต่อได้",
    drawingLabel: "แผนผังวิชาบังคับก่อน รายการด้านล่างมีข้อมูลเดียวกัน",
    legendTrack: "สีแสดงกลุ่มวิชา",
    legendStatus: "สีแสดงสถานะของแต่ละวิชาในแผน",
    otherTrack: "ไม่อยู่ในหน้ารวมรายวิชา",
    status: {
      passed: "ผ่านแล้ว",
      planned: "อยู่ในแผน",
      available: "ลงเรียนได้ในภาคหน้า",
      locked: "ยังลงเรียนไม่ได้ ต้องผ่านวิชาบังคับก่อน",
      notInCurriculum: "ไม่มีในหลักสูตรของคุณ",
    },
    statusNote: "ข้อมูลนี้มาจากแผนการศึกษาที่บันทึกไว้ในอุปกรณ์เครื่องนี้ BIRSA ไม่ได้รับข้อมูล",
    listsHeading: "วิชาใดต้องเรียนก่อนวิชาใด",
    unlocksTemplate: "{title} เป็นวิชาบังคับก่อนของวิชาต่อไปนี้",
    scrollHint: "เลื่อนไปด้านข้างเพื่อดูแผนผังทั้งหมด",
  },
};
