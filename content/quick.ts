/**
 * Quick-actions link groups: BIRSA's "link in bio" target (`/quick`).
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
  | "loan"
  | "bus"
  | "review"
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
    key: "top-tasks",
    en: { heading: "Popular right now" },
    th: { heading: "บริการนิยม" },
    items: [
      {
        key: "whats-on",
        href: "/news",
        icon: "calendar",
        en: { label: "What's on", hint: "News and events" },
        th: { label: "มีอะไรบ้าง", hint: "ข่าวสารและกิจกรรม" },
      },
      {
        key: "borrow-equipment",
        href: "/information-services/equipment-loan",
        icon: "loan",
        en: { label: "Borrow equipment", hint: "Free BIRSA equipment loans" },
        th: { label: "ยืมอุปกรณ์", hint: "ยืมฟรีกับ BIRSA" },
      },
      {
        key: "course-reviews",
        href: "/student-life/home/course-reviews",
        icon: "review",
        en: { label: "Course reviews", hint: "For finding out what a course is like" },
        th: { label: "รีวิววิชาเรียน", hint: "ฐานข้อมูลรีวิววิชา PI" },
      },
      {
        key: "shuttle-bus",
        href: "/student-life/home/shuttle-bus",
        icon: "bus",
        en: { label: "Shuttle bus", hint: "Live departures and timetables" },
        th: { label: "รถเวียน", hint: "เวลารถและตารางเดินรถ" },
      },
      {
        key: "find-a-club",
        href: "/clubs",
        icon: "club",
        en: { label: "Find a club", hint: "Join one, or start your own" },
        th: { label: "หาชมรม", hint: "รวบรวมข้อมูลชมรมต่าง ๆ (ตอนนี้ยังไม่มีข้อมูลจริง)" },
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
        href: "/contact",
        icon: "help",
        en: { label: "Contact BIRSA", hint: "Questions, ideas or concerns" },
        th: { label: "ติดต่อ BIRSA", hint: "คำถาม ข้อเสนอแนะ หรือเรื่องกังวลใจ" },
      },
      {
        key: "give-feedback",
        href: "/contact",
        icon: "feedback",
        en: { label: "Give feedback", hint: "Uses the same contact form" },
        th: { label: "ให้ข้อเสนอแนะ", hint: "ใช้แบบฟอร์มติดต่อเดียวกัน" },
      },
      {
        key: "student-life-guide",
        href: "/information-services",
        icon: "guide",
        en: { label: "Student-life guide", hint: "For home and international students" },
        th: { label: "คู่มือชีวิตนักศึกษา", hint: "สำหรับนักศึกษาไทยและนักศึกษาต่างชาติ" },
      },
    ],
  },
  {
    key: "how-birsa-works",
    en: { heading: "How BIRSA works" },
    th: { heading: "การดำเนินงานของ BIRSA" },
    items: [
      {
        key: "birsa-activity",
        href: "/activity",
        icon: "flag",
        en: { label: "BIRSA activity", hint: "Officer roles, regulations and transparency" },
        th: { label: "การทำงานของ BIRSA", hint: "บทบาทกรรมการ ระเบียบ และความโปร่งใส" },
      },
    ],
  },
  {
    key: "find-follow",
    en: { heading: "Find and follow us" },
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
        en: { label: "Email", hint: "birsa@tu.ac.th" },
        th: { label: "อีเมล", hint: "birsa@tu.ac.th" },
      },
    ],
  },
  {
    key: "official",
    en: { heading: "Official links" },
    th: { heading: "ลิงก์ทางการ" },
    items: [
      {
        key: "bir-program",
        href: birProgram.href,
        external: true,
        icon: "external",
        en: { label: "BIR Programme site", hint: "birpolsci.com" },
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
