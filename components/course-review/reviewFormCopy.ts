/**
 * Bilingual copy for the course review submission form
 * (components/course-review/ReviewForm.tsx and the pages under
 * app/[lang]/student-life/course-reviews/[code]/review). Kept in its own
 * module, matching components/feedback/feedbackCopy.ts, so the form stays
 * focused on behaviour and the form and its page wrappers share the strings.
 *
 * English follows GOV.UK style: error messages say what to do, not what went
 * wrong. Thai is written as Thai, not translated. Both are written in
 * lock-step: whenever a key changes on one side, change the other beside it.
 */
import type { WorkloadBand } from "@/content/course-review/types";
import type { ReviewErrorCode, ReviewField } from "@/lib/course-review/submit";
import type { Locale } from "@/lib/i18n";

/** What each error code says for each field. A field lists only the codes it can raise. */
export type ReviewErrorCopy = Record<ReviewField, Partial<Record<ReviewErrorCode, string>>>;

export type ReviewFormCopy = {
  title: string;
  lede: string;
  /** Shown above the form: what BIRSA does with a review. */
  howItWorksTitle: string;
  howItWorks: string[];
  termLabel: string;
  termHint: string;
  termPlaceholder: string;
  instructorLabel: string;
  instructorHint: string;
  instructorPlaceholder: string;
  instructorOther: string;
  workloadLabel: string;
  workloadHint: string;
  bandLegend: string;
  bandHint: string;
  bandLabels: Record<WorkloadBand, string>;
  bandNone: string;
  assessmentLabel: string;
  assessmentHint: string;
  tipsLegend: string;
  tipsHint: string;
  /** Contains {n}. */
  tipLabel: string;
  quoteLabel: string;
  quoteHint: string;
  /** Contains {max}. Appears next to a text box as the limit. */
  charactersHint: string;
  privacyWarning: string;
  requiredLabel: string;
  optionalLabel: string;
  errorSummaryTitle: string;
  /** Contains {max}. */
  errors: ReviewErrorCopy;
  submit: string;
  submitting: string;
  notConfiguredTitle: string;
  notConfiguredBody: string;
  /** Shown instead of the form when the database is not connected. */
  unavailableTitle: string;
  unavailableBody: string;
  errorTitle: string;
  errorBody: string;
  rateLimitedTitle: string;
  rateLimitedBody: string;
  confirmationTitle: string;
  /** Contains {threshold}. */
  confirmationBody: string;
  backToCourse: string;
  breadcrumbLabel: string;
};

