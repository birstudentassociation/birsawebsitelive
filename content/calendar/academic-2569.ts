/**
 * Thammasat AY 2569 academic calendar, from the Registrar's PDF, with BIR's
 * own semester 2 dates from the BIR office. Rendered by `<AcademicCalendar>`
 * in the `academic-calendar-2569` news post. Dates are inclusive `YYYY-MM-DD`.
 */
import type { Locale } from "@/lib/i18n";

export type AcademicItemKind =
  "term" | "registration" | "withdrawal" | "exam" | "holiday" | "deadline";

export type AcademicItem = {
  id: string;
  start: string;
  end?: string;
  kind: AcademicItemKind;
  title: Record<Locale, string>;
};

export type AcademicTrack = "bir" | "registrar";

export type AcademicPeriod = {
  id: string;
  title: Record<Locale, string>;
  /** Shown only for this track. Omit for periods every student follows. */
  track?: AcademicTrack;
  intro?: Record<Locale, string>;
  items: AcademicItem[];
  notes?: Record<Locale, string>[];
};

const t = (en: string, th: string): Record<Locale, string> => ({ en, th });

export const academicCalendar2569: AcademicPeriod[] = [
  {
    id: "s1",
    title: t("Semester 1", "ภาคการศึกษาที่ 1"),
    items: [
      {
        id: "s1-begin",
        start: "2026-08-03",
        kind: "term",
        title: t("Semester 1 begins", "เปิดภาคการศึกษาที่ 1"),
      },
      {
        id: "s1-late-reg",
        start: "2026-08-03",
        end: "2026-08-16",
        kind: "registration",
        title: t("Late registration and add-drop", "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา"),
      },
      {
        id: "s1-graduate",
        start: "2026-08-03",
        end: "2026-08-16",
        kind: "deadline",
        title: t("Apply to graduate", "แจ้งขอสำเร็จการศึกษา"),
      },
      {
        id: "s1-late-pay",
        start: "2026-08-03",
        end: "2026-08-17",
        kind: "registration",
        title: t(
          "Pay for late registration and add-drop",
          "ชำระค่าธรรมเนียมลงทะเบียนล่าช้าและเพิ่ม-ถอน"
        ),
      },
      {
        id: "s1-penalty",
        start: "2026-08-18",
        kind: "deadline",
        title: t("Late-add penalty fees begin", "เริ่มคิดค่าปรับการลงทะเบียนเพิ่มล่าช้ากรณีพิเศษ"),
      },
      {
        id: "s1-w-online",
        start: "2026-08-19",
        end: "2026-10-26",
        kind: "withdrawal",
        title: t(
          "Withdraw a course with a W online, extended by the university after the flooding",
          "ถอนรายวิชาโดยบันทึกอักษร W ผ่านระบบ มหาวิทยาลัยขยายเวลาให้เนื่องจากน้ำท่วม"
        ),
      },
      {
        id: "s1-removal",
        start: "2026-09-01",
        kind: "deadline",
        title: t(
          "Last day to register or take leave before the university removes your name",
          "วันสุดท้ายที่ต้องลงทะเบียนหรือลาพัก ไม่อย่างนั้นจะถูกถอนชื่อ"
        ),
      },
      {
        id: "s1-mid-seats",
        start: "2026-09-14",
        kind: "exam",
        title: t("Midterm seating plans go up", "เริ่มดูและพิมพ์ผังสอบกลางภาคได้"),
      },
      {
        id: "s1-midterms",
        start: "2026-09-20",
        end: "2026-09-27",
        kind: "exam",
        title: t("Midterm exams", "สอบกลางภาค"),
      },
      {
        id: "s1-w-faculty",
        start: "2026-10-27",
        end: "2026-11-22",
        kind: "withdrawal",
        title: t(
          "Withdraw with a W through the faculty, with the dean's approval",
          "ถอนรายวิชาโดยบันทึกอักษร W ผ่านคณะ ตามอำนาจคณบดี"
        ),
      },
      {
        id: "s1-final-seats",
        start: "2026-11-16",
        kind: "exam",
        title: t("Final exam seating plans go up", "เริ่มดูและพิมพ์ผังสอบปลายภาคได้"),
      },
      {
        id: "s1-last-day",
        start: "2026-11-21",
        kind: "term",
        title: t("Last day of semester 1", "วันสุดท้ายของภาคการศึกษาที่ 1"),
      },
      {
        id: "s1-finals",
        start: "2026-11-23",
        end: "2026-12-11",
        kind: "exam",
        title: t("Final exams", "สอบปลายภาค"),
      },
    ],
    notes: [
      t(
        "The final exam period is not continuous. Exams run 23 to 30 November, then 1 to 4, 8 to 9 and 11 December 2026.",
        "ช่วงสอบปลายภาคไม่ได้สอบต่อเนื่องกันทุกวัน วันสอบจริงคือ 23 ถึง 30 พฤศจิกายน จากนั้น 1 ถึง 4, 8 ถึง 9 และ 11 ธันวาคม 2569"
      ),
      t(
        "The BIR office announces BIR's own semester 1 dates separately. Follow them where they differ.",
        "สำนักงานโครงการ BIR ประกาศกำหนดการภาคการศึกษาที่ 1 ของ BIR แยกต่างหาก หากวันที่ไม่ตรงกันให้ยึดตามกำหนดการของ BIR"
      ),
    ],
  },
  {
    id: "s2-bir",
    title: t("Semester 2 for BIR", "ภาคการศึกษาที่ 2 ของ BIR"),
    track: "bir",
    intro: t(
      "The BIR office sets these dates for BIR students. Follow them rather than the Registrar's semester 2 dates.",
      "สำนักงานโครงการ BIR กำหนดวันเหล่านี้สำหรับนักศึกษา BIR ให้ยึดตามนี้แทนกำหนดการภาคการศึกษาที่ 2 ของสำนักงานทะเบียนนักศึกษา"
    ),
    items: [
      {
        id: "s2b-register",
        start: "2026-11-30",
        end: "2026-12-04",
        kind: "registration",
        title: t("Register for courses at reg.tu.ac.th", "ลงทะเบียนเรียนที่ reg.tu.ac.th"),
      },
      {
        id: "s2b-pay",
        start: "2026-11-30",
        end: "2027-01-01",
        kind: "registration",
        title: t(
          "Pay registration fees in the TU GREATS app",
          "ชำระค่าธรรมเนียมการลงทะเบียนผ่านแอป TU GREATS"
        ),
      },
      {
        id: "s2b-begin",
        start: "2027-01-04",
        kind: "term",
        title: t("Semester 2 begins", "เปิดภาคการศึกษาที่ 2"),
      },
      {
        id: "s2b-graduate",
        start: "2027-01-04",
        end: "2027-01-17",
        kind: "deadline",
        title: t("Apply to graduate", "แจ้งขอสำเร็จการศึกษา"),
      },
      {
        id: "s2b-late-reg",
        start: "2027-01-04",
        end: "2027-01-17",
        kind: "registration",
        title: t(
          "Late registration and add-drop, with no W on your record",
          "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา โดยไม่บันทึก W"
        ),
      },
      {
        id: "s2b-late-pay",
        start: "2027-01-04",
        end: "2027-01-18",
        kind: "registration",
        title: t(
          "Pay for late registration and add-drop",
          "ชำระค่าธรรมเนียมลงทะเบียนล่าช้าและเพิ่ม-ถอน"
        ),
      },
      {
        id: "s2b-w",
        start: "2027-01-18",
        end: "2027-03-14",
        kind: "withdrawal",
        title: t("Withdraw a course with a W", "ถอนรายวิชาโดยบันทึกอักษร W"),
      },
      {
        id: "s2b-makha",
        start: "2027-02-22",
        kind: "holiday",
        title: t("Substitute holiday for Makha Bucha Day", "วันหยุดชดเชยวันมาฆบูชา"),
      },
      {
        id: "s2b-midterms",
        start: "2027-02-23",
        end: "2027-02-27",
        kind: "exam",
        title: t("BIR midterm exams, with no classes", "สอบกลางภาคของ BIR ไม่มีการเรียนการสอน"),
      },
      {
        id: "s2b-w-special",
        start: "2027-03-15",
        end: "2027-05-02",
        kind: "withdrawal",
        title: t(
          "Ask the programme for a special withdrawal, recorded with a W",
          "ติดต่อโครงการเพื่อขอถอนรายวิชากรณีพิเศษ โดยบันทึกอักษร W"
        ),
      },
      {
        id: "s2b-chakri",
        start: "2027-04-06",
        kind: "holiday",
        title: t("Chakri Memorial Day", "วันจักรี"),
      },
      {
        id: "s2b-songkran",
        start: "2027-04-12",
        end: "2027-04-18",
        kind: "holiday",
        title: t("Songkran", "สงกรานต์"),
      },
      {
        id: "s2b-last-class",
        start: "2027-05-01",
        kind: "term",
        title: t("Last day of classes", "วันสุดท้ายของการเรียนการสอน"),
      },
      {
        id: "s2b-finals",
        start: "2027-05-03",
        end: "2027-05-18",
        kind: "exam",
        title: t("Final exams", "สอบปลายภาค"),
      },
      {
        id: "s2b-coronation",
        start: "2027-05-04",
        kind: "holiday",
        title: t("Coronation Day", "วันฉัตรมงคล"),
      },
      {
        id: "s2b-grades",
        start: "2027-06-02",
        end: "2027-06-17",
        kind: "deadline",
        title: t("Instructors submit grades", "อาจารย์ส่งผลการเรียน"),
      },
    ],
    notes: [
      t(
        "Registration opens at 09:00 on the first day and closes at 22:30 on the last day. Fee payment follows the same times. Check what you owe and pay in the TU GREATS app.",
        "การลงทะเบียนเปิดเวลา 09.00 น. ของวันแรก และปิดเวลา 22.30 น. ของวันสุดท้าย การชำระเงินใช้เวลาเดียวกัน ตรวจยอดค้างชำระและชำระเงินได้ในแอป TU GREATS"
      ),
      t(
        "The date of Royal Ploughing Ceremony Day is still to be confirmed. There are no classes on holidays.",
        "วันพืชมงคลยังรอประกาศ วันหยุดไม่มีการเรียนการสอน"
      ),
    ],
  },
  {
    id: "s2-reg",
    title: t("Semester 2 for the regular programme", "ภาคการศึกษาที่ 2 ภาคปกติ"),
    track: "registrar",
    intro: t(
      "These are the Registrar's semester 2 dates for regular-programme students.",
      "นี่คือกำหนดการภาคการศึกษาที่ 2 ของสำนักงานทะเบียนนักศึกษาสำหรับนักศึกษาภาคปกติ"
    ),
    items: [
      {
        id: "s2r-begin",
        start: "2027-01-04",
        kind: "term",
        title: t("Semester 2 begins", "เปิดภาคการศึกษาที่ 2"),
      },
      {
        id: "s2r-late-reg",
        start: "2027-01-04",
        end: "2027-01-17",
        kind: "registration",
        title: t("Late registration and add-drop", "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา"),
      },
      {
        id: "s2r-graduate",
        start: "2027-01-04",
        end: "2027-01-17",
        kind: "deadline",
        title: t("Apply to graduate", "แจ้งขอสำเร็จการศึกษา"),
      },
      {
        id: "s2r-late-pay",
        start: "2027-01-04",
        end: "2027-01-18",
        kind: "registration",
        title: t(
          "Pay for late registration and add-drop",
          "ชำระค่าธรรมเนียมลงทะเบียนล่าช้าและเพิ่ม-ถอน"
        ),
      },
      {
        id: "s2r-w-online",
        start: "2027-01-18",
        end: "2027-03-14",
        kind: "withdrawal",
        title: t("Withdraw a course with a W online", "ถอนรายวิชาโดยบันทึกอักษร W ผ่านระบบ"),
      },
      {
        id: "s2r-penalty",
        start: "2027-01-19",
        kind: "deadline",
        title: t("Late-add penalty fees begin", "เริ่มคิดค่าปรับการลงทะเบียนเพิ่มล่าช้ากรณีพิเศษ"),
      },
      {
        id: "s2r-removal",
        start: "2027-02-02",
        kind: "deadline",
        title: t(
          "Last day to register or take leave before the university removes your name",
          "วันสุดท้ายที่ต้องลงทะเบียนหรือลาพัก ไม่อย่างนั้นจะถูกถอนชื่อ"
        ),
      },
      {
        id: "s2r-mid-seats",
        start: "2027-02-15",
        kind: "exam",
        title: t("Midterm seating plans go up", "เริ่มดูและพิมพ์ผังสอบกลางภาคได้"),
      },
      {
        id: "s2r-midterms",
        start: "2027-02-21",
        end: "2027-02-28",
        kind: "exam",
        title: t("Midterm exams", "สอบกลางภาค"),
      },
      {
        id: "s2r-w-faculty",
        start: "2027-03-15",
        end: "2027-05-02",
        kind: "withdrawal",
        title: t(
          "Withdraw with a W through the faculty, with the dean's approval",
          "ถอนรายวิชาโดยบันทึกอักษร W ผ่านคณะ ตามอำนาจคณบดี"
        ),
      },
      {
        id: "s2r-songkran",
        start: "2027-04-12",
        end: "2027-04-18",
        kind: "holiday",
        title: t("No classes for Songkran", "งดการเรียนการสอนช่วงสงกรานต์"),
      },
      {
        id: "s2r-resume",
        start: "2027-04-19",
        kind: "term",
        title: t("Classes resume", "เริ่มเรียนต่อหลังสงกรานต์"),
      },
      {
        id: "s2r-final-seats",
        start: "2027-04-26",
        kind: "exam",
        title: t("Final exam seating plans go up", "เริ่มดูและพิมพ์ผังสอบปลายภาคได้"),
      },
      {
        id: "s2r-last-day",
        start: "2027-05-01",
        kind: "term",
        title: t("Last day of semester 2", "วันสุดท้ายของภาคการศึกษาที่ 2"),
      },
      {
        id: "s2r-finals",
        start: "2027-05-03",
        end: "2027-05-18",
        kind: "exam",
        title: t("Final exams", "สอบปลายภาค"),
      },
    ],
    notes: [
      t(
        "This exam period is not continuous either. Exams run on 3 May, then 5 to 18 May 2027.",
        "ช่วงสอบปลายภาคของภาคนี้ไม่ต่อเนื่องเช่นกัน วันสอบจริงคือ 3 พฤษภาคม จากนั้น 5 ถึง 18 พฤษภาคม 2570"
      ),
    ],
  },
  {
    id: "summer",
    title: t("Summer session", "ภาคฤดูร้อน"),
    items: [
      {
        id: "su-begin",
        start: "2027-06-07",
        kind: "term",
        title: t("Summer session begins", "เปิดภาคฤดูร้อน"),
      },
      {
        id: "su-late-reg",
        start: "2027-06-07",
        end: "2027-06-13",
        kind: "registration",
        title: t("Late registration and add-drop", "ลงทะเบียนล่าช้าและเพิ่ม-ถอนรายวิชา"),
      },
      {
        id: "su-graduate",
        start: "2027-06-07",
        end: "2027-06-13",
        kind: "deadline",
        title: t("Apply to graduate", "แจ้งขอสำเร็จการศึกษา"),
      },
      {
        id: "su-late-pay",
        start: "2027-06-07",
        end: "2027-06-14",
        kind: "registration",
        title: t(
          "Pay for late registration and add-drop",
          "ชำระค่าธรรมเนียมลงทะเบียนล่าช้าและเพิ่ม-ถอน"
        ),
      },
      {
        id: "su-penalty",
        start: "2027-06-15",
        kind: "deadline",
        title: t("Late-add penalty fees begin", "เริ่มคิดค่าปรับการลงทะเบียนเพิ่มล่าช้ากรณีพิเศษ"),
      },
      {
        id: "su-w-online",
        start: "2027-06-16",
        end: "2027-07-04",
        kind: "withdrawal",
        title: t("Withdraw a course with a W online", "ถอนรายวิชาโดยบันทึกอักษร W ผ่านระบบ"),
      },
      {
        id: "su-final-seats",
        start: "2027-07-05",
        kind: "exam",
        title: t("Final exam seating plans go up", "เริ่มดูและพิมพ์ผังสอบปลายภาคได้"),
      },
      {
        id: "su-w-faculty",
        start: "2027-07-05",
        end: "2027-07-16",
        kind: "withdrawal",
        title: t(
          "Withdraw with a W through the faculty, with the dean's approval",
          "ถอนรายวิชาโดยบันทึกอักษร W ผ่านคณะ ตามอำนาจคณบดี"
        ),
      },
      {
        id: "su-last-day",
        start: "2027-07-12",
        end: "2027-07-15",
        kind: "term",
        title: t(
          "Last day of the summer session, depending on your section",
          "วันสุดท้ายของภาคฤดูร้อน ขึ้นอยู่กับกลุ่มเรียน"
        ),
      },
      {
        id: "su-finals",
        start: "2027-07-17",
        end: "2027-07-20",
        kind: "exam",
        title: t("Final exams", "สอบปลายภาค"),
      },
    ],
    notes: [
      t(
        "Your section decides when the summer session ends. Sections 8123 and 8245 finish on 12 July 2027, and sections 3883 and 5984 finish on 15 July 2027.",
        "กลุ่มเรียนเป็นตัวกำหนดว่าภาคฤดูร้อนจบวันไหน กลุ่ม 8123 และ 8245 จบวันที่ 12 กรกฎาคม 2570 ส่วนกลุ่ม 3883 และ 5984 จบวันที่ 15 กรกฎาคม 2570"
      ),
    ],
  },
  {
    id: "i-grade",
    title: t("Deadlines for resolving an I grade", "กำหนดส่งผลสอบรายวิชาที่ติด I"),
    intro: t(
      "The faculty must send outstanding results to the Registrar by these dates.",
      "คณะต้องส่งผลสอบที่ค้างอยู่ให้สำนักงานทะเบียนนักศึกษาภายในวันเหล่านี้"
    ),
    items: [
      {
        id: "i-s1-new",
        start: "2027-01-20",
        kind: "deadline",
        title: t(
          "Semester 1, students admitted in 2568 or later",
          "ภาค 1 นักศึกษาที่เข้าศึกษาปีการศึกษา 2568 เป็นต้นไป"
        ),
      },
      {
        id: "i-s1-old",
        start: "2027-02-19",
        kind: "deadline",
        title: t(
          "Semester 1, students admitted before 2568",
          "ภาค 1 นักศึกษาที่เข้าศึกษาก่อนปีการศึกษา 2568"
        ),
      },
      {
        id: "i-s2-new",
        start: "2027-06-30",
        kind: "deadline",
        title: t(
          "Semester 2, students admitted in 2568 or later",
          "ภาค 2 นักศึกษาที่เข้าศึกษาปีการศึกษา 2568 เป็นต้นไป"
        ),
      },
      {
        id: "i-s2-old",
        start: "2027-07-30",
        kind: "deadline",
        title: t(
          "Semester 2, students admitted before 2568",
          "ภาค 2 นักศึกษาที่เข้าศึกษาก่อนปีการศึกษา 2568"
        ),
      },
      {
        id: "i-su-new",
        start: "2027-09-13",
        kind: "deadline",
        title: t(
          "Summer session, students admitted in 2568 or later",
          "ภาคฤดูร้อน นักศึกษาที่เข้าศึกษาปีการศึกษา 2568 เป็นต้นไป"
        ),
      },
      {
        id: "i-su-old",
        start: "2027-10-13",
        kind: "deadline",
        title: t(
          "Summer session, students admitted before 2568",
          "ภาคฤดูร้อน นักศึกษาที่เข้าศึกษาก่อนปีการศึกษา 2568"
        ),
      },
    ],
  },
];
