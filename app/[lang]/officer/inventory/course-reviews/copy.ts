/**
 * Bilingual copy for the course review moderation console (the queue page,
 * the group page and the summary editor). Kept beside the pages, as the
 * feedback console keeps its copy, and written in lock-step: whenever a key
 * changes on one side, change the other beside it.
 */
import type { SummaryErrorCode } from "@/lib/course-review/summary-form";
import type {
  DraftState,
  PublishState,
} from "@/app/[lang]/officer/inventory/course-reviews/actions";
import type { Locale } from "@/lib/i18n";

type DraftFailure = Extract<DraftState, { status: "failed" }>["reason"];
type PublishFailure = Extract<PublishState, { status: "failed" }>["reason"];

export type ConsoleCopy = {
  title: string;
  lede: string;
  signInTitle: string;
  signInBody: string;
  signInCta: string;
  noAccessTitle: string;
  noAccessBody: string;
  dbNotConfiguredTitle: string;
  dbNotConfiguredBody: string;
  /** Contains {threshold}. */
  ruleBody: string;
  summariserOnBody: string;
  summariserOffBody: string;
  queueTitle: string;
  queueEmpty: string;
  courseHeader: string;
  termHeader: string;
  instructorHeader: string;
  pendingHeader: string;
  approvedHeader: string;
  rejectedHeader: string;
  statusHeader: string;
  openAction: string;
  otherInstructor: string;
  statusNeedsDecisions: string;
  statusReady: string;
  statusPublished: string;
  /** Contains {n}. */
  statusWaiting: string;
  backToQueue: string;
  groupTitle: string;
  /** Contains {approved} and {threshold}. */
  progress: string;
  submissionsTitle: string;
  submissionStatus: Record<"pending" | "approved" | "rejected", string>;
  submittedLabel: string;
  languageLabel: string;
  workloadLabel: string;
  bandLabel: string;
  bandLabels: Record<"under_3" | "3_to_6" | "over_6", string>;
  assessmentLabel: string;
  tipsLabel: string;
  quoteLabel: string;
  approve: string;
  reject: string;
  notEnoughTitle: string;
  /** Contains {n}. */
  notEnoughBody: string;
  summaryTitle: string;
  publishedTitle: string;
  /** Contains {count} and {date}. */
  publishedBody: string;
  /** Shown when a published group has since fallen below the threshold. */
  publishedBelowBody: string;
  unpublish: string;
  draftTitle: string;
  draftBody: string;
  draftButton: string;
  draftingButton: string;
  draftUnavailableTitle: string;
  draftUnavailableBody: string;
  draftReady: string;
  draftFailed: Record<DraftFailure, string>;
  editorTitle: string;
  editorBody: string;
  englishHeading: string;
  thaiHeading: string;
  workloadField: string;
  assessmentField: string;
  tipField: string;
  quoteField: string;
  bandsReadOnlyTitle: string;
  bandsReadOnlyNone: string;
  publishButton: string;
  updateButton: string;
  publishingButton: string;
  publishedDone: string;
  unpublishedDone: string;
  publishFailed: Record<PublishFailure, string>;
  errorSummaryTitle: string;
  /** Contains {max}. */
  errors: Record<SummaryErrorCode, string>;
};

