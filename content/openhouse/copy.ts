import type { Locale } from "@/lib/i18n";

export type Bi = { en: string; th: string };

/** 31 October 2026, 08:00–16:00, Faculty of Political Science, TU Tha Prachan. */
export const OPEN_HOUSE = {
  dateISO: "2026-10-31",
  startHour: 8,
  endHour: 16,
  venue: {
    en: "Faculty of Political Science, Thammasat University, Tha Prachan",
    th: "คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์",
  } satisfies Bi,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Faculty+of+Political+Science+Thammasat+University+Tha+Prachan",
  programmeUrl: "https://polsci.tu.ac.th",
} as const;

/**
 * Curated for the 09:15 scene. The set deliberately spans political theory,
 * public policy, law, political economy, media and international relations so
 * the breadth is felt rather than argued. Titles are resolved from the real
 * course catalogue at build time; the `field` label is BIRSA editorial
 * framing, kept short for the slip.
 */
export const CURATED_COURSES: { code: string; field: Bi }[] = [
  { code: "PI210", field: { en: "Political theory", th: "ปรัชญาการเมือง" } },
  { code: "PI241", field: { en: "Public policy", th: "นโยบายสาธารณะ" } },
  { code: "PI291", field: { en: "International law", th: "กฎหมายระหว่างประเทศ" } },
  { code: "PI293", field: { en: "Political economy", th: "เศรษฐกิจการเมือง" } },
  { code: "PI313", field: { en: "Media and politics", th: "สื่อกับการเมือง" } },
  { code: "PI280", field: { en: "International relations", th: "ความสัมพันธ์ระหว่างประเทศ" } },
];

type Copy = {
  eyebrow: Bi;
  event: Bi;
  headline: Bi;
  sub: Bi;
  walk: Bi;
  hereToday: Bi;
  scroll: Bi;
  arrivalTime: Bi;
  classTime: Bi;
  classKicker: Bi;
  classPrompt: Bi;
  classNote: Bi;
  fullReview: Bi;
  dayTime: Bi;
  dayKicker: Bi;
  daySubtitle: Bi;
  dayEmpty: Bi;
  nameLabel: Bi;
  namePlaceholder: Bi;
  save: Bi;
  copy: Bi;
  copied: Bi;
  share: Bi;
  restart: Bi;
  inviteKicker: Bi;
  inviteHeadline: Bi;
  whenLabel: Bi;
  whereLabel: Bi;
  directions: Bi;
  programme: Bi;
  programmeNote: Bi;
  folioArrival: Bi;
  folioDay: Bi;
  cardChoiceCourse: Bi;
};

export const COPY: Copy = {
  eyebrow: { en: "BIR · Tha Prachan", th: "BIR · ท่าพระจันทร์" },
  event: { en: "Open House · 31 October", th: "Open House · 31 ตุลาคม" },
  headline: {
    en: "A degree is one part of the day.",
    th: "ปริญญาเป็นแค่ส่วนหนึ่งของวันหนึ่ง",
  },
  sub: {
    en: "Come and spend the rest of it with us.",
    th: "มาใช้เวลาที่เหลือของวันด้วยกันสิ",
  },
  walk: { en: "Walk through a day", th: "ลองเดินดูสักวันที่นี่" },
  hereToday: { en: "I’m here at Open House", th: "ฉันอยู่ที่งาน Open House" },
  scroll: { en: "Scroll to begin", th: "เลื่อนลงเพื่อเริ่ม" },
  arrivalTime: { en: "08:42", th: "08:42" },
  classTime: { en: "09:15", th: "09:15" },
  classKicker: { en: "First class", th: "คาบแรก" },
  classPrompt: { en: "What would you sit in on?", th: "อยากลองเข้าเรียนวิชาไหน" },
  classNote: {
    en: "Six of the things people study here. Choose one to keep for your day.",
    th: "หกวิชาที่คนที่นี่เรียนกัน เลือกสักวิชาไว้เป็นส่วนหนึ่งของวันนี้",
  },
  fullReview: { en: "Read the full course review", th: "อ่านรีวิววิชาแบบเต็ม" },
  dayTime: { en: "Your day", th: "วันของคุณ" },
  dayKicker: { en: "Your day", th: "วันของคุณ" },
  daySubtitle: { en: "A day you tried on", th: "วันหนึ่งที่คุณได้ลองใช้" },
  dayEmpty: {
    en: "Make a choice above and it will gather here.",
    th: "เลือกด้านบนสักอย่าง แล้วมันจะมารวมกันตรงนี้",
  },
  nameLabel: { en: "Add your name (optional)", th: "ใส่ชื่อก็ได้ ถ้าอยากใส่" },
  namePlaceholder: { en: "Your name", th: "ชื่อของคุณ" },
  save: { en: "Save card", th: "บันทึกการ์ด" },
  copy: { en: "Copy link", th: "คัดลอกลิงก์" },
  copied: { en: "Link copied", th: "คัดลอกลิงก์แล้ว" },
  share: { en: "Share", th: "แชร์" },
  restart: { en: "Start the day again", th: "เริ่มวันใหม่อีกครั้ง" },
  inviteKicker: { en: "31 October", th: "31 ตุลาคม" },
  inviteHeadline: {
    en: "Come and see it without the screen.",
    th: "มาดูของจริงโดยไม่ต้องผ่านหน้าจอ",
  },
  whenLabel: { en: "When", th: "เมื่อไหร่" },
  whereLabel: { en: "Where", th: "ที่ไหน" },
  directions: { en: "Directions", th: "เส้นทาง" },
  programme: { en: "Official BIR programme", th: "ข้อมูลหลักสูตร BIR อย่างเป็นทางการ" },
  programmeNote: {
    en: "Admissions and programme details are handled by the Faculty, not BIRSA.",
    th: "เรื่องการรับเข้าและรายละเอียดหลักสูตรเป็นของคณะ ไม่ใช่ BIRSA",
  },
  folioArrival: { en: "Arrival", th: "มาถึง" },
  folioDay: { en: "Your day", th: "วันของคุณ" },
  cardChoiceCourse: { en: "Sat in on", th: "เข้าเรียน" },
};

export function t(bi: Bi, locale: Locale): string {
  return bi[locale];
}
