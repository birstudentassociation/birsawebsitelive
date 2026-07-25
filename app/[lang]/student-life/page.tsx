import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { type GuideAudience } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";
import { studentLifeTracks } from "@/content/student-life/tracks";
import { onboardingUiCopy } from "@/content/onboarding";

// Sideways-navigation index for the three guide tracks plus course reviews.
// Reached from the "/information-services" hub (and from `content/quick.ts`);
// not in the header nav, so this route has no [audience]-shaped ambiguity to
// worry about beyond the literal "course-reviews" segment handled by its own
// route.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const copy: Record<Locale, { title: string; lede: string }> = {
  en: {
    title: "Student life",
    lede: "Guides to life at BIR, course reviews written by students, and a dedicated track for international students. Pick where you want to start.",
  },
  th: {
    title: "ชีวิตนักศึกษา",
    lede: "คู่มือการใช้ชีวิตที่ BIR รีวิวรายวิชาจากรุ่นพี่นักศึกษา และเส้นทางเฉพาะสำหรับนักศึกษาต่างชาติ เลือกหัวข้อที่ต้องการเริ่มอ่าน",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = copy[locale];

  return buildMetadata({ locale, title: t.title, description: t.lede, path: "/student-life" });
}

const trackOrder: GuideAudience[] = ["home", "handbook", "international"];

export default async function StudentLifePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const tracks = studentLifeTracks[locale];
  const courseReview = dict.courseReview;

  const courseReviewsHref = localeHref(locale, "/student-life/course-reviews");
  const gettingStartedHref = localeHref(locale, "/student-life/getting-started");
  const gettingStarted = onboardingUiCopy[locale].chooser;

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.title }]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Card href={gettingStartedHref}>
            <CardTitle href={gettingStartedHref} as="h2">
              {gettingStarted.title}
            </CardTitle>
            <p className="text-muted text-sm leading-relaxed">{gettingStarted.lede}</p>
          </Card>

          <Card href={courseReviewsHref}>
            <CardTitle href={courseReviewsHref} as="h2">
              {courseReview.title}
            </CardTitle>
            <p className="text-muted text-sm leading-relaxed">{courseReview.lede}</p>
          </Card>

          {trackOrder.map((audience) => {
            const track = tracks[audience];
            const href = localeHref(locale, `/student-life/${audience}`);
            return (
              <Card key={audience} href={href}>
                <CardTitle href={href} as="h2">
                  {track.title}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{track.lede}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
