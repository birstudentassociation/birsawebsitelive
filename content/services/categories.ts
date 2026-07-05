/**
 * Category labels for the services hub — maps the frontmatter `category`
 * string on each guide to a locale-authored heading. Keep in sync with the
 * `category` values used in `content/services/{en,th}/*.mdx` frontmatter.
 */
import type { Locale } from "@/lib/i18n";

export type ServiceCategory =
  | "it-and-accounts"
  | "academic-admin"
  | "money"
  | "opportunities"
  | "wellbeing"
  | "help";

export const serviceCategoryOrder: ServiceCategory[] = [
  "it-and-accounts",
  "academic-admin",
  "money",
  "opportunities",
  "wellbeing",
  "help",
];

export const serviceCategories: Record<ServiceCategory, Record<Locale, string>> = {
  "it-and-accounts": { en: "IT & accounts", th: "บัญชีผู้ใช้และไอที" },
  "academic-admin": { en: "Academic admin", th: "งานทะเบียนและวิชาการ" },
  money: { en: "Money", th: "เรื่องเงิน" },
  opportunities: { en: "Opportunities", th: "โอกาสต่าง ๆ" },
  wellbeing: { en: "Health & wellbeing", th: "สุขภาพและความเป็นอยู่ที่ดี" },
  help: { en: "Getting help", th: "ขอความช่วยเหลือ" },
};

export function isServiceCategory(value: string): value is ServiceCategory {
  return (serviceCategoryOrder as string[]).includes(value);
}
