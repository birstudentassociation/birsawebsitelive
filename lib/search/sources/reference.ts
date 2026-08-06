/**
 * Turn the site's non-MDX, structured TypeScript content — the course
 * catalogue, the regulations library, the committee roster, nearby places,
 * quick links, and emergency guidance — into search documents.
 *
 * These sources share nothing structurally (a flat array, a recursive tree,
 * whole-object-per-locale scenarios), so unlike `content.ts` and
 * `answers.ts` there is no single shared shape to build from. Each adapter
 * reads its own module directly and does its own locale picking.
 *
 * A few decisions worth flagging:
 *
 * - Course reviews: only `PI121` currently has a `review`, and it is marked
 *   `sample: true` (demo content, not a real submission). Sample reviews are
 *   deliberately excluded from `body`/`priority` so search never surfaces
 *   fabricated workload/assessment claims as if a student wrote them, and
 *   never ranks a demo review above a page with real content.
 * - Regulations: one document per `Provision`, not per document, since a
 *   reader searching a rule wants the specific clause, not the ~60-provision
 *   instrument it lives in. The tree walk is iterative-safe (depth-capped)
 *   because `Section.children` nests arbitrarily deep (Title → Chapter →
 *   Division in the University Regulation).
 * - Committee: no emails or student IDs are indexed — `content/committee.ts`
 *   forbids storing them at all, enforced by a content test, so there is
 *   nothing to accidentally leak here even by omission bug.
 * - Places: food and housing are edited as two separate Google Maps lists
 *   but rendered on the same guide page (`places-nearby.mdx`, "Food and
 *   housing nearby"), so both link there; there is no separate housing page.
 * - Quick links: items are scored below the pages they point to when that
 *   page is already indexed elsewhere (internal, non-external), and above
 *   ordinary prose when they are the only pointer to something off-site
 *   (external university systems), which is what `priority` encodes here.
 */
import { committee, committeeGroupLabels } from "@/content/committee";
import { courses } from "@/content/course-review/courses";
import type { Course, CourseCategory } from "@/content/course-review/types";
import { scenarios } from "@/content/emergency/scenarios";
import type { EmergencyScenario, EmergencySection } from "@/content/emergency/types";
import { quickGroups } from "@/content/quick";
import { documents } from "@/content/activity/regulations";
import type {
  Bi,
  Block,
  Provision,
  ProvisionItem,
  RegulationDoc,
  Section,
} from "@/content/activity/regulations";
import { localeHref, type Locale } from "@/lib/i18n";
import { foodGroups, housingPlaces, type Place, type PlaceArea } from "@/lib/places";
import type { SearchDoc } from "@/lib/search/types";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function keywordsOf(parts: (string | undefined)[]): string[] {
  return parts.filter((part): part is string => Boolean(part));
}

function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "th" : "en";
}

