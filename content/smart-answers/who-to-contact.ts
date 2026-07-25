/**
 * Smart answer: "Find the right person to contact". A short triage: safety
 * first, then the specific services the site already offers (equipment
 * loans, clubs), then a clear hand-off to the BIR Programme site for
 * official academic/records matters (BIRSA is a student association, not a
 * university office; see `content/site.ts` `officialLinks`), then news and
 * a general contact fallback.
 */
import type { SmartAnswerFlow } from "./types";

export const whoToContact: SmartAnswerFlow = {
  slug: "who-to-contact",
  title: {
    en: "Find the right person to contact",
    th: "หาคนที่ใช่สำหรับติดต่อ",
  },
  lede: {
    en: "A couple of quick questions to point you to the right place, from an emergency to a club question.",
    th: "ตอบคำถามสั้น ๆ เพื่อหาช่องทางที่ใช่ ไม่ว่าจะเป็นเหตุฉุกเฉินหรือคำถามเรื่องชมรม",
  },
  whatYoullNeed: [
    { en: "A rough idea of what your question is about", th: "เรื่องคร่าว ๆ ที่อยากสอบถาม" },
  ],
  start: "q-topic",
  nodes: [
    {
      kind: "question",
      id: "q-topic",
      question: {
        en: "What do you need help with?",
        th: "คุณต้องการความช่วยเหลือเรื่องอะไร",
      },
      options: [
        {
          id: "safety",
          label: {
            en: "A safety emergency happening right now",
            th: "เหตุฉุกเฉินด้านความปลอดภัยที่กำลังเกิดขึ้น",
          },
          next: "out-safety",
        },
        {
          id: "equipment",
          label: { en: "Borrowing equipment", th: "ยืมอุปกรณ์" },
          next: "out-equipment",
        },
        {
          id: "clubs",
          label: {
            en: "Clubs: joining or starting one",
            th: "เรื่องชมรม (เข้าร่วมหรือเริ่มใหม่)",
          },
          next: "q-club-detail",
        },
        {
          id: "academic",
          label: {
            en: "Official academic records or programme matters",
            th: "เรื่องผลการเรียนหรือเรื่องทางการของหลักสูตร",
          },
          next: "out-academic",
        },
        {
          id: "events",
          label: { en: "What's on / upcoming events", th: "กิจกรรมที่กำลังจะจัดขึ้น" },
          next: "out-events",
        },
        {
          id: "other",
          label: {
            en: "Something else, or general feedback",
            th: "เรื่องอื่น ๆ หรือข้อเสนอแนะทั่วไป",
          },
          next: "out-other",
        },
      ],
    },
    {
      kind: "question",
      id: "q-club-detail",
      question: {
        en: "Do you want to join an existing club, or start a new one?",
        th: "คุณต้องการเข้าร่วมชมรมที่มีอยู่แล้ว หรือเริ่มชมรมใหม่",
      },
      options: [
        {
          id: "join",
          label: { en: "Join an existing club", th: "เข้าร่วมชมรมที่มีอยู่" },
          next: "out-clubs-join",
        },
        {
          id: "start",
          label: { en: "Start a new club", th: "เริ่มชมรมใหม่" },
          next: "out-clubs-start",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-safety",
      title: { en: "Contact emergency services now", th: "ติดต่อหน่วยฉุกเฉินทันที" },
      summary: {
        en: "For anything genuinely urgent, do not wait for BIRSA: call the emergency services directly, then let BIRSA know.",
        th: "หากเป็นเหตุฉุกเฉินจริง อย่ารอติดต่อ BIRSA ให้โทรหาหน่วยฉุกเฉินโดยตรงก่อน แล้วค่อยแจ้ง BIRSA ทีหลัง",
      },
      body: [
        {
          en: "Police 191, medical emergencies 1669, fire 199.",
          th: "ตำรวจ 191 การแพทย์ฉุกเฉิน 1669 ดับเพลิง 199",
        },
      ],
      actions: [
        {
          label: { en: "BIRSA emergency guidance", th: "คำแนะนำฉุกเฉินของ BIRSA" },
          href: "/emergency",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-equipment",
      title: { en: "Equipment loans", th: "บริการยืมอุปกรณ์" },
      summary: {
        en: "BIRSA lends out equipment like cameras and speakers for free.",
        th: "BIRSA มีอุปกรณ์ให้ยืมฟรี เช่น กล้องและลำโพง",
      },
      actions: [
        {
          label: { en: "Go to equipment loans", th: "ไปหน้าบริการยืมอุปกรณ์" },
          href: "/information-services/equipment-loan",
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-clubs-join",
      title: { en: "Find a club to join", th: "หาชมรมที่อยากเข้าร่วม" },
      summary: {
        en: "Browse existing clubs and see how to join.",
        th: "ดูรายชื่อชมรมที่มีอยู่และวิธีเข้าร่วม",
      },
      actions: [{ label: { en: "Browse clubs", th: "ดูรายชื่อชมรม" }, href: "/clubs" }],
    },
    {
      kind: "outcome",
      id: "out-clubs-start",
      title: { en: "Start a new club", th: "เริ่มชมรมใหม่" },
      summary: {
        en: "If your interest is not covered by an existing club, BIRSA can help you start one.",
        th: "ถ้ายังไม่มีชมรมที่ตรงกับความสนใจของคุณ BIRSA ช่วยให้เกิดขึ้นจริงได้",
      },
      actions: [
        {
          label: { en: "Check if you're ready to start a club", th: "เช็กความพร้อมก่อนเริ่มชมรม" },
          href: "/answers/start-a-club-check",
        },
        { label: { en: "Start a club", th: "เริ่มชมรมใหม่" }, href: "/clubs/start" },
      ],
    },
    {
      kind: "outcome",
      id: "out-academic",
      title: { en: "Contact the BIR Programme office", th: "ติดต่อสำนักงานหลักสูตร BIR" },
      summary: {
        en: "BIRSA is a student association, not a university office; for official records, grades, registration, or programme matters, go to the BIR Programme site.",
        th: "BIRSA เป็นองค์กรนักศึกษา ไม่ใช่หน่วยงานของมหาวิทยาลัย สำหรับเรื่องผลการเรียน การลงทะเบียน หรือเรื่องทางการของหลักสูตร กรุณาติดต่อผ่านเว็บไซต์หลักสูตร BIR",
      },
      actions: [
        {
          label: { en: "BIR Programme site", th: "เว็บไซต์หลักสูตร BIR" },
          href: "https://www.birpolsci.com",
          external: true,
        },
      ],
    },
    {
      kind: "outcome",
      id: "out-events",
      title: { en: "See what's on", th: "ดูกิจกรรมที่จะจัดขึ้น" },
      summary: {
        en: "News and event listings are all in one place.",
        th: "ข่าวสารและกิจกรรมทั้งหมดรวมอยู่ที่หน้าเดียว",
      },
      actions: [{ label: { en: "Go to news", th: "ไปหน้าข่าวสาร" }, href: "/news" }],
    },
    {
      kind: "outcome",
      id: "out-other",
      title: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" },
      summary: {
        en: "For anything else (welfare concerns, feedback, or a question you're not sure who handles), the contact form reaches BIRSA directly.",
        th: "สำหรับเรื่องอื่น ๆ เช่น ความกังวลใจ ข้อเสนอแนะ หรือคำถามที่ไม่แน่ใจว่าใครดูแล ใช้แบบฟอร์มติดต่อเพื่อส่งถึง BIRSA โดยตรง",
      },
      actions: [{ label: { en: "Contact BIRSA", th: "ติดต่อ BIRSA" }, href: "/contact" }],
    },
  ],
};
