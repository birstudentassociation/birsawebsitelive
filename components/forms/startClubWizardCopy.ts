/**
 * Copy for the "start a club" form's one-question-per-page steps
 * (`app/[lang]/clubs/start/**`). Carries forward the strings that used to
 * live inline in `components/forms/StartClubForm.tsx`, plus the new
 * per-step question headings. English and Thai are written in lock-step.
 */
import type { Locale } from "@/lib/i18n";

export type StartClubErrorCode = "required" | "invalid" | "short";
export type StartClubField = "name" | "email" | "clubName" | "description";

export type StartClubWizardLabels = {
  clubNameHeading: string;
  clubNameHint: string;
  membersHeading: string;
  membersHint: string;
  descriptionHeading: string;
  descriptionHint: string;
  nameHeading: string;
  emailHeading: string;
  emailHint: string;
  send: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorSummaryTitle: string;
  checkTitle: string;
  checkClubNameLabel: string;
  checkMembersLabel: string;
  checkMembersEmpty: string;
  checkDescriptionLabel: string;
  checkNameLabel: string;
  checkEmailLabel: string;
  fieldLabels: {
    name: string;
    email: string;
    clubName: string;
    description: string;
    members: string;
  };
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    clubNameRequired: string;
    descriptionRequired: string;
    descriptionShort: string;
  };
};

export function messageForStartClubError(
  labels: StartClubWizardLabels,
  field: StartClubField,
  code: StartClubErrorCode
): string {
  switch (field) {
    case "name":
      return labels.errors.nameRequired;
    case "email":
      return code === "invalid" ? labels.errors.emailInvalid : labels.errors.emailRequired;
    case "clubName":
      return labels.errors.clubNameRequired;
    case "description":
      return code === "short" ? labels.errors.descriptionShort : labels.errors.descriptionRequired;
  }
}

export function buildStartClubWizardLabels(locale: Locale): StartClubWizardLabels {
  if (locale === "th") {
    return {
      clubNameHeading: "ชมรมที่ต้องการเสนอชื่อว่าอะไร",
      clubNameHint: "เปลี่ยนภายหลังได้",
      membersHeading: "มีใครสนใจร่วมด้วยอีกไหม",
      membersHint: "ไม่บังคับ: ใส่ชื่อหรือจำนวนคร่าว ๆ ถ้ามี",
      descriptionHeading: "ชมรมนี้จะทำอะไร",
      descriptionHint: "อธิบายไอเดียสั้น ๆ กลุ่มเป้าหมายคือใคร และคาดว่าจะนัดพบกันบ่อยแค่ไหน",
      nameHeading: "ชื่อของคุณคืออะไร",
      emailHeading: "อีเมลของคุณคืออะไร",
      emailHint: "เราจะใช้อีเมลนี้เพื่อตอบกลับคุณเท่านั้น",
      send: "ส่งไอเดีย",
      sending: "กำลังส่ง…",
      successTitle: "ขอบคุณ ไอเดียชมรมของคุณถูกส่งแล้ว",
      successBody: "กรรมการ BIRSA จะติดต่อกลับทางอีเมลเพื่อแจ้งขั้นตอนถัดไป",
      errorSummaryTitle: "มีข้อมูลที่ต้องแก้ไข",
      checkTitle: "ตรวจสอบคำตอบของคุณ",
      checkClubNameLabel: "ชื่อชมรมที่เสนอ",
      checkMembersLabel: "ผู้ที่สนใจร่วมด้วย",
      checkMembersEmpty: "ไม่ได้ระบุ",
      checkDescriptionLabel: "รายละเอียดชมรม",
      checkNameLabel: "ชื่อของคุณ",
      checkEmailLabel: "อีเมล",
      fieldLabels: {
        name: "ชื่อของคุณ",
        email: "อีเมล",
        clubName: "ชื่อชมรมที่เสนอ",
        description: "รายละเอียดชมรม",
        members: "ผู้ที่สนใจร่วมด้วย",
      },
      errors: {
        nameRequired: "กรอกชื่อของคุณ",
        emailRequired: "กรอกอีเมลของคุณ",
        emailInvalid: "กรอกอีเมลให้ถูกต้อง เช่น name@example.com",
        clubNameRequired: "กรอกชื่อชมรมที่ต้องการเสนอ",
        descriptionRequired: "บอกเราว่าชมรมนี้จะทำอะไร",
        descriptionShort: "กรอกรายละเอียดเพิ่มเติม",
      },
    };
  }

  return {
    clubNameHeading: "What would you like to call the club?",
    clubNameHint: "It's fine if this changes later.",
    membersHeading: "Who else is interested?",
    membersHint: "Optional: names or a rough headcount, if you have them.",
    descriptionHeading: "What would the club do?",
    descriptionHint: "A few sentences on the idea, who it's for, and roughly how often you'd meet.",
    nameHeading: "What is your name?",
    emailHeading: "What is your email address?",
    emailHint: "We'll only use this to reply to you.",
    send: "Submit idea",
    sending: "Sending…",
    successTitle: "Thanks, your club idea is on its way",
    successBody:
      "A member of the BIRSA committee will get back to you by email to talk through next steps.",
    errorSummaryTitle: "There is a problem",
    checkTitle: "Check your answers",
    checkClubNameLabel: "Proposed club name",
    checkMembersLabel: "Who else is interested",
    checkMembersEmpty: "Not given",
    checkDescriptionLabel: "What the club would do",
    checkNameLabel: "Your name",
    checkEmailLabel: "Email address",
    fieldLabels: {
      name: "Your name",
      email: "Email address",
      clubName: "Proposed club name",
      description: "What would the club do",
      members: "Who else is interested",
    },
    errors: {
      nameRequired: "Enter your name",
      emailRequired: "Enter your email address",
      emailInvalid: "Enter an email address in the correct format, like name@example.com",
      clubNameRequired: "Enter a proposed club name",
      descriptionRequired: "Tell us what the club would do",
      descriptionShort: "Add a little more detail",
    },
  };
}
