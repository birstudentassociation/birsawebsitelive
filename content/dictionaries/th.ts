import { en } from "./en";

/**
 * Thai UI microcopy — authored natively in Thai, not translated from English.
 * น้ำเสียง: ตรงไปตรงมา อ่านง่าย เหมือนรุ่นพี่คุยกับรุ่นน้อง สุภาพแต่ไม่เป็นทางการจนแข็ง
 * โครงสร้างต้องตรงกับ en (typeof en) แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 */
export const th: typeof en = {
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
      "ข่าว กิจกรรม ชมรม และคู่มือการใช้ชีวิต โดยสโมสรนักศึกษาหลักสูตรการเมืองและการระหว่างประเทศ (BIR) มหาวิทยาลัยธรรมศาสตร์",
  },

  nav: [
    { href: "/news", label: "ข่าวและกิจกรรม" },
    { href: "/activity", label: "การดำเนินงานของ BIRSA" },
    { href: "/clubs", label: "ชมรม" },
    { href: "/student-life", label: "ชีวิตนักศึกษา" },
    { href: "/about", label: "เกี่ยวกับเรา" },
  ],
  headerCta: { href: "/quick", label: "ทางลัด" },

  betaBanner: "เว็บไซต์นี้อยู่ในช่วงทดลองใช้งาน ข้อมูลบางส่วนอาจไม่ครบถ้วนหรือไม่ถูกต้อง",

  a11y: {
    skip: "ข้ามไปยังเนื้อหาหลัก",
    primaryNav: "เมนูหลัก",
    openMenu: "เมนู",
    closeMenu: "ปิดเมนู",
    breadcrumb: "เส้นทางการนำทาง",
    youAreHere: "คุณอยู่ที่นี่",
    currentPage: "หน้าปัจจุบัน",
    onThisPage: "ในหน้านี้",
    newTab: "เปิดในแท็บใหม่",
    externalLink: "ลิงก์ภายนอก",
    languageSelector: "ภาษา",
    logoHome: "BIRSA, กลับหน้าแรก",
    loading: "กำลังโหลด",
    theme: "ธีม",
    themeDark: "เปลี่ยนเป็นโหมดมืด",
    themeLight: "เปลี่ยนเป็นโหมดสว่าง",
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
    noResults: "ไม่พบรายการที่ตรงกับตัวกรอง ลองล้างตัวกรองแล้วค้นหาใหม่",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
  },

  form: {
    send: "ส่งข้อความ",
    sending: "กำลังส่ง…",
    sent: "ส่งข้อความแล้ว",
    yourName: "ชื่อของคุณ",
    email: "อีเมล",
    emailHint: "เราจะใช้อีเมลนี้เพื่อตอบกลับคุณเท่านั้น",
    subject: "หัวข้อ",
    message: "ข้อความ",
    category: "เรื่องที่ต้องการติดต่อ",
    privacyNote:
      "ข้อมูลที่คุณส่งจะใช้เพื่อตอบกลับคุณเท่านั้น เราไม่ส่งต่อให้ใคร อ่านรายละเอียดได้ในประกาศความเป็นส่วนตัว",
    errorSummaryTitle: "มีข้อมูลที่ต้องแก้ไข",
    genericError: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือส่งอีเมลถึงเราโดยตรง",
    successTitle: "ส่งเรียบร้อย ขอบคุณที่ติดต่อเข้ามา",
    successBody: "กรรมการ BIRSA จะติดต่อกลับทางอีเมลโดยเร็วที่สุด",
    fallbackTitle: "ระบบส่งอีเมลยังไม่เปิดใช้งาน",
    fallbackBody: "กรุณาส่งข้อความของคุณไปที่:",
    errors: {
      nameRequired: "กรอกชื่อของคุณ",
      emailRequired: "กรอกอีเมลของคุณ",
      emailInvalid: "กรอกอีเมลให้ถูกต้อง เช่น name@example.com",
      subjectRequired: "กรอกหัวข้อ",
      messageRequired: "กรอกข้อความ",
      messageShort: "ข้อความสั้นเกินไป กรุณาเล่ารายละเอียดเพิ่มอีกนิด",
      categoryRequired: "เลือกเรื่องที่ต้องการติดต่อ",
    },
  },

  footer: {
    tagline: "ดูแลโดยนักศึกษา BIR เพื่อนักศึกษา BIR",
    explore: "สำรวจ",
    getInvolved: "มาร่วมกัน",
    followUs: "ติดตามเรา",
    contact: "ติดต่อ",
    officialLinks: "ลิงก์ทางการ",
    accessibility: "การเข้าถึง",
    privacy: "ความเป็นส่วนตัว",
    standards: "เว็บไซต์นี้ทำงานอย่างไร",
    openInfo:
      "เว็บไซต์นี้ดูแลโดยนักศึกษา ไม่ใช่ช่องทางทางการของหลักสูตร เรื่องทางการกรุณาใช้ลิงก์ของ BIR Program",
    rights: "สโมสรนักศึกษา BIR",
    builtNote: "ตั้งใจสร้างให้ทุกคนใช้งานได้",
  },

  notFound: {
    title: "ไม่พบหน้าที่คุณต้องการ",
    body: "หน้านี้อาจถูกย้าย หรือลิงก์อาจไม่ถูกต้อง ลองเริ่มจากเมนูหลักด้านล่าง",
    home: "กลับหน้าแรก",
  },

  meta: {
    updated: "อัปเดตล่าสุด",
    published: "เผยแพร่เมื่อ",
    event: "กิจกรรม",
    news: "ข่าว",
    when: "วันเวลา",
    where: "สถานที่",
  },
};
