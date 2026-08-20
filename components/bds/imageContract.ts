/**
 * The image contract (REDESIGN-2.0 §4.7, §11.3 item 8).
 *
 * FROZEN CONTRACT. Wave 0 owns this file, and §11.7 names it as something
 * that must never be parallelised, because every schema agent and every
 * component agent depends on it and because half of it has legal weight.
 *
 * Today the site is text-only by design. In 2.0 content carries images, and
 * this is a paradigm shift rather than a new field: a student association that
 * runs events and cannot show them is publishing a newspaper with no
 * photographs, and it is the reason committee news currently lives and dies on
 * Instagram. Doing it properly means six things, and skipping any of them is
 * how a text-forward site becomes a slow, inaccessible, legally exposed photo
 * blog. This file is the machine-readable part of those six.
 *
 * What is NOT in this file, and is a committee decision rather than a
 * developer one: whether BIRSA adopts the photography policy at all (§4.7E,
 * §15 item 10). Publishing photographs of students is a standing commitment to
 * a notice at events, a takedown route with a real service standard, and a
 * default of wide shots. If the committee will not run that, the honest answer
 * is to keep images for things rather than people. `docs/DECISIONS-2.0.md`
 * tracks it. Nothing here presumes the answer: these constraints are what the
 * code enforces IF images of people are published, and they are equally
 * correct for images of things.
 */

/**
 * §4.7A. A fixed set of aspect ratios, declared in the schema. No arbitrary
 * heights, so cards never jump and cumulative layout shift stays at zero.
 * Extending this set is code, deliberately (§6.12).
 */
export const aspectRatios = ["16:9", "4:3", "1:1"] as const;

export type AspectRatio = (typeof aspectRatios)[number];

export function aspectRatioValue(ratio: AspectRatio): number {
  const [w, h] = ratio.split(":").map(Number) as [number, number];
  return w / h;
}

/**
 * §4.7D. A source file size limit at upload, with a clear message, so a 12MB
 * original is rejected at the door rather than stored forever.
 */
export const MAX_SOURCE_BYTES = 8 * 1024 * 1024;

/** The formats an officer may upload. Delivery format is negotiated, not chosen. */
export const acceptedUploadTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

/**
 * §4.7C. Accessibility, enforced rather than encouraged.
 *
 * The shape every image field takes in every schema. Two properties are doing
 * the work:
 *
 *   - `alt` is required in BOTH locales and is publish-blocking, exactly as
 *     body copy is (principle 14). An English-only alt text is a Thai screen
 *     reader user reading English.
 *   - `decorative` is a deliberate choice, not a default. Setting it hides the
 *     alt field and renders `alt=""`. An officer must ACTIVELY say an image
 *     carries no information, rather than fall into it by leaving a field
 *     empty. Acceptance test rows 36 and 37.
 *
 * `hotspot` is §4.7D's single most important usability feature: the officer
 * marks the subject once and every ratio crops around it. The alternative is
 * asking a non-technical editor to produce four crops of every photograph,
 * which they will not do, and the site fills with beheaded people.
 */
export type ImageField = {
  assetId: string;
  decorative: boolean;
  /** Required unless `decorative`. Both locales, or it does not publish. */
  alt: { en: string; th: string } | null;
  caption?: { en: string; th: string };
  credit?: string;
  ratio: AspectRatio;
  /** Normalised 0..1 coordinates of the subject, for automatic cropping. */
  hotspot?: { x: number; y: number };
};

export type AltTextProblem =
  "missing-locale" | "empty" | "starts-with-image-of" | "same-as-caption" | "alt-on-decorative";

/**
 * §4.7C. Validation rejects the usual failures.
 *
 * Pure and total so the same function runs in three places: the Sanity
 * validation an officer sees inline in their own language, the build check,
 * and the unit tests. Three implementations of one rule is three rules.
 *
 * "Alt text describes the scene, not the people" is an accessibility rule and
 * a privacy rule at once: "students at the welcome fair" rather than a list of
 * names. That one cannot be checked mechanically, so it lives in the field
 * description an officer reads (§4.7G) rather than pretending to be a test.
 */
export function altTextProblems(image: ImageField): AltTextProblem[] {
  const problems: AltTextProblem[] = [];

  if (image.decorative) {
    if (image.alt !== null) problems.push("alt-on-decorative");
    return problems;
  }

  if (image.alt === null) return ["missing-locale"];

  for (const locale of ["en", "th"] as const) {
    const text = image.alt[locale]?.trim() ?? "";
    if (text === "") {
      problems.push(problems.includes("empty") ? "missing-locale" : "empty");
      continue;
    }
    if (/^(an?\s+)?(image|photo(graph)?|picture)\s+of\b/i.test(text)) {
      problems.push("starts-with-image-of");
    }
    if (image.caption && text.toLowerCase() === image.caption[locale]?.trim().toLowerCase()) {
      problems.push("same-as-caption");
    }
  }

  return [...new Set(problems)];
}

