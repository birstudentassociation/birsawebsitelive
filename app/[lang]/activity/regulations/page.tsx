import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, localeHref, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import { regulation } from "@/content/activity/regulations";
import type { Bi, Part, Provision } from "@/content/activity/regulations";

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
  return buildMetadata({
    locale,
    title: regulation.shortTitle[locale],
    description: regulation.citation[locale],
    path: "/activity/regulations",
  });
}

const ui: Record<
  Locale,
  {
    sectionLabel: string; // "BIRSA activity" (breadcrumb parent)
    contents: string;
    aboutTitle: string;
    aboutBody: string;
    part: (n: number) => string;
    preliminary: string;
    back: string;
    made: string;
  }
> = {
  en: {
    sectionLabel: "BIRSA activity",
    contents: "Arrangement of provisions",
    aboutTitle: "About this document",
    aboutBody:
      "This is a reference rendering of the Faculty of Political Science's official Thai-language Notice on student activities, with a short summary heading added to each provision to aid navigation. The Thai text is authoritative; the English is a translation.",
    part: (n) => `Part ${n}`,
    preliminary: "Preliminary",
    back: "Back to BIRSA activity",
    made: "Given under hand",
  },
  th: {
    sectionLabel: "การดำเนินงานของ BIRSA",
    contents: "สารบัญข้อกำหนด",
    aboutTitle: "เกี่ยวกับเอกสารนี้",
    aboutBody:
      "นี่คือการนำเสนอประกาศฉบับทางการของคณะรัฐศาสตร์ว่าด้วยกิจกรรมนักศึกษา โดยเพิ่มหัวข้อสรุปสั้น ๆ ไว้ที่แต่ละข้อเพื่อช่วยในการค้นหา ทั้งนี้ให้ถือข้อความภาษาไทยเป็นฉบับที่มีผลบังคับ ส่วนภาษาอังกฤษเป็นคำแปล",
    part: (n) => `ส่วนที่ ${n}`,
    preliminary: "บทเบื้องต้น",
    back: "กลับไปหน้าการดำเนินงานของ BIRSA",
    made: "ประกาศ ณ",
  },
};

function partAnchor(part: Part): string {
  return part.num === null ? "part-preliminary" : `part-${part.num}`;
}

function partHeading(part: Part, locale: Locale, t: (typeof ui)[Locale]): string {
  const title = part.title[locale];
  return part.num === null ? title : `${t.part(part.num)} — ${title}`;
}

function ProvisionBody({ provision, pick }: { provision: Provision; pick: (b: Bi) => string }) {
  return (
    <div className="text-muted mt-2 flex flex-col gap-3 leading-relaxed">
      {provision.lead ? <p>{pick(provision.lead)}</p> : null}

      {provision.definitions ? (
        <dl className="border-line flex flex-col gap-2 border-l-2 pl-4">
          {provision.definitions.map((def) => (
            <div key={def.term.en} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="text-ink font-semibold">{pick(def.term)}</dt>
              <dd className="sm:before:mr-2 sm:before:content-['—']">{pick(def.meaning)}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {provision.items ? (
        <ul className="flex flex-col gap-2">
          {provision.items.map((item) => (
            <li key={item.marker} className="flex gap-2.5">
              <span className="text-ink shrink-0 tabular-nums">{item.marker}</span>
              <div className="flex flex-col gap-1.5">
                <span>{pick(item.text)}</span>
                {item.note ? <span className="text-muted italic">{pick(item.note)}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {provision.tail ? <p>{pick(provision.tail)}</p> : null}
    </div>
  );
}

export default async function RegulationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = ui[locale];
  const pick = (b: Bi) => b[locale];

  return (
    <>
      <PageHeader
        title={regulation.shortTitle[locale]}
        lede={regulation.citation[locale]}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            items={[
              { label: dict.site.name, href: "/" },
              { label: t.sectionLabel, href: "/activity" },
              { label: regulation.shortTitle[locale] },
            ]}
          />
        }
      />

      <div className="wrap flex max-w-[70ch] flex-col gap-10 py-10">
        {/* Prelims: authority, recital, provenance note */}
        <div className="flex flex-col gap-4">
          <p className="text-ink font-semibold">{regulation.authority[locale]}</p>
          <p className="text-muted leading-relaxed">{regulation.preamble[locale]}</p>
          <Notice variant="info" title={t.aboutTitle}>
            <p>{t.aboutBody}</p>
          </Notice>
        </div>

        {/* Arrangement of provisions (table of contents with short titles) */}
        <nav aria-labelledby="contents-heading" className="border-line bg-sunken rounded-lg border p-6">
          <h2 id="contents-heading" className="font-display mb-4 text-xl">
            {t.contents}
          </h2>
          <div className="flex flex-col gap-4">
            {regulation.parts.map((part) => (
              <div key={partAnchor(part)}>
                <p className="text-ink font-semibold">
                  <Link href={`#${partAnchor(part)}`} className="hover:text-brand-deep hover:underline">
                    {partHeading(part, locale, t)}
                  </Link>
                </p>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {part.provisions.map((provision) => (
                    <li key={provision.num} className="flex gap-2 text-sm">
                      <Link
                        href={`#prov-${provision.num}`}
                        className="text-muted hover:text-brand-deep flex gap-2 hover:underline"
                      >
                        <span className="tabular-nums">{provision.num}.</span>
                        <span>{pick(provision.title)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Body: Parts → provisions */}
        <div className="flex flex-col gap-10">
          {regulation.parts.map((part) => (
            <section
              key={partAnchor(part)}
              id={partAnchor(part)}
              aria-labelledby={`${partAnchor(part)}-heading`}
              className="scroll-mt-24 flex flex-col gap-6"
            >
              <h2
                id={`${partAnchor(part)}-heading`}
                className="border-brand font-display border-b-2 pb-2 text-2xl"
              >
                {partHeading(part, locale, t)}
              </h2>

              {part.provisions.map((provision) => (
                <article
                  key={provision.num}
                  id={`prov-${provision.num}`}
                  className="scroll-mt-24 flex gap-3 sm:gap-4"
                >
                  <div className="text-brand-deep font-display w-6 shrink-0 pt-0.5 text-sm font-semibold tabular-nums sm:w-8 sm:text-base">
                    {provision.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-ink text-lg leading-snug font-semibold">
                      {pick(provision.title)}
                    </h3>
                    <ProvisionBody provision={provision} pick={pick} />
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>

        {/* Signature block */}
        <div className="border-line text-muted flex flex-col items-end gap-1 border-t pt-6 text-sm">
          <p>{regulation.made[locale]}</p>
          <p className="text-ink font-semibold">{regulation.signatory[locale]}</p>
        </div>

        <Link
          href={localeHref(locale, "/activity")}
          className="text-brand-deep hover:text-brand-dark text-sm font-semibold"
        >
          &larr; {t.back}
        </Link>
      </div>
    </>
  );
}
