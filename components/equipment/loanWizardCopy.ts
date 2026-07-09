/**
 * Bilingual copy for the equipment loan request wizard
 * (`components/equipment/LoanRequestWizard.tsx`). Kept in its own module so
 * the wizard component stays focused on behaviour, and so both the wizard
 * and its server-side page wrapper can share the same strings.
 *
 * English and Thai entries are written in lock-step: whenever a key is
 * added or changed on one side, update the other immediately below it.
 */
import type { EquipmentItem } from "@/content/services/equipment";
import type { Locale } from "@/lib/i18n";

export type LoanWizardStep =
  | "start"
  | "name"
  | "studentId"
  | "email"
  | "pickup"
  | "return"
  | "reason"
  | "check"
  | "confirmation";

export type LoanWizardLabels = {
  common: {
    back: string;
    continueLabel: string;
    change: string;
    errorSummaryTitle: string;
    required: string;
    optional: string;
    // Template with {current}/{total} placeholders. Kept as a plain string (not
    // a function) so the labels object stays serializable when a server
    // component passes it to the client wizard.
    stepOf: string;
  };
  start: {
    title: string;
    intro: string;
    needTitle: string;
    needItems: string[];
    termsTitle: string;
    termsBody: string;
    cta: string;
    backToCatalogue: string;
  };
  name: {
    question: string;
    errorRequired: string;
  };
  studentId: {
    question: string;
    hint: string;
    errorRequired: string;
  };
  email: {
    question: string;
    hint: string;
    errorRequired: string;
    errorInvalid: string;
  };
  pickup: {
    question: string;
    hint: string;
    errorRequired: string;
    errorInvalid: string;
    errorPast: string;
  };
  returnStep: {
    question: string;
    hint: string;
    errorRequired: string;
    errorInvalid: string;
    errorBeforePickup: string;
    errorTooLong: string;
  };
  reason: {
    question: string;
    hint: string;
    optionalNote: string;
  };
  check: {
    title: string;
    itemLabel: string;
    nameLabel: string;
    studentIdLabel: string;
    emailLabel: string;
    pickupLabel: string;
    returnLabel: string;
    reasonLabel: string;
    reasonEmpty: string;
    submit: string;
    submitting: string;
  };
  confirmation: {
    title: string;
    referenceLabel: string;
    nextStepsTitle: string;
    nextSteps: string[];
    backToCatalogue: string;
  };
  results: {
    unavailableTitle: string;
    unavailableBody: string;
    notConfiguredTitle: string;
    notConfiguredBody: string;
    contactLink: string;
    rateLimitedTitle: string;
    rateLimitedBody: string;
    errorTitle: string;
    errorBody: string;
    tryAgain: string;
    backToCatalogue: string;
  };
};

