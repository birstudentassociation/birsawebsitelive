/**
 * Copy for the term-level tools: the assessment line under a term, the
 * critical path mark and "If I move this later", scenarios (the switcher, the
 * minor switch, a term away and the comparison), the prerequisite map on the
 * catalogue page, and offering history.
 *
 * Kept in its own module and typed explicitly like `studyPlanCopy.ts` and
 * `planLinkCopy.ts`, so the Thai must cover every English key, rather than
 * added to the site dictionary. The sentence templates for the assessment line,
 * the what-if sentences and the history line sit with the code that fills them
 * (`PROFILE_COPY`, `HISTORY_COPY`) because findings use them too; they are
 * gathered here so a screen has one object to take its words from.
 *
 * Everything states a fact about a plan or a course. Nothing scores or ranks.
 * Thai is written as Thai, not translated word for word.
 */
import type { Locale } from "@/lib/i18n";
import { HISTORY_COPY, type HistoryCopy } from "@/lib/courses/offeringHistory";
import { PROFILE_COPY, type ProfileCopy } from "@/lib/study-plan/assessmentProfile";
import type { WhatIfCopy } from "@/lib/study-plan/whatIfText";

export type TermInsightCopy = {
  profile: ProfileCopy;
  history: HistoryCopy;
  /** The label of the offering history fact on a course page. */
  historyLabel: string;
  historyNoticeTitle: string;
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
  return { ...base, profile: PROFILE_COPY[locale], history: HISTORY_COPY[locale] };
}

type OwnCopy = Omit<TermInsightCopy, "profile" | "history">;

