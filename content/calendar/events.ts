/**
 * Front-page activity calendar: the dated items pulled from BIRSA's monthly
 * "activity calendar" Instagram posts (June to August 2026), plus the
 * university-wide academic calendar for AY 2569 taken from the Registrar's
 * PDF (`ปฏิทินการศึกษา ระดับปริญญาตรี ภาคปกติ ประจำปีการศึกษา 2569`). Each
 * event links through to a news/event post via `slug` (locale-less; the
 * calendar builds the locale-aware href). Kept as plain, serialisable data
 * so it can be passed straight into the client `<EventCalendar>` component.
 *
 * The AY 2569 block deliberately excludes every cohort-specific
 * course-registration and tuition-payment window from that PDF: BIR is a
 * special programme with its own registration and payment dates, announced
 * separately by BIRSA, and the regular-programme windows would contradict
 * them. Only the university-wide dates (semester boundaries, exam periods,
 * withdrawal windows, and so on) are carried over.
 *
 * `kind` drives the colour accent:
 *   birsa      : BIRSA's own activities (brand red)
 *   academic   : registration / payment / course dates (forest green)
 *   university : university and faculty commemorations (warning amber)
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
      en: "Summer late registration and add-drop (S/2026)",
      th: "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา ภาคฤดูร้อน (S/2026)",
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
      en: "Course registration (student ID 65 to 68)",
      th: "ลงทะเบียนเรียน (รหัส 65 ถึง 68)",
    },
    slug: "july-2026-activity-calendar",
    kind: "academic",
  },
  {
    id: "jul-payment-6568",
    start: "2026-07-13",
    end: "2026-07-31",
    title: {
      en: "Course payment period (student ID 65 to 68)",
      th: "ช่วงชำระเงินค่าลงทะเบียน (รหัส 65 ถึง 68)",
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

  // ---- August 2026 (from the August activity calendar post) ----------------
  // "Class begins" and the add-drop window are already carried by the AY 2569
  // block below, so they are not repeated here.
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
    id: "aug-bir18-id-cards",
    start: "2026-08-03",
    end: "2026-08-04",
    title: {
      en: "BIR18 student ID card pick-up",
      th: "รับบัตรนักศึกษา BIR18",
    },
    slug: "august-2026-activity-calendar",
    kind: "academic",
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

  // ---- AY 2569 academic calendar: semester 1 --------------------------------
  {
    id: "ay69-s1-open",
    start: "2026-08-03",
    title: {
      en: "Semester 1 begins",
      th: "เปิดภาคการศึกษา ภาค 1",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-add-drop",
    start: "2026-08-03",
    end: "2026-08-16",
    title: {
      en: "Late registration and add-drop (semester 1)",
      th: "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา ภาค 1",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-graduation-request",
    start: "2026-08-03",
    end: "2026-08-16",
    title: {
      en: "Apply to graduate (semester 1)",
      th: "ช่วงแจ้งขอสำเร็จการศึกษา ภาค 1",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-add-drop-payment",
    start: "2026-08-03",
    end: "2026-08-17",
    title: {
      en: "Payment deadline for late registration and add-drop",
      th: "ชำระค่าธรรมเนียมการลงทะเบียนล่าช้าและเพิ่ม-ถอน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-late-fee",
    start: "2026-08-18",
    title: {
      en: "Late-add penalty fees begin",
      th: "วันแรกของการคิดค่าปรับการลงทะเบียนเพิ่มล่าช้ากรณีพิเศษ",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-w-window",
    start: "2026-08-19",
    end: "2026-10-12",
    title: {
      en: "Withdraw a course with a W (online)",
      th: "ขอถอนรายวิชาโดยบันทึกอักษร W (ผ่านระบบ)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-name-removal",
    start: "2026-09-01",
    title: {
      en: "Last day to register or take leave before your name is removed",
      th: "วันสุดท้ายที่ต้องลงทะเบียนหรือลาพักก่อนถูกถอนชื่อ",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-midterm-seating",
    start: "2026-09-14",
    title: {
      en: "Midterm seating plans available",
      th: "วันเริ่มดูและพิมพ์ผังสอบกลางภาค",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-midterms",
    start: "2026-09-20",
    end: "2026-09-27",
    title: {
      en: "Midterm exam period (semester 1)",
      th: "สัปดาห์สอบกลางภาค ภาค 1",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-w-faculty",
    start: "2026-10-13",
    end: "2026-11-22",
    title: {
      en: "Withdraw with a W through the faculty (dean's approval)",
      th: "ขอถอนรายวิชาบันทึกอักษร W ผ่านคณะ (อำนาจคณบดี)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-final-seating",
    start: "2026-11-16",
    title: {
      en: "Final exam seating plans available",
      th: "วันเริ่มดูและพิมพ์ผังสอบปลายภาค",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-last-day",
    start: "2026-11-21",
    title: {
      en: "Last day of semester 1",
      th: "วันสุดท้ายของภาคการศึกษา ภาค 1",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-finals",
    start: "2026-11-23",
    end: "2026-12-11",
    title: {
      en: "Final exam period (semester 1)",
      th: "ช่วงสอบปลายภาค ภาค 1",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },

  // ---- AY 2569 academic calendar: semester 2 --------------------------------
  {
    id: "ay69-s2-open",
    start: "2027-01-04",
    title: {
      en: "Semester 2 begins",
      th: "เปิดภาคการศึกษา ภาค 2",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-add-drop",
    start: "2027-01-04",
    end: "2027-01-17",
    title: {
      en: "Late registration and add-drop (semester 2)",
      th: "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา ภาค 2",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-graduation-request",
    start: "2027-01-04",
    end: "2027-01-17",
    title: {
      en: "Apply to graduate (semester 2)",
      th: "ช่วงแจ้งขอสำเร็จการศึกษา ภาค 2",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-add-drop-payment",
    start: "2027-01-04",
    end: "2027-01-18",
    title: {
      en: "Payment deadline for late registration and add-drop",
      th: "ชำระค่าธรรมเนียมการลงทะเบียนล่าช้าและเพิ่ม-ถอน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-w-window",
    start: "2027-01-18",
    end: "2027-03-14",
    title: {
      en: "Withdraw a course with a W (online)",
      th: "ขอถอนรายวิชาโดยบันทึกอักษร W (ผ่านระบบ)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-late-fee",
    start: "2027-01-19",
    title: {
      en: "Late-add penalty fees begin",
      th: "วันแรกของการคิดค่าปรับการลงทะเบียนเพิ่มล่าช้ากรณีพิเศษ",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-name-removal",
    start: "2027-02-02",
    title: {
      en: "Last day to register or take leave before your name is removed",
      th: "วันสุดท้ายที่ต้องลงทะเบียนหรือลาพักก่อนถูกถอนชื่อ",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-midterm-seating",
    start: "2027-02-15",
    title: {
      en: "Midterm seating plans available",
      th: "วันเริ่มดูและพิมพ์ผังสอบกลางภาค",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-midterms",
    start: "2027-02-21",
    end: "2027-02-28",
    title: {
      en: "Midterm exam period (semester 2)",
      th: "สัปดาห์สอบกลางภาค ภาค 2",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-w-faculty",
    start: "2027-03-15",
    end: "2027-05-02",
    title: {
      en: "Withdraw with a W through the faculty (dean's approval)",
      th: "ขอถอนรายวิชาบันทึกอักษร W ผ่านคณะ (อำนาจคณบดี)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
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
  {
    id: "ay69-s2-resume",
    start: "2027-04-19",
    title: {
      en: "Classes resume after Songkran",
      th: "เปิดการเรียนการสอน ภาค 2 ต่อ",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-final-seating",
    start: "2027-04-26",
    title: {
      en: "Final exam seating plans available",
      th: "วันเริ่มดูและพิมพ์ผังสอบปลายภาค",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-last-day",
    start: "2027-05-01",
    title: {
      en: "Last day of semester 2",
      th: "วันสุดท้ายของภาคการศึกษา ภาค 2",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-finals",
    start: "2027-05-03",
    end: "2027-05-18",
    title: {
      en: "Final exam period (semester 2)",
      th: "ช่วงสอบปลายภาค ภาค 2",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },

  // ---- AY 2569 academic calendar: summer session -----------------------------
  {
    id: "ay69-sum-open",
    start: "2027-06-07",
    title: {
      en: "Summer session begins",
      th: "เปิดภาคฤดูร้อน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-add-drop",
    start: "2027-06-07",
    end: "2027-06-13",
    title: {
      en: "Late registration and add-drop (summer)",
      th: "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา ภาคฤดูร้อน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-graduation-request",
    start: "2027-06-07",
    end: "2027-06-13",
    title: {
      en: "Apply to graduate (summer)",
      th: "ช่วงแจ้งขอสำเร็จการศึกษา ภาคฤดูร้อน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-add-drop-payment",
    start: "2027-06-07",
    end: "2027-06-14",
    title: {
      en: "Payment deadline for late registration and add-drop",
      th: "ชำระค่าธรรมเนียมการลงทะเบียนล่าช้าและเพิ่ม-ถอน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-late-fee",
    start: "2027-06-15",
    title: {
      en: "Late-add penalty fees begin",
      th: "วันแรกของการคิดค่าปรับการลงทะเบียนเพิ่มล่าช้ากรณีพิเศษ",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-w-window",
    start: "2027-06-16",
    end: "2027-07-04",
    title: {
      en: "Withdraw a course with a W (online)",
      th: "ขอถอนรายวิชาโดยบันทึกอักษร W (ผ่านระบบ)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-final-seating",
    start: "2027-07-05",
    title: {
      en: "Final exam seating plans available",
      th: "วันเริ่มดูและพิมพ์ผังสอบปลายภาค",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-w-faculty",
    start: "2027-07-05",
    end: "2027-07-16",
    title: {
      en: "Withdraw with a W through the faculty (dean's approval)",
      th: "ขอถอนรายวิชาบันทึกอักษร W ผ่านคณะ (อำนาจคณบดี)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-last-day",
    start: "2027-07-12",
    end: "2027-07-15",
    title: {
      en: "Last day of the summer session",
      th: "วันสุดท้ายของภาคฤดูร้อน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-finals",
    start: "2027-07-17",
    end: "2027-07-20",
    title: {
      en: "Final exam period (summer)",
      th: "ช่วงสอบปลายภาค ภาคฤดูร้อน",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },

  // ---- AY 2569 academic calendar: deadlines for resolving an I grade --------
  {
    id: "ay69-s1-incomplete-new",
    start: "2027-01-20",
    title: {
      en: "Semester 1 I grades resolved (students admitted 2568 onwards)",
      th: "วันสุดท้ายส่งผลสอบรายวิชาที่ติด I ภาค 1 (นศ. ตั้งแต่ปี 2568)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s1-incomplete-old",
    start: "2027-02-19",
    title: {
      en: "Semester 1 I grades resolved (students admitted before 2568)",
      th: "วันสุดท้ายส่งผลสอบรายวิชาที่ติด I ภาค 1 (นศ. ก่อนปี 2568)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-incomplete-new",
    start: "2027-06-30",
    title: {
      en: "Semester 2 I grades resolved (students admitted 2568 onwards)",
      th: "วันสุดท้ายส่งผลสอบรายวิชาที่ติด I ภาค 2 (นศ. ตั้งแต่ปี 2568)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-s2-incomplete-old",
    start: "2027-07-30",
    title: {
      en: "Semester 2 I grades resolved (students admitted before 2568)",
      th: "วันสุดท้ายส่งผลสอบรายวิชาที่ติด I ภาค 2 (นศ. ก่อนปี 2568)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-incomplete-new",
    start: "2027-09-13",
    title: {
      en: "Summer I grades resolved (students admitted 2568 onwards)",
      th: "วันสุดท้ายส่งผลสอบรายวิชาที่ติด I ภาคฤดูร้อน (นศ. ตั้งแต่ปี 2568)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
  {
    id: "ay69-sum-incomplete-old",
    start: "2027-10-13",
    title: {
      en: "Summer I grades resolved (students admitted before 2568)",
      th: "วันสุดท้ายส่งผลสอบรายวิชาที่ติด I ภาคฤดูร้อน (นศ. ก่อนปี 2568)",
    },
    slug: "academic-calendar-2569",
    kind: "academic",
  },
];
