import type { forms as EnForms } from "../en/forms";

/**
 * Thai UI microcopy: the `forms` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a missing
 * key or an invented one does not compile.
 */
export const forms: typeof EnForms = {
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
  field: {
    day: "วัน",
    month: "เดือน",
    year: "ปี",
    from: "จาก",
    to: "ถึง",
  },
  characterCount: {
    hint: "กรอกได้ไม่เกิน {max} ตัวอักษร",
    remainingOne: "กรอกได้อีก 1 ตัวอักษร",
    remainingOther: "กรอกได้อีก {count} ตัวอักษร",
    overOne: "เกินขีดจำกัด 1 ตัวอักษร",
    overOther: "เกินขีดจำกัด {count} ตัวอักษร",
  },
};
