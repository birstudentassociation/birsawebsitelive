/**
 * Front-page activity calendar: the dated items pulled from BIRSA's monthly
 * "activity calendar" Instagram posts (June to August 2026), the dates set out
 * in individual news and event posts, plus the closure for Songkran from the
 * Registrar's AY 2569 calendar. Each event links through
 * to a news/event post via `slug` (locale-less; the calendar builds the
 * locale-aware href). Kept as plain, serialisable data so it can be passed
 * straight into the client `<EventCalendar>` component.
 *
 * This calendar carries no academic dates. Registration, payment, add-drop,
 * withdrawal, exam and I-grade windows are deliberately absent: BIR is a
 * special programme whose own dates are announced separately by BIRSA, and the
 * regular-programme windows in the Registrar's PDF would contradict them. The
 * Registrar's university-wide dates live in the `academic-calendar-2569` news
 * post instead.
 *
 * `kind` drives the colour accent:
 *   birsa      : BIRSA's own activities (brand red)
 *   university : university and faculty commemorations (warning amber)
 */
import type { Locale } from "@/lib/i18n";

export type CalendarEventKind = "birsa" | "university";

export type CalendarEvent = {
  id: string;
  /** Inclusive start date, `YYYY-MM-DD`. */
  start: string;
  /** Inclusive end date for multi-day items, `YYYY-MM-DD`. Omit for single-day. */
  end?: string;
  title: Record<Locale, string>;
  /** News slug to open when the item is clicked (no locale prefix). */
  slug: string;
  kind: CalendarEventKind;
};