/** Trims `text` to about `maxLen` characters, breaking on a word boundary rather than mid-word. */
function truncate(text: string, maxLen = 200): string {
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

// ---------------------------------------------------------------------------
// 1. Courses (content/course-review/courses.ts)
// ---------------------------------------------------------------------------

const CATEGORY_LABEL: Record<CourseCategory, { en: string; th: string }> = {
  "general-education": { en: "General education", th: "วิชาศึกษาทั่วไป" },
  core: { en: "Core", th: "วิชาบังคับ" },
  required: { en: "Required", th: "วิชาบังคับเฉพาะ" },
  "elective-area": { en: "Area studies elective", th: "วิชาเลือก กลุ่มอาณาบริเวณศึกษา" },
  "elective-approach": { en: "Approaches elective", th: "วิชาเลือก กลุ่มแนวทางการศึกษา" },
  "minor-required": { en: "Minor (required)", th: "วิชาโท (บังคับ)" },
  "minor-elective": { en: "Minor (elective)", th: "วิชาโท (เลือก)" },
  "free-elective": { en: "Free elective", th: "วิชาเลือกเสรี" },
};

/** "PI280" -> "PI 280": students type the code both ways. */
function codeWithSpace(code: string): string {
  return code.replace(/^([A-Za-z]+)(\d+)$/, "$1 $2");
}

/**
 * Prerequisite note plus real (non-sample) review text. A `review.sample`
 * entry is demo content written to preview the layout, not a real student
 * submission, so it never contributes searchable body text.
 */
function courseBody(course: Course, locale: Locale): string | undefined {
  const parts: string[] = [];
  if (course.prerequisite) parts.push(course.prerequisite[locale]);

  const review = course.review;
  if (review && !review.sample) {
    parts.push(review.workload[locale], review.assessmentStyle[locale]);
    parts.push(...review.tips.map((tip) => tip[locale]));
    for (const quote of review.quotes ?? []) {
      parts.push(quote.text[locale]);
      if (quote.attribution) parts.push(quote.attribution[locale]);
    }
  }

  return parts.length > 0 ? parts.join(" ") : undefined;
}

function courseDoc(locale: Locale, course: Course): SearchDoc {
  const review = course.review;
  const hasRealReview = Boolean(review && !review.sample);
  return {
    id: `course:${course.code}`,
    locale,
    section: "courses",
    kind: "reference",
    href: localeHref(locale, `/student-life/course-reviews/${course.code}`),
    title: `${course.code}: ${course.title[locale]}`,
    summary: truncate(course.description[locale]),
    keywords: keywordsOf([
      course.code,
      codeWithSpace(course.code),
      course.title.en,
      course.title.th,
      ...(course.instructors ?? []).flatMap((instructor) => [
        instructor.name.en,
        instructor.name.th,
      ]),
      course.category,
      course.track,
    ]),
    body: courseBody(course, locale),
    badge: CATEGORY_LABEL[course.category][locale],
    priority: hasRealReview ? 0.3 : undefined,
  };
}

/** One search document per PI course, for one locale. */
export function courseDocs(locale: Locale): SearchDoc[] {
  return courses.map((course) => courseDoc(locale, course));
}

// ---------------------------------------------------------------------------
// 2. Regulations (content/activity/regulations)
// ---------------------------------------------------------------------------

const PROVISION_LABEL: Record<Locale, string> = { th: "ข้อ", en: "Section" };

/** Guards the recursive `Section` walk against a malformed (e.g. cyclic) tree. */
const MAX_SECTION_DEPTH = 12;

type ProvisionEntry = {
  provision: Provision;
  /** Titles of every ancestor `Section`, root first, immediate parent last. */
  ancestorTitles: Bi[];
};

function collectProvisions(
  sections: Section[],
  depth: number,
  ancestors: Bi[],
  out: ProvisionEntry[]
): void {
  if (depth > MAX_SECTION_DEPTH) return;
  for (const section of sections) {
    const nextAncestors = [...ancestors, section.title];
    for (const provision of section.provisions ?? []) {
      out.push({ provision, ancestorTitles: nextAncestors });
    }
    if (section.children) {
      collectProvisions(section.children, depth + 1, nextAncestors, out);
    }
  }
}

function itemText(item: ProvisionItem, locale: Locale): string[] {
  const parts = [item.text[locale]];
  if (item.note) parts.push(item.note[locale]);
  for (const child of item.children ?? []) parts.push(...itemText(child, locale));
  return parts;
}

function blockText(block: Block, locale: Locale): string[] {
  if (block.kind === "para") return [block.text[locale]];
  if (block.kind === "list") return block.items.flatMap((item) => itemText(item, locale));
  return block.entries.flatMap((entry) => [entry.term[locale], entry.meaning[locale]]);
}

/** Flattens every nested text field of a provision, in both its authoring shapes. */
function provisionBody(provision: Provision, locale: Locale): string {
  const parts: string[] = [];
  if (provision.lead) parts.push(provision.lead[locale]);
  for (const def of provision.definitions ?? []) {
    parts.push(def.term[locale], def.meaning[locale]);
  }
  for (const item of provision.items ?? []) parts.push(...itemText(item, locale));
  if (provision.tail) parts.push(provision.tail[locale]);
  for (const block of provision.body ?? []) parts.push(...blockText(block, locale));
  return parts.join(" ");
}

/** The provision's `lead`, else its first paragraph or list item, else its `tail`. */
function provisionSummarySource(provision: Provision, locale: Locale): string {
  if (provision.lead) return provision.lead[locale];
  for (const block of provision.body ?? []) {
    if (block.kind === "para") return block.text[locale];
    if (block.kind === "list") {
      const first = block.items[0];
      if (first) return first.text[locale];
    }
  }
  const firstItem = provision.items?.[0];
  if (firstItem) return firstItem.text[locale];
  if (provision.tail) return provision.tail[locale];
  return "";
}

function provisionTitle(entry: ProvisionEntry, locale: Locale): string {
  const own = entry.provision.title[locale].trim();
  const parent = entry.ancestorTitles[entry.ancestorTitles.length - 1];
  const label = own.length > 0 ? own : (parent?.[locale] ?? "");
  return `${PROVISION_LABEL[locale]} ${entry.provision.num}: ${label}`;
}

function provisionKeywords(doc: RegulationDoc, entry: ProvisionEntry, locale: Locale): string[] {
  const num = entry.provision.num;
  return keywordsOf([
    doc.shortTitle[locale],
    `ข้อ ${num}`,
    `section ${num}`,
    `provision ${num}`,
    ...entry.ancestorTitles.map((title) => title[locale]),
  ]);
}

function regulationDoc(locale: Locale, doc: RegulationDoc, entry: ProvisionEntry): SearchDoc {
  return {
    id: `reg:${doc.slug}:${entry.provision.num}`,
    locale,
    section: "regulations",
    kind: "reference",
    href: localeHref(locale, `/activity/regulations/${doc.slug}#prov-${entry.provision.num}`),
    title: provisionTitle(entry, locale),
    summary: truncate(provisionSummarySource(entry.provision, locale)),
    keywords: provisionKeywords(doc, entry, locale),
    body: provisionBody(entry.provision, locale),
    badge: doc.shortTitle[locale],
  };
}

/** One search document per `Provision`, across all three regulation documents, for one locale. */
export function regulationDocs(locale: Locale): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const doc of documents) {
    const entries: ProvisionEntry[] = [];
    collectProvisions(doc.sections, 0, [], entries);
    for (const entry of entries) {
      docs.push(regulationDoc(locale, doc, entry));
    }
  }
  return docs;
}

