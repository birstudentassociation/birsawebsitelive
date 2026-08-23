import type { help as EnHelp } from "../en/help";

/**
 * Thai UI microcopy: the `help` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const help: typeof EnHelp = {
  sectionLabel: "ขอความช่วยเหลือ",

  hub: {
    title: "ขอความช่วยเหลือ",
    lede: "คำตอบอัตโนมัติ กฎที่เกี่ยวข้องกับคุณ การแจ้งเรื่อง สวัสดิการ และความช่วยเหลือสำหรับนักศึกษาต่างชาติ",
  },

  exitThisPage: {
    label: "ออกจากหน้านี้ทันที",
    shortcutHint: "กดปุ่ม Shift สามครั้งติดกันเพื่อออกจากหน้านี้ทันที",
    leavingAnnouncement: "กำลังออกจากหน้านี้",
  },

  interruption: {
    continueLabel: "ไปต่อ",
    secondaryLabel: "ฉันไม่ต้องการไปต่อ",
  },

  signpost: {
    whoToAskLabel: "ควรสอบถามใคร",
    visitLabel: "ไปที่เว็บไซต์",
  },

  guidesIndex: {
    title: "คู่มือ",
    lede: "หน้าสั้น ๆ ที่บอกสิ่งที่ BIRSA รู้ แล้วชี้ไปยังหน่วยงานที่รับผิดชอบเรื่องนั้นโดยตรง",
  },

  internationalIndex: {
    title: "ความช่วยเหลือสำหรับนักศึกษาต่างชาติ",
    lede: "จุดที่ BIRSA ช่วยได้โดยตรง และจุดที่กองกิจการต่างประเทศของธรรมศาสตร์เป็นผู้ตัดสินใจจริง",
  },

  emergencyBanner: {
    cta: "อ่านคำแนะนำเหตุฉุกเฉิน",
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
};
