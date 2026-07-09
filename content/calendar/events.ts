/**
 * Front-page activity calendar — the dated items pulled from BIRSA's monthly
 * "activity calendar" Instagram posts (June + July 2026). Each event links
 * through to a news/event post via `slug` (locale-less; the calendar builds
 * the locale-aware href). Kept as plain, serialisable data so it can be
 * passed straight into the client `<EventCalendar>` component.
 *
 * `kind` drives the colour accent:
 *   birsa      — BIRSA's own activities (brand red)
 *   academic   — registration / payment / course dates (forest green)
 *   university — university & faculty commemorations (warning amber)
 */
import type { Locale } from "@/lib/i18n";

export type CalendarEventKind = "birsa" | "academic" | "university";

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
    id: "jun-late-reg",
    start: "2026-06-02",
    end: "2026-06-08",
    title: {
      en: "Summer late registration & add–drop (S/2026)",
      th: "ลงทะเบียนล่าช้าและเพิ่ม–ถอนรายวิชา ภาคฤดูร้อน (S/2026)",
    },
    slug: "june-2026-activity-calendar",
    kind: "academic",
  },
  {
    id: "jun-payment",
    start: "2026-06-02",
    end: "2026-06-09",
    title: {
      en: "Summer payment period (S/2026)",
      th: "ช่วงชำระเงิน ภาคฤดูร้อน (S/2026)",
    },
    slug: "june-2026-activity-calendar",
    kind: "academic",
  },
  {
    id: "jun-summer-start",
    start: "2026-06-10",
    title: {
      en: "Summer courses begin",
      th: "เปิดเรียนภาคฤดูร้อน",
    },
    slug: "june-2026-activity-calendar",
    kind: "academic",
  },
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
    id: "jul-bir18-registration",
    start: "2026-07-01",
    end: "2026-07-10",
    title: {
      en: "BIR18 TU student registration",
      th: "ขึ้นทะเบียนนักศึกษาใหม่ BIR18",
    },
    slug: "july-2026-activity-calendar",
    kind: "academic",
  },
  {
    id: "jul-course-reg-6568",
    start: "2026-07-13",
    title: {
      en: "Course registration (student ID 65–68)",
      th: "ลงทะเบียนเรียน (รหัส 65–68)",
    },
    slug: "july-2026-activity-calendar",
    kind: "academic",
  },
  {
    id: "jul-payment-6568",
    start: "2026-07-13",
    end: "2026-07-31",
    title: {
      en: "Course payment period (student ID 65–68)",
      th: "ช่วงชำระเงินค่าลงทะเบียน (รหัส 65–68)",
    },
    slug: "july-2026-activity-calendar",
    kind: "academic",
  },
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
    slug: "july-2026-activity-calendar",
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
    id: "jul-course-reg-69",
    start: "2026-07-24",
    title: {
      en: "Course registration (student ID 69)",
      th: "ลงทะเบียนเรียน (รหัส 69)",
    },
    slug: "july-2026-activity-calendar",
    kind: "academic",
  },
  {
    id: "jul-payment-69",
    start: "2026-07-24",
    end: "2026-07-31",
    title: {
      en: "Course payment period (student ID 69)",
      th: "ช่วงชำระเงินค่าลงทะเบียน (รหัส 69)",
    },
    slug: "july-2026-activity-calendar",
    kind: "academic",
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
];