export const calendarEvents: CalendarEvent[] = [
  // ---- June 2026 (from the June activity calendar post) --------------------
  {
    id: "jun-faculty-anniversary",
    start: "2026-06-14",
    title: {
      en: "Faculty of Political Science (77th Foundation Day)",
      th: "วันสถาปนาคณะรัฐศาสตร์ ครบรอบ 77 ปี",
    },
    slug: "faculty-77th-anniversary",
    kind: "university",
  },
  {
    id: "jun-recruitment",
    start: "2026-06-15",
    end: "2026-06-25",
    title: {
      en: "Round 1 of sub-committee recruitment",
      th: "เปิดรับสมัครอนุกรรมการ รอบที่ 1",
    },
    slug: "birsa-committee-recruitment",
    kind: "birsa",
  },
  {
    id: "jun-revolution-day",
    start: "2026-06-24",
    title: {
      en: "Siamese Revolution Day 1932",
      th: "วันอภิวัฒน์สยาม 2475",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "jun-tu-anniversary",
    start: "2026-06-27",
    title: {
      en: "Thammasat University (92nd Foundation Day)",
      th: "วันสถาปนามหาวิทยาลัยธรรมศาสตร์ ครบรอบ 92 ปี",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "jun-recruitment-interviews",
    start: "2026-06-27",
    end: "2026-06-28",
    title: {
      en: "Sub-committee interviews",
      th: "สัมภาษณ์ผู้สมัครอนุกรรมการ",
    },
    slug: "birsa-committee-recruitment",
    kind: "birsa",
  },
  {
    id: "jun-subcommittee-results",
    start: "2026-06-30",
    title: {
      en: "Sub-committee results announced",
      th: "ประกาศผลการคัดเลือกอนุกรรมการ",
    },
    slug: "birsa-subcommittee-appointment-2026",
    kind: "birsa",
  },
  {
    id: "jun-singhadang-registration-closes",
    start: "2026-06-30",
    title: {
      en: "Singhadang Samphan registration closes at 23:59",
      th: "ปิดลงทะเบียนสิงห์แดงสัมพันธ์ เวลา 23.59 น.",
    },
    slug: "singhadang-samphan-2026",
    kind: "university",
  },

  // ---- July 2026 (from the July activity calendar post) --------------------
  {
    id: "jul-newbies",
    start: "2026-07-21",
    title: {
      en: "BIR The Newbies 2026",
      th: "BIR The Newbies 2026",
    },
    slug: "activity-calendar",
    kind: "birsa",
  },
  {
    id: "jul-presession",
    start: "2026-07-22",
    title: {
      en: "BIR18 pre-session",
      th: "ปฐมนิเทศเบื้องต้น BIR18",
    },
    slug: "bir18-pre-session",
    kind: "birsa",
  },
  {
    id: "jul-orientation",
    start: "2026-07-24",
    title: {
      en: "BIR18 orientation",
      th: "ปฐมนิเทศ BIR18",
    },
    slug: "freshers-orientation-2026",
    kind: "birsa",
  },
  {
    id: "jul-singhadang",
    start: "2026-07-31",
    title: {
      en: "Singhadang Samphan",
      th: "สิงห์แดงสัมพันธ์",
    },
    slug: "singhadang-samphan-2026",
    kind: "birsa",
  },

  // ---- August 2026 (from the August activity calendar post) ----------------
  {
    id: "aug-polsci-orientation",
    start: "2026-08-01",
    title: {
      en: "Faculty of Political Science orientation",
      th: "ปฐมนิเทศนักศึกษาใหม่ คณะรัฐศาสตร์",
    },
    slug: "polsci-orientation-2026",
    kind: "university",
  },
  {
    id: "aug-tu-freshy-orientation",
    start: "2026-08-02",
    title: {
      en: "TU Freshy Orientation",
      th: "ปฐมนิเทศนักศึกษาใหม่ มหาวิทยาลัยธรรมศาสตร์ (TU Freshy Orientation)",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "aug-mfa-required",
    start: "2026-08-01",
    title: {
      en: "Multi-factor authentication required on university accounts",
      th: "เริ่มบังคับใช้การยืนยันตัวตนหลายขั้นตอน (MFA) กับบัญชีมหาวิทยาลัย",
    },
    slug: "mfa-required-august-2026",
    kind: "university",
  },
  {
    id: "aug-council-applications",
    start: "2026-08-10",
    end: "2026-08-14",
    title: {
      en: "BIR18 Student Council applications",
      th: "เปิดรับสมัครคณะกรรมการนักศึกษา BIR18",
    },
    slug: "bir18-student-council-election-2026",
    kind: "birsa",
  },
  {
    id: "aug-back-to-school",
    start: "2026-08-11",
    end: "2026-08-12",
    title: {
      en: "Back to School by TPC Music",
      th: "Back to School by TPC Music",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "aug-tpc-crazy-week",
    start: "2026-08-11",
    end: "2026-08-19",
    title: {
      en: "TPC Crazy Week",
      th: "TPC Crazy Week",
    },
    slug: "tpc-crazy-week-2026",
    kind: "university",
  },
  {
    id: "aug-mothers-day",
    start: "2026-08-12",
    title: {
      en: "Mother's Day (public holiday, no classes)",
      th: "วันแม่แห่งชาติ (วันหยุดราชการ ไม่มีการเรียนการสอน)",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "aug-thai-peace-day",
    start: "2026-08-16",
    title: {
      en: "Thai Peace Day",
      th: "วันสันติภาพไทย",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "aug-council-candidates",
    start: "2026-08-16",
    title: {
      en: "BIR18 Student Council candidates announced",
      th: "ประกาศรายชื่อผู้สมัครคณะกรรมการนักศึกษา BIR18",
    },
    slug: "bir18-student-council-candidates-2026",
    kind: "birsa",
  },
  {
    id: "aug-council-campaign",
    start: "2026-08-16",
    end: "2026-08-24",
    title: {
      en: "BIR18 Student Council election campaign",
      th: "ช่วงหาเสียงเลือกตั้งคณะกรรมการนักศึกษา BIR18",
    },
    slug: "bir18-student-council-election-2026",
    kind: "birsa",
  },
  {
    id: "aug-boat-closure-17",
    start: "2026-08-17",
    title: {
      en: "River closed from 12:30 for royal barge rehearsal",
      th: "ปิดการเดินเรือตั้งแต่ 12.30 น. เพื่อซ้อมขบวนเรือพระราชพิธี",
    },
    slug: "express-boat-royal-barge-rehearsals-august-2026",
    kind: "university",
  },
  {
    id: "aug-tpc-firstmeet",
    start: "2026-08-19",
    title: {
      en: "TPC Firstmeet",
      th: "TPC Firstmeet",
    },
    slug: "activity-calendar",
    kind: "university",
  },
  {
    id: "aug-council-policy",
    start: "2026-08-19",
    title: {
      en: "BIR18 candidates present their policies, 12:30 in R.102",
      th: "ผู้สมัคร BIR18 แถลงนโยบาย 12.30 น. ห้อง ร.102",
    },
    slug: "bir18-student-council-candidates-2026",
    kind: "birsa",
  },
  {
    id: "aug-boat-closure-20",
    start: "2026-08-20",
    title: {
      en: "River closed from 12:30 for royal barge rehearsal",
      th: "ปิดการเดินเรือตั้งแต่ 12.30 น. เพื่อซ้อมขบวนเรือพระราชพิธี",
    },
    slug: "express-boat-royal-barge-rehearsals-august-2026",
    kind: "university",
  },
  {
    id: "aug-council-election",
    start: "2026-08-24",
    title: {
      en: "BIR18 Student Council election day",
      th: "วันเลือกตั้งคณะกรรมการนักศึกษา BIR18",
    },
    slug: "bir18-student-council-election-2026",
    kind: "birsa",
  },
  {
    id: "aug-boat-closure-27",
    start: "2026-08-27",
    title: {
      en: "River closed from 12:30 for royal barge rehearsal",
      th: "ปิดการเดินเรือตั้งแต่ 12.30 น. เพื่อซ้อมขบวนเรือพระราชพิธี",
    },
    slug: "express-boat-royal-barge-rehearsals-august-2026",
    kind: "university",
  },

  // ---- September to December 2026 (from news and event posts) -------------
  {
    id: "sep-council-appointed",
    start: "2026-09-01",
    title: {
      en: "BIR18 Student Council appointed",
      th: "แต่งตั้งคณะกรรมการแกนนักศึกษา BIR รุ่นที่ 18",
    },
    slug: "bir18-student-council-appointed-2026",
    kind: "university",
  },
  {
    id: "sep-bitkub-survival-guide",
    start: "2026-09-02",
    title: {
      en: "Bitkub x BIR Survival Guide, 16:30 in R.102",
      th: "Bitkub x BIR Survival Guide 16.30 น. ห้อง ร.102",
    },
    slug: "bitkub-bir-survival-guide-2026",
    kind: "birsa",
  },
  {
    id: "sep-asa-ir-applications",
    start: "2026-09-10",
    end: "2026-09-24",
    title: {
      en: "ASA IR 6 camp applications",
      th: "เปิดรับสมัครลูกค่ายอาสาไออาร์ 6",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },
  {
    id: "sep-chitchat-with-ajarns",
    start: "2026-09-16",
    title: {
      en: "Chitchat with Ajarns, 16:30 in R.102",
      th: "Chitchat with Ajarns 16.30 น. ห้อง ร.102",
    },
    slug: "chitchat-with-ajarns-2026",
    kind: "birsa",
  },
  {
    id: "sep-asa-ir-interviews",
    start: "2026-09-28",
    end: "2026-09-30",
    title: {
      en: "ASA IR 6 interviews",
      th: "สัมภาษณ์ลูกค่ายอาสาไออาร์ 6",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },
  {
    id: "oct-asa-ir-announcement",
    start: "2026-10-02",
    title: {
      en: "ASA IR 6 camp members announced",
      th: "ประกาศรายชื่อลูกค่ายอาสาไออาร์ 6",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },
  {
    id: "oct-asa-ir-workshop-1",
    start: "2026-10-04",
    title: {
      en: "ASA IR 6 first workshop",
      th: "เวิร์กช็อปครั้งที่ 1 ค่ายอาสาไออาร์ 6",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },
  {
    id: "oct-asa-ir-fundraising",
    start: "2026-10-06",
    end: "2026-11-07",
    title: {
      en: "ASA IR 6 fundraising",
      th: "ระดมทุนค่ายอาสาไออาร์ 6",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },
  {
    id: "nov-asa-ir-workshop-2",
    start: "2026-11-14",
    title: {
      en: "ASA IR 6 second workshop",
      th: "เวิร์กช็อปครั้งที่ 2 ค่ายอาสาไออาร์ 6",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },
  {
    id: "dec-asa-ir-camp",
    start: "2026-12-13",
    end: "2026-12-24",
    title: {
      en: "ASA IR 6 camp in Omkoi, Chiang Mai",
      th: "ออกค่ายอาสาไออาร์ 6 อำเภออมก๋อย จังหวัดเชียงใหม่",
    },
    slug: "asa-ir-6-camp-recruitment",
    kind: "university",
  },

  // ---- AY 2569, from the Registrar's calendar -------------------------------
  {
    id: "ay69-s2-songkran",
    start: "2027-04-12",
    end: "2027-04-18",
    title: {
      en: "No classes for Songkran",
      th: "งดจัดการเรียนการสอนช่วงเทศกาลสงกรานต์",
    },
    slug: "academic-calendar-2569",
    kind: "university",
  },
];
