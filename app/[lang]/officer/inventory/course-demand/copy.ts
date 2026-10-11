/**
 * Bilingual copy for the elective demand page in the officer console. Kept
 * beside the page, as the course review console keeps its copy, and written in
 * lock-step: whenever a key changes on one side, change the other beside it.
 */
import type { Locale } from "@/lib/i18n";

export type DemandConsoleCopy = {
  title: string;
  lede: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  noAccessTitle: string;
  noAccessBody: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
  /** Contains {threshold}. */
  ruleBody: string;
  softLimitBody: string;
  empty: string;
  tableTitle: string;
  termHeader: string;
  courseHeader: string;
  studentsHeader: string;
  publicHeader: string;
  /** Contains {threshold}. */
  publicShown: string;
  /** Contains {threshold}. */
  publicBelow: string;
  publicPast: string;
  exportCsv: string;
  /** Contains {shown} and {total}. */
  truncated: string;
};

export const demandConsoleCopy: Record<Locale, DemandConsoleCopy> = {
  en: {
    title: "Elective demand",
    lede: "How many students who chose to share their plan intend to take each elective course in each term.",
    signInTitle: "Sign in on the console home",
    signInBody: "You need an active officer session to see elective demand.",
    signInCta: "Go to console home",
    noAccessTitle: "Only Academic Affairs and admins can see elective demand",
    noAccessBody:
      "Your role cannot use this page. Ask an admin to give you the Academic affairs role.",
    dbNotConfiguredTitle: "The database is not connected",
    dbNotConfiguredBody:
      "POSTGRES_URL is not configured, so there is no elective demand to show yet.",
    ruleBody:
      'Students share only course codes, the term each is planned for and the curriculum version. Nothing identifies them. A course page says "Planned by {threshold} or more students" for a term once the figure below reaches {threshold}, and never shows the number. The figures here are exact counts of what was shared.',
    softLimitBody:
      "Treat the figures as an indication. A browser sends once a term and one network can send only a few times in ten minutes, but both limits are soft, because BIRSA holds nothing that says who sent what. Only students who chose to share are counted.",
    empty: "Nobody has shared their planned electives yet.",
    tableTitle: "Planned students by course and term",
    termHeader: "Term",
    courseHeader: "Course",
    studentsHeader: "Students",
    publicHeader: "Course page",
    publicShown: 'Shows "{threshold} or more"',
    publicBelow: "Not shown, under {threshold}",
    publicPast: "Not shown, term has ended",
    exportCsv: "Download as CSV",
    truncated: "Showing {shown} of {total} rows. The CSV has them all.",
  },
  th: {
    title: "ความต้องการวิชาเลือก",
    lede: "จำนวนนักศึกษาที่เลือกแบ่งปันแผนการศึกษา และตั้งใจจะเรียนวิชาเลือกแต่ละวิชาในแต่ละภาคการศึกษา",
    signInTitle: "เข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "ต้องมีเซสชันเจ้าหน้าที่ที่ยังใช้งานได้จึงจะดูความต้องการวิชาเลือกได้",
    signInCta: "ไปที่หน้าแรกของคอนโซล",
    noAccessTitle: "เฉพาะฝ่ายวิชาการและผู้ดูแลระบบเท่านั้นที่ดูความต้องการวิชาเลือกได้",
    noAccessBody: "บทบาทของคุณใช้หน้านี้ไม่ได้ โปรดขอให้ผู้ดูแลระบบกำหนดบทบาทฝ่ายวิชาการให้",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูล",
    dbNotConfiguredBody:
      "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีข้อมูลความต้องการวิชาเลือกให้แสดง",
    ruleBody:
      'นักศึกษาแบ่งปันเฉพาะรหัสวิชา ภาคการศึกษาที่วางแผนไว้ และเวอร์ชันของหลักสูตร ไม่มีข้อมูลที่ระบุตัวนักศึกษา หน้ารายวิชาจะระบุว่า "นักศึกษาวางแผนเรียน {threshold} คนขึ้นไป" ในภาคการศึกษาที่ตัวเลขด้านล่างถึง {threshold} และไม่แสดงตัวเลขจริง ตัวเลขในหน้านี้เป็นจำนวนที่แบ่งปันมาจริงทั้งหมด',
    softLimitBody:
      "ควรใช้ตัวเลขเป็นข้อบ่งชี้เท่านั้น เบราว์เซอร์หนึ่งส่งได้หนึ่งครั้งต่อภาคการศึกษา และเครือข่ายหนึ่งส่งได้เพียงไม่กี่ครั้งในสิบนาที แต่ทั้งสองข้อจำกัดไม่เข้มงวด เพราะ BIRSA ไม่มีข้อมูลที่บอกว่าใครส่งอะไร และนับเฉพาะนักศึกษาที่เลือกแบ่งปันเท่านั้น",
    empty: "ยังไม่มีนักศึกษาแบ่งปันวิชาเลือกที่วางแผนไว้",
    tableTitle: "จำนวนนักศึกษาที่วางแผนไว้ แยกตามรายวิชาและภาคการศึกษา",
    termHeader: "ภาคการศึกษา",
    courseHeader: "รายวิชา",
    studentsHeader: "จำนวนนักศึกษา",
    publicHeader: "หน้ารายวิชา",
    publicShown: 'แสดงว่า "{threshold} คนขึ้นไป"',
    publicBelow: "ไม่แสดง เพราะต่ำกว่า {threshold} คน",
    publicPast: "ไม่แสดง เพราะภาคการศึกษานั้นสิ้นสุดแล้ว",
    exportCsv: "ดาวน์โหลดเป็น CSV",
    truncated: "แสดง {shown} จาก {total} แถว ไฟล์ CSV มีครบทุกแถว",
  },
};
