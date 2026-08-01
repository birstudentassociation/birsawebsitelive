/**
 * Copy for the `/privacy/your-data` PDPA rights journey's one-question-per-page
 * steps. Field labels shared with the contact journey (name, email, the error
 * summary title, required/optional markers) come from
 * `content/dictionaries/{en,th}.ts` under `form.*` / `actions.*` and are
 * reused as-is; this module only adds copy specific to this journey. English
 * and Thai are written in lock-step, not translated from one another.
 */
import type { Locale } from "@/lib/i18n";

export type RightsWizardLabels = {
  whatHeading: string;
  whatLegend: string;
  nameHeading: string;
  emailHeading: string;
  detailsHeading: string;
  detailsHint: string;
  checkTitle: string;
  checkWhatLabel: string;
  checkNameLabel: string;
  checkEmailLabel: string;
  checkDetailsLabel: string;
  checkDetailsEmpty: string;
  send: string;
  sending: string;
  errors: {
    whatRequired: string;
  };
};

export function buildRightsWizardLabels(locale: Locale): RightsWizardLabels {
  if (locale === "th") {
    return {
      whatHeading: "คุณต้องการใช้สิทธิใด",
      whatLegend: "คุณต้องการใช้สิทธิใด",
      nameHeading: "ชื่อของคุณคืออะไร",
      emailHeading: "อีเมลของคุณคืออะไร",
      detailsHeading: "มีอะไรที่ช่วยให้เราค้นหาข้อมูลของคุณเจอไหม",
      detailsHint:
        "เช่น หมายเลขอ้างอิงการยืมอุปกรณ์ หรืออีเมลที่คุณใช้ตอนยืม ไม่กรอกก็ได้",
      checkTitle: "ตรวจสอบคำร้องของคุณ",
      checkWhatLabel: "สิทธิที่ต้องการใช้",
      checkNameLabel: "ชื่อ",
      checkEmailLabel: "อีเมล",
      checkDetailsLabel: "ข้อมูลเพิ่มเติม",
      checkDetailsEmpty: "ไม่ได้ระบุ",
      send: "ส่งคำร้อง",
      sending: "กำลังส่ง…",
      errors: {
        whatRequired: "เลือกสิทธิที่คุณต้องการใช้",
      },
    };
  }

  return {
    whatHeading: "Which right do you want to use?",
    whatLegend: "Which right do you want to use?",
    nameHeading: "What is your name?",
    emailHeading: "What is your email address?",
    detailsHeading: "Anything that will help us find your data?",
    detailsHint:
      "For example, an equipment loan reference number, or the email address you used when you borrowed something. This is optional.",
    checkTitle: "Check your request",
    checkWhatLabel: "Right requested",
    checkNameLabel: "Name",
    checkEmailLabel: "Email address",
    checkDetailsLabel: "Anything that helps us find your data",
    checkDetailsEmpty: "Not given",
    send: "Send request",
    sending: "Sending…",
    errors: {
      whatRequired: "Select the right you want to use",
    },
  };
}
