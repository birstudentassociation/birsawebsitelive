/**
 * Section and topic copy for `/information`. Shared between the index, the
 * topic page, the guide breadcrumbs and the guide image cards. Authored
 * natively per locale, not translated.
 *
 * `href` values are locale-less paths; pass them through `localeHref`.
 */
import type { Locale } from "@/lib/i18n";
import type { InformationTopic } from "@/lib/content";

export type InformationTopicCopy = { title: string; lede: string };

/** Breadcrumb and page label for the section itself. */
export const informationLabel: Record<Locale, string> = {
  en: "Information",
  th: "ข้อมูล",
};

export const informationLede: Record<Locale, string> = {
  en: "Official information about BIR, checked against the programme's own website.",
  th: "ข้อมูลทางการเกี่ยวกับ BIR ที่ตรวจสอบกับเว็บไซต์ของหลักสูตรโดยตรง",
};

export const informationTopicCopy: Record<
  Locale,
  Record<InformationTopic, InformationTopicCopy>
> = {
  en: {
    "applying-to-bir": {
      title: "Applying to BIR",
      lede: "Choose an admission round, check the dates and requirements, and follow the steps to apply for 2027 entry.",
    },
  },
  th: {
    "applying-to-bir": {
      title: "สมัครเรียน BIR",
      lede: "เลือกรอบรับสมัคร ตรวจสอบวันและเกณฑ์ แล้วทำตามขั้นตอนการสมัครสำหรับการเข้าศึกษาปี 2570",
    },
  },
};
