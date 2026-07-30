/**
 * Bilingual copy for the satisfaction feedback feature
 * (components/feedback/FeedbackForm.tsx and the standalone
 * app/[lang]/feedback/** route). Kept in its own module, matching the
 * convention in components/equipment/loanWizardCopy.ts, so the form stays
 * focused on behaviour and both the form and its server-side page wrapper
 * can share the same strings.
 *
 * English and Thai entries are written in lock-step: whenever a key is
 * added or changed on one side, update the other immediately below it.
 */
import type { FeedbackRating } from "@/lib/validation";
import type { Locale } from "@/lib/i18n";

export type FeedbackCopy = {
  /** Default fieldset legend, used when no `heading` prop is supplied. */
  defaultHeading: string;
  ratingGroupLabel: string;
  ratingLabels: Record<FeedbackRating, string>;
  commentLabel: string;
  commentHint: string;
  /** GOV.UK Service Manual requirement: told in both languages, not just implied by the hint. */
  privacyWarning: string;
  requiredLabel: string;
  optionalLabel: string;
  errorSummaryTitle: string;
  errorRatingRequired: string;
  submit: string;
  submitting: string;
  notConfiguredTitle: string;
  notConfiguredBody: string;
  errorTitle: string;
  errorBody: string;
  confirmationTitle: string;
  confirmationBody: string;
  backLink: string;
};

/** In the prescribed GOV.UK display order: most to least satisfied. */
export const RATING_ORDER: FeedbackRating[] = [
  "very_satisfied",
  "satisfied",
  "neither",
  "dissatisfied",
  "very_dissatisfied",
];

export const feedbackCopy: Record<Locale, FeedbackCopy> = {
  en: {
    defaultHeading: "What did you think of this service?",
    ratingGroupLabel: "How satisfied were you with this service?",
    ratingLabels: {
      very_satisfied: "Very satisfied",
      satisfied: "Satisfied",
      neither: "Neither satisfied nor dissatisfied",
      dissatisfied: "Dissatisfied",
      very_dissatisfied: "Very dissatisfied",
    },
    commentLabel: "How could we improve this service?",
    commentHint: "Do not include personal or financial information.",
    privacyWarning:
      "Do not include your name, student ID, contact details, or any financial information in your comments.",
    requiredLabel: "required",
    optionalLabel: "optional",
    errorSummaryTitle: "There is a problem",
    errorRatingRequired: "Select how satisfied you were with this service",
    submit: "Send feedback",
    submitting: "Sending",
    notConfiguredTitle: "Feedback cannot be stored right now",
    notConfiguredBody: "The feedback database is not connected, so this response was not saved.",
    errorTitle: "Something went wrong",
    errorBody: "The feedback was not saved. Try again.",
    confirmationTitle: "Feedback received",
    confirmationBody: "This helps BIRSA improve the service.",
    backLink: "Back to the homepage",
  },
  th: {
    defaultHeading: "คุณคิดเห็นอย่างไรกับบริการนี้",
    ratingGroupLabel: "คุณพึงพอใจกับบริการนี้มากน้อยเพียงใด",
    ratingLabels: {
      very_satisfied: "พึงพอใจมาก",
      satisfied: "พึงพอใจ",
      neither: "เฉย ๆ ไม่พึงพอใจและไม่ไม่พึงพอใจ",
      dissatisfied: "ไม่พึงพอใจ",
      very_dissatisfied: "ไม่พึงพอใจอย่างมาก",
    },
    commentLabel: "บริการนี้ควรปรับปรุงอย่างไร",
    commentHint: "ไม่ต้องระบุข้อมูลส่วนบุคคลหรือข้อมูลทางการเงิน",
    privacyWarning: "ไม่ต้องระบุชื่อ รหัสนักศึกษา ข้อมูลติดต่อ หรือข้อมูลทางการเงินใด ๆ ในความคิดเห็น",
    requiredLabel: "จำเป็น",
    optionalLabel: "ไม่จำเป็น",
    errorSummaryTitle: "พบข้อผิดพลาด",
    errorRatingRequired: "กรุณาเลือกระดับความพึงพอใจต่อบริการนี้",
    submit: "ส่งความคิดเห็น",
    submitting: "กำลังส่ง",
    notConfiguredTitle: "ขณะนี้ยังไม่สามารถบันทึกความคิดเห็นได้",
    notConfiguredBody: "ยังไม่ได้เชื่อมต่อฐานข้อมูลความคิดเห็น จึงยังไม่ได้บันทึกคำตอบนี้",
    errorTitle: "เกิดข้อผิดพลาด",
    errorBody: "ไม่สามารถบันทึกความคิดเห็นได้ กรุณาลองใหม่อีกครั้ง",
    confirmationTitle: "ได้รับความคิดเห็นแล้ว",
    confirmationBody: "ข้อมูลนี้ช่วยให้ BIRSA ปรับปรุงบริการได้ดียิ่งขึ้น",
    backLink: "กลับสู่หน้าแรก",
  },
};
