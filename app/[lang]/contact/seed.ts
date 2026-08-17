import type { Locale } from "@/lib/i18n";
import {
  CONTACT_CATEGORY_VALUES,
  type ContactCategory,
} from "@/components/forms/contactWizardCopy";

/**
 * Derives the "report a problem with this page" deep link (`?category=&from=`)
 * into a category and subject, without touching the draft cookie. Next.js
 * only allows cookie writes from a Server Action or Route Handler, and this
 * page is rendered as a Server Component, so the seed is computed here and
 * handed to the category step's form as a hidden field; `submitCategoryStep`
 * (the legitimate cookie writer) persists it once the reader actually submits.
 */
export function deriveContactSeed(
  locale: Locale,
  category?: string,
  from?: string
): { category?: ContactCategory; subject?: string } {
  const validCategory = CONTACT_CATEGORY_VALUES.includes(category as ContactCategory)
    ? (category as ContactCategory)
    : undefined;
  if (!validCategory) return {};

  // Only accept same-site paths: must start with "/" (not "//", which is
  // protocol-relative and can point off-site) and carry no backslash (which
  // some browsers also treat as a path separator, defeating the "//" check).
  const isSafePath =
    typeof from === "string" &&
    from.startsWith("/") &&
    !from.startsWith("//") &&
    !from.includes("\\");

  const subject =
    validCategory === "problem" && isSafePath
      ? `${locale === "th" ? "ปัญหาในหน้า" : "Problem with page"}: ${from}`
      : undefined;

  return { category: validCategory, subject };
}
