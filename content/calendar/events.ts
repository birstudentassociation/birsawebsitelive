/**
 * Front-page activity calendar: the dated items pulled from BIRSA's monthly
 * "activity calendar" Instagram posts (June to August 2026), plus the closure
 * for Songkran from the Registrar's AY 2569 calendar. Each event links through
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
    title: {
      en: "Round 1 of sub-committee recruitment opens",
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
    slug: "june-2026-activity-calendar",
    kind: "university",
  },
  {
    id: "jun-tu-anniversary",
    start: "2026-06-27",
    title: {
      en: "Thammasat University (92nd Foundation Day)",
      th: "วันสถาปนามหาวิทยาลัยธรรมศาสตร์ ครบรอบ 92 ปี",
    },
    slug: "june-2026-activity-calendar",
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
    slug: "july-2026-activity-calendar",
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
    slug: "august-2026-activity-calendar",
    kind: "university",
  },
  {
    id: "aug-back-to-school",
    start: "2026-08-11",
    end: "2026-08-12",
    title: {
      en: "Back to School by TPC Music",
      th: "Back to School by TPC Music",
    },
    slug: "august-2026-activity-calendar",
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
    slug: "august-2026-activity-calendar",
    kind: "university",
  },
  {
    id: "aug-thai-peace-day",
    start: "2026-08-16",
    title: {
      en: "Thai Peace Day",
      th: "วันสันติภาพไทย",
    },
    slug: "august-2026-activity-calendar",
    kind: "university",
  },
  {
    id: "aug-tpc-firstmeet",
    start: "2026-08-19",
    title: {
      en: "TPC Firstmeet",
      th: "TPC Firstmeet",
    },
    slug: "august-2026-activity-calendar",
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
