import type { Locale } from "@/lib/i18n";

export type PlanCardCopy = {
  emptyHeading: string;
  emptyBody: string;
  emptyLink: string;
  heading: string;
  creditsDone: string;
  creditsOnly: string;
  nextTermCourses: string;
  semester: string;
  summer: string;
  yearTerm: string;
  fixPrerequisite: string;
  reviewFinding: string;
  continuePlan: string;
  savedOnDevice: string;
  clearPlan: string;
};

export const planCardCopy: Record<Locale, PlanCardCopy> = {
  en: {
    emptyHeading: "Plan your BIR degree",
    emptyBody: "See which courses you still need and build next term.",
    emptyLink: "Start a plan",
    heading: "Your study plan",
    creditsDone: "{done} of {total} credits done",
    creditsOnly: "{done} credits done",
    nextTermCourses: "{count} courses chosen for {term}",
    semester: "semester {n}",
    summer: "summer",
    yearTerm: "year {year}, {term}",
    fixPrerequisite: "Fix the prerequisite in your plan",
    reviewFinding: "Review this in your plan",
    continuePlan: "Continue your plan",
    savedOnDevice: "Saved only on this device.",
    clearPlan: "Clear saved plan",
  },
  th: {
    emptyHeading: "วางแผนการเรียน BIR",
    emptyBody: "ดูว่ายังต้องเรียนวิชาอะไรบ้าง แล้วจัดวิชาเทอมหน้า",
    emptyLink: "เริ่มวางแผน",
    heading: "แผนการเรียน",
    creditsDone: "เรียนผ่านแล้ว {done} จาก {total} หน่วยกิต",
    creditsOnly: "เรียนผ่านแล้ว {done} หน่วยกิต",
    nextTermCourses: "{term} เลือกไว้ {count} วิชา",
    semester: "ภาคเรียนที่ {n}",
    summer: "ภาคฤดูร้อน",
    yearTerm: "ชั้นปีที่ {year} {term}",
    fixPrerequisite: "แก้เรื่องวิชาบังคับก่อนในแผน",
    reviewFinding: "ดูรายละเอียดในแผน",
    continuePlan: "ทำแผนต่อ",
    savedOnDevice: "บันทึกไว้ในอุปกรณ์เครื่องนี้เท่านั้น",
    clearPlan: "ลบแผนที่บันทึกไว้",
  },
};
