import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmergencyHero from "@/components/EmergencyHero";
import ExternalLink from "@/components/ExternalLink";
import GuideBlocks from "@/components/emergency/GuideBlocks";
import { guidePartPath, guideUiCopy } from "@/content/emergency/claims";
import type { EmergencyGuide, EmergencyScenario } from "@/content/emergency/types";
import { formatDate, getDictionary, localeHref, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  scenario: EmergencyScenario;
  guide: EmergencyGuide;
  index: number;
};

/**
 * One part of a multi-part guide, GOV.UK style: the guide title, a contents
 * list naming every part, the current part alone, then previous and next.
 */
export default function GuidePartPage({ locale, scenario, guide, index }: Props) {
  const dict = getDictionary(locale);
  const t = guideUiCopy[locale];
  const c = guide[locale];
  const part = c.parts[index]!;
  const total = c.parts.length;
  const href = (i: number) => localeHref(locale, guidePartPath(scenario.id, guide, i));
  const previous = index > 0 ? index - 1 : null;
  const next = index < total - 1 ? index + 1 : null;

  return (
    <>
      <EmergencyHero
        tone={scenario.hero}
        title={c.title}
        lede={c.summary}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            label={dict.a11y.breadcrumb}
            onDark
            items={[
              { label: dict.emergencyPage.breadcrumb, href: "/emergency" },
              { label: scenario[locale].title, href: `/emergency/${scenario.id}` },
              { label: c.title },
            ]}
          />
        }
      />
      <div className="wrap flex max-w-[var(--measure)] flex-col gap-10 py-10">
        <nav aria-labelledby="guide-contents" className="flex flex-col gap-3">
          <h2 id="guide-contents" className="text-sm font-semibold text-muted">
            {t.contents}
          </h2>
          <ol className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {c.parts.map((item, i) => (
              <li key={item.slug} className="flex gap-2 leading-snug">
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 text-right text-muted tabular-nums"
                >
                  {i + 1}.
                </span>
                {i === index ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {item.title}
                  </span>
                ) : (
                  <Link href={href(i)} className="text-brand-deep underline">
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <article aria-labelledby="part-title" className="flex flex-col gap-4">
          <p className="text-sm font-medium text-muted">{t.partOf(index + 1, total)}</p>
          <h2 id="part-title" className="font-display text-3xl">
            {part.title}
          </h2>
          <GuideBlocks blocks={part.blocks} locale={locale} newTabLabel={dict.a11y.newTab} />
        </article>

        <nav
          aria-label={t.partOf(index + 1, total)}
          className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between"
        >
          {previous !== null ? (
            <Link
              href={href(previous)}
              rel="prev"
              className="focus-halo group flex min-h-11 flex-col rounded sm:max-w-[45%]"
            >
              <span className="text-sm font-semibold text-muted">
                <span aria-hidden="true">&larr; </span>
                {t.previous}
              </span>
              <span className="text-brand-deep underline">{c.parts[previous]!.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next !== null ? (
            <Link
              href={href(next)}
              rel="next"
              className="focus-halo flex min-h-11 flex-col rounded sm:max-w-[45%] sm:items-end sm:text-right"
            >
              <span className="text-sm font-semibold text-muted">
                {t.next}
                <span aria-hidden="true"> &rarr;</span>
              </span>
              <span className="text-brand-deep underline">{c.parts[next]!.title}</span>
            </Link>
          ) : null}
        </nav>

        <footer className="flex flex-col gap-3 border-t border-line pt-6 text-sm leading-relaxed text-muted">
          <details>
            <summary className="focus-halo inline-flex min-h-11 cursor-pointer items-center font-semibold text-ink">
              {dict.emergencyPage.sources}
            </summary>
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5">
              {guide.sources.map((source) => (
                <li key={source.href}>
                  <ExternalLink
                    href={source.href}
                    newTabLabel={dict.a11y.newTab}
                    className="underline hover:text-brand-deep"
                  >
                    {source.label[locale]}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </details>
          <p>
            {dict.emergencyPage.reviewed} {formatDate(locale, guide.reviewed)}
          </p>
          <p>{dict.emergencyPage.disclaimer}</p>
        </footer>
      </div>
    </>
  );
}
