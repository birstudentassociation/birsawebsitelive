import type { chrome as EnChrome } from "../en/chrome";

/**
 * Thai UI microcopy: the `chrome` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const chrome: typeof EnChrome = {
  locale: "th",

  langLabel: "ไทย",
  // Shown inside the language toggle as the language you can switch TO.

  switchTo: "English",

  switchToAria: "Switch to English, เปลี่ยนเป็นภาษาอังกฤษ",

  site: {
    name: "BIRSA",
    fullName: "สโมสรนักศึกษา BIR",
    tagline: "พื้นที่ของนักศึกษา BIR ธรรมศาสตร์",
    description:
      "เว็บไซต์ทางการของสโมสรนักศึกษาหลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ รวมข่าวสาร กิจกรรม ชมรม และคู่มือการใช้ชีวิตนักศึกษา",
  },

  nav: [
    { href: "/news", label: "ข่าวและกิจกรรม" },
    { href: "/services", label: "ค้นหาบริการ" },
    { href: "/clubs", label: "ชมรม" },
    { href: "/activity", label: "การดำเนินงานของ BIRSA" },
  ],

  headerCta: { href: "/quick", label: "ทางลัด" },

  footer: {
    tagline: "ดูแลโดยนักศึกษา BIR เพื่อนักศึกษา BIR",
    explore: "สำรวจ",
    getInvolved: "มาร่วมกัน",
    followUs: "ติดตามเรา",
    contact: "ติดต่อ",
    officialLinks: "ลิงก์ทางการ",
    accessibility: "การเข้าถึง",
    privacy: "ความเป็นส่วนตัว",
    cookies: "คุกกี้",
    standards: "เว็บไซต์นี้ทำงานอย่างไร",
    emergency: "คำแนะนำฉุกเฉิน",
    openInfo:
      "เว็บไซต์นี้เป็นเว็บไซต์ทางการของ BIRSA ดูแลโดยนักศึกษา แต่ BIRSA ไม่ใช่หน่วยงานของมหาวิทยาลัย เรื่องทางการของหลักสูตร กรุณาใช้ลิงก์ของ BIR Program",
    rights: "สโมสรนักศึกษา BIR",
    builtNote: "ตั้งใจสร้างให้ทุกคนใช้งานได้",
  },

  meta: {
    updated: "อัปเดตล่าสุด",
    published: "เผยแพร่เมื่อ",
    event: "กิจกรรม",
    news: "ข่าว",
    when: "วันเวลา",
    where: "สถานที่",
  },

  actions: {
    readMore: "อ่านต่อ",
    seeAll: "ดูทั้งหมด",
    viewDetails: "ดูรายละเอียด",
    learnMore: "อ่านเพิ่มเติม",
    getHelp: "ขอความช่วยเหลือ",
    contactUs: "ติดต่อ BIRSA",
    back: "ย้อนกลับ",
    backToTop: "กลับขึ้นด้านบน",
    search: "ค้นหา",
    searchPlaceholder: "ค้นหาในเว็บไซต์นี้",
    filter: "กรอง",
    category: "หมวดหมู่",
    allCategories: "ทุกหมวดหมู่",
    clearFilters: "ล้างตัวกรอง",
    showing: "แสดง",
    result: "รายการ",
    results: "รายการ",
    noResults: "ไม่พบรายการที่ตรงกับตัวกรอง ล้างตัวกรองแล้วค้นหาใหม่",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    confirm: "ยืนยัน",
    cancel: "ยกเลิก",
  },

  notFound: {
    title: "ไม่พบหน้าที่คุณต้องการ",
    body: "หน้านี้อาจถูกย้าย หรือลิงก์อาจไม่ถูกต้อง ใช้เมนูหลักเพื่อค้นหาสิ่งที่ต้องการ",
    home: "กลับหน้าแรก",
  },

  error: {
    title: "ขออภัย หน้านี้เกิดปัญหา",
    body: "โปรดลองใหม่อีกครั้ง หากยังเกิดปัญหาอยู่ โปรดแจ้งเรา",
    tryAgain: "ลองใหม่อีกครั้ง",
    home: "กลับหน้าแรก",
  },

  feedback: {
    prompt: "หน้านี้มีปัญหาหรือไม่",
    report: "แจ้งปัญหาเกี่ยวกับหน้านี้",
  },
};
