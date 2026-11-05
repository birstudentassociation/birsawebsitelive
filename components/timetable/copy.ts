import type { Locale } from "@/lib/i18n";
import type { MilestoneId } from "@/lib/timetable-planner";

export type PlannerCopy = {
  milestones: Record<MilestoneId, string>;
  strip: Record<MilestoneId, string>;
  startName: Record<MilestoneId, string>;
  sep: string;
  status: {
    label: string;
    nowRegistration: string;
    nowPayment: string;
    nowClasses: string;
    nowMidterms: string;
    nowFinals: string;
    next: string;
    tomorrow: string;
    ended: string;
    today: string;
    done: string;
    inDays: { one: string; other: string };
  };
  nextUp: {
    label: string;
    live: string;
    today: string;
    tomorrow: string;
    kind: { class: string; midterm: string; final: string };
    noClasses: string;
  };
  pick: {
    heading: string;
    seeWeek: string;
    quickLabel: string;
    quickYear: Record<"year1" | "year2" | "year3", string>;
    quickDone: { one: string; other: string };
    quickNone: string;
    sectionPrompt: string;
    search: string;
    searchHint: string;
    filters: string;
    all: string;
    mine: string;
    fits: string;
    fitsHint: string;
    shortGroups: Record<string, string>;
    add: string;
    remove: string;
    added: string;
    section: string;
    switchSection: string;
    clash: string;
    examClash: string;
    needs: string;
    taughtWith: string;
    final: string;
    midterm: string;
    noMatch: string;
    reset: string;
    count: { one: string; other: string };
    coursePage: string;
  };
  week: {
    heading: string;
    empty: string;
    clashes: { one: string; other: string };
    noClash: string;
    credits: string;
    fees: string;
    feesOver: string;
  };
  exams: {
    heading: string;
    midterms: string;
    finals: string;
    saturday: string;
    clash: string;
    noRoom: string;
    past: string;
    holiday: string;
  };
  actions: {
    calendar: string;
    calendarHint: string;
    share: string;
    copied: string;
    copyFailed: string;
    clear: string;
    clearConfirm: string;
  };
  shared: {
    title: string;
    body: string;
    keep: string;
    mine: string;
  };
  days: Record<number, string>;
  shortDays: Record<number, string>;
  to: string;
  timeSuffix: string;
  baht: string;
  thai: string;
  foreign: string;
};

