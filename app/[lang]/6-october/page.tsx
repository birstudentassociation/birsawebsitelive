import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import ExternalLink from "@/components/ExternalLink";
import MemorialAudio from "@/components/MemorialAudio";
import MomentTime, { type Clock } from "./MomentTime";
import {
  copy,
  momentClock,
  hero,
  images,
  portraits,
  story,
  testimonies,
  victims,
  DOCT6,
  type Block,
  type Quote,
  type SixOctoberImage,
  type TestimonyKey,
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
  return buildMetadata({
    locale: lang,
    title: copy[lang].title,
    description: copy[lang].metaDescription,
    path: "/6-october",
    hasOwnShareImage: true,
  });
}

const link = "text-current underline decoration-1 underline-offset-4 hover:decoration-2";

const quoted = (text: string) => `\u201c${text}\u201d`;

function Figure({
  image,
  locale,
  newTab,
  linkLabel,
  sizes = "(min-width: 64rem) 30rem, 100vw",
}: {
  image: SixOctoberImage;
  locale: Locale;
  newTab: string;
  linkLabel: string;
  sizes?: string;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <Image
        src={image.src}
        alt={image.alt[locale]}
        width={image.width}
        height={image.height}
        sizes={sizes}
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
          className={`font-display leading-snug text-balance whitespace-pre-line ${
            size === "lg" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          {quoted(quote.text)}
        </p>
        {quote.original ? (
          <p
            lang="th"
            className={`font-thai text-lg leading-relaxed whitespace-pre-line italic ${quiet}`}
          >
            {quoted(quote.original)}
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

function TestimonyQuote({
  id,
  locale,
  newTab,
  centred,
}: {
  id: TestimonyKey;
  locale: Locale;
  newTab: string;
  centred?: boolean;
}) {
  const q = testimonies[id];
  return (
    <figure
      className={`flex flex-col gap-3 ${centred ? "items-center" : "border-l-2 border-ink pl-6"}`}
    >
      <blockquote cite={q.href} className="flex flex-col gap-3">
        <p
          lang={locale}
          className="font-display text-xl leading-snug text-balance text-ink sm:text-2xl"
        >
          {quoted(q[locale])}
        </p>
        {locale === "en" ? (
          <p lang="th" className="font-thai leading-relaxed text-muted italic">
            {quoted(q.th)}
          </p>
        ) : null}
      </blockquote>
      <figcaption className="text-sm text-muted">
        <ExternalLink href={q.href} newTabLabel={newTab} className={link}>
          {q.speaker[locale]}
        </ExternalLink>
      </figcaption>
    </figure>
  );
}

function StoryBlock({
  block,
  locale,
  newTab,
  photoSource,
  clocks,
  nowLabel,
}: {
  block: Block;
  locale: Locale;
  newTab: string;
  photoSource: string;
  clocks?: { clock: Clock; next: Clock | null };
  nowLabel: string;
}) {
  switch (block.kind) {
    case "moment":
      return (
        <div className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-1 sm:flex-row sm:gap-6">
          <MomentTime
            time={block.time[locale]}
            clock={clocks?.clock ?? { day: 0, minutes: 0 }}
            next={clocks?.next ?? null}
            nowLabel={nowLabel}
          />
          <p className="text-lg leading-relaxed">{block.text[locale]}</p>
        </div>
      );
    case "testimony":
      return (
        <div className="mx-auto w-full max-w-[var(--measure)]">
          <TestimonyQuote id={block.id} locale={locale} newTab={newTab} />
        </div>
      );
    case "photo":
      return (
        <div className={`mx-auto w-full ${block.wide ? "max-w-6xl" : "max-w-3xl"}`}>
          <Figure
            image={images[block.photo]}
            locale={locale}
            newTab={newTab}
            linkLabel={photoSource}
            sizes={
              block.wide ? "(min-width: 72rem) 72rem, 100vw" : "(min-width: 48rem) 48rem, 100vw"
            }
          />
        </div>
      );
    case "pair":
      return (
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2">
          {block.photos.map((p) => (
            <Figure
              key={p}
              image={images[p]}
              locale={locale}
              newTab={newTab}
              linkLabel={photoSource}
            />
          ))}
        </div>
      );
  }
}

export default async function SixOctoberPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const t = copy[locale];
  const newTab = dict.a11y.newTab;
  const moments = story.flatMap((chapter) =>
    chapter.blocks.flatMap((block, i) =>
      block.kind === "moment"
        ? [{ key: `${chapter.id}-${i}`, clock: momentClock(chapter.id, block.time.en) }]
        : []
    )
  );
  const later = (a: Clock, b: Clock) => a.day > b.day || (a.day === b.day && a.minutes > b.minutes);
  const clocks = new Map(
    moments.map((m) => [
      m.key,
      { clock: m.clock, next: moments.find((n) => later(n.clock, m.clock))?.clock ?? null },
    ])
  );

  return (
    <article className="six-october">
      <header className="relative isolate overflow-hidden bg-[#0d0c0b] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[28rem] sm:inset-0 sm:h-auto"
        >
          <Image
            src={hero.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[right_top] opacity-75 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/60 to-[#0d0c0b]/10 sm:via-[#0d0c0b]/75" />
        </div>
        <div className="wrap flex min-h-[40rem] flex-col justify-between gap-16 py-10 sm:min-h-[48rem]">
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            onDark
            items={[{ label: dict.site.name, href: "/" }, { label: t.breadcrumb }]}
          />
          <div className="mt-auto flex max-w-3xl flex-col gap-5">
            <p className="text-sm tracking-[0.2em] text-white/80 uppercase">{t.eyebrow}</p>
            <h1 className="font-display text-6xl leading-none text-balance text-white sm:text-8xl lg:text-9xl">
              {t.title}
            </h1>
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
              {t.heroSource}
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

        <div className="mx-auto w-full max-w-3xl">
          <Figure image={images.scouts} locale={locale} newTab={newTab} linkLabel={t.photoSource} />
        </div>

        <section aria-labelledby="story" className="flex flex-col gap-20">
          <div className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-3">
            <h2 id="story" className="font-display text-3xl">
              {t.storyHeading}
            </h2>
            <p className="leading-relaxed text-muted">{t.storyIntro}</p>
          </div>
          {story.map((chapter) => (
            <section
              key={chapter.id}
              aria-labelledby={`chapter-${chapter.id}`}
              className="flex flex-col gap-10"
            >
              <div className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-2 border-t border-line-strong pt-8">
                <p className="text-sm font-semibold tracking-[0.15em] text-muted uppercase">
                  {chapter.kicker[locale]}
                </p>
                <h3 id={`chapter-${chapter.id}`} className="font-display text-3xl sm:text-4xl">
                  {chapter.heading[locale]}
                </h3>
              </div>
              {chapter.blocks.map((block, i) => (
                <StoryBlock
                  key={`${chapter.id}-${i}`}
                  block={block}
                  locale={locale}
                  newTab={newTab}
                  photoSource={t.photoSource}
                  clocks={clocks.get(`${chapter.id}-${i}`)}
                  nowLabel={t.atThisHour}
                />
              ))}
            </section>
          ))}
        </section>

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

      <section
        id="names-section"
        aria-labelledby="names"
        className="bg-[#0d0c0b] py-16 text-white sm:py-24"
      >
        <MemorialAudio
          videoId="8jO4fd5KYNQ"
          sectionId="names-section"
          playLabel={t.playMusic}
          pauseLabel={t.pauseMusic}
        />
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
          {(["justice", "innocent", "heroes", "door"] as const).map((id) => (
            <TestimonyQuote key={id} id={id} locale={locale} newTab={newTab} />
          ))}
          <div className="border-l-2 border-ink pl-6">
            <PullQuote quote={t.whyQuote} newTab={newTab} />
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12 py-8 text-center">
          {(["cannotForget", "neverForgotten"] as const).map((id) => (
            <TestimonyQuote key={id} id={id} locale={locale} newTab={newTab} centred />
          ))}
          <p className="font-display text-4xl text-balance sm:text-5xl">{t.closing}</p>
        </section>

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

        <section
          aria-labelledby="walking-tour"
          className="mx-auto flex w-full max-w-[var(--measure)] flex-col gap-6"
        >
          <h2 id="walking-tour" className="font-display text-3xl">
            {t.walkingTour.heading}
          </h2>
          <p className="leading-relaxed">{t.walkingTour.intro}</p>
          <dl className="grid grid-cols-1 border-t border-line sm:grid-cols-[10rem_1fr]">
            {t.walkingTour.details.map((d) => (
              <div key={d.label} className="contents">
                <dt className="border-b border-line pt-4 text-sm font-semibold text-muted sm:pb-4">
                  {d.label}
                </dt>
                <dd className="border-b border-line pt-1 pb-4 leading-relaxed sm:pt-4">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
          <h3 className="font-display text-2xl">{t.walkingTour.stopsHeading}</h3>
          <ol className="flex list-decimal flex-col gap-4 pl-6 marker:font-semibold">
            {t.walkingTour.stops.map((stop) => (
              <li key={stop.place} className="leading-relaxed">
                <span className="font-semibold">{stop.place}</span>
                <br />
                {stop.about}
              </li>
            ))}
          </ol>
          <p className="leading-relaxed">{t.walkingTour.note}</p>
          <p className="text-sm text-muted">
            <ExternalLink href={t.walkingTour.sourceHref} newTabLabel={newTab} className={link}>
              {t.walkingTour.sourceLabel}
            </ExternalLink>
          </p>
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
