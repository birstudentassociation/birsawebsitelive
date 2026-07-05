/**
 * Quick-actions link groups — BIRSA's "link in bio" target (`/quick`).
 * Each item is authored bilingually inline (en/th) since this page's copy
 * is short, list-like microcopy rather than long-form prose.
 */
import { socials, officialLinks } from "@/content/site";

export type QuickIcon =
  | "register"
  | "pay"
  | "wifi"
  | "calendar"
  | "club"
  | "flag"
  | "help"
  | "feedback"
  | "guide"
  | "instagram"
  | "facebook"
  | "email"
  | "line"
  | "external";

export type QuickItem = {
  key: string;
  /** Internal path (no locale prefix) or an absolute external URL. */
  href: string;
  external?: boolean;
  placeholder?: boolean;
  icon: QuickIcon;
  en: { label: string; hint?: string };
  th: { label: string; hint?: string };
};

export type QuickGroup = {
  key: string;
  en: { heading: string };
  th: { heading: string };
  items: QuickItem[];
};

const instagram = socials.find((s) => s.id === "instagram")!;
const facebook = socials.find((s) => s.id === "facebook")!;
const email = socials.find((s) => s.id === "email")!;
const line = socials.find((s) => s.id === "line")!;
const birProgram = officialLinks.find((l) => l.id === "birProgram")!;
const faculty = officialLinks.find((l) => l.id === "faculty")!;

export const quickGroups: QuickGroup[] = [
  {
    key: "do-it-now",
    en: { heading: "Do it now" },
    th: { heading: "ลงมือเลย" },
    items: [
      {
        key: "register-classes",
        href: "https://www.reg.tu.ac.th",
        external: true,
        icon: "register",
        en: { label: "Register for classes", hint: "TU registrar (reg.tu.ac.th)" },
        th: { label: "ลงทะเบียนเรียน", hint: "สำนักทะเบียน มธ. (reg.tu.ac.th)" },
      },
      {
        key: "pay-tuition",
        href: "https://www.reg.tu.ac.th",
        external: true,
        icon: "pay",
        en: { label: "Pay tuition", hint: "TU registrar (reg.tu.ac.th)" },
        th: { label: "ชำระค่าเทอม", hint: "สำนักทะเบียน มธ. (reg.tu.ac.th)" },
      },
      {
        key: "tu-accounts",
        href: "/services/tu-accounts",
        icon: "wifi",
        en: { label: "TU wifi & library account help", hint: "Set up and troubleshoot your TU accounts" },
        th: { label: "ช่วยเหลือบัญชี TU wifi และห้องสมุด", hint: "ตั้งค่าและแก้ปัญหาบัญชี TU ของคุณ" },
      },
      {
        key: "whats-on",
        href: "/news",
        icon: "calendar",
        en: { label: "See what's on", hint: "News and upcoming events" },
        th: { label: "ดูข่าวและกิจกรรม", hint: "ข่าวสารและกิจกรรมที่กำลังจะมาถึง" },
      },
      {
        key: "join-club",
        href: "/clubs",
        icon: "club",
        en: { label: "Join a club" },
        th: { label: "เข้าร่วมชมรม" },
      },
      {
        key: "report-problem",
        href: "/services/report-a-problem",
        icon: "flag",
        en: { label: "Report a problem", hint: "Facilities, safety or other issues" },
        th: { label: "แจ้งปัญหา", hint: "อาคารสถานที่ ความปลอดภัย หรือเรื่องอื่น ๆ" },
      },
    ],
  },
  {
    key: "get-help",
    en: { heading: "Get help" },
    th: { heading: "ขอความช่วยเหลือ" },
    items: [
      {
        key: "contact-birsa",
        href: "/services/contact",
        icon: "help",
        en: { label: "Contact BIRSA", hint: "Questions, ideas or concerns" },
        th: { label: "ติดต่อ BIRSA", hint: "คำถาม ข้อเสนอแนะ หรือเรื่องกังวลใจ" },
      },
      {
        key: "give-feedback",
        href: "/services/contact",
        icon: "feedback",
        en: { label: "Give feedback", hint: "Uses the same contact form" },
        th: { label: "ให้ข้อเสนอแนะ", hint: "ใช้แบบฟอร์มติดต่อเดียวกัน" },
      },
      {
        key: "student-life-guide",
        href: "/student-life",
        icon: "guide",
        en: { label: "Student-life guide", hint: "For home and international students" },
        th: { label: "คู่มือชีวิตนักศึกษา", hint: "สำหรับนักศึกษาไทยและนักศึกษาต่างชาติ" },
      },
    ],
  },
  {
    key: "find-follow",
    en: { heading: "Find & follow us" },
    th: { heading: "ติดตามเรา" },
    items: [
      {
        key: "instagram",
        href: instagram.href,
        external: true,
        icon: "instagram",
        en: { label: "Instagram", hint: "@student_birsa" },
        th: { label: "อินสตาแกรม", hint: "@student_birsa" },
      },
      {
        key: "facebook",
        href: facebook.href,
        external: true,
        icon: "facebook",
        en: { label: "Facebook", hint: "BIR Student Association" },
        th: { label: "เฟซบุ๊ก", hint: "BIR Student Association" },
      },
      {
        key: "line",
        href: line.href,
        placeholder: true,
        icon: "line",
        en: { label: "LINE", hint: "Coming soon" },
        th: { label: "LINE", hint: "เร็ว ๆ นี้" },
      },
      {
        key: "email",
        href: email.href,
        icon: "email",
        en: { label: "Email", hint: "bir@tu.ac.th" },
        th: { label: "อีเมล", hint: "bir@tu.ac.th" },
      },
      {
        key: "bir-program",
        href: birProgram.href,
        external: true,
        icon: "external",
        en: { label: "BIR Program site", hint: "birpolsci.com" },
        th: { label: "เว็บไซต์หลักสูตร BIR", hint: "birpolsci.com" },
      },
      {
        key: "faculty",
        href: faculty.href,
        external: true,
        icon: "external",
        en: { label: "Faculty site", hint: "polsci.tu.ac.th" },
        th: { label: "เว็บไซต์คณะรัฐศาสตร์", hint: "polsci.tu.ac.th" },
      },
    ],
  },
];
