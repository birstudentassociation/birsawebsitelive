import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import {
  copy,
  hero,
  images,
  portraits,
  victims,
  DOCT6,
  type Quote,
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
  const base = buildMetadata({
    locale: lang,
    title: t.title,
    description: t.metaDescription,
    path: "/6-october",
  });
  const image = { url: "/6-october/og.jpg", width: 1200, height: 630, alt: hero.alt[lang] };
  return {
    ...base,
    openGraph: { ...base.openGraph, images: [image] },
    twitter: { ...base.twitter, card: "summary_large_image", images: [image.url] },
  };
}

const link = "text-current underline decoration-1 underline-offset-4 hover:decoration-2";

function Figure({
  image,
  locale,
  newTab,
  linkLabel,
}: {
  image: SixOctoberImage;
  locale: Locale;
  newTab: string;
  linkLabel: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <Image
        src={image.src}
        alt={image.alt[locale]}
        width={image.width}
        height={image.height}
        sizes="(min-width: 64rem) 30rem, 100vw"
        className="w-full bg-sunken"
      />
      <figcaption className="text-sm leading-relaxed text-muted">
        <span className="text-ink">{image.caption[locale]}</span> {image.credit[locale]}{" "}
        <ExternalLink href={image.source} newTabLabel={newTab} className={link}>
          {linkLabel}
        </ExternalLink>
      </figcaption>
    </figure>
  );
}

