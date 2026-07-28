/**
 * The audience model behind Smart Answers.
 *
 * The site serves people whose correct answer to the same question genuinely
 * differs, and it differs along three axes and no more:
 *
 *  - `origin`: a Thai/home student and an international student get different
 *    answers about banking, health cover, phone lines, language, and staying
 *    in the country legally. Nothing else on the site splits this way.
 *  - `stage`: someone who has not started yet needs enrolment and arrival
 *    steps; someone mid-degree needs registration, leave and welfare rules;
 *    someone in their final stretch needs the internship, graduation and
 *    honours rules.
 *  - `role`: an ordinary member gets "ask your committee"; someone who sits on
 *    a committee gets the step they have to carry out themselves, because the
 *    Faculty Notice puts those duties on the body, not the individual.
 *
 * Every dimension is optional. An answer must stand up when nothing is known
 * about the reader, and get more specific as more is known. It must never
 * refuse to answer for want of a profile.
 *
 * The profile travels in the URL (`?p=international.starting`), not in a
 * cookie or in storage, so every answer stays a plain shareable link and
 * nothing about the reader is retained after they close the tab.
 */
import type { Bi } from "./types";

export const audienceDimensions = ["origin", "stage", "role"] as const;
export type AudienceDimension = (typeof audienceDimensions)[number];

export type AudienceChoice = {
  /** Value stored in the `origin`/`stage`/`role` fact and in the URL token. */
  value: string;
  label: Bi;
  hint?: Bi;
};

export type AudienceQuestion = {
  dimension: AudienceDimension;
  question: Bi;
  /** Shown on the profile page under the question. */
  hint?: Bi;
  /** Short label for this dimension in the "what we are assuming" summary. */
  summaryLabel: Bi;
  choices: AudienceChoice[];
};

export const audienceQuestions: AudienceQuestion[] = [
  {
    dimension: "origin",
    summaryLabel: { en: "Coming from", th: "ที่มา" },
    question: {
      en: "Are you coming to BIR from inside Thailand, or from abroad?",
      th: "คุณเข้าเรียน BIR จากในประเทศไทย หรือมาจากต่างประเทศ",
    },
    hint: {
      en: "This changes answers about visas, bank accounts, phone lines and health cover.",
      th: "ข้อนี้มีผลกับคำตอบเรื่องวีซ่า บัญชีธนาคาร เบอร์โทรศัพท์ และการรักษาพยาบาล",
    },
    choices: [
      {
        value: "thai",
        label: { en: "From inside Thailand", th: "จากในประเทศไทย" },
        hint: {
          en: "You are a Thai student, or you already live here.",
          th: "คุณเป็นนักศึกษาไทย หรืออาศัยอยู่ในไทยอยู่แล้ว",
        },
      },
      {
        value: "international",
        label: { en: "From abroad", th: "จากต่างประเทศ" },
        hint: {
          en: "You are moving to Bangkok to study, or you are here on a student visa.",
          th: "คุณย้ายมาเรียนที่กรุงเทพ หรืออยู่ในไทยด้วยวีซ่านักศึกษา",
        },
      },
    ],
  },
  {
    dimension: "stage",
    summaryLabel: { en: "Stage", th: "ช่วงการเรียน" },
    question: {
      en: "Where are you in the degree?",
      th: "ตอนนี้คุณอยู่ช่วงไหนของหลักสูตร",
    },
    choices: [
      {
        value: "starting",
        label: {
          en: "Not started yet, or in my first weeks",
          th: "ยังไม่เริ่มเรียน หรือเพิ่งเข้าเรียน",
        },
      },
      {
        value: "studying",
        label: { en: "Partway through", th: "กำลังเรียนอยู่" },
      },
      {
        value: "finishing",
        label: {
          en: "Third or fourth year, thinking about the internship and graduating",
          th: "ปี 3 หรือปี 4 กำลังดูเรื่องฝึกงานและการจบการศึกษา",
        },
      },
    ],
  },
  {
    dimension: "role",
    summaryLabel: { en: "Role", th: "บทบาท" },
    question: {
      en: "Do you hold a position in a student body?",
      th: "คุณมีตำแหน่งในองค์กรนักศึกษาหรือไม่",
    },
    hint: {
      en: "BIRSA, the PSC, a club committee, or your cohort committee (คกร.).",
      th: "เช่น BIRSA กนศ.ร. คณะกรรมการชมรม หรือ คกร. ของรุ่นคุณ",
    },
    choices: [
      {
        value: "student",
        label: { en: "No, I am asking as a student", th: "ไม่มี ถามในฐานะนักศึกษา" },
      },
      {
        value: "officer",
        label: {
          en: "Yes, I am on a committee",
          th: "มี ฉันอยู่ในคณะกรรมการ",
        },
        hint: {
          en: "Some steps are the committee's to carry out, not yours to request.",
          th: "บางขั้นตอนเป็นหน้าที่ของคณะกรรมการที่ต้องดำเนินการเอง ไม่ใช่การยื่นขอ",
        },
      },
    ],
  },
];

/** What we know about the reader. Every field is optional by design. */
export type AudienceProfile = Partial<Record<AudienceDimension, string>>;

const valuesByDimension = new Map<AudienceDimension, Set<string>>(
  audienceQuestions.map((question) => [
    question.dimension,
    new Set(question.choices.map((choice) => choice.value)),
  ])
);

/** Every value any dimension accepts, used to decode an unordered URL token. */
export function dimensionForValue(value: string): AudienceDimension | undefined {
  for (const [dimension, values] of valuesByDimension) {
    if (values.has(value)) return dimension;
  }
  return undefined;
}

export function getAudienceQuestion(dimension: AudienceDimension): AudienceQuestion {
  const question = audienceQuestions.find((candidate) => candidate.dimension === dimension);
  // `audienceQuestions` covers every member of the union, so this is total.
  return question!;
}

export function getAudienceChoice(
  dimension: AudienceDimension,
  value: string
): AudienceChoice | undefined {
  return getAudienceQuestion(dimension).choices.find((choice) => choice.value === value);
}