export const consoleCopy: Record<Locale, ConsoleCopy> = {
  en: {
    title: "Course reviews",
    lede: "Approve anonymous submissions, then publish a summary once a course, term and instructor has enough.",
    signInTitle: "Sign in on the console home",
    signInBody: "You need an active officer session to moderate course reviews.",
    signInCta: "Go to console home",
    noAccessTitle: "Only Academic Affairs and admins can moderate reviews",
    noAccessBody:
      "Your role cannot use this page. Ask an admin to give you the Academic affairs role.",
    dbNotConfiguredTitle: "The reviews database is not connected",
    dbNotConfiguredBody: "POSTGRES_URL is not configured, so there are no submissions to show yet.",
    ruleBody:
      "A course, term and instructor is published only once it has at least {threshold} approved submissions, so no single student can be picked out. Nothing is published until an officer has edited and approved the summary.",
    summariserOnBody: "Claude can draft summaries. You edit and approve every one.",
    summariserOffBody:
      "Claude drafting is switched off because ANTHROPIC_API_KEY is not set. You can still write each summary by hand.",
    queueTitle: "Queue",
    queueEmpty: "No reviews have been submitted yet.",
    courseHeader: "Course",
    termHeader: "Term",
    instructorHeader: "Instructor",
    pendingHeader: "Pending",
    approvedHeader: "Approved",
    rejectedHeader: "Rejected",
    statusHeader: "Status",
    openAction: "Open",
    otherInstructor: "Someone else",
    statusNeedsDecisions: "Needs decisions",
    statusReady: "Ready to publish",
    statusPublished: "Published",
    statusWaiting: "Needs {n} more approved",
    backToQueue: "Back to the queue",
    groupTitle: "Reviews for",
    progress: "{approved} of {threshold} approved",
    submissionsTitle: "Submissions",
    submissionStatus: { pending: "Pending", approved: "Approved", rejected: "Rejected" },
    submittedLabel: "Submitted",
    languageLabel: "Written in",
    workloadLabel: "Workload",
    bandLabel: "Hours a week",
    bandLabels: {
      under_3: "Under 3 hours a week",
      "3_to_6": "3 to 6 hours a week",
      over_6: "Over 6 hours a week",
    },
    assessmentLabel: "Assessment",
    tipsLabel: "Tips",
    quoteLabel: "Quote",
    approve: "Approve",
    reject: "Reject",
    notEnoughTitle: "Not enough approved submissions to publish",
    notEnoughBody: "Approve {n} more before a summary can be drafted or published.",
    summaryTitle: "Summary",
    publishedTitle: "Published",
    publishedBody:
      "This summary is live on the course page. It rests on {count} submissions and was published on {date}.",
    publishedBelowBody:
      "This summary is live, but fewer submissions are approved now than when it was published. Unpublish it if that changes whether it is safe to show.",
    unpublish: "Unpublish",
    draftTitle: "Draft with Claude",
    draftBody:
      "Sends the approved submissions to Claude, which returns a draft in both languages. The draft appears in the form below. Nothing is saved or published until you press the publish button.",
    draftButton: "Draft summary",
    draftingButton: "Drafting",
    draftUnavailableTitle: "Claude drafting is not available",
    draftUnavailableBody:
      "ANTHROPIC_API_KEY is not set on this site. Write the summary by hand in the form below.",
    draftReady:
      "Draft ready. Read it, edit it and check it against the submissions before you publish.",
    draftFailed: {
      "not-configured":
        "Claude drafting is not set up. Write the summary by hand in the form below.",
      "too-few": "There are not enough approved submissions to draft a summary.",
      "below-threshold": "There are not enough approved submissions to draft a summary.",
      refused:
        "Claude declined to draft this summary. Write it by hand, or check the submissions for anything it may have objected to.",
      truncated:
        "Claude's answer was cut off before it finished. Try again, or write the summary by hand.",
      "unexpected-stop":
        "Claude stopped before it finished the draft. Try again, or write the summary by hand.",
      "bad-output":
        "Claude's answer could not be read as a summary. Try again, or write the summary by hand.",
      "api-error":
        "Claude could not be reached. Try again in a few minutes, or write the summary by hand.",
      forbidden: "Your role cannot draft summaries.",
      "bad-group": "This group could not be found.",
    },
    editorTitle: "Edit and publish",
    editorBody:
      "What is in this form is what the public will read, so check every line. Fill in both languages. A tip or quote needs both, or neither. Leave unused boxes empty.",
    englishHeading: "English",
    thaiHeading: "Thai",
    workloadField: "What the workload is like",
    assessmentField: "How it is assessed in practice",
    tipField: "Tip {n}",
    quoteField: "Quote {n}",
    bandsReadOnlyTitle: "Hours a week reported",
    bandsReadOnlyNone: "No student gave an estimate.",
    publishButton: "Publish summary",
    updateButton: "Update published summary",
    publishingButton: "Publishing",
    publishedDone: "Published. The summary is now on the course page.",
    unpublishedDone: "Unpublished. The summary is no longer on the course page.",
    publishFailed: {
      forbidden: "Your role cannot publish summaries.",
      "bad-group": "This group could not be found.",
      "below-threshold": "There are not enough approved submissions to publish.",
      "not-configured": "The database is not connected, so nothing was published.",
      error: "Something went wrong and nothing was published. Try again.",
    },
    errorSummaryTitle: "There is a problem",
    errors: {
      required: "Fill this in",
      tooShort: "Write a little more",
      tooLong: "Shorten this to {max} characters or fewer",
      identifying: "Remove any email address, phone number or student ID",
      pairIncomplete: "Fill in the other language too, or empty both",
      noTips: "Add at least one tip, in both languages",
    },
  },
  th: {
    title: "รีวิวรายวิชา",
    lede: "อนุมัติรีวิวนิรนาม แล้วเผยแพร่บทสรุปเมื่อวิชา ภาคการศึกษา และอาจารย์ผู้สอนกลุ่มนั้นมีรีวิวครบตามเกณฑ์",
    signInTitle: "กรุณาเข้าสู่ระบบที่หน้าแรกของคอนโซล",
    signInBody: "คุณต้องเข้าสู่ระบบเจ้าหน้าที่ก่อนจึงจะตรวจรีวิวรายวิชาได้",
    signInCta: "ไปที่หน้าแรกคอนโซล",
    noAccessTitle: "เฉพาะฝ่ายวิชาการและผู้ดูแลระบบเท่านั้นที่ตรวจรีวิวได้",
    noAccessBody: "บทบาทของคุณใช้หน้านี้ไม่ได้ ขอให้ผู้ดูแลระบบกำหนดบทบาทฝ่ายวิชาการให้คุณ",
    dbNotConfiguredTitle: "ยังไม่ได้เชื่อมต่อฐานข้อมูลรีวิว",
    dbNotConfiguredBody: "ยังไม่ได้ตั้งค่า POSTGRES_URL จึงยังไม่มีรีวิวให้แสดงในขณะนี้",
    ruleBody:
      "BIRSA จะเผยแพร่วิชา ภาคการศึกษา และอาจารย์ผู้สอนกลุ่มหนึ่งได้ก็ต่อเมื่อมีรีวิวที่อนุมัติแล้วอย่างน้อย {threshold} รายการ เพื่อไม่ให้ระบุตัวนักศึกษารายใดรายหนึ่งได้ และจะไม่เผยแพร่สิ่งใดจนกว่าเจ้าหน้าที่จะแก้ไขและอนุมัติบทสรุป",
    summariserOnBody: "Claude ช่วยร่างบทสรุปได้ คุณเป็นผู้แก้ไขและอนุมัติทุกฉบับ",
    summariserOffBody:
      "ปิดการร่างด้วย Claude เพราะยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY ยังเขียนบทสรุปเองได้ตามปกติ",
    queueTitle: "คิวรีวิว",
    queueEmpty: "ยังไม่มีรีวิวที่ส่งเข้ามา",
    courseHeader: "วิชา",
    termHeader: "ภาคการศึกษา",
    instructorHeader: "ผู้สอน",
    pendingHeader: "รอพิจารณา",
    approvedHeader: "อนุมัติแล้ว",
    rejectedHeader: "ไม่อนุมัติ",
    statusHeader: "สถานะ",
    openAction: "เปิดดู",
    otherInstructor: "อาจารย์ท่านอื่น",
    statusNeedsDecisions: "รอการพิจารณา",
    statusReady: "พร้อมเผยแพร่",
    statusPublished: "เผยแพร่แล้ว",
    statusWaiting: "ต้องอนุมัติเพิ่มอีก {n} รายการ",
    backToQueue: "กลับไปคิวรีวิว",
    groupTitle: "รีวิวของวิชา",
    progress: "อนุมัติแล้ว {approved} จาก {threshold} รายการ",
    submissionsTitle: "รีวิวที่ส่งเข้ามา",
    submissionStatus: { pending: "รอพิจารณา", approved: "อนุมัติแล้ว", rejected: "ไม่อนุมัติ" },
    submittedLabel: "ส่งเมื่อ",
    languageLabel: "เขียนเป็นภาษา",
    workloadLabel: "ปริมาณงาน",
    bandLabel: "ชั่วโมงต่อสัปดาห์",
    bandLabels: {
      under_3: "ไม่ถึง 3 ชั่วโมงต่อสัปดาห์",
      "3_to_6": "3 ถึง 6 ชั่วโมงต่อสัปดาห์",
      over_6: "มากกว่า 6 ชั่วโมงต่อสัปดาห์",
    },
    assessmentLabel: "การวัดผล",
    tipsLabel: "เคล็ดลับ",
    quoteLabel: "ข้อความที่ยกมา",
    approve: "อนุมัติ",
    reject: "ไม่อนุมัติ",
    notEnoughTitle: "ยังมีรีวิวที่อนุมัติไม่พอสำหรับเผยแพร่",
    notEnoughBody: "ต้องอนุมัติเพิ่มอีก {n} รายการ จึงจะร่างหรือเผยแพร่บทสรุปได้",
    summaryTitle: "บทสรุป",
    publishedTitle: "เผยแพร่แล้ว",
    publishedBody:
      "บทสรุปนี้แสดงอยู่ในหน้ารายวิชาแล้ว สรุปจากรีวิว {count} รายการ และเผยแพร่เมื่อ {date}",
    publishedBelowBody:
      "บทสรุปนี้แสดงอยู่ แต่ตอนนี้มีรีวิวที่อนุมัติน้อยกว่าตอนเผยแพร่ หากเห็นว่าอาจไม่ปลอดภัยที่จะแสดงต่อ ให้ยกเลิกการเผยแพร่",
    unpublish: "ยกเลิกการเผยแพร่",
    draftTitle: "ร่างด้วย Claude",
    draftBody:
      "ระบบจะส่งรีวิวที่อนุมัติแล้วไปให้ Claude ซึ่งส่งร่างสองภาษากลับมาแสดงในแบบฟอร์มด้านล่าง ยังไม่มีการบันทึกหรือเผยแพร่สิ่งใดจนกว่าคุณจะกดปุ่มเผยแพร่",
    draftButton: "ร่างบทสรุป",
    draftingButton: "กำลังร่าง",
    draftUnavailableTitle: "ยังใช้การร่างด้วย Claude ไม่ได้",
    draftUnavailableBody:
      "ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY ของเว็บไซต์นี้ เขียนบทสรุปเองในแบบฟอร์มด้านล่างได้",
    draftReady: "ร่างเสร็จแล้ว อ่าน แก้ไข และตรวจเทียบกับรีวิวที่ส่งเข้ามาให้ครบก่อนเผยแพร่",
    draftFailed: {
      "not-configured": "ยังไม่ได้ตั้งค่าการร่างด้วย Claude เขียนบทสรุปเองในแบบฟอร์มด้านล่างได้",
      "too-few": "มีรีวิวที่อนุมัติแล้วไม่พอสำหรับร่างบทสรุป",
      "below-threshold": "มีรีวิวที่อนุมัติแล้วไม่พอสำหรับร่างบทสรุป",
      refused:
        "Claude ไม่ร่างบทสรุปนี้ให้ เขียนเอง หรือตรวจรีวิวที่ส่งเข้ามาว่ามีเนื้อหาที่ Claude ปฏิเสธหรือไม่",
      truncated: "คำตอบของ Claude ขาดตอนก่อนจบ ลองใหม่อีกครั้ง หรือเขียนบทสรุปเอง",
      "unexpected-stop": "Claude หยุดก่อนร่างเสร็จ ลองใหม่อีกครั้ง หรือเขียนบทสรุปเอง",
      "bad-output": "อ่านคำตอบของ Claude เป็นบทสรุปไม่ได้ ลองใหม่อีกครั้ง หรือเขียนบทสรุปเอง",
      "api-error": "ติดต่อ Claude ไม่ได้ ลองใหม่ในอีกสักครู่ หรือเขียนบทสรุปเอง",
      forbidden: "บทบาทของคุณร่างบทสรุปไม่ได้",
      "bad-group": "ไม่พบกลุ่มรีวิวนี้",
    },
    editorTitle: "แก้ไขและเผยแพร่",
    editorBody:
      "ข้อความในแบบฟอร์มนี้คือสิ่งที่สาธารณชนจะได้อ่าน จึงควรตรวจทุกบรรทัด กรอกให้ครบทั้งสองภาษา เคล็ดลับหรือข้อความที่ยกมาต้องมีทั้งสองภาษา หรือเว้นว่างทั้งคู่ ช่องที่ไม่ใช้ให้เว้นว่างไว้",
    englishHeading: "ภาษาอังกฤษ",
    thaiHeading: "ภาษาไทย",
    workloadField: "ปริมาณงานเป็นอย่างไร",
    assessmentField: "วัดผลในทางปฏิบัติอย่างไร",
    tipField: "เคล็ดลับข้อที่ {n}",
    quoteField: "ข้อความที่ยกมาข้อที่ {n}",
    bandsReadOnlyTitle: "ชั่วโมงต่อสัปดาห์ที่นักศึกษาแจ้งไว้",
    bandsReadOnlyNone: "ไม่มีนักศึกษาให้ค่าประมาณไว้",
    publishButton: "เผยแพร่บทสรุป",
    updateButton: "อัปเดตบทสรุปที่เผยแพร่",
    publishingButton: "กำลังเผยแพร่",
    publishedDone: "เผยแพร่แล้ว บทสรุปขึ้นในหน้ารายวิชาแล้ว",
    unpublishedDone: "ยกเลิกการเผยแพร่แล้ว บทสรุปไม่แสดงในหน้ารายวิชาอีกต่อไป",
    publishFailed: {
      forbidden: "บทบาทของคุณเผยแพร่บทสรุปไม่ได้",
      "bad-group": "ไม่พบกลุ่มรีวิวนี้",
      "below-threshold": "มีรีวิวที่อนุมัติแล้วไม่พอสำหรับเผยแพร่",
      "not-configured": "ยังไม่ได้เชื่อมต่อฐานข้อมูล จึงไม่ได้เผยแพร่",
      error: "เกิดข้อผิดพลาด จึงไม่ได้เผยแพร่ ลองอีกครั้ง",
    },
    errorSummaryTitle: "พบข้อผิดพลาด",
    errors: {
      required: "กรุณากรอกช่องนี้",
      tooShort: "เขียนให้ละเอียดขึ้นอีกเล็กน้อย",
      tooLong: "ย่อให้ไม่เกิน {max} ตัวอักษร",
      identifying: "ลบอีเมล เบอร์โทรศัพท์ หรือรหัสนักศึกษาออก",
      pairIncomplete: "กรอกอีกภาษาด้วย หรือเว้นว่างทั้งสองภาษา",
      noTips: "เพิ่มเคล็ดลับอย่างน้อยหนึ่งข้อ ทั้งสองภาษา",
    },
  },
};
