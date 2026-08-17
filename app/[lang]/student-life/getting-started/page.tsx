import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";
import { onboardingUiCopy } from "@/content/onboarding";

// "Student life" breadcrumb label, authored locally to match the wording of
// `app/[lang]/student-life/page.tsx`'s own (unexported) title copy: that
// page's `copy` object isn't shared, so this is intentionally duplicated as
// a small, stable string rather than reaching into another owned page.
const studentLifeLabel: Record<Locale, string> = {
  en: "Student life",
  th: "ชีวิตนักศึกษา",
};

// Literal route: sits as a sibling of `[audience]/page.tsx` under
// `student-life` and takes precedence over that dynamic segment for this
// exact URL, the same "static wins" pattern `course-reviews` already relies
// on. `[audience]` here (the onboarding audience chooser's own child route)
// is a separate, unrelated dynamic segment scoped to `getting-started/`.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale: Locale = lang;
  const t = onboardingUiCopy[locale].chooser;

  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: "/student-life/getting-started",
  });
}

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = onboardingUiCopy[locale];
  const c = t.chooser;

  const homeHref = localeHref(locale, "/student-life/getting-started/home");
  const internationalHref = localeHref(locale, "/student-life/getting-started/international");
  const allGuidesHref = localeHref(locale, "/student-life");

  return (
    <>
      <PageHeader
        title={c.title}
        lede={c.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: studentLifeLabel[locale], href: "/student-life" },
              { label: t.gettingStarted },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card href={homeHref}>
            <CardTitle href={homeHref} as="h2">
              {c.homeTitle}
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted">{c.homeBody}</p>
          </Card>

          <Card href={internationalHref}>
            <CardTitle href={internationalHref} as="h2">
              {c.internationalTitle}
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted">{c.internationalBody}</p>
          </Card>

          <Card href={allGuidesHref}>
            <CardTitle href={allGuidesHref} as="h2">
              {c.allGuidesTitle}
            </CardTitle>
            <p className="text-sm leading-relaxed text-muted">{c.allGuidesBody}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
