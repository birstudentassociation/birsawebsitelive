/**
 * Club vocabulary and the summary shape passed to the client-side explorer.
 *
 * The clubs themselves live in MDX: `content/clubs/{en,th}/<slug>.mdx`, loaded
 * by `getClubEntries` in `lib/content.ts`. Frontmatter carries the card and
 * sidebar data; the body is the club's own write-up.
 *
 * Sourcing notes:
 * - Eleven clubs presented themselves at the BIR orientation "Welcome to the
 *   club" session, and their pages are written from those slides: ASA IR, BIR
 *   Music, BIRify, Kien Club, BIR CardGame, BIR Football, BIR Mock Fund
 *   (IAIC), BIR Basketball, BIR Esports, TU MUN, and Parliamock.TU.
 * - BIR Volleyball did not present. It is a real club (it holds equipment as a
 *   custodian in the inventory system) but we have no material from it, so its
 *   page stays general and states no times, venues, or handles.
 *
 * Never invent real people's names: `lead` is a role title only. Do not
 * fabricate contact details. Only list a link, meeting time, or venue that the
 * club stated itself; QR codes in the slide deck are not transcribable, so
 * where a club shared only a QR code we say to ask the club rather than
 * guessing a URL.
 */
import type { Locale } from "@/lib/i18n";

export type ClubCategory = "academic" | "sports" | "arts" | "community" | "social";

/**
 * The fields the clubs index needs. Kept deliberately small: it crosses into a
 * client component, so it carries no MDX bodies.
 */
export type ClubSummary = {
  slug: string;
  title: string;
  tagline: string;
  category: ClubCategory;
  joinOpen: boolean;
};

export const clubCategories: Record<ClubCategory, Record<Locale, string>> = {
  academic: { en: "Academic", th: "วิชาการ" },
  sports: { en: "Sports", th: "กีฬา" },
  arts: { en: "Arts and culture", th: "ศิลปะและวัฒนธรรม" },
  community: { en: "Community and service", th: "ชุมชนและจิตอาสา" },
  social: { en: "Social", th: "สังสรรค์" },
};