const en: PlannerCopy = {
  milestones: {
    registration: "Registration",
    payment: "Payment",
    classes: "Classes",
    midterms: "Midterms",
    finals: "Finals",
  },
  strip: {
    registration: "Registration",
    payment: "Payment",
    classes: "Classes",
    midterms: "Midterms",
    finals: "Finals",
  },
  startName: {
    registration: "Registration",
    payment: "Payment",
    classes: "Classes",
    midterms: "Midterms",
    finals: "Finals",
  },
  sep: ", ",
  status: {
    label: "Where the semester is",
    nowRegistration: "Registration is open until 22:30 on {date}",
    nowPayment: "Pay through the TU GREATS app by 22:30 on {date}",
    nowClasses: "Teaching week {week} of {total}",
    nowMidterms: "Midterm week, ending {date}",
    nowFinals: "Final exams run until {date}",
    next: "{name} starts {when}, on {date}",
    tomorrow: "tomorrow",
    ended: "Semester 2 has ended",
    today: "Now",
    done: "Done",
    inDays: { one: "in 1 day", other: "in {n} days" },
  },
  nextUp: {
    label: "Next for you",
    live: "On now",
    today: "Today",
    tomorrow: "Tomorrow",
    kind: { class: "Class", midterm: "Midterm", final: "Final exam" },
    noClasses: "No classes",
  },
  pick: {
    heading: "Pick your courses",
    seeWeek: "See your week",
    quickLabel: "Start with your year",
    quickYear: { year1: "Year 1", year2: "Year 2", year3: "Year 3" },
    quickDone: { one: "Added 1 course", other: "Added {n} courses" },
    quickNone: "Those courses are already in your timetable",
    sectionPrompt: "Choose your LAS101 section below",
    search: "Search courses",
    searchHint: "Code, title, lecturer or room",
    filters: "Show",
    all: "All",
    mine: "My courses",
    fits: "Only courses that fit",
    fitsHint: "Hides courses that clash with what you have picked",
    shortGroups: {
      year1: "Year 1",
      year2: "Year 2",
      year3: "Year 3",
      gov: "GOV",
      pa: "PA",
      gpe: "GPE",
      area: "Area",
      approaches: "Approaches",
    },
    add: "Add",
    remove: "Remove",
    added: "Added",
    section: "Section {section}",
    switchSection: "Switch",
    clash: "Clashes with {codes}",
    examClash: "Exam clash with {codes}",
    needs: "Needs {code} first",
    taughtWith: "Taught jointly with {code}",
    final: "Final",
    midterm: "Midterm",
    noMatch: "No courses match",
    reset: "Clear search",
    count: { one: "1 course", other: "{n} courses" },
    coursePage: "About {code}",
  },
  week: {
    heading: "Your week",
    empty: "Add courses and your week appears here.",
    clashes: { one: "1 clash to sort out", other: "{n} clashes to sort out" },
    noClash: "No clashes",
    credits: "{n} credits",
    fees: "Tuition for {n} credits is {thai} baht for Thai students and {foreign} baht for foreign students.",
    feesOver: "The fee table stops at 21 credits.",
  },
  exams: {
    heading: "Your exams",
    midterms: "Midterms",
    finals: "Finals",
    saturday: "Monday classes sit their midterm on Saturday",
    clash: "Clash",
    noRoom: "Room to be announced",
    past: "Done",
    holiday: "No exams on Tuesday 4 May, Coronation Day.",
  },
  actions: {
    calendar: "Add to my phone calendar",
    calendarHint: "Your courses are already filled in on the calendar page.",
    share: "Copy link to this timetable",
    copied: "Link copied",
    copyFailed: "Copy this link",
    clear: "Start again",
    clearConfirm: "Remove every course from your timetable?",
  },
  shared: {
    title: "You are looking at a shared timetable",
    body: "Someone sent you these courses. Your own timetable is unchanged until you keep them.",
    keep: "Keep as my timetable",
    mine: "Show my timetable",
  },
  days: {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  },
  shortDays: { 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun" },
  to: "to",
  timeSuffix: "",
  baht: "baht",
  thai: "Thai",
  foreign: "Foreign",
};

const th: PlannerCopy = {
  milestones: {
    registration: "ลงทะเบียน",
    payment: "ชำระเงิน",
    classes: "เปิดเรียน",
    midterms: "สอบกลางภาค",
    finals: "สอบปลายภาค",
  },
  strip: {
    registration: "ลงทะเบียน",
    payment: "ชำระเงิน",
    classes: "เปิดเรียน",
    midterms: "กลางภาค",
    finals: "ปลายภาค",
  },
  startName: {
    registration: "เปิดลงทะเบียน",
    payment: "เริ่มชำระเงิน",
    classes: "เปิดเรียน",
    midterms: "สอบกลางภาค",
    finals: "สอบปลายภาค",
  },
  sep: " ",
  status: {
    label: "ภาคการศึกษานี้ถึงไหนแล้ว",
    nowRegistration: "เปิดลงทะเบียนแล้ว ปิด{date} เวลา 22.30 น.",
    nowPayment: "ชำระเงินผ่านแอป TU GREATS ได้ถึง{date} เวลา 22.30 น.",
    nowClasses: "เรียนสัปดาห์ที่ {week} จากทั้งหมด {total} สัปดาห์",
    nowMidterms: "สัปดาห์สอบกลางภาค สอบวันสุดท้าย{date}",
    nowFinals: "ช่วงสอบปลายภาค สอบวันสุดท้าย{date}",
    next: "{when}{name} ตรงกับ{date}",
    tomorrow: "พรุ่งนี้",
    ended: "ภาคการศึกษาที่ 2 จบแล้ว",
    today: "ตอนนี้",
    done: "ผ่านไปแล้ว",
    inDays: { one: "อีก 1 วัน", other: "อีก {n} วัน" },
  },
  nextUp: {
    label: "ต่อไป",
    live: "ตอนนี้",
    today: "วันนี้",
    tomorrow: "พรุ่งนี้",
    kind: { class: "เรียน", midterm: "สอบกลางภาค", final: "สอบปลายภาค" },
    noClasses: "งดการเรียนการสอน",
  },
  pick: {
    heading: "เลือกวิชาที่ลง",
    seeWeek: "ดูตารางเรียนของคุณ",
    quickLabel: "เริ่มจากชั้นปีของคุณ",
    quickYear: { year1: "ปี 1", year2: "ปี 2", year3: "ปี 3" },
    quickDone: { one: "เพิ่มแล้ว 1 วิชา", other: "เพิ่มแล้ว {n} วิชา" },
    quickNone: "วิชาเหล่านี้อยู่ในตารางแล้ว",
    sectionPrompt: "เลือกตอนเรียน LAS101 ของคุณด้านล่าง",
    search: "ค้นหาวิชา",
    searchHint: "ค้นด้วยรหัสวิชา ชื่อวิชา ชื่ออาจารย์ หรือห้อง",
    filters: "แสดง",
    all: "ทั้งหมด",
    mine: "วิชาของฉัน",
    fits: "แสดงเฉพาะวิชาที่เวลาไม่ชน",
    fitsHint: "ซ่อนวิชาที่เวลาเรียนชนกับวิชาที่คุณเลือกไว้",
    shortGroups: {
      year1: "ปี 1",
      year2: "ปี 2",
      year3: "ปี 3",
      gov: "GOV",
      pa: "PA",
      gpe: "GPE",
      area: "Area",
      approaches: "Approaches",
    },
    add: "เพิ่ม",
    remove: "เอาออก",
    added: "เพิ่มแล้ว",
    section: "ตอนเรียน {section}",
    switchSection: "เปลี่ยน",
    clash: "เวลาเรียนชนกับ {codes}",
    examClash: "เวลาสอบชนกับ {codes}",
    needs: "ต้องผ่าน {code} ก่อน",
    taughtWith: "สอนร่วมกับ {code}",
    final: "สอบปลายภาค",
    midterm: "สอบกลางภาค",
    noMatch: "ไม่พบวิชาที่ตรงกัน",
    reset: "ล้างคำค้นหา",
    count: { one: "1 วิชา", other: "{n} วิชา" },
    coursePage: "ข้อมูลวิชา {code}",
  },
  week: {
    heading: "ตารางเรียนของคุณ",
    empty: "เพิ่มวิชาแล้วตารางเรียนจะขึ้นตรงนี้",
    clashes: { one: "มีวิชาเวลาชนกัน 1 คู่", other: "มีวิชาเวลาชนกัน {n} คู่" },
    noClash: "ไม่มีวิชาเวลาชนกัน",
    credits: "{n} หน่วยกิต",
    fees: "ลง {n} หน่วยกิต ค่าเล่าเรียนของนักศึกษาไทยคือ {thai} บาท และของนักศึกษาต่างชาติคือ {foreign} บาท",
    feesOver: "ตารางค่าเล่าเรียนระบุไว้ถึง 21 หน่วยกิตเท่านั้น",
  },
  exams: {
    heading: "ตารางสอบของคุณ",
    midterms: "สอบกลางภาค",
    finals: "สอบปลายภาค",
    saturday: "วิชาที่เรียนวันจันทร์สอบกลางภาควันเสาร์",
    clash: "ชนกัน",
    noRoom: "ยังไม่ประกาศห้องสอบ",
    past: "สอบแล้ว",
    holiday: "วันอังคารที่ 4 พฤษภาคม เป็นวันหยุดราชการ (วันฉัตรมงคล) จึงไม่มีการสอบ",
  },
  actions: {
    calendar: "เพิ่มลงปฏิทินในมือถือ",
    calendarHint: "วิชาที่คุณเลือกไว้จะขึ้นในหน้าปฏิทินโดยอัตโนมัติ",
    share: "คัดลอกลิงก์ตารางนี้",
    copied: "คัดลอกลิงก์แล้ว",
    copyFailed: "คัดลอกลิงก์นี้",
    clear: "เริ่มใหม่",
    clearConfirm: "ต้องการลบทุกวิชาออกจากตารางใช่ไหม",
  },
  shared: {
    title: "ตารางนี้มีคนแชร์มาให้คุณ",
    body: "ตารางของคุณเองจะยังไม่เปลี่ยน จนกว่าคุณจะกดใช้ตารางนี้",
    keep: "ใช้เป็นตารางของฉัน",
    mine: "กลับไปดูตารางของฉัน",
  },
  days: {
    1: "วันจันทร์",
    2: "วันอังคาร",
    3: "วันพุธ",
    4: "วันพฤหัสบดี",
    5: "วันศุกร์",
    6: "วันเสาร์",
    7: "วันอาทิตย์",
  },
  shortDays: { 1: "จ.", 2: "อ.", 3: "พ.", 4: "พฤ.", 5: "ศ.", 6: "ส.", 7: "อา." },
  to: "ถึง",
  timeSuffix: " น.",
  baht: "บาท",
  thai: "ไทย",
  foreign: "ต่างชาติ",
};

export const plannerCopy: Record<Locale, PlannerCopy> = { en, th };
