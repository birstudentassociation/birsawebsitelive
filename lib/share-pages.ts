/**
 * The pages that get a share card from `/[lang]/og/...`: every destination in
 * the search registry, plus the emergency index. A page that is not listed,
 * such as a step in a form, shares the card of the nearest listed page above
 * it, so a link to `/contact/email` unfurls as Contact BIRSA.
 */
import { getDictionary, type Locale } from "@/lib/i18n";
import { staticPages } from "@/lib/search/pages";

type Bi = Record<Locale, string>;

export type SharePage = { path: string; title: Bi; summary: Bi };

const emergency = { en: getDictionary("en"), th: getDictionary("th") };

export const sharePages: SharePage[] = [
  ...staticPages
    .filter((page) => page.path !== "/")
    .map(({ path, title, summary }) => ({ path, title, summary })),
  {
    path: "/emergency",
    title: {
      en: emergency.en.emergencyPage.indexTitle,
      th: emergency.th.emergencyPage.indexTitle,
    },
    summary: {
      en: emergency.en.emergencyPage.indexLede,
      th: emergency.th.emergencyPage.indexLede,
    },
  },
];

const byPath = new Map(sharePages.map((page) => [page.path, page]));

export function getSharePage(path: string): SharePage | undefined {
  return byPath.get(path);
}

/** The listed page at `path`, or the nearest one above it. */
export function nearestSharePage(path: string): SharePage | undefined {
  const segments = path.split("/").filter(Boolean);
  for (let n = segments.length; n > 0; n--) {
    const page = byPath.get(`/${segments.slice(0, n).join("/")}`);
    if (page) return page;
  }
  return undefined;
}

/** The section a listed page sits in, named by its top-level page, for the card's eyebrow. */
export function shareSection(page: SharePage, locale: Locale): string {
  const top = byPath.get(`/${page.path.split("/")[1]}`);
  return top && top !== page ? top.title[locale] : getDictionary(locale).site.name;
}
