import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Notice from "@/components/Notice";
import ExternalLink from "@/components/ExternalLink";
import {
  copy,
  images,
  portraits,
  victims,
  DOCT6,
  type SixOctoberImage,
} from "@/content/six-october";

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
  const t = copy[lang];
  return buildMetadata({
    locale: lang,
    title: t.title,
    description: t.metaDescription,
    path: "/6-october",
  });
}

function Figure({
  image,
  locale,
  newTab,
  linkLabel,
  priority,
}: {
  image: SixOctoberImage;
  locale: Locale;
  newTab: string;
  linkLabel: string;
  priority?: boolean;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <Image
        src={image.src}
        alt={image.alt[locale]}
        width={image.width}
        height={image.height}
        sizes="(min-width: 64rem) 60rem, 100vw"
        priority={priority}
        className="w-full rounded-md bg-sunken"
      />
      <figcaption className="text-sm leading-relaxed text-muted">
        <span className="text-ink">{image.caption[locale]}</span> {image.credit[locale]}{" "}
        <ExternalLink
          href={image.source}
          newTabLabel={newTab}
          className="font-semibold text-brand-deep underline hover:text-brand-dark"
        >
          {linkLabel}
        </ExternalLink>
      </figcaption>
    </figure>
  );
}

export default async function SixOctoberPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const newTab = dict.a11y.newTab;
  const link = "font-semibold text-brand-deep underline hover:text-brand-dark";

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
      />

      <div className="wrap flex flex-col gap-12 py-10">
        <Notice variant="info" className="max-w-[var(--measure)]">
          {t.contentNote}
        </Notice>

        <section className="flex max-w-[var(--measure)] flex-col gap-4">
          <h2 className="font-display text-2xl">{t.remembranceHeading}</h2>
          {t.remembrance.map((p) => (
            <p key={p} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        <div className="max-w-5xl">
          <Figure
            image={images.gate}
            locale={locale}
            newTab={newTab}
            linkLabel={t.photoSource}
            priority
          />
        </div>

        <section className="flex max-w-[var(--measure)] flex-col gap-4">
          <h2 className="font-display text-2xl">{t.backgroundHeading}</h2>
          {t.background.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        <div className="grid max-w-5xl gap-8 md:grid-cols-2">
          <Figure image={images.scouts} locale={locale} newTab={newTab} linkLabel={t.photoSource} />
          <Figure image={images.rally} locale={locale} newTab={newTab} linkLabel={t.photoSource} />
        </div>

        <section className="flex max-w-[var(--measure)] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl">{t.timelineHeading}</h2>
            <p className="leading-relaxed text-muted">{t.timelineIntro}</p>
          </div>
          {t.days.map((day) => (
            <table key={day.heading} className="w-full border-collapse text-left">
              <caption className="pb-2 text-left font-semibold text-ink">{day.heading}</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">{t.timeCol}</th>
                  <th scope="col">{t.eventCol}</th>
                </tr>
              </thead>
              <tbody>
                {day.moments.map((m) => (
                  <tr key={m.time} className="border-t border-line align-top">
                    <th
                      scope="row"
                      className="w-24 py-3 pr-4 font-semibold whitespace-nowrap text-brand-deep tabular-nums"
                    >
                      {m.time}
                    </th>
                    <td className="py-3 leading-relaxed">{m.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </section>

        <div className="grid max-w-5xl gap-8 md:grid-cols-2">
          <Figure
            image={images.football}
            locale={locale}
            newTab={newTab}
            linkLabel={t.photoSource}
          />
          <Figure
            image={images.detained}
            locale={locale}
            newTab={newTab}
            linkLabel={t.photoSource}
          />
        </div>

        <section className="flex max-w-[var(--measure)] flex-col gap-4">
          <h2 className="font-display text-2xl">{t.afterHeading}</h2>
          {t.after.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="the-dead">
          <div className="flex max-w-[var(--measure)] flex-col gap-2">
            <h2 id="the-dead" className="font-display text-2xl">
              {t.deadHeading}
            </h2>
            <p className="leading-relaxed text-muted">{t.deadIntro}</p>
          </div>
          <dl className="grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
            {t.figures.map((f) => (
              <div
                key={f.label}
                className="flex flex-col-reverse gap-1 rounded-md border border-line bg-surface p-4"
              >
                <dt className="text-sm leading-snug text-muted">{f.label}</dt>
                <dd className="font-display text-3xl text-ink tabular-nums">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="max-w-[var(--measure)] text-sm leading-relaxed text-muted">
            {t.figuresNote}
          </p>

          <h3 className="font-display text-xl">{t.portraitsHeading}</h3>
          <ul className="grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">
            {portraits.map((p) => (
              <li key={p.href} className="flex flex-col gap-2">
                <Image
                  src={p.src}
                  alt=""
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 64rem) 15rem, (min-width: 40rem) 50vw, 100vw"
                  className="aspect-[4/5] w-full rounded-md bg-sunken object-cover"
                />
                <p className="font-semibold text-ink">{p.name[locale]}</p>
                <p className="text-sm leading-relaxed text-muted">{p.about[locale]}</p>
                <p className="text-xs leading-relaxed text-muted">
                  {p.credit[locale]}{" "}
                  <ExternalLink href={p.href} newTabLabel={newTab} className={link}>
                    {t.readMoreAbout} {p.name[locale]}
                  </ExternalLink>
                </p>
              </li>
            ))}
          </ul>

          <h3 className="font-display text-xl">{t.namesHeading}</h3>
          <p className="max-w-[var(--measure)] leading-relaxed text-muted">{t.namesIntro}</p>
          <ul
            lang="th"
            className="grid max-w-5xl grid-cols-1 gap-x-6 gap-y-2 font-thai sm:grid-cols-2 lg:grid-cols-3"
          >
            {victims.map((name) => (
              <li key={name} className="border-b border-line py-1">
                {name}
              </li>
            ))}
          </ul>
          <ul className="flex max-w-[var(--measure)] flex-col gap-1 text-muted">
            {t.unnamed.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
          <p className="text-sm">
            <ExternalLink href={`${DOCT6}/remember/victims`} newTabLabel={newTab} className={link}>
              {t.namesSource}
            </ExternalLink>
          </p>
        </section>

        <section className="flex max-w-[var(--measure)] flex-col gap-4">
          <h2 className="font-display text-2xl">{t.learnHeading}</h2>
          <p className="leading-relaxed">{t.learnIntro}</p>
          <ul className="flex flex-col gap-2">
            {t.learnLinks.map((l) => (
              <li key={l.href}>
                <ExternalLink href={l.href} newTabLabel={newTab} className={link}>
                  {l.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex max-w-[var(--measure)] flex-col gap-3 border-t border-line pt-8">
          <h2 className="font-display text-xl">{t.creditsHeading}</h2>
          <p className="text-sm leading-relaxed text-muted">{t.creditsIntro}</p>
          <p className="text-sm leading-relaxed text-muted">{t.creditsTerms}</p>
        </section>
      </div>
    </>
  );
}
