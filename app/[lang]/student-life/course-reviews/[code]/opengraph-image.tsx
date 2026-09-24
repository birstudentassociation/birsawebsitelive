import { courses } from "@/content/course-review/courses";
import { isLocale, locales } from "@/lib/i18n";
import { OG_SIZE, renderPageOgImage, renderSiteOgImage } from "@/lib/og-image";

export const alt = "BIR course review";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => courses.map((course) => ({ lang, code: course.code })));
}

const eyebrow = { en: "Course reviews", th: "รีวิววิชาเรียน" };

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;
  const course = courses.find((c) => c.code === code);
  if (!isLocale(lang) || !course) return renderSiteOgImage();
  return renderPageOgImage({
    eyebrow: `${eyebrow[lang]} · ${course.code}`,
    title: course.title[lang],
  });
}
