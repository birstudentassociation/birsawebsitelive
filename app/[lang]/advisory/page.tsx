import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { advisoryCopy } from "@/content/advisory";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import PageHeader from "@/components/PageHeader";

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
  return buildMetadata({
    locale: lang,
    title: advisoryCopy[lang].title,
    description: advisoryCopy[lang].metaDescription,
    path: "/advisory",
  });
}

export default async function AdvisoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = advisoryCopy[locale];

  return (
    <>
      <PageHeader
        title={t.title}
        lede={t.lede}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[{ label: dict.site.name, href: "/" }, { label: t.breadcrumb }]}
          />
        }
        helpSlot={
          <span className="inline-flex rounded-full bg-white p-2 shadow-sm ring-1 ring-line">
            <Image
              src="/emergency/thammasat-seal.svg"
              alt={t.sealAlt}
              width={96}
              height={96}
              className="h-20 w-20 sm:h-24 sm:w-24"
              priority
            />
          </span>
        }
      />
      <div className="wrap flex flex-col gap-10 py-10">
        <div className="max-w-[var(--measure)]">
          <Notice variant="warning" title={t.noticeTitle}>
            {t.notice}
          </Notice>
        </div>

        <section aria-labelledby="dates-heading" className="flex flex-col gap-4">
          <h2 id="dates-heading" className="font-display text-2xl">
            {t.tableHeading}
          </h2>
          <div
            role="region"
            aria-label={t.caption}
            tabIndex={0}
            className="max-w-full overflow-x-auto rounded-md border border-line bg-surface"
          >
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm leading-relaxed">
              <caption className="px-3 py-2 text-left text-muted">{t.caption}</caption>
              <thead>
                <tr className="border-y border-line bg-sunken">
                  <th scope="col" className="px-3 py-2 font-semibold">
                    {t.columns.date}
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    {t.columns.classes}
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    {t.columns.work}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {t.rows.map((row) => (
                  <tr key={row.date}>
                    <th scope="row" className="px-3 py-2 font-medium">
                      {row.date}
                    </th>
                    <td className="px-3 py-2">{row.classes}</td>
                    <td className="px-3 py-2">{row.work}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex max-w-[var(--measure)] flex-col gap-10">
          <section aria-labelledby="means-heading" className="flex flex-col gap-3">
            <h2 id="means-heading" className="font-display text-2xl">
              {t.meansHeading}
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
              {t.means.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="leading-relaxed">{t.contact}</p>
          </section>

          <section aria-labelledby="why-heading" className="flex flex-col gap-3">
            <h2 id="why-heading" className="font-display text-2xl">
              {t.whyHeading}
            </h2>
            {t.why.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>

          <section aria-labelledby="source-heading" className="flex flex-col gap-3">
            <h2 id="source-heading" className="font-display text-2xl">
              {t.sourceHeading}
            </h2>
            <p className="leading-relaxed text-muted">{t.source}</p>
          </section>
        </div>
      </div>
    </>
  );
}
