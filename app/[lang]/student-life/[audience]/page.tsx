import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, formatDate, localeHref, locales, type Locale } from "@/lib/i18n";
import { getGuideEntries, type GuideAudience } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card, { CardTitle } from "@/components/Card";
import { studentLifeTracks } from "@/content/student-life/tracks";

const audiences: GuideAudience[] = ["home", "international", "handbook"];

function isAudience(x: string): x is GuideAudience {
  return audiences.includes(x as GuideAudience);
}

export function generateStaticParams() {
  return locales.flatMap((lang) => audiences.map((audience) => ({ lang, audience })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; audience: string }>;
}): Promise<Metadata> {
  const { lang, audience } = await params;
  if (!isLocale(lang) || !isAudience(audience)) return {};
  const locale: Locale = lang;
  const t = studentLifeTracks[locale][audience];

  return buildMetadata({
    locale,
    title: t.title,
    description: t.lede,
    path: `/student-life/${audience}`,
  });
}

const copy: Record<Locale, { updated: string }> = {
  en: {
    updated: "Updated",
  },
  th: {
    updated: "อัปเดตล่าสุด",
  },
};

export default async function StudentLifeTrackPage({
  params,
}: {
  params: Promise<{ lang: string; audience: string }>;
}) {
  const { lang, audience } = await params;
  if (!isLocale(lang) || !isAudience(audience)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const track = studentLifeTracks[locale][audience];
  const infoServicesLabel = dict.nav.find((n) => n.href === "/services")!.label;

  const entries = getGuideEntries(locale, audience);

  return (
    <>
      <PageHeader
        title={track.title}
        lede={track.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: infoServicesLabel, href: "/services" },
              { label: track.title },
            ]}
          />
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const href = localeHref(locale, `/student-life/${audience}/${entry.slug}`);
            return (
              <Card key={entry.slug} href={href}>
                {/* h2: these cards are the page's top-level sections, sitting
                    directly under the h1 with no intervening heading, so the
                    default h3 would skip a level. */}
                <CardTitle href={href} as="h2">
                  {entry.frontmatter.title}
                </CardTitle>
                <p className="text-muted text-sm leading-relaxed">{entry.frontmatter.summary}</p>
                <p className="text-muted mt-auto text-xs">
                  {t.updated}: {formatDate(locale, entry.frontmatter.updated)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