// ---------------------------------------------------------------------------
// 3. Committee (content/committee.ts)
// ---------------------------------------------------------------------------

/** One search document per committee member, for one locale. Never indexes emails or student IDs. */
export function committeeDocs(locale: Locale): SearchDoc[] {
  const other = otherLocale(locale);
  const href = localeHref(locale, "/activity/roles");
  return committee.map((member) => {
    const info = member[locale];
    const otherInfo = member[other];
    const groupLabel = committeeGroupLabels[member.group];
    return {
      id: `committee:${member.key}`,
      locale,
      section: "activity",
      kind: "reference",
      href,
      title: `${info.firstName} ${info.lastName}`,
      summary: `${info.title} — ${groupLabel[locale]}`,
      keywords: keywordsOf([
        info.nickname,
        `${otherInfo.firstName} ${otherInfo.lastName}`,
        otherInfo.title,
        info.title,
      ]),
      badge: groupLabel[locale],
    };
  });
}

// ---------------------------------------------------------------------------
// 4. Places (lib/places.ts)
// ---------------------------------------------------------------------------

const AREA_BADGE: Record<PlaceArea, { en: string; th: string }> = {
  oldtown: { en: "Tha Prachan", th: "ท่าพระจันทร์" },
  pinklao: { en: "Pinklao", th: "ปิ่นเกล้า" },
};

const FOOD_TERMS = ["food", "ร้านอาหาร", "eat", "กิน"];
const HOUSING_TERMS = ["dorm", "หอพัก", "apartment", "ที่พัก", "condo"];

function placeDoc(locale: Locale, place: Place, href: string, extraKeywords: string[]): SearchDoc {
  const other = otherLocale(locale);
  return {
    id: `place:${place.id}`,
    locale,
    section: "places",
    kind: "reference",
    href,
    title: place.name[locale],
    summary: place.note
      ? `${place.category[locale]} — ${place.note[locale]}`
      : place.category[locale],
    keywords: keywordsOf([place.nameLocal, place.name[other], place.mapsQuery, ...extraKeywords]),
    badge: AREA_BADGE[place.area][locale],
  };
}

/**
 * One search document per food and housing place, for one locale. Both link
 * to the same guide page ("Food and housing nearby") — the two lists are
 * curated separately but published as one page, and there is no dedicated
 * housing/accommodation page under `content/student-life`.
 */
