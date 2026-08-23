import type { homeNamespace as EnHomeNamespace } from "../en/home";

/**
 * Thai UI copy: the `home` namespace, plus the `doIndex` and `phaseBanner`
 * bundles this file also carries. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7, docs/EDITING.md). See
 * `content/dictionaries/en/home.ts` for what owns each bundle and why this
 * file is not wired into `content/dictionaries/th/index.ts`, for the same
 * reason `content/dictionaries/th/do.ts` explains for the `do` namespace.
 *
 * น้ำเสียง เป็นกันเองแต่สุภาพ ตรงไปตรงมา กระชับ ใช้ "คุณ" กับผู้อ่าน เลี่ยงภาษาราชการแข็ง ๆ
 * และเลี่ยงทับศัพท์ที่ไม่จำเป็น ตัวเลขใช้เลขอารบิก ไม่ใช้เครื่องหมายทับบรรทัด (dash) ทุกชนิด
 * และไม่ใช้ทวิภาค (:) นอกจากเวลานาฬิกาและ URL ดูมาตรฐานเต็มได้ที่ docs/EDITING.md
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทยโดยตรง
 *
 * The `typeof homeNamespace` annotation is the per-namespace half of the
 * parity assertion: a missing key or an invented one does not compile.
 */
export const homeNamespace: typeof EnHomeNamespace = {
  home: {
    hero: {
      heading: "สโมสรนักศึกษา BIR",
      intro:
        "เราดูแลบริการต่าง ๆ ให้นักศึกษา BIR แจ้งข่าวสารและกิจกรรม และเป็นตัวแทนนักศึกษาต่อคณะ เริ่มต้นที่นี่",
      primaryCta: "ทำเรื่อง",
    },
    topTasks: {
      heading: "สิ่งที่คนใช้บ่อย",
      items: {
        borrowEquipment: {
          label: "ยืมอุปกรณ์",
          hint: "ยืมอุปกรณ์ของ BIRSA ได้ฟรี",
        },
        gettingStarted: {
          label: "เริ่มต้นที่ BIR",
          hint: "คู่มือทีละขั้นตอนสำหรับนักศึกษาใหม่",
        },
        courseReviews: {
          label: "รีวิววิชาเรียน",
          hint: "ดูความเห็นของเพื่อนนักศึกษาก่อนเลือกลงวิชา",
        },
        joinAClub: {
          label: "เข้าร่วมชมรม",
          hint: "หาชมรมที่สนใจ หรือดูวิธีตั้งชมรมของตัวเอง",
        },
        whatsOn: {
          label: "ข่าวและกิจกรรม",
          hint: "ข่าวสารและกิจกรรมจาก BIRSA",
        },
      },
    },
    whatsOn: {
      heading: "ข่าวและกิจกรรม",
      seeAll: "ดูข่าวและกิจกรรมทั้งหมด",
    },
  },

  doIndex: {
    title: "ทำเรื่อง",
    lede: "รวมบริการทั้งหมดของ BIRSA ไว้ที่เดียว จัดกลุ่มตามสิ่งที่คุณต้องการ",
    helpLabel: "ไม่แน่ใจว่าต้องเลือกอะไร",
    categories: {
      borrow: "ยืมของ",
      signUp: "สมัครเข้าร่วม",
      tellUs: "แจ้งเรื่องถึงเรา",
      other: "บริการอื่น ๆ",
    },
    staticLinks: {
      joinClub: {
        label: "เข้าร่วมชมรม",
        hint: "ดูรายชื่อชมรมและวิธีสมัครเข้าร่วม",
      },
      contact: {
        label: "ติดต่อ BIRSA",
        hint: "ส่งข้อความถึงคณะกรรมการ",
      },
    },
  },

  phaseBanner: {
    phaseLabel: "ทดลองใช้งาน",
    message: "นี่คือเว็บไซต์ BIRSA เวอร์ชันใหม่ บางหน้ายังจัดทำไม่เสร็จ",
    feedbackLabel: "ให้ความเห็นเกี่ยวกับเว็บไซต์นี้",
  },
};
