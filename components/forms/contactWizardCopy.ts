/**
 * Copy for the contact form's one-question-per-page steps
 * (`app/[lang]/contact/**`). Field labels, error messages and the
 * success/fallback/error panels already exist in
 * `content/dictionaries/{en,th}.ts` under `form.*` and are reused as-is
 * (this module is only additive, per-step copy: question headings, the
 * category question's options, and the message step's per-category
 * branching heading and hint). English and Thai are written in lock-step.
 */
import type { Locale } from "@/lib/i18n";

export const CONTACT_CATEGORY_VALUES = [
  "question",
  "suggestion",
  "problem",
  "academic",
  "other",
] as const;
export type ContactCategory = (typeof CONTACT_CATEGORY_VALUES)[number];

/**
 * The category for questions about studies, courses and registration. It is
 * offered so students find it, but it never starts a message: BIRSA does not
 * answer these, the BIR office does, so choosing it opens the page that says
 * how to reach the office (`/contact/academic`) and the server refuses to email
 * it to BIRSA's inbox.
 */
export const ACADEMIC_CATEGORY = "academic" satisfies ContactCategory;

export function contactCategoryLabel(locale: Locale, value: ContactCategory): string {
  const labels: Record<Locale, Record<ContactCategory, string>> = {
    en: {
      question: "A question",
      suggestion: "A suggestion",
      problem: "A problem to report",
      academic: "Studies, courses and registration",
      other: "Something else",
    },
    th: {
      question: "คำถามทั่วไป",
      suggestion: "ข้อเสนอแนะ",
      problem: "แจ้งปัญหา",
      academic: "การเรียน รายวิชา และการลงทะเบียน",
      other: "เรื่องอื่น ๆ",
    },
  };
  return labels[locale][value];
}

export function contactCategoryOptions(locale: Locale) {
  return CONTACT_CATEGORY_VALUES.map((value) => ({
    value,
    label: contactCategoryLabel(locale, value),
  }));
}

export type ContactWizardLabels = {
  categoryHeading: string;
  subjectHeading: string;
  messageHeading: (category: string | undefined) => string;
  messageHint: (category: string | undefined) => string;
  nameHeading: string;
  emailHeading: string;
  checkTitle: string;
  checkCategoryLabel: string;
  checkSubjectLabel: string;
  checkMessageLabel: string;
  checkNameLabel: string;
  checkEmailLabel: string;
  /** The page a student who picks the academic category is sent to. */
  academic: {
    title: string;
    noticeTitle: string;
    noticeBody: string;
    contactHeading: string;
    datesNote: string;
    back: string;
  };
};

export function buildContactWizardLabels(locale: Locale): ContactWizardLabels {
  if (locale === "th") {
    return {
      categoryHeading: "เรื่องที่ต้องการติดต่อเกี่ยวกับอะไร",
      subjectHeading: "หัวข้อเรื่องของคุณคืออะไร",
      messageHeading: (category) => {
        switch (category) {
          case "problem":
            return "อธิบายปัญหาที่พบ";
          case "suggestion":
            return "ข้อเสนอแนะของคุณคืออะไร";
          case "question":
            return "คำถามของคุณคืออะไร";
          case "other":
            return "บอกรายละเอียดเพิ่มเติม";
          default:
            return "ข้อความของคุณคืออะไร";
        }
      },
      messageHint: (category) => {
        switch (category) {
          case "problem":
            return "อธิบายสิ่งที่คุณคาดว่าจะเกิดขึ้น และสิ่งที่เกิดขึ้นจริงแทน";
          case "suggestion":
            return "บอกสิ่งที่คุณอยากให้เปลี่ยนแปลงหรือเพิ่มเติม";
          case "question":
            return "ถามได้ทุกเรื่องเกี่ยวกับกฎระเบียบ กำหนดเวลา หรือบริการ";
          default:
            return "ให้รายละเอียดมากที่สุดเท่าที่ทำได้";
        }
      },
      nameHeading: "ชื่อของคุณคืออะไร",
      emailHeading: "อีเมลของคุณคืออะไร",
      checkTitle: "ตรวจสอบคำตอบของคุณ",
      checkCategoryLabel: "เรื่องที่ติดต่อ",
      checkSubjectLabel: "หัวข้อ",
      checkMessageLabel: "ข้อความ",
      checkNameLabel: "ชื่อ",
      checkEmailLabel: "อีเมล",
      academic: {
        title: "เรื่องการเรียนสอบถามสำนักงานโครงการ BIR",
        noticeTitle: "BIRSA ไม่ได้ตอบคำถามเรื่องการเรียน",
        noticeBody:
          "สำนักงานโครงการ BIR เป็นผู้ตอบคำถามเรื่องรายวิชา การลงทะเบียน ผลการเรียน และเรื่องวิชาการอื่น ๆ ส่วน BIRSA เป็นสโมสรนักศึกษา แบบฟอร์มนี้จึงไม่ส่งเรื่องเหล่านี้ให้ BIRSA โปรดติดต่อสำนักงานโครงการ BIR โดยตรง",
        contactHeading: "ติดต่อสำนักงานโครงการ BIR",
        datesNote:
          "สำนักงานโครงการ BIR ประกาศวันลงทะเบียนและวันสำคัญทางการศึกษาของ BIR ที่ birpolsci.com และเฟซบุ๊ก BIR Program",
        back: "เลือกเรื่องอื่น",
      },
    };
  }

  return {
    categoryHeading: "What is this about?",
    subjectHeading: "What is the subject of your message?",
    messageHeading: (category) => {
      switch (category) {
        case "problem":
          return "Describe the problem";
        case "suggestion":
          return "What is your suggestion?";
        case "question":
          return "What is your question?";
        case "other":
          return "Tell us more";
        default:
          return "What is your message?";
      }
    },
    messageHint: (category) => {
      switch (category) {
        case "problem":
          return "Include what you expected to happen, and what happened instead.";
        case "suggestion":
          return "Tell us what you would like to see changed or added.";
        case "question":
          return "Ask anything about rules, deadlines or services.";
        default:
          return "Give as much detail as you can.";
      }
    },
    nameHeading: "What is your name?",
    emailHeading: "What is your email address?",
    checkTitle: "Check your answers",
    checkCategoryLabel: "What this is about",
    checkSubjectLabel: "Subject",
    checkMessageLabel: "Message",
    checkNameLabel: "Name",
    checkEmailLabel: "Email address",
    academic: {
      title: "Ask the BIR office about your studies",
      noticeTitle: "BIRSA does not answer questions about studies",
      noticeBody:
        "The BIR office answers questions about courses, registration, grades and other academic matters. BIRSA is the student association, so this form does not send them to BIRSA. Contact the BIR office directly.",
      contactHeading: "Contact the BIR office",
      datesNote:
        "The BIR office also announces BIR's registration dates and other academic dates on birpolsci.com and the BIR Program Facebook page.",
      back: "Choose a different topic",
    },
  };
}
