/**
 * Bilingual copy for the equipment loan request wizard
 * (`components/equipment/LoanRequestWizard.tsx`). Kept in its own module so
 * the wizard component stays focused on behaviour, and so both the wizard
 * and its server-side page wrapper can share the same strings.
 *
 * English and Thai entries are written in lock-step: whenever a key is
 * added or changed on one side, update the other immediately below it.
 */
import type { Bilingual } from "@/lib/inventory/types";
import { pluralize, type Locale } from "@/lib/i18n";

/** Slim view of an inventory item, just the fields the wizard needs. */
export type LoanWizardItem = {
  key: string;
  name: Bilingual;
  maxLoanDays: number;
};

export type LoanWizardStep =
  | "start"
  | "name"
  | "studentId"
  | "email"
  | "phone"
  | "dates"
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
  phone: {
    question: string;
    hint: string;
    errorInvalid: string;
  };
  dates: {
    title: string;
    startQuestion: string;
    startHint: string;
    endQuestion: string;
    endHint: string;
    errorStartRequired: string;
    errorStartInvalid: string;
    errorStartPast: string;
    errorEndRequired: string;
    errorEndInvalid: string;
    errorEndBeforeStart: string;
    errorTooLong: string;
    checkCta: string;
    checking: string;
    // One/other forms with a {count} placeholder, kept as plain strings for
    // the same serializability reason as common.stepOf.
    availableTemplate: { one: string; other: string };
    noneFreeTitle: string;
    noneFreeBody: string;
    checkErrorTitle: string;
    checkErrorBody: string;
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
    phoneLabel: string;
    phoneEmpty: string;
    startDateLabel: string;
    endDateLabel: string;
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
    blocklistedTitle: string;
    blocklistedBody: string;
    limitExceededTitle: string;
    limitExceededBody: string;
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

export function buildLoanWizardLabels(locale: Locale, item: LoanWizardItem): LoanWizardLabels {
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
        intro: "ก่อนเริ่ม เตรียมข้อมูลต่อไปนี้ให้พร้อม การกรอกแบบฟอร์มใช้เวลาไม่กี่นาที",
        needTitle: "สิ่งที่ต้องเตรียม",
        needItems: [
          "รหัสนักศึกษามหาวิทยาลัยธรรมศาสตร์",
          "อีเมลนักศึกษามหาวิทยาลัยธรรมศาสตร์ (@dome.tu.ac.th หรือ @tu.ac.th)",
        ],
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
      phone: {
        question: "เบอร์โทรศัพท์ของคุณคืออะไร",
        hint: "ไม่บังคับ ใช้ในกรณีที่ BIRSA ต้องการติดต่อคุณอย่างเร่งด่วนเกี่ยวกับคำขอนี้",
        errorInvalid: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง",
      },
      dates: {
        title: "คุณต้องการยืมอุปกรณ์วันไหนถึงวันไหน",
        startQuestion: "วันที่ต้องการมารับอุปกรณ์",
        startHint: `เลือกวันที่ต้องการมารับอุปกรณ์ที่สำนักงาน BIRSA ยืมได้สูงสุด ${maxDays} วัน`,
        endQuestion: "วันที่จะคืนอุปกรณ์",
        endHint: `ต้องอยู่ภายใน ${maxDays} วันนับจากวันที่รับอุปกรณ์`,
        errorStartRequired: "กรุณาเลือกวันที่ต้องการรับอุปกรณ์",
        errorStartInvalid: "กรุณาเลือกวันที่ให้ถูกต้อง",
        errorStartPast: "วันที่รับอุปกรณ์ต้องไม่ใช่วันที่ผ่านมาแล้ว",
        errorEndRequired: "กรุณาเลือกวันที่จะคืนอุปกรณ์",
        errorEndInvalid: "กรุณาเลือกวันที่ให้ถูกต้อง",
        errorEndBeforeStart: "วันที่คืนต้องไม่ก่อนวันที่รับอุปกรณ์",
        errorTooLong: `ระยะเวลายืมต้องไม่เกิน ${maxDays} วัน`,
        checkCta: "ตรวจสอบความพร้อมให้ยืม",
        checking: "กำลังตรวจสอบความพร้อมให้ยืม…",
        availableTemplate: {
          one: "มีอุปกรณ์ {count} ชิ้นพร้อมให้ยืมในช่วงวันที่คุณเลือก",
          other: "มีอุปกรณ์ {count} ชิ้นพร้อมให้ยืมในช่วงวันที่คุณเลือก",
        },
        noneFreeTitle: "ไม่มีอุปกรณ์ว่างในช่วงวันที่เลือก",
        noneFreeBody: "กรุณาเลือกช่วงวันที่อื่นแล้วลองใหม่อีกครั้ง",
        checkErrorTitle: "ตรวจสอบความพร้อมให้ยืมไม่สำเร็จ",
        checkErrorBody: "เกิดข้อผิดพลาดระหว่างตรวจสอบ กรุณาลองใหม่อีกครั้ง",
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
        phoneLabel: "เบอร์โทรศัพท์",
        phoneEmpty: "ไม่ได้ระบุ",
        startDateLabel: "วันที่รับ",
        endDateLabel: "วันที่คืน",
        reasonLabel: "เหตุผลในการยืม",
        reasonEmpty: "ไม่ได้ระบุ",
        submit: "ยอมรับและส่งคำขอ",
        submitting: "กำลังส่งคำขอ…",
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
          "ขออภัย อุปกรณ์ชิ้นนี้เพิ่งถูกยืมไปโดยผู้อื่นก่อนที่คำขอของคุณจะเสร็จสมบูรณ์ ลองเลือกช่วงวันที่อื่นหรือตรวจสอบรายการอุปกรณ์อีกครั้งในภายหลัง",
        blocklistedTitle: "ไม่สามารถส่งคำขอได้",
        blocklistedBody:
          "บัญชีของคุณไม่สามารถส่งคำขอยืมอุปกรณ์ได้ในขณะนี้ กรุณาติดต่อ BIRSA เพื่อขอทราบรายละเอียดเพิ่มเติม",
        limitExceededTitle: "คุณมีคำขอยืมอุปกรณ์ค้างอยู่เกินจำนวนที่กำหนด",
        limitExceededBody:
          "กรุณาคืนหรือรอผลคำขอที่ค้างอยู่ก่อน จึงจะสามารถส่งคำขอใหม่ได้ ติดต่อ BIRSA หากต้องการความช่วยเหลือ",
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
      intro:
        "Before you begin, have the following ready. The form takes a few minutes to complete.",
      needTitle: "What you will need",
      needItems: [
        "Your Thammasat University student ID",
        "Your Thammasat University student email (@dome.tu.ac.th or @tu.ac.th)",
      ],
      termsTitle: "Loan terms",
      termsBody: `You can borrow this item for up to ${pluralize(maxDays, { one: "1 day", other: `${maxDays} days` })}. Collect it in person from the BIRSA office once your request is approved.`,
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
    phone: {
      question: "What is your phone number",
      hint: "Optional. Used if BIRSA needs to reach you urgently about this request.",
      errorInvalid: "Enter a valid phone number",
    },
    dates: {
      title: "When do you need to borrow it",
      startQuestion: "Date you will collect the item",
      startHint: `Choose the date you will collect it from the BIRSA office. Maximum loan length is ${pluralize(maxDays, { one: "1 day", other: `${maxDays} days` })}.`,
      endQuestion: "Date you will return the item",
      endHint: `Must be within ${pluralize(maxDays, { one: "1 day", other: `${maxDays} days` })} of the collection date.`,
      errorStartRequired: "Enter the date you want to collect the item",
      errorStartInvalid: "Enter a valid date",
      errorStartPast: "The collection date cannot be in the past",
      errorEndRequired: "Enter the date you will return the item",
      errorEndInvalid: "Enter a valid date",
      errorEndBeforeStart: "The return date must be on or after the collection date",
      errorTooLong: `The loan period cannot exceed ${pluralize(maxDays, { one: "1 day", other: `${maxDays} days` })}`,
      checkCta: "Check availability",
      checking: "Checking availability…",
      availableTemplate: {
        one: "1 unit available for your dates",
        other: "{count} units available for your dates",
      },
      noneFreeTitle: "Nothing is free for those dates",
      noneFreeBody: "Try a different date range and check again.",
      checkErrorTitle: "Could not check availability",
      checkErrorBody: "Something went wrong while checking. Try again.",
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
      phoneLabel: "Phone number",
      phoneEmpty: "Not given",
      startDateLabel: "Collection date",
      endDateLabel: "Return date",
      reasonLabel: "Reason for borrowing",
      reasonEmpty: "Not given",
      submit: "Accept and send request",
      submitting: "Sending your request…",
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
        "Sorry, someone else's request for this item went through just before yours. Try a different date range, or check the equipment list again later.",
      blocklistedTitle: "We cannot accept this request",
      blocklistedBody:
        "Your account cannot request equipment loans right now. Contact BIRSA for more details.",
      limitExceededTitle: "You have too many open loan requests",
      limitExceededBody:
        "Wait for an existing request to be returned or decided before sending a new one. Contact BIRSA if you need help.",
      notConfiguredTitle: "Online requests are still being set up",
      notConfiguredBody: "Contact BIRSA directly to request this item through the",
      contactLink: "contact page",
      rateLimitedTitle: "Too many requests sent",
      rateLimitedBody: "Wait a moment and try sending your request again.",
      errorTitle: "Something went wrong",
      errorBody: "We could not send your request. Try again.",
      tryAgain: "Try again",
      backToCatalogue: "Back to the equipment list",
    },
  };
}