const en: OwnCopy = {
  historyLabel: "Recorded history",
  historyNoticeTitle: "About this history",
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
      "Keep more than one plan on this device, such as one with a term abroad, and compare them. Each is a full plan. The plan above is always the current one.",
    needsScript:
      "Saving, switching and renaming scenarios needs JavaScript, because they are kept on this device and never sent to BIRSA. The plan on this page, the previews below and the print page all work without it.",
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
    intro:
      "Which courses need which. A line runs from a course to the courses it unlocks. The lists below hold the same information.",
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
  historyLabel: "ประวัติที่เคยบันทึกไว้",
  historyNoticeTitle: "เกี่ยวกับข้อมูลประวัตินี้",
  critical: {
    label: "ถ้าเลื่อนจะทำให้จบช้า",
    hint: "มีรายวิชาอื่นในแผนของท่านที่ต้องเรียนต่อจากวิชานี้ และลำดับวิชาเหล่านั้นต่อเนื่องไปถึงภาคสุดท้ายของแผน การเลื่อนวิชานี้ออกไปจึงทำให้สำเร็จการศึกษาช้าลง",
  },
  whatIf: {
    summary: "ถ้าเลื่อนวิชานี้ออกไป",
    panelLabel: "ถ้าเลื่อนวิชานี้ออกไป",
    moveTemplate: "เลื่อนวิชา {code} จาก{from} ไปเป็น{to}",
    emptyTemplate: "เว้น{term}ไว้ และเลื่อนรายวิชาของภาคนั้นออกไปหนึ่งภาค",
    graduationMovesTemplate: "การสำเร็จการศึกษาเลื่อนจาก{from} ไปเป็น{to}",
    graduationStaysTemplate: "ยังสำเร็จการศึกษาใน{term}เหมือนเดิม",
    pushedTemplate:
      "มี {n} วิชาที่ต้องเลื่อนตามไปด้วย เพื่อให้วิชาที่ต้องผ่านก่อนยังอยู่ก่อนเสมอ ({list})",
    pushedOneTemplate:
      "มี 1 วิชาที่ต้องเลื่อนตามไปด้วย เพื่อให้วิชาที่ต้องผ่านก่อนยังอยู่ก่อนเสมอ ({list})",
    noDependentsText: "ไม่มีวิชาอื่นในแผนของท่านที่ต้องใช้วิชานี้เป็นพื้นฐาน",
    listItemTemplate: "{code} ไปที่{term}",
    overloadTemplate: "{term}จะมี {credits} หน่วยกิต เกินเกณฑ์ {limit} หน่วยกิต",
    notPlannedTemplate: "วิชา {code} ไม่ได้อยู่ในแผนของท่าน จึงไม่มีอะไรให้เลื่อน",
    emptyTermNothingText: "ภาคนี้ยังไม่มีรายวิชา การเว้นภาคนี้จึงไม่เปลี่ยนแปลงอะไร",
  },
  scenarios: {
    heading: "แผนทางเลือก",
    intro:
      "เก็บแผนได้มากกว่าหนึ่งแผนในอุปกรณ์เครื่องนี้ เช่น แผนที่มีหนึ่งภาคไปต่างประเทศ แล้วนำมาเทียบกัน แต่ละแผนเป็นแผนที่สมบูรณ์ และแผนที่อยู่ด้านบนคือแผนปัจจุบันเสมอ",
    needsScript:
      "การบันทึก สลับ และเปลี่ยนชื่อแผนทางเลือกต้องใช้ JavaScript เพราะแผนเหล่านี้เก็บไว้ในอุปกรณ์ของท่านและไม่ถูกส่งไปยัง BIRSA ส่วนแผนในหน้านี้ ตัวอย่างด้านล่าง และหน้าพิมพ์ ใช้งานได้โดยไม่ต้องใช้ JavaScript",
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
    newHeading: "เริ่มแผนทางเลือกอีกแผน",
    newLabel: "ชื่อของแผนทางเลือกใหม่",
    newButton: "บันทึกสำเนาของแผนนี้เป็นแผนทางเลือกใหม่",
    limitTemplate: "เก็บแผนทางเลือกได้สูงสุด {n} แผน หากต้องการเพิ่มโปรดลบแผนเดิมออกก่อน",
    changedStatus: "อัปเดตแผนทางเลือกแล้ว",
    couldNotSave: "บันทึกลงอุปกรณ์เครื่องนี้ไม่ได้ เบราว์เซอร์ของท่านอาจปิดกั้นการจัดเก็บข้อมูล",
    forScenario: "ของ{name}",
  },
  minorSwitch: {
    heading: "ถ้าเปลี่ยนวิชาโท",
    intro:
      "วิชาโทแต่ละวิชานับหน่วยกิตต่างกันไปตามวิชาโทที่เลือก ส่วนนี้คงรายวิชาที่ท่านผ่านแล้วและวางแผนไว้ทั้งหมด แล้วแสดงว่าหน่วยกิตของวิชาเหล่านั้นจะนับอย่างไรเมื่อเปลี่ยนไปเรียนวิชาโทอื่น",
    selectLabel: "วิชาโทที่ต้องการลองดู",
    button: "ดูว่าอะไรเปลี่ยนไป",
    resultHeading: "หากเลือก{minor}",
    sameMinor: "นี่คือวิชาโทที่แผนนี้ใช้อยู่แล้ว จึงไม่มีอะไรเปลี่ยน",
    carried: "{n} หน่วยกิตนับเหมือนเดิม ({codes})",
    otherMinor: "{n} หน่วยกิตเปลี่ยนไปนับเป็นวิชาเลือกนอกวิชาโท ({codes})",
    reclassified: "{n} หน่วยกิตนับในหมวดย่อยอื่นของวิชาโท ({codes})",
    noLongerCounting: "{n} หน่วยกิตจะไม่นับเข้าหมวดใดเลย เพราะหมวดนั้นของวิชาโทครบแล้ว",
    nothingMoves: "ไม่มีวิชาโทใดของท่านที่นับต่างไปจากเดิม",
    remaining:
      "หน่วยกิตที่ยังขาดจากหน่วยกิตรวมที่ต้องใช้สำเร็จการศึกษา เปลี่ยนจาก {before} เป็น {after}",
    defaultName: "ถ้าเปลี่ยนเป็น{minor}",
    saveButton: "เก็บไว้เป็นแผนทางเลือก",
    countsAs: "นับเป็น",
  },
  awayTerm: {
    heading: "ถ้าต้องไม่ได้เรียนในบางภาค",
    intro:
      "การไปแลกเปลี่ยนหรือลาพักการศึกษาหมายถึงภาคที่ไม่ได้เรียนรายวิชาของ BIR ส่วนนี้เลื่อนรายวิชาของภาคนั้นออกไปหนึ่งภาค แล้วแสดงว่าส่งผลต่อวิชาที่ต้องเรียนต่อและการสำเร็จการศึกษาอย่างไร",
    termLabel: "ภาคที่ไม่ได้เรียน",
    kindLabel: "ประเภท",
    exchange: "แลกเปลี่ยน",
    leave: "ลาพักการศึกษา",
    button: "ดูว่าอะไรเปลี่ยนไป",
    noTerms: "โปรดวางรายวิชาในภาคใดภาคหนึ่งก่อน จึงจะลองเว้นภาคนั้นได้",
    resultHeading: "หากไม่ได้เรียนใน{term}",
    chainTemplate: "วิชา {code} เป็นพื้นฐานของ {list}",
    noChains: "ไม่มีวิชาใดในแผนของท่านที่ต้องใช้วิชาที่เลื่อนออกไป",
    leaveNote:
      "การลาพักการศึกษาไม่ทำให้ระยะเวลาสูงสุดที่ใช้เรียนให้จบขยายออกไป ระยะเวลายังนับจากปีที่เข้าศึกษา",
    exchangeNote:
      "สิ่งที่ได้กลับมาจากการแลกเปลี่ยน เช่น หน่วยกิตที่เทียบแทนรายวิชาของ BIR ต้องตกลงกับคณะ และส่วนนี้ไม่ได้นำมานับให้",
    beyondLimit: "แผนนี้จะยาวเกินจำนวนปีที่ข้อกำหนดอนุญาต",
    defaultName: "ไม่ได้เรียนใน{term}",
    saveButton: "เก็บไว้เป็นแผนทางเลือก",
  },
  compare: {
    heading: "เปรียบเทียบแผนทางเลือกสองแผน",
    intro: "ตัวเลขชุดเดียวกันของแต่ละแผน วางเทียบกัน",
    closeLink: "เลิกเปรียบเทียบ",
    categoryHeader: "หน่วยกิตที่ได้ในหมวด",
    graduationRow: "ภาคที่คาดว่าจะสำเร็จการศึกษา",
    creditsRow: "หน่วยกิตที่นับได้",
    findingsHeading: "สิ่งที่ตรวจพบ",
    problems: "ปัญหา",
    warnings: "คำเตือน",
    notes: "ข้อสังเกต",
    differs: "ต่างกัน",
    noGraduation: "ยังไม่ได้วางแผน",
    notInCurriculum: "ไม่มีในหลักสูตรนี้",
    creditsTemplate: "{counted} จาก {required}",
  },
  map: {
    summary: "แผนผังวิชาที่ต้องผ่านก่อน",
    intro:
      "แสดงว่ารายวิชาใดต้องเรียนก่อนรายวิชาใด เส้นจะลากจากวิชาที่ต้องผ่านก่อนไปยังวิชาที่เรียนต่อได้ รายการด้านล่างมีข้อมูลเดียวกันนี้",
    drawingLabel: "แผนผังวิชาที่ต้องผ่านก่อน รายการด้านล่างมีข้อมูลเดียวกัน",
    legendTrack: "สีแสดงกลุ่มวิชา",
    legendStatus: "สีแสดงสถานะของแต่ละวิชาในแผนของท่าน",
    otherTrack: "ไม่อยู่ในแค็ตตาล็อก",
    status: {
      passed: "ผ่านแล้ว",
      planned: "อยู่ในแผนของท่าน",
      available: "เรียนได้ในภาคหน้า",
      locked: "ยังเรียนไม่ได้จนกว่าจะผ่านวิชาที่ต้องผ่านก่อน",
      notInCurriculum: "ไม่มีในหลักสูตรของท่าน",
    },
    statusNote: "ข้อมูลนี้มาจากแผนการศึกษาที่บันทึกไว้ในอุปกรณ์เครื่องนี้ และไม่ถูกส่งไปยัง BIRSA",
    listsHeading: "วิชาใดเป็นพื้นฐานของวิชาใด",
    unlocksTemplate: "{title} เป็นพื้นฐานของวิชาต่อไปนี้",
    scrollHint: "เลื่อนไปทางด้านข้างเพื่อดูแผนผังทั้งหมด",
  },
};