function PullQuote({
  quote,
  newTab,
  size = "md",
  onDark,
}: {
  quote: Quote;
  newTab: string;
  size?: "md" | "lg";
  onDark?: boolean;
}) {
  const quiet = onDark ? "text-white/75" : "text-muted";
  return (
    <figure className="flex flex-col gap-4">
      <blockquote cite={quote.href} className="flex flex-col gap-3">
        <p
          className={`font-display leading-snug text-balance ${
            size === "lg" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          {quote.text}
        </p>
        {quote.original ? (
          <p lang="th" className={`font-thai text-lg leading-relaxed ${quiet}`}>
            {quote.original}
          </p>
        ) : null}
      </blockquote>
      <figcaption className={`text-sm ${quiet}`}>
        <ExternalLink href={quote.href} newTabLabel={newTab} className={link}>
          {quote.cite}
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

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-[#0d0c0b] text-white">
        <Image
          src={hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/70 to-[#0d0c0b]/30"
        />
        <div className="wrap flex min-h-[34rem] flex-col justify-between gap-16 py-10 sm:min-h-[40rem]">
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            onDark
            items={[{ label: dict.site.name, href: "/" }, { label: t.breadcrumb }]}
          />
          <div className="flex max-w-3xl flex-col gap-5">
            <p className="text-sm tracking-[0.2em] text-white/80 uppercase">{t.eyebrow}</p>
            <h1 className="font-display text-5xl text-white sm:text-7xl">{t.title}</h1>
            <p className="max-w-[var(--measure)] text-lg leading-relaxed text-white/90 sm:text-xl">
              {t.lede}
            </p>
            <p className="max-w-[var(--measure)] border-l border-white/40 pl-4 text-sm leading-relaxed text-white/80">
              {t.contentNote}
            </p>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-white/75">
            {hero.caption[locale]} {hero.credit[locale]}{" "}
            <ExternalLink href={hero.source} newTabLabel={newTab} className={link}>
              {t.photoSource}
            </ExternalLink>
          </p>
        </div>
      </header>

      <div className="wrap flex flex-col gap-20 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <PullQuote quote={t.epigraph} newTab={newTab} size="lg" />
        </div>

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-5">
          <h2 className="font-display text-3xl">{t.remembranceHeading}</h2>
          {t.remembrance.map((p) => (
            <p key={p} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-5">
          <h2 className="font-display text-3xl">{t.backgroundHeading}</h2>
          {t.background.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </section>

        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2">
          <Figure image={images.scouts} locale={locale} newTab={newTab} linkLabel={t.photoSource} />
          <Figure image={images.rally} locale={locale} newTab={newTab} linkLabel={t.photoSource} />
        </div>

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-3xl">{t.timelineHeading}</h2>
            <p className="leading-relaxed text-muted">{t.timelineIntro}</p>
          </div>
          {t.days.map((day) => (
            <div key={day.heading} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold tracking-[0.15em] text-muted uppercase">
                {day.heading}
              </h3>
              <ol className="flex flex-col border-l border-line-strong">
                {day.moments.map((m) => (
                  <li
                    key={m.time}
                    className="relative flex flex-col gap-1 pb-6 pl-6 sm:flex-row sm:gap-6"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-2 -left-[5px] h-2.5 w-2.5 rounded-full border border-line-strong bg-cream"
                    />
                    <span className="w-24 shrink-0 font-semibold text-ink tabular-nums">
                      {m.time}
                    </span>
                    <span className="leading-relaxed">{m.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>

        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2">
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

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-5">
          <h2 className="font-display text-3xl">{t.afterHeading}</h2>
          {t.after.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
          <div className="mt-4 border-l-2 border-ink pl-6">
            <PullQuote quote={t.afterQuote} newTab={newTab} />
          </div>
        </section>
      </div>

      <section aria-labelledby="names" className="bg-[#0d0c0b] py-16 text-white sm:py-24">
        <div className="wrap flex flex-col gap-14">
          <div className="mx-auto flex max-w-3xl flex-col gap-8 text-center">
            <h2 id="names" className="font-display text-4xl text-white sm:text-5xl">
              {t.namesHeading}
            </h2>
            <PullQuote quote={t.namesQuote} newTab={newTab} onDark />
          </div>

          <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">
            {portraits.map((p) => (
              <li key={p.href} className="flex flex-col gap-3">
                <Image
                  src={p.src}
                  alt=""
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 64rem) 15rem, 50vw"
                  className="aspect-[4/5] w-full bg-white/5 object-cover"
                />
                <p className="font-display text-lg text-white">{p.name[locale]}</p>
                <p className="text-sm leading-relaxed text-white/80">{p.about[locale]}</p>
                <p className="text-xs leading-relaxed text-white/75">
                  {p.credit[locale]}{" "}
                  <ExternalLink href={p.href} newTabLabel={newTab} className={link}>
                    {t.readMoreAbout} {p.name[locale]}
                  </ExternalLink>
                </p>
              </li>
            ))}
          </ul>

          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <p className="mx-auto max-w-[var(--measure)] text-center leading-relaxed text-white/80">
              {t.namesIntro}
            </p>
            <ol className="grid grid-cols-1 border-t border-white/15 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
              {victims.map((v, i) => (
                <li
                  key={`${v.name}-${i}`}
                  className="flex flex-col gap-1 border-b border-white/15 py-4"
                >
                  <span lang="th" className="font-thai text-xl text-white">
                    {v.url ? (
                      <ExternalLink href={v.url} newTabLabel={newTab} className={link}>
                        {v.name}
                      </ExternalLink>
                    ) : (
                      v.name
                    )}
                  </span>
                  {v.age !== null || v.detail ? (
                    <span className="text-sm leading-relaxed text-white/75">
                      {[v.age !== null ? t.age(v.age) : null, v.detail?.[locale]]
                        .filter(Boolean)
                        .join(t.separator)}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="text-center text-sm text-white/75">
              <ExternalLink
                href={`${DOCT6}/remember/victims`}
                newTabLabel={newTab}
                className={link}
              >
                {t.namesSource}
              </ExternalLink>
            </p>
          </div>
        </div>
      </section>

      <div className="wrap flex flex-col gap-20 py-16 sm:py-24">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <div className="flex max-w-[var(--measure)] flex-col gap-3">
            <h2 className="font-display text-3xl">{t.deadHeading}</h2>
            <p className="leading-relaxed text-muted">{t.deadIntro}</p>
          </div>
          <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {t.figures.map((f) => (
              <div
                key={f.label}
                className="flex flex-col-reverse justify-end gap-2 border-b border-line py-6 pr-4"
              >
                <dt className="text-sm leading-snug text-muted">{f.label}</dt>
                <dd className="font-display text-5xl text-ink tabular-nums">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="max-w-[var(--measure)] text-sm leading-relaxed text-muted">
            {t.figuresNote}
          </p>
        </section>

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-6">
          <h2 className="font-display text-3xl">{t.whyHeading}</h2>
          {t.why.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
          <div className="border-l-2 border-ink pl-6">
            <PullQuote quote={t.whyQuote} newTab={newTab} />
          </div>
        </section>

        <p className="mx-auto max-w-3xl text-center font-display text-3xl text-balance sm:text-4xl">
          {t.closing}
        </p>

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-4">
          <h2 className="font-display text-2xl">{t.learnHeading}</h2>
          <p className="leading-relaxed">{t.learnIntro}</p>
          <ul className="flex flex-col gap-2">
            {t.learnLinks.map((l) => (
              <li key={l.href}>
                <ExternalLink
                  href={l.href}
                  newTabLabel={newTab}
                  className={`font-semibold ${link}`}
                >
                  {l.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-3 border-t border-line pt-8">
          <h2 className="font-display text-xl">{t.creditsHeading}</h2>
          <p className="text-sm leading-relaxed text-muted">{t.creditsIntro}</p>
          <p className="text-sm leading-relaxed text-muted">{t.creditsTerms}</p>
        </section>
      </div>
    </article>
  );
}
