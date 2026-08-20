import type { services as EnServices } from "../en/services";

/**
 * Thai UI microcopy: the `services` namespace. Authored natively in Thai,
 * never translated from English (REDESIGN-2.0 §11.7; docs/EDITING.md).
 *
 * น้ำเสียง: เป็นทางการ ตรงไปตรงมา กระชับ และเป็นกลาง ไม่ใช้น้ำเสียงกันเองแบบรุ่นพี่คุยกับรุ่นน้อง
 * และไม่ใช้ภาษาราชการแข็ง ๆ ดูมาตรฐานเต็มได้ที่ docs/EDITING.md หัวข้อ "Voice and language"
 * โครงสร้างต้องตรงกับภาษาอังกฤษ แต่ถ้อยคำเขียนขึ้นใหม่สำหรับผู้อ่านภาษาไทย
 *
 * The annotation is the per-namespace half of the parity assertion: a
 * missing key or an invented one does not compile.
 */
export const services: typeof EnServices = {
  service: {
    startPage: {
      beforeHeading: "สิ่งที่ต้องเตรียมก่อนเริ่ม",
      howLongHeading: "ใช้เวลานานเท่าไร",
      whatNextHeading: "ขั้นตอนต่อไป",
      startCta: "เริ่มทำรายการ",
    },
    checkAnswers: {
      heading: "ตรวจสอบคำตอบของคุณ",
      changeLabel: "แก้ไข",
    },
    confirmation: {
      referenceLabel: "หมายเลขอ้างอิงของคุณ",
      saveReference:
        "บันทึกหมายเลขอ้างอิงนี้ไว้ คุณจะต้องใช้เพื่อตรวจสอบคำขอของคุณ เนื่องจากบริการของ BIRSA ไม่มีระบบบัญชีผู้ใช้",
    },
    statusLookup: {
      heading: "ตรวจสอบสถานะคำขอ",
      submitLabel: "ตรวจสอบสถานะ",
    },
    taskList: {
      notStarted: "ยังไม่เริ่ม",
      inProgress: "กำลังดำเนินการ",
      cannotStartYet: "ยังเริ่มไม่ได้",
      completed: "เสร็จสมบูรณ์",
    },
    interruptionPage: {
      continueLabel: "ดำเนินการต่อ",
      secondaryLabel: "ฉันไม่ต้องการดำเนินการต่อ",
    },
    exitThisPage: {
      label: "ออกจากหน้านี้ทันที",
      shortcutHint: "กดปุ่ม Shift ติดต่อกันสามครั้งเพื่อออกจากหน้านี้อย่างรวดเร็ว",
      leavingAnnouncement: "กำลังออกจากหน้านี้",
    },
  },
};
