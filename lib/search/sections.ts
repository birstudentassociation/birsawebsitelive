/**
 * Display labels for result sections, and the order they are offered in as
 * filters. Order is by how often a section answers a question, not
 * alphabetically: guided answers and things you can do come before reference
 * material you have to read and interpret.
 */
import type { Locale } from "@/lib/i18n";
import type { SectionKey } from "@/lib/search/types";

export const sectionOrder: SectionKey[] = [
  "answers",
  "services",
  "tools",
  "equipment",
  "student-life",
  "courses",
  "clubs",
  "news",
  "activity",
  "regulations",
  "places",
  "quick",
  "emergency",
  "page",
];

const labels: Record<SectionKey, { en: string; th: string }> = {
  answers: { en: "Guided answers", th: "คำตอบแบบนำทาง" },
  services: { en: "Services", th: "บริการ" },
  tools: { en: "Tools", th: "เครื่องมือ" },
  equipment: { en: "Equipment loan", th: "การยืมอุปกรณ์" },
  "student-life": { en: "Student life", th: "ชีวิตนักศึกษา" },
  courses: { en: "Courses", th: "รายวิชา" },
  clubs: { en: "Clubs", th: "ชมรม" },
  news: { en: "News and events", th: "ข่าวและกิจกรรม" },
  activity: { en: "BIRSA activity", th: "การดำเนินงานของ BIRSA" },
  regulations: { en: "Regulations", th: "ระเบียบ" },
  places: { en: "Places nearby", th: "สถานที่ใกล้เคียง" },
  quick: { en: "Quick links", th: "ทางลัด" },
  emergency: { en: "Emergency", th: "เหตุฉุกเฉิน" },
  page: { en: "Site pages", th: "หน้าเว็บไซต์" },
};

export function sectionLabel(locale: Locale, section: SectionKey): string {
  return labels[section][locale];
}