export const reviewFormCopy: Record<Locale, ReviewFormCopy> = {
  en: {
    title: "Write a review",
    lede: "Tell future students what the course was really like.",
    howItWorksTitle: "Before you start",
    howItWorks: [
      "Your review is anonymous. The form does not ask for your name, student ID or email address, and BIRSA does not store your IP address.",
      "An officer reads every review before anything is published. BIRSA publishes a summary only once at least {threshold} students have reviewed the same course, term and instructor, so your words are never shown on their own.",
      "Describe what it was like in words. Reviews have no scores or star ratings.",
    ],
    termLabel: "Which term did you take this course?",
    termHint: "You can review the last three academic years.",
    termPlaceholder: "Choose a term",
    instructorLabel: "Who taught it?",
    instructorHint: "Choose the instructor for that term.",
    instructorPlaceholder: "Choose an instructor",
    instructorOther: "Someone else, or I am not sure",
    workloadLabel: "What was the workload like?",
    workloadHint:
      "For example, how much reading and how many assignments there were, and whether the work was steady or came in bursts.",
    bandLegend: "About how many hours a week did you spend on this course?",
    bandHint:
      "A rough estimate is fine. BIRSA shows how many students chose each answer. It never shows an average.",
    bandLabels: {
      under_3: "Under 3 hours a week",
      "3_to_6": "3 to 6 hours a week",
      over_6: "Over 6 hours a week",
    },
    bandNone: "I would rather not say",
    assessmentLabel: "How was it assessed in practice?",
    assessmentHint:
      "For example, what the exams and assignments asked of you, and how the marking felt.",
    tipsLegend: "Tips for future students",
    tipsHint: "Up to three. One tip in each box.",
    tipLabel: "Tip {n}",
    quoteLabel: "A short quote BIRSA may publish",
    quoteHint: "Your own words, in Thai or English. An officer may leave it out.",
    charactersHint: "Up to {max} characters.",
    privacyWarning:
      "Do not include your name, student ID, contact details, or the name of any student. Say what the course was like. Do not criticise a person.",
    requiredLabel: "required",
    optionalLabel: "optional",
    errorSummaryTitle: "There is a problem",
    errors: {
      term: {
        required: "Select the term you took this course",
        invalidChoice: "Select a term from the list",
      },
      instructor: {
        required: "Select who taught the course",
        invalidChoice: "Select an instructor from the list",
      },
      workload: {
        required: "Describe what the workload was like",
        tooShort: "Describe the workload in a little more detail",
        tooLong: "Shorten your description of the workload to {max} characters or fewer",
        identifying:
          "Remove any email address, phone number or student ID from your description of the workload",
      },
      workloadBand: {
        invalidChoice: "Select one of the hours a week options, or leave it blank",
      },
      assessment: {
        required: "Describe how the course was assessed",
        tooShort: "Describe the assessment in a little more detail",
        tooLong: "Shorten your description of the assessment to {max} characters or fewer",
        identifying:
          "Remove any email address, phone number or student ID from your description of the assessment",
      },
      tips: {
        tooLong: "Shorten each tip to {max} characters or fewer",
        identifying: "Remove any email address, phone number or student ID from your tips",
      },
      quote: {
        tooLong: "Shorten your quote to {max} characters or fewer",
        identifying: "Remove any email address, phone number or student ID from your quote",
      },
    },
    submit: "Send review",
    submitting: "Sending",
    notConfiguredTitle: "Reviews cannot be stored right now",
    notConfiguredBody: "The database is not connected, so this review was not saved.",
    unavailableTitle: "Reviews are not being collected yet",
    unavailableBody:
      "This service is not switched on. If you would like to share what a course was like, contact BIRSA.",
    errorTitle: "Something went wrong",
    errorBody: "Your review was not saved. Try again.",
    rateLimitedTitle: "Too many reviews sent",
    rateLimitedBody: "Wait a few minutes, then send your review again.",
    confirmationTitle: "Review received",
    confirmationBody:
      "Thank you. An officer will read your review. BIRSA publishes a summary only once at least {threshold} students have reviewed the same course, term and instructor, so yours may not appear for some time.",
    backToCourse: "Back to the course",
    breadcrumbLabel: "Write a review",
  },
  th: {
    title: "เขียนรีวิวรายวิชา",
    lede: "เล่าให้รุ่นน้องฟังว่าวิชานี้เป็นอย่างไรจริง ๆ",
    howItWorksTitle: "ก่อนเริ่มเขียน",
    howItWorks: [
      "รีวิวนี้ไม่ระบุตัวตน แบบฟอร์มไม่ถามชื่อ รหัสนักศึกษา หรืออีเมลของคุณ และ BIRSA ไม่เก็บหมายเลขไอพีของคุณ",
      "เจ้าหน้าที่จะอ่านทุกรีวิวก่อนเผยแพร่สิ่งใด และ BIRSA จะเผยแพร่เป็นบทสรุปเมื่อมีนักศึกษารีวิววิชา ภาคการศึกษา และอาจารย์ผู้สอนเดียวกันอย่างน้อย {threshold} คนเท่านั้น ข้อความของคุณจึงไม่ถูกแสดงโดยลำพัง",
      "เล่าด้วยถ้อยคำ รีวิวไม่มีคะแนนหรือดาว",
    ],
    termLabel: "คุณเรียนวิชานี้ในภาคการศึกษาใด",
    termHint: "รีวิวได้ย้อนหลังสามปีการศึกษา",
    termPlaceholder: "เลือกภาคการศึกษา",
    instructorLabel: "ใครเป็นผู้สอน",
    instructorHint: "เลือกอาจารย์ผู้สอนในภาคการศึกษานั้น",
    instructorPlaceholder: "เลือกอาจารย์ผู้สอน",
    instructorOther: "เป็นอาจารย์ท่านอื่น หรือไม่แน่ใจ",
    workloadLabel: "ปริมาณงานเป็นอย่างไร",
    workloadHint:
      "เช่น มีงานอ่านและงานที่ต้องส่งมากน้อยแค่ไหน และงานกระจายสม่ำเสมอหรือมากระจุกในบางช่วง",
    bandLegend: "คุณใช้เวลากับวิชานี้ประมาณกี่ชั่วโมงต่อสัปดาห์",
    bandHint:
      "ตอบคร่าว ๆ ได้ BIRSA จะแสดงว่ามีนักศึกษากี่คนเลือกคำตอบแต่ละช่วง และไม่แสดงค่าเฉลี่ย",
    bandLabels: {
      under_3: "ไม่ถึง 3 ชั่วโมงต่อสัปดาห์",
      "3_to_6": "3 ถึง 6 ชั่วโมงต่อสัปดาห์",
      over_6: "มากกว่า 6 ชั่วโมงต่อสัปดาห์",
    },
    bandNone: "ขอไม่ตอบ",
    assessmentLabel: "วัดผลในทางปฏิบัติอย่างไร",
    assessmentHint: "เช่น ข้อสอบและงานที่ให้ทำถามอะไรจากคุณ และการให้คะแนนเป็นอย่างไร",
    tipsLegend: "เคล็ดลับสำหรับรุ่นน้อง",
    tipsHint: "ได้ไม่เกินสามข้อ ช่องละหนึ่งข้อ",
    tipLabel: "เคล็ดลับข้อที่ {n}",
    quoteLabel: "ข้อความสั้น ๆ ที่ BIRSA นำไปเผยแพร่ได้",
    quoteHint: "ใช้ถ้อยคำของคุณเอง จะเป็นภาษาไทยหรืออังกฤษก็ได้ เจ้าหน้าที่อาจไม่นำไปใช้",
    charactersHint: "ไม่เกิน {max} ตัวอักษร",
    privacyWarning:
      "ไม่ต้องใส่ชื่อ รหัสนักศึกษา ช่องทางติดต่อ หรือชื่อของนักศึกษาคนใด เล่าว่าวิชานี้เป็นอย่างไร และอย่าตำหนิตัวบุคคล",
    requiredLabel: "จำเป็น",
    optionalLabel: "ไม่บังคับ",
    errorSummaryTitle: "พบข้อผิดพลาด",
    errors: {
      term: {
        required: "เลือกภาคการศึกษาที่คุณเรียนวิชานี้",
        invalidChoice: "เลือกภาคการศึกษาจากรายการ",
      },
      instructor: {
        required: "เลือกผู้สอนวิชานี้",
        invalidChoice: "เลือกอาจารย์ผู้สอนจากรายการ",
      },
      workload: {
        required: "เล่าว่าปริมาณงานเป็นอย่างไร",
        tooShort: "เล่าปริมาณงานให้ละเอียดขึ้นอีกเล็กน้อย",
        tooLong: "ย่อคำอธิบายปริมาณงานให้ไม่เกิน {max} ตัวอักษร",
        identifying: "ลบอีเมล เบอร์โทรศัพท์ หรือรหัสนักศึกษาออกจากคำอธิบายปริมาณงาน",
      },
      workloadBand: {
        invalidChoice: "เลือกช่วงชั่วโมงต่อสัปดาห์จากตัวเลือก หรือเว้นว่างไว้",
      },
      assessment: {
        required: "เล่าว่าวิชานี้วัดผลอย่างไร",
        tooShort: "เล่าการวัดผลให้ละเอียดขึ้นอีกเล็กน้อย",
        tooLong: "ย่อคำอธิบายการวัดผลให้ไม่เกิน {max} ตัวอักษร",
        identifying: "ลบอีเมล เบอร์โทรศัพท์ หรือรหัสนักศึกษาออกจากคำอธิบายการวัดผล",
      },
      tips: {
        tooLong: "ย่อเคล็ดลับแต่ละข้อให้ไม่เกิน {max} ตัวอักษร",
        identifying: "ลบอีเมล เบอร์โทรศัพท์ หรือรหัสนักศึกษาออกจากเคล็ดลับ",
      },
      quote: {
        tooLong: "ย่อข้อความที่ยกมาให้ไม่เกิน {max} ตัวอักษร",
        identifying: "ลบอีเมล เบอร์โทรศัพท์ หรือรหัสนักศึกษาออกจากข้อความที่ยกมา",
      },
    },
    submit: "ส่งรีวิว",
    submitting: "กำลังส่ง",
    notConfiguredTitle: "ยังบันทึกรีวิวไม่ได้ในขณะนี้",
    notConfiguredBody: "ยังไม่ได้เชื่อมต่อฐานข้อมูล จึงไม่ได้บันทึกรีวิวนี้",
    unavailableTitle: "ยังไม่เปิดรับรีวิว",
    unavailableBody:
      "บริการนี้ยังไม่เปิดใช้งาน หากต้องการเล่าว่าวิชานี้เป็นอย่างไร ติดต่อ BIRSA ได้",
    errorTitle: "เกิดข้อผิดพลาด",
    errorBody: "ไม่ได้บันทึกรีวิวของคุณ ลองอีกครั้ง",
    rateLimitedTitle: "ส่งรีวิวบ่อยเกินไป",
    rateLimitedBody: "รอสักครู่ แล้วส่งรีวิวอีกครั้ง",
    confirmationTitle: "ได้รับรีวิวแล้ว",
    confirmationBody:
      "ขอบคุณ เจ้าหน้าที่จะอ่านรีวิวของคุณ BIRSA จะเผยแพร่เป็นบทสรุปเมื่อมีนักศึกษารีวิววิชา ภาคการศึกษา และอาจารย์ผู้สอนเดียวกันอย่างน้อย {threshold} คนเท่านั้น รีวิวของคุณจึงอาจยังไม่ปรากฏในทันที",
    backToCourse: "กลับไปหน้ารายวิชา",
    breadcrumbLabel: "เขียนรีวิว",
  },
};
