import Image from "next/image";
import { getDictionary, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { getEntries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Button from "@/components/Button";
import Card, { CardTitle } from "@/components/Card";
import Notice from "@/components/Notice";
import NewsCard from "@/components/news/NewsCard";
import { homeEn } from "@/content/home/en";
import { homeTh } from "@/content/home/th";
import { socials } from "@/content/site";

const homeCopy = { en: homeEn, th: homeTh };
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: `${dict.site.name} — ${dict.site.fullName}`,
    description: dict.site.description,
    path: "/",
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const copy = homeCopy[locale];
  const news = getEntries("news", locale).slice(0, 3);

  const quickLinkCards: { href: string; key: keyof typeof copy.quickLinks.items }[] = [
    { href: "/services", key: "services" },
    { href: "/clubs", key: "clubs" },
    { href: "/student-life", key: "studentLife" },
    { href: "/about", key: "about" },
  ];

  const instagram = socials.find((s) => s.id === "instagram");
  const facebook = socials.find((s) => s.id === "facebook");
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BIR Student Association (BIRSA)",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/birsa-logo.png`,
    sameAs: [instagram?.href, facebook?.href].filter((href): href is string => Boolean(href)),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Hero */}
      <section className="border-line bg-cream border-b">
        <div className="wrap grid gap-8 py-14 sm:py-20 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10">
          <div className="max-w-[var(--measure)]">
            <h1 className="font-display text-4xl sm:text-5xl">{copy.hero.heading}</h1>
            <p className="text-muted mt-4 text-lg">{copy.hero.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localeHref(locale, "/quick")}>{copy.hero.primaryCta}</Button>
              <Button href={localeHref(locale, "/student-life")} variant="secondary">
                {copy.hero.secondaryCta}
              </Button>
            </div>
          </div>
          <div aria-hidden="true" className="hidden justify-center md:flex">
            <Image
              src="/birsa-logo.png"
              alt=""
              width={320}
              height={320}
              className="h-auto w-full max-w-[18rem] opacity-90"
              priority
            />
          </div>
        </div>
      </section>

      {/* What's on */}
      {news.length > 0 ? (
        <section aria-labelledby="whats-on-heading" className="wrap py-12 sm:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 id="whats-on-heading" className="font-display text-2xl sm:text-3xl">
              {copy.whatsOn.heading}
            </h2>
            <a
              href={localeHref(locale, "/news")}
              className="text-brand-deep text-sm font-semibold hover:underline"
            >
              {copy.whatsOn.seeAll}
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((entry) => (
              <NewsCard
                key={entry.slug}
                locale={locale}
                dict={dict}
                slug={entry.slug}
                frontmatter={entry.frontmatter}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Quick links */}
      <section aria-labelledby="get-around-heading" className="bg-sunken border-line border-y">
        <div className="wrap py-12 sm:py-16">
          <h2 id="get-around-heading" className="font-display mb-6 text-2xl sm:text-3xl">
            {copy.quickLinks.heading}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinkCards.map(({ href, key }) => {
              const item = copy.quickLinks.items[key];
              const fullHref = localeHref(locale, href);
              return (
                <Card key={key} href={fullHref}>
                  <CardTitle href={fullHref}>{item.label}</CardTitle>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* New here? */}
      <section className="wrap py-12 sm:py-16">
        <Notice variant="info" title={copy.newHere.title}>
          <p>{copy.newHere.body}</p>
          <p className="mt-2">
            <a
              href={localeHref(locale, "/student-life")}
              className="text-brand-deep font-semibold hover:underline"
            >
              {copy.newHere.cta}
            </a>
          </p>
        </Notice>
      </section>
    </>
  );
}
