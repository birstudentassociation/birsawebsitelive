/**
 * Topic copy for the guides under `/services`. Shared between the topic page,
 * the guide breadcrumbs and the guide image cards. Authored
 * natively per locale, not translated.
 *
 * `href` values are locale-less paths; pass them through `localeHref`.
 */
import type { Locale } from "@/lib/i18n";
import type { InformationTopic } from "@/lib/content";

export type InformationTopicCopy = { title: string; lede: string };

export const informationTopicCopy: Record<
  Locale,
  Record<InformationTopic, InformationTopicCopy>
> = {
  en: {
    "applying-to-bir": {
      title: "Applying to BIR",
      lede: "Find out which admission round you can apply through, then read the dates, documents and fees for 2027 entry.",
    },
  },
  th: {
    "applying-to-bir": {
      title: "สมัครเรียน BIR",
      lede: "เช็กว่าสมัครรอบไหนได้ แล้วดูกำหนดการ เอกสาร และค่าธรรมเนียมสำหรับการเข้าศึกษาปี 2570",
    },
  },
};