export function placeDocs(locale: Locale): SearchDoc[] {
  const placesNearbyHref = localeHref(locale, "/student-life/home/places-nearby");
  const docs: SearchDoc[] = [];

  for (const group of foodGroups) {
    for (const place of group.places) {
      docs.push(placeDoc(locale, place, placesNearbyHref, [group.title[locale], ...FOOD_TERMS]));
    }
  }

  for (const place of housingPlaces) {
    docs.push(placeDoc(locale, place, placesNearbyHref, HOUSING_TERMS));
  }

  return docs;
}

// ---------------------------------------------------------------------------
// 5. Quick links (content/quick.ts)
// ---------------------------------------------------------------------------

/** One search document per non-placeholder quick-link item, for one locale. */
export function quickLinkDocs(locale: Locale): SearchDoc[] {
  const other = otherLocale(locale);
  const docs: SearchDoc[] = [];

  for (const group of quickGroups) {
    for (const item of group.items) {
      if (item.placeholder) continue;

      // Internal paths start with "/" and are safe to run through
      // localeHref; external URLs (and the mailto: links, which aren't
      // flagged `external` in the source but aren't paths either) are kept
      // as-is so they are never mangled into "/th/mailto:...".
      const href = item.href.startsWith("/") ? localeHref(locale, item.href) : item.href;

      docs.push({
        id: `quick:${item.key}`,
        locale,
        section: "quick",
        kind: "link",
        href,
        title: item[locale].label,
        summary: item[locale].hint ?? "",
        keywords: keywordsOf([item[other].label, group[locale].heading]),
        priority: item.external ? 0.55 : 0.2,
      });
    }
  }

  return docs;
}

// ---------------------------------------------------------------------------
// 6. Emergency guidance (content/emergency)
// ---------------------------------------------------------------------------

/**
 * Plain, panic-typed words per scenario, in both languages. Curated by hand
 * rather than derived from the scenario copy because the one word a reader
 * types during an actual emergency ("fire", "ไฟไหม้") often is not the exact
 * word the guidance prose uses.
 */
const SCENARIO_KEYWORDS: Record<string, string[]> = {
  fire: ["fire", "ไฟไหม้", "evacuate", "อพยพ"],
  earthquake: ["earthquake", "แผ่นดินไหว"],
  flooding: ["flood", "น้ำท่วม"],
  "active-shooting": ["shooting", "กราดยิง", "gun"],
  "health-advisory": ["outbreak", "โรคระบาด"],
  protests: ["protest", "ม็อบ", "ชุมนุม"],
  coup: ["coup", "รัฐประหาร"],
  "campus-closure": ["closed", "ปิด", "closure"],
  "faculty-closure": ["closed", "ปิด", "closure"],
  // Fallback scenario (see content/emergency/scenarios/generic.ts): no
  // single event word, so index the general term instead.
  generic: ["emergency", "ฉุกเฉิน"],
};

function sectionText(section: EmergencySection): string[] {
  return [section.heading, ...(section.body ?? []), ...(section.items ?? [])];
}

/** A safety page is the answer to a whole category of question; weight it accordingly. */
const EMERGENCY_PRIORITY = 0.7;

function emergencyDoc(locale: Locale, scenario: EmergencyScenario): SearchDoc {
  const content = scenario[locale];
  const body = [
    ...content.immediateActions,
    ...content.sections.flatMap((section) => sectionText(section)),
  ].join(" ");

  return {
    id: `emergency:${scenario.id}`,
    locale,
    section: "emergency",
    kind: "guide",
    href: localeHref(locale, `/emergency/${scenario.id}`),
    title: content.title,
    summary: content.lede,
    keywords: SCENARIO_KEYWORDS[scenario.id] ?? [],
    body,
    priority: EMERGENCY_PRIORITY,
  };
}

/** One search document per pre-prepared emergency scenario, for one locale. */
export function emergencyDocs(locale: Locale): SearchDoc[] {
  return Object.values(scenarios).map((scenario) => emergencyDoc(locale, scenario));
}

// ---------------------------------------------------------------------------

/** Every reference-source search document, for one locale. */
export function referenceDocs(locale: Locale): SearchDoc[] {
  return [
    ...courseDocs(locale),
    ...regulationDocs(locale),
    ...committeeDocs(locale),
    ...placeDocs(locale),
    ...quickLinkDocs(locale),
    ...emergencyDocs(locale),
  ];
}
