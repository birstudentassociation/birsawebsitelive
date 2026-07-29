import { en } from "./en";

/**
 * Thai UI microcopy: authored natively in Thai, not translated from English.
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
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
      "เว็บไซต์ทางการของสโมสรนักศึกษาหลักสูตรการเมืองและการระหว่างประเทศ (BIR) คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ รวมข่าวสาร กิจกรรม ชมรม และคู่มือการใช้ชีวิตนักศึกษา",
  },

  nav: [
    { href: "/news", label: "ข่าวและกิจกรรม" },
    { href: "/information-services", label: "ข้อมูลและบริการ" },
    { href: "/clubs", label: "ชมรม" },
    { href: "/activity", label: "การดำเนินงานของ BIRSA" },
  ],
  headerCta: { href: "/quick", label: "ทางลัด" },

  emergencyBanner: {
    cta: "คลิกเพื่อดูข้อมูลเพิ่มเติม",
  },

  emergencyPage: {
    breadcrumb: "เหตุฉุกเฉิน",
    atAGlance: "สรุปโดยย่อ",
    alertLevel: "ระดับความรุนแรง",
    doThisFirst: "ทำสิ่งนี้ก่อน",
    keyNumbers: "เบอร์สำคัญ",
    severity: {
      critical: "วิกฤต",
      warning: "เฝ้าระวัง",
      info: "คำแนะนำ",
    },
    whatToDo: "สิ่งที่ควรทำตอนนี้",
    usefulContacts: "ช่องทางติดต่อที่เป็นประโยชน์",
    birsaContacts: "ติดต่อ BIRSA",
    phone: "โทรศัพท์",
    address: "ที่อยู่",
    disclaimer:
      "นี่คือคำแนะนำทั่วไปจากเว็บไซต์ที่ดูแลโดยนักศึกษา ในสถานการณ์ฉุกเฉิน โปรดปฏิบัติตามคำแนะนำของหน่วยงานฉุกเฉินและมหาวิทยาลัยธรรมศาสตร์เสมอ",
    noActiveTitle: "ไม่มีเหตุฉุกเฉินในขณะนี้",
    noActiveLede:
      "ขณะนี้ไม่มีเหตุฉุกเฉินที่ส่งผลต่อคณะ หากเกิดเหตุขึ้น คุณจะพบคำแนะนำได้ที่หน้านี้",
    noActiveBody:
      "หากคุณมีเรื่องความปลอดภัยเร่งด่วน ให้ติดต่อหน่วยงานฉุกเฉินโดยตรง: ตำรวจ 191 การแพทย์ 1669 ดับเพลิง 199",
    backHome: "กลับหน้าแรก",
  },

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
    table: "ตาราง",
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
    noResults: "ไม่พบรายการที่ตรงกับตัวกรอง ล้างตัวกรองแล้วค้นหาใหม่",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    confirm: "ยืนยัน",
    cancel: "ยกเลิก",
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
      messageShort: "ข้อความสั้นเกินไป กรุณากรอกรายละเอียดเพิ่มเติม",
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
    emergency: "คำแนะนำฉุกเฉิน",
    openInfo:
      "เว็บไซต์นี้เป็นเว็บไซต์ทางการของ BIRSA ดูแลโดยนักศึกษา แต่ BIRSA ไม่ใช่หน่วยงานของมหาวิทยาลัย เรื่องทางการของหลักสูตร กรุณาใช้ลิงก์ของ BIR Program",
    rights: "สโมสรนักศึกษา BIR",
    builtNote: "ตั้งใจสร้างให้ทุกคนใช้งานได้",
  },

  notFound: {
    title: "ไม่พบหน้าที่คุณต้องการ",
    body: "หน้านี้อาจถูกย้าย หรือลิงก์อาจไม่ถูกต้อง ลองเริ่มจากเมนูหลักด้านล่าง",
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

  meta: {
    updated: "อัปเดตล่าสุด",
    published: "เผยแพร่เมื่อ",
    event: "กิจกรรม",
    news: "ข่าว",
    when: "วันเวลา",
    where: "สถานที่",
  },

  courseReview: {
    title: "รีวิวรายวิชา",
    lede: "ค้นหารายวิชาทั้งหมดของ BIR ทั้งรหัสวิชา หน่วยกิต วิชาบังคับก่อน และคำอธิบายของทุกรายวิชาในหลักสูตร",
    browseHeading: "เรียกดูรายวิชา",
    searchPlaceholder: "ค้นหาด้วยรหัสวิชา ชื่อวิชา หรือคำสำคัญ…",
    statsHeading: "ภาพรวม",
    statsTotalCourses: "จำนวนรายวิชาทั้งหมด",
    statsTotalCredits: "หน่วยกิตรวม ถ้าลงทุกวิชา",
    statsTracks: "กลุ่มวิชาโท",
    statsByTrack: "จำนวนวิชาแยกตามกลุ่ม",
    trackLabel: "กลุ่มวิชา",
    allTracks: "ทุกกลุ่มวิชา",
    tracks: {
      foundational: "วิชาพื้นฐาน",
      "international-relations": "ความสัมพันธ์ระหว่างประเทศ",
      "governance-transnational": "โลกาภิบาลและประเด็นข้ามชาติ",
      "public-admin-policy": "บริหารรัฐกิจและนโยบายสาธารณะ",
      "global-political-economy": "เศรษฐกิจการเมืองโลก",
    },
    categories: {
      "general-education": "ศึกษาทั่วไป",
      core: "วิชาบังคับ",
      required: "วิชาบังคับเฉพาะ",
      "elective-area": "วิชาเลือก: อาณาบริเวณศึกษา",
      "elective-approach": "วิชาเลือก: แนวทางการศึกษา",
      "minor-required": "วิชาโท: บังคับ",
      "minor-elective": "วิชาโท: เลือก",
      "free-elective": "วิชาเลือกเสรี",
    },
    credits: "หน่วยกิต",
    yearLabel: "ชั้นปี",
    prerequisite: "วิชาบังคับก่อน",
    instructorsHeading: "ผู้สอน",
    instructorsNote: "ข้อมูลจากทำเนียบคณาจารย์ คณะรัฐศาสตร์ ผู้สอนอาจเปลี่ยนแปลงในแต่ละภาคการศึกษา",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    pageOf: "หน้า {current} จาก {total}",
    backToGuides: "กลับไปคู่มือชีวิตนักศึกษาและวัฒนธรรม",
    openCourse: "ดูรายวิชาและรีวิว",
    reviewedBadge: "มีรีวิว",
    sampleBadge: "รีวิวตัวอย่าง",
    sampleReviewTitle: "เนื้อหาตัวอย่าง ไม่ใช่รีวิวจริง",
    sampleReviewBody:
      "ทุกอย่างในส่วนนี้เขียนขึ้นเพื่อแสดงให้เห็นว่ารีวิวรายวิชาฉบับสมบูรณ์จะมีหน้าตาอย่างไร คะแนน ปริมาณงาน เคล็ดลับ และคำพูดด้านล่างไม่ใช่ความเห็นจริงของนักศึกษา จึงไม่ควรใช้ประกอบการตัดสินใจลงทะเบียนเรียน BIRSA จะแทนที่ด้วยรีวิวจริงเมื่อรวบรวมได้แล้ว",
    descriptionHeading: "คำอธิบายรายวิชา",
    reviewHeading: "รีวิวจากนักศึกษา",
    reviewBasedOn: "รวบรวมจากรีวิวของนักศึกษา {count} คน",
    ratingOverall: "คะแนนโดยรวม",
    ratingWorkload: "ปริมาณงาน",
    ratingDifficulty: "ความยาก",
    ratingOutOf: "/ 5",
    workloadHeading: "ปริมาณงานเป็นอย่างไร",
    assessmentHeading: "วัดผลอย่างไร",
    tipsHeading: "เคล็ดลับจากรุ่นพี่",
    quotesHeading: "เสียงจากนักศึกษา",
    noReviewTitle: "ยังไม่มีรีวิวจากนักศึกษา",
    noReviewBody:
      "BIRSA ยังไม่มีรีวิวจากนักศึกษาสำหรับวิชานี้ ถ้าคุณเคยเรียนวิชานี้และยินดีเขียนรีวิวสั้น ๆ อย่างตรงไปตรงมา ติดต่อเราได้",
    backToCatalog: "กลับไปหน้ารวมรายวิชา",
  },
};
