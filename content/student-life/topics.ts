/**
 * Per-topic title and lede copy for the nine student-life topics, plus the
 * "common questions" list on the `/student-life` index. Shared between
 * `[topic]/page.tsx`, the index page, search and the guide breadcrumbs.
 * Authored natively per locale, not translated (see `content/home/th.ts`).
 *
 * `href` values are locale-less paths; pass them through `localeHref`.
 */
import type { Locale } from "@/lib/i18n";
import type { GuideTopic } from "@/lib/content";

export type StudentLifeTopicCopy = { title: string; lede: string };
export type StudentLifeQuestion = { q: string; href: string };

/** Breadcrumb and page label for the section itself. */
export const studentLifeLabel: Record<Locale, string> = {
  en: "Student life",
  th: "ชีวิตนักศึกษา",
};

export const studentLifeTopics: Record<Locale, Record<GuideTopic, StudentLifeTopicCopy>> = {
  en: {
    "before-you-arrive": {
      title: "Before you arrive",
      lede: "How to apply, and how to get a student visa if you are coming from abroad.",
    },
    "first-weeks": {
      title: "Your first weeks",
      lede: "What to do when you start, SIM cards and Wi-Fi, Thai customs, and the basics about BIR and Thammasat.",
    },
    studying: {
      title: "Studying",
      lede: "Registration, grades, the curriculum, internships, exchange and study support.",
    },
    money: {
      title: "Money",
      lede: "Tuition, monthly costs, financial help, discounts and bank accounts.",
    },
    "health-and-safety": {
      title: "Health and safety",
      lede: "Medical care, counselling and staying safe on and off campus.",
    },
    "getting-around": {
      title: "Getting around",
      lede: "Reaching campus, the free shuttle bus, Rangsit and the airport.",
    },
    "living-nearby": {
      title: "Food and housing",
      lede: "Where to eat around Tha Prachan and how to find somewhere to live.",
    },
    "getting-involved": {
      title: "Getting involved",
      lede: "Clubs, BIRSA events, student bodies and elections.",
    },
    "rules-and-rights": {
      title: "Rights and rules",
      lede: "Your rights, campus facilities, how to complain and visa rules while you study.",
    },
  },
  th: {
    "before-you-arrive": {
      title: "ก่อนเข้าเรียน",
      lede: "การสมัครเข้าศึกษา และการขอวีซ่านักเรียนสำหรับผู้ที่เดินทางมาจากต่างประเทศ",
    },
    "first-weeks": {
      title: "ช่วงสัปดาห์แรก",
      lede: "สิ่งที่ต้องทำเมื่อเริ่มเรียน ซิมการ์ดและ Wi-Fi มารยาทไทย และข้อมูลพื้นฐานเกี่ยวกับ BIR และธรรมศาสตร์",
    },
    studying: {
      title: "การเรียน",
      lede: "การลงทะเบียน เกรด หลักสูตร การฝึกงาน การแลกเปลี่ยน และแหล่งช่วยเรียน",
    },
    money: {
      title: "การเงิน",
      lede: "ค่าเล่าเรียน ค่าใช้จ่ายรายเดือน ทุนและความช่วยเหลือ สิทธิส่วนลด และการเปิดบัญชีธนาคาร",
    },
    "health-and-safety": {
      title: "สุขภาพและความปลอดภัย",
      lede: "การรักษาพยาบาล การปรึกษาด้านจิตใจ และความปลอดภัยในและนอกมหาวิทยาลัย",
    },
    "getting-around": {
      title: "การเดินทาง",
      lede: "การเดินทางมาท่าพระจันทร์ รถเวียนฟรี การไปรังสิต และการเดินทางจากสนามบิน",
    },
    "living-nearby": {
      title: "อาหารและที่พัก",
      lede: "ร้านอาหารรอบท่าพระจันทร์ และแนวทางหาที่พัก",
    },
    "getting-involved": {
      title: "กิจกรรมและองค์กรนักศึกษา",
      lede: "ชมรม กิจกรรมของ BIRSA องค์กรนักศึกษา และการเลือกตั้ง",
    },
    "rules-and-rights": {
      title: "สิทธิและกฎระเบียบ",
      lede: "สิทธิของนักศึกษา บริการในมหาวิทยาลัย การร้องเรียน และกฎด้านวีซ่าระหว่างเรียน",
    },
  },
};

export const studentLifeCommonQuestions: Record<Locale, StudentLifeQuestion[]> = {
  en: [
    { q: "How do I get to Rangsit?", href: "/student-life/getting-around/to-rangsit" },
    { q: "What happens if my GPA is below 2.00?", href: "/student-life/studying/low-gpa" },
    { q: "How do I report my 90 days?", href: "/student-life/rules-and-rights/visa-rules" },
    {
      q: "Where do I go if I am ill?",
      href: "/student-life/health-and-safety/getting-medical-help",
    },
    { q: "How much does a month cost?", href: "/student-life/money/monthly-costs" },
    { q: "When is the next shuttle bus?", href: "/student-life/getting-around/shuttle-bus" },
    { q: "How do I add or drop a course?", href: "/student-life/studying/registration" },
  ],
  th: [
    { q: "เดินทางไปรังสิตอย่างไร", href: "/student-life/getting-around/to-rangsit" },
    { q: "เกรดเฉลี่ยต่ำกว่า 2.00 จะเป็นอย่างไร", href: "/student-life/studying/low-gpa" },
    { q: "รายงานตัว 90 วันต้องทำอย่างไร", href: "/student-life/rules-and-rights/visa-rules" },
    { q: "เจ็บป่วยควรไปที่ไหน", href: "/student-life/health-and-safety/getting-medical-help" },
    { q: "ค่าใช้จ่ายต่อเดือนประมาณเท่าไร", href: "/student-life/money/monthly-costs" },
    { q: "รถเวียนคันถัดไปออกกี่โมง", href: "/student-life/getting-around/shuttle-bus" },
    { q: "เพิ่มหรือถอนรายวิชาอย่างไร", href: "/student-life/studying/registration" },
  ],
};
