import { CURRICULUM_VERSIONS } from "@/content/curriculum";
import { studentLifeLabel } from "@/content/student-life/topics";
import { allCourseCodes, courseNode } from "@/lib/courses/graph";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR course review";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => allCourseCodes().map((code) => ({ lang, code })));
}

const eyebrow = { en: "Course reviews", th: "รีวิววิชาเรียน" };
const yearLabel = { en: "Year", th: "ปี" };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  const node = courseNode(code);
  if (!isLocale(lang) || !node) return renderSiteOgImage();
  const t = getDictionary(lang).courseReview;
  const course = node.catalogue;
  // A code the review catalogue does not hold gets a card from the curriculum:
  // its English title and the bucket it counts towards in its latest version.
  if (!course) {
    const { version, category, credits } = node.latest;
    const bucket = CURRICULUM_VERSIONS[version].categories.find((c) => c.id === category);
    return renderCard({
      locale: lang,
      eyebrow: `${studentLifeLabel[lang]} · ${eyebrow[lang]}`,
      title: node.title,
      meta: [bucket ? bucket.name[lang] : t.minorCourseCategory],
      aside: { kind: "code", code: node.code, note: `${credits} ${t.credits}` },
    });
  }
  return renderCard({
    locale: lang,
    eyebrow: `${studentLifeLabel[lang]} · ${eyebrow[lang]}`,
    title: course.title[lang],
    meta: [
      t.categories[course.category],
      ...(course.yearLevel.length
        ? [`${yearLabel[lang]} ${course.yearLevel.join(lang === "th" ? " และ " : " and ")}`]
        : []),
    ],
    aside: { kind: "code", code: course.code, note: `${course.credits.total} ${t.credits}` },
  });
}
