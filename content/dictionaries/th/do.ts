import type { doNamespace as EnDoNamespace } from "../en/do";

/**
 * Thai UI microcopy: the `do` namespace. Authored natively in Thai, never
 * translated from English (REDESIGN-2.0 §11.7, docs/EDITING.md).
 *
 * น้ำเสียง เป็นกันเองแต่สุภาพ ตรงไปตรงมา กระชับ ใช้ "คุณ" กับผู้อ่าน เลี่ยงภาษาราชการแข็ง ๆ
 * และเลี่ยงทับศัพท์ที่ไม่จำเป็น ตัวเลขใช้เลขอารบิก ไม่ใช้เครื่องหมายทับบรรทัด (dash) ทุกชนิด
 * และไม่ใช้ทวิภาค (:) นอกจากเวลานาฬิกาและ URL ดูมาตรฐานเต็มได้ที่ docs/EDITING.md
 *
 * NOT WIRED INTO `content/dictionaries/th/index.ts`, for the same reason the
 * English file explains: that index is frozen and does not yet compose a
 * `do` namespace. See `content/dictionaries/en/do.ts` for the full note.
 *
 * The annotation is the per-namespace half of the parity assertion: a
 * missing key or an invented one does not compile.
 */
export const doNamespace: typeof EnDoNamespace = {
  do: {
    stepOf: "คำถามข้อที่ {current} จาก {total}",
    continueLabel: "ดำเนินการต่อ",
    continuing: "กำลังดำเนินการ",
    confirmAndSend: "ยืนยันและส่งคำขอ",
    sending: "กำลังส่งคำขอ",
    genericSubmitError: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อ BIRSA โดยตรง",
    rateLimited: "คุณลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่",

    serviceNav: {
      start: "เริ่มทำรายการ",
      checkStatus: "ตรวจสอบสถานะ",
    },

    unavailable: {
      title: "บริการนี้ยังใช้งานไม่ได้ในขณะนี้",
      body: "บริการนี้ยังจัดทำไม่เสร็จและยังใช้งานไม่ได้ กรุณาลองใหม่ภายหลัง หรือติดต่อ BIRSA โดยตรง",
    },

    backToServices: "กลับไปหน้าบริการ",

    stepNotFound: {
      title: "ไม่พบคำถามนี้",
      body: "หน้าที่คุณพยายามเข้าถึงไม่ใช่ส่วนหนึ่งของบริการนี้ กรุณากลับไปเริ่มต้นใหม่",
    },

    confirmation: {
      heading: "ได้รับคำขอของคุณแล้ว",
      standardMessage: "BIRSA ตั้งเป้าตอบกลับภายใน {hours} ชั่วโมง",
    },

    statusLookup: {
      intro: "กรอกหมายเลขอ้างอิงและข้อมูลที่คุณให้ไว้ตอนยื่นคำขอ",
      referenceHint: "หมายเลขนี้อยู่ในอีเมลยืนยันที่ BIRSA ส่งให้คุณ",
      detailLabel: "ข้อมูลที่คุณให้ไว้ เช่น ที่อยู่อีเมลของคุณ",
      invalidBody: "กรุณากรอกทั้งหมายเลขอ้างอิงและข้อมูลที่คุณให้ไว้",
      notFoundTitle: "ไม่พบคำขอที่ตรงกัน",
      notFoundBody: "ตรวจสอบหมายเลขอ้างอิงและข้อมูลที่คุณกรอก แล้วลองใหม่อีกครั้ง",
      errorTitle: "เกิดข้อผิดพลาด",
      errorBody: "กรุณาลองใหม่อีกครั้ง หรือติดต่อ BIRSA โดยตรง",
      resultHeading: "คำขอของคุณ",
      referenceLabel: "หมายเลขอ้างอิง",
      statusLabel: "สถานะ",
      submittedLabel: "วันที่ยื่นคำขอ",
    },

    status: {
      received: "ได้รับคำขอแล้ว",
      inProgress: "กำลังดำเนินการ",
      done: "ดำเนินการเสร็จสิ้น",
    },

    checkAnswers: {
      notAnswered: "ยังไม่ได้ตอบ",
      yes: "ใช่",
      no: "ไม่ใช่",
      listSeparator: ", ",
    },

    subject: {
      chosenNote: "คำขอนี้สำหรับ {subject}",
    },
  },
};
