import { courses } from "@/content/course-review/courses";
import { studentLifeLabel } from "@/content/student-life/topics";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderCard, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR course review";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => courses.map((course) => ({ lang, code: course.code })));
}

const eyebrow = { en: "Course reviews", th: "รีวิววิชาเรียน" };
const yearLabel = { en: "Year", th: "ปี" };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  const course = courses.find((c) => c.code === code);
  if (!isLocale(lang) || !course) return renderSiteOgImage();
  const t = getDictionary(lang).courseReview;
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
