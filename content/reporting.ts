/**
 * The two official channels for reporting harassment, bullying, or any
 * incident that leaves a BIR student feeling unsafe, uncomfortable or
 * violated: the BIR Programme office, and BIRSA's own Rights Advocate and
 * Student Welfare Officer.
 *
 * Single source of truth so the same numbers and addresses appear on every
 * surface that carries the message (the safety and rights pages in both
 * languages, the smart answers wellbeing topic, /contact, and the emergency
 * scenarios). Rendered by `components/ReportHarassment.tsx`, which is exposed
 * to MDX as `<ReportHarassment />` in `lib/mdx.tsx`.
 *
 * Taken from the BIRSA reporting poster issued by the BIR Programme office
 * and the Rights Advocate and Student Welfare Officer.
 */
import type { Locale } from "@/lib/i18n";

export type LocalizedText = Record<Locale, string>;

export type ReportingChannel = {
  /** Kebab-case id, also the React key. */
  id: "bir-programme-office" | "birsa-rights-advocate";
  /** Body the person reaches, e.g. "BIR Programme office". */
  organisation: LocalizedText;
  /** Named person or role within that body, shown under the organisation. */
  person: LocalizedText;
  /** Human-readable phone number. */
  phone: string;
  /** `tel:` target, digits only. */
  phoneHref: string;
  /** Extension spoken aloud after the number connects, if any. */
  extension?: string;
  email: string;
};

export const reportingChannels: ReportingChannel[] = [
  {
    id: "bir-programme-office",
    organisation: {
      en: "BIR Programme office",
      th: "สำนักงานหลักสูตร BIR",
    },
    person: {
      en: "Prompat (Pum)",
      th: "พร้อมภัทร (คุณปุ๋ม)",
    },
    phone: "02-221-6111",
    phoneHref: "tel:022216111",
    extension: "3409",
    email: "prompats@tu.ac.th",
  },
  {
    id: "birsa-rights-advocate",
    organisation: {
      en: "BIR Student Association",
      th: "สโมสรนักศึกษา BIR",
    },
    person: {
      en: "Rights Advocate and Student Welfare Officer",
      th: "กรรมการฝ่ายพิทักษ์สิทธิ์และสวัสดิการ",
    },
    phone: "065-940-6914",
    phoneHref: "tel:0659406914",
    email: "punsak.ket@dome.tu.ac.th",
  },
];

/** Copy that travels with the channels wherever they are shown. */
export const reportingCopy = {
  heading: {
    en: "Harassment and bullying are never acceptable",
    th: "การคุกคามและการกลั่นแกล้งเป็นเรื่องที่ยอมรับไม่ได้",
  } satisfies LocalizedText,
  intro: {
    en: "If anything happens that leaves you feeling unsafe, uncomfortable or violated, by anyone, report it through whichever channel you feel most comfortable using.",
    th: "หากเกิดเหตุการณ์ใดที่ทำให้คุณรู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด ไม่ว่าจะโดยใครก็ตาม ขอให้แจ้งเรื่องผ่านช่องทางที่คุณสบายใจที่สุด",
  } satisfies LocalizedText,
  assurance: {
    en: "Reports are processed within 48 hours, with the utmost secrecy and care.",
    th: "ทุกเรื่องที่แจ้งเข้ามาจะได้รับการดำเนินการภายใน 48 ชั่วโมง ด้วยการรักษาความลับและความใส่ใจอย่างที่สุด",
  } satisfies LocalizedText,
  callLabel: { en: "Call", th: "โทร" } satisfies LocalizedText,
  emailLabel: { en: "Email", th: "อีเมล" } satisfies LocalizedText,
  extensionLabel: { en: "ext.", th: "ต่อ" } satisfies LocalizedText,
};