/**
 * §4.7D and §9. Per-template image budgets, counted rather than discovered
 * after launch.
 *
 * §9 is explicit that budgets are re-cut per template rather than tightened
 * globally, because 2.0 pulls in two directions at once: §3.6 removes pages
 * and §8.2 removes the calendar from the home page, both of which take weight
 * out, while this section puts weight in and moves the LCP element on a news
 * page from text to a photograph. A single site-wide budget hides both
 * movements.
 *
 * `heroAllowed` is the `priority` budget: only the hero gets it, everything
 * else is lazy. A page with two priority images has no priority image.
 */
export type TemplateImageBudget = {
  template: string;
  heroAllowed: boolean;
  /** Body images, excluding the hero. */
  maxBodyImages: number;
  /** Largest Contentful Paint budget in milliseconds, on the Lighthouse run. */
  lcpMs: number;
};

export const templateImageBudgets: TemplateImageBudget[] = [
  { template: "home", heroAllowed: false, maxBodyImages: 3, lcpMs: 2000 },
  { template: "news-article", heroAllowed: true, maxBodyImages: 8, lcpMs: 2500 },
  { template: "news-index", heroAllowed: false, maxBodyImages: 12, lcpMs: 2200 },
  { template: "event", heroAllowed: true, maxBodyImages: 6, lcpMs: 2500 },
  { template: "club", heroAllowed: true, maxBodyImages: 6, lcpMs: 2500 },
  { template: "guide", heroAllowed: false, maxBodyImages: 4, lcpMs: 2200 },
  { template: "committee", heroAllowed: false, maxBodyImages: 24, lcpMs: 2500 },
  // A service must stay fast and calm. A student filling in a welfare or a
  // loan form does not need a photograph, and §5.4's sensitive services must
  // not carry one at all.
  { template: "service-start", heroAllowed: false, maxBodyImages: 1, lcpMs: 1800 },
  { template: "service-step", heroAllowed: false, maxBodyImages: 0, lcpMs: 1800 },
  // The public lost-and-found listing (§5.5). Every photograph here has been
  // reviewed by an officer before it appears.
  { template: "lost-and-found-listing", heroAllowed: false, maxBodyImages: 20, lcpMs: 2500 },
];

export function budgetFor(template: string): TemplateImageBudget | null {
  return templateImageBudgets.find((b) => b.template === template) ?? null;
}

/**
 * §4.7F. Where images live, and the boundary that has no exception.
 *
 * Content images go to the CMS: they are published content, they benefit from
 * the transform pipeline, and they contain no student submissions. Operational
 * uploads stay in Vercel Blob: equipment photographs, reimbursement receipts,
 * and found-item photographs. Those may contain personal data, they are
 * subject to retention, and they must be deletable by the existing purge in
 * `lib/privacy/retention.ts`.
 *
 * The one qualification §6.10 makes: a published photograph of an identifiable
 * student IS that student's personal data, whoever uploaded it. So the CMS
 * boundary is "no student SUBMISSIONS", not "no personal data", and the
 * processor entry says so plainly rather than claiming otherwise.
 */
export type ImageStore = "cms" | "blob";

export function storeFor(
  usage:
    | "content"
    | "committee-portrait"
    | "equipment-photo"
    | "reimbursement-receipt"
    | "found-item-photo"
): ImageStore {
  switch (usage) {
    case "content":
    case "committee-portrait":
      return "cms";
    case "equipment-photo":
    case "reimbursement-receipt":
    case "found-item-photo":
      return "blob";
  }
}

/**
 * §4.7G. The house rules officers actually read, short enough to sit in the
 * Studio field descriptions. Authored in both languages because the officer
 * reading them may be reading in either.
 */
export const photographyHouseRules: Array<{ en: string; th: string }> = [
  {
    en: "Photograph the activity, not the faces.",
    th: "ถ่ายภาพกิจกรรม ไม่ใช่ใบหน้า",
  },
  {
    en: "Ask before you make someone the subject.",
    th: "ขออนุญาตก่อนถ่ายภาพที่มีบุคคลใดเป็นจุดสนใจหลัก",
  },
  {
    en: "No screenshots of chat messages.",
    th: "ไม่ใช้ภาพหน้าจอข้อความแชท",
  },
  {
    en: "No photographs of documents, ID cards or screens.",
    th: "ไม่ถ่ายภาพเอกสาร บัตรประจำตัว หรือหน้าจอ",
  },
  {
    en: "If in doubt, do not publish it, and ask the Rights Advocate.",
    th: "หากไม่แน่ใจ อย่าเผยแพร่ และสอบถามกรรมการฝ่ายพิทักษ์สิทธิ์และสวัสดิการ",
  },
];