export function buildLoanWizardLabels(locale: Locale, item: EquipmentItem): LoanWizardLabels {
  const itemName = item.name[locale];
  const maxDays = item.maxLoanDays;

  if (locale === "th") {
    return {
      common: {
        back: "ย้อนกลับ",
        continueLabel: "ดำเนินการต่อ",
        change: "แก้ไข",
        errorSummaryTitle: "พบข้อผิดพลาด กรุณาตรวจสอบ",
        required: "จำเป็น",
        optional: "ไม่บังคับ",
        stepOf: "ขั้นตอนที่ {current} จาก {total}",
      },
      start: {
        title: `ขอยืม${itemName}`,
        intro:
          "ก่อนเริ่ม เตรียมข้อมูลต่อไปนี้ให้พร้อม การกรอกแบบฟอร์มใช้เวลาไม่กี่นาที",
        needTitle: "สิ่งที่ต้องเตรียม",
        needItems: ["รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์", "อีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ (@dome.tu.ac.th หรือ @tu.ac.th)"],
        termsTitle: "เงื่อนไขการยืม",
        termsBody: `ยืมได้สูงสุด ${maxDays} วัน และต้องมารับที่สำนักงาน BIRSA ด้วยตนเองหลังคำขอได้รับการอนุมัติ`,
        cta: "เริ่มคำขอ",
        backToCatalogue: "กลับไปหน้ารายการอุปกรณ์",
      },
      name: {
        question: "ชื่อ-นามสกุลของคุณคืออะไร",
        errorRequired: "กรุณากรอกชื่อ-นามสกุลของคุณ",
      },
      studentId: {
        question: "รหัสนักศึกษาของคุณคืออะไร",
        hint: "รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์ของคุณ",
        errorRequired: "กรุณากรอกรหัสนักศึกษาของคุณ",
      },
      email: {
        question: "อีเมลนักศึกษาของคุณคืออะไร",
        hint: "เราจะใช้อีเมลนี้แจ้งผลการพิจารณาคำขอของคุณ",
        errorRequired: "กรุณากรอกอีเมลของคุณ",
        errorInvalid: "กรุณากรอกอีเมลให้ถูกต้องตามรูปแบบ เช่น name@example.com",
      },
      pickup: {
        question: "คุณต้องการมารับอุปกรณ์วันไหน",
        hint: `เลือกวันที่ต้องการมารับอุปกรณ์ที่สำนักงาน BIRSA ยืมได้สูงสุด ${maxDays} วัน`,
        errorRequired: "กรุณาเลือกวันที่ต้องการรับอุปกรณ์",
        errorInvalid: "กรุณาเลือกวันที่ให้ถูกต้อง",
        errorPast: "วันที่รับอุปกรณ์ต้องไม่ใช่วันที่ผ่านมาแล้ว",
      },
      returnStep: {
        question: "คุณจะคืนอุปกรณ์วันไหน",
        hint: `ต้องอยู่ภายใน ${maxDays} วันนับจากวันที่รับอุปกรณ์`,
        errorRequired: "กรุณาเลือกวันที่จะคืนอุปกรณ์",
        errorInvalid: "กรุณาเลือกวันที่ให้ถูกต้อง",
        errorBeforePickup: "วันที่คืนต้องไม่ก่อนวันที่รับอุปกรณ์",
        errorTooLong: `ระยะเวลายืมต้องไม่เกิน ${maxDays} วัน`,
      },
      reason: {
        question: "คุณต้องการยืมไปใช้ทำอะไร",
        hint: "อธิบายสั้น ๆ ว่าจะนำอุปกรณ์ไปใช้ในกิจกรรมหรือเหตุการณ์ใด",
        optionalNote: "ข้อมูลนี้ไม่บังคับ แต่ช่วยให้ BIRSA พิจารณาคำขอได้เร็วขึ้น",
      },
      check: {
        title: "ตรวจสอบคำตอบของคุณ",
        itemLabel: "อุปกรณ์",
        nameLabel: "ชื่อ-นามสกุล",
        studentIdLabel: "รหัสนักศึกษา",
        emailLabel: "อีเมล",
        pickupLabel: "วันที่รับ",
        returnLabel: "วันที่คืน",
        reasonLabel: "เหตุผลในการยืม",
        reasonEmpty: "ไม่ได้ระบุ",
        submit: "ยอมรับและส่งคำขอ",
        submitting: "กำลังส่งคำขอ...",
      },
      confirmation: {
        title: "ส่งคำขอเรียบร้อยแล้ว",
        referenceLabel: "หมายเลขอ้างอิงของคุณ",
        nextStepsTitle: "ขั้นตอนต่อไป",
        nextSteps: [
          "ตรวจสอบอีเมลของคุณเพื่อดูผลการพิจารณาคำขอ",
          "เมื่อคำขอได้รับการอนุมัติ ให้มารับอุปกรณ์ที่สำนักงาน BIRSA ตามวันที่ระบุไว้",
          "หากมีคำถาม ติดต่อ BIRSA ได้ทุกเมื่อ",
        ],
        backToCatalogue: "กลับไปหน้ารายการอุปกรณ์",
      },
      results: {
        unavailableTitle: "อุปกรณ์เพิ่งถูกยืมไป",
        unavailableBody:
          "ขออภัย อุปกรณ์ชิ้นนี้เพิ่งถูกยืมไปโดยผู้อื่นก่อนที่คำขอของคุณจะเสร็จสมบูรณ์ ลองตรวจสอบรายการอุปกรณ์อีกครั้งในภายหลัง",
        notConfiguredTitle: "ระบบส่งคำขอออนไลน์กำลังอยู่ระหว่างการเตรียมการ",
        notConfiguredBody: "กรุณาติดต่อ BIRSA โดยตรงเพื่อขอยืมอุปกรณ์ผ่านหน้า",
        contactLink: "ติดต่อ BIRSA",
        rateLimitedTitle: "มีการส่งคำขอถี่เกินไป",
        rateLimitedBody: "กรุณารอสักครู่แล้วลองส่งคำขออีกครั้ง",
        errorTitle: "เกิดข้อผิดพลาด",
        errorBody: "ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง",
        tryAgain: "ลองอีกครั้ง",
        backToCatalogue: "กลับไปหน้ารายการอุปกรณ์",
      },
    };
  }

  return {
    common: {
      back: "Back",
      continueLabel: "Continue",
      change: "Change",
      errorSummaryTitle: "There is a problem",
      required: "required",
      optional: "optional",
      stepOf: "Step {current} of {total}",
    },
    start: {
      title: `Request to borrow the ${itemName.toLowerCase()}`,
      intro: "Before you begin, have the following ready. The form takes a few minutes to complete.",
      needTitle: "What you will need",
      needItems: ["Your Thammasat University student ID", "Your Thammasat University student email (@dome.tu.ac.th or @tu.ac.th)"],
      termsTitle: "Loan terms",
      termsBody: `You can borrow this item for up to ${maxDays} day(s). Collect it in person from the BIRSA office once your request is approved.`,
      cta: "Start now",
      backToCatalogue: "Back to the equipment list",
    },
    name: {
      question: "What is your full name",
      errorRequired: "Enter your full name",
    },
    studentId: {
      question: "What is your student ID",
      hint: "Your Thammasat University student ID number.",
      errorRequired: "Enter your student ID",
    },
    email: {
      question: "What is your student email address",
      hint: "We will use this to let you know the outcome of your request.",
      errorRequired: "Enter your email address",
      errorInvalid: "Enter an email address in the correct format, like name@example.com",
    },
    pickup: {
      question: "When do you want to collect the item",
      hint: `Choose the date you will collect it from the BIRSA office. Maximum loan length is ${maxDays} day(s).`,
      errorRequired: "Enter the date you want to collect the item",
      errorInvalid: "Enter a valid date",
      errorPast: "The pickup date cannot be in the past",
    },
    returnStep: {
      question: "When will you return the item",
      hint: `Must be within ${maxDays} day(s) of the pickup date.`,
      errorRequired: "Enter the date you will return the item",
      errorInvalid: "Enter a valid date",
      errorBeforePickup: "The return date must be on or after the pickup date",
      errorTooLong: `The loan period cannot exceed ${maxDays} day(s)`,
    },
    reason: {
      question: "What will you use it for",
      hint: "A short description of the event or activity you need it for.",
      optionalNote: "This is optional, but it helps BIRSA review your request faster.",
    },
    check: {
      title: "Check your answers",
      itemLabel: "Item",
      nameLabel: "Full name",
      studentIdLabel: "Student ID",
      emailLabel: "Email address",
      pickupLabel: "Pickup date",
      returnLabel: "Return date",
      reasonLabel: "Reason for borrowing",
      reasonEmpty: "Not given",
      submit: "Accept and send request",
      submitting: "Sending your request...",
    },
    confirmation: {
      title: "Your request has been sent",
      referenceLabel: "Your reference number",
      nextStepsTitle: "What happens next",
      nextSteps: [
        "Watch your email for the outcome of your request.",
        "Once approved, collect the item from the BIRSA office on the date you chose.",
        "If you have questions, contact BIRSA at any time.",
      ],
      backToCatalogue: "Back to the equipment list",
    },
    results: {
      unavailableTitle: "This item was just borrowed",
      unavailableBody:
        "Sorry, someone else's request for this item went through just before yours. Check the equipment list again later to see when it is free.",
      notConfiguredTitle: "Online requests are still being set up",
      notConfiguredBody: "Please contact BIRSA directly to request this item through the",
      contactLink: "contact page",
      rateLimitedTitle: "Too many requests sent",
      rateLimitedBody: "Please wait a moment and try sending your request again.",
      errorTitle: "Something went wrong",
      errorBody: "We could not send your request. Please try again.",
      tryAgain: "Try again",
      backToCatalogue: "Back to the equipment list",
    },
  };
}
